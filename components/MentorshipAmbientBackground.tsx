import React from 'react';

/**
 * Mentorship backdrop — intentionally visible: aurora sweep, drifting glows, soft grid.
 * (Previous version was correct structurally but too faint + vignette read as flat black.)
 */
const MentorshipAmbientBackground: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes mentorship-aurora-spin {
          from { transform: rotate(0deg) scale(1.2); }
          to { transform: rotate(360deg) scale(1.2); }
        }
        @keyframes mentorship-drift-a {
          0%, 100% { transform: translate(-8%, -12%) scale(1); }
          50% { transform: translate(10%, 14%) scale(1.15); }
        }
        @keyframes mentorship-drift-b {
          0%, 100% { transform: translate(5%, 8%) scale(1.08); }
          50% { transform: translate(-12%, -10%) scale(1.22); }
        }
        @keyframes mentorship-drift-c {
          0%, 100% { transform: translate(0%, 0%) scale(1); opacity: 0.5; }
          50% { transform: translate(-6%, 8%) scale(1.1); opacity: 0.85; }
        }
        @keyframes mentorship-grid {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 64px 64px, 64px 64px; }
        }
        @keyframes mentorship-scan {
          0% { transform: translateY(-120%); opacity: 0; }
          15% { opacity: 0.5; }
          85% { opacity: 0.45; }
          100% { transform: translateY(120vh); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mentorship-aurora,
          .mentorship-glow-a,
          .mentorship-glow-b,
          .mentorship-glow-c,
          .mentorship-grid-layer,
          .mentorship-scan-line {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, #06060a 0%, #030305 45%, #080a12 100%)',
        }}
      >
        {/* Slow rotating color wash — reads clearly on dark bg */}
        <div
          className="mentorship-aurora pointer-events-none absolute left-1/2 top-1/2 h-[max(120vh,120vw)] w-[max(120vh,120vw)] -translate-x-1/2 -translate-y-1/2 opacity-[0.55] blur-[100px]"
          style={{
            background:
              'conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.35) 0deg, rgba(14,165,233,0.25) 120deg, rgba(16,185,129,0.2) 240deg, rgba(99,102,241,0.35) 360deg)',
            animation: 'mentorship-aurora-spin 48s linear infinite',
          }}
        />

        {/* Bright drifting masses */}
        <div
          className="mentorship-glow-a absolute -left-[15%] -top-[20%] h-[min(95vw,780px)] w-[min(95vw,780px)] rounded-full blur-[90px]"
          style={{
            background:
              'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 38%, transparent 72%)',
            animation: 'mentorship-drift-a 26s ease-in-out infinite',
          }}
        />
        <div
          className="mentorship-glow-b absolute -right-[10%] bottom-[-25%] h-[min(90vw,700px)] w-[min(90vw,700px)] rounded-full blur-[100px]"
          style={{
            background:
              'radial-gradient(circle at 65% 55%, rgba(56,189,248,0.35) 0%, rgba(59,130,246,0.12) 42%, transparent 70%)',
            animation: 'mentorship-drift-b 32s ease-in-out infinite',
          }}
        />
        <div
          className="mentorship-glow-c absolute left-[25%] top-[35%] h-[min(75vw,520px)] w-[min(75vw,520px)] rounded-full blur-[70px]"
          style={{
            background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 68%)',
            animation: 'mentorship-drift-c 38s ease-in-out infinite alternate',
          }}
        />

        {/* Line grid — slightly stronger so it registers as structure, not noise */}
        <div
          className="mentorship-grid-layer absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            animation: 'mentorship-grid 56s linear infinite',
            maskImage: 'radial-gradient(ellipse 85% 80% at 50% 42%, black 25%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 50% 42%, black 25%, transparent 78%)',
          }}
        />

        {/* Horizontal light sweep */}
        <div
          className="mentorship-scan-line pointer-events-none absolute inset-x-[-10%] top-0 h-[min(35vh,280px)]"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.07), transparent)',
            animation: 'mentorship-scan 11s ease-in-out infinite',
          }}
        />

        {/* Light edge darkening only — not a black hole in the center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 85% at 50% 45%, transparent 0%, transparent 55%, rgba(0,0,0,0.45) 100%)',
          }}
        />
      </div>
    </>
  );
};

export default MentorshipAmbientBackground;
