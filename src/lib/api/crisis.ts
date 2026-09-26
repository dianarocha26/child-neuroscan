import { supabase } from '../supabase';
import type { Tables, TablesInsert, TablesUpdate } from '../../types/supabase';
import { check, unwrapList } from './client';

export type CrisisPlan = Tables<'crisis_plans'>;
export type CrisisContact = Tables<'crisis_contacts'>;
export type CalmingStrategy = Tables<'calming_strategies'>;

export type CrisisPlanInput = Omit<TablesInsert<'crisis_plans'>, 'user_id' | 'id' | 'created_at'>;
export type CrisisPlanChanges = Omit<TablesUpdate<'crisis_plans'>, 'id' | 'user_id' | 'created_at'>;

export type CrisisContactInput = Omit<TablesInsert<'crisis_contacts'>, 'user_id' | 'id' | 'created_at'>;
export type CrisisContactChanges = Omit<TablesUpdate<'crisis_contacts'>, 'id' | 'user_id' | 'created_at'>;

export type CalmingStrategyInput = Omit<TablesInsert<'calming_strategies'>, 'user_id' | 'id' | 'created_at'>;
export type CalmingStrategyChanges = Omit<TablesUpdate<'calming_strategies'>, 'id' | 'user_id' | 'created_at'>;

export async function listCrisisPlans(userId: string): Promise<CrisisPlan[]> {
  return unwrapList(
    await supabase.from('crisis_plans').select('*').eq('user_id', userId),
    'load crisis plans'
  );
}

export async function listCrisisContacts(userId: string): Promise<CrisisContact[]> {
  return unwrapList(
    await supabase.from('crisis_contacts').select('*').eq('user_id', userId).order('priority_order'),
    'load emergency contacts'
  );
}

export async function listCalmingStrategies(userId: string): Promise<CalmingStrategy[]> {
  return unwrapList(
    await supabase.from('calming_strategies').select('*').eq('user_id', userId),
    'load calming strategies'
  );
}

export async function createCrisisPlan(userId: string, input: CrisisPlanInput): Promise<void> {
  check(await supabase.from('crisis_plans').insert({ ...input, user_id: userId }), 'save the crisis plan');
}

export async function updateCrisisPlan(id: string, changes: CrisisPlanChanges): Promise<void> {
  check(await supabase.from('crisis_plans').update(changes).eq('id', id), 'save the crisis plan');
}

export async function deleteCrisisPlan(id: string): Promise<void> {
  check(await supabase.from('crisis_plans').delete().eq('id', id), 'delete the crisis plan');
}

export async function createCrisisContact(userId: string, input: CrisisContactInput): Promise<void> {
  check(await supabase.from('crisis_contacts').insert({ ...input, user_id: userId }), 'save the contact');
}

export async function updateCrisisContact(id: string, changes: CrisisContactChanges): Promise<void> {
  check(await supabase.from('crisis_contacts').update(changes).eq('id', id), 'save the contact');
}

export async function deleteCrisisContact(id: string): Promise<void> {
  check(await supabase.from('crisis_contacts').delete().eq('id', id), 'delete the contact');
}

export async function createCalmingStrategy(userId: string, input: CalmingStrategyInput): Promise<void> {
  check(await supabase.from('calming_strategies').insert({ ...input, user_id: userId }), 'save the calming strategy');
}

export async function updateCalmingStrategy(id: string, changes: CalmingStrategyChanges): Promise<void> {
  check(await supabase.from('calming_strategies').update(changes).eq('id', id), 'save the calming strategy');
}

export async function deleteCalmingStrategy(id: string): Promise<void> {
  check(await supabase.from('calming_strategies').delete().eq('id', id), 'delete the calming strategy');
}
