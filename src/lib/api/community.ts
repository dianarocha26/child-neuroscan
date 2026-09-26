import { supabase } from '../supabase';
import type { Tables } from '../../types/supabase';
import { check, unwrapList, unwrapMaybe } from './client';

// Allowed values match the CHECK constraint in
// 20260220002527_create_community_schema.sql.
export type PostCategory = 'question' | 'experience' | 'advice' | 'celebration' | 'support';

export type Post = Omit<Tables<'community_posts'>, 'category'> & { category: PostCategory };
export type Comment = Tables<'community_comments'>;
export type LikeRef = Pick<Tables<'community_likes'>, 'post_id' | 'comment_id'>;

export type NewPostInput = {
  user_id: string;
  author_name: string;
  title: string;
  content: string;
  category: PostCategory;
  condition_tags: string[];
};

export type NewCommentInput = {
  post_id: string;
  user_id: string;
  author_name: string;
  content: string;
  is_anonymous: boolean;
};

const toPost = (row: Tables<'community_posts'>): Post => ({ ...row, category: row.category as PostCategory });

export async function listPosts(sortBy: 'recent' | 'popular'): Promise<Post[]> {
  let query = supabase.from('community_posts').select('*');

  if (sortBy === 'recent') {
    query = query.order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
  } else {
    query = query.order('is_pinned', { ascending: false }).order('likes_count', { ascending: false });
  }

  const rows = unwrapList(await query, 'load community posts');
  return rows.map(toPost);
}

export async function listComments(postId: string): Promise<Comment[]> {
  return unwrapList(
    await supabase.from('community_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true }),
    'load comments'
  );
}

export async function listUserLikes(userId: string): Promise<LikeRef[]> {
  return unwrapList(
    await supabase.from('community_likes').select('post_id, comment_id').eq('user_id', userId),
    'load likes'
  );
}

export async function addLike(userId: string, postId?: string, commentId?: string): Promise<void> {
  check(
    await supabase.from('community_likes').insert({
      user_id: userId,
      post_id: postId || null,
      comment_id: commentId || null
    }),
    'like the post'
  );
}

export async function removeLike(userId: string, postId?: string, commentId?: string): Promise<void> {
  let query = supabase.from('community_likes').delete().eq('user_id', userId);
  if (postId) query = query.eq('post_id', postId);
  if (commentId) query = query.eq('comment_id', commentId);
  check(await query, 'unlike the post');
}

/** The signed-in user's community display name, or null if they have no profile yet. */
export async function getDisplayName(userId: string): Promise<string | null> {
  const row = unwrapMaybe<{ display_name: string }>(
    await supabase.from('user_profiles').select('display_name').eq('user_id', userId).maybeSingle(),
    'load the display name'
  );
  return row?.display_name ?? null;
}

export async function createPost(input: NewPostInput): Promise<void> {
  check(
    await supabase.from('community_posts').insert({ ...input, is_anonymous: false }),
    'create the post'
  );
}

export async function createComment(input: NewCommentInput): Promise<void> {
  check(await supabase.from('community_comments').insert(input), 'post the comment');
}
