import React, { useEffect, useRef } from 'react';
import type { MainSiteStat } from '../constants';

interface AboutMeProps {
  watermark: string;
  subtitle: string;
  stats: MainSiteStat[];
}

type Accent = {
  text: string;
  border: string;
  borderHover: string;
  glow: string;
  bar: string;
};

const ACCENTS: Accent[] = [
  // amber — Experience
  {
    text: '#F5B642',
    border: 'rgba(245, 182, 66, 0.32)',
    borderHover: 'rgba(245, 182, 66, 0.55)',
    glow: 'rgba(245, 182, 66, 0.18)',
    bar: 'rgba(245, 182, 66, 0.5)',
  },
  // cyan — Markets
  {
    text: '#5BC2D6',
    border: 'rgba(91, 194, 214, 0.32)',
    borderHover: 'rgba(91, 194, 214, 0.55)',
    glow: 'rgba(91, 194, 214, 0.18)',
    bar: 'rgba(91, 194, 214, 0.5)',
  },
  // violet — Strategy
  {
    text: '#B49AF5',
    border: 'rgba(180, 154, 245, 0.32)',
    borderHover: 'rgba(180, 154, 245, 0.55)',
    glow: 'rgba(180, 154, 245, 0.18)',
    bar: 'rgba(180, 154, 245, 0.5)',
  },
];

const PEEK_PERCENT = 8;             // each card lands this many % below the previous one
const HIDDEN_TY_PERCENT = 115;      // starting position below container before emerging
const MAX_BLUR_PER_COVER = 5;       // px of blur applied per covering card

const AboutMe: React.FC<AboutMeProps> = ({ watermark, subtitle, stats }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLHeadingElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotsContainerRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const main = section.closest('main');
    if (!main) return;

    let scheduled = false;
    const update = () => {
      scheduled = false;
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      const intro = Math.max(0, Math.min(1, 1 - sectionTop / vh));
      const pinnedRange = Math.max(1, sectionHeight - vh);
      const stackProgress = Math.max(0, Math.min(1, -sectionTop / pinnedRange));

      const total = stats.length;

      if (watermarkRef.current) {
        const w = watermarkRef.current;
        w.style.opacity = String(intro * 0.07);
        const ty = (1 - intro) * 30;
        const scale = 0.94 + intro * 0.06;
        w.style.transform = `translate(-50%, ${ty}px) scale(${scale})`;
      }

      if (headerRef.current) {
        const h = headerRef.current;
        h.style.opacity = String(intro);
        const ty = (1 - intro) * 40;
        const scale = 0.95 + intro * 0.05;
        h.style.transform = `translateY(${ty}px) scale(${scale})`;
      }

      // Compute progress for each card first so we can derive coverage-based blur
      const cardProgresses: number[] = [];
      for (let i = 0; i < total; i++) {
        if (i === 0) {
          cardProgresses.push(intro);
        } else if (total > 1) {
          const chunk = 1 / (total - 1);
          const start = (i - 1) * chunk;
          const end = i * chunk;
          cardProgresses.push(Math.max(0, Math.min(1, (stackProgress - start) / (end - start))));
        } else {
          cardProgresses.push(1);
        }
      }

      cardProgresses.forEach((cp, idx) => {
        const card = cardRefs.current[idx];
        if (!card) return;
        // Landed position: each subsequent card sits PEEK_PERCENT below the previous
        const landedTy = idx * PEEK_PERCENT;
        const ty = (1 - cp) * HIDDEN_TY_PERCENT + cp * landedTy;
        const scale = 0.97 + cp * 0.03;
        const opacity = cp;
        // Coverage from cards layered on top of this one
        let coverage = 0;
        for (let k = idx + 1; k < cardProgresses.length; k++) coverage += cardProgresses[k];
        const blur = coverage * MAX_BLUR_PER_COVER;
        card.style.transform = `translate3d(0, ${ty}%, 0) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.filter = blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : 'none';
      });

      if (dotsContainerRef.current) {
        dotsContainerRef.current.style.opacity = String(intro);
      }

      const activeDot = total > 1
        ? Math.max(0, Math.min(total - 1, Math.floor(stackProgress * (total - 1) + 0.0001)))
        : 0;
      dotRefs.current.forEach((dot, idx) => {
        if (!dot) return;
        const isActive = idx === activeDot;
        const desktop = window.innerWidth >= 768;
        dot.style.width = isActive ? (desktop ? '48px' : '32px') : (desktop ? '12px' : '8px');
        dot.style.backgroundColor = isActive ? ACCENTS[idx % ACCENTS.length].text : 'rgba(255,255,255,0.25)';
        dot.style.boxShadow = isActive ? `0 0 12px ${ACCENTS[idx % ACCENTS.length].glow}` : 'none';
      });

      if (hintRef.current) {
        const fade = intro * (1 - Math.min(1, stackProgress * 4));
        hintRef.current.style.opacity = String(Math.max(0, fade) * 0.6);
      }
    };

    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    };

    main.addEventListener('scroll', onScroll, { passive: true });
    update();
    const onResize = () => update();
    window.addEventListener('resize', onResize);
    // ResizeObserver catches the section finishing layout (e.g., when CDN
    // Tailwind JIT applies h-[100dvh] after first paint, or fonts load and
    // shift content). Without this the initial update() may run with stale
    // dimensions and never re-fire on hidden/idle tabs.
    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => update())
      : null;
    ro?.observe(section);
    return () => {
      main.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
  }, [stats.length]);

  // Stack container is taller than a single card by (numCards-1)*PEEK_PERCENT of card height
  const extraRatio = (stats.length - 1) * PEEK_PERCENT / 100;
  const stackAspectRatio = `1 / ${(1 + extraRatio).toFixed(3)}`;

  return (
    <section ref={sectionRef} id="about" className="relative w-full">
      {stats.map((_, idx) => (
        <div key={`spacer-${idx}`} aria-hidden="true" className="h-[100dvh]" />
      ))}

      <div className="absolute inset-0 pointer-events-none">
        <div className="sticky top-0 left-0 w-full h-[100dvh] flex flex-col items-center justify-center pointer-events-auto px-4 md:px-20 py-8 md:py-10 overflow-hidden">
          <h2
            ref={watermarkRef}
            className="text-5xl md:text-[10rem] font-black text-white uppercase tracking-tighter absolute top-6 md:top-12 left-1/2 select-none pointer-events-none w-full whitespace-nowrap text-center"
            style={{
              opacity: 0,
              transform: 'translate(-50%, 30px) scale(0.94)',
              willChange: 'transform, opacity',
            }}
          >
            {watermark}
          </h2>

          <div
            ref={headerRef}
            className="relative z-10 flex flex-col items-center mb-5 md:mb-8"
            style={{
              opacity: 0,
              transform: 'translateY(40px) scale(0.95)',
              willChange: 'transform, opacity',
            }}
          >
            <p className="text-white font-mono text-[11px] md:text-[16px] uppercase tracking-[0.8em] font-black mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              {subtitle}
            </p>
            <div className="h-[1px] w-32 md:w-56 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
          </div>

          {/* Card stack — square cards with vertical peek so previous card's edge stays visible */}
          <div
            className="relative z-10 w-[min(440px,86vw)] md:w-[480px] lg:w-[520px] mx-auto"
            style={{ aspectRatio: stackAspectRatio }}
          >
            {stats.map((stat, idx) => {
              const accent = ACCENTS[idx % ACCENTS.length];
              return (
                <div
                  key={`card-${idx}`}
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  className="absolute left-0 right-0 top-0 aspect-square"
                  style={{
                    zIndex: idx + 1,
                    willChange: 'transform, opacity, filter',
                    transform: `translate3d(0, ${HIDDEN_TY_PERCENT}%, 0) scale(0.97)`,
                    opacity: 0,
                  }}
                  aria-hidden={idx > 0}
                >
                  <Card stat={stat} accent={accent} />
                </div>
              );
            })}
          </div>

          <div
            ref={dotsContainerRef}
            className="mt-6 md:mt-8 flex items-center gap-2 md:gap-3 relative z-10"
            style={{ opacity: 0 }}
          >
            {stats.map((_, idx) => (
              <span
                key={`dot-${idx}`}
                ref={(el) => { dotRefs.current[idx] = el; }}
                className="h-1 rounded-full"
                style={{
                  width: '8px',
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  transition: 'width 300ms ease-out, background-color 300ms ease-out, box-shadow 300ms ease-out',
                }}
              />
            ))}
          </div>

          <p
            ref={hintRef}
            className="mt-4 md:mt-5 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.4em] text-white/60 relative z-10"
            style={{ opacity: 0 }}
          >
            scroll to continue
          </p>
        </div>
      </div>
    </section>
  );
};

const Card: React.FC<{ stat: MainSiteStat; accent: Accent }> = ({ stat, accent }) => (
  <div
    className="group relative w-full h-full bg-black/75 backdrop-blur-xl border transition-colors duration-500 p-6 sm:p-8 md:p-10 rounded-3xl md:rounded-[2rem] flex flex-col justify-center overflow-hidden"
    style={{
      borderColor: accent.border,
      boxShadow: `0 30px 80px ${accent.glow}, 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)`,
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLDivElement).style.borderColor = accent.borderHover;
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLDivElement).style.borderColor = accent.border;
    }}
  >
    {/* Top accent bar */}
    <span
      className="absolute top-0 left-8 right-8 h-[1px]"
      style={{ background: `linear-gradient(90deg, transparent, ${accent.bar}, transparent)` }}
      aria-hidden
    />
    {/* Subtle accent glow inside top of card */}
    <span
      className="absolute -top-12 left-1/2 -translate-x-1/2 w-44 h-24 rounded-full blur-3xl pointer-events-none"
      style={{ background: accent.glow }}
      aria-hidden
    />
    <p
      className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.32em] md:tracking-[0.42em] mb-3 md:mb-5 relative"
      style={{ color: accent.text }}
    >
      {stat.label}
    </p>
    {stat.variant === 'markets' ? (
      <p className="flex flex-wrap items-baseline gap-x-2 md:gap-x-3 gap-y-1 text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white relative">
        <span>{stat.segments[0]}</span>
        <span className="text-white/30" aria-hidden>/</span>
        <span>{stat.segments[1]}</span>
        <span className="text-white/30" aria-hidden>/</span>
        <span>{stat.segments[2]}</span>
      </p>
    ) : (
      <p className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter relative">
        {stat.value}
      </p>
    )}
    <p className="text-[13px] md:text-[15px] lg:text-[16px] text-white/65 mt-3 md:mt-5 font-medium leading-relaxed relative">
      {stat.description}
    </p>
  </div>
);

export default AboutMe;
