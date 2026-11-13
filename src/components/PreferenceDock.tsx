import { Languages, Moon, Sun } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { getPortfolioContent } from '../data/portfolioData';

export function PreferenceDock() {
  const { theme, lang, toggleTheme, setLang } = usePreferences();
  const content = getPortfolioContent(lang);
  const isDark = theme === 'dark';

  return (
    <div
      role="region"
      aria-label="Theme and language preferences"
      className="fixed right-4 bottom-4 z-40 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.12)] dark:border-white/15 dark:bg-[#0B1C3B]/95 dark:shadow-[0_12px_32px_rgba(2,8,23,0.55)] sm:right-6 sm:bottom-6"
    >
      {/* Dark / Light Mode Toggle Button */}
      <button
        type="button"
        onClick={toggleTheme}
        data-magnetic="filter"
        aria-pressed={isDark}
        aria-label={isDark ? content.controls.switchToLight : content.controls.switchToDark}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-slate-700 whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400"
      >
        {isDark ? (
          <Sun className="h-3.5 w-3.5 text-cyan-300" />
        ) : (
          <Moon className="h-3.5 w-3.5 text-blue-600" />
        )}
        <span>{isDark ? content.controls.dark : content.controls.light}</span>
      </button>

      <div
        aria-hidden="true"
        className="h-5 w-px bg-slate-200 dark:bg-white/10"
      />

      {/* Khmer / English Language Switcher */}
      <div
        role="group"
        aria-label="Language switcher"
        className="flex items-center gap-0.5"
      >
        <Languages
          aria-hidden="true"
          className="ml-1.5 mr-1 h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0"
        />
        <button
          type="button"
          onClick={() => setLang('en')}
          data-magnetic="filter"
          aria-pressed={lang === 'en'}
          className={`h-8 rounded-md px-2.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400 ${
            lang === 'en'
              ? 'bg-[#2563EB] text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLang('km')}
          data-magnetic="filter"
          aria-pressed={lang === 'km'}
          className={`h-8 rounded-md px-2.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400 ${
            lang === 'km'
              ? 'bg-[#2563EB] text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
          }`}
        >
          ខ្មែរ
        </button>
      </div>
    </div>
  );
}
