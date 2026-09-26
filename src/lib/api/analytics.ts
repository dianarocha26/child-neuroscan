import { supabase } from '../supabase';
import type { Tables } from '../../types/supabase';
import { unwrapList } from './client';

export type BehaviorPattern = Tables<'analytics_behavior_patterns'>;
export type Correlation = Tables<'analytics_correlations'>;
export type WeeklySummary = Tables<'analytics_weekly_summaries'>;
export type TriggerAnalysis = Tables<'analytics_trigger_analysis'>;

export async function listBehaviorPatterns(userId: string, sinceIso: string): Promise<BehaviorPattern[]> {
  return unwrapList(
    await supabase
      .from('analytics_behavior_patterns')
      .select('*')
      .eq('user_id', userId)
      .gte('time_range_start', sinceIso)
      .order('frequency', { ascending: false })
      .limit(10),
    'load behavior patterns'
  );
}

export async function listCorrelations(userId: string, sinceIso: string): Promise<Correlation[]> {
  return unwrapList(
    await supabase
      .from('analytics_correlations')
      .select('*')
      .eq('user_id', userId)
      .gte('date_range_start', sinceIso)
      .order('correlation_strength', { ascending: false })
      .limit(5),
    'load correlations'
  );
}

export async function listWeeklySummaries(userId: string, sinceDate: string): Promise<WeeklySummary[]> {
  return unwrapList(
    await supabase
      .from('analytics_weekly_summaries')
      .select('*')
      .eq('user_id', userId)
      .gte('week_start_date', sinceDate)
      .order('week_start_date', { ascending: false })
      .limit(8),
    'load weekly summaries'
  );
}

export async function listTriggerAnalysis(userId: string): Promise<TriggerAnalysis[]> {
  return unwrapList(
    await supabase
      .from('analytics_trigger_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('total_occurrences', { ascending: false })
      .limit(10),
    'load trigger analysis'
  );
}
