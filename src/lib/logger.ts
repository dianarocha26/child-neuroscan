import { supabase } from './supabase';
import { sanitizeLogEntry, shouldPersist, type LogLevel } from './logSanitizer';

const isDevelopment = import.meta.env.DEV;

// Stores a sanitized entry only: see logSanitizer for what is kept.
async function logToDatabase(level: LogLevel, args: unknown[]) {
  if (isDevelopment || !shouldPersist(level)) return;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const entry = sanitizeLogEntry(level, args);
    await supabase.from('app_logs').insert({
      level: entry.level,
      message: entry.message,
      timestamp: new Date().toISOString(),
      data: entry.data,
      user_id: session?.user.id ?? null,
    });
  } catch (error) {
    console.error('Failed to log to database:', error);
  }
}

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) console.log(...args);
    logToDatabase('log', args);
  },

  error: (...args: unknown[]) => {
    console.error(...args);
    logToDatabase('error', args);
  },

  warn: (...args: unknown[]) => {
    if (isDevelopment) console.warn(...args);
    logToDatabase('warn', args);
  },

  info: (...args: unknown[]) => {
    if (isDevelopment) console.info(...args);
    logToDatabase('info', args);
  },
};
