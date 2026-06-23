import React from 'react';
import Section from './Section';
import type { RoadmapPlanCopy } from '../constants';

interface RoadmapProps {
  watermark: string;
  subtitle: string;
  plans: RoadmapPlanCopy[];
  icons: ReadonlyArray<React.ComponentType<{ size?: number; className?: string }>>;
}

const Roadmap: React.FC<RoadmapProps> = ({ watermark, subtitle, plans, icons }) => {
  return (
    <Section id="roadmap">
      {/* Big faded watermark — section title style kept, static */}
      <h2
        className="absolute top-[6%] left-1/2 -translate-x-1/2 w-full text-center whitespace-nowrap text-5xl md:text-[10rem] font-black text-white uppercase tracking-tighter select-none pointer-events-none opacity-[0.06]"
        aria-hidden
      >
        {watermark}
      </h2>

      {/* Header — section title style kept */}
      <div className="relative z-10 flex flex-col items-center mb-12 md:mb-16">
        <p className="text-white font-mono text-[11px] md:text-[16px] uppercase tracking-[0.8em] font-black mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] text-center">
          {subtitle}
        </p>
        <div className="h-[1px] w-32 md:w-56 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
      </div>

      {/* Horizontal stepper */}
      <ol className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-12 sm:gap-4">
        {/* Continuous connector line through the node centers (desktop) */}
        <span
          className="hidden sm:block absolute top-7 left-[12.5%] right-[12.5%] h-[1px] bg-gradient-to-r from-white/10 via-white/15 to-white/10"
          aria-hidden
        />

        {plans.map((plan, idx) => {
          const Icon = icons[idx];
          const isCurrent = !!plan.isHighlight;
          return (
            <li key={idx} className="relative flex flex-col items-center text-center">
              {/* Node */}
              <div
                className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center border transition-colors duration-500 ${
                  isCurrent
                    ? 'bg-white text-black border-white shadow-[0_0_24px_rgba(255,255,255,0.22)]'
                    : 'bg-white/[0.03] text-white border-white/15'
                }`}
              >
                <Icon size={22} />
              </div>

              {/* Step number */}
              <span className="mt-4 font-mono text-[10px] tracking-[0.35em] text-white/40">
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Title */}
              <h3 className="mt-2 text-base md:text-lg font-bold tracking-tight text-white">
                {plan.title}
              </h3>

              {/* Description */}
              <p className="mt-2 max-w-[230px] text-[12.5px] md:text-[13px] text-white/55 font-medium leading-relaxed">
                {plan.desc}
              </p>

              {/* Status */}
              <span
                className={`mt-4 inline-block font-mono text-[9px] uppercase tracking-[0.25em] px-2.5 py-1 rounded border ${
                  isCurrent ? 'border-white/30 text-white/80' : 'border-white/10 text-white/40'
                }`}
              >
                {plan.status}
              </span>
            </li>
          );
        })}
      </ol>
    </Section>
  );
};

export default Roadmap;
