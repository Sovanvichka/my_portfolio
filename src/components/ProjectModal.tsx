import { ArrowUpRight, X } from 'lucide-react';
import { useEffect } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import { getPortfolioContent, type ProjectItem } from '../data/portfolioData';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { lang } = usePreferences();
  const content = getPortfolioContent(lang);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 dark:bg-[#030A18]/85 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-white/15 dark:bg-[#0A1935] dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 dark:border-white/[0.08] dark:bg-[#0A1935]/95">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono-tabular text-blue-700 dark:text-cyan-300">
              {project.index}
            </span>
            <span aria-hidden="true">·</span>
            <span>{content.work.categoryLabels[project.category]}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-cyan-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-[#07152E]">
            <img
              src={project.image}
              alt={project.imageAlt}
              referrerPolicy="no-referrer"
              className="aspect-video w-full object-cover"
            />
          </div>

          <h3
            id="modal-project-title"
            className="font-display mt-6 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
          >
            {project.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              {content.work.modal.client}: {project.client}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {content.work.modal.role}: {project.role}
            </span>
          </div>

          <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {project.summary}
          </p>

          <div className="mt-7 grid grid-cols-1 gap-6 border-t border-slate-200 pt-6 dark:border-white/[0.08] sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-medium tracking-wider text-blue-700 dark:text-cyan-300 uppercase">
                {content.work.modal.challenge}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {project.challenge}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-medium tracking-wider text-blue-700 dark:text-cyan-300 uppercase">
                {content.work.modal.solution}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {project.solution}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#07152E] sm:p-5">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {content.work.modal.measuredOutcome}
            </p>
            <p className="mt-1 text-base font-medium text-slate-900 dark:text-white">
              {project.impact}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {content.work.modal.deliverables}: {project.deliverables.join(' · ')}
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5"
            >
              {content.work.modal.close}
            </button>
            <a
              href={project.liveUrl}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
              <span>{content.work.modal.discuss}</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
