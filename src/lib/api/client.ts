import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../supabase';

/**
 * The one error type thrown by src/lib/api. `action` says what failed in
 * plain words ("load goals"); the Supabase error is kept as `cause` for logs.
 * Components catch it, log it and show a friendly message.
 */
export class DataError extends Error {
  readonly action: string;
  readonly code: string | undefined;
  readonly cause: PostgrestError | Error | null | undefined;

  constructor(action: string, cause?: PostgrestError | Error | null) {
    super(`Could not ${action}${cause?.message ? `: ${cause.message}` : ''}`);
    this.name = 'DataError';
    this.cause = cause;
    this.action = action;
    this.code = cause && 'code' in cause ? cause.code : undefined;
  }
}

// data is typed T | null (not T) so TS infers T correctly from a Supabase
// response even though its real type is a { data: T; error: null } |
// { data: null; error: PostgrestError } union (e.g. from .single()).
type Result<T> = { data: T | null; error: PostgrestError | null };

/** For .single() and insert/update + select: the row, or a DataError. */
export function unwrap<T>(result: Result<T>, action: string): T {
  if (result.error) throw new DataError(action, result.error);
  if (result.data === null) throw new DataError(action);
  return result.data;
}

/** For .maybeSingle(): the row, null if there is none, or a DataError. */
export function unwrapMaybe<T>(result: Result<T>, action: string): T | null {
  if (result.error) throw new DataError(action, result.error);
  return result.data;
}

/** For list queries: the rows (never null) or a DataError. */
export function unwrapList<T>(result: Result<T[]>, action: string): T[] {
  return unwrapMaybe(result, action) ?? [];
}

/** Same as unwrap, for writes whose data isn't needed. */
export function check(result: { error: PostgrestError | null }, action: string): void {
  if (result.error) throw new DataError(action, result.error);
}

/** The signed-in user's id, or a DataError if there is none. */
export async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new DataError('find the signed-in user', error);
  return data.user.id;
}
