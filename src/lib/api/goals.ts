import { supabase } from '../supabase';
import type { Tables, TablesInsert, TablesUpdate } from '../../types/supabase';
import { check, requireUserId, unwrapList } from './client';

// Allowed values match the CHECK constraints in
// 20260220024504_create_goal_tracking_schema.sql.
export type GoalCategory = 'speech' | 'motor' | 'social' | 'behavioral' | 'academic' | 'self-care';
export type GoalStatus = 'not_started' | 'in_progress' | 'achieved' | 'archived';
export type GoalPriority = 'low' | 'medium' | 'high';

export type Goal = Omit<Tables<'goals'>, 'category' | 'status' | 'priority'> & {
  category: GoalCategory;
  status: GoalStatus;
  priority: GoalPriority;
};
export type GoalProgressLog = Tables<'goal_progress_logs'>;

/** Goal fields the user edits; user_id is added here. */
export type GoalInput = Omit<TablesInsert<'goals'>, 'user_id' | 'id' | 'created_at' | 'updated_at'> & {
  category: GoalCategory;
  status?: GoalStatus;
  priority?: GoalPriority;
};

export type GoalChanges = Omit<TablesUpdate<'goals'>, 'id' | 'user_id' | 'created_at' | 'category' | 'status' | 'priority'> &
  Partial<Pick<Goal, 'category' | 'status' | 'priority'>>;

const toGoal = (row: Tables<'goals'>): Goal => ({
  ...row,
  category: row.category as GoalCategory,
  status: row.status as GoalStatus,
  priority: row.priority as GoalPriority
});

export async function listGoals(): Promise<Goal[]> {
  const userId = await requireUserId();
  const rows = unwrapList(
    await supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    'load goals'
  );
  return rows.map(toGoal);
}

export async function listGoalProgress(goalId: string): Promise<GoalProgressLog[]> {
  return unwrapList(
    await supabase.from('goal_progress_logs').select('*').eq('goal_id', goalId).order('logged_at', { ascending: false }),
    'load goal progress'
  );
}

export async function createGoal(input: GoalInput): Promise<void> {
  const userId = await requireUserId();
  check(await supabase.from('goals').insert({ ...input, user_id: userId }), 'save the goal');
}

export async function updateGoal(id: string, changes: GoalChanges): Promise<void> {
  check(await supabase.from('goals').update(changes).eq('id', id), 'save the goal');
}

export async function deleteGoal(id: string): Promise<void> {
  check(await supabase.from('goals').delete().eq('id', id), 'delete the goal');
}

/** Logs a progress value and moves the goal to in_progress/achieved. */
export async function logGoalProgress(goal: Goal, value: number, notes: string): Promise<void> {
  const userId = await requireUserId();
  check(
    await supabase.from('goal_progress_logs').insert({ goal_id: goal.id, user_id: userId, value, notes }),
    'log progress'
  );

  const status: GoalStatus = value >= goal.target_value ? 'achieved' : 'in_progress';
  const changes: GoalChanges = { current_value: value, status };
  if (status === 'achieved' && !goal.completed_at) {
    changes.completed_at = new Date().toISOString();
  }
  await updateGoal(goal.id, changes);
}
