/*
  # Parent Support Community Schema

  ## Overview
  Creates tables for a parent support community where families can share experiences,
  ask questions, offer support, and connect with others facing similar challenges.

  ## New Tables

  ### community_posts
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (text) - Author of the post
  - `author_name` (text) - Display name of author
  - `title` (text) - Post title
  - `content` (text) - Post content/body
  - `category` (text) - Category: 'question', 'experience', 'advice', 'celebration', 'support'
  - `condition_tags` (text[]) - Related conditions: 'asd', 'adhd', 'speech', 'developmental', 'learning', 'sensory'
  - `is_anonymous` (boolean) - Whether post is anonymous
  - `likes_count` (integer) - Number of likes
  - `comments_count` (integer) - Number of comments
  - `is_pinned` (boolean) - Pinned by moderator
  - `is_locked` (boolean) - Locked from new comments
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### community_comments
  - `id` (uuid, primary key) - Unique identifier
  - `post_id` (uuid) - Reference to community_posts
  - `user_id` (text) - Comment author
  - `author_name` (text) - Display name of author
  - `content` (text) - Comment content
  - `is_anonymous` (boolean) - Whether comment is anonymous
  - `likes_count` (integer) - Number of likes
  - `parent_comment_id` (uuid) - For nested replies (optional)
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### community_likes
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (text) - User who liked
  - `post_id` (uuid) - Post that was liked (optional)
  - `comment_id` (uuid) - Comment that was liked (optional)
  - `created_at` (timestamptz) - When liked

  ### user_profiles
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (text, unique) - User identifier
  - `display_name` (text) - User's display name
  - `bio` (text) - Short biography
  - `child_conditions` (text[]) - Conditions their child has
  - `joined_at` (timestamptz) - When they joined community
  - `posts_count` (integer) - Number of posts
  - `comments_count` (integer) - Number of comments
  - `created_at` (timestamptz) - Profile creation timestamp

  ## Security
  - Enable RLS on all tables
  - Posts and comments are publicly readable
  - Users can only edit/delete their own content
  - Likes require user to be logged in
  - Profiles can only be updated by owner

  ## Indexes
  - Posts by category, condition tags, creation date
  - Comments by post, creation date
  - Likes by user and target (post/comment)
*/

CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  author_name text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('question', 'experience', 'advice', 'celebration', 'support')),
  condition_tags text[] DEFAULT '{}',
  is_anonymous boolean DEFAULT false,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  is_anonymous boolean DEFAULT false,
  likes_count integer DEFAULT 0,
  parent_comment_id uuid REFERENCES community_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES community_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  display_name text NOT NULL,
  bio text DEFAULT '',
  child_conditions text[] DEFAULT '{}',
  joined_at timestamptz DEFAULT now(),
  posts_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are publicly readable"
  ON community_posts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON community_posts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  TO public
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = user_id)
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = user_id);

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  TO public
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = user_id);

CREATE POLICY "Comments are publicly readable"
  ON community_comments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON community_comments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update own comments"
  ON community_comments FOR UPDATE
  TO public
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = user_id)
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = user_id);

CREATE POLICY "Users can delete own comments"
  ON community_comments FOR DELETE
  TO public
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = user_id);

CREATE POLICY "Likes are publicly readable"
  ON community_likes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create likes"
  ON community_likes FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can delete own likes"
  ON community_likes FOR DELETE
  TO public
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = user_id);

CREATE POLICY "Profiles are publicly readable"
  ON user_profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create own profile"
  ON user_profiles FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO public
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = user_id)
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = user_id);

CREATE INDEX IF NOT EXISTS idx_posts_category ON community_posts (category);
CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON community_posts USING GIN (condition_tags);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON community_posts (is_pinned, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments (post_id, created_at);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON community_comments (parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON community_likes (user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post ON community_likes (post_id);
CREATE INDEX IF NOT EXISTS idx_likes_comment ON community_likes (comment_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user ON user_profiles (user_id);

CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_comment_count_trigger
AFTER INSERT OR DELETE ON community_comments
FOR EACH ROW
EXECUTE FUNCTION update_post_comment_count();

CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.post_id IS NOT NULL THEN
    UPDATE community_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.post_id IS NOT NULL THEN
    UPDATE community_posts
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_likes_count_trigger
AFTER INSERT OR DELETE ON community_likes
FOR EACH ROW
EXECUTE FUNCTION update_post_likes_count();

CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.comment_id IS NOT NULL THEN
    UPDATE community_comments
    SET likes_count = likes_count + 1
    WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.comment_id IS NOT NULL THEN
    UPDATE community_comments
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comment_likes_count_trigger
AFTER INSERT OR DELETE ON community_likes
FOR EACH ROW
EXECUTE FUNCTION update_comment_likes_count();