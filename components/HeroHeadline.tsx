import React, { useCallback, useEffect, useRef, useState } from 'react';

const HEADLINE_CLASSES =
  "font-['Outfit'] text-3xl md:text-7xl tracking-tight flex items-baseline justify-center gap-x-2 md:gap-x-5 select-none !leading-[1.3] whitespace-nowrap px-3 pt-4 pb-6 md:px-14 md:pt-10 md:pb-14";

// Apple-style cycling greetings — comma included so layout stays consistent
const GREETINGS = [
  'hello,',
  'привет,',
  'aloha,',
  'bonjour,',
  'こんにちは,',
  'hola,',
] as const;

// Cycle phases:
//   drawing  → gradient sweep across the word (1.8s)
//   visible  → fully drawn, hold (1.1s)
//   exiting  → opacity fade-out (0.6s)
//   then     → next greeting mounts and starts drawing
const DRAW_MS = 1800;
const HOLD_MS = 1100;
const FADE_MS = 600;

type Phase = 'drawing' | 'visible' | 'exiting';

const HeadlineContent: React.FC<{ greetingIdx: number; phase: Phase }> = ({ greetingIdx, phase }) => (
  <>
    <span
      key={greetingIdx}
      className={`font-normal text-white/55 inline-block apple-draw-text${phase === 'exiting' ? ' apple-fade-out' : ''}`}
    >
      {GREETINGS[greetingIdx]}
    </span>
    <span className="font-medium text-white/85">I&apos;m</span>
    <span className="font-bold text-white relative inline-block">
      Shou
      <span className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-[2px] bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </span>
    <span className="font-bold text-white">.</span>
  </>
);

const HeroHeadline: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sharpRef = useRef<HTMLHeadingElement>(null);
  const distortRef = useRef<HTMLHeadingElement>(null);
  const rafRef = useRef<number | null>(null);
  const [greetingIdx, setGreetingIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('drawing');

  const advance = useCallback(() => {
    // Atomic update — both setState calls batch into the same render so
    // the new greeting mounts already in 'drawing' phase (no flicker through
    // the lingering 'exiting' class from the previous cycle).
    setGreetingIdx((i) => (i + 1) % GREETINGS.length);
    setPhase('drawing');
  }, []);

  useEffect(() => {
    const tVisible = window.setTimeout(() => setPhase('visible'), DRAW_MS);
    const tExiting = window.setTimeout(() => setPhase('exiting'), DRAW_MS + HOLD_MS);
    const tAdvance = window.setTimeout(advance, DRAW_MS + HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(tVisible);
      clearTimeout(tExiting);
      clearTimeout(tAdvance);
    };
  }, [greetingIdx, advance]);

  const updateMasks = (x: number, y: number) => {
    const sharp = sharpRef.current;
    const distort = distortRef.current;
    if (!sharp || !distort) return;
    const r = window.innerWidth >= 768 ? 130 : 85;
    const distortMask = `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.55) 70%, transparent 92%)`;
    const sharpMask = `radial-gradient(circle ${r}px at ${x}px ${y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,1) 92%)`;
    distort.style.maskImage = distortMask;
    distort.style.webkitMaskImage = distortMask;
    distort.style.opacity = '1';
    sharp.style.maskImage = sharpMask;
    sharp.style.webkitMaskImage = sharpMask;
  };

  const resetMasks = () => {
    const sharp = sharpRef.current;
    const distort = distortRef.current;
    if (!sharp || !distort) return;
    sharp.style.maskImage = '';
    sharp.style.webkitMaskImage = '';
    distort.style.opacity = '0';
  };

  const handleMove = (e: React.MouseEvent) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => updateMasks(x, y));
  };

  const handleLeave = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    resetMasks();
  };

  return (
    <>
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: 'absolute', pointerEvents: 'none', width: 0, height: 0 }}
      >
        <defs>
          <filter id="hero-distortion" x="-20%" y="-30%" width="140%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.034"
              numOctaves="2"
              seed="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="14s"
                values="0.018 0.034; 0.030 0.022; 0.018 0.034"
                repeatCount="indefinite"
              />
              <animate
                attributeName="seed"
                dur="9s"
                values="3;180;3"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="46"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div
        ref={wrapperRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative inline-block"
      >
        <h1 ref={sharpRef} className={HEADLINE_CLASSES}>
          <HeadlineContent greetingIdx={greetingIdx} phase={phase} />
        </h1>
        <h1
          ref={distortRef}
          aria-hidden="true"
          className={`${HEADLINE_CLASSES} absolute inset-0 pointer-events-none`}
          style={{
            filter: 'url(#hero-distortion)',
            opacity: 0,
            transition: 'opacity 220ms ease-out',
            willChange: 'opacity, mask-image',
          }}
        >
          <HeadlineContent greetingIdx={greetingIdx} phase={phase} />
        </h1>
      </div>
    </>
  );
};

export default HeroHeadline;
