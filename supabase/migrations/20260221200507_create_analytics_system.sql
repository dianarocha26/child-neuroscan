/*
  # Create Analytics and Insights System

  ## Overview
  This migration creates a comprehensive analytics system that processes behavioral, medication, 
  and activity data to identify patterns, correlations, and actionable insights for parents.

  ## New Tables
  
  ### `analytics_behavior_patterns`
  Stores identified behavioral patterns and trends over time
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `pattern_type` (text) - e.g., 'time_of_day', 'day_of_week', 'trigger_based'
  - `behavior_category` (text) - e.g., 'meltdown', 'positive_behavior', 'sensory_issue'
  - `frequency` (integer) - how many times this pattern occurred
  - `time_range_start` (timestamptz)
  - `time_range_end` (timestamptz)
  - `insights` (jsonb) - detailed pattern data and correlations
  - `created_at` (timestamptz)

  ### `analytics_correlations`
  Tracks correlations between different factors (medication, triggers, time, etc.)
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `factor_a` (text) - first factor (e.g., 'medication_missed')
  - `factor_b` (text) - second factor (e.g., 'behavior_meltdown')
  - `correlation_strength` (numeric) - -1 to 1 correlation coefficient
  - `occurrences` (integer) - number of co-occurrences
  - `date_range_start` (timestamptz)
  - `date_range_end` (timestamptz)
  - `metadata` (jsonb) - additional correlation details
  - `created_at` (timestamptz)

  ### `analytics_weekly_summaries`
  Pre-computed weekly summaries for quick dashboard loading
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `week_start_date` (date)
  - `week_end_date` (date)
  - `total_behaviors` (integer)
  - `positive_behaviors` (integer)
  - `challenging_behaviors` (integer)
  - `medication_adherence_rate` (numeric) - percentage
  - `therapy_sessions_attended` (integer)
  - `top_triggers` (jsonb) - array of most common triggers
  - `mood_average` (numeric)
  - `insights_summary` (text)
  - `created_at` (timestamptz)

  ### `analytics_trigger_analysis`
  Detailed analysis of behavioral triggers
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `trigger_name` (text)
  - `total_occurrences` (integer)
  - `successful_strategies` (jsonb) - strategies that worked
  - `time_patterns` (jsonb) - when this trigger is most common
  - `severity_distribution` (jsonb) - mild/moderate/severe counts
  - `last_updated` (timestamptz)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all analytics tables
  - Users can only view their own analytics data
  - Policies ensure data isolation per user

  ## Notes
  - Analytics are computed from existing behavior_diary, medication_tracker, and other tracking tables
  - This schema supports real-time dashboard updates and historical analysis
  - Correlations help parents identify what factors influence behavior
*/

-- Create analytics_behavior_patterns table
CREATE TABLE IF NOT EXISTS analytics_behavior_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pattern_type text NOT NULL,
  behavior_category text NOT NULL,
  frequency integer DEFAULT 0,
  time_range_start timestamptz NOT NULL,
  time_range_end timestamptz NOT NULL,
  insights jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_behavior_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own behavior patterns"
  ON analytics_behavior_patterns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own behavior patterns"
  ON analytics_behavior_patterns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own behavior patterns"
  ON analytics_behavior_patterns FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own behavior patterns"
  ON analytics_behavior_patterns FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create analytics_correlations table
CREATE TABLE IF NOT EXISTS analytics_correlations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  factor_a text NOT NULL,
  factor_b text NOT NULL,
  correlation_strength numeric DEFAULT 0,
  occurrences integer DEFAULT 0,
  date_range_start timestamptz NOT NULL,
  date_range_end timestamptz NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_correlations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own correlations"
  ON analytics_correlations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own correlations"
  ON analytics_correlations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own correlations"
  ON analytics_correlations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own correlations"
  ON analytics_correlations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create analytics_weekly_summaries table
CREATE TABLE IF NOT EXISTS analytics_weekly_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start_date date NOT NULL,
  week_end_date date NOT NULL,
  total_behaviors integer DEFAULT 0,
  positive_behaviors integer DEFAULT 0,
  challenging_behaviors integer DEFAULT 0,
  medication_adherence_rate numeric DEFAULT 0,
  therapy_sessions_attended integer DEFAULT 0,
  top_triggers jsonb DEFAULT '[]'::jsonb,
  mood_average numeric DEFAULT 0,
  insights_summary text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_weekly_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weekly summaries"
  ON analytics_weekly_summaries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly summaries"
  ON analytics_weekly_summaries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly summaries"
  ON analytics_weekly_summaries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weekly summaries"
  ON analytics_weekly_summaries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create analytics_trigger_analysis table
CREATE TABLE IF NOT EXISTS analytics_trigger_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trigger_name text NOT NULL,
  total_occurrences integer DEFAULT 0,
  successful_strategies jsonb DEFAULT '[]'::jsonb,
  time_patterns jsonb DEFAULT '{}'::jsonb,
  severity_distribution jsonb DEFAULT '{}'::jsonb,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_trigger_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trigger analysis"
  ON analytics_trigger_analysis FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trigger analysis"
  ON analytics_trigger_analysis FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trigger analysis"
  ON analytics_trigger_analysis FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trigger analysis"
  ON analytics_trigger_analysis FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_behavior_patterns_user_id ON analytics_behavior_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_behavior_patterns_date_range ON analytics_behavior_patterns(time_range_start, time_range_end);

CREATE INDEX IF NOT EXISTS idx_correlations_user_id ON analytics_correlations(user_id);

CREATE INDEX IF NOT EXISTS idx_weekly_summaries_user_id ON analytics_weekly_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_dates ON analytics_weekly_summaries(week_start_date, week_end_date);

CREATE INDEX IF NOT EXISTS idx_trigger_analysis_user_id ON analytics_trigger_analysis(user_id);