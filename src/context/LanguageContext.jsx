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
    
    // Trigger Google Translate reliably
    const triggerTranslation = (attempts = 0) => {
      const selectField = document.querySelector('.goog-te-combo');
      if (selectField) {
        let val = code;
        // Google Translate often uses '' to restore the original pageLanguage if 'en' isn't explicitly an option
        if (code === 'en' && !Array.from(selectField.options).some(opt => opt.value === 'en')) {
          val = '';
        }
        selectField.value = val;
        selectField.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      } else if (attempts < 20) { // Try for up to 2 seconds
        setTimeout(() => triggerTranslation(attempts + 1), 100);
      }
    };
    triggerTranslation();
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === 'en' ? 'te' : 'en');
  }, [lang, setLang]);

  // Always provide English translations so Google Translate handles all translation cleanly
  const t = translations['en'];

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
