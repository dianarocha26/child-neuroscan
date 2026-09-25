import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ScreenWrapperProps {
  onBack: () => void;
  children: ReactNode;
}

/**
 * Shared page shell for the tracker screens: one back button and the same
 * container width / gutters on every screen. Children should not add their
 * own min-h-screen, page padding or back button.
 */
export default function ScreenWrapper({ onBack, children }: ScreenWrapperProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-8">
        <button
          type="button"
          onClick={onBack}
          className="no-print inline-flex items-center gap-1.5 -ml-2 mb-2 sm:mb-4 px-2 min-h-[44px] rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t('Back to Home', 'Volver al inicio')}
        </button>
        {children}
      </div>
    </div>
  );
}
