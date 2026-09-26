import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  formatDateOnly,
  fromDateTimeLocalInput,
  localToday,
  toDateTimeLocalInput,
  toLocalDateString,
} from './dates';

// Node re-reads process.env.TZ on assignment, so each block can run the same
// assertions under a different zone. The default for the run is set in
// vitest.config.ts.
const ORIGINAL_TZ = process.env.TZ;

function inTimeZone(tz: string) {
  beforeAll(() => {
    process.env.TZ = tz;
  });
  afterAll(() => {
    process.env.TZ = ORIGINAL_TZ;
  });
}

const ZONES = ['UTC', 'America/Los_Angeles', 'Asia/Tokyo', 'Pacific/Kiritimati'] as const;

describe.each(ZONES)('date helpers in %s', (tz) => {
  inTimeZone(tz);

  afterEach(() => {
    vi.useRealTimers();
  });

  it('localToday returns the local calendar date, not the UTC one', () => {
    vi.useFakeTimers();
    // 23:30 local on 2024-06-15 in whatever zone we are in.
    vi.setSystemTime(new Date(2024, 5, 15, 23, 30));
    expect(localToday()).toBe('2024-06-15');
    vi.setSystemTime(new Date(2024, 0, 1, 0, 5));
    expect(localToday()).toBe('2024-01-01');
  });

  it('toLocalDateString zero-pads month and day', () => {
    expect(toLocalDateString(new Date(2024, 0, 5))).toBe('2024-01-05');
    expect(toLocalDateString(new Date(1999, 11, 31, 23, 59))).toBe('1999-12-31');
  });

  it('formatDateOnly keeps the stored calendar day (no UTC-midnight shift)', () => {
    expect(formatDateOnly('2024-03-10', { day: 'numeric' })).toBe('10');
    expect(formatDateOnly('2024-01-01', { year: 'numeric', month: 'numeric', day: 'numeric' })).toBe(
      new Date(2024, 0, 1).toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })
    );
    // A trailing time component is ignored; only the date prefix is used.
    expect(formatDateOnly('2024-12-31T23:59:59Z', { day: 'numeric', month: 'numeric' })).toBe(
      new Date(2024, 11, 31).toLocaleDateString(undefined, { day: 'numeric', month: 'numeric' })
    );
  });

  it.each([
    '2024-06-01T10:30',
    '2024-01-01T00:00',
    '2024-12-31T23:59',
    '2024-02-29T12:00',
    '2024-11-03T01:30', // ambiguous hour in US zones (DST fall-back)
  ])('datetime-local round-trips through an ISO instant: %s', (value) => {
    const iso = fromDateTimeLocalInput(value);
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(toDateTimeLocalInput(iso)).toBe(value);
  });

  it('fromDateTimeLocalInput stores the local wall time as the matching instant', () => {
    expect(new Date(fromDateTimeLocalInput('2024-06-01T10:30')).getTime()).toBe(
      new Date(2024, 5, 1, 10, 30).getTime()
    );
  });

  it('toDateTimeLocalInput renders an instant in local wall time', () => {
    const instant = new Date(2024, 6, 4, 9, 5);
    expect(toDateTimeLocalInput(instant.toISOString())).toBe('2024-07-04T09:05');
  });
});

describe('explicit zone conversions', () => {
  describe('America/Los_Angeles', () => {
    inTimeZone('America/Los_Angeles');

    it('converts local input to UTC with the PDT offset', () => {
      expect(fromDateTimeLocalInput('2024-06-01T18:30')).toBe('2024-06-02T01:30:00.000Z');
    });

    it('shows an evening-UTC timestamp on the previous local day', () => {
      expect(toDateTimeLocalInput('2024-06-02T01:30:00.000Z')).toBe('2024-06-01T18:30');
      expect(toDateTimeLocalInput('2024-06-02T01:30:00+00:00')).toBe('2024-06-01T18:30');
    });

    it('formatDateOnly does not roll back a day (the classic new Date("YYYY-MM-DD") bug)', () => {
      expect(new Date('2024-03-10').getDate()).toBe(9); // what the helper avoids
      expect(formatDateOnly('2024-03-10', { day: 'numeric' })).toBe('10');
    });
  });

  describe('Asia/Tokyo', () => {
    inTimeZone('Asia/Tokyo');

    it('converts local input to UTC with the +09:00 offset', () => {
      expect(fromDateTimeLocalInput('2024-06-01T08:00')).toBe('2024-05-31T23:00:00.000Z');
      expect(toDateTimeLocalInput('2024-05-31T23:00:00.000Z')).toBe('2024-06-01T08:00');
    });
  });
});

describe('empty and invalid input', () => {
  it.each([null, undefined, ''])('toDateTimeLocalInput(%j) returns ""', (value) => {
    expect(toDateTimeLocalInput(value)).toBe('');
  });

  it.each(['not a date', '2024-13-45T99:99'])('toDateTimeLocalInput(%j) returns "" for unparseable values', (value) => {
    expect(toDateTimeLocalInput(value)).toBe('');
  });

  it.each(['', 'not a date', '2024-13-45T10:00'])('fromDateTimeLocalInput(%j) returns ""', (value) => {
    expect(fromDateTimeLocalInput(value)).toBe('');
  });

  it.each([null, undefined, ''])('formatDateOnly(%j) returns ""', (value) => {
    expect(formatDateOnly(value)).toBe('');
  });

  it('formatDateOnly passes through strings that are not YYYY-MM-DD', () => {
    // Current behaviour: non-matching input is returned unchanged (not '').
    expect(formatDateOnly('next Tuesday')).toBe('next Tuesday');
  });
});
