import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { AuthProvider } from './contexts/AuthContext.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { ChildrenProvider } from './contexts/ChildrenContext.tsx';
import { DialogProvider } from './contexts/DialogContext.tsx';
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
          <ChildrenProvider>
            <LanguageProvider>
              <DialogProvider>
                <App />
              </DialogProvider>
            </LanguageProvider>
          </ChildrenProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);