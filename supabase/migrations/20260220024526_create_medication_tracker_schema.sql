/*
  # Medication & Supplement Tracker Schema
  
  1. New Tables
    - `medications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `child_name` (text) - Child's name
      - `name` (text) - Medication/supplement name
      - `type` (text) - medication, supplement, vitamin
      - `dosage` (text) - Dosage amount (e.g., "5mg", "1 tablet")
      - `frequency` (text) - How often (e.g., "twice daily", "as needed")
      - `schedule_times` (text[]) - Specific times (e.g., ["08:00", "20:00"])
      - `purpose` (text) - What it's for
      - `prescribing_doctor` (text) - Doctor's name
      - `linked_condition` (text) - Related condition
      - `start_date` (date) - When started
      - `end_date` (date, nullable) - When to stop (if applicable)
      - `active` (boolean) - Currently taking
      - `notes` (text) - Additional notes
      - `side_effects` (text) - Known side effects to watch for
      - `created_at` (timestamptz)
      
    - `medication_logs`
      - `id` (uuid, primary key)
      - `medication_id` (uuid, references medications)
      - `user_id` (uuid, references auth.users)
      - `taken_at` (timestamptz) - When dose was taken
      - `scheduled_time` (text) - What time it was scheduled for
      - `status` (text) - taken, missed, skipped
      - `notes` (text) - Notes about this dose
      - `side_effects_observed` (text) - Any side effects noticed
      - `behavioral_changes` (text) - Behavioral changes noted
      - `logged_at` (timestamptz)
      
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  child_name text NOT NULL,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'medication' CHECK (type IN ('medication', 'supplement', 'vitamin')),
  dosage text NOT NULL,
  frequency text NOT NULL,
  schedule_times text[] DEFAULT '{}',
  purpose text DEFAULT '',
  prescribing_doctor text DEFAULT '',
  linked_condition text DEFAULT '',
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  active boolean DEFAULT true,
  notes text DEFAULT '',
  side_effects text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create medication logs table
CREATE TABLE IF NOT EXISTS medication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id uuid REFERENCES medications(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  taken_at timestamptz NOT NULL,
  scheduled_time text DEFAULT '',
  status text NOT NULL DEFAULT 'taken' CHECK (status IN ('taken', 'missed', 'skipped')),
  notes text DEFAULT '',
  side_effects_observed text DEFAULT '',
  behavioral_changes text DEFAULT '',
  logged_at timestamptz DEFAULT now()
);

-- Enable RLS on medications
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- Policies for medications
CREATE POLICY "Users can view own medications"
  ON medications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medications"
  ON medications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medications"
  ON medications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own medications"
  ON medications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable RLS on medication logs
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;

-- Policies for medication logs
CREATE POLICY "Users can view own medication logs"
  ON medication_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medication logs"
  ON medication_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medication logs"
  ON medication_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own medication logs"
  ON medication_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_medications_user_id ON medications(user_id);
CREATE INDEX IF NOT EXISTS idx_medications_active ON medications(active);
CREATE INDEX IF NOT EXISTS idx_medications_start_date ON medications(start_date);
CREATE INDEX IF NOT EXISTS idx_medication_logs_medication_id ON medication_logs(medication_id);
CREATE INDEX IF NOT EXISTS idx_medication_logs_taken_at ON medication_logs(taken_at DESC);
CREATE INDEX IF NOT EXISTS idx_medication_logs_status ON medication_logs(status);