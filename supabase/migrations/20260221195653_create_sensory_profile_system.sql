/*
  # Sensory Profile System

  Track sensory sensitivities and preferences to better understand triggers

  1. New Tables
    - sensory_profiles: Main profile per child
    - sensory_observations: Daily observations of sensory reactions
    - sensory_strategies: What helps with each sensory issue

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
*/

CREATE TABLE IF NOT EXISTS sensory_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  child_name text NOT NULL,
  
  -- Visual Sensitivities
  visual_sensitivity text DEFAULT 'typical',
  visual_seeking_behaviors text[] DEFAULT '{}',
  visual_avoiding_behaviors text[] DEFAULT '{}',
  visual_notes text,
  
  -- Auditory Sensitivities
  auditory_sensitivity text DEFAULT 'typical',
  auditory_seeking_behaviors text[] DEFAULT '{}',
  auditory_avoiding_behaviors text[] DEFAULT '{}',
  auditory_notes text,
  
  -- Tactile Sensitivities
  tactile_sensitivity text DEFAULT 'typical',
  tactile_seeking_behaviors text[] DEFAULT '{}',
  tactile_avoiding_behaviors text[] DEFAULT '{}',
  tactile_notes text,
  
  -- Taste/Oral Sensitivities
  taste_sensitivity text DEFAULT 'typical',
  taste_seeking_behaviors text[] DEFAULT '{}',
  taste_avoiding_behaviors text[] DEFAULT '{}',
  taste_notes text,
  
  -- Smell Sensitivities
  smell_sensitivity text DEFAULT 'typical',
  smell_seeking_behaviors text[] DEFAULT '{}',
  smell_avoiding_behaviors text[] DEFAULT '{}',
  smell_notes text,
  
  -- Vestibular (Movement/Balance)
  vestibular_sensitivity text DEFAULT 'typical',
  vestibular_seeking_behaviors text[] DEFAULT '{}',
  vestibular_avoiding_behaviors text[] DEFAULT '{}',
  vestibular_notes text,
  
  -- Proprioceptive (Body Awareness)
  proprioceptive_sensitivity text DEFAULT 'typical',
  proprioceptive_seeking_behaviors text[] DEFAULT '{}',
  proprioceptive_avoiding_behaviors text[] DEFAULT '{}',
  proprioceptive_notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sensory_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  profile_id uuid REFERENCES sensory_profiles ON DELETE CASCADE NOT NULL,
  observation_date date NOT NULL DEFAULT CURRENT_DATE,
  observation_time time NOT NULL DEFAULT CURRENT_TIME,
  sensory_system text NOT NULL,
  trigger_description text NOT NULL,
  reaction_description text NOT NULL,
  intensity integer NOT NULL CHECK (intensity >= 1 AND intensity <= 5),
  duration_minutes integer,
  what_helped text,
  location text,
  time_of_day text,
  other_factors text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sensory_strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  profile_id uuid REFERENCES sensory_profiles ON DELETE CASCADE NOT NULL,
  sensory_system text NOT NULL,
  strategy_name text NOT NULL,
  strategy_description text NOT NULL,
  effectiveness_rating integer CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  when_to_use text,
  materials_needed text[] DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sensory_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensory_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensory_strategies ENABLE ROW LEVEL SECURITY;

-- Policies for sensory_profiles
CREATE POLICY "Users can view own sensory profiles"
  ON sensory_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sensory profiles"
  ON sensory_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sensory profiles"
  ON sensory_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sensory profiles"
  ON sensory_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for sensory_observations
CREATE POLICY "Users can view own sensory observations"
  ON sensory_observations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sensory observations"
  ON sensory_observations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sensory observations"
  ON sensory_observations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sensory observations"
  ON sensory_observations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for sensory_strategies
CREATE POLICY "Users can view own sensory strategies"
  ON sensory_strategies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sensory strategies"
  ON sensory_strategies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sensory strategies"
  ON sensory_strategies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sensory strategies"
  ON sensory_strategies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);