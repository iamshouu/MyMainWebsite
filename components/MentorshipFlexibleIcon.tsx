import React from 'react';

/** Гибкий формат: календарь + часы — расписание и тайминг, не просто камера. */
const MentorshipFlexibleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <rect
      x="7"
      y="11"
      width="17"
      height="15"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity={0.88}
    />
    <path d="M7 15.5h17" stroke="currentColor" strokeWidth="0.9" opacity={0.28} />
    <path
      d="M10.5 13v-2.5M20.5 13v-2.5"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      opacity={0.55}
    />
    <circle cx="27.5" cy="23" r="7.25" stroke="currentColor" strokeWidth="1.45" opacity={0.92} />
    <path
      d="M27.5 19v4l3 2"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.75}
    />
    <circle cx="27.5" cy="23" r="1.1" fill="currentColor" opacity={0.45} />
  </svg>
);

export default MentorshipFlexibleIcon;
