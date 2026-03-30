import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('BhulRakshak_theme');
    return stored === 'dark';
  });

  const [accessibility, setAccessibility] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('BhulRakshak_a11y') || '{}');
    } catch { return {}; }
  });

  const a11y = {
    largeText: !!accessibility.largeText,
    highContrast: !!accessibility.highContrast,
    reduceAnimations: !!accessibility.reduceAnimations,
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('BhulRakshak_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('BhulRakshak_a11y', JSON.stringify(accessibility));
    document.documentElement.classList.toggle('large-text', a11y.largeText);
    document.documentElement.classList.toggle('high-contrast', a11y.highContrast);
    document.documentElement.classList.toggle('reduce-motion', a11y.reduceAnimations);
  }, [accessibility, a11y]);

  const toggleDark = useCallback(() => setIsDark((d) => !d), []);
  const setA11y = useCallback((key, value) => setAccessibility((prev) => ({ ...prev, [key]: value })), []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark, a11y, setA11y }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
