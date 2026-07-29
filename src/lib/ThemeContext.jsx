import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  accent: 'yellow',
  setAccent: () => {},
  toggleAccent: () => {},
  toggleTheme: () => {},
});

const STORAGE_KEY = 'bogest-accent';

/**
 * Bogèst is a dark-only experience. The toggle switches the ACCENT between two
 * dark themes: "yellow" (gold) and "green" (olive green) — both share the same
 * cinematic charcoal background; only the accent colour changes.
 */
export function ThemeProvider({ children }) {
  const [accent, setAccentState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'green' ? 'green' : 'yellow';
    } catch {
      return 'yellow';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
    root.classList.toggle('theme-green', accent === 'green');
    try { localStorage.setItem(STORAGE_KEY, accent); } catch {}
  }, [accent]);

  const setAccent = (a) => setAccentState(a === 'green' ? 'green' : 'yellow');
  const toggleAccent = () => setAccentState((a) => (a === 'yellow' ? 'green' : 'yellow'));

  return (
    <ThemeContext.Provider value={{ theme: 'dark', accent, setAccent, toggleAccent, toggleTheme: toggleAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);