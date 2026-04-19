import React from 'react';

/**
 * Performance backdrop — same structure as Mentorship, warm palette (amber / orange / rose).
 */
const PerformanceAmbientBackground: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes performance-aurora-spin {
          from { transform: rotate(0deg) scale(1.2); }
          to { transform: rotate(-360deg) scale(1.2); }
        }
        @keyframes performance-drift-a {
          0%, 100% { transform: translate(-6%, -10%) scale(1); }
          50% { transform: translate(12%, 12%) scale(1.12); }
        }
        @keyframes performance-drift-b {
          0%, 100% { transform: translate(8%, 4%) scale(1.06); }
          50% { transform: translate(-14%, -8%) scale(1.2); }
        }
        @keyframes performance-drift-c {
          0%, 100% { transform: translate(0%, 0%) scale(1); opacity: 0.45; }
          50% { transform: translate(8%, -6%) scale(1.08); opacity: 0.8; }
        }
        @keyframes performance-grid {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: -64px -64px, -64px -64px; }
        }
        @keyframes performance-scan {
          0% { transform: translateY(-120%); opacity: 0; }
          15% { opacity: 0.45; }
          85% { opacity: 0.4; }
          100% { transform: translateY(120vh); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .performance-aurora,
          .performance-glow-a,
          .performance-glow-b,
          .performance-glow-c,
          .performance-grid-layer,
          .performance-scan-line {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        style={{
          background: 'linear-gradient(195deg, #0a0705 0%, #060403 40%, #100a08 100%)',
        }}
      >
        <div
          className="performance-aurora pointer-events-none absolute left-1/2 top-1/2 h-[max(120vh,120vw)] w-[max(120vh,120vw)] -translate-x-1/2 -translate-y-1/2 opacity-[0.5] blur-[100px]"
          style={{
            background:
              'conic-gradient(from 90deg at 50% 50%, rgba(245,158,11,0.38) 0deg, rgba(249,115,22,0.28) 110deg, rgba(244,63,94,0.26) 230deg, rgba(217,119,6,0.32) 360deg)',
            animation: 'performance-aurora-spin 52s linear infinite',
          }}
        />

        <div
          className="performance-glow-a absolute -left-[12%] -top-[18%] h-[min(95vw,780px)] w-[min(95vw,780px)] rounded-full blur-[90px]"
          style={{
            background:
              'radial-gradient(circle at 40% 38%, rgba(255,237,213,0.2) 0%, rgba(251,191,36,0.1) 40%, transparent 72%)',
            animation: 'performance-drift-a 24s ease-in-out infinite',
          }}
        />
        <div
          className="performance-glow-b absolute -right-[8%] bottom-[-22%] h-[min(90vw,700px)] w-[min(90vw,700px)] rounded-full blur-[100px]"
          style={{
            background:
              'radial-gradient(circle at 60% 50%, rgba(251,146,60,0.36) 0%, rgba(234,88,12,0.14) 44%, transparent 70%)',
            animation: 'performance-drift-b 30s ease-in-out infinite',
          }}
        />
        <div
          className="performance-glow-c absolute left-[28%] top-[38%] h-[min(72vw,500px)] w-[min(72vw,500px)] rounded-full blur-[72px]"
          style={{
            background:
              'radial-gradient(circle, rgba(251,113,133,0.22) 0%, rgba(190,18,60,0.08) 45%, transparent 68%)',
            animation: 'performance-drift-c 36s ease-in-out infinite alternate',
          }}
        />

        <div
          className="performance-grid-layer absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(251,191,36,0.09) 1px, transparent 1px),
              linear-gradient(90deg, rgba(251,191,36,0.09) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            animation: 'performance-grid 60s linear infinite',
            maskImage: 'radial-gradient(ellipse 85% 80% at 50% 42%, black 25%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 50% 42%, black 25%, transparent 78%)',
          }}
        />

        <div
          className="performance-scan-line pointer-events-none absolute inset-x-[-10%] top-0 h-[min(35vh,280px)]"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(253,186,116,0.09), transparent)',
            animation: 'performance-scan 12s ease-in-out infinite',
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 85% at 50% 45%, transparent 0%, transparent 55%, rgba(0,0,0,0.48) 100%)',
          }}
        />
      </div>
    </>
  );
};

export default PerformanceAmbientBackground;
