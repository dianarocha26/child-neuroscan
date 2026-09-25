/*
  # Fix reward_entries / reward_goals column mismatch

  The Rewards UI (src/components/RewardsSystem.tsx) reads and writes
  `stars_earned` / `stars_required`, but the tables were created with
  `points_earned` / `points_required`, plus NOT NULL columns
  (`behavior_performed`, `reward_item`) the UI never fills. Every save
  failed with "Failed to save entry".

  1. Changes
    - reward_entries.points_earned  -> stars_earned
    - reward_goals.points_required  -> stars_required
    - reward_entries.behavior_performed: now nullable
    - reward_goals.reward_item: now nullable

  Existing rows are kept. Safe to re-run.
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reward_entries' AND column_name = 'points_earned'
  ) THEN
    ALTER TABLE reward_entries RENAME COLUMN points_earned TO stars_earned;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reward_goals' AND column_name = 'points_required'
  ) THEN
    ALTER TABLE reward_goals RENAME COLUMN points_required TO stars_required;
  END IF;
END $$;

ALTER TABLE reward_entries ALTER COLUMN behavior_performed DROP NOT NULL;
ALTER TABLE reward_goals ALTER COLUMN reward_item DROP NOT NULL;
