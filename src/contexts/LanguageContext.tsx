import { createContext, useContext, useState, ReactNode } from 'react';
import type { Language } from '../types/database';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, es: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * The app ships English-only for now. Spanish strings stay in place (t() and
 * translations.ts); flip this to true to bring back ES and the header switch.
 */
export const SPANISH_ENABLED = false;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Language>('en');
  const language: Language = SPANISH_ENABLED ? selected : 'en';
  const setLanguage = (lang: Language) => {
    if (SPANISH_ENABLED) setSelected(lang);
  };

  const t = (en: string, es: string): string => {
    return language === 'es' ? es : en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
