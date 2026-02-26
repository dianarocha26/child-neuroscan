/*
  # IEP/504 Plan Organizer System

  Help parents track educational plans, meetings, and accommodations

  1. New Tables
    - iep_plans: Main IEP/504 plan documents
    - iep_goals: Individual educational goals
    - iep_accommodations: Specific accommodations and modifications
    - iep_meetings: Track meetings and progress
    - iep_contacts: School staff and related service providers

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
*/

CREATE TABLE IF NOT EXISTS iep_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  child_name text NOT NULL,
  plan_type text NOT NULL,
  school_name text NOT NULL,
  grade_level text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  review_date date,
  case_manager_name text,
  case_manager_email text,
  case_manager_phone text,
  primary_disability text,
  secondary_disabilities text[] DEFAULT '{}',
  placement text,
  service_minutes_per_week integer,
  status text DEFAULT 'active',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS iep_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES iep_plans ON DELETE CASCADE NOT NULL,
  goal_number text,
  goal_area text NOT NULL,
  goal_text text NOT NULL,
  baseline text,
  target_criteria text NOT NULL,
  target_date date,
  progress_monitoring_method text,
  current_progress text,
  progress_percentage integer DEFAULT 0,
  is_mastered boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS iep_accommodations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES iep_plans ON DELETE CASCADE NOT NULL,
  accommodation_type text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  frequency text,
  who_implements text,
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS iep_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES iep_plans ON DELETE CASCADE NOT NULL,
  meeting_type text NOT NULL,
  meeting_date date NOT NULL,
  meeting_time time,
  location text,
  attendees text[] DEFAULT '{}',
  topics_discussed text[] DEFAULT '{}',
  decisions_made text[] DEFAULT '{}',
  action_items text[] DEFAULT '{}',
  parent_concerns text,
  next_meeting_date date,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS iep_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES iep_plans ON DELETE CASCADE NOT NULL,
  contact_name text NOT NULL,
  role text NOT NULL,
  department text,
  email text,
  phone text,
  best_contact_method text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE iep_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE iep_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE iep_accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE iep_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE iep_contacts ENABLE ROW LEVEL SECURITY;

-- Policies for iep_plans
CREATE POLICY "Users can view own IEP plans"
  ON iep_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own IEP plans"
  ON iep_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own IEP plans"
  ON iep_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own IEP plans"
  ON iep_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for iep_goals
CREATE POLICY "Users can view own IEP goals"
  ON iep_goals FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_goals.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own IEP goals"
  ON iep_goals FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_goals.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own IEP goals"
  ON iep_goals FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_goals.plan_id
    AND iep_plans.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_goals.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own IEP goals"
  ON iep_goals FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_goals.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

-- Similar policies for other tables
CREATE POLICY "Users can view own IEP accommodations"
  ON iep_accommodations FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_accommodations.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own IEP accommodations"
  ON iep_accommodations FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_accommodations.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own IEP accommodations"
  ON iep_accommodations FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_accommodations.plan_id
    AND iep_plans.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_accommodations.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own IEP accommodations"
  ON iep_accommodations FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_accommodations.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can view own IEP meetings"
  ON iep_meetings FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_meetings.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own IEP meetings"
  ON iep_meetings FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_meetings.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own IEP meetings"
  ON iep_meetings FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_meetings.plan_id
    AND iep_plans.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_meetings.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own IEP meetings"
  ON iep_meetings FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_meetings.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can view own IEP contacts"
  ON iep_contacts FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_contacts.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own IEP contacts"
  ON iep_contacts FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_contacts.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own IEP contacts"
  ON iep_contacts FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_contacts.plan_id
    AND iep_plans.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_contacts.plan_id
    AND iep_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own IEP contacts"
  ON iep_contacts FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM iep_plans
    WHERE iep_plans.id = iep_contacts.plan_id
    AND iep_plans.user_id = auth.uid()
  ));