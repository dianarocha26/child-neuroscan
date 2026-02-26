/*
  # Photo Journal Schema
  
  1. New Tables
    - `photo_journal_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `child_name` (text) - Child's name for multi-child support later
      - `title` (text) - Entry title/caption
      - `description` (text) - Detailed description
      - `photo_url` (text) - URL to stored image/video
      - `media_type` (text) - 'photo' or 'video'
      - `milestone_type` (text) - Type of milestone being documented
      - `age_at_capture` (text) - Child's age when captured
      - `linked_condition` (text) - Related condition if any
      - `linked_goal_id` (uuid, nullable) - Link to specific goal
      - `tags` (text[]) - Searchable tags
      - `created_at` (timestamptz)
      
  2. Storage
    - Create storage bucket for photos/videos
    - Configure public access for media files
    
  3. Security
    - Enable RLS on `photo_journal_entries` table
    - Add policies for authenticated users to manage their own entries
*/

-- Create photo journal entries table
CREATE TABLE IF NOT EXISTS photo_journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  child_name text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  photo_url text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('photo', 'video')),
  milestone_type text DEFAULT '',
  age_at_capture text DEFAULT '',
  linked_condition text DEFAULT '',
  linked_goal_id uuid,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE photo_journal_entries ENABLE ROW LEVEL SECURITY;

-- Policies for photo journal entries
CREATE POLICY "Users can view own photo journal entries"
  ON photo_journal_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own photo journal entries"
  ON photo_journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photo journal entries"
  ON photo_journal_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own photo journal entries"
  ON photo_journal_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public)
VALUES ('photo-journal', 'photo-journal', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'photo-journal' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'photo-journal' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'photo-journal' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_photo_journal_user_id ON photo_journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_journal_created_at ON photo_journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photo_journal_tags ON photo_journal_entries USING gin(tags);