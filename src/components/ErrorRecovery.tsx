import { AlertTriangle, RefreshCw, Home, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ErrorRecoveryProps {
  error: Error;
  resetError: () => void;
  onGoHome?: () => void;
}

export function ErrorRecovery({ error, resetError, onGoHome }: ErrorRecoveryProps) {
  const { t } = useLanguage();

  const handleRefresh = () => {
    resetError();
    window.location.reload();
  };

  const handleClearCache = () => {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {t('Something went wrong', 'Algo salió mal')}
          </h1>
          <p className="text-gray-600 text-lg">
            {t(
              "We're sorry, but something unexpected happened. Don't worry, your data is safe.",
              'Lo sentimos, ocurrió algo inesperado. No te preocupes, tus datos están seguros.'
            )}
          </p>
        </div>

        {isDevelopment && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Error Details (Development Only)
            </h3>
            <p className="text-sm text-gray-700 font-mono break-all">
              {error.message}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  Stack trace
                </summary>
                <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-40 p-2 bg-white rounded border border-gray-200">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={resetError}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
          >
            <RefreshCw className="w-5 h-5" />
            {t('Try Again', 'Intentar de nuevo')}
          </button>

          {onGoHome && (
            <button
              onClick={onGoHome}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              <Home className="w-5 h-5" />
              {t('Go to Home', 'Ir al inicio')}
            </button>
          )}

          <button
            onClick={handleRefresh}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            <RefreshCw className="w-5 h-5" />
            {t('Refresh Page', 'Recargar página')}
          </button>

          <details className="mt-4">
            <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 text-center">
              {t('Advanced Options', 'Opciones avanzadas')}
            </summary>
            <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-3">
                {t(
                  'Clear all cached data and reload. This will log you out.',
                  'Borra todos los datos en caché y recarga. Esto te desconectará.'
                )}
              </p>
              <button
                onClick={handleClearCache}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-semibold"
              >
                {t('Clear Cache & Reload', 'Borrar caché y recargar')}
              </button>
            </div>
          </details>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            {t(
              'If the problem persists, please contact support.',
              'Si el problema persiste, contacta con soporte.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
