import React, { useEffect, useState } from 'react';

const IDENTITY_FONT = `500 1em "Dancing Script"`;
const FONT_LOAD_FALLBACK_MS = 6000;
const HELLO_DRAW_MS = 3850;
const HELLO_FADE_MS = 550;

type IdentityFontState = 'loading' | 'ready' | 'fallback';

const HeroHeadline: React.FC = () => {
  const [helloIsLeaving, setHelloIsLeaving] = useState(false);
  const [helloComplete, setHelloComplete] = useState(false);
  const [identityFontState, setIdentityFontState] = useState<IdentityFontState>('loading');
  const showIdentity = helloComplete && identityFontState !== 'loading';

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let completionTimer = 0;
    let fadeTimer = 0;

    const complete = () => {
      setHelloIsLeaving(true);
      fadeTimer = window.setTimeout(() => setHelloComplete(true), reducedMotion ? 0 : HELLO_FADE_MS);
    };

    completionTimer = window.setTimeout(complete, reducedMotion ? 0 : HELLO_DRAW_MS);
    return () => {
      window.clearTimeout(completionTimer);
      window.clearTimeout(fadeTimer);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let settled = false;
    let revealFrame = 0;
    let fallbackTimer = 0;

    const settleFont = (state: Exclude<IdentityFontState, 'loading'>) => {
      if (cancelled || settled) return;
      settled = true;
      window.clearTimeout(fallbackTimer);
      revealFrame = window.requestAnimationFrame(() => {
        if (!cancelled) setIdentityFontState(state);
      });
    };

    fallbackTimer = window.setTimeout(() => settleFont('fallback'), FONT_LOAD_FALLBACK_MS);
    if ('fonts' in document) {
      document.fonts.load(IDENTITY_FONT).then(() => settleFont('ready')).catch(() => settleFont('fallback'));
    } else {
      settleFont('fallback');
    }

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      if (revealFrame) window.cancelAnimationFrame(revealFrame);
    };
  }, []);

  return (
    <h1
      aria-label={showIdentity ? "i'm shou" : 'hello'}
      className="font-['Outfit'] flex min-h-28 items-center justify-center px-4 py-6 text-white md:min-h-52 md:px-14 md:py-10"
    >
      {showIdentity ? (
        <span
          aria-hidden="true"
          className="animate-identity-in text-[clamp(3.7rem,10.5vw,7.8rem)] font-medium leading-none tracking-[-0.045em] text-white/95"
          style={{
            fontFamily:
              identityFontState === 'ready'
                ? "'Dancing Script', cursive"
                : "'Segoe Script', 'Brush Script MT', cursive",
          }}
        >
          i&apos;m shou
        </span>
      ) : (
        <svg
          aria-hidden="true"
          className={`block h-auto w-[min(76vw,28rem)] text-white/85 drop-shadow-[0_0_26px_rgba(255,255,255,0.16)] transition-opacity duration-500 ${helloIsLeaving ? 'opacity-0' : 'opacity-100'}`}
          viewBox="0 0 638 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="14.8883"
        >
          <path
            className="hello-draw-path hello-draw-path-first"
            pathLength="1"
            d="M8.69214 166.553C36.2393 151.239 61.3409 131.548 89.8191 98.0295C109.203 75.1488 119.625 49.0228 120.122 31.0026C120.37 17.6036 113.836 7.43883 101.759 7.43883C88.3598 7.43883 79.9231 17.6036 74.7122 40.9363C69.005 66.5793 64.7866 96.0036 54.1166 190.356"
            strokeLinecap="round"
          />
          <path
            className="hello-draw-path hello-draw-path-second"
            pathLength="1"
            d="M55.1624 181.135C60.6251 133.114 81.4118 98.0479 107.963 98.0479C123.844 98.0479 133.937 110.703 131.071 128.817C129.457 139.487 127.587 150.405 125.408 163.06C122.869 178.941 130.128 191.348 152.122 191.348C184.197 191.348 219.189 173.523 237.097 145.915C243.198 136.509 245.68 128.073 245.928 119.884C246.176 104.996 237.739 93.8296 222.851 93.8296C203.992 93.8296 189.6 115.17 189.6 142.465C189.6 171.745 205.481 192.341 239.208 192.341C285.066 192.341 335.86 137.292 359.199 75.8585C365.788 58.513 368.26 42.4065 368.26 31.1512C368.26 17.8057 364.042 7.55823 352.131 7.55823C340.469 7.55823 332.777 16.6141 325.829 30.9129C317.688 47.4967 311.667 71.4162 309.203 98.4549C303 166.301 316.896 191.348 349.936 191.348C390 191.348 434.542 135.534 457.286 75.6686C463.803 58.513 466.275 42.4065 466.275 31.1512C466.275 17.8057 462.057 7.55823 450.146 7.55823C438.484 7.55823 430.792 16.6141 423.844 30.9129C415.703 47.4967 411.667 71.4162 407.218 98.4549C401.015 166.301 414.911 191.348 444.416 191.348C473.874 191.348 489.877 165.67 499.471 138.402C508.955 111.447 520.618 94.8221 544.935 94.8221C565.035 94.8221 580.916 109.71 580.916 137.75C580.916 168.768 560.792 192.093 535.362 192.341C512.984 192.589 498.285 174.475 499.774 147.179C501.511 116.907 519.873 94.8221 543.943 94.8221C557.839 94.8221 569.51 100.999 578.682 107.725C603.549 125.866 622.709 114.656 630.047 96.7186"
            strokeLinecap="round"
          />
        </svg>
      )}
    </h1>
  );
};

export default HeroHeadline;
