import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { AuthProvider } from './contexts/AuthContext.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { registerServiceWorker, unregisterServiceWorker } from './lib/serviceWorker';

if (import.meta.env.PROD) {
  registerServiceWorker();
} else {
  // Drop any worker left over from older builds that registered it in dev.
  void unregisterServiceWorker();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);