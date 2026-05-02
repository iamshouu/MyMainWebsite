import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Send, Sparkle } from 'lucide-react';
import InfiniteGridBackground from './InfiniteGridBackground';
import { GooeyText } from './GooeyText';
import type { UiLocale } from '../constants';

type MentorshipCopy = {
  back: string;
  badge1: string;
  badge2: string;
  title: string;
  heroSub: string;
  heroBody: string;
  asideTitle: string;
  asideLines: [string, string, string];
  sectionTitle: string;
  features: { title: string; desc: string }[];
  resultTitle: string;
  resultLead: string;
  resultItems: string[];
  resultHighlight: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  ctaNote: string;
};

type FeatureIcon = {
  step: string;
  CustomIcon: React.ComponentType<{ className?: string }>;
};

interface MentorshipViewProps {
  copy: MentorshipCopy;
  features: FeatureIcon[];
  locale: UiLocale;
  isRu: boolean;
  onLocaleChange: (l: UiLocale) => void;
  onClose: () => void;
  telegramUrl: string;
}

// Per-pillar accent palette
const PILLAR_ACCENTS: { hex: string; soft: string; glow: string; border: string }[] = [
  { hex: '#C7A6FF', soft: 'rgba(199, 166, 255, 0.4)', glow: 'rgba(199, 166, 255, 0.18)', border: 'rgba(199, 166, 255, 0.32)' }, // violet
  { hex: '#5BC2D6', soft: 'rgba(91, 194, 214, 0.4)', glow: 'rgba(91, 194, 214, 0.18)', border: 'rgba(91, 194, 214, 0.32)' }, // cyan/teal
  { hex: '#7FB7FF', soft: 'rgba(127, 183, 255, 0.4)', glow: 'rgba(127, 183, 255, 0.18)', border: 'rgba(127, 183, 255, 0.32)' }, // sky
  { hex: '#7DD3A1', soft: 'rgba(125, 211, 161, 0.4)', glow: 'rgba(125, 211, 161, 0.18)', border: 'rgba(125, 211, 161, 0.32)' }, // emerald
];

const HIDDEN_TZ = -1500;
const HIDDEN_BLUR = 12;
const HIDDEN_ROT_X = -18;

// Splits the title into per-letter spans with staggered "rise" animation.
// Re-keys on text change so the animation re-fires on locale switch.
const TitleLetters: React.FC<{ text: string; uniqueKey: string }> = ({ text, uniqueKey }) => {
  const chars = Array.from(text);
  return (
    <span aria-label={text} key={uniqueKey} className="inline-block">
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block animate-letter-rise"
          style={{
            animationDelay: `${i * 60}ms`,
            whiteSpace: ch === ' ' ? 'pre' : undefined,
          }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
};

const MentorshipView: React.FC<MentorshipViewProps> = ({
  copy,
  features,
  locale,
  isRu,
  onLocaleChange,
  onClose,
  telegramUrl,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLHeadingElement>(null);

  // Pillars depth-emerge driven by overlay scroll position
  useEffect(() => {
    const overlay = overlayRef.current;
    const pillars = pillarsRef.current;
    if (!overlay || !pillars) return;

    let scheduled = false;
    const update = () => {
      scheduled = false;
      const vh = window.innerHeight;
      const rect = pillars.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      const intro = Math.max(0, Math.min(1, 1 - sectionTop / vh));
      const pinnedRange = Math.max(1, sectionHeight - vh);
      const stackProgress = Math.max(0, Math.min(1, -sectionTop / pinnedRange));

      if (watermarkRef.current) {
        const w = watermarkRef.current;
        w.style.opacity = String(intro * 0.06);
        const ty = (1 - intro) * 30;
        const scale = 0.94 + intro * 0.06;
        w.style.transform = `translate(-50%, ${ty}px) scale(${scale})`;
      }

      if (headerRef.current) {
        const h = headerRef.current;
        h.style.opacity = String(intro);
        const ty = (1 - intro) * 36;
        h.style.transform = `translateY(${ty}px)`;
      }

      const total = features.length;
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        let cp: number;
        if (idx === 0) {
          cp = intro;
        } else if (total > 1) {
          const chunk = 1 / (total - 1);
          const start = (idx - 1) * chunk;
          const end = idx * chunk;
          cp = Math.max(0, Math.min(1, (stackProgress - start) / (end - start)));
        } else {
          cp = 1;
        }
        const eased = 1 - Math.pow(1 - cp, 3);
        const z = HIDDEN_TZ * (1 - eased);
        const rotX = HIDDEN_ROT_X * (1 - eased);
        const blur = HIDDEN_BLUR * (1 - eased);
        card.style.transform = `translate3d(0,0,${z.toFixed(1)}px) rotateX(${rotX.toFixed(2)}deg)`;
        card.style.opacity = cp.toFixed(3);
        card.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : 'none';
      });
    };

    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    };

    overlay.addEventListener('scroll', onScroll, { passive: true });
    update();
    const onResize = () => update();
    window.addEventListener('resize', onResize);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => update()) : null;
    ro?.observe(pillars);
    return () => {
      overlay.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
  }, [features.length]);

  // Generic reveal-on-scroll for elements with .reveal-rise class
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const targets = overlay.querySelectorAll<HTMLElement>('.reveal-rise');
    if (targets.length === 0) return;

    // Immediate fallback: anything already inside the overlay's visible viewport
    // gets revealed right away. Avoids relying solely on IntersectionObserver,
    // which can be suppressed (background tabs, certain headless contexts) and
    // would leave above-the-fold elements stuck in the hidden state.
    const oRect = overlay.getBoundingClientRect();
    targets.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom > oRect.top && r.top < oRect.bottom) {
        el.classList.add('revealed');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: overlay, threshold: 0.18 },
    );
    targets.forEach((el) => {
      if (!el.classList.contains('revealed')) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [locale]);

  // Reset overlay scroll to top when locale changes (new content layout)
  useEffect(() => {
    if (overlayRef.current) overlayRef.current.scrollTop = 0;
  }, [locale]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] isolate overflow-y-auto font-['Outfit',sans-serif]"
      lang={locale === 'ru' ? 'ru' : 'en'}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
        <InfiniteGridBackground accent="red" />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/30 to-black/60"
        aria-hidden
      />

      {/* Sub-header — sticky just BELOW the main page header (which floats on
          z-[300]) so the BACK pill never collides with the volume widget on
          the left or the main nav cluster on the right. */}
      <header className="sticky top-[88px] md:top-[120px] z-30 flex items-center justify-between gap-3 px-4 md:px-12 lg:px-20 pb-4 pointer-events-none">
        <button
          type="button"
          onClick={onClose}
          className="group inline-flex items-center gap-2 md:gap-3 rounded-full border border-white/12 bg-black/55 px-3 md:px-4 py-2 text-white/65 hover:text-white hover:border-white/30 transition-all backdrop-blur-md pointer-events-auto"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform md:w-4 md:h-4" />
          <span className="font-mono text-[8px] md:text-[10px] tracking-widest">{copy.back}</span>
        </button>

        <div
          className="flex rounded-full border border-white/15 bg-black/55 p-0.5 font-mono text-[9px] md:text-[10px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md pointer-events-auto"
          role="group"
          aria-label={isRu ? 'Язык страницы' : 'Page language'}
        >
          <button
            type="button"
            onClick={() => onLocaleChange('en')}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              locale === 'en' ? 'bg-white/15 text-white' : 'text-white/45 hover:text-white/85'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => onLocaleChange('ru')}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              locale === 'ru' ? 'bg-white/15 text-white' : 'text-white/45 hover:text-white/85'
            }`}
          >
            RU
          </button>
        </div>
      </header>

      {/* Hero stage */}
      <section className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-4 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="w-full max-w-4xl text-center">
          {/* Eyebrow badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 md:mb-8 reveal-rise" style={{ transitionDelay: '60ms' }}>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 font-mono text-[9px] md:text-[10px] text-white/75 backdrop-blur-sm ${
                isRu ? 'tracking-wide' : 'uppercase tracking-[0.25em]'
              }`}
            >
              <Sparkle size={10} className="text-white/55" />
              {copy.badge1}
            </span>
            <span
              className={`inline-flex items-center rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[9px] md:text-[10px] text-white/45 backdrop-blur-sm ${
                isRu ? 'tracking-wide' : 'uppercase tracking-[0.2em]'
              }`}
            >
              {copy.badge2}
            </span>
          </div>

          {/* Title — gooey morphing through related concepts; rises into view
              like the other hero elements (200ms after the badges) */}
          <h1
            className="mb-5 md:mb-7 reveal-rise"
            aria-label={copy.title}
            style={{ transitionDelay: '220ms' }}
          >
            <GooeyText
              key={locale}
              texts={
                isRu
                  ? ['Менторство', 'Обучение', 'Практика', 'Результат']
                  : ['Mentorship', 'Training', 'Practice', 'Results']
              }
              morphTime={1}
              cooldownTime={1.6}
              className="h-[clamp(3.5rem,12vw,8.5rem)] w-full"
              textClassName="text-[clamp(3rem,11vw,7.5rem)] font-black tracking-tighter leading-none text-white whitespace-nowrap"
              ariaLabel={copy.title}
            />
          </h1>

          {/* Subtitle */}
          <p
            className="mb-6 md:mb-8 text-[clamp(1.05rem,2.4vw,1.4rem)] font-medium tracking-tight text-white/85 max-w-2xl mx-auto reveal-rise"
            style={{ transitionDelay: '420ms' }}
          >
            {copy.heroSub}
          </p>

          {/* Body */}
          <p
            className="text-[15px] md:text-[17px] leading-relaxed text-white/65 max-w-2xl mx-auto reveal-rise"
            style={{ transitionDelay: '560ms' }}
          >
            {copy.heroBody}
          </p>

          {/* TL;DR pills */}
          <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-3 max-w-3xl mx-auto">
            {copy.asideLines.map((line, i) => (
              <div
                key={line}
                className="reveal-rise rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-md px-4 py-3 text-left flex items-start gap-2.5"
                style={{ transitionDelay: `${720 + i * 100}ms` }}
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                <span className="text-[13px] md:text-[14px] leading-relaxed text-white/82">{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mt-14 md:mt-20 flex flex-col items-center gap-2 reveal-rise" style={{ transitionDelay: '1100ms' }}>
          <span className={`font-mono text-[9px] md:text-[10px] text-white/40 ${isRu ? '' : 'uppercase tracking-[0.4em]'}`}>
            {isRu ? 'Скролл вниз' : 'scroll'}
          </span>
          <span className="h-8 w-[1px] bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Pillars stage — sticky depth */}
      <section ref={pillarsRef} className="relative w-full z-10">
        {features.map((_, idx) => (
          <div key={`pillar-spacer-${idx}`} aria-hidden className="h-[100dvh]" />
        ))}

        <div className="absolute inset-0 pointer-events-none">
          <div
            className="sticky top-0 left-0 w-full h-[100dvh] flex flex-col items-center justify-center pointer-events-auto px-4 md:px-12 lg:px-20 py-10 overflow-hidden"
            style={{ perspective: '1400px', perspectiveOrigin: 'center 45%' }}
          >
            {/* Watermark */}
            <h2
              ref={watermarkRef}
              aria-hidden
              className="absolute top-6 md:top-12 left-1/2 select-none pointer-events-none w-full text-center whitespace-nowrap font-black uppercase tracking-tighter text-white text-5xl md:text-[10rem]"
              style={{
                opacity: 0,
                transform: 'translate(-50%, 30px) scale(0.94)',
                willChange: 'transform, opacity',
              }}
            >
              {isRu ? 'Опоры' : 'Pillars'}
            </h2>

            {/* Section header */}
            <div
              ref={headerRef}
              className="relative z-10 flex flex-col items-center mb-8 md:mb-12"
              style={{ opacity: 0, transform: 'translateY(36px)', willChange: 'transform, opacity' }}
            >
              <p
                className={`font-mono text-[10px] md:text-[12px] mb-3 text-white/85 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] ${
                  isRu ? 'tracking-[0.5em]' : 'uppercase tracking-[0.6em]'
                }`}
              >
                {copy.sectionTitle}
              </p>
              <div className="h-[1px] w-24 md:w-44 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            </div>

            {/* Card grid */}
            <div
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 w-full max-w-6xl px-2 md:px-4 relative z-10"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {features.map((feat, idx) => {
                const Icon = feat.CustomIcon;
                const accent = PILLAR_ACCENTS[idx % PILLAR_ACCENTS.length];
                const data = copy.features[idx] || { title: '', desc: '' };
                return (
                  <div
                    key={feat.step}
                    ref={(el) => { cardRefs.current[idx] = el; }}
                    className="relative"
                    style={{
                      transform: `translate3d(0,0,${HIDDEN_TZ}px) rotateX(${HIDDEN_ROT_X}deg)`,
                      opacity: 0,
                      filter: `blur(${HIDDEN_BLUR}px)`,
                      willChange: 'transform, opacity, filter',
                      transformStyle: 'preserve-3d',
                    }}
                    aria-hidden={idx > 0}
                  >
                    <div
                      className="group relative h-full rounded-2xl md:rounded-3xl border bg-black/55 backdrop-blur-xl p-5 md:p-7 flex flex-col gap-3 transition-colors duration-500"
                      style={{
                        borderColor: accent.border,
                        boxShadow: `0 24px 60px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                      }}
                    >
                      <span
                        className="absolute top-0 left-6 right-6 h-[1px]"
                        style={{ background: `linear-gradient(90deg, transparent, ${accent.soft}, transparent)` }}
                        aria-hidden
                      />
                      <span
                        className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-20 rounded-full blur-3xl pointer-events-none"
                        style={{ background: accent.glow }}
                        aria-hidden
                      />

                      <div className="flex items-center justify-between gap-3">
                        <span
                          className="font-mono text-xl md:text-2xl font-black leading-none tabular-nums tracking-[0.12em]"
                          style={{ color: accent.hex, opacity: 0.6 }}
                        >
                          {feat.step}
                        </span>
                        <div
                          className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl border ring-2 ring-black/55"
                          style={{
                            borderColor: accent.border,
                            background: `linear-gradient(135deg, ${accent.glow}, rgba(0,0,0,0.6))`,
                            color: accent.hex,
                          }}
                        >
                          <Icon className="h-6 w-6 md:h-7 md:w-7" />
                        </div>
                      </div>
                      <h3
                        className="text-base md:text-lg font-bold text-white leading-snug tracking-tight"
                      >
                        {data.title}
                      </h3>
                      <p className="text-[12px] md:text-[14px] leading-relaxed text-white/65">
                        {data.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Results — list cascade reveal */}
      <section className="relative z-10 px-4 md:px-12 lg:px-20 py-20 md:py-32">
        <div className="max-w-3xl mx-auto">
          <p
            className={`reveal-rise text-[10px] md:text-[11px] font-semibold tracking-[0.3em] text-white/45 mb-3 ${isRu ? '' : 'uppercase'}`}
          >
            {copy.resultTitle}
          </p>
          <h3
            className="reveal-rise text-2xl md:text-4xl font-black tracking-tight text-white mb-5 leading-tight"
            style={{ transitionDelay: '80ms' }}
          >
            {copy.resultLead}
          </h3>

          <ul className="space-y-2.5 md:space-y-3 mt-8 md:mt-10">
            {copy.resultItems.map((item, idx) => (
              <li
                key={item}
                className="reveal-rise group relative overflow-hidden rounded-2xl border border-white/12 bg-black/35 backdrop-blur-md px-4 py-3.5 md:px-5 md:py-4 flex items-start gap-3.5"
                style={{ transitionDelay: `${idx * 90}ms` }}
              >
                <span
                  className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-cyan-300/70 via-white/35 to-indigo-400/70 opacity-80"
                  aria-hidden
                />
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 font-mono text-[10px] font-bold text-white/90">
                  {idx + 1}
                </span>
                <span className="text-[14px] md:text-[15px] font-medium leading-relaxed text-white/88">{item}</span>
              </li>
            ))}
          </ul>

          <div
            className="reveal-rise mt-8 rounded-2xl border border-cyan-300/25 bg-gradient-to-r from-cyan-500/12 via-white/[0.06] to-indigo-500/12 px-5 py-4 md:px-6 md:py-5 shadow-[0_0_30px_rgba(56,189,248,0.08)]"
            style={{ transitionDelay: `${(copy.resultItems.length + 1) * 90}ms` }}
          >
            <p className="text-[14px] md:text-[16px] font-semibold leading-relaxed text-white">{copy.resultHighlight}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 min-h-[100dvh] flex items-center px-4 md:px-12 lg:px-20 py-16 md:py-24">
        <div
          className="reveal-rise relative w-full max-w-3xl mx-auto rounded-3xl border border-white/15 bg-gradient-to-br from-black/65 via-black/45 to-black/65 p-7 md:p-12 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
        >
          <span
            className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl"
            style={{ background: 'rgba(91, 194, 214, 0.16)' }}
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full blur-3xl"
            style={{ background: 'rgba(199, 166, 255, 0.14)' }}
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-y-6 left-0 w-[3px] rounded-full bg-gradient-to-b from-cyan-400/80 via-white/40 to-indigo-500/80"
            aria-hidden
          />

          <div className="relative flex flex-col gap-6 md:gap-8">
            <div>
              <p
                className={`text-[10px] md:text-[11px] font-semibold tracking-[0.3em] text-white/45 mb-2 ${isRu ? '' : 'uppercase'}`}
              >
                {copy.ctaEyebrow}
              </p>
              <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">{copy.ctaTitle}</h3>
              <p className="mt-3 text-[14px] md:text-[15px] leading-relaxed text-white/65 max-w-xl">{copy.ctaBody}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white px-7 md:px-8 py-3.5 md:py-4 text-black text-[11px] md:text-[12px] font-bold tracking-[0.2em] shadow-[0_12px_48px_rgba(0,0,0,0.55)] hover:shadow-[0_16px_56px_rgba(255,255,255,0.18)] hover:bg-white/95 transition-all relative overflow-hidden ${
                  isRu ? '' : 'uppercase'
                }`}
              >
                <span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-hidden
                />
                <Send size={15} className="relative" />
                <span className="relative">{copy.ctaButton}</span>
              </a>
              <p
                className={`text-[10px] md:text-[11px] font-medium text-white/40 max-w-[16rem] leading-relaxed ${
                  isRu ? '' : 'uppercase tracking-widest'
                }`}
              >
                {copy.ctaNote}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MentorshipView;
