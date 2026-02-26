import { supabase } from './supabase';

const isDevelopment = import.meta.env.DEV;

interface LogEntry {
  level: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
  data?: unknown;
  user_id?: string;
}

async function logToDatabase(entry: LogEntry) {
  if (!isDevelopment) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('app_logs').insert({
        level: entry.level,
        message: entry.message,
        timestamp: entry.timestamp,
        data: entry.data,
        user_id: user?.id,
      });
    } catch (error) {
      console.error('Failed to log to database:', error);
    }
  }
}

export const logger = {
  log: (...args: unknown[]) => {
    const message = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');

    if (isDevelopment) {
      console.log(...args);
    }

    logToDatabase({
      level: 'log',
      message,
      timestamp: new Date().toISOString(),
      data: args.length > 0 ? args[0] : undefined,
    });
  },

  error: (...args: unknown[]) => {
    const message = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');

    console.error(...args);

    logToDatabase({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      data: args.length > 0 ? args[0] : undefined,
    });
  },

  warn: (...args: unknown[]) => {
    const message = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');

    if (isDevelopment) {
      console.warn(...args);
    }

    logToDatabase({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      data: args.length > 0 ? args[0] : undefined,
    });
  },

  info: (...args: unknown[]) => {
    const message = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');

    if (isDevelopment) {
      console.info(...args);
    }

    logToDatabase({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      data: args.length > 0 ? args[0] : undefined,
    });
  }
};
