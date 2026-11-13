import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';
export type LanguageCode = 'en' | 'km';

interface PreferencesContextValue {
  theme: ThemeMode;
  lang: LanguageCode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setLang: (lang: LanguageCode) => void;
  toggleLanguage: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const THEME_STORAGE_KEY = 'portfolio_theme';
const LANG_STORAGE_KEY = 'portfolio_lang';

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  const [lang, setLang] = useState<LanguageCode>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    return saved === 'km' || saved === 'en' ? saved : 'en';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [lang]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const toggleLanguage = () => setLang((prev) => (prev === 'en' ? 'km' : 'en'));

  return (
    <PreferencesContext.Provider
      value={{ theme, lang, setTheme, toggleTheme, setLang, toggleLanguage }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return ctx;
}
