import { Home, BarChart3, BookOpen, Users, Bell } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Screen } from '../App';

interface MobileNavigationProps {
  currentView: Screen;
  onNavigate: (screen: Screen) => void;
}

export function MobileNavigation({ currentView, onNavigate }: MobileNavigationProps) {
  const { t } = useLanguage();
  const navItems: { id: Screen; icon: typeof Home; label: string }[] = [
    { id: 'landing', icon: Home, label: t('Home', 'Inicio') },
    { id: 'dashboard', icon: BarChart3, label: t('Progress', 'Progreso') },
    { id: 'resources', icon: BookOpen, label: t('Resources', 'Recursos') },
    { id: 'community', icon: Users, label: t('Community', 'Comunidad') },
    { id: 'reminders', icon: Bell, label: t('Reminders', 'Recordatorios') },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 pb-safe-bottom"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center justify-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
              currentView === id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 active:text-blue-600 dark:active:text-blue-400'
            }`}
            aria-label={label}
            aria-current={currentView === id ? 'page' : undefined}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
