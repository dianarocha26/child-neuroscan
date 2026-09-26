import { supabase } from '../supabase';
import type { TablesInsert, TablesUpdate } from '../../types/supabase';
import type { CrisisPlan, CrisisContact, CalmingStrategy } from '../../types/components';
import { check, requireUserId, unwrapList } from './client';

export type { CrisisPlan, CrisisContact, CalmingStrategy };

export type CrisisPlanInput = Omit<TablesInsert<'crisis_plans'>, 'user_id' | 'id' | 'created_at'>;
export type CrisisPlanChanges = TablesUpdate<'crisis_plans'>;

export type CrisisContactInput = Omit<TablesInsert<'crisis_contacts'>, 'user_id' | 'id' | 'created_at'>;
export type CrisisContactChanges = TablesUpdate<'crisis_contacts'>;

export type CalmingStrategyInput = Omit<TablesInsert<'calming_strategies'>, 'user_id' | 'id' | 'created_at'>;
export type CalmingStrategyChanges = TablesUpdate<'calming_strategies'>;

export interface CrisisData {
  plans: CrisisPlan[];
  contacts: CrisisContact[];
  strategies: CalmingStrategy[];
}

export async function loadCrisisData(): Promise<CrisisData> {
  const userId = await requireUserId();
  const [plansRes, contactsRes, strategiesRes] = await Promise.all([
    supabase.from('crisis_plans').select('*').eq('user_id', userId),
    supabase.from('crisis_contacts').select('*').eq('user_id', userId).order('priority_order'),
    supabase.from('calming_strategies').select('*').eq('user_id', userId)
  ]);
  return {
    plans: unwrapList(plansRes, 'load crisis plans'),
    contacts: unwrapList(contactsRes, 'load emergency contacts'),
    strategies: unwrapList(strategiesRes, 'load calming strategies')
  };
}

export async function createCrisisPlan(input: CrisisPlanInput): Promise<void> {
  const userId = await requireUserId();
  check(await supabase.from('crisis_plans').insert({ ...input, user_id: userId }), 'save the crisis plan');
}

export async function updateCrisisPlan(id: string, changes: CrisisPlanChanges): Promise<void> {
  check(await supabase.from('crisis_plans').update(changes).eq('id', id), 'save the crisis plan');
}

export async function deleteCrisisPlan(id: string): Promise<void> {
  check(await supabase.from('crisis_plans').delete().eq('id', id), 'delete the crisis plan');
}

export async function createCrisisContact(input: CrisisContactInput): Promise<void> {
  const userId = await requireUserId();
  check(await supabase.from('crisis_contacts').insert({ ...input, user_id: userId }), 'save the contact');
}

export async function updateCrisisContact(id: string, changes: CrisisContactChanges): Promise<void> {
  check(await supabase.from('crisis_contacts').update(changes).eq('id', id), 'save the contact');
}

export async function deleteCrisisContact(id: string): Promise<void> {
  check(await supabase.from('crisis_contacts').delete().eq('id', id), 'delete the contact');
}

export async function createCalmingStrategy(input: CalmingStrategyInput): Promise<void> {
  const userId = await requireUserId();
  check(await supabase.from('calming_strategies').insert({ ...input, user_id: userId }), 'save the calming strategy');
}

export async function updateCalmingStrategy(id: string, changes: CalmingStrategyChanges): Promise<void> {
  check(await supabase.from('calming_strategies').update(changes).eq('id', id), 'save the calming strategy');
}

export async function deleteCalmingStrategy(id: string): Promise<void> {
  check(await supabase.from('calming_strategies').delete().eq('id', id), 'delete the calming strategy');
}
