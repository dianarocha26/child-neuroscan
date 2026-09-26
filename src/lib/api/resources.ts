import { supabase } from '../supabase';
import type { Tables } from '../../types/supabase';
import { check, unwrapList } from './client';

// Allowed values match the CHECK constraint in
// 20260220001939_create_therapy_resources_schema.sql.
export type ResourceType = 'therapist' | 'clinic' | 'online_resource' | 'support_group' | 'educational_program';

export type TherapyResource = Omit<Tables<'therapy_resources'>, 'resource_type'> & { resource_type: ResourceType };
export type SavedResource = Tables<'user_saved_resources'>;

const toResource = (row: Tables<'therapy_resources'>): TherapyResource => ({
  ...row,
  resource_type: row.resource_type as ResourceType
});

export async function listResources(): Promise<TherapyResource[]> {
  const rows = unwrapList(
    await supabase.from('therapy_resources').select('*').order('rating', { ascending: false }),
    'load resources'
  );
  return rows.map(toResource);
}

export async function listSavedResources(userId: string): Promise<SavedResource[]> {
  return unwrapList(
    await supabase.from('user_saved_resources').select('*').eq('user_id', userId),
    'load saved resources'
  );
}

export async function saveResource(userId: string, resourceId: string): Promise<void> {
  check(
    await supabase.from('user_saved_resources').insert({ user_id: userId, resource_id: resourceId }),
    'save the resource'
  );
}

export async function deleteSavedResource(id: string): Promise<void> {
  check(await supabase.from('user_saved_resources').delete().eq('id', id), 'remove the saved resource');
}

export async function markResourceContacted(id: string): Promise<void> {
  check(
    await supabase.from('user_saved_resources').update({
      contacted: true,
      contacted_date: new Date().toISOString()
    }).eq('id', id),
    'mark the resource as contacted'
  );
}
