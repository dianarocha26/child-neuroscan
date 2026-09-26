import { supabase } from '../supabase';
import type { Tables, TablesInsert } from '../../types/supabase';
import { check, unwrapList } from './client';

// Sensitivity columns have no CHECK constraint in the sensory_profiles
// migration, so they stay plain strings here rather than a literal union.
export type SensoryProfile = Tables<'sensory_profiles'>;

export type SensoryProfileInput = Omit<TablesInsert<'sensory_profiles'>, 'user_id' | 'id' | 'created_at' | 'updated_at'>;

export async function listSensoryProfiles(userId: string): Promise<SensoryProfile[]> {
  return unwrapList(
    await supabase.from('sensory_profiles').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    'load sensory profiles'
  );
}

export async function createSensoryProfile(userId: string, input: SensoryProfileInput): Promise<void> {
  check(await supabase.from('sensory_profiles').insert({ ...input, user_id: userId }), 'save the sensory profile');
}
