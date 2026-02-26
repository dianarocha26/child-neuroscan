import { supabase } from './supabase';

export async function fetchUserData<T>(
  table: string,
  userId: string,
  options?: {
    orderBy?: { column: string; ascending?: boolean };
    select?: string;
    limit?: number;
  }
): Promise<{ data: T[] | null; error: Error | null }> {
  try {
    let query = supabase
      .from(table)
      .select(options?.select || '*')
      .eq('user_id', userId);

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data: data as T[], error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error')
    };
  }
}

export async function insertUserData<T>(
  table: string,
  data: Partial<T>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data: inserted, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;

    return { data: inserted as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error')
    };
  }
}

export async function updateUserData<T>(
  table: string,
  id: string,
  data: Partial<T>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data: updated, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { data: updated as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error')
    };
  }
}

export async function deleteUserData(
  table: string,
  id: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (err) {
    return {
      error: err instanceof Error ? err : new Error('Unknown error')
    };
  }
}

export async function fetchPublicData<T>(
  table: string,
  options?: {
    orderBy?: { column: string; ascending?: boolean };
    select?: string;
    limit?: number;
    filter?: { column: string; value: unknown };
  }
): Promise<{ data: T[] | null; error: Error | null }> {
  try {
    let query = supabase
      .from(table)
      .select(options?.select || '*');

    if (options?.filter) {
      query = query.eq(options.filter.column, options.filter.value);
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data: data as T[], error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error')
    };
  }
}
