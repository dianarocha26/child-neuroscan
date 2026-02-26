import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '../lib/logger';
import { handleError, getUserMessage } from '../lib/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    const appError = handleError(error, {
      component: errorInfo?.componentStack,
      errorCount: this.state.errorCount + 1
    });

    logger.error('Error caught by boundary', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      errorCount: this.state.errorCount + 1
    });

    this.setState(prevState => ({
      error: appError,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    this.props.onError?.(error, errorInfo);

    if (this.state.errorCount >= 3) {
      logger.error('Multiple errors detected, preventing automatic retry');
    }
  }

  componentWillUnmount() {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }

  handleReset = () => {
    logger.info('Error boundary reset triggered');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    this.props.onReset?.();
  };

  handleGoHome = () => {
    logger.info('Navigating to home from error boundary');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const userMessage = this.state.error ? getUserMessage(this.state.error) : 'An unexpected error occurred';
      const showTryAgain = this.state.errorCount < 3;

      return (
        <div
          className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-2xl w-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
              <div
                className="flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-6"
                aria-hidden="true"
              >
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
                Oops! Something went wrong
              </h1>

              <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                {userMessage}
              </p>

              {this.state.error && import.meta.env.DEV && (
                <details className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <summary className="text-sm font-semibold text-red-800 dark:text-red-300 cursor-pointer">
                    Error Details (Development Only)
                  </summary>
                  <p className="text-sm font-mono text-red-800 dark:text-red-300 break-all mt-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.error.stack && (
                    <pre className="text-xs text-red-700 dark:text-red-400 mt-2 overflow-auto">
                      {this.state.error.stack}
                    </pre>
                  )}
                </details>
              )}

              {this.state.errorCount >= 3 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    Multiple errors detected. Please refresh the page or contact support if the problem persists.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {showTryAgain && (
                  <button
                    onClick={this.handleReset}
                    className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    aria-label="Try again"
                  >
                    <RefreshCw className="w-5 h-5" aria-hidden="true" />
                    Try Again
                  </button>
                )}

                <button
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  aria-label="Go to home page"
                >
                  <Home className="w-5 h-5" aria-hidden="true" />
                  Go Home
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  If this problem persists, please try:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-3 space-y-2" role="list">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" aria-hidden="true"></span>
                    Refreshing the page
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" aria-hidden="true"></span>
                    Clearing your browser cache
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" aria-hidden="true"></span>
                    Using a different browser
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
