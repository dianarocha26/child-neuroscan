/*
  # Milestone Comparison System

  1. New Tables
    - typical_milestones: Reference data for typical developmental milestones
    - child_milestone_tracking: Track actual milestones achieved by children
    - milestone_categories: Categories of development (motor, language, social, cognitive)

  2. Security
    - Enable RLS on all tables
    - Typical milestones are public reference data
    - Child tracking is private per user
*/

CREATE TABLE IF NOT EXISTS milestone_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name text NOT NULL UNIQUE,
  category_description text,
  display_order integer DEFAULT 1,
  icon_name text,
  color_code text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS typical_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES milestone_categories ON DELETE CASCADE NOT NULL,
  milestone_name text NOT NULL,
  milestone_description text NOT NULL,
  age_range_start_months integer NOT NULL,
  age_range_end_months integer NOT NULL,
  importance_level text NOT NULL,
  tips_for_encouraging text[] DEFAULT '{}',
  warning_signs text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS child_milestone_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  child_name text NOT NULL,
  child_birth_date date NOT NULL,
  typical_milestone_id uuid REFERENCES typical_milestones,
  custom_milestone_name text,
  custom_milestone_description text,
  category_id uuid REFERENCES milestone_categories NOT NULL,
  achieved boolean DEFAULT false,
  achieved_date date,
  age_achieved_months integer,
  notes text,
  celebration_note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE milestone_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE typical_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_milestone_tracking ENABLE ROW LEVEL SECURITY;

-- Public read access for reference data
CREATE POLICY "Anyone can view milestone categories"
  ON milestone_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view typical milestones"
  ON typical_milestones FOR SELECT
  TO authenticated
  USING (true);

-- Policies for child_milestone_tracking
CREATE POLICY "Users can view own child milestone tracking"
  ON child_milestone_tracking FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own child milestone tracking"
  ON child_milestone_tracking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own child milestone tracking"
  ON child_milestone_tracking FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own child milestone tracking"
  ON child_milestone_tracking FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);