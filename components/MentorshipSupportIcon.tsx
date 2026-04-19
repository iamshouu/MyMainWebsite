import React from 'react';

/**
 * Сопровождение ментором — два силуэта и дуга связи (путь вместе), не график объёма.
 */
const MentorshipSupportIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <circle cx="12" cy="13" r="3.25" stroke="currentColor" strokeWidth="1.55" opacity={0.9} />
    <path d="M12 17v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={0.85} />
    <path d="M8.5 26h7" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" opacity={0.75} />
    <circle cx="28" cy="13" r="3.25" stroke="currentColor" strokeWidth="1.55" opacity={0.75} />
    <path d="M28 17v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={0.7} />
    <path d="M24.5 26h7" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" opacity={0.6} />
    <path
      d="M15.5 11.5Q20 6 24.5 11.5"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      opacity={0.45}
    />
    <circle cx="20" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.35" opacity={0.55} />
    <path
      d="M18.5 30.5c2 1.2 4.5 1.2 6.5 0"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity={0.35}
    />
  </svg>
);

export default MentorshipSupportIcon;
