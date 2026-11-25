import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'en' | 'ru';

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (value: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = window.localStorage.getItem('tonrax-language');
    return saved === 'ru' ? 'ru' : 'en';
  });

  useEffect(() => {
    window.localStorage.setItem('tonrax-language', language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      toggleLanguage: () => setLanguageState((prev) => (prev === 'en' ? 'ru' : 'en')),
      setLanguage: (next: Language) => setLanguageState(next),
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}
