/*
  # Add Progress Tracking and Report Generation

  1. New Tables
    - `screening_sessions`
      - `id` (uuid, primary key) - Unique identifier for each screening session
      - `user_id` (uuid) - Links to auth.users for tracking across sessions
      - `child_name` (text) - Name of the child being screened
      - `child_age` (integer) - Age of child at time of screening
      - `condition_type` (text) - Which condition was screened (asd, adhd, etc.)
      - `scores` (jsonb) - Complete question responses and calculated scores
      - `recommendations` (jsonb) - Recommendations provided at that time
      - `notes` (text, optional) - Parent notes about the screening
      - `created_at` (timestamptz) - When the screening was completed
      - `updated_at` (timestamptz) - Last modification time

    - `reports`
      - `id` (uuid, primary key) - Unique identifier for each report
      - `session_id` (uuid) - Links to screening_sessions
      - `user_id` (uuid) - Links to auth.users
      - `report_data` (jsonb) - Complete report content for PDF generation
      - `shared_with` (text array) - Email addresses of providers shared with
      - `created_at` (timestamptz) - When report was generated
      - `last_accessed_at` (timestamptz) - Last time report was viewed

    - `progress_milestones`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - Links to auth.users
      - `session_id` (uuid) - Links to screening_sessions
      - `milestone_text` (text) - Description of the milestone
      - `achieved` (boolean) - Whether milestone was reached
      - `achieved_date` (timestamptz, optional) - When it was achieved
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all new tables
    - Users can only access their own screening sessions
    - Users can only view/create their own reports
    - Users can only track their own milestones

  3. Indexes
    - Index on user_id for fast lookups
    - Index on condition_type for filtering
    - Index on created_at for chronological ordering
*/

-- Create screening_sessions table
CREATE TABLE IF NOT EXISTS screening_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  child_name text NOT NULL,
  child_age integer NOT NULL,
  condition_type text NOT NULL,
  scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES screening_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  report_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  shared_with text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz DEFAULT now()
);

-- Create progress_milestones table
CREATE TABLE IF NOT EXISTS progress_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id uuid REFERENCES screening_sessions(id) ON DELETE CASCADE,
  milestone_text text NOT NULL,
  achieved boolean DEFAULT false,
  achieved_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE screening_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for screening_sessions
CREATE POLICY "Users can view own screening sessions"
  ON screening_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own screening sessions"
  ON screening_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own screening sessions"
  ON screening_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own screening sessions"
  ON screening_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for reports
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for progress_milestones
CREATE POLICY "Users can view own milestones"
  ON progress_milestones FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones"
  ON progress_milestones FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own milestones"
  ON progress_milestones FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own milestones"
  ON progress_milestones FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_screening_sessions_user_id ON screening_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_screening_sessions_condition_type ON screening_sessions(condition_type);
CREATE INDEX IF NOT EXISTS idx_screening_sessions_created_at ON screening_sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_session_id ON reports(session_id);

CREATE INDEX IF NOT EXISTS idx_progress_milestones_user_id ON progress_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_milestones_session_id ON progress_milestones(session_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_screening_sessions_updated_at
  BEFORE UPDATE ON screening_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();