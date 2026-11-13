import { ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import { getPortfolioContent, PORTFOLIO_IDENTITY } from '../data/portfolioData';
import { LiquidGlassFallback } from './LiquidGlassFallback';

const LazyLiquidGlassCanvas = lazy(() => import('./LiquidGlassCanvas'));

export function HeroAboutStage() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { lang } = usePreferences();
  const content = getPortfolioContent(lang);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const headlineWords = content.hero.headline.split(' ');

  return (
    <div ref={stageRef} id="top" className="relative bg-transparent">
      {/* Subtle architectural aura behind the stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-40 left-1/4 h-[520px] w-[520px] rounded-full opacity-35"
          style={{
            background:
              'radial-gradient(circle, rgba(37, 99, 235, 0.14) 0%, rgba(37, 99, 235, 0) 70%)',
          }}
        />
      </div>

      {/* Desktop Sticky 3D Stage: spans Hero -> About for seamless scroll-driven morph */}
      {isDesktop && (
        <div className="pointer-events-none sticky top-16 z-0 hidden h-[calc(100vh-4rem)] w-full lg:block">
          <Suspense fallback={<LiquidGlassFallback reason="loading" />}>
            <LazyLiquidGlassCanvas stageRef={stageRef} />
          </Suspense>
        </div>
      )}

      {/* Content Overlay Container */}
      <div className={isDesktop ? 'relative z-10 -mt-[calc(100vh-4rem)]' : 'relative z-10'}>
        {/* HERO SECTION */}
        <section
          aria-labelledby="hero-headline"
          className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-6 py-12 lg:px-10 lg:py-0"
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Hero Typography Column (Left on Desktop, First on Mobile) */}
            <div className="lg:col-span-6 xl:col-span-6">
              <motion.p
                key={`title-${lang}`}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm font-medium tracking-wide text-blue-700 dark:text-cyan-300 sm:text-base"
              >
                {content.hero.title}
              </motion.p>

              <h1
                id="hero-headline"
                key={`headline-${lang}`}
                className={`font-display mt-5 text-balance text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl xl:text-[4.15rem] ${
                  lang === 'km'
                    ? 'leading-[1.32] lg:text-[3.3rem] lg:leading-[1.32]'
                    : 'lg:text-[3.65rem] lg:leading-[1.06]'
                }`}
              >
                {headlineWords.map((word, idx) => (
                  <motion.span
                    key={`${lang}-${word}-${idx}`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: shouldReduceMotion ? 0 : 0.08 + idx * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block mr-[0.26em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                key={`desc-${lang}`}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: shouldReduceMotion ? 0 : 0.42,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg"
              >
                {content.hero.description}
              </motion.p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <span data-magnetic="cta" className="inline-block">
                  <motion.a
                    href="#work"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: shouldReduceMotion ? 0 : 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    className="group inline-flex min-h-[46px] items-center gap-2.5 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(37,99,235,0.24)] transition-[background-color,box-shadow] duration-150 hover:bg-blue-500 hover:shadow-[0_16px_36px_rgba(37,99,235,0.34)] dark:shadow-[0_12px_30px_rgba(37,99,235,0.28)] dark:hover:shadow-[0_16px_36px_rgba(34,211,238,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap shrink-0"
                  >
                    <span>{content.hero.primaryCta}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </motion.a>
                </span>

                <span data-magnetic="cta" className="inline-block">
                  <motion.a
                    href="#contact"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: shouldReduceMotion ? 0 : 0.65,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    className="group inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-slate-300 bg-white/80 px-6 py-3 text-sm font-medium text-slate-800 transition-colors duration-150 hover:border-blue-600/60 hover:bg-white hover:text-slate-950 dark:border-white/20 dark:bg-white/[0.03] dark:text-slate-100 dark:hover:border-cyan-400/60 dark:hover:bg-white/[0.07] dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap shrink-0"
                  >
                    <span>{content.hero.secondaryCta}</span>
                    <ArrowUpRight className="h-4 w-4 text-blue-600 dark:text-cyan-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </motion.a>
                </span>
              </div>

              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.85 }}
                className="mt-10 hidden text-xs tracking-wide text-slate-500 dark:text-slate-400 lg:block"
              >
                {content.hero.hint}
              </motion.p>
            </div>

            {/* Mobile Compact 3D Sculpture Viewport (Below text on Mobile/Tablet) */}
            {!isDesktop && (
              <div className="relative h-[340px] w-full sm:h-[410px] lg:hidden">
                <Suspense fallback={<LiquidGlassFallback compact reason="loading" />}>
                  <LazyLiquidGlassCanvas compact />
                </Suspense>
              </div>
            )}

            {/* Desktop Open Right Column spacer so 3D sculpture never overlaps text */}
            <div className="hidden lg:col-span-6 lg:block" aria-hidden="true" />
          </div>
        </section>

        {/* ABOUT SECTION (Paired with Scroll-Morphed 3D Sculpture on Desktop Left) */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-32"
        >
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Desktop Left Spacer reserved for the scroll-morphed 3D liquid-glass sculpture */}
            <div className="hidden lg:col-span-5 lg:block" aria-hidden="true" />

            {/* About Editorial Narrative (Right Column on Desktop) */}
            <div className="lg:col-span-7 lg:pl-8">
              <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-8 shadow-sm dark:border-white/[0.08] dark:bg-[#0B1C3B]/85 dark:shadow-none sm:p-10">
                <p className="text-xs font-medium tracking-widest text-blue-700 dark:text-cyan-300 uppercase">
                  {content.about.eyebrow} · {content.shortLocation}
                </p>

                <h2
                  id="about-heading"
                  className={`font-display mt-3 text-balance text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl ${
                    lang === 'km' ? 'leading-[1.35]' : ''
                  }`}
                >
                  {content.about.heading}
                </h2>

                <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  <p>{content.about.paragraphs[0]}</p>
                  <p>{content.about.paragraphs[1]}</p>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <a
                    href={PORTFOLIO_IDENTITY.cvUrl}
                    download="An_Sovanvichka_CV.pdf"
                    data-magnetic="cta"
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-blue-600/30 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors duration-150 hover:border-blue-600 hover:bg-blue-100 dark:border-cyan-400/40 dark:bg-cyan-400/10 dark:text-cyan-200 dark:hover:border-cyan-300 dark:hover:bg-cyan-400/20 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap shrink-0"
                  >
                    <Download className="h-4 w-4" />
                    <span>{content.about.downloadCv}</span>
                  </a>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {content.about.metaPrefix}
                  </span>
                </div>

                {/* Quantitative Proof Strip */}
                <dl className="mt-8 grid grid-cols-1 gap-6 border-t border-slate-200 pt-8 dark:border-white/[0.08] sm:grid-cols-3">
                  {content.about.metrics.map((metric) => (
                    <div key={metric.label}>
                      <dt className="text-xs text-slate-500 dark:text-slate-400">
                        {metric.label}
                      </dt>
                      <dd className="font-mono-tabular mt-1.5 text-2xl font-medium text-slate-900 dark:text-white sm:text-3xl">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
