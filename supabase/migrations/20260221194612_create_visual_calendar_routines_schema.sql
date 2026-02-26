/*
  # Visual Calendar and Routines System

  1. New Tables
    - daily_routines: Structured daily routines with visual steps
    - routine_steps: Individual steps within a routine (with images/icons)
    - calendar_events: Visual calendar events and activities
    - visual_timers: Active countdown timers for activities

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS daily_routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  child_name text NOT NULL,
  routine_name text NOT NULL,
  routine_type text NOT NULL,
  time_of_day text,
  estimated_duration_minutes integer,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 1,
  color_code text,
  icon_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS routine_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id uuid REFERENCES daily_routines ON DELETE CASCADE NOT NULL,
  step_number integer NOT NULL,
  step_title text NOT NULL,
  step_description text,
  duration_minutes integer,
  image_url text,
  icon_name text,
  completion_required boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  child_name text,
  event_title text NOT NULL,
  event_type text NOT NULL,
  event_date date NOT NULL,
  start_time time,
  end_time time,
  description text,
  location text,
  color_code text,
  icon_name text,
  reminder_minutes_before integer,
  is_recurring boolean DEFAULT false,
  recurrence_pattern text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visual_timers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  child_name text NOT NULL,
  timer_name text NOT NULL,
  total_duration_minutes integer NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  timer_type text NOT NULL,
  visual_style text DEFAULT 'countdown',
  color_code text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE daily_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE visual_timers ENABLE ROW LEVEL SECURITY;

-- Policies for daily_routines
CREATE POLICY "Users can view own daily routines"
  ON daily_routines FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own daily routines"
  ON daily_routines FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily routines"
  ON daily_routines FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily routines"
  ON daily_routines FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for routine_steps
CREATE POLICY "Users can view own routine steps"
  ON routine_steps FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM daily_routines
    WHERE daily_routines.id = routine_steps.routine_id
    AND daily_routines.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own routine steps"
  ON routine_steps FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM daily_routines
    WHERE daily_routines.id = routine_steps.routine_id
    AND daily_routines.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own routine steps"
  ON routine_steps FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM daily_routines
    WHERE daily_routines.id = routine_steps.routine_id
    AND daily_routines.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM daily_routines
    WHERE daily_routines.id = routine_steps.routine_id
    AND daily_routines.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own routine steps"
  ON routine_steps FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM daily_routines
    WHERE daily_routines.id = routine_steps.routine_id
    AND daily_routines.user_id = auth.uid()
  ));

-- Policies for calendar_events
CREATE POLICY "Users can view own calendar events"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own calendar events"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar events"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar events"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for visual_timers
CREATE POLICY "Users can view own visual timers"
  ON visual_timers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own visual timers"
  ON visual_timers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visual timers"
  ON visual_timers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own visual timers"
  ON visual_timers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);