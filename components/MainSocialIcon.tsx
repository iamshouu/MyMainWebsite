
import React from 'react';
import { SocialLinkItem } from '../types';

interface MainSocialIconProps {
  link: SocialLinkItem;
  index: number;
}

const MainSocialIcon: React.FC<MainSocialIconProps> = ({ link, index }) => {
  const Icon = link.icon;
  
  // Brand color map for subtle glowing effects
  const getBrandColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'telegram': return '#24A1DE';
      case 'instagram': return '#E1306C';
      case 'youtube': return '#FF0000';
      case 'tiktok': return '#00F2EA';
      case 'tradingview': return '#2962FF';
      case 'threads': return '#ffffff';
      default: return '#ffffff';
    }
  };

  const color = getBrandColor(link.name);
  const displayIndex = (index + 1).toString().padStart(2, '0');

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col items-center justify-center w-20 h-20 md:w-28 md:h-28 transition-all duration-500 animate-fade-in-up"
      style={{ animationDelay: `${800 + index * 120}ms`, animationFillMode: 'both' }}
      title={link.name}
    >
      {/* Corner Brackets - Architectural Aesthetic */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20 group-hover:border-white group-hover:w-4 group-hover:h-4 transition-all duration-500" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20 group-hover:border-white group-hover:w-4 group-hover:h-4 transition-all duration-500" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20 group-hover:border-white group-hover:w-4 group-hover:h-4 transition-all duration-500" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20 group-hover:border-white group-hover:w-4 group-hover:h-4 transition-all duration-500" />

      {/* Background Layer with subtle brand color */}
      <div 
        className="absolute inset-2 bg-white/[0.02] border border-white/[0.05] group-hover:bg-white/[0.05] group-hover:border-white/20 transition-all duration-500 overflow-hidden"
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700"
          style={{ background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)` }}
        />
      </div>

      {/* Technical Label (Top Right) - Increased size for readability */}
      <span className="absolute top-1 right-2 text-[9px] md:text-[12px] font-mono text-white/60 group-hover:text-white/90 transition-colors select-none">
        {displayIndex}
      </span>

      {/* Main Icon - Increased size */}
      <div className="relative z-10 flex flex-col items-center gap-1.5 md:gap-2">
        <Icon 
          size={26} 
          className="text-white/60 group-hover:text-white group-hover:scale-110 transition-all duration-500 md:w-[32px] md:h-[32px]" 
          style={{ filter: `drop-shadow(0 0 10px ${color}44)` }}
        />
        {/* Tiny brand tag - Increased size and font weight for readability */}
        <span className="text-[8px] md:text-[10px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 tracking-[0.2em] uppercase text-white truncate w-full text-center px-2">
          {link.name}
        </span>
      </div>

      {/* Floating data bits - only on hover */}
      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white/0 group-hover:bg-white/60 transition-all duration-500 rounded-full blur-[1px]" />
    </a>
  );
};

export default MainSocialIcon;
