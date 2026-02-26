/*
  # Behavior Diary System

  1. New Tables
    - behavior_entries: Track daily behavior incidents with triggers and interventions
    - behavior_triggers: Custom triggers library for each user
    - behavior_interventions: Custom interventions library for each user

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS behavior_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  child_name text NOT NULL,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  entry_time time NOT NULL DEFAULT CURRENT_TIME,
  behavior_type text NOT NULL,
  severity integer NOT NULL CHECK (severity >= 1 AND severity <= 5),
  duration_minutes integer,
  location text,
  triggers text[] DEFAULT '{}',
  antecedents text,
  consequences text,
  interventions_used text[] DEFAULT '{}',
  effectiveness integer CHECK (effectiveness >= 1 AND effectiveness <= 5),
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS behavior_triggers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  trigger_name text NOT NULL,
  trigger_category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, trigger_name)
);

CREATE TABLE IF NOT EXISTS behavior_interventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  intervention_name text NOT NULL,
  intervention_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, intervention_name)
);

-- Enable RLS
ALTER TABLE behavior_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_interventions ENABLE ROW LEVEL SECURITY;

-- Policies for behavior_entries
CREATE POLICY "Users can view own behavior entries"
  ON behavior_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own behavior entries"
  ON behavior_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own behavior entries"
  ON behavior_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own behavior entries"
  ON behavior_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for behavior_triggers
CREATE POLICY "Users can view own behavior triggers"
  ON behavior_triggers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own behavior triggers"
  ON behavior_triggers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own behavior triggers"
  ON behavior_triggers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own behavior triggers"
  ON behavior_triggers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for behavior_interventions
CREATE POLICY "Users can view own behavior interventions"
  ON behavior_interventions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own behavior interventions"
  ON behavior_interventions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own behavior interventions"
  ON behavior_interventions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own behavior interventions"
  ON behavior_interventions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);