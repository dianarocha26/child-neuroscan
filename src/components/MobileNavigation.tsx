import React from 'react';
import { Home, Brain, BookOpen, Users, BarChart3, UserCircle } from 'lucide-react';

interface MobileNavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function MobileNavigation({ currentView, onNavigate }: MobileNavigationProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'screening', icon: Brain, label: 'Screen' },
    { id: 'resources', icon: BookOpen, label: 'Resources' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'progress', icon: BarChart3, label: 'Progress' },
    { id: 'profile', icon: UserCircle, label: 'Profile' },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-inset-bottom"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-6 h-16">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center justify-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
              currentView === id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 active:text-blue-600 dark:active:text-blue-400'
            }`}
            aria-label={`Navigate to ${label}`}
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
