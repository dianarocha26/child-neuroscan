import { supabase } from '../supabase';
import type { Tables, TablesInsert, TablesUpdate } from '../../types/supabase';
import { check, unwrapList } from './client';

export type RewardChart = Tables<'reward_charts'>;
export type RewardEntry = Tables<'reward_entries'>;
export type RewardGoal = Tables<'reward_goals'>;

export type RewardChartInput = Omit<TablesInsert<'reward_charts'>, 'user_id' | 'id' | 'created_at'>;
export type RewardChartChanges = Omit<TablesUpdate<'reward_charts'>, 'id' | 'user_id' | 'created_at'>;

export type RewardEntryInput = Omit<TablesInsert<'reward_entries'>, 'id' | 'created_at' | 'chart_id'>;
export type RewardEntryChanges = Omit<TablesUpdate<'reward_entries'>, 'id' | 'created_at' | 'chart_id'>;

export type RewardGoalInput = Omit<TablesInsert<'reward_goals'>, 'id' | 'created_at' | 'chart_id' | 'is_achieved'>;
export type RewardGoalChanges = Omit<TablesUpdate<'reward_goals'>, 'id' | 'created_at' | 'chart_id'>;

export async function listRewardCharts(userId: string): Promise<RewardChart[]> {
  return unwrapList(
    await supabase.from('reward_charts').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    'load reward charts'
  );
}

export async function listRewardEntries(chartId: string): Promise<RewardEntry[]> {
  return unwrapList(
    await supabase.from('reward_entries').select('*').eq('chart_id', chartId).order('entry_date', { ascending: false }),
    'load star entries'
  );
}

export async function listRewardGoals(chartId: string): Promise<RewardGoal[]> {
  return unwrapList(
    await supabase.from('reward_goals').select('*').eq('chart_id', chartId),
    'load reward goals'
  );
}

export async function createRewardChart(userId: string, input: RewardChartInput): Promise<void> {
  check(await supabase.from('reward_charts').insert({ ...input, user_id: userId }), 'save the reward chart');
}

export async function updateRewardChart(id: string, changes: RewardChartChanges): Promise<void> {
  check(await supabase.from('reward_charts').update(changes).eq('id', id), 'save the reward chart');
}

export async function deleteRewardChart(id: string): Promise<void> {
  check(await supabase.from('reward_charts').delete().eq('id', id), 'delete the reward chart');
}

export async function rateRewardChart(id: string, isEffective: boolean | null): Promise<void> {
  check(await supabase.from('reward_charts').update({ is_effective: isEffective }).eq('id', id), 'save the rating');
}

export async function createRewardEntry(chartId: string, input: RewardEntryInput): Promise<void> {
  check(await supabase.from('reward_entries').insert({ ...input, chart_id: chartId }), 'save the star entry');
}

export async function updateRewardEntry(id: string, changes: RewardEntryChanges): Promise<void> {
  check(await supabase.from('reward_entries').update(changes).eq('id', id), 'save the star entry');
}

export async function deleteRewardEntry(id: string): Promise<void> {
  check(await supabase.from('reward_entries').delete().eq('id', id), 'delete the star entry');
}

export async function createRewardGoal(chartId: string, input: RewardGoalInput): Promise<void> {
  check(
    await supabase.from('reward_goals').insert({ ...input, chart_id: chartId, is_achieved: false }),
    'save the goal'
  );
}

export async function updateRewardGoal(id: string, changes: RewardGoalChanges): Promise<void> {
  check(await supabase.from('reward_goals').update(changes).eq('id', id), 'save the goal');
}

export async function deleteRewardGoal(id: string): Promise<void> {
  check(await supabase.from('reward_goals').delete().eq('id', id), 'delete the goal');
}
