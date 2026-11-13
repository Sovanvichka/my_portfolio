import { Check, Copy, Download, Phone, Send } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import { getPortfolioContent, PORTFOLIO_IDENTITY } from '../data/portfolioData';

export function ContactSection() {
  const { lang } = usePreferences();
  const content = getPortfolioContent(lang);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [scopeIndex, setScopeIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedScope = content.contact.form.scopes[scopeIndex] ?? content.contact.form.scopes[0];

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PORTFOLIO_IDENTITY.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2) {
      setError(content.contact.form.errName);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError(content.contact.form.errEmail);
      return;
    }
    if (trimmedMessage.length < 10) {
      setError(content.contact.form.errMessage);
      return;
    }

    setError(null);
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setError(null);
    setSubmitted(false);
  };

  return (
    <footer
      id="contact"
      aria-labelledby="contact-heading"
      className="relative z-10 bg-[#E6EDF8]/85 pt-20 pb-24 dark:bg-[#050F22]/85 lg:pt-28 lg:pb-14"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium tracking-widest text-blue-700 dark:text-cyan-300 uppercase">
              {content.contact.eyebrow}
            </p>
            <h2
              id="contact-heading"
              className={`font-display mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl ${
                lang === 'km' ? 'leading-[1.35]' : ''
              }`}
            >
              {content.contact.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {content.contact.description}
            </p>

            <div className="mt-8 space-y-5 border-t border-slate-200 pt-6 dark:border-white/[0.08]">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {content.contact.emailLabel}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${PORTFOLIO_IDENTITY.email}`}
                    data-magnetic="nav"
                    className="font-display text-lg font-medium text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-cyan-300"
                  >
                    {PORTFOLIO_IDENTITY.email}
                  </a>
                  <button
                    type="button"
                    data-magnetic="filter"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-blue-600/50 hover:text-slate-950 dark:border-white/15 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:border-cyan-400/50 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-300" />
                        <span>{content.contact.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>{content.contact.copy}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {content.contact.phoneLabel}
                </p>
                <a
                  href={`tel:${PORTFOLIO_IDENTITY.phone.replace(/\s+/g, '')}`}
                  data-magnetic="nav"
                  className="font-mono-tabular mt-1 inline-flex items-center gap-2 text-base font-medium text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-cyan-300"
                >
                  <Phone className="h-4 w-4 text-blue-600 dark:text-cyan-300" />
                  <span>{PORTFOLIO_IDENTITY.phone}</span>
                </a>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {content.contact.addressLabel}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {content.address}
                </p>
              </div>

              <div>
                <a
                  href={PORTFOLIO_IDENTITY.cvUrl}
                  download="An_Sovanvichka_CV.pdf"
                  data-magnetic="cta"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-800 transition-colors hover:border-blue-600/60 hover:text-slate-950 dark:border-white/15 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:border-cyan-400/60 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400"
                >
                  <Download className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-300" />
                  <span>{content.contact.downloadCv}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#0B1C3B] dark:shadow-none sm:p-8">
              {submitted ? (
                <div className="py-8 text-left">
                  <p className="text-xs font-medium tracking-widest text-blue-700 dark:text-cyan-300 uppercase">
                    {content.contact.form.receivedEyebrow}
                  </p>
                  <h3 className="font-display mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    {content.contact.form.thankYouPrefix} {name.trim()}.
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {content.contact.form.receivedBodyA}{' '}
                    <span className="font-medium text-slate-900 dark:text-white">
                      {selectedScope}
                    </span>{' '}
                    {content.contact.form.receivedBodyB}{' '}
                    <span className="font-medium text-blue-700 dark:text-cyan-300">
                      {email.trim()}
                    </span>
                    .
                  </p>
                  <button
                    type="button"
                    data-magnetic="cta"
                    onClick={handleReset}
                    className="mt-6 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    {content.contact.form.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                      >
                        {content.contact.form.nameLabel}
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={content.contact.form.namePlaceholder}
                        className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-white/15 dark:bg-[#07152E] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                      >
                        {content.contact.form.emailLabel}
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={content.contact.form.emailPlaceholder}
                        className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-white/15 dark:bg-[#07152E] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      {content.contact.form.focusLabel}
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {content.contact.form.scopes.map((item, idx) => {
                        const selected = scopeIndex === idx;
                        return (
                          <button
                            key={item}
                            type="button"
                            data-magnetic="filter"
                            onClick={() => setScopeIndex(idx)}
                            className={`rounded-lg border px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400 ${
                              selected
                                ? 'border-blue-600 bg-blue-50 text-blue-800 dark:border-cyan-400/70 dark:bg-[#2563EB]/30 dark:text-white'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-[#07152E] dark:text-slate-300 dark:hover:border-white/25 dark:hover:text-white'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      {content.contact.form.detailsLabel}
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={content.contact.form.detailsPlaceholder}
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-white/15 dark:bg-[#07152E] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-xs font-medium text-rose-600 dark:text-rose-300">
                      {error}
                    </p>
                  )}

                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      data-magnetic="cta"
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400"
                    >
                      <span>{content.contact.form.submit}</span>
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Clean Minimal Footer */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-8 text-xs text-slate-500 dark:border-white/[0.08] dark:text-slate-400 sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} {content.name}. {content.contact.footer.role}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#top"
              data-magnetic="nav"
              className="transition-colors hover:text-slate-950 dark:hover:text-white"
            >
              {content.contact.footer.top}
            </a>
            <a
              href="#work"
              data-magnetic="nav"
              className="transition-colors hover:text-slate-950 dark:hover:text-white"
            >
              {content.contact.footer.work}
            </a>
            <a
              href="#about"
              data-magnetic="nav"
              className="transition-colors hover:text-slate-950 dark:hover:text-white"
            >
              {content.contact.footer.about}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
