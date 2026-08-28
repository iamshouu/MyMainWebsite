import React, { useEffect, useRef } from 'react';

interface ScrollProgressProps {
  containerRef: React.RefObject<HTMLElement | null>;
  active: boolean;
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({ containerRef, active }) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const bar = barRef.current;
    if (!container || !bar || !active) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const range = container.scrollHeight - container.clientHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, container.scrollTop / range)) : 0;
      bar.style.transform = `scaleX(${progress})`;
      bar.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [active, containerRef]);

  return (
    <div
      ref={barRef}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[400] h-px origin-left bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.6)] md:bottom-0"
      style={{ transform: 'scaleX(0)' }}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    />
  );
};

export default ScrollProgress;
