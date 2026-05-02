import React from 'react';

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
  ariaLabel?: string;
}

/**
 * Gooey-morphing text. The visible composition is two stacked layers that
 * crossfade via CSS opacity transition:
 *
 *   • CRISP layer — no filter, native antialiasing. Visible during cooldown.
 *   • GOOEY layer — same content + SVG threshold filter. Visible during the
 *     morph; the threshold binarises alpha so two heavily-blurred shapes
 *     merge into a single liquid blob.
 *
 * Each layer has its own pair of spans; the animation loop writes identical
 * text/style updates to both pairs, so visually they stay in sync. The
 * layer-level opacity transitions smoothly between cooldown and morph,
 * eliminating the abrupt filter-switch flicker of a single-layer toggle.
 */
export function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 1.5,
  className = '',
  textClassName = '',
  ariaLabel,
}: GooeyTextProps) {
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);
  const text1CloneRef = React.useRef<HTMLSpanElement>(null);
  const text2CloneRef = React.useRef<HTMLSpanElement>(null);
  const crispLayerRef = React.useRef<HTMLDivElement>(null);
  const gooeyLayerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;
    let raf = 0;

    const text1Pair = [text1Ref, text1CloneRef] as const;
    const text2Pair = [text2Ref, text2CloneRef] as const;

    const writeStyle = (
      pair: typeof text1Pair,
      key: 'filter' | 'opacity',
      value: string,
    ) => {
      pair.forEach((r) => {
        if (r.current) r.current.style[key] = value;
      });
    };
    const writeText = (pair: typeof text1Pair, value: string) => {
      pair.forEach((r) => {
        if (r.current) r.current.textContent = value;
      });
    };

    // Pre-fill so the user sees texts[0] during the initial cooldown
    writeText(text1Pair, texts[texts.length - 1] ?? '');
    writeText(text2Pair, texts[0] ?? '');
    writeStyle(text1Pair, 'opacity', '0%');
    writeStyle(text2Pair, 'opacity', '100%');
    writeStyle(text1Pair, 'filter', '');
    writeStyle(text2Pair, 'filter', '');

    const setMorph = (fraction: number) => {
      const blur2 = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      const op2 = `${Math.pow(fraction, 0.4) * 100}%`;
      const inv = 1 - fraction;
      const blur1 = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      const op1 = `${Math.pow(inv, 0.4) * 100}%`;

      writeStyle(text1Pair, 'filter', blur1);
      writeStyle(text1Pair, 'opacity', op1);
      writeStyle(text2Pair, 'filter', blur2);
      writeStyle(text2Pair, 'opacity', op2);

      // Crossfade layers: gooey in, crisp out — both via CSS transitions
      if (gooeyLayerRef.current) gooeyLayerRef.current.style.opacity = '1';
      if (crispLayerRef.current) crispLayerRef.current.style.opacity = '0';
    };

    const doCooldown = () => {
      morph = 0;
      writeStyle(text1Pair, 'filter', '');
      writeStyle(text1Pair, 'opacity', '0%');
      writeStyle(text2Pair, 'filter', '');
      writeStyle(text2Pair, 'opacity', '100%');
      // Crossfade back: crisp in, gooey out
      if (gooeyLayerRef.current) gooeyLayerRef.current.style.opacity = '0';
      if (crispLayerRef.current) crispLayerRef.current.style.opacity = '1';
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;
      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }
      setMorph(fraction);
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;
      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          const tNew = texts[textIndex % texts.length];
          const tNext = texts[(textIndex + 1) % texts.length];
          writeText(text1Pair, tNew);
          writeText(text2Pair, tNext);
        }
        doMorph();
      } else {
        doCooldown();
      }
    };

    animate();
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [texts, morphTime, cooldownTime]);

  const spanCls = `absolute inline-block select-none text-center ${textClassName}`;
  const textColor: React.CSSProperties = { color: '#c8ccd4' };
  const layerCls = 'absolute inset-0 flex items-center justify-center';
  const transitionStyle: React.CSSProperties = {
    transition: 'opacity 0.35s ease-out',
    willChange: 'opacity',
  };

  return (
    <div className={`relative ${className}`} aria-label={ariaLabel} role={ariaLabel ? 'heading' : undefined}>
      {/* Goo threshold filter */}
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="gooey-text-threshold" x="-12%" y="-12%" width="124%" height="124%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="presmooth" />
            <feColorMatrix
              in="presmooth"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -125"
              result="threshold"
            />
            <feGaussianBlur in="threshold" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>

      {/* CRISP layer — no filter, native antialiased rendering */}
      <div
        ref={crispLayerRef}
        className={layerCls}
        style={{
          ...transitionStyle,
          opacity: 1,
          textShadow:
            '0 0 28px rgba(199,166,255,0.10), 0 0 48px rgba(91,194,214,0.08)',
        }}
        aria-hidden
      >
        <span ref={text1Ref} className={spanCls} style={textColor} />
        <span ref={text2Ref} className={spanCls} style={textColor} />
      </div>

      {/* GOOEY overlay — same spans with SVG threshold; opacity-transitioned */}
      <div
        ref={gooeyLayerRef}
        className={`${layerCls} pointer-events-none`}
        style={{
          ...transitionStyle,
          filter: 'url(#gooey-text-threshold)',
          opacity: 0,
        }}
        aria-hidden
      >
        <span ref={text1CloneRef} className={spanCls} style={textColor} />
        <span ref={text2CloneRef} className={spanCls} style={textColor} />
      </div>
    </div>
  );
}

export default GooeyText;
