/*
  # Create screening_results table

  The app saves and reads screenings from `screening_results`
  (src/lib/database.ts), but no migration ever created it, so every save
  failed and the questionnaire hung on submit.

  1. New Tables
    - screening_results: one row per completed screening. No per-user or
      per-condition limit, so parents can repeat a screening any time.

  2. Security
    - RLS enabled; authenticated users manage only their own rows.
*/

CREATE TABLE IF NOT EXISTS screening_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  condition_id uuid NOT NULL REFERENCES conditions(id) ON DELETE CASCADE,
  child_name text,
  child_age_months integer NOT NULL,
  language text NOT NULL DEFAULT 'en',
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  total_score numeric NOT NULL DEFAULT 0,
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high')),
  has_red_flags boolean NOT NULL DEFAULT false,
  domain_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_screening_results_user_id ON screening_results(user_id);
CREATE INDEX IF NOT EXISTS idx_screening_results_created_at ON screening_results(created_at DESC);

ALTER TABLE screening_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own screening results"
  ON screening_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own screening results"
  ON screening_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own screening results"
  ON screening_results FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own screening results"
  ON screening_results FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
