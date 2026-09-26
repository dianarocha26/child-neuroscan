import { supabase } from '../supabase';
import type { Tables } from '../../types/supabase';
import { check, unwrapList } from './client';
import { logger } from '../logger';

// PostgREST .or() filter syntax treats the string as a mini query language,
// so an unvalidated value could inject extra conditions. Age groups are a
// small fixed set (e.g. "0-3", "all"), so this is a conservative allowlist.
const SAFE_FILTER_VALUE = /^[a-z0-9_-]+$/i;

export type Video = Tables<'videos'> & {
  category: {
    name: string;
    icon: string | null;
  } | null;
  tags: string[];
  progress?: {
    watched: boolean;
    progress_seconds: number;
  };
};

export type VideoCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type VideoFilters = {
  condition: string;
  categoryId: string;
  ageGroup: string;
};

export async function listVideos(filters: VideoFilters, userId?: string): Promise<Video[]> {
  let query = supabase
    .from('videos')
    .select(`
      *,
      category:video_categories(name, icon),
      tags:video_tags(tag)
    `)
    .order('created_at', { ascending: false });

  if (filters.condition !== 'all') {
    query = query.eq('condition_type', filters.condition);
  }

  if (filters.categoryId !== 'all') {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters.ageGroup !== 'all' && SAFE_FILTER_VALUE.test(filters.ageGroup)) {
    query = query.or(`age_group.eq.${filters.ageGroup},age_group.eq.all`);
  }

  const rows = unwrapList(await query, 'load videos');
  const videosWithTags: Video[] = rows.map((video) => ({
    ...video,
    tags: video.tags?.map((t) => t.tag) || []
  }));

  if (userId) {
    const videoIds = videosWithTags.map((v: Video) => v.id);
    // Progress is a display nicety: an error here shouldn't hide the video list.
    const { data: progressData, error: progressError } = await supabase
      .from('user_video_progress')
      .select('video_id, watched, progress_seconds')
      .eq('user_id', userId)
      .in('video_id', videoIds);

    if (progressError) {
      logger.error('Error loading video progress:', progressError);
    }

    const progressMap = new Map(
      progressData?.map(p => [p.video_id, { watched: p.watched ?? false, progress_seconds: p.progress_seconds ?? 0 }])
    );

    videosWithTags.forEach((video: Video) => {
      video.progress = progressMap.get(video.id);
    });
  }

  return videosWithTags;
}

export async function listVideoCategories(): Promise<VideoCategory[]> {
  const rows = unwrapList(
    await supabase.from('video_categories').select('*').order('name'),
    'load video categories'
  );
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description ?? '',
    icon: c.icon ?? ''
  }));
}

export async function recordVideoView(videoId: string, currentViews: number): Promise<void> {
  check(
    await supabase.from('videos').update({ views: currentViews + 1 }).eq('id', videoId),
    'record the video view'
  );
}

export async function startVideoProgress(userId: string, videoId: string): Promise<void> {
  check(
    await supabase.from('user_video_progress').upsert({
      user_id: userId,
      video_id: videoId,
      watched: false,
      progress_seconds: 0,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,video_id'
    }),
    'start tracking video progress'
  );
}

export async function markVideoWatched(userId: string, videoId: string): Promise<void> {
  check(
    await supabase.from('user_video_progress').upsert({
      user_id: userId,
      video_id: videoId,
      watched: true,
      progress_seconds: 0,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,video_id'
    }),
    'mark the video as watched'
  );
}
