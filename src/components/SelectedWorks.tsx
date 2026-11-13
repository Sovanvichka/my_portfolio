import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { useState } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import {
  getPortfolioContent,
  type ProjectCategory,
} from '../data/portfolioData';
import { ProjectModal } from './ProjectModal';

const gridContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.05,
    },
  },
};

const cardRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const CATEGORIES: ProjectCategory[] = [
  'All',
  'Interactive 3D',
  'Design Systems',
  'Product UI',
];

export function SelectedWorks() {
  const { lang } = usePreferences();
  const content = getPortfolioContent(lang);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();

  const filteredProjects =
    activeCategory === 'All'
      ? content.work.projects
      : content.work.projects.filter((p) => p.category === activeCategory);

  const selectedProject =
    content.work.projects.find((p) => p.id === selectedProjectId) ?? null;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative z-10 bg-[#EAF0FA]/78 py-20 dark:bg-[#061228]/78 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium tracking-widest text-blue-700 dark:text-cyan-300 uppercase">
              {content.work.eyebrow}
            </p>
            <h2
              id="work-heading"
              className={`font-display mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl ${
                lang === 'km' ? 'leading-[1.35]' : ''
              }`}
            >
              {content.work.heading}
            </h2>
          </div>

          {/* Interactive category filter controls */}
          <div
            role="tablist"
            aria-label="Filter projects by discipline"
            className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 self-start shadow-sm dark:border-white/10 dark:bg-[#0B1C3B] dark:shadow-none md:self-auto"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  data-magnetic="filter"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-md px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400 ${
                    isActive
                      ? 'bg-[#2563EB] text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
                  }`}
                >
                  {content.work.categoryLabels[category]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetric Editorial Bento Grid */}
        <motion.div
          key={`${activeCategory}-${lang}`}
          variants={gridContainerVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-12"
        >
          {filteredProjects.map((project, idx) => {
            const isWide =
              activeCategory === 'All'
                ? project.aspect === 'wide'
                : idx === 0;
            const colSpan = isWide ? 'md:col-span-7' : 'md:col-span-5';
            const imgFailed = failedImages[project.id];

            return (
              <motion.article
                key={project.id}
                variants={cardRevealVariants}
                className={`${colSpan} group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-colors duration-200 hover:border-blue-500/45 dark:border-white/[0.08] dark:bg-[#0B1C3B] dark:shadow-none dark:hover:border-cyan-400/35`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedProjectId(project.id)}
                  className="flex h-full w-full flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-[#07152E]">
                    {!imgFailed ? (
                      <img
                        src={project.image}
                        alt={project.imageAlt}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [project.id]: true }))
                        }
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 via-blue-100 to-slate-100 p-6 dark:from-[#0B1C3B] dark:via-[#132C5C] dark:to-[#07152E]">
                        <span className="font-display text-lg font-medium text-slate-700 dark:text-slate-300">
                          {project.title}
                        </span>
                      </div>
                    )}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent dark:from-[#0B1C3B]/75"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-mono-tabular text-blue-700 dark:text-cyan-300">
                          {project.index}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{content.work.categoryLabels[project.category]}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.year}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.role}</span>
                      </div>

                      <div className="mt-3 flex items-start justify-between gap-4">
                        <h3 className="font-display text-xl font-semibold tracking-tight text-slate-900 transition-colors duration-150 group-hover:text-blue-700 dark:text-white dark:group-hover:text-cyan-200 sm:text-2xl">
                          {project.title}
                        </h3>
                        <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors duration-150 group-hover:border-blue-500/50 group-hover:text-blue-600 dark:border-white/10 dark:text-slate-300 dark:group-hover:border-cyan-400/50 dark:group-hover:text-cyan-300">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                        {project.summary}
                      </p>
                    </div>

                    <p className="mt-5 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
                      {content.work.outcomeLabel}{' '}
                      <span className="text-slate-800 dark:text-slate-200">{project.impact}</span>
                    </p>
                  </div>
                </button>
              </motion.article>
            );
          })}
        </motion.div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProjectId(null)}
      />
    </section>
  );
}
