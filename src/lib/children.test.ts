import { describe, it, expect, vi } from 'vitest';

vi.mock('./supabase', () => ({ supabase: {} }));

import { ageInMonths } from './children';

describe('ageInMonths', () => {
  const today = new Date(2026, 8, 26); // 26 Sep 2026, local

  it('counts whole months', () => {
    expect(ageInMonths('2024-09-26', today)).toBe(24);
    expect(ageInMonths('2024-09-27', today)).toBe(23);
    expect(ageInMonths('2026-09-01', today)).toBe(0);
  });

  it('returns null for missing, invalid or future dates', () => {
    expect(ageInMonths(null, today)).toBeNull();
    expect(ageInMonths('nope', today)).toBeNull();
    expect(ageInMonths('2026-10-01', today)).toBeNull();
  });
});
