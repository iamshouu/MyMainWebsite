import React from 'react';

const OverlayFallback: React.FC = () => (
  <div
    className="fixed inset-0 z-[200] grid place-items-center bg-black text-white"
    role="status"
    aria-live="polite"
  >
    <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/55">
      Loading view…
    </p>
  </div>
);

export default OverlayFallback;
