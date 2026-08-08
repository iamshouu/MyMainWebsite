import React from 'react';
import { SocialLinkItem } from '../types';

interface MainSocialIconProps {
  link: SocialLinkItem;
  index: number;
}

type SocialTheme = {
  primary: string;
  secondary: string;
};

const SOCIAL_THEMES: Record<string, SocialTheme> = {
  tiktok: { primary: '#25F4EE', secondary: '#FE2C55' },
  telegram: { primary: '#2AABEE', secondary: '#70D6FF' },
  youtube: { primary: '#FF1744', secondary: '#FF6B6B' },
  threads: { primary: '#C4B5FD', secondary: '#8B5CF6' },
  instagram: { primary: '#FF7A18', secondary: '#E1306C' },
  tradingview: { primary: '#2962FF', secondary: '#00C2FF' },
};

const fallbackTheme: SocialTheme = {
  primary: '#E5E7EB',
  secondary: '#94A3B8',
};

const MainSocialIcon: React.FC<MainSocialIconProps> = ({ link, index }) => {
  const Icon = link.icon;
  const theme = SOCIAL_THEMES[link.name.toLowerCase()] ?? fallbackTheme;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${link.name}${link.username ? ` profile ${link.username}` : ''}`}
      className="group relative inline-flex h-12 w-12 shrink-0 items-center justify-center opacity-75 transition-[opacity,transform] duration-500 ease-out hover:-translate-y-1 hover:scale-110 hover:opacity-100 focus-visible:-translate-y-1 focus-visible:scale-110 focus-visible:opacity-100 focus-visible:outline-none animate-fade-in-up md:h-16 md:w-16"
      style={{ animationDelay: `${560 + index * 100}ms`, animationFillMode: 'both' }}
    >
      <span aria-hidden="true" className="relative block h-full w-full">
        <Icon
          className="h-full w-full transition-transform duration-500 ease-out group-hover:rotate-[-6deg] group-hover:scale-105 group-focus-visible:rotate-[-6deg] group-focus-visible:scale-105"
          style={{ color: theme.primary, filter: `drop-shadow(0 0 9px ${theme.primary}80)` }}
        />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-3 left-1/2 h-px w-0 -translate-x-1/2 transition-[width] duration-500 ease-out group-hover:w-[68%] group-focus-visible:w-[68%]"
        style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
      />
    </a>
  );
};

export default MainSocialIcon;
