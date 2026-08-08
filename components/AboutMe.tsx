import React from 'react';
import Section from './Section';
import type { MainSiteStat } from '../constants';

interface AboutMeProps {
  watermark: string;
  subtitle: string;
  bio: string;
  stats: MainSiteStat[];
}

const PRACTICE_ACCENTS = ['#67E8F9', '#A78BFA'] as const;

const AboutMe: React.FC<AboutMeProps> = ({ watermark, subtitle, bio, stats }) => {
  return (
    <Section id="about">
      <h2
        className="absolute top-[6%] left-1/2 -translate-x-1/2 w-full text-center whitespace-nowrap text-5xl md:text-[10rem] font-black text-white uppercase tracking-tighter select-none pointer-events-none opacity-[0.06]"
        aria-hidden
      >
        {watermark}
      </h2>

      <div className="relative z-10 flex flex-col items-center mb-7 md:mb-10">
        <p className="text-white font-mono text-[11px] md:text-[16px] uppercase tracking-[0.8em] font-black mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] text-center">
          {subtitle}
        </p>
        <div className="h-[1px] w-32 md:w-56 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <p className="mx-auto max-w-4xl text-center text-[15px] md:text-[19px] lg:text-[21px] leading-relaxed text-white/75 font-medium">
          {bio}
        </p>

        <div className="relative mt-9 grid grid-cols-1 gap-9 md:mt-12 md:grid-cols-2 md:gap-0">
          <span
            aria-hidden
            className="absolute bottom-0 left-1/2 top-0 hidden w-px bg-gradient-to-b from-transparent via-white/20 to-transparent md:block"
          />

          {stats.map((stat, idx) => {
            const accent = PRACTICE_ACCENTS[idx] ?? '#F8FAFC';

            return (
              <article
                key={`${stat.label}-${idx}`}
                className={`group relative pt-6 ${idx === 0 ? 'md:pr-14' : 'md:pl-14'}`}
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-px w-20 transition-[width] duration-700 ease-out group-hover:w-40"
                  style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
                />
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.34em] text-white/45">
                  {stat.label}
                </p>

                {stat.variant === 'markets' ? (
                  <h3 className="mt-3 flex flex-wrap items-baseline gap-x-2 text-[clamp(1.8rem,3.4vw,3.4rem)] font-black leading-[0.96] tracking-[-0.05em] text-white">
                    <span>{stat.segments[0]}</span>
                    <span className="text-white/20" aria-hidden>/</span>
                    <span>{stat.segments[1]}</span>
                    <span className="text-white/20" aria-hidden>/</span>
                    <span>{stat.segments[2]}</span>
                  </h3>
                ) : (
                  <h3 className="mt-3 text-[clamp(1.8rem,3.4vw,3.4rem)] font-black leading-[0.96] tracking-[-0.05em] text-white">
                    {stat.value}
                  </h3>
                )}

                <p className="mt-4 max-w-lg text-[13px] font-medium leading-relaxed text-white/55 md:text-[15px]">
                  {stat.description}
                </p>
              </article>
            );
          })}
        </div>

      </div>
    </Section>
  );
};

export default AboutMe;
