import { logger } from './logger';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AppError extends Error {
  severity: ErrorSeverity;
  context?: Record<string, any>;
  userMessage?: string;
  recoverable?: boolean;
}

export class ValidationError extends Error implements AppError {
  severity: ErrorSeverity = 'low';
  recoverable = true;
  context?: Record<string, any>;
  userMessage: string;

  constructor(message: string, userMessage?: string, context?: Record<string, any>) {
    super(message);
    this.name = 'ValidationError';
    this.userMessage = userMessage || message;
    this.context = context;
  }
}

export class NetworkError extends Error implements AppError {
  severity: ErrorSeverity = 'medium';
  recoverable = true;
  context?: Record<string, any>;
  userMessage: string;

  constructor(message: string, userMessage?: string, context?: Record<string, any>) {
    super(message);
    this.name = 'NetworkError';
    this.userMessage = userMessage || 'Network connection issue. Please check your internet and try again.';
    this.context = context;
  }
}

export class DatabaseError extends Error implements AppError {
  severity: ErrorSeverity = 'high';
  recoverable = true;
  context?: Record<string, any>;
  userMessage: string;

  constructor(message: string, userMessage?: string, context?: Record<string, any>) {
    super(message);
    this.name = 'DatabaseError';
    this.userMessage = userMessage || 'Unable to access data. Please try again later.';
    this.context = context;
  }
}

export class AuthenticationError extends Error implements AppError {
  severity: ErrorSeverity = 'medium';
  recoverable = true;
  context?: Record<string, any>;
  userMessage: string;

  constructor(message: string, userMessage?: string, context?: Record<string, any>) {
    super(message);
    this.name = 'AuthenticationError';
    this.userMessage = userMessage || 'Authentication failed. Please log in again.';
    this.context = context;
  }
}

export class UnexpectedError extends Error implements AppError {
  severity: ErrorSeverity = 'critical';
  recoverable = false;
  context?: Record<string, any>;
  userMessage: string;

  constructor(message: string, userMessage?: string, context?: Record<string, any>) {
    super(message);
    this.name = 'UnexpectedError';
    this.userMessage = userMessage || 'An unexpected error occurred. Please refresh the page.';
    this.context = context;
  }
}

export function handleError(error: Error | AppError, context?: Record<string, any>): AppError {
  const appError = error as AppError;

  if (!appError.severity) {
    return new UnexpectedError(error.message, undefined, context);
  }

  logger.error(error.message, {
    ...context,
    ...appError.context,
    severity: appError.severity,
    recoverable: appError.recoverable
  });

  return appError;
}

export function getUserMessage(error: Error | AppError): string {
  const appError = error as AppError;
  return appError.userMessage || 'An error occurred. Please try again.';
}

export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: Record<string, any>
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    const appError = handleError(error as Error, context);
    return { data: null, error: appError };
  }
}

export function isNetworkError(error: any): boolean {
  return (
    error instanceof NetworkError ||
    error.name === 'NetworkError' ||
    error.message?.includes('network') ||
    error.message?.includes('fetch') ||
    !navigator.onLine
  );
}

export function shouldRetry(error: AppError, retryCount: number, maxRetries = 3): boolean {
  if (retryCount >= maxRetries) return false;
  if (!error.recoverable) return false;

  return isNetworkError(error) || error.severity === 'medium';
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
  context?: Record<string, any>
): Promise<T> {
  let lastError: AppError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = handleError(error as Error, { ...context, attempt });

      if (attempt < maxRetries && shouldRetry(lastError, attempt, maxRetries)) {
        const delay = baseDelay * Math.pow(2, attempt);
        logger.info(`Retrying after ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        break;
      }
    }
  }

  throw lastError || new UnexpectedError('Retry failed', undefined, context);
}
