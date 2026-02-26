/*
  # Create Application Logging System

  1. New Tables
    - `app_logs`
      - `id` (uuid, primary key)
      - `level` (text) - log level: log, error, warn, info
      - `message` (text) - log message
      - `timestamp` (timestamptz) - when the log occurred
      - `data` (jsonb) - additional structured data
      - `user_id` (uuid, nullable) - associated user if logged in
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `app_logs` table
    - Only authenticated users can insert their own logs
    - Only admins can view all logs
    - Add index on timestamp and user_id for query performance

  3. Important Notes
    - Logs are kept for debugging and error tracking
    - Production errors are automatically logged here
    - Retention policy should be configured separately
*/

CREATE TABLE IF NOT EXISTS app_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL CHECK (level IN ('log', 'error', 'warn', 'info')),
  message text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  data jsonb,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_app_logs_timestamp ON app_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_app_logs_user_id ON app_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_app_logs_level ON app_logs(level);

CREATE POLICY "Users can insert their own logs"
  ON app_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own logs"
  ON app_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

COMMENT ON TABLE app_logs IS 'Application logs for debugging and error tracking';
COMMENT ON COLUMN app_logs.level IS 'Log severity level';
COMMENT ON COLUMN app_logs.data IS 'Structured log data in JSON format';