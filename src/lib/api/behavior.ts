import { supabase } from '../supabase';
import type { Tables, TablesInsert, TablesUpdate } from '../../types/supabase';
import { check, unwrapList } from './client';

// behavior_type has no CHECK constraint in the behavior diary migration, so
// it stays a plain string here rather than a literal union.
export type BehaviorEntry = Tables<'behavior_entries'>;
export type BehaviorTrigger = Tables<'behavior_triggers'>;
export type BehaviorIntervention = Tables<'behavior_interventions'>;

export type BehaviorEntryInput = Omit<TablesInsert<'behavior_entries'>, 'user_id' | 'id' | 'created_at'>;
export type BehaviorEntryChanges = Omit<TablesUpdate<'behavior_entries'>, 'id' | 'user_id' | 'created_at'>;

export async function listBehaviorEntries(userId: string): Promise<BehaviorEntry[]> {
  return unwrapList(
    await supabase
      .from('behavior_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })
      .order('entry_time', { ascending: false }),
    'load behavior entries'
  );
}

export async function listBehaviorTriggers(userId: string): Promise<BehaviorTrigger[]> {
  return unwrapList(
    await supabase.from('behavior_triggers').select('*').eq('user_id', userId),
    'load behavior triggers'
  );
}

export async function listBehaviorInterventions(userId: string): Promise<BehaviorIntervention[]> {
  return unwrapList(
    await supabase.from('behavior_interventions').select('*').eq('user_id', userId),
    'load behavior interventions'
  );
}

export async function createBehaviorEntry(userId: string, input: BehaviorEntryInput): Promise<void> {
  check(await supabase.from('behavior_entries').insert({ ...input, user_id: userId }), 'save the entry');
}

export async function updateBehaviorEntry(id: string, changes: BehaviorEntryChanges): Promise<void> {
  check(await supabase.from('behavior_entries').update(changes).eq('id', id), 'save the entry');
}

export async function deleteBehaviorEntry(id: string): Promise<void> {
  check(await supabase.from('behavior_entries').delete().eq('id', id), 'delete the entry');
}
