import React from 'react';
import Section from './Section';
import type { MainSiteStat } from '../constants';

interface AboutMeProps {
  watermark: string;
  subtitle: string;
  bio: string;
  stats: MainSiteStat[];
}

const AboutMe: React.FC<AboutMeProps> = ({ watermark, subtitle, bio, stats }) => {
  return (
    <Section id="about">
      {/* Big faded watermark — section title style kept, static */}
      <h2
        className="absolute top-[6%] left-1/2 -translate-x-1/2 w-full text-center whitespace-nowrap text-5xl md:text-[10rem] font-black text-white uppercase tracking-tighter select-none pointer-events-none opacity-[0.06]"
        aria-hidden
      >
        {watermark}
      </h2>

      {/* Header — section title style kept */}
      <div className="relative z-10 flex flex-col items-center mb-8 md:mb-12">
        <p className="text-white font-mono text-[11px] md:text-[16px] uppercase tracking-[0.8em] font-black mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] text-center">
          {subtitle}
        </p>
        <div className="h-[1px] w-32 md:w-56 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
      </div>

      {/* Narrative + fact cards */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center gap-8 md:gap-12">
        {/* Bio — first-person narrative */}
        <p className="text-center text-[15px] md:text-[19px] lg:text-[21px] leading-relaxed md:leading-relaxed text-white/75 font-medium">
          {bio}
        </p>

        {/* Fact cards — neutral grey, on-brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 w-full">
          {stats.map((stat, idx) => (
            <FactCard key={`${stat.label}-${idx}`} stat={stat} />
          ))}
        </div>
      </div>
    </Section>
  );
};

const FactCard: React.FC<{ stat: MainSiteStat }> = ({ stat }) => (
  <div className="group relative bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-colors duration-500 p-6 md:p-8 rounded-3xl md:rounded-[2rem] flex flex-col overflow-hidden">
    {/* Top accent bar — neutral */}
    <span
      className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
      aria-hidden
    />

    <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.32em] md:tracking-[0.4em] text-white/45 mb-3 md:mb-4">
      {stat.label}
    </p>

    {stat.variant === 'markets' ? (
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-2xl md:text-3xl lg:text-[2.1rem] font-black tracking-tighter text-white">
        <span>{stat.segments[0]}</span>
        <span className="text-white/25" aria-hidden>/</span>
        <span>{stat.segments[1]}</span>
        <span className="text-white/25" aria-hidden>/</span>
        <span>{stat.segments[2]}</span>
      </p>
    ) : (
      <p className="text-2xl md:text-3xl lg:text-[2.1rem] font-black text-white tracking-tighter">
        {stat.value}
      </p>
    )}

    <p className="text-[12.5px] md:text-[14px] text-white/55 mt-3 md:mt-4 font-medium leading-relaxed">
      {stat.description}
    </p>
  </div>
);

export default AboutMe;
