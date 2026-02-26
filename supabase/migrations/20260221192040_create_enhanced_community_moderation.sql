/*
  # Enhanced Community Moderation & Safety System

  1. New Tables
    - `community_groups` - Structured support groups (condition, age, topic, local)
    - `community_group_members` - Group membership with roles
    - `community_moderation_reports` - Content reporting system
    - `community_moderators` - Verified moderator team
    - `community_content_flags` - AI/Auto content flagging
    - `community_blocked_users` - User blocking for safety
    - `community_expert_amas` - Expert Q&A sessions

  2. Security
    - Enable RLS on all tables
    - Granular permissions based on roles
    - Privacy controls for sensitive content
    - Moderator verification system
*/

-- Community Groups
CREATE TABLE IF NOT EXISTS community_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  group_type text NOT NULL CHECK (group_type IN ('condition', 'age', 'topic', 'local')),
  condition_id text,
  age_range text,
  location text,
  is_private boolean DEFAULT false,
  requires_approval boolean DEFAULT false,
  member_count integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;

-- Group Members
CREATE TABLE IF NOT EXISTS community_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES community_groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE community_group_members ENABLE ROW LEVEL SECURITY;

-- Moderation Reports
CREATE TABLE IF NOT EXISTS community_moderation_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES auth.users(id) NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('post', 'comment', 'message')),
  content_id uuid NOT NULL,
  reason text NOT NULL CHECK (reason IN ('harassment', 'misinformation', 'spam', 'inappropriate', 'crisis', 'other')),
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  reviewed_by uuid REFERENCES auth.users(id),
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE community_moderation_reports ENABLE ROW LEVEL SECURITY;

-- Moderators
CREATE TABLE IF NOT EXISTS community_moderators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE NOT NULL,
  is_professional boolean DEFAULT false,
  specialty text,
  credentials text,
  verified_at timestamptz DEFAULT now(),
  permissions jsonb DEFAULT '{"can_hide_posts": true, "can_ban_users": false, "can_verify_content": true}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_moderators ENABLE ROW LEVEL SECURITY;

-- Content Flags
CREATE TABLE IF NOT EXISTS community_content_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('post', 'comment', 'message')),
  content_id uuid NOT NULL,
  flag_type text NOT NULL CHECK (flag_type IN ('profanity', 'medical_advice', 'crisis', 'spam', 'link')),
  confidence_score numeric(3,2) DEFAULT 0.50,
  flagged_text text,
  auto_action text DEFAULT 'queue' CHECK (auto_action IN ('none', 'queue', 'hide', 'warn')),
  reviewed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_content_flags ENABLE ROW LEVEL SECURITY;

-- Blocked Users
CREATE TABLE IF NOT EXISTS community_blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  blocked_user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, blocked_user_id)
);

ALTER TABLE community_blocked_users ENABLE ROW LEVEL SECURITY;

-- Expert AMAs
CREATE TABLE IF NOT EXISTS community_expert_amas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  specialty text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  is_live boolean DEFAULT false,
  participant_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_expert_amas ENABLE ROW LEVEL SECURITY;

-- RLS Policies

CREATE POLICY "Anyone can view public groups"
  ON community_groups FOR SELECT
  TO authenticated
  USING (NOT is_private OR id IN (
    SELECT group_id FROM community_group_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Authenticated users can create groups"
  ON community_groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Members can view group membership"
  ON community_group_members FOR SELECT
  TO authenticated
  USING (
    group_id IN (
      SELECT id FROM community_groups WHERE NOT is_private
    ) OR user_id = auth.uid() OR group_id IN (
      SELECT group_id FROM community_group_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join groups"
  ON community_group_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups"
  ON community_group_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can submit reports"
  ON community_moderation_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their reports"
  ON community_moderation_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id OR EXISTS (
    SELECT 1 FROM community_moderators WHERE user_id = auth.uid()
  ));

CREATE POLICY "Anyone can view moderators"
  ON community_moderators FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Moderators can view flags"
  ON community_content_flags FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM community_moderators WHERE user_id = auth.uid()
  ));

CREATE POLICY "System can create flags"
  ON community_content_flags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can manage their blocks"
  ON community_blocked_users FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view AMAs"
  ON community_expert_amas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Moderators can create AMAs"
  ON community_expert_amas FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM community_moderators WHERE user_id = auth.uid()
  ));

-- Update existing posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_posts' AND column_name = 'group_id'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN group_id uuid REFERENCES community_groups(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_posts' AND column_name = 'is_hidden'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN is_hidden boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_posts' AND column_name = 'hidden_reason'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN hidden_reason text;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_community_groups_type ON community_groups(group_type);
CREATE INDEX IF NOT EXISTS idx_community_group_members_user ON community_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_group_members_group ON community_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_moderation_reports_status ON community_moderation_reports(status);
CREATE INDEX IF NOT EXISTS idx_content_flags_reviewed ON community_content_flags(reviewed);
CREATE INDEX IF NOT EXISTS idx_posts_group ON community_posts(group_id) WHERE group_id IS NOT NULL;
