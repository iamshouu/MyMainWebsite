import React, { useRef } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import InfiniteGridBackground from './InfiniteGridBackground';
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap';

interface ProjectsCopy {
  navArchive: string;
  projectTagline: string;
  projectDescription: string;
  projectTags: string[];
  projectCta: string;
}

interface ProjectsViewProps {
  copy: ProjectsCopy;
  onClose: () => void;
  reducedMotion: boolean;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ copy, onClose, reducedMotion }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  useDialogFocusTrap(overlayRef);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] isolate overflow-y-auto outline-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="projects-view-title"
      tabIndex={-1}
      data-portfolio-view="projects"
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
        <InfiniteGridBackground accent="yellow" reducedMotion={reducedMotion} />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/30 to-black/60"
        aria-hidden
      />

      <div className="relative z-10 min-h-full px-4 pb-28 pt-28 md:px-24 md:pb-24 md:pt-36">
        <div className="max-w-7xl mx-auto">
          <button
            type="button"
            onClick={onClose}
            className="relative z-50 mb-8 inline-flex min-h-11 items-center gap-2 py-2 pr-4 text-white/55 transition-colors active:text-white focus-visible:outline-none focus-visible:text-white md:mb-16 md:gap-3 md:hover:text-white"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform md:w-[18px]" />
            <span className="font-mono tracking-widest text-[8px] md:text-[10px]">BACK TO TERMINAL</span>
          </button>

          <h2
            id="projects-view-title"
            className="text-5xl md:text-[10rem] font-black mb-8 md:mb-16 tracking-tighter opacity-5 select-none uppercase pointer-events-none"
          >
            {copy.navArchive}
          </h2>

          <article className="max-w-3xl pb-20">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-amber-200/70 mb-6">
              Beta · Active development
            </p>
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none">
              X-Perience
            </h3>
            <p className="mt-4 font-mono text-[12px] md:text-sm uppercase tracking-[0.3em] text-white/50">
              {copy.projectTagline}
            </p>
            <p className="mt-7 text-base md:text-lg text-white/65 font-medium leading-relaxed max-w-2xl">
              {copy.projectDescription}
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2" aria-label="Project capabilities">
              {copy.projectTags.map((tag) => (
                <li key={tag} className="text-[10px] font-mono uppercase tracking-wide text-white/45">
                  {tag}
                </li>
              ))}
            </ul>
            <a
              href="https://xperienceone.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 px-7 py-4 bg-white text-black rounded-2xl text-[11px] md:text-[12px] font-bold uppercase tracking-widest hover:bg-white/90 transition-[background-color,transform] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {copy.projectCta} X-Perience
              <ArrowUpRight size={16} />
            </a>
          </article>
        </div>
      </div>
    </div>
  );
};

export default ProjectsView;
