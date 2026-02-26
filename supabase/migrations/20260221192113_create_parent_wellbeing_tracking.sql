/*
  # Parent Wellbeing & Emotional Support System

  1. New Tables
    - `parent_emotional_checkins` - Daily mood and stress tracking
    - `parent_support_resources` - Contextual resources based on emotional state
    - `celebration_milestones` - Achievements and victories to celebrate
    - `victory_journal` - Non-clinical celebration entries
    - `behavior_insights` - AI-detected patterns and correlations

  2. Features
    - Parent self-care tracking
    - Automatic resource recommendations
    - Celebration system for small wins
    - Pattern recognition for behaviors
    - Stress correlation with child behavior
*/

-- Parent Emotional Check-ins
CREATE TABLE IF NOT EXISTS parent_emotional_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL,
  mood_rating integer CHECK (mood_rating BETWEEN 1 AND 5) NOT NULL,
  stress_level integer CHECK (stress_level BETWEEN 1 AND 5) NOT NULL,
  sleep_quality integer CHECK (sleep_quality BETWEEN 1 AND 5),
  support_feeling integer CHECK (support_feeling BETWEEN 1 AND 5),
  notes text,
  triggers text[],
  self_care_activities text[],
  needs_support boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE parent_emotional_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own check-ins"
  ON parent_emotional_checkins FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Support Resources
CREATE TABLE IF NOT EXISTS parent_support_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  resource_type text NOT NULL CHECK (resource_type IN ('article', 'video', 'hotline', 'community', 'respite', 'therapy')),
  url text,
  phone_number text,
  trigger_conditions jsonb,
  mood_range integer[],
  stress_range integer[],
  is_crisis boolean DEFAULT false,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE parent_support_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view resources"
  ON parent_support_resources FOR SELECT
  TO authenticated
  USING (true);

-- Celebration Milestones
CREATE TABLE IF NOT EXISTS celebration_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  child_profile_id uuid,
  milestone_type text NOT NULL CHECK (milestone_type IN ('first_word', 'first_step', 'skill_mastered', 'therapy_progress', 'social_interaction', 'emotional_regulation', 'academic', 'custom')),
  title text NOT NULL,
  description text,
  date_achieved date DEFAULT CURRENT_DATE,
  photo_url text,
  shared_with_community boolean DEFAULT false,
  celebration_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE celebration_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own milestones"
  ON celebration_milestones FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view shared milestones"
  ON celebration_milestones FOR SELECT
  TO authenticated
  USING (shared_with_community = true OR auth.uid() = user_id);

-- Victory Journal
CREATE TABLE IF NOT EXISTS victory_journal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  child_profile_id uuid,
  date date DEFAULT CURRENT_DATE NOT NULL,
  victory_type text CHECK (victory_type IN ('small_win', 'breakthrough', 'good_day', 'patience', 'advocacy')),
  title text NOT NULL,
  description text,
  grateful_for text[],
  photo_urls text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE victory_journal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own victories"
  ON victory_journal FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Behavior Insights
CREATE TABLE IF NOT EXISTS behavior_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  insight_type text NOT NULL CHECK (insight_type IN ('correlation', 'pattern', 'trend', 'suggestion', 'celebration')),
  title text NOT NULL,
  description text NOT NULL,
  confidence_score numeric(3,2),
  data_source text,
  correlations jsonb,
  visualization_data jsonb,
  is_actionable boolean DEFAULT false,
  action_suggestion text,
  dismissed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE behavior_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own insights"
  ON behavior_insights FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_emotional_checkins_user_date ON parent_emotional_checkins(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_celebration_milestones_user ON celebration_milestones(user_id, date_achieved DESC);
CREATE INDEX IF NOT EXISTS idx_celebration_shared ON celebration_milestones(shared_with_community) WHERE shared_with_community = true;
CREATE INDEX IF NOT EXISTS idx_victory_journal_user ON victory_journal(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_behavior_insights_user ON behavior_insights(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_resources_type ON parent_support_resources(resource_type);
