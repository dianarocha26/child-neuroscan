import type { Json } from '../types/supabase';

// Same serialization the Supabase client applies to request bodies:
// undefined keys are dropped, Errors become {}, circular values throw.
export function toJson(value: unknown): Json | undefined {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value)) as Json;
}
