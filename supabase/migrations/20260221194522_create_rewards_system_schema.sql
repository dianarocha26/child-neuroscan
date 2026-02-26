/*
  # Visual Rewards System

  1. New Tables
    - reward_charts: Individual reward charts/boards for each child
    - reward_goals: Specific goals to work toward
    - reward_entries: Daily tracking of earned rewards/stickers
    - available_rewards: Catalog of rewards that can be earned

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS reward_charts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  child_name text NOT NULL,
  chart_name text NOT NULL,
  chart_type text NOT NULL,
  target_behavior text NOT NULL,
  points_per_star integer DEFAULT 1,
  is_active boolean DEFAULT true,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reward_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_id uuid REFERENCES reward_charts ON DELETE CASCADE NOT NULL,
  goal_name text NOT NULL,
  goal_description text,
  points_required integer NOT NULL,
  reward_item text NOT NULL,
  is_achieved boolean DEFAULT false,
  achieved_date date,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reward_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_id uuid REFERENCES reward_charts ON DELETE CASCADE NOT NULL,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  entry_time time DEFAULT CURRENT_TIME,
  points_earned integer NOT NULL DEFAULT 1,
  behavior_performed text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS available_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  reward_name text NOT NULL,
  reward_category text NOT NULL,
  points_cost integer NOT NULL,
  description text,
  image_url text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reward_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_rewards ENABLE ROW LEVEL SECURITY;

-- Policies for reward_charts
CREATE POLICY "Users can view own reward charts"
  ON reward_charts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reward charts"
  ON reward_charts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reward charts"
  ON reward_charts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reward charts"
  ON reward_charts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for reward_goals
CREATE POLICY "Users can view own reward goals"
  ON reward_goals FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM reward_charts
    WHERE reward_charts.id = reward_goals.chart_id
    AND reward_charts.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own reward goals"
  ON reward_goals FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM reward_charts
    WHERE reward_charts.id = reward_goals.chart_id
    AND reward_charts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own reward goals"
  ON reward_goals FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM reward_charts
    WHERE reward_charts.id = reward_goals.chart_id
    AND reward_charts.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM reward_charts
    WHERE reward_charts.id = reward_goals.chart_id
    AND reward_charts.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own reward goals"
  ON reward_goals FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM reward_charts
    WHERE reward_charts.id = reward_goals.chart_id
    AND reward_charts.user_id = auth.uid()
  ));

-- Policies for reward_entries
CREATE POLICY "Users can view own reward entries"
  ON reward_entries FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM reward_charts
    WHERE reward_charts.id = reward_entries.chart_id
    AND reward_charts.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own reward entries"
  ON reward_entries FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM reward_charts
    WHERE reward_charts.id = reward_entries.chart_id
    AND reward_charts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own reward entries"
  ON reward_entries FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM reward_charts
    WHERE reward_charts.id = reward_entries.chart_id
    AND reward_charts.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM reward_charts
    WHERE reward_charts.id = reward_entries.chart_id
    AND reward_charts.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own reward entries"
  ON reward_entries FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM reward_charts
    WHERE reward_charts.id = reward_entries.chart_id
    AND reward_charts.user_id = auth.uid()
  ));

-- Policies for available_rewards
CREATE POLICY "Users can view own available rewards"
  ON available_rewards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own available rewards"
  ON available_rewards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own available rewards"
  ON available_rewards FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own available rewards"
  ON available_rewards FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);