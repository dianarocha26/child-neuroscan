import { describe, expect, it } from 'vitest';
import type { Reminder } from './api/reminders';
import { alertKey, dueReminders } from './reminderAlerts';

const reminder = (over: Partial<Reminder> = {}): Reminder => ({
  id: 'r1',
  user_id: 'u1',
  title: 'Evening medication',
  description: null,
  child_name: null,
  reminder_type: 'medication',
  reminder_date: '2026-09-26',
  reminder_time: '09:00:00',
  is_active: true,
  created_at: '',
  updated_at: '',
  ...over
} as Reminder);

const at = (s: string) => new Date(s);

describe('dueReminders', () => {
  it('returns an active reminder once its time has passed', () => {
    expect(dueReminders([reminder()], at('2026-09-26T09:00:30'), new Set())).toHaveLength(1);
  });

  it('skips reminders not yet due, done, or already alerted', () => {
    const r = reminder();
    expect(dueReminders([r], at('2026-09-26T08:59:00'), new Set())).toHaveLength(0);
    expect(dueReminders([reminder({ is_active: false })], at('2026-09-26T10:00:00'), new Set())).toHaveLength(0);
    expect(dueReminders([r], at('2026-09-26T10:00:00'), new Set([alertKey(r)]))).toHaveLength(0);
  });

  it('skips reminders more than a day overdue', () => {
    expect(dueReminders([reminder()], at('2026-09-27T09:01:00'), new Set())).toHaveLength(0);
  });

  it('alerts again after the time is edited', () => {
    const before = reminder();
    const after = reminder({ reminder_time: '10:00' });
    expect(dueReminders([after], at('2026-09-26T10:00:00'), new Set([alertKey(before)]))).toHaveLength(1);
  });
});
