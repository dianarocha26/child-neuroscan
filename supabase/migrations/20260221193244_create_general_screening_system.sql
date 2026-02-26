/*
  # General Developmental Screening System (Level 1)

  Creates pyramid screening architecture with:
  1. General developmental questions covering 8 domains
  2. Response tracking system
  3. Domain scoring calculations
  4. Intelligent recommendation engine
  5. Ethical guidance framework
*/

CREATE TABLE IF NOT EXISTS general_developmental_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_number integer NOT NULL,
  question_text text NOT NULL,
  question_text_es text,
  domain text NOT NULL CHECK (domain IN (
    'social_communication', 'attention_focus', 'motor_skills',
    'emotional_regulation', 'learning_cognition', 'sensory_processing',
    'behavior_patterns', 'speech_language'
  )),
  age_range_min integer NOT NULL,
  age_range_max integer NOT NULL,
  response_type text DEFAULT 'frequency',
  response_options jsonb NOT NULL,
  scoring_weight numeric(3,2) DEFAULT 1.0,
  explanation text,
  explanation_es text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE general_developmental_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View general questions"
  ON general_developmental_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS general_screening_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id text NOT NULL,
  child_age_months integer NOT NULL,
  question_id uuid REFERENCES general_developmental_questions(id) NOT NULL,
  response_value text NOT NULL,
  response_score numeric(3,2),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE general_screening_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Manage own responses"
  ON general_screening_responses FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS general_screening_domain_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id text NOT NULL,
  domain text NOT NULL,
  raw_score numeric(5,2) NOT NULL,
  max_possible_score numeric(5,2) NOT NULL,
  percentage_score numeric(5,2) NOT NULL,
  concern_level text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE general_screening_domain_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own scores"
  ON general_screening_domain_scores FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS general_screening_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id text NOT NULL,
  recommended_condition text NOT NULL,
  confidence_level text,
  reasoning jsonb NOT NULL,
  domain_triggers text[],
  parent_message text NOT NULL,
  parent_message_es text,
  educational_content text,
  educational_content_es text,
  professional_guidance text NOT NULL,
  priority_order integer,
  viewed boolean DEFAULT false,
  accepted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE general_screening_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own recommendations"
  ON general_screening_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Update recommendation status"
  ON general_screening_recommendations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS screening_recommendation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  condition_id text NOT NULL,
  condition_name text NOT NULL,
  primary_domains text[] NOT NULL,
  secondary_domains text[],
  threshold_rules jsonb NOT NULL,
  recommendation_message text NOT NULL,
  recommendation_message_es text,
  educational_summary text NOT NULL,
  next_steps text NOT NULL,
  professional_types text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE screening_recommendation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View recommendation rules"
  ON screening_recommendation_rules FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_gen_dev_questions_age 
  ON general_developmental_questions(age_range_min, age_range_max);
CREATE INDEX IF NOT EXISTS idx_gen_screen_resp_session 
  ON general_screening_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_gen_domain_scores_session 
  ON general_screening_domain_scores(session_id);
CREATE INDEX IF NOT EXISTS idx_gen_recommendations_user 
  ON general_screening_recommendations(user_id, created_at DESC);
