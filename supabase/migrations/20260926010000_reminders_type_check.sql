/*
  Limit reminders.reminder_type to the values the app offers
  (NotificationCenter ReminderType). NOT VALID: enforced for new and updated
  rows only, so existing rows with other values don't block the migration.
  goals.status/category/priority, medications.type and medication_logs.status
  already have CHECK constraints from their create migrations.
*/
ALTER TABLE reminders
  ADD CONSTRAINT reminders_reminder_type_check
  CHECK (reminder_type IN ('medication', 'appointment', 'therapy', 'goal', 'other'))
  NOT VALID;
