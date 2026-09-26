import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  /** Inside a screen (e.g. ScreenWrapper) instead of taking the whole page. */
  inline?: boolean;
}

export const LOAD_ERROR_MESSAGE = "We couldn't load your data. Check your connection and try again.";

export function ErrorState({ message = 'Something went wrong', onRetry, onBack, inline = false }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={inline
        ? 'flex items-center justify-center min-h-[50vh] p-4'
        : 'min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center p-4'}
    >
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Oops!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
        <div className="flex gap-3 justify-center">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors"
              aria-label="Retry loading"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorState;
