/*
  # Parent Mentorship & Engagement System

  1. New Tables
    - `parent_mentorship_matches` - Experienced parents guide new parents
    - `parent_skill_badges` - Gamification for parent education
    - `learning_pathways` - Personalized education tracks
    - `resource_sharing` - Community resource recommendations
    - `local_service_recommendations` - Therapists, schools, services

  2. Features
    - Mentorship matching algorithm
    - Skill development tracking
    - Personalized learning
    - Community resource sharing
    - Local service directory
*/

-- Parent Mentorship System
CREATE TABLE IF NOT EXISTS parent_mentorship_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mentee_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  match_status text DEFAULT 'pending' CHECK (match_status IN ('pending', 'active', 'completed', 'declined')),
  condition_focus text[],
  mentee_needs text[],
  mentor_expertise text[],
  match_score integer,
  first_contact_at timestamptz,
  last_contact_at timestamptz,
  total_interactions integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(mentor_id, mentee_id)
);

ALTER TABLE parent_mentorship_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their mentorships"
  ON parent_mentorship_matches FOR SELECT
  TO authenticated
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Users can create mentorship requests"
  ON parent_mentorship_matches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Users can update their mentorships"
  ON parent_mentorship_matches FOR UPDATE
  TO authenticated
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id)
  WITH CHECK (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Mentor Profiles
CREATE TABLE IF NOT EXISTS parent_mentor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  is_available boolean DEFAULT true,
  expertise_areas text[] NOT NULL,
  child_conditions text[] NOT NULL,
  child_age_ranges text[],
  years_experience integer,
  bio text,
  languages text[],
  max_mentees integer DEFAULT 3,
  current_mentees integer DEFAULT 0,
  total_mentored integer DEFAULT 0,
  rating numeric(3,2),
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE parent_mentor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available mentors"
  ON parent_mentor_profiles FOR SELECT
  TO authenticated
  USING (is_available = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their mentor profile"
  ON parent_mentor_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their mentor profile"
  ON parent_mentor_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Parent Skill Badges
CREATE TABLE IF NOT EXISTS parent_skill_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_name text UNIQUE NOT NULL,
  badge_description text NOT NULL,
  badge_category text CHECK (badge_category IN ('tracking', 'education', 'community', 'advocacy', 'therapy', 'milestone')),
  badge_icon text,
  unlock_criteria jsonb NOT NULL,
  points_value integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE parent_skill_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON parent_skill_badges FOR SELECT
  TO authenticated
  USING (true);

-- User Earned Badges
CREATE TABLE IF NOT EXISTS user_earned_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id uuid REFERENCES parent_skill_badges(id) NOT NULL,
  earned_at timestamptz DEFAULT now(),
  displayed_on_profile boolean DEFAULT true,
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_earned_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their badges"
  ON user_earned_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view displayed badges"
  ON user_earned_badges FOR SELECT
  TO authenticated
  USING (displayed_on_profile = true);

-- Learning Pathways
CREATE TABLE IF NOT EXISTS learning_pathways (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_name text NOT NULL,
  pathway_description text NOT NULL,
  condition_id text,
  age_range text,
  difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours integer,
  modules jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE learning_pathways ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pathways"
  ON learning_pathways FOR SELECT
  TO authenticated
  USING (true);

-- User Pathway Progress
CREATE TABLE IF NOT EXISTS user_pathway_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pathway_id uuid REFERENCES learning_pathways(id) NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_modules text[],
  current_module text,
  completion_percentage integer DEFAULT 0,
  completed_at timestamptz,
  UNIQUE(user_id, pathway_id)
);

ALTER TABLE user_pathway_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own pathway progress"
  ON user_pathway_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Resource Sharing
CREATE TABLE IF NOT EXISTS community_shared_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resource_type text CHECK (resource_type IN ('therapist', 'school', 'program', 'product', 'service', 'article', 'tool')),
  title text NOT NULL,
  description text,
  url text,
  location text,
  phone_number text,
  email text,
  condition_tags text[],
  age_appropriate text[],
  cost_info text,
  rating numeric(3,2),
  review_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_shared_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view resources"
  ON community_shared_resources FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add resources"
  ON community_shared_resources FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Resource Reviews
CREATE TABLE IF NOT EXISTS resource_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid REFERENCES community_shared_resources(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  review_text text,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(resource_id, user_id)
);

ALTER TABLE resource_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON resource_reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON resource_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mentorship_mentor ON parent_mentorship_matches(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_mentee ON parent_mentorship_matches(mentee_id);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_available ON parent_mentor_profiles(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_user_badges ON user_earned_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_pathway_progress ON user_pathway_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_resources_type ON community_shared_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_shared_resources_location ON community_shared_resources(location);
