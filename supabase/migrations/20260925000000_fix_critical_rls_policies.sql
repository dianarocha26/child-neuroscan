/*
  # Fix critical RLS holes (security audit, 2026-09)

  Several early policies granted access to everyone, including
  unauthenticated visitors using the public anon key:
    - community_posts / community_comments / community_likes: UPDATE/DELETE
      used `... OR user_id = user_id` (always true) and INSERT used
      `WITH CHECK (true)` for role `public`.
    - user_profiles: world-readable (incl. child_conditions) and
      world-writable.
    - user_saved_resources: full read/write for everyone.
    - photo-journal storage bucket: public, so any child photo URL was
      readable without auth.
    - community_group_members: users could join any group (incl. private)
      as 'admin', and the SELECT policies were mutually recursive.

  1. Community tables: authenticated only; users write only their own rows;
     moderation/counter columns can no longer be set by clients (column
     grants); counter triggers run as SECURITY DEFINER so they still work.
  2. user_profiles: users read/write only their own profile.
  3. user_saved_resources: owner-only.
  4. photo-journal bucket: private (app now uses signed URLs).
  5. Groups: join as 'member' of public, open groups only; recursion removed
     via a SECURITY DEFINER helper.
  6. handle_new_user: pin search_path.

  user_id stays `text` in the community tables (sample seed rows use
  non-uuid ids), compared as auth.uid()::text.
*/

-- ---------------------------------------------------------------------------
-- 1. Community posts / comments / likes
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Posts are publicly readable" ON community_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;

DROP POLICY IF EXISTS "Comments are publicly readable" ON community_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON community_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON community_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON community_comments;

DROP POLICY IF EXISTS "Likes are publicly readable" ON community_likes;
DROP POLICY IF EXISTS "Users can create likes" ON community_likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON community_likes;

CREATE POLICY "Signed-in users can read visible posts"
  ON community_posts FOR SELECT TO authenticated
  USING (NOT coalesce(is_hidden, false) OR user_id = auth.uid()::text);

CREATE POLICY "Users can create own posts"
  ON community_posts FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Signed-in users can read comments"
  ON community_comments FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create own comments"
  ON community_comments FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own comments"
  ON community_comments FOR UPDATE TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own comments"
  ON community_comments FOR DELETE TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Signed-in users can read likes"
  ON community_likes FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create own likes"
  ON community_likes FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own likes"
  ON community_likes FOR DELETE TO authenticated
  USING (user_id = auth.uid()::text);

-- Clients may only write content columns; pin/lock/hide/counters are
-- reserved for triggers and moderators (service role).
REVOKE ALL ON community_posts, community_comments, community_likes FROM anon;
REVOKE INSERT, UPDATE ON community_posts FROM authenticated;
REVOKE INSERT, UPDATE ON community_comments FROM authenticated;
REVOKE INSERT, UPDATE ON community_likes FROM authenticated;

GRANT INSERT (user_id, author_name, title, content, category, condition_tags, is_anonymous)
  ON community_posts TO authenticated;
GRANT UPDATE (author_name, title, content, category, condition_tags, is_anonymous, updated_at)
  ON community_posts TO authenticated;

GRANT INSERT (post_id, user_id, author_name, content, is_anonymous, parent_comment_id)
  ON community_comments TO authenticated;
GRANT UPDATE (author_name, content, is_anonymous, updated_at)
  ON community_comments TO authenticated;

GRANT INSERT (user_id, post_id, comment_id) ON community_likes TO authenticated;

-- Counter triggers update other users' rows, so they must bypass RLS.
ALTER FUNCTION update_post_comment_count() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION update_post_likes_count() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION update_comment_likes_count() SECURITY DEFINER SET search_path = public;

-- ---------------------------------------------------------------------------
-- 2. user_profiles (contains child_conditions -> owner only)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Profiles are publicly readable" ON user_profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

REVOKE ALL ON user_profiles FROM anon;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create own profile"
  ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

-- ---------------------------------------------------------------------------
-- 3. user_saved_resources
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own saved resources" ON user_saved_resources;
DROP POLICY IF EXISTS "Users can save resources" ON user_saved_resources;
DROP POLICY IF EXISTS "Users can update own saved resources" ON user_saved_resources;
DROP POLICY IF EXISTS "Users can delete own saved resources" ON user_saved_resources;

REVOKE ALL ON user_saved_resources FROM anon;

CREATE POLICY "Users can view own saved resources"
  ON user_saved_resources FOR SELECT TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can save resources"
  ON user_saved_resources FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own saved resources"
  ON user_saved_resources FOR UPDATE TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own saved resources"
  ON user_saved_resources FOR DELETE TO authenticated
  USING (user_id = auth.uid()::text);

-- ---------------------------------------------------------------------------
-- 4. Photo journal bucket -> private, images/videos only, 50 MB max
-- ---------------------------------------------------------------------------
UPDATE storage.buckets
SET public = false,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/*', 'video/*']
WHERE id = 'photo-journal';

-- ---------------------------------------------------------------------------
-- 5. Community groups: no self-promotion, no recursion
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_group_member(gid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM community_group_members
    WHERE group_id = gid AND user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_group_member(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_group_member(uuid) TO authenticated;

DROP POLICY IF EXISTS "Anyone can view public groups" ON community_groups;
CREATE POLICY "Anyone can view public groups"
  ON community_groups FOR SELECT TO authenticated
  USING (NOT is_private OR public.is_group_member(id));

DROP POLICY IF EXISTS "Members can view group membership" ON community_group_members;
CREATE POLICY "Members can view group membership"
  ON community_group_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_group_member(group_id));

DROP POLICY IF EXISTS "Users can join groups" ON community_group_members;
CREATE POLICY "Users can join groups"
  ON community_group_members FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND role = 'member'
    AND EXISTS (
      SELECT 1 FROM community_groups g
      WHERE g.id = group_id AND NOT g.is_private AND NOT g.requires_approval
    )
  );

-- ---------------------------------------------------------------------------
-- 6. Pin search_path on the existing SECURITY DEFINER function
-- ---------------------------------------------------------------------------
ALTER FUNCTION public.handle_new_user() SET search_path = public;
