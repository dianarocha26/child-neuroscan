import { supabase } from '../supabase';
import { logger } from '../logger';
import type { Tables } from '../../types/supabase';
import { check, DataError, requireUserId, unwrapList } from './client';

// Allowed values match the CHECK constraint in
// 20260220024439_create_photo_journal_schema.sql.
export type PhotoMediaType = 'photo' | 'video';

export type PhotoEntry = Omit<Tables<'photo_journal_entries'>, 'media_type'> & {
  media_type: PhotoMediaType;
  display_url?: string;
};

/** Fields the upload/edit form collects. */
export type PhotoEntryInput = {
  child_name: string;
  title: string;
  description: string;
  milestone_type: string;
  age_at_capture: string;
  linked_condition: string;
  tags: string[];
};

const BUCKET = 'photo-journal';

// photo_url holds the storage path; older rows hold a full public URL.
const storagePath = (photoUrl: string): string => {
  const marker = '/photo-journal/';
  const i = photoUrl.indexOf(marker);
  if (i === -1) return photoUrl;
  const path = photoUrl.slice(i + marker.length).split('?')[0];
  try { return decodeURIComponent(path); } catch { return path; }
};

const toPhotoEntry = (row: Tables<'photo_journal_entries'>): PhotoEntry => ({
  ...row,
  media_type: row.media_type as PhotoMediaType
});

export async function listPhotoEntries(): Promise<PhotoEntry[]> {
  const userId = await requireUserId();
  const rows = unwrapList(
    await supabase.from('photo_journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    'load photo journal entries'
  ).map(toPhotoEntry);

  // Bucket is private: resolve short-lived signed URLs for display
  const paths = rows.map(r => storagePath(r.photo_url));
  if (paths.length > 0) {
    const { data: signed, error: signError } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60);
    // Non-fatal: entries still list without a preview.
    if (signError) logger.error('Failed to sign photo URLs', signError);
    const byPath = new Map((signed ?? []).map(s => [s.path, s.signedUrl]));
    rows.forEach(r => { r.display_url = byPath.get(storagePath(r.photo_url)) ?? undefined; });
  }
  return rows;
}

export async function createPhotoEntry(file: File, input: PhotoEntryInput): Promise<void> {
  const userId = await requireUserId();

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(fileName, file);
  if (uploadError) throw new DataError('upload the photo', uploadError);

  const mediaType: PhotoMediaType = file.type.startsWith('video/') ? 'video' : 'photo';

  const insertResult = await supabase.from('photo_journal_entries').insert({
    user_id: userId,
    child_name: input.child_name,
    title: input.title,
    description: input.description,
    photo_url: fileName,
    media_type: mediaType,
    milestone_type: input.milestone_type,
    age_at_capture: input.age_at_capture,
    linked_condition: input.linked_condition,
    tags: input.tags
  });

  if (insertResult.error) {
    // Don't leave an orphaned file in storage if the row insert failed
    const { error: cleanupError } = await supabase.storage.from(BUCKET).remove([fileName]);
    if (cleanupError) logger.error('Failed to remove orphaned upload', cleanupError);
    throw new DataError('save the photo entry', insertResult.error);
  }
}

export async function updatePhotoEntry(id: string, input: PhotoEntryInput): Promise<void> {
  check(
    await supabase.from('photo_journal_entries').update({
      child_name: input.child_name,
      title: input.title,
      description: input.description,
      milestone_type: input.milestone_type,
      age_at_capture: input.age_at_capture,
      linked_condition: input.linked_condition,
      tags: input.tags
    }).eq('id', id),
    'update the entry'
  );
}

export async function deletePhotoEntry(entry: PhotoEntry): Promise<void> {
  // File first: if it can't be removed, keep the row so the user can retry
  // instead of leaving an orphaned child photo in storage.
  const { error: storageError } = await supabase.storage.from(BUCKET).remove([storagePath(entry.photo_url)]);
  if (storageError) throw new DataError('remove the photo file', storageError);

  check(await supabase.from('photo_journal_entries').delete().eq('id', entry.id), 'delete the entry');
}
