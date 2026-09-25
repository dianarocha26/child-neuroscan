import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  const option = (value: 'en' | 'es', label: string) => (
    <button
      type="button"
      onClick={() => setLanguage(value)}
      aria-pressed={language === value}
      className={`min-w-[2.25rem] sm:min-w-[2.5rem] h-9 px-2 sm:px-2.5 rounded-md text-sm font-semibold transition-colors ${
        language === value
          ? 'bg-teal-600 text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Language / Idioma">
      <Globe className="hidden sm:block w-5 h-5 text-gray-500" aria-hidden="true" />
      <div className="flex items-center gap-0.5 p-0.5 bg-gray-100 rounded-lg">
        {option('en', 'EN')}
        {option('es', 'ES')}
      </div>
    </div>
  );
}
