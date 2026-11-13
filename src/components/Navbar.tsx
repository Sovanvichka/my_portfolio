import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import { getPortfolioContent } from '../data/portfolioData';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang } = usePreferences();
  const content = getPortfolioContent(lang);

  const navLinks = [
    { label: content.nav.work, href: '#work' },
    { label: content.nav.about, href: '#about' },
    { label: content.nav.capabilities, href: '#capabilities' },
    { label: content.nav.contact, href: '#contact' },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#F4F7FC]/95 dark:border-white/[0.08] dark:bg-[#07152E]/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6 lg:px-10">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#top"
          data-magnetic="nav"
          className="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400 rounded-sm"
        >
          {content.name}
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-magnetic="nav"
              className="relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-slate-950 dark:hover:text-white after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-blue-600 dark:after:bg-cyan-400 after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400 rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary action + mobile drawer trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            data-magnetic="cta"
            className="hidden md:inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400"
          >
            {content.nav.cta}
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition-colors hover:bg-slate-200/60 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Mobile"
          className="border-t border-slate-200 bg-[#F4F7FC] px-6 py-5 dark:border-white/[0.08] dark:bg-[#07152E] md:hidden"
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className="py-2 text-base font-medium text-slate-700 transition-colors hover:text-blue-600 dark:text-slate-200 dark:hover:text-cyan-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={closeMobile}
              className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-[#2563EB] px-5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
              {content.nav.cta}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
