/*
  # Crisis Plan System

  1. New Tables
    - crisis_plans: Emergency plans for handling meltdowns and crises
    - crisis_contacts: Emergency contact information
    - calming_strategies: Personalized calming techniques per child

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS crisis_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  child_name text NOT NULL,
  warning_signs text[] DEFAULT '{}',
  immediate_actions text[] DEFAULT '{}',
  things_to_avoid text[] DEFAULT '{}',
  safe_space_location text,
  medication_instructions text,
  when_to_call_911 text[] DEFAULT '{}',
  additional_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crisis_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  contact_name text NOT NULL,
  relationship text NOT NULL,
  phone_number text NOT NULL,
  email text,
  contact_type text NOT NULL,
  priority_order integer DEFAULT 1,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calming_strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  child_name text NOT NULL,
  strategy_name text NOT NULL,
  strategy_type text NOT NULL,
  description text NOT NULL,
  effectiveness_rating integer CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  duration_minutes integer,
  materials_needed text[] DEFAULT '{}',
  instructions text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE crisis_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calming_strategies ENABLE ROW LEVEL SECURITY;

-- Policies for crisis_plans
CREATE POLICY "Users can view own crisis plans"
  ON crisis_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own crisis plans"
  ON crisis_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own crisis plans"
  ON crisis_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own crisis plans"
  ON crisis_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for crisis_contacts
CREATE POLICY "Users can view own crisis contacts"
  ON crisis_contacts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own crisis contacts"
  ON crisis_contacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own crisis contacts"
  ON crisis_contacts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own crisis contacts"
  ON crisis_contacts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for calming_strategies
CREATE POLICY "Users can view own calming strategies"
  ON calming_strategies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own calming strategies"
  ON calming_strategies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calming strategies"
  ON calming_strategies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calming strategies"
  ON calming_strategies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);