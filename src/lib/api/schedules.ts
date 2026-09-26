import { supabase } from '../supabase';
import type { Tables, TablesInsert, TablesUpdate } from '../../types/supabase';
import { check, DataError, unwrapList } from './client';

export type VisualSchedule = Tables<'visual_schedules'>;
export type Activity = Tables<'schedule_activities'>;
export type ActivityTemplate = Tables<'activity_templates'>;

export type ScheduleInput = Omit<TablesInsert<'visual_schedules'>, 'user_id' | 'id' | 'created_at' | 'updated_at'>;
export type ScheduleChanges = Omit<TablesUpdate<'visual_schedules'>, 'id' | 'user_id' | 'created_at'>;

export type ActivityInput = Omit<TablesInsert<'schedule_activities'>, 'id' | 'created_at'>;
export type ActivityChanges = Omit<TablesUpdate<'schedule_activities'>, 'id' | 'created_at' | 'schedule_id'>;

export async function listSchedules(userId: string): Promise<VisualSchedule[]> {
  return unwrapList(
    await supabase.from('visual_schedules').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    'load schedules'
  );
}

export async function listActivityTemplates(): Promise<ActivityTemplate[]> {
  return unwrapList(
    await supabase.from('activity_templates').select('*').eq('is_public', true).order('category', { ascending: true }),
    'load activity templates'
  );
}

export async function listScheduleActivities(scheduleId: string): Promise<Activity[]> {
  return unwrapList(
    await supabase.from('schedule_activities').select('*').eq('schedule_id', scheduleId).order('activity_order'),
    'load schedule activities'
  );
}

export async function createSchedule(userId: string, input: ScheduleInput): Promise<VisualSchedule> {
  const rows = unwrapList(
    await supabase.from('visual_schedules').insert({ ...input, user_id: userId }).select(),
    'save the schedule'
  );
  const created = rows[0];
  if (!created) throw new DataError('save the schedule');
  return created;
}

export async function updateSchedule(id: string, changes: ScheduleChanges): Promise<void> {
  check(await supabase.from('visual_schedules').update(changes).eq('id', id), 'save the schedule');
}

export async function deleteSchedule(id: string): Promise<void> {
  check(await supabase.from('schedule_activities').delete().eq('schedule_id', id), 'delete the schedule');
  check(await supabase.from('visual_schedules').delete().eq('id', id), 'delete the schedule');
}

export async function createActivity(input: ActivityInput): Promise<void> {
  check(await supabase.from('schedule_activities').insert(input), 'save the activity');
}

export async function updateActivity(id: string, changes: ActivityChanges): Promise<void> {
  check(await supabase.from('schedule_activities').update(changes).eq('id', id), 'save the activity');
}

export async function deleteActivity(id: string): Promise<void> {
  check(await supabase.from('schedule_activities').delete().eq('id', id), 'delete the activity');
}

export async function setActivityCompleted(id: string, isCompleted: boolean): Promise<void> {
  check(await supabase.from('schedule_activities').update({ is_completed: isCompleted }).eq('id', id), 'update the activity');
}

export async function resetScheduleActivities(scheduleId: string): Promise<void> {
  check(
    await supabase.from('schedule_activities').update({ is_completed: false }).eq('schedule_id', scheduleId),
    'reset the schedule'
  );
}

/** Swaps the order of two activities (drag/reorder). */
export async function swapActivityOrder(
  a: { id: string; activity_order: number },
  b: { id: string; activity_order: number }
): Promise<void> {
  check(
    await supabase.from('schedule_activities').update({ activity_order: b.activity_order }).eq('id', a.id),
    'reorder activities'
  );
  check(
    await supabase.from('schedule_activities').update({ activity_order: a.activity_order }).eq('id', b.id),
    'reorder activities'
  );
}
