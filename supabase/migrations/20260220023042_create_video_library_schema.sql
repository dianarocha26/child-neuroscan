/*
  # Create Video Library Schema

  1. New Tables
    - `video_categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name (e.g., "Speech Therapy", "Occupational Therapy")
      - `description` (text) - Category description
      - `icon` (text) - Icon identifier
      - `created_at` (timestamptz)
    
    - `videos`
      - `id` (uuid, primary key)
      - `title` (text) - Video title
      - `description` (text) - Video description
      - `video_url` (text) - YouTube or video platform URL
      - `thumbnail_url` (text) - Thumbnail image URL
      - `duration` (integer) - Duration in seconds
      - `condition_type` (text) - Related condition (asd, adhd, speech, etc.)
      - `age_group` (text) - Target age group (0-3, 3-5, 5-12, 12+)
      - `category_id` (uuid, foreign key to video_categories)
      - `difficulty_level` (text) - beginner, intermediate, advanced
      - `views` (integer) - View count
      - `created_at` (timestamptz)
    
    - `video_tags`
      - `id` (uuid, primary key)
      - `video_id` (uuid, foreign key to videos)
      - `tag` (text) - Tag for searching/filtering
      - `created_at` (timestamptz)
    
    - `user_video_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - User who watched
      - `video_id` (uuid, foreign key to videos)
      - `watched` (boolean) - Whether video was watched
      - `progress_seconds` (integer) - How far into video
      - `completed_at` (timestamptz) - When completed
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for video content
    - Authenticated users can track their progress
    - Users can only modify their own progress records
*/

-- Create video_categories table
CREATE TABLE IF NOT EXISTS video_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'video',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE video_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view video categories"
  ON video_categories FOR SELECT
  TO public
  USING (true);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  video_url text NOT NULL,
  thumbnail_url text DEFAULT '',
  duration integer DEFAULT 0,
  condition_type text NOT NULL,
  age_group text DEFAULT 'all',
  category_id uuid REFERENCES video_categories(id) ON DELETE SET NULL,
  difficulty_level text DEFAULT 'beginner',
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos"
  ON videos FOR SELECT
  TO public
  USING (true);

-- Create video_tags table
CREATE TABLE IF NOT EXISTS video_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE video_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view video tags"
  ON video_tags FOR SELECT
  TO public
  USING (true);

-- Create user_video_progress table
CREATE TABLE IF NOT EXISTS user_video_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  watched boolean DEFAULT false,
  progress_seconds integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

ALTER TABLE user_video_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own video progress"
  ON user_video_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video progress"
  ON user_video_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video progress"
  ON user_video_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_videos_condition_type ON videos(condition_type);
CREATE INDEX IF NOT EXISTS idx_videos_category_id ON videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_age_group ON videos(age_group);
CREATE INDEX IF NOT EXISTS idx_video_tags_video_id ON video_tags(video_id);
CREATE INDEX IF NOT EXISTS idx_video_tags_tag ON video_tags(tag);
CREATE INDEX IF NOT EXISTS idx_user_video_progress_user_id ON user_video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_video_progress_video_id ON user_video_progress(video_id);