import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

// Brussels sunrise/sunset (approximate by month)
// [month(0-based)] = [sunriseHour, sunsetHour]
const BRUSSELS_SUN = [
  [8, 17], [7, 18], [7, 19], [6, 20], [6, 21], [5, 21],
  [5, 21], [6, 21], [7, 20], [7, 19], [7, 17], [8, 16],
];

function getAutoTheme() {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const utcMinute = now.getUTCMinutes();
  // Brussels is UTC+1 in winter, UTC+2 in summer
  const month = now.getUTCMonth();
  const isDST = month >= 2 && month <= 9; // rough DST approximation
  const localHour = utcHour + (isDST ? 2 : 1);
  const localTime = localHour + utcMinute / 60;
  const [sunrise, sunset] = BRUSSELS_SUN[month];
  return (localTime >= sunrise && localTime < sunset) ? 'light' : 'dark';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bogest-theme');
      const savedTime = localStorage.getItem('bogest-theme-time');
      // If user manually set it within the last 4 hours, respect it
      if (saved && savedTime && Date.now() - Number(savedTime) < 4 * 60 * 60 * 1000) {
        return saved;
      }
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Re-check auto theme every 10 minutes if user hasn't manually overridden recently
  useEffect(() => {
    const interval = setInterval(() => {
      const savedTime = localStorage.getItem('bogest-theme-time');
      if (!savedTime || Date.now() - Number(savedTime) > 4 * 60 * 60 * 1000) {
        setTheme(getAutoTheme());
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('bogest-theme', next);
      localStorage.setItem('bogest-theme-time', String(Date.now()));
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);