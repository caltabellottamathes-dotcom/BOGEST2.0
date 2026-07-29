import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', accent: 'gold', toggleAccent: () => {} });

const ACCENT_KEY = 'bogest-accent';

/**
 * Bogèst is a dark-only experience. Instead of a light/dark toggle, visitors
 * switch the ACCENT color on the same dark canvas:
 *   - "gold"   → warm gold accent (default)
 *   - "olive"  → avocado / olive-green accent
 * Both modes keep the dark charcoal background; only the accent changes.
 */
export function ThemeProvider({ children }) {
  const [accent, setAccent] = useState(() => {
    try { return localStorage.getItem(ACCENT_KEY) === 'olive' ? 'olive' : 'gold'; }
    catch { return 'gold'; }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
    root.classList.toggle('accent-olive', accent === 'olive');
  }, [accent]);

  const toggleAccent = () => setAccent((a) => {
    const next = a === 'gold' ? 'olive' : 'gold';
    try { localStorage.setItem(ACCENT_KEY, next); } catch {}
    return next;
  });

  return (
    <ThemeContext.Provider value={{ theme: 'dark', accent, toggleAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);