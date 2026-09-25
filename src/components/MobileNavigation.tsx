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
      className="no-print md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 z-40 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.04)]"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center justify-center gap-1 min-w-0 px-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
              currentView === id
                ? 'text-blue-600'
                : 'text-gray-500 active:text-blue-600'
            }`}
            aria-label={label}
            aria-current={currentView === id ? 'page' : undefined}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span className="text-[11px] leading-tight font-medium max-w-full truncate">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
