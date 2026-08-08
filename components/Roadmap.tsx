import React from 'react';
import { ArrowDown, ArrowRight, Code2 } from 'lucide-react';
import Section from './Section';
import type { RoadmapPlanCopy } from '../constants';

interface RoadmapProps {
  watermark: string;
  subtitle: string;
  plans: RoadmapPlanCopy[];
  icons: ReadonlyArray<React.ComponentType<{ size?: number; className?: string }>>;
  parallelTitle: string;
  parallelDescription: string;
}

const STAGE_ACCENTS = ['#67E8F9', '#60A5FA', '#C4B5FD', '#FACC15'] as const;

const Roadmap: React.FC<RoadmapProps> = ({
  watermark,
  subtitle,
  plans,
  icons,
  parallelTitle,
  parallelDescription,
}) => {
  return (
    <Section id="roadmap">
      <h2
        className="absolute top-[6%] left-1/2 -translate-x-1/2 w-full text-center whitespace-nowrap text-5xl md:text-[10rem] font-black text-white uppercase tracking-tighter select-none pointer-events-none opacity-[0.06]"
        aria-hidden
      >
        {watermark}
      </h2>

      <div className="relative z-10 flex flex-col items-center mb-8 md:mb-12">
        <p className="text-white font-mono text-[11px] md:text-[16px] uppercase tracking-[0.8em] font-black mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] text-center">
          {subtitle}
        </p>
        <div className="h-px w-32 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)] md:w-56" />
      </div>

      <ol className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-y-12 md:grid-cols-4 md:gap-x-10 md:gap-y-0">
        {plans.map((plan, idx) => {
          const Icon = icons[idx];
          const accent = STAGE_ACCENTS[idx] ?? '#F8FAFC';
          const isCurrent = !!plan.isHighlight;
          const isLast = idx === plans.length - 1;

          return (
            <li
              key={`${plan.title}-${idx}`}
              className={`group relative min-w-0 pt-5 transition-[opacity,transform] duration-500 ${
                isCurrent ? 'opacity-100' : 'opacity-80 hover:-translate-y-1 hover:opacity-100 md:opacity-65'
              }`}
            >
              <span
                aria-hidden
                className="absolute left-0 right-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, ${accent}, ${accent}33)` }}
              />

              <div className="flex items-start justify-between gap-4">
                <Icon
                  size={27}
                  className="shrink-0 transition-transform duration-500 group-hover:translate-x-1"
                  style={{ color: accent, filter: isCurrent ? `drop-shadow(0 0 12px ${accent}80)` : 'none' }}
                />
                <p
                  className="text-right font-mono text-[9px] font-medium uppercase tracking-[0.2em] md:text-[10px]"
                  style={{ color: accent }}
                >
                  {plan.status}
                </p>
              </div>

              <h3 className="mt-5 text-2xl font-black leading-tight tracking-[-0.045em] text-white md:text-[1.65rem]">
                {plan.title}
              </h3>
              <p className="mt-3 text-[13px] font-medium leading-relaxed text-white/[0.52] md:text-[13.5px]">
                {plan.desc}
              </p>

              {!isLast && (
                <>
                  <ArrowRight
                    aria-hidden
                    size={24}
                    className="absolute -right-8 top-[46%] hidden md:block"
                    style={{ color: `${accent}99` }}
                  />
                  <ArrowDown
                    aria-hidden
                    size={22}
                    className="absolute -bottom-9 left-1/2 -translate-x-1/2 md:hidden"
                    style={{ color: `${accent}99` }}
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>

      <aside className="relative z-10 mx-auto mt-12 w-full max-w-6xl md:mt-14">
        <div className="flex items-center gap-4">
          <Code2
            size={25}
            className="shrink-0 text-violet-300 drop-shadow-[0_0_12px_rgba(196,181,253,0.4)]"
          />
          <h3 className="min-w-0 text-[15px] font-black tracking-[-0.02em] text-white sm:shrink-0 md:text-xl">
            {parallelTitle}
          </h3>
          <span
            aria-hidden
            className="hidden h-px min-w-6 flex-1 bg-gradient-to-r from-violet-300/80 via-cyan-300/60 to-yellow-300/80 sm:block"
          />
        </div>
        <p className="mt-3 max-w-4xl pl-10 text-[12.5px] font-medium leading-relaxed text-white/50 md:pl-10 md:text-[14px]">
          {parallelDescription}
        </p>
      </aside>
    </Section>
  );
};

export default Roadmap;
