import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from './i18n';
import { base44 } from '@/api/base44Client';

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bogest-lang') || 'nl';
    }
    return 'nl';
  });
  const [textOverrides, setTextOverrides] = useState({});

  const reloadTextOverrides = useCallback(async () => {
    try {
      const res = await base44.functions.invoke('siteTextApi', { action: 'list', lang });
      const map = {};
      for (const o of (res.data?.overrides || [])) map[o.key] = o.value;
      setTextOverrides(map);
    } catch {
      setTextOverrides({});
    }
  }, [lang]);

  useEffect(() => { reloadTextOverrides(); }, [reloadTextOverrides]);

  const t = (key) => {
    if (textOverrides[key]) return textOverrides[key];
    return translations[lang]?.[key] || translations['nl']?.[key] || key;
  };

  const changeLang = (code) => {
    setLang(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bogest-lang', code);
    }
  };

  return (
    <LangContext.Provider value={{ lang, t, changeLang, reloadTextOverrides }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);