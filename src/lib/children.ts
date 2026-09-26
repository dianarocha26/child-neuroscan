import { supabase } from './supabase';
import type { Tables } from '../types/supabase';

export type Child = Tables<'children'>;

export async function getChildren(userId: string): Promise<Child[]> {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');
  if (error) throw error;
  return data || [];
}

export async function addChild(userId: string, childName: string, dateOfBirth: string): Promise<Child> {
  const { data, error } = await supabase
    .from('children')
    .insert({ user_id: userId, child_name: childName.trim(), date_of_birth: dateOfBirth })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateChild(id: string, childName: string, dateOfBirth: string): Promise<void> {
  const { error } = await supabase
    .from('children')
    .update({ child_name: childName.trim(), date_of_birth: dateOfBirth, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteChild(id: string): Promise<void> {
  const { error } = await supabase.from('children').delete().eq('id', id);
  if (error) throw error;
}

/** Whole months between a 'YYYY-MM-DD' birth date and `today` (local). Null if unknown/future. */
export function ageInMonths(dateOfBirth: string | null, today: Date = new Date()): number | null {
  const match = dateOfBirth ? /^(\d{4})-(\d{2})-(\d{2})/.exec(dateOfBirth) : null;
  if (!match) return null;
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  let months = (today.getFullYear() - y) * 12 + (today.getMonth() + 1 - m);
  if (today.getDate() < d) months -= 1;
  return months >= 0 ? months : null;
}
