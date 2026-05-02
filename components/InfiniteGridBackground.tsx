import React, { useEffect, useRef } from 'react';

/**
 * Animated infinite-grid background.
 *
 *   • A faint grid pattern slowly drifts diagonally (forever).
 *   • A second, brighter grid layer is revealed only inside a soft radial spotlight
 *     that follows the cursor — making the lattice feel "alive" near the mouse.
 *   • Three colored blur orbs float in the corners for depth — palette swappable
 *     via the `accent` prop so each section can carry its own colour identity.
 *
 * Implemented with refs + requestAnimationFrame so it doesn't pull in framer-motion.
 */

export type InfiniteGridAccent = 'default' | 'red' | 'cyan' | 'yellow';

// Each entry is [orb1, orb2, orb3] — the three blur orbs in the corners.
const ACCENT_PALETTES: Record<InfiniteGridAccent, [string, string, string]> = {
  // original — orange / violet / blue (kept for back-compat)
  default: [
    'rgba(249, 115, 22, 0.30)',
    'rgba(139, 92, 246, 0.25)',
    'rgba(59, 130, 246, 0.30)',
  ],
  // mentorship — crimson / rose / deep red
  red: [
    'rgba(239, 68, 68, 0.32)',
    'rgba(244, 114, 182, 0.22)',
    'rgba(220, 38, 38, 0.28)',
  ],
  // performance — cyan / sky / teal
  cyan: [
    'rgba(6, 182, 212, 0.32)',
    'rgba(34, 211, 238, 0.22)',
    'rgba(56, 189, 248, 0.28)',
  ],
  // archive — gold / amber / warm yellow
  yellow: [
    'rgba(234, 179, 8, 0.32)',
    'rgba(251, 191, 36, 0.22)',
    'rgba(245, 158, 11, 0.28)',
  ],
};

interface InfiniteGridBackgroundProps {
  className?: string;
  accent?: InfiniteGridAccent;
}

const InfiniteGridBackground: React.FC<InfiniteGridBackgroundProps> = ({
  className,
  accent = 'default',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimPatternRef = useRef<SVGPatternElement>(null);
  const brightPatternRef = useRef<SVGPatternElement>(null);
  const maskLayerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const SPEED = 0.5;     // px per frame
    const TILE = 40;       // grid cell size
    const SPOT = 320;      // radius of the cursor spotlight in px

    let raf = 0;
    const tick = () => {
      // drift the pattern; modulo TILE makes it wrap seamlessly
      offsetRef.current.x = (offsetRef.current.x + SPEED) % TILE;
      offsetRef.current.y = (offsetRef.current.y + SPEED) % TILE;
      const xs = offsetRef.current.x.toFixed(2);
      const ys = offsetRef.current.y.toFixed(2);
      dimPatternRef.current?.setAttribute('x', xs);
      dimPatternRef.current?.setAttribute('y', ys);
      brightPatternRef.current?.setAttribute('x', xs);
      brightPatternRef.current?.setAttribute('y', ys);

      const layer = maskLayerRef.current;
      if (layer) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const mask = `radial-gradient(${SPOT}px circle at ${mx.toFixed(0)}px ${my.toFixed(0)}px, black, transparent)`;
        layer.style.maskImage = mask;
        // @ts-expect-error -- vendor-prefixed property not in typings
        layer.style.webkitMaskImage = mask;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      const c = containerRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    // listen on window so the mask still tracks even when pointer-events-none
    // is applied by the parent layer
    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}
      aria-hidden
    >
      {/* Dim grid layer (always visible faintly) */}
      <div className="absolute inset-0 text-white opacity-[0.07]">
        <svg className="w-full h-full">
          <defs>
            <pattern
              ref={dimPatternRef}
              id="ig-grid-dim"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              x="0"
              y="0"
            >
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ig-grid-dim)" />
        </svg>
      </div>

      {/* Bright grid layer revealed by the cursor spotlight */}
      <div
        ref={maskLayerRef}
        className="absolute inset-0 text-white opacity-[0.42]"
        style={{
          maskImage: 'radial-gradient(320px circle at -9999px -9999px, black, transparent)',
          WebkitMaskImage: 'radial-gradient(320px circle at -9999px -9999px, black, transparent)',
        }}
      >
        <svg className="w-full h-full">
          <defs>
            <pattern
              ref={brightPatternRef}
              id="ig-grid-bright"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              x="0"
              y="0"
            >
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ig-grid-bright)" />
        </svg>
      </div>

      {/* Floating colored blur orbs — palette swaps per accent prop */}
      <div className="absolute inset-0">
        <div
          className="absolute -right-[20%] -top-[20%] h-[40%] w-[40%] rounded-full blur-[120px]"
          style={{ background: ACCENT_PALETTES[accent][0] }}
        />
        <div
          className="absolute right-[10%] -top-[10%] h-[20%] w-[20%] rounded-full blur-[100px]"
          style={{ background: ACCENT_PALETTES[accent][1] }}
        />
        <div
          className="absolute -left-[10%] -bottom-[20%] h-[40%] w-[40%] rounded-full blur-[120px]"
          style={{ background: ACCENT_PALETTES[accent][2] }}
        />
      </div>
    </div>
  );
};

export default InfiniteGridBackground;
