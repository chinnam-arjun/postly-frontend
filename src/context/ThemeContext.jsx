/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'postly-theme';

const getSystemTheme = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const getInitialPreference = () => localStorage.getItem(STORAGE_KEY) || 'system';

export const ThemeProvider = ({ children }) => {
  const [preference, setPreference] = useState(getInitialPreference);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);
  const resolvedTheme = preference === 'system' ? systemTheme : preference;

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemTheme(media.matches ? 'dark' : 'light');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    // Keep dataset for CSS variable theming and also toggle the
    // legacy `dark` class so Tailwind's `dark:` variants continue to work.
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
    if (resolvedTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem(STORAGE_KEY, preference);
  }, [preference, resolvedTheme]);

  const value = useMemo(() => ({
    preference,
    resolvedTheme,
    setPreference,
    toggleTheme: () => setPreference((current) => current === 'system' ? 'dark' : current === 'dark' ? 'light' : 'system'),
  }), [preference, resolvedTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
};
