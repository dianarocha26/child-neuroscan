/*
  app_logs privacy and retention (phase 3 task 5)

  - Deletes existing rows: older client builds wrote full log arguments
    (child names, notes, emails in error text) into message/data.
  - Keeps logs for 30 days. An insert trigger purges older rows, so no
    pg_cron or dashboard setup is needed.
  - The app works with or without this migration; it only changes storage.
*/

DELETE FROM app_logs;

CREATE INDEX IF NOT EXISTS idx_app_logs_created_at ON app_logs(created_at);

-- created_at is set by the client insert too; pin it to server time so
-- rows cannot be backdated or future-dated around the retention window.
CREATE OR REPLACE FUNCTION app_logs_set_created_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.created_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS app_logs_set_created_at ON app_logs;
CREATE TRIGGER app_logs_set_created_at
  BEFORE INSERT ON app_logs
  FOR EACH ROW EXECUTE FUNCTION app_logs_set_created_at();

-- Runs as owner so it can delete other users' old rows (RLS has no DELETE policy).
CREATE OR REPLACE FUNCTION purge_old_app_logs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.app_logs WHERE created_at < now() - interval '30 days') THEN
    DELETE FROM public.app_logs WHERE created_at < now() - interval '30 days';
  END IF;
  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION purge_old_app_logs() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS app_logs_purge_old ON app_logs;
CREATE TRIGGER app_logs_purge_old
  AFTER INSERT ON app_logs
  FOR EACH STATEMENT EXECUTE FUNCTION purge_old_app_logs();

COMMENT ON TABLE app_logs IS 'Sanitized client errors/warnings (no personal data), kept 30 days';
