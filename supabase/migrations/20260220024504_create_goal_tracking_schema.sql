/*
  # Goal Tracking Schema
  
  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `child_name` (text) - Child's name
      - `title` (text) - Goal title (e.g., "Use 50 words")
      - `description` (text) - Detailed goal description
      - `category` (text) - speech, motor, social, behavioral, academic, self-care
      - `linked_condition` (text) - Related condition
      - `target_value` (numeric) - Goal target (e.g., 50 for "50 words")
      - `current_value` (numeric) - Current progress value
      - `unit` (text) - Unit of measurement (words, minutes, times per day, etc.)
      - `target_date` (date) - When goal should be achieved
      - `status` (text) - not_started, in_progress, achieved, archived
      - `priority` (text) - low, medium, high
      - `notes` (text) - Additional notes
      - `created_at` (timestamptz)
      - `completed_at` (timestamptz, nullable)
      
    - `goal_progress_logs`
      - `id` (uuid, primary key)
      - `goal_id` (uuid, references goals)
      - `user_id` (uuid, references auth.users)
      - `value` (numeric) - Progress value at this log
      - `notes` (text) - Notes about this progress update
      - `logged_at` (timestamptz)
      
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  child_name text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL CHECK (category IN ('speech', 'motor', 'social', 'behavioral', 'academic', 'self-care')),
  linked_condition text DEFAULT '',
  target_value numeric NOT NULL DEFAULT 0,
  current_value numeric NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'count',
  target_date date,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'achieved', 'archived')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create goal progress logs table
CREATE TABLE IF NOT EXISTS goal_progress_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  value numeric NOT NULL,
  notes text DEFAULT '',
  logged_at timestamptz DEFAULT now()
);

-- Enable RLS on goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Policies for goals
CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable RLS on goal progress logs
ALTER TABLE goal_progress_logs ENABLE ROW LEVEL SECURITY;

-- Policies for goal progress logs
CREATE POLICY "Users can view own goal progress logs"
  ON goal_progress_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goal progress logs"
  ON goal_progress_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goal progress logs"
  ON goal_progress_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goal progress logs"
  ON goal_progress_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_target_date ON goals(target_date);
CREATE INDEX IF NOT EXISTS idx_goal_progress_logs_goal_id ON goal_progress_logs(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_progress_logs_logged_at ON goal_progress_logs(logged_at DESC);