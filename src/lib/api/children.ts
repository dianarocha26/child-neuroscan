import { supabase } from '../supabase';
import type { Tables } from '../../types/supabase';
import { check, unwrap, unwrapList } from './client';

export type Child = Tables<'children'>;

export async function getChildren(userId: string): Promise<Child[]> {
  return unwrapList(
    await supabase.from('children').select('*').eq('user_id', userId).order('created_at'),
    'load children'
  );
}

export async function addChild(userId: string, childName: string, dateOfBirth: string): Promise<Child> {
  return unwrap(
    await supabase
      .from('children')
      .insert({ user_id: userId, child_name: childName.trim(), date_of_birth: dateOfBirth })
      .select()
      .single(),
    'add child'
  );
}

export async function updateChild(id: string, childName: string, dateOfBirth: string): Promise<void> {
  check(
    await supabase
      .from('children')
      .update({ child_name: childName.trim(), date_of_birth: dateOfBirth, updated_at: new Date().toISOString() })
      .eq('id', id),
    'update child'
  );
}

export async function deleteChild(id: string): Promise<void> {
  check(await supabase.from('children').delete().eq('id', id), 'remove child');
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
