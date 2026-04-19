import React from 'react';

/** Онлайн-встречи: экран звонка + точки участников — не график. */
const MentorshipConferenceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <rect
      x="6.5"
      y="10"
      width="27"
      height="17"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.55"
      opacity={0.92}
    />
    <path d="M6.5 16.5h27" stroke="currentColor" strokeWidth="0.85" opacity={0.22} />
    <circle cx="20" cy="15.5" r="3.25" stroke="currentColor" strokeWidth="1.35" opacity={0.88} />
    <path
      d="M12 29.5h16"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      opacity={0.4}
    />
    <circle cx="12.5" cy="33.5" r="1.65" fill="currentColor" opacity={0.42} />
    <circle cx="20" cy="33.5" r="1.65" fill="currentColor" opacity={0.55} />
    <circle cx="27.5" cy="33.5" r="1.65" fill="currentColor" opacity={0.42} />
    <path
      d="M17 7.5h6"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity={0.35}
    />
  </svg>
);

export default MentorshipConferenceIcon;
