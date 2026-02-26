/*
  # Visual Schedule System with Images

  1. New Tables
    - visual_schedules: Parent containers for daily/weekly schedules
    - schedule_activities: Individual activities with images and timing
    - activity_templates: Reusable activity templates with icons

  2. Security
    - Enable RLS on all tables
    - Users can only manage their own schedules
*/

CREATE TABLE IF NOT EXISTS visual_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  child_name text NOT NULL,
  schedule_name text NOT NULL,
  schedule_type text NOT NULL,
  is_active boolean DEFAULT true,
  start_date date,
  end_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schedule_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid REFERENCES visual_schedules ON DELETE CASCADE NOT NULL,
  activity_order integer NOT NULL,
  activity_name text NOT NULL,
  activity_description text,
  icon_name text,
  icon_color text DEFAULT '#3B82F6',
  image_url text,
  start_time time,
  duration_minutes integer,
  is_completed boolean DEFAULT false,
  completion_notes text,
  reminder_before_minutes integer,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activity_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  template_name text NOT NULL,
  template_description text,
  icon_name text NOT NULL,
  icon_color text DEFAULT '#3B82F6',
  category text NOT NULL,
  typical_duration_minutes integer,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE visual_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_templates ENABLE ROW LEVEL SECURITY;

-- Policies for visual_schedules
CREATE POLICY "Users can view own visual schedules"
  ON visual_schedules FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own visual schedules"
  ON visual_schedules FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visual schedules"
  ON visual_schedules FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own visual schedules"
  ON visual_schedules FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for schedule_activities
CREATE POLICY "Users can view own schedule activities"
  ON schedule_activities FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM visual_schedules
    WHERE visual_schedules.id = schedule_activities.schedule_id
    AND visual_schedules.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own schedule activities"
  ON schedule_activities FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM visual_schedules
    WHERE visual_schedules.id = schedule_activities.schedule_id
    AND visual_schedules.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own schedule activities"
  ON schedule_activities FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM visual_schedules
    WHERE visual_schedules.id = schedule_activities.schedule_id
    AND visual_schedules.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM visual_schedules
    WHERE visual_schedules.id = schedule_activities.schedule_id
    AND visual_schedules.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own schedule activities"
  ON schedule_activities FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM visual_schedules
    WHERE visual_schedules.id = schedule_activities.schedule_id
    AND visual_schedules.user_id = auth.uid()
  ));

-- Policies for activity_templates
CREATE POLICY "Users can view own and public activity templates"
  ON activity_templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create own activity templates"
  ON activity_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity templates"
  ON activity_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activity templates"
  ON activity_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);