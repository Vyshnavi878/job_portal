import { createContext, useContext, useState, useCallback } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'ntr_language';

function getInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'te' || saved === 'en') return saved;
  } catch (_) { /* storage unavailable */ }
  return 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  const setLang = useCallback((code) => {
    try { localStorage.setItem(STORAGE_KEY, code); } catch (_) {}
    setLangState(code);
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === 'en' ? 'te' : 'en');
  }, [lang, setLang]);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
