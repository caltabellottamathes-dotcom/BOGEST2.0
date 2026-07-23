import React, { createContext, useContext, useState } from 'react';
import { translations } from './i18n';

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bogest-lang') || 'nl';
    }
    return 'nl';
  });

  const t = (key) => {
    return translations[lang]?.[key] || translations['nl']?.[key] || key;
  };

  const changeLang = (code) => {
    setLang(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bogest-lang', code);
    }
  };

  return (
    <LangContext.Provider value={{ lang, t, changeLang }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);