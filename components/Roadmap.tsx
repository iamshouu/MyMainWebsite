import React, { useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import type { RoadmapPlanCopy } from '../constants';

interface RoadmapProps {
  watermark: string;
  subtitle: string;
  soonBadge: string;
  plans: RoadmapPlanCopy[];
  icons: ReadonlyArray<React.ComponentType<{ size?: number; className?: string }>>;
}

const HIDDEN_TZ = -1500;     // depth in px when card is "far"
const HIDDEN_BLUR = 12;      // blur in px when far
const HIDDEN_ROT_X = -18;    // initial backward tilt for a tumble-into-place feel

const Roadmap: React.FC<RoadmapProps> = ({ watermark, subtitle, soonBadge, plans, icons }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLHeadingElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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

      const total = plans.length;
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        let cp: number;
        if (idx === 0) {
          // first card uses the intro phase (entry from previous section)
          cp = intro;
        } else if (total > 1) {
          const chunk = 1 / (total - 1);
          const start = (idx - 1) * chunk;
          const end = idx * chunk;
          cp = Math.max(0, Math.min(1, (stackProgress - start) / (end - start)));
        } else {
          cp = 1;
        }
        // Easing for a smoother arrival (cubic-out)
        const eased = 1 - Math.pow(1 - cp, 3);
        const z = HIDDEN_TZ * (1 - eased);
        const rotX = HIDDEN_ROT_X * (1 - eased);
        const blur = HIDDEN_BLUR * (1 - eased);
        const opacity = cp;
        card.style.transform = `translate3d(0,0,${z.toFixed(1)}px) rotateX(${rotX.toFixed(2)}deg)`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : 'none';
      });
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
    // shift content).
    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => update())
      : null;
    ro?.observe(section);
    return () => {
      main.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
  }, [plans.length]);

  return (
    <section ref={sectionRef} id="roadmap" className="relative w-full">
      {/* Spacers — provide vertical scroll height for the sticky depth animation */}
      {plans.map((_, idx) => (
        <div key={`spacer-${idx}`} aria-hidden="true" className="h-[100dvh]" />
      ))}

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="sticky top-0 left-0 w-full h-[100dvh] flex flex-col items-center justify-center pointer-events-auto px-4 md:px-12 lg:px-20 py-8 md:py-10 overflow-hidden"
          style={{ perspective: '1400px', perspectiveOrigin: 'center 45%' }}
        >
          {/* Watermark */}
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

          {/* Subtitle + decorative line */}
          <div
            ref={headerRef}
            className="relative z-10 flex flex-col items-center mb-6 md:mb-10"
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

          {/* Card grid — cards emerge from depth into their grid cells */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full max-w-6xl px-2 md:px-4 relative z-10"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {plans.map((plan, idx) => {
              const Icon = icons[idx];
              return (
                <div
                  key={idx}
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
                  <RoadmapCard plan={plan} Icon={Icon} idx={idx} soonBadge={soonBadge} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const RoadmapCard: React.FC<{
  plan: RoadmapPlanCopy;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  idx: number;
  soonBadge: string;
}> = ({ plan, Icon, idx, soonBadge }) => (
  <div
    className={`group relative p-6 md:p-8 bg-white/5 border rounded-xl md:rounded-[2.5rem] transition-all duration-500 overflow-hidden h-full ${
      plan.isHighlight
        ? 'border-white/40 bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]'
        : 'border-white/5 hover:bg-white/10 hover:border-white/20'
    }`}
  >
    <div className="absolute -right-2 -top-2 md:-right-4 md:-top-4 text-white/5 font-black text-6xl md:text-8xl italic group-hover:text-white/10 transition-colors select-none">
      {idx + 1}
    </div>
    <div className="relative z-10 flex flex-col h-full">
      <div
        className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500 ${
          plan.isHighlight ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-white/10 text-white'
        }`}
      >
        <Icon size={20} className="md:w-[28px] md:h-[28px]" />
      </div>
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <h3 className="text-base md:text-xl font-bold tracking-tight">{plan.title}</h3>
        {plan.isSoon && (
          <span className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-[7px] font-mono text-white/50 animate-pulse uppercase">
            {soonBadge}
          </span>
        )}
      </div>
      <p className="text-[12px] md:text-[14px] text-white/80 font-medium leading-relaxed mb-6 md:mb-8">
        {plan.desc}
      </p>
      <div className="flex items-center gap-2 text-[9px] md:text-[11px] font-mono text-white/60 uppercase tracking-widest mt-auto border-t border-white/5 pt-4">
        <Clock size={8} />
        {plan.status}
      </div>
    </div>
  </div>
);

export default Roadmap;
