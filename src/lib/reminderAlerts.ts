import type { Reminder } from './api/reminders';

/** Reminders more overdue than this are not alerted (avoids a burst on first load). */
export const ALERT_WINDOW_MS = 24 * 60 * 60 * 1000;

/** Changes when the reminder's date or time is edited, so an edited reminder alerts again. */
export const alertKey = (r: Pick<Reminder, 'id' | 'reminder_date' | 'reminder_time'>) =>
  `${r.id}:${r.reminder_date}T${r.reminder_time.slice(0, 5)}`;

/** Local wall-clock time the reminder is due. */
export const dueAt = (r: Pick<Reminder, 'reminder_date' | 'reminder_time'>) =>
  new Date(`${r.reminder_date}T${r.reminder_time.slice(0, 5)}:00`);

/** Active reminders that are due now (within the alert window) and not alerted yet. */
export function dueReminders(reminders: Reminder[], now: Date, alerted: ReadonlySet<string>): Reminder[] {
  return reminders.filter((r) => {
    if (!r.is_active || alerted.has(alertKey(r))) return false;
    const age = now.getTime() - dueAt(r).getTime();
    return age >= 0 && age <= ALERT_WINDOW_MS;
  });
}
