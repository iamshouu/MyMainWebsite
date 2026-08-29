import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Section from './Section';
import type { DevelopmentProjectCopy } from '../constants';

interface SelectedWorkProps {
  watermark: string;
  subtitle: string;
  lead: string;
  projects: DevelopmentProjectCopy[];
}

const PROJECT_ACCENTS = ['#FACC15', '#A78BFA'] as const;

const SelectedWork: React.FC<SelectedWorkProps> = ({ watermark, subtitle, lead, projects }) => {
  return (
    <Section id="build">
      <h2
        className="absolute top-[5%] left-1/2 -translate-x-1/2 w-full text-center whitespace-nowrap text-6xl md:text-[11rem] font-black text-white uppercase tracking-tighter select-none pointer-events-none opacity-[0.055]"
        aria-hidden
      >
        {watermark}
      </h2>

      <div className="relative z-10 flex flex-col items-center mb-6 md:mb-9">
        <p className="mb-3 px-2 text-center font-mono text-[10px] font-black uppercase tracking-[0.28em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] sm:tracking-[0.5em] md:text-[16px] md:tracking-[0.8em]">
          {subtitle}
        </p>
        <div className="h-px w-32 bg-gradient-to-r from-cyan-300 via-violet-300 to-yellow-300 md:w-56" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <p className="mx-auto max-w-3xl text-center text-[14px] font-medium leading-relaxed text-white/60 md:text-[17px]">
          {lead}
        </p>

        <div className="mt-7 md:mt-10">
          {projects.map((project, idx) => {
            const accent = PROJECT_ACCENTS[idx] ?? '#F8FAFC';

            return (
              <article
                key={project.title}
                className="group relative grid grid-cols-1 gap-3 py-5 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:py-7"
              >
                <span aria-hidden className="absolute left-0 right-0 top-0 h-px bg-white/10" />
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-px w-0 transition-[width] duration-700 ease-out group-hover:w-full"
                  style={{ background: `linear-gradient(90deg, ${accent}, transparent 72%)` }}
                />

                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-white/[0.38] md:text-[10px]">
                    {project.context}
                  </p>
                  <h3 className="mt-2 text-[clamp(2rem,4vw,4.2rem)] font-black leading-none tracking-[-0.055em] text-white transition-transform duration-700 ease-out group-hover:translate-x-2">
                    {project.title}
                  </h3>
                </div>

                <div className="flex flex-col justify-between md:pt-1">
                  <p className="max-w-xl text-[13px] font-medium leading-relaxed text-white/[0.58] md:text-[15px]">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/[0.32] md:text-[10px]">
                      {project.meta}
                    </p>
                    {project.url && project.cta && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-2 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/65 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:text-white"
                      >
                        {project.cta}
                        <ArrowUpRight
                          size={15}
                          className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                          style={{ color: accent }}
                        />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
          <span aria-hidden className="block h-px w-full bg-white/10" />
        </div>
      </div>
    </Section>
  );
};

export default SelectedWork;
