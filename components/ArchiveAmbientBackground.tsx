import React from 'react';

/**
 * Archive backdrop — same motion as Mentorship/Performance, palette: violet / fuchsia / sky (vault / code).
 */
const ArchiveAmbientBackground: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes archive-aurora-spin {
          from { transform: rotate(0deg) scale(1.2); }
          to { transform: rotate(360deg) scale(1.2); }
        }
        @keyframes archive-drift-a {
          0%, 100% { transform: translate(-10%, -8%) scale(1); }
          50% { transform: translate(8%, 14%) scale(1.14); }
        }
        @keyframes archive-drift-b {
          0%, 100% { transform: translate(6%, 10%) scale(1.04); }
          50% { transform: translate(-10%, -12%) scale(1.18); }
        }
        @keyframes archive-drift-c {
          0%, 100% { transform: translate(0%, 0%) scale(1); opacity: 0.4; }
          50% { transform: translate(-8%, 6%) scale(1.1); opacity: 0.82; }
        }
        @keyframes archive-grid {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 64px 0, 64px 0; }
        }
        @keyframes archive-scan {
          0% { transform: translateY(-120%); opacity: 0; }
          15% { opacity: 0.42; }
          85% { opacity: 0.38; }
          100% { transform: translateY(120vh); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .archive-aurora,
          .archive-glow-a,
          .archive-glow-b,
          .archive-glow-c,
          .archive-grid-layer,
          .archive-scan-line {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        style={{
          background: 'linear-gradient(175deg, #06040c 0%, #040308 42%, #0a0614 100%)',
        }}
      >
        <div
          className="archive-aurora pointer-events-none absolute left-1/2 top-1/2 h-[max(120vh,120vw)] w-[max(120vh,120vw)] -translate-x-1/2 -translate-y-1/2 opacity-[0.52] blur-[100px]"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, rgba(139,92,246,0.34) 0deg, rgba(217,70,239,0.28) 100deg, rgba(56,189,248,0.26) 220deg, rgba(124,58,237,0.32) 360deg)',
            animation: 'archive-aurora-spin 50s linear infinite',
          }}
        />

        <div
          className="archive-glow-a absolute -left-[14%] -top-[22%] h-[min(95vw,760px)] w-[min(95vw,760px)] rounded-full blur-[92px]"
          style={{
            background:
              'radial-gradient(circle at 38% 36%, rgba(237,233,254,0.18) 0%, rgba(167,139,250,0.12) 42%, transparent 72%)',
            animation: 'archive-drift-a 25s ease-in-out infinite',
          }}
        />
        <div
          className="archive-glow-b absolute -right-[12%] bottom-[-20%] h-[min(88vw,680px)] w-[min(88vw,680px)] rounded-full blur-[98px]"
          style={{
            background:
              'radial-gradient(circle at 58% 52%, rgba(192,132,252,0.34) 0%, rgba(147,51,234,0.12) 44%, transparent 70%)',
            animation: 'archive-drift-b 31s ease-in-out infinite',
          }}
        />
        <div
          className="archive-glow-c absolute left-[32%] top-[36%] h-[min(70vw,480px)] w-[min(70vw,480px)] rounded-full blur-[74px]"
          style={{
            background:
              'radial-gradient(circle, rgba(34,211,238,0.2) 0%, rgba(8,145,178,0.08) 48%, transparent 68%)',
            animation: 'archive-drift-c 34s ease-in-out infinite alternate',
          }}
        />

        <div
          className="archive-grid-layer absolute inset-0 opacity-[0.19]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(167,139,250,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56,189,248,0.07) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            animation: 'archive-grid 58s linear infinite',
            maskImage: 'radial-gradient(ellipse 85% 80% at 50% 42%, black 25%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 50% 42%, black 25%, transparent 78%)',
          }}
        />

        <div
          className="archive-scan-line pointer-events-none absolute inset-x-[-10%] top-0 h-[min(35vh,280px)]"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(196,181,253,0.08), transparent)',
            animation: 'archive-scan 10.5s ease-in-out infinite',
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 85% at 50% 45%, transparent 0%, transparent 55%, rgba(0,0,0,0.46) 100%)',
          }}
        />
      </div>
    </>
  );
};

export default ArchiveAmbientBackground;
