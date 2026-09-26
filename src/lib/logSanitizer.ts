// What may leave the browser for app_logs. Log arguments often carry user
// content (child names, notes, emails echoed in Postgres error messages), so
// only developer-written text and non-identifying error codes are kept.

export type LogLevel = 'log' | 'error' | 'warn' | 'info';

export interface SafeLogEntry {
  level: LogLevel;
  message: string;
  data: { name?: string; code?: string; status?: number } | null;
}

const MAX_MESSAGE_LENGTH = 200;
const MAX_FIELD_LENGTH = 50;
// Short identifiers only (e.g. "TypeError").
const SAFE_TOKEN = /^[A-Za-z0-9_.-]+$/;
// PostgREST ("PGRST116") and Postgres SQLSTATE ("23505") codes only, so a
// logged data row's own `code` field is never stored.
const ERROR_CODE = /^(PGRST\d{3}|[0-9A-Z]{5})$/;

function safeToken(value: unknown): string | undefined {
  if (typeof value !== 'string' && typeof value !== 'number') return undefined;
  const text = String(value);
  return text.length <= MAX_FIELD_LENGTH && SAFE_TOKEN.test(text) ? text : undefined;
}

function errorSummary(args: unknown[]): SafeLogEntry['data'] {
  for (const arg of args) {
    if (!arg || typeof arg !== 'object') continue;
    const source = arg as Record<string, unknown>;
    const name = arg instanceof Error ? safeToken(arg.name) : undefined;
    const code = typeof source.code === 'string' && ERROR_CODE.test(source.code) ? source.code : undefined;
    const status = typeof source.status === 'number' ? source.status : undefined;
    if (name || code || status !== undefined) {
      return {
        ...(name && { name }),
        ...(code && { code }),
        ...(status !== undefined && { status }),
      };
    }
  }
  return null;
}

// Only the first argument, and only when it is a string literal-style message
// written by us. Everything after it (objects, ids, error messages) is dropped.
export function sanitizeLogEntry(level: LogLevel, args: unknown[]): SafeLogEntry {
  const first = args[0];
  const message = typeof first === 'string' && first.trim()
    ? first.slice(0, MAX_MESSAGE_LENGTH)
    : '(no message)';
  return { level, message, data: errorSummary(args) };
}

// Info and debug logs stay in the console; only problems are stored.
export function shouldPersist(level: LogLevel): boolean {
  return level === 'error' || level === 'warn';
}
