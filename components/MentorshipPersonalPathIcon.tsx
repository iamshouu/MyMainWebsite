import React from 'react';

/**
 * Персональный путь обучения — траектория с узлами и финишной меткой, не «тумблер-затычка».
 */
const MentorshipPersonalPathIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <path
      d="M7 29c0-6 4.5-8 9-11.5S24.5 11 29 7"
      stroke="currentColor"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.38}
    />
    <circle cx="9" cy="27.5" r="3.1" stroke="currentColor" strokeWidth="1.55" opacity={0.85} />
    <circle cx="19" cy="18" r="3.1" stroke="currentColor" strokeWidth="1.55" opacity={0.72} />
    <circle cx="29" cy="9" r="3.6" stroke="currentColor" strokeWidth="1.65" />
    <path
      d="M27.2 6.2l3.6 1.2-2.2 3"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.75}
    />
    <path
      d="M14 24l4-3.5"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      opacity={0.35}
    />
  </svg>
);

export default MentorshipPersonalPathIcon;
