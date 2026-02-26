/*
  # Update Existing Tables with User Relationships
  
  1. Updates
    - Add foreign key constraints to link existing tables with profiles
    - Ensure data consistency across all user-related tables
    
  2. Tables Updated
    - screening_sessions - link to profiles instead of just user_id
    - photo_journal_entries - already has user_id
    - goals - already has user_id
    - goal_progress_logs - already has user_id
    - medications - already has user_id
    - medication_logs - already has user_id
    
  3. Note
    - This migration ensures all user data is properly linked to authenticated users
    - Existing anonymous user data will remain but won't be accessible without proper user_id
*/

-- Update screening_sessions to reference profiles if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'screening_sessions'
  ) THEN
    -- Check if the foreign key doesn't already exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'screening_sessions_user_id_fkey' 
      AND table_name = 'screening_sessions'
    ) THEN
      -- Only add constraint if user_id column exists and references valid profiles
      ALTER TABLE screening_sessions
      ADD CONSTRAINT screening_sessions_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Ensure photo_journal_entries references profiles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'photo_journal_entries'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'photo_journal_entries_user_id_fkey' 
      AND table_name = 'photo_journal_entries'
    ) THEN
      ALTER TABLE photo_journal_entries
      DROP CONSTRAINT IF EXISTS photo_journal_entries_user_id_fkey;
      
      ALTER TABLE photo_journal_entries
      ADD CONSTRAINT photo_journal_entries_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Ensure goals references profiles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'goals'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'goals_user_id_fkey' 
      AND table_name = 'goals'
    ) THEN
      ALTER TABLE goals
      DROP CONSTRAINT IF EXISTS goals_user_id_fkey;
      
      ALTER TABLE goals
      ADD CONSTRAINT goals_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Ensure goal_progress_logs references profiles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'goal_progress_logs'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'goal_progress_logs_user_id_fkey' 
      AND table_name = 'goal_progress_logs'
    ) THEN
      ALTER TABLE goal_progress_logs
      DROP CONSTRAINT IF EXISTS goal_progress_logs_user_id_fkey;
      
      ALTER TABLE goal_progress_logs
      ADD CONSTRAINT goal_progress_logs_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Ensure medications references profiles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'medications'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'medications_user_id_fkey' 
      AND table_name = 'medications'
    ) THEN
      ALTER TABLE medications
      DROP CONSTRAINT IF EXISTS medications_user_id_fkey;
      
      ALTER TABLE medications
      ADD CONSTRAINT medications_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Ensure medication_logs references profiles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'medication_logs'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'medication_logs_user_id_fkey' 
      AND table_name = 'medication_logs'
    ) THEN
      ALTER TABLE medication_logs
      DROP CONSTRAINT IF EXISTS medication_logs_user_id_fkey;
      
      ALTER TABLE medication_logs
      ADD CONSTRAINT medication_logs_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;