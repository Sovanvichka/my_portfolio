import { usePreferences } from '../context/PreferencesContext';
import { getPortfolioContent } from '../data/portfolioData';

export function CapabilitiesSection() {
  const { lang } = usePreferences();
  const content = getPortfolioContent(lang);
  const { capabilitiesSection } = content;

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="relative z-10 bg-[#F4F7FC]/72 py-20 dark:bg-[#07152E]/72 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-widest text-blue-700 dark:text-cyan-300 uppercase">
            {capabilitiesSection.eyebrow}
          </p>
          <h2
            id="capabilities-heading"
            className={`font-display mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl ${
              lang === 'km' ? 'leading-[1.35]' : ''
            }`}
          >
            {capabilitiesSection.heading}
          </h2>
        </div>

        <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/[0.08] dark:border-white/[0.08]">
          {capabilitiesSection.capabilities.map((cap) => (
            <div
              key={cap.index}
              className="grid grid-cols-1 gap-6 py-9 lg:grid-cols-12 lg:gap-10"
            >
              <div className="lg:col-span-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono-tabular text-sm font-medium text-blue-700 dark:text-cyan-300">
                    {cap.index}
                  </span>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    {cap.title}
                  </h3>
                </div>
                <p className="mt-2 pl-8 text-xs text-slate-500 dark:text-slate-400">
                  {cap.subtitle}
                </p>
              </div>

              <div className="lg:col-span-7">
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {cap.description}
                </p>
                <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3 sm:gap-4">
                  {cap.highlights.map((item) => (
                    <li key={item} className="leading-snug">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Education & Experience CV Timeline */}
        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-medium tracking-widest text-blue-700 dark:text-cyan-300 uppercase">
              {capabilitiesSection.educationEyebrow}
            </p>
            <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {capabilitiesSection.educationHeading}
            </h3>
            <div className="mt-6 divide-y divide-slate-200 border-t border-slate-200 dark:divide-white/[0.08] dark:border-white/[0.08]">
              {capabilitiesSection.education.map((entry) => (
                <div key={`${entry.period}-${entry.title}`} className="py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-display text-lg font-medium text-slate-900 dark:text-white">
                      {entry.title}
                    </h4>
                    <span className="font-mono-tabular text-xs text-blue-700 dark:text-cyan-300">
                      {entry.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {entry.organization}
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {entry.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium tracking-widest text-blue-700 dark:text-cyan-300 uppercase">
              {capabilitiesSection.experienceEyebrow}
            </p>
            <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {capabilitiesSection.experienceHeading}
            </h3>
            <div className="mt-6 divide-y divide-slate-200 border-t border-slate-200 dark:divide-white/[0.08] dark:border-white/[0.08]">
              {capabilitiesSection.experience.map((entry) => (
                <div key={`${entry.period}-${entry.title}`} className="py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-display text-lg font-medium text-slate-900 dark:text-white">
                      {entry.title}
                    </h4>
                    <span className="font-mono-tabular text-xs text-blue-700 dark:text-cyan-300">
                      {entry.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {entry.organization}
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {entry.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
