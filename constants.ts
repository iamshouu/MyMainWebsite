
import { NavItem, SocialLinkItem, StatItem, SkillData, ProjectItem } from './types';
import { 
  Send, 
  Instagram, 
  Youtube, 
  Video,
  AtSign,
  TrendingUp
} from 'lucide-react';

// === MEDIA CONFIG ===
export const MEDIA_CONFIG = {
  videoUrl: 'https://r2.guns.lol/d902101e-5e60-48e9-bbda-e6f2467b0c50.mp4', 
  audioUrl: 'https://r2.guns.lol/bf484e2c-6f60-4660-aa26-1dd71be790fc.MP3', 
  motto: 'Professional trading',
  credo: 'Discipline, patience, risk management, self-control, distance',
  status: 'ARCHITECTURE & TRADING',
  views: '1,337'
};

export const SECTIONS: NavItem[] = [
  { id: 'personality', label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'connect', label: 'Contact' },
];

export const SOCIAL_LINKS: SocialLinkItem[] = [
  { name: 'TikTok', url: 'https://www.tiktok.com/@danyashou?_r=1&_t=ZS-93swsUWH5W8', icon: Video, username: '@danyashou' },
  { name: 'Telegram', url: 'https://t.me/Danya_Shouu', icon: Send, username: '@Danya_Shouu' },
  { name: 'YouTube', url: 'https://www.youtube.com/@iamshouu/videos', icon: Youtube, username: '@iamshouu' },
  { name: 'Threads', url: 'https://www.threads.com/@iamshouuuu?hl=ru', icon: AtSign, username: '@iamshouuuu' },
  { name: 'Instagram', url: 'https://www.instagram.com/iamshouuuu/', icon: Instagram, username: '@iamshouuuu' },
  { name: 'TradingView', url: 'https://ru.tradingview.com/u/shoouuuuu/', icon: TrendingUp, username: '@shoouuuuu' },
];

export const TRADING_STATS: StatItem[] = [
  { label: 'Experience', value: '2+ Years', description: 'Active market participation and system development' },
  { label: 'Markets', value: 'Crypto/Forex', description: 'Deep focus on high-liquidity assets' },
  { label: 'Strategy', value: 'Smart Money + PA', description: 'Technical analysis through institutional flow' },
];

export const SKILL_DATA: SkillData[] = [
  { subject: 'Price Action', A: 9, fullMark: 10 },
  { subject: 'Smart Money', A: 8, fullMark: 10 },
  { subject: 'Risk Management', A: 10, fullMark: 10 },
  { subject: 'Psychology', A: 10, fullMark: 10 },
  { subject: 'Execution', A: 9, fullMark: 10 },
  { subject: 'Backtesting', A: 9, fullMark: 10 },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'fx-calculator',
    title: 'FX Calculator',
    description: 'Professional position calculator for Crypto, FX, Indices, and Metals. Helps calculate position size for a trade while maintaining strict risk management.',
    tags: ['Forex', 'Risk Management', 'Calculator', 'Tools'],
    link: 'https://www.fx-calculator.pw/',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-169641357599?q=80&w=2070&auto=format&fit=crop',
    category: 'Trading Tool'
  },
  {
    id: 'spectra-journal',
    title: 'Spectra Journal',
    description: 'Professional trading journal for deal analysis. Helps turn chaotic charts into clear statistics.',
    tags: ['Trading Journal', 'Analytics', 'Performance', 'Beta'],
    link: 'https://trade-journal-lime-ten.vercel.app/',
    imageUrl: 'https://i.postimg.cc/3N2jzf32/E8C34B19-BEE9-4BC5-BAE5-B4ED20680D84.png',
    category: 'Trading Tool'
  }
];

export const PERFORMANCE_DATA = [
  { date: '01 Jan', value: 0 },
  { date: '07 Jan', value: 1.0 },
  { date: '11 Jan', value: 5.3 },
  { date: '13 Jan', value: 7.3 },
  { date: '19 Jan', value: 9.3 },
  { date: '20 Jan', value: 9.0 },
  { date: '21 Jan', value: 11.6 },
  { date: '22 Jan', value: 12.8 },
  { date: '30 Jan', value: 14.8 },
  { date: '31 Jan', value: 15.8 },
  { date: '02 Feb', value: 17.8 },
  { date: '06 Feb', value: 24.1 },
  { date: '10 Feb', value: 22.9 },
  { date: '12 Feb', value: 20.9 },
  { date: '17 Feb', value: 18.9 },
  { date: '18 Feb', value: 17.75 },
  { date: '24 Feb', value: 16.95 },
  { date: '25 Feb', value: 16.95 },
  { date: '03 Mar', value: 20.55 },
  { date: '04 Mar', value: 19.55 },
  { date: '05 Mar', value: 18.55 },
  { date: '06 Mar', value: 18.55 },
  { date: '09 Mar', value: 18.05 },
  { date: '10 Mar', value: 16.55 },
  { date: '12 Mar', value: 14.25 },
  { date: '16 Mar', value: 13.25 },
  { date: '30 Mar', value: 12.25 },
];

export const MONTHLY_PERFORMANCE_DATA = [
  { month: 'Jan', value: 15.8, hasData: true, trades: 12 },
  { month: 'Feb', value: 1.15, hasData: true, trades: 8 },
  { month: 'Mar', value: -4.7, hasData: true, trades: 6 },
  { month: 'Apr', value: 0, hasData: false, trades: 0 },
  { month: 'May', value: 0, hasData: false, trades: 0 },
  { month: 'Jun', value: 0, hasData: false, trades: 0 },
  { month: 'Jul', value: 0, hasData: false, trades: 0 },
  { month: 'Aug', value: 0, hasData: false, trades: 0 },
  { month: 'Sep', value: 0, hasData: false, trades: 0 },
  { month: 'Oct', value: 0, hasData: false, trades: 0 },
  { month: 'Nov', value: 0, hasData: false, trades: 0 },
  { month: 'Dec', value: 0, hasData: false, trades: 0 },
];

export const CERTIFICATES_DATA = [
  {
    id: 1,
    imageUrl: 'https://i.ibb.co/391BMBGb/DANIL-K-certificate.png',
    firm: 'Funding Pips'
  }
];

export const TRADING_DETAILED_STATS = [
  { label: 'Total Trades', value: '26', type: 'neutral' },
  { label: 'Win Rate', value: '45.8%', type: 'winrate' },
  { label: 'Average RR', value: '1:2.10', type: 'neutral' },
  { label: 'Profit Factor', value: '1.78', type: 'neutral' },
  { label: 'Max Drawdown', value: '-8.3%', type: 'negative' },
  { label: 'Best Trade', value: '+6.3%', type: 'positive' },
  { label: 'Worst Trade', value: '-2.3%', type: 'negative' },
  { label: 'Avg Holding Time', value: '7h 20m', type: 'neutral' },
];
