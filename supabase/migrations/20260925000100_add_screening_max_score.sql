/*
  # Store the maximum possible score with each screening

  The dashboard showed each score as a percentage of the latest screening's
  score (often a different condition), which was meaningless. Saving
  max_score lets it show score / max for each screening.

  Nullable: rows saved before this migration have no max_score and are
  shown without a bar.
*/

ALTER TABLE screening_results ADD COLUMN IF NOT EXISTS max_score numeric;
