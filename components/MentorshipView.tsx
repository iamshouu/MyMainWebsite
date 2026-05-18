import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
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

// Per-pillar accent palette — palette mirrors the reference (violet,
// emerald, cyan, pink). Each entry exposes:
//   hex    → opaque accent color (icon glyph, glow seed)
//   tint   → translucent fill used for the glass background + icon-tile
//   glow   → diffuse halo around card and behind glyphs
//   soft   → divider/edge accents
//   border → subtle accent on the outer border (kept faint; main border is white-ish)
type Accent = { hex: string; soft: string; glow: string; border: string; tint: string };
// Hero card takes violet (matches the reference photo's leading wide tile).
// The 4 small cards cycle through the remaining colors so the hero never
// collides chromatically with the tile directly under it.
const HERO_ACCENT: Accent = {
  hex: '#C7A6FF', tint: 'rgba(199, 166, 255, 0.30)', soft: 'rgba(199, 166, 255, 0.45)', glow: 'rgba(199, 166, 255, 0.4)', border: 'rgba(199, 166, 255, 0.45)',
};
const PILLAR_ACCENTS: Accent[] = [
  { hex: '#4ADE80', tint: 'rgba(74, 222, 128, 0.26)',  soft: 'rgba(74, 222, 128, 0.45)',  glow: 'rgba(74, 222, 128, 0.35)',  border: 'rgba(74, 222, 128, 0.4)' },    // emerald
  { hex: '#5BD7E8', tint: 'rgba(91, 215, 232, 0.26)',  soft: 'rgba(91, 215, 232, 0.45)',  glow: 'rgba(91, 215, 232, 0.35)',  border: 'rgba(91, 215, 232, 0.4)' },    // cyan
  { hex: '#FBBF24', tint: 'rgba(251, 191, 36, 0.26)',  soft: 'rgba(251, 191, 36, 0.45)',  glow: 'rgba(251, 191, 36, 0.35)',  border: 'rgba(251, 191, 36, 0.4)' },    // amber
  { hex: '#F472B6', tint: 'rgba(244, 114, 182, 0.26)', soft: 'rgba(244, 114, 182, 0.45)', glow: 'rgba(244, 114, 182, 0.35)', border: 'rgba(244, 114, 182, 0.4)' },   // pink
];

// Chrome background ornaments per small card — matched to feature theme:
//   0 emerald (Personal program)   → document
//   1 cyan    (Full support)       → compass
//   2 amber   (Online conferences) → speech bubble
//   3 pink    (Flexible format)    → heart + audio waveform
//
// Paths use BASE_URL so they work both in dev (base "/") and on GitHub
// Pages prod (base "/Website/"). Without the prefix, the deployed site
// would request /images/... at the gh.io root and 404.
const BASE = import.meta.env.BASE_URL;
const PILLAR_IMAGES: string[] = [
  `${BASE}images/card-program-document.png`,
  `${BASE}images/card-support-compass.png`,
  `${BASE}images/card-conferences-bubble.png`,
  `${BASE}images/card-flexible-waveform.png`,
];

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

  // Persist overlay scroll position across reloads + locale switches.
  // The previous behavior forcibly reset scrollTop to 0 on every locale
  // change, which teleported users to the top mid-read — removed.
  // Save (throttled via rAF) on every scroll event.
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    let scheduled = false;
    const save = () => {
      scheduled = false;
      try {
        sessionStorage.setItem('mentorshipScroll', String(overlay.scrollTop));
      } catch {
        /* storage quota / privacy mode — silently ignore */
      }
    };
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(save);
    };
    overlay.addEventListener('scroll', onScroll, { passive: true });
    return () => overlay.removeEventListener('scroll', onScroll);
  }, []);

  // Restore overlay scroll on mount. Uses useLayoutEffect to write
  // scrollTop before paint. Retries up to ~1s via rAF in case content
  // (heavy sections) hasn't laid out tall enough yet to accept the
  // saved scrollTop.
  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    let target = 0;
    try {
      target = Number(sessionStorage.getItem('mentorshipScroll') || 0);
    } catch {
      return;
    }
    if (!target) return;
    let attempts = 0;
    let rafId = 0;
    const tryRestore = () => {
      const max = overlay.scrollHeight - overlay.clientHeight;
      if (max >= target) {
        overlay.scrollTop = target;
        return;
      }
      if (attempts++ < 60) {
        rafId = requestAnimationFrame(tryRestore);
      } else {
        // Content never grew tall enough — land at the furthest valid point
        overlay.scrollTop = Math.max(0, max);
      }
    };
    tryRestore();
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

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
          {/* Title — gooey morphing through related concepts; rises into view */}
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

          {/* TL;DR row — three key tags joined by accented slashes,
              flanked by gradient lines for an editorial feel. The slashes
              pick up the red palette of the mentorship section. */}
          <div
            className="reveal-rise mt-10 md:mt-14 flex flex-wrap items-center justify-center gap-3 md:gap-5"
            style={{ transitionDelay: '720ms' }}
          >
            <span
              aria-hidden
              className="hidden sm:block h-[1px] w-10 md:w-16 bg-gradient-to-r from-transparent to-white/25"
            />
            <div className="flex items-center gap-2.5 md:gap-4">
              {copy.asideLines.map((line, i) => (
                <React.Fragment key={line}>
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="font-mono font-light text-base md:text-xl translate-y-[-1px]"
                      style={{
                        color: 'rgba(239, 68, 68, 0.8)',
                        textShadow: '0 0 12px rgba(239, 68, 68, 0.45)',
                      }}
                    >
                      /
                    </span>
                  )}
                  <span
                    className={`font-mono text-[10px] md:text-[12px] text-white/80 ${
                      isRu
                        ? 'tracking-[0.18em] md:tracking-[0.22em]'
                        : 'uppercase tracking-[0.25em] md:tracking-[0.32em]'
                    }`}
                  >
                    {line}
                  </span>
                </React.Fragment>
              ))}
            </div>
            <span
              aria-hidden
              className="hidden sm:block h-[1px] w-10 md:w-16 bg-gradient-to-l from-transparent to-white/25"
            />
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

      {/* Pillars stage — liquid-glass grid (reference photo style).
          justify-start (not center) so the header always sits below the
          watermark in document order; the large pt on the section gives
          the watermark its own breathing room above the header. */}
      <section
        ref={pillarsRef}
        className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-start px-4 md:px-12 lg:px-20 pt-32 md:pt-48 pb-20 md:pb-28 overflow-hidden"
      >
        {/* Watermark behind the grid — centered via inset-x + text-align.
            We deliberately AVOID translate-x-1/2 because reveal-rise
            applies its own `transform: translateY(...)`, and a second
            transform on the same element would wipe out the horizontal
            offset, drifting the text to the right on enter. Sized down
            on desktop to keep clear of the section header below. */}
        <h2
          aria-hidden
          className="reveal-rise absolute top-6 md:top-12 inset-x-0 select-none pointer-events-none text-center whitespace-nowrap font-black uppercase tracking-tighter text-white text-4xl md:text-8xl opacity-[0.06]"
        >
          {isRu ? 'Преимущества' : 'Advantages'}
        </h2>

        {/* Section header */}
        <div className="reveal-rise relative z-10 flex flex-col items-center mb-10 md:mb-14">
          <p
            className={`font-mono text-[10px] md:text-[12px] mb-3 text-white/85 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] ${
              isRu ? 'tracking-[0.5em]' : 'uppercase tracking-[0.6em]'
            }`}
          >
            {copy.sectionTitle}
          </p>
          <div className="h-[1px] w-24 md:w-44 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
        </div>

        {/* Grid — 1 wide hero card on top spanning full row, then a 2×2
            of the four pillar cards below. The hero card carries the
            program's headline pitch; the four smaller tiles are the
            individual advantages. */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:gap-5 w-full max-w-2xl">
          {/* Hero — col-span-2 on sm+ */}
          <div className="sm:col-span-2">
            <GlassCard
              step="00"
              title={isRu ? '1 ‑ на ‑ 1 с реальным трейдером' : '1 ‑ on ‑ 1 with a real trader'}
              accent={HERO_ACCENT}
              Icon={Sparkles}
              isRu={isRu}
              revealDelayMs={0}
              isHero
              tagLabel={isRu ? 'ГЛАВНОЕ' : 'FEATURED'}
              bgImage={`${BASE}images/card-hero-sparkle.png`}
            />
          </div>

          {/* 4 pillar tiles — each with a themed chrome ornament */}
          {features.map((feat, idx) => {
            const accent = PILLAR_ACCENTS[idx % PILLAR_ACCENTS.length];
            const data = copy.features[idx] || { title: '', desc: '' };
            return (
              <GlassCard
                key={feat.step}
                step={feat.step}
                title={data.title}
                accent={accent}
                Icon={feat.CustomIcon}
                isRu={isRu}
                revealDelayMs={(idx + 1) * 110}
                bgImage={PILLAR_IMAGES[idx]}
              />
            );
          })}
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

      {/* CTA — sized to content (no forced 100dvh) so it sits naturally
          right after the results section. The inner card is centred via
          its own mx-auto, not via a flex parent. */}
      <section className="relative z-10 px-4 md:px-12 lg:px-20 pt-8 md:pt-12 pb-20 md:pb-28">
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

/* ────────────────────────────────────────────────────────────────────────
   GlassCard — liquid-glass tile patterned after the reference photo:
     • Translucent colored fill + backdrop-blur produce the frosted look
     • Top row: small icon tile (left), three tiny dots (center), info "i"
       (right)
     • Background ornament: same icon, oversized and faded on the right
       edge, acts as a colored halo motif
     • Bottom row: bold title, "▶ STEP NN" tag (replaces "PLAY"), arrow
   ────────────────────────────────────────────────────────────────────────*/

interface GlassCardProps {
  step: string;
  title: string;
  accent: Accent;
  Icon: React.ComponentType<{ className?: string }>;
  isRu: boolean;
  revealDelayMs?: number;
  /** Hero variant — wider grid cell, larger title and ornament. */
  isHero?: boolean;
  /** Override the bottom tag (default "STEP {step}" / "ШАГ {step}"). */
  tagLabel?: string;
  /**
   * Optional decorative image (chrome/glass artwork on black background).
   * When provided, REPLACES the SVG icon ornament on the right side.
   * Composited via mix-blend-mode: screen, so the source must have a pure
   * black backdrop — the black drops out and only the bright glass edges
   * remain, floating over the accent-tinted card.
   */
  bgImage?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  step,
  title,
  accent,
  Icon,
  isRu,
  revealDelayMs = 0,
  isHero = false,
  tagLabel,
  bgImage,
}) => (
  <div
    className={`reveal-rise dim-card group relative overflow-hidden rounded-[22px] border p-4 md:p-6 flex flex-col justify-between ${
      isHero ? 'min-h-[180px] md:min-h-[215px]' : 'min-h-[170px] md:min-h-[205px]'
    }`}
    style={{
      transitionDelay: `${revealDelayMs}ms`,
      borderColor: 'rgba(255,255,255,0.18)',
      background: `linear-gradient(135deg, ${accent.tint} 0%, rgba(255,255,255,0.04) 70%)`,
      backdropFilter: 'blur(28px) saturate(160%)',
      WebkitBackdropFilter: 'blur(28px) saturate(160%)',
      boxShadow: [
        'inset 0 1px 0 0 rgba(255,255,255,0.45)',
        'inset 0 -1px 0 0 rgba(0,0,0,0.32)',
        '0 24px 60px rgba(0,0,0,0.5)',
        `0 0 60px ${accent.glow}`,
      ].join(', '),
    }}
  >
    {/* Specular diagonal sheen */}
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 24%, transparent 50%)',
        mixBlendMode: 'overlay',
      }}
    />

    {/* Background ornament — either a custom chrome PNG (transparent
        background) or the SVG icon fallback. Slight blur softens the
        edges so the ornament feels integrated with the glass surface
        rather than sticker-pasted. */}
    {bgImage ? (
      <img
        src={bgImage}
        alt=""
        aria-hidden
        className={`pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 h-[110%] w-auto object-contain object-right ${
          isHero ? 'max-w-[42%]' : 'max-w-[55%]'
        }`}
        style={{
          filter: 'blur(2.5px)',
          opacity: 0.9,
        }}
      />
    ) : (
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2"
        style={{ color: accent.hex, opacity: 0.28, filter: 'blur(1.5px)' }}
      >
        <Icon className={isHero ? 'w-44 h-44 md:w-60 md:h-60' : 'w-36 h-36 md:w-48 md:h-48'} />
      </span>
    )}

    {/* Top row: status pill · dots · info button.
        The status pill REPLACES the old colored icon tile — it's a
        glass-styled accent-colored chip with a pulsing dot inside.
        Hero shows "PRO", the four pillars show their step number. */}
    <div className="relative flex items-start justify-between gap-3">
      {/* Status pill */}
      <div
        className="relative inline-flex items-center gap-2 rounded-full px-2.5 md:px-3 py-1 md:py-1.5 shrink-0"
        style={{
          background: `linear-gradient(135deg, ${accent.tint} 0%, rgba(255,255,255,0.04) 100%)`,
          border: `1px solid ${accent.border}`,
          boxShadow: [
            'inset 0 1px 0 0 rgba(255,255,255,0.3)',
            `0 0 16px ${accent.glow}`,
          ].join(', '),
        }}
      >
        {/* Pulse dot — animated halo + solid core, accent color */}
        <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2" aria-hidden>
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-80 animate-ping"
            style={{ background: accent.hex }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 md:h-2 md:w-2 rounded-full"
            style={{ background: accent.hex, boxShadow: `0 0 8px ${accent.hex}` }}
          />
        </span>
        {/* Label */}
        <span
          className="font-mono text-[9px] md:text-[10px] tracking-[0.22em] uppercase font-semibold leading-none"
          style={{ color: accent.hex, textShadow: `0 0 10px ${accent.glow}` }}
        >
          {isHero ? 'PRO' : step}
        </span>
      </div>

      {/* Decorative dots — three small dots in a row near the top center */}
      <div className="flex items-center gap-1 mt-3" aria-hidden>
        <span className="h-[3px] w-[3px] rounded-full bg-white/40" />
        <span className="h-[3px] w-[3px] rounded-full bg-white/40" />
        <span className="h-[3px] w-[3px] rounded-full bg-white/40" />
      </div>

      {/* Info pill */}
      <span
        aria-hidden
        className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full border border-white/25 bg-white/[0.06] text-white/70 shrink-0"
      >
        <span className="font-serif italic text-[11px] md:text-[12px] leading-none translate-y-[-0.5px]">i</span>
      </span>
    </div>

    {/* Bottom: title · STEP tag · arrow */}
    <div className="relative">
      <h3
        className={`font-black text-white tracking-tight leading-tight mb-2.5 ${
          isHero ? 'text-xl md:text-[1.75rem]' : 'text-lg md:text-xl'
        }`}
        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.45)' }}
      >
        {title}
      </h3>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-bold text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-white">
          <svg width="9" height="9" viewBox="0 0 8 8" fill="currentColor" aria-hidden>
            <path d="M1 0v8l7-4z" />
          </svg>
          {tagLabel ?? `${isRu ? 'ШАГ' : 'STEP'} ${step}`}
        </span>
        <span
          aria-hidden
          className="inline-flex items-center justify-center text-[11px] md:text-[12px] text-white/55 group-hover:text-white/85 transition-colors"
        >
          →
        </span>
      </div>
    </div>
  </div>
);

// Legacy ModuleCard kept for reference / future use; not rendered.
// Wrapped in a no-op IIFE assignment so TS doesn't warn about the function
// being unused at consumer level.
interface ModuleCardProps {
  step: string;
  total: number;
  title: string;
  desc: string;
  accent: Accent;
}
const ModuleCard: React.FC<ModuleCardProps> = ({ step, total, title, desc, accent }) => {
  const totalStr = String(total).padStart(2, '0');
  return (
    <div
      className="group relative h-full rounded-xl md:rounded-2xl overflow-hidden border bg-black/70 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition-colors duration-500 hover:bg-black/80"
      style={{ borderColor: accent.border }}
    >
      {/* Vertical accent stripe down the left edge */}
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: `linear-gradient(180deg, ${accent.soft} 0%, transparent 85%)` }}
        aria-hidden
      />
      {/* Soft accent glow top-right corner */}
      <span
        className="absolute -top-20 -right-12 h-40 w-40 rounded-full blur-3xl pointer-events-none opacity-60"
        style={{ background: accent.glow }}
        aria-hidden
      />

      {/* Watermark step number — large italic faded numeral filling the
          bottom-right corner. Replaces the "// 02" marker with a more
          editorial, architectural identifier. */}
      <span
        className="absolute -right-2 -bottom-6 md:-right-4 md:-bottom-10 font-black italic select-none pointer-events-none leading-none tracking-tighter"
        style={{
          fontSize: 'clamp(7rem, 16vw, 12rem)',
          color: 'rgba(255,255,255,0.045)',
          fontFamily: 'Outfit, sans-serif',
        }}
        aria-hidden
      >
        {step}
      </span>

      <div className="relative h-full p-5 md:p-7 flex flex-col">
        {/* TOP — thin line + step label */}
        <div className="flex items-center gap-3">
          <span className="h-[1px] w-6 md:w-10" style={{ background: accent.soft }} aria-hidden />
          <span
            className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.36em]"
            style={{ color: accent.hex, opacity: 0.85 }}
          >
            Step {step}
          </span>
        </div>

        {/* MIDDLE — title + bar + description, distributed in the centre */}
        <div className="flex-1 flex flex-col justify-center my-5 md:my-7">
          <h3 className="text-lg md:text-2xl font-bold text-white tracking-tight leading-[1.15] mb-3 md:mb-4">
            {title}
          </h3>
          <span
            className="block h-[2px] w-12 md:w-14 mb-3 md:mb-4 rounded-full"
            style={{ background: accent.hex }}
            aria-hidden
          />
          <p className="text-[13px] md:text-[15px] leading-relaxed text-white/65">
            {desc}
          </p>
        </div>

        {/* BOTTOM — divider + progress counter + arrow */}
        <div
          className="flex items-center justify-between gap-3 pt-3 md:pt-4 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-white/35">
            {step} <span className="text-white/15">/</span> {totalStr}
          </span>
          <span
            className="font-mono text-base md:text-lg leading-none transition-transform duration-500 group-hover:translate-x-1"
            style={{ color: accent.hex, opacity: 0.7 }}
            aria-hidden
          >
            →
          </span>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard: React.FC = () => (
  <div className="absolute inset-0 rounded-xl md:rounded-2xl border border-white/[0.07] bg-white/[0.012] overflow-hidden" aria-hidden>
    {/* Faint vertical stripe matching the real card's accent placement */}
    <span className="absolute inset-y-4 left-0 w-[2px] bg-white/[0.05]" />

    {/* Architectural corner markers */}
    <span className="absolute top-2 left-2 h-2 w-2 border-t border-l border-white/10" />
    <span className="absolute top-2 right-2 h-2 w-2 border-t border-r border-white/10" />
    <span className="absolute bottom-2 left-2 h-2 w-2 border-b border-l border-white/10" />
    <span className="absolute bottom-2 right-2 h-2 w-2 border-b border-r border-white/10" />

    {/* Placeholder content — mirrors the new layout (top label, centred
        title+bar+desc, bottom divider + footer) */}
    <div className="absolute inset-0 p-5 md:p-7 flex flex-col">
      {/* top label placeholder */}
      <div className="flex items-center gap-3">
        <span className="h-[1px] w-6 md:w-10 bg-white/[0.06]" />
        <span className="h-1.5 w-16 rounded-full bg-white/[0.06]" />
      </div>

      {/* middle — title + bar + 3-line desc placeholders */}
      <div className="flex-1 flex flex-col justify-center my-5 md:my-7">
        <span className="block h-4 md:h-5 w-3/4 rounded-full bg-white/[0.07] mb-3 md:mb-4" />
        <span className="block h-[2px] w-12 md:w-14 bg-white/[0.07] rounded-full mb-3 md:mb-4" />
        <span className="block h-2 w-full rounded-full bg-white/[0.04] mb-1.5" />
        <span className="block h-2 w-11/12 rounded-full bg-white/[0.04] mb-1.5" />
        <span className="block h-2 w-3/4 rounded-full bg-white/[0.04]" />
      </div>

      {/* bottom — divider + footer placeholders */}
      <div className="flex items-center justify-between gap-3 pt-3 md:pt-4 border-t border-white/[0.05]">
        <span className="h-1.5 w-12 rounded-full bg-white/[0.05]" />
        <span className="h-2 w-3 rounded-full bg-white/[0.05]" />
      </div>
    </div>
  </div>
);

export default MentorshipView;
