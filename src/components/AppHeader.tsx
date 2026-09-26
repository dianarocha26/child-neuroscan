import { Brain, LogIn, LogOut, Search } from 'lucide-react';
import { SPANISH_ENABLED, useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';

interface AppHeaderProps {
  isLoggedIn: boolean;
  /** Hide the sign-in shortcut (e.g. while already on the login/sign-up screens) */
  hideSignIn?: boolean;
  onHome: () => void;
  onSearch: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

/**
 * Slim top bar shared by every non-auth screen. Holds the app-wide controls
 * (home, search, language, account) so they no longer float over page content.
 */
export function AppHeader({ isLoggedIn, hideSignIn = false, onHome, onSearch, onLogin, onLogout }: AppHeaderProps) {
  const { t } = useLanguage();
  const iconButton =
    'inline-flex items-center justify-center gap-2 h-10 min-w-[2.5rem] px-2 sm:px-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500';

  return (
    <header className="no-print sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 pt-[env(safe-area-inset-top)]">
      <div className="max-w-6xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onHome}
          className="flex items-center gap-2 min-w-0 -ml-1 px-1 h-10 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          aria-label={t('ChildNeuroScan home', 'Inicio de ChildNeuroScan')}
        >
          <span className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-teal-500 to-primary-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" aria-hidden="true" />
          </span>
          <span className="font-bold text-[15px] sm:text-base text-gray-900 truncate">ChildNeuroScan</span>
        </button>

        <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
          {isLoggedIn && (
            <button
              type="button"
              onClick={onSearch}
              className={iconButton}
              title={t('Search (Ctrl+K)', 'Buscar (Ctrl+K)')}
              aria-label={t('Open search', 'Abrir búsqueda')}
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
          {SPANISH_ENABLED && <LanguageSwitch />}
          {isLoggedIn ? (
            <button type="button" onClick={onLogout} className={iconButton} aria-label={t('Log out', 'Cerrar sesión')}>
              <LogOut className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline text-sm font-medium">{t('Log out', 'Cerrar sesión')}</span>
            </button>
          ) : !hideSignIn && (
            <button type="button" onClick={onLogin} className={`${iconButton} text-primary-700`} aria-label={t('Sign in', 'Iniciar sesión')}>
              <LogIn className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm font-semibold">{t('Sign in', 'Iniciar sesión')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
