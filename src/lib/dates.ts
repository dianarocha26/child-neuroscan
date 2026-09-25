// Date helpers that work in the user's local time zone.
// `new Date().toISOString().split('T')[0]` is UTC and gives the wrong day
// in the evening in the Americas (and the morning in Asia/Oceania).

const pad = (n: number) => String(n).padStart(2, '0');

/** Local calendar date of `date` as 'YYYY-MM-DD'. */
export function toLocalDateString(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Today's local date as 'YYYY-MM-DD' (for `date` inputs and date columns). */
export function localToday(): string {
  return toLocalDateString(new Date());
}

/**
 * Parse a date-only 'YYYY-MM-DD' string as a local date (not UTC midnight)
 * and format it for display. Returns '' for empty/invalid input.
 */
export function formatDateOnly(value: string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!value) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString(undefined, options);
}

/**
 * Convert a timestamp (e.g. a timestamptz value from the DB) into the
 * 'YYYY-MM-DDTHH:mm' local form a `datetime-local` input expects.
 */
export function toDateTimeLocalInput(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  return `${toLocalDateString(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Convert a `datetime-local` input value (local, zone-less) to an ISO string
 * with an explicit offset so it is stored as the correct instant.
 */
export function fromDateTimeLocalInput(value: string): string {
  return new Date(value).toISOString();
}
