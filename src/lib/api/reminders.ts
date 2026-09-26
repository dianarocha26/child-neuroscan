import { supabase } from '../supabase';
import type { Tables, TablesInsert } from '../../types/supabase';
import { check, unwrapList } from './client';

// Allowed values match the CHECK constraint in
// 20260926010000_reminders_type_check.sql.
export type ReminderType = 'medication' | 'appointment' | 'therapy' | 'goal' | 'other';

export type Reminder = Omit<Tables<'reminders'>, 'reminder_type'> & { reminder_type: ReminderType };

/** Fields the user edits when creating or updating a reminder. */
export type ReminderInput = Pick<
  TablesInsert<'reminders'>,
  'title' | 'description' | 'child_name' | 'reminder_date' | 'reminder_time'
> & { reminder_type: ReminderType };

const toReminder = (row: Tables<'reminders'>): Reminder => ({
  ...row,
  reminder_type: row.reminder_type as ReminderType
});

export async function listReminders(userId: string): Promise<Reminder[]> {
  const rows = unwrapList(
    await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .order('reminder_date', { ascending: true })
      .order('reminder_time', { ascending: true }),
    'load reminders'
  );
  return rows.map(toReminder);
}

export async function createReminder(userId: string, input: ReminderInput): Promise<void> {
  check(
    await supabase.from('reminders').insert({
      user_id: userId,
      ...input,
      is_active: true,
      updated_at: new Date().toISOString()
    }),
    'save the reminder'
  );
}

export async function updateReminder(id: string, input: ReminderInput): Promise<void> {
  check(
    await supabase
      .from('reminders')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id),
    'save the reminder'
  );
}

export async function setReminderActive(id: string, isActive: boolean): Promise<void> {
  check(
    await supabase.from('reminders').update({ is_active: isActive, updated_at: new Date().toISOString() }).eq('id', id),
    'update the reminder'
  );
}

export async function deleteReminder(id: string): Promise<void> {
  check(await supabase.from('reminders').delete().eq('id', id), 'delete the reminder');
}
