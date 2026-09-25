/*
  # Track whether a reward chart is working

  1. Changes
    - reward_charts.is_effective: parent's rating of the chart.
      true = working, false = not working, NULL = not rated yet.
*/

ALTER TABLE reward_charts ADD COLUMN IF NOT EXISTS is_effective boolean;
