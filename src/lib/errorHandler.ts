import { logger } from './logger';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AppError extends Error {
  severity: ErrorSeverity;
  context?: Record<string, unknown>;
  userMessage?: string;
  recoverable?: boolean;
}

export class UnexpectedError extends Error implements AppError {
  severity: ErrorSeverity = 'critical';
  recoverable = false;
  context?: Record<string, unknown>;
  userMessage: string;

  constructor(message: string, userMessage?: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'UnexpectedError';
    this.userMessage = userMessage || 'An unexpected error occurred. Please refresh the page.';
    this.context = context;
  }
}

export function handleError(error: Error | AppError, context?: Record<string, unknown>): AppError {
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
