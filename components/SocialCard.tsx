
import React from 'react';
import { SocialLinkItem } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface SocialCardProps {
  link: SocialLinkItem;
}

const SocialCard: React.FC<SocialCardProps> = ({ link }) => {
  const Icon = link.icon;

  // Define subtle brand color hints for each platform
  const getBrandColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'telegram': return 'rgba(36, 161, 222, 0.1)';
      case 'instagram': return 'rgba(225, 48, 108, 0.1)';
      case 'youtube': return 'rgba(255, 0, 0, 0.1)';
      case 'tiktok': return 'rgba(0, 242, 234, 0.1)';
      case 'tradingview': return 'rgba(41, 98, 255, 0.1)';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  };

  const brandColor = getBrandColor(link.name);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col md:flex-row items-start md:items-center justify-between p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-black/40 backdrop-blur-md border border-white/5 hover:border-white/20 transition-all duration-700 hover:bg-white/[0.02] overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0"
        style={{ background: `radial-gradient(circle at 0% 0%, ${brandColor} 0%, transparent 50%)` }}
      />
      
      {/* Aesthetic Scanline Animation */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 -translate-y-full group-hover:animate-scan z-10 pointer-events-none" />

      <div className="flex items-center gap-4 md:gap-6 relative z-20">
        {/* Original Icon Container with Skew and Glow */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 opacity-20" />
          <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
            {/* Hexagonal/Diamond shaped background */}
            <div className="absolute inset-0 bg-neutral-900 border border-neutral-800 rotate-45 rounded-xl group-hover:rotate-[135deg] group-hover:border-white/20 transition-all duration-700" />
            <Icon 
              size={24} 
              className="relative text-neutral-300 group-hover:text-white group-hover:scale-110 transition-all duration-500 md:w-[28px]" 
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-2xl font-black text-white/90 group-hover:text-white transition-colors tracking-tighter uppercase">
              {link.name}
            </span>
            <div className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-white group-hover:shadow-[0_0_8px_#fff] transition-all" />
          </div>
          {link.username && (
            <span className="text-[10px] md:text-[12px] text-neutral-400 font-mono tracking-[0.2em] mt-1 group-hover:text-neutral-200 transition-colors uppercase">
              ID: {link.username}
            </span>
          )}
        </div>
      </div>
      
      {/* Right side decoration */}
      <div className="hidden md:flex flex-col items-end gap-2 relative z-20 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
           <span className="text-[8px] font-mono tracking-widest text-white/60">OPEN_LINK</span>
           <ArrowUpRight 
            className="text-white transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500" 
            size={12} 
          />
        </div>
        <div className="h-[1px] w-8 bg-white/20 group-hover:w-12 transition-all duration-700" />
      </div>

      {/* Mobile only indicator */}
      <div className="md:hidden absolute top-4 right-4 opacity-30">
        <ArrowUpRight size={14} />
      </div>
    </a>
  );
};

export default SocialCard;
