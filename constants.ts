
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
  status: 'Pipeline & Trading',
  views: '1,337'
};

/** Язык основного скролла (герой, опыт, дорожная карта, контакты). Оверлеи менторшип / перформанс / архив — отдельно. */
export type UiLocale = 'en' | 'ru';

export type MainSiteStat =
  | {
      variant?: 'default';
      label: string;
      value: string;
      description: string;
    }
  | {
      variant: 'markets';
      label: string;
      description: string;
      segments: [string, string, string];
    };

export type RoadmapPlanCopy = {
  title: string;
  desc: string;
  status: string;
  isSoon?: boolean;
  isHighlight?: boolean;
};

export const MAIN_SITE_COPY: Record<
  UiLocale,
  {
    tradingDesk: string;
    status: string;
    motto: string;
    credo: string;
    navMentorship: string;
    navPerformance: string;
    navArchive: string;
    projectTagline: string;
    projectDescription: string;
    projectTags: string[];
    projectCta: string;
    experienceTitle: string;
    experienceTelegramHint: string;
    experienceAsideAria: string;
    scrollToExperienceAria: string;
    aboutMeWatermark: string;
    aboutMeSubtitle: string;
    aboutMeBio: string;
    roadmapWatermark: string;
    roadmapSubtitle: string;
    roadmapSoonBadge: string;
    roadmapPlans: RoadmapPlanCopy[];
    connectWatermark: string;
    footerDeveloped: string;
    footerRights: string;
    stats: MainSiteStat[];
  }
> = {
  en: {
    tradingDesk: 'Trading desk',
    status: 'Pipeline & Trading',
    motto: 'Professional trading',
    credo: 'Discipline, patience, risk management, self-control, distance',
    navMentorship: 'Mentorship',
    navPerformance: 'Performance',
    navArchive: 'My Projects',
    projectTagline: 'Trading journal',
    projectDescription:
      'My main project — a trading journal for traders. Turns scattered trades into clear statistics: trade log, analytics, calendar and performance review in one place.',
    projectTags: ['Trade log', 'Analytics', 'Calendar', 'Review'],
    projectCta: 'Open',
    experienceTitle: 'EXPERIENCE',
    experienceTelegramHint: 'Search Telegram for the username to open the chat.',
    experienceAsideAria: 'Telegram contact',
    scrollToExperienceAria: 'Scroll to about me section',
    aboutMeWatermark: 'About Me',
    aboutMeSubtitle: 'Background & Trading Profile',
    aboutMeBio:
      "I trade professionally and understand what really drives results. Over two years of active practice I've built what matters most — discipline and patience, a solid grasp of risk management, control over myself, and the realization that results come only over the long run.",
    roadmapWatermark: 'Plans',
    roadmapSubtitle: 'My development roadmap',
    roadmapSoonBadge: 'SOON',
    roadmapPlans: [
      {
        title: 'Self & Content',
        desc: 'Growing as a trader, publishing consistently and putting my name out there.',
        status: 'Now',
        isHighlight: true,
      },
      {
        title: 'Mentorship',
        desc: 'Launching personal one-on-one mentoring.',
        status: 'Next',
      },
      {
        title: 'Trading School',
        desc: 'Opening a structured school for beginners.',
        status: 'Planned',
      },
      {
        title: 'Offline Office',
        desc: 'Opening a physical space for the team to work together.',
        status: 'Planned',
      },
    ],
    connectWatermark: 'CONTACT',
    footerDeveloped: 'Developed by',
    footerRights: 'All rights reserved',
    stats: [
      {
        variant: 'markets',
        label: 'Markets',
        description: 'High-liquidity crypto, FX and index instruments',
        segments: ['Crypto', 'Forex', 'Indices'],
      },
      {
        label: 'Approach',
        value: 'Smart Money + Price Action',
        description: 'Reading the market through institutional order flow',
      },
    ],
  },
  ru: {
    tradingDesk: 'Трейдинг-деск',
    status: 'Пайплайн и трейдинг',
    motto: 'Профессиональный трейдинг',
    credo: 'Дисциплина, терпение, риск-менеджмент, самоконтроль, дистанция',
    navMentorship: 'Менторство',
    navPerformance: 'Статистика',
    navArchive: 'Мои проекты',
    projectTagline: 'Торговый журнал',
    projectDescription:
      'Мой основной проект — торговый журнал для трейдеров. Превращает хаотичные сделки в понятную статистику: журнал сделок, аналитика, календарь и разбор результатов в одном месте.',
    projectTags: ['Журнал сделок', 'Аналитика', 'Календарь', 'Разбор'],
    projectCta: 'Открыть',
    experienceTitle: 'ОПЫТ',
    experienceTelegramHint: 'В поиске Telegram введи юзернейм — откроется чат.',
    experienceAsideAria: 'Контакт в Telegram',
    scrollToExperienceAria: 'Перейти к секции «Обо мне»',
    aboutMeWatermark: 'Обо мне',
    aboutMeSubtitle: 'Профиль и торговая практика',
    aboutMeBio:
      'Я профессионально занимаюсь трейдингом и понимаю суть торговли. За два года активной практики я выработал то, что и определяет результат: дисциплину и терпение, понимание риск-менеджмента, контроль над собой и осознание, что результат приходит на дистанции.',
    roadmapWatermark: 'Планы',
    roadmapSubtitle: 'Моя дорожная карта развития',
    roadmapSoonBadge: 'СКОРО',
    roadmapPlans: [
      {
        title: 'Работа над собой и контентом',
        desc: 'Расту как трейдер, стабильно делаю контент и заявляю о себе.',
        status: 'Сейчас',
        isHighlight: true,
      },
      {
        title: 'Менторство',
        desc: 'Запускаю персональное сопровождение один на один.',
        status: 'Дальше',
      },
      {
        title: 'Школа трейдинга',
        desc: 'Открываю системную школу для начинающих.',
        status: 'В планах',
      },
      {
        title: 'Офлайн-офис',
        desc: 'Открываю физическое пространство для команды.',
        status: 'В планах',
      },
    ],
    connectWatermark: 'КОНТАКТЫ',
    footerDeveloped: 'Разработано',
    footerRights: 'Все права защищены',
    stats: [
      {
        variant: 'markets',
        label: 'Рынки',
        description: 'Высоколиквидные крипто, FX и индексы',
        segments: ['Крипто', 'Форекс', 'Индексы'],
      },
      {
        label: 'Подход',
        value: 'Smart Money + Price Action',
        description: 'Читаю рынок через институциональный поток',
      },
    ],
  },
};

/**
 * Видео из After Effects в секции Experience. Файл в `public/videos/`, затем путь ниже.
 * Обновлено под новый крупный рендер 3D-модели iPhone (iphone 3d max …).
 *
 * Префикс через import.meta.env.BASE_URL — нужен чтобы путь работал и в
 * dev (base "/") и на GitHub Pages prod (base "/Website/"). Без префикса
 * деплой запрашивал бы /videos/... из корня gh.io и получал 404.
 */
export const EXPERIENCE_VIDEO = {
  src: `${import.meta.env.BASE_URL}videos/iphone%203d%20max-Picsart-BackgroundRemover.webm` as string,
  poster: '' as string,
};

export const SECTIONS: NavItem[] = [
  { id: 'personality', label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'connect', label: 'Contact' },
];

export const SOCIAL_LINKS: SocialLinkItem[] = [
  { name: 'TikTok', url: 'https://www.tiktok.com/@danyashou?_r=1&_t=ZS-93swsUWH5W8', icon: Video, username: '@danyashou' },
  { name: 'Telegram', url: 'https://t.me/Danya_shouuu', icon: Send, username: '@Danya_shouuu' },
  { name: 'YouTube', url: 'https://www.youtube.com/@iamshouu/videos', icon: Youtube, username: '@iamshouu' },
  { name: 'Threads', url: 'https://www.threads.com/@iamshouuuu?hl=ru', icon: AtSign, username: '@iamshouuuu' },
  { name: 'Instagram', url: 'https://www.instagram.com/iamshouuuu/', icon: Instagram, username: '@iamshouuuu' },
  { name: 'TradingView', url: 'https://ru.tradingview.com/u/shoouuuuu/', icon: TrendingUp, username: '@shoouuuuu' },
];

export const TRADING_STATS: StatItem[] = [
  { label: 'Experience', value: '2+ Years', description: 'Active market participation and system development' },
  {
    label: 'Markets',
    value: 'Crypto · Forex · Indices',
    description: 'Deep focus on high-liquidity crypto, FX, and index instruments',
    variant: 'markets',
  },
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
  { date: '03 Apr', value: 14.55 },
  { date: '08 Apr', value: 14.55 },
  { date: '11 Apr', value: 14.55 },
  { date: '15 Apr', value: 13.55 },
  { date: '18 Apr', value: 13.55 },
  { date: '22 Apr', value: 13.55 },
  { date: '28 Apr', value: 16.15 },
  { date: '13 May', value: 16.15 },
  { date: '21 May', value: 15.85 },
  { date: '26 May', value: 15.85 },
];

export const MONTHLY_PERFORMANCE_DATA = [
  { month: 'Jan', value: 15.8, hasData: true, trades: 12 },
  { month: 'Feb', value: 1.15, hasData: true, trades: 8 },
  { month: 'Mar', value: -4.7, hasData: true, trades: 6 },
  { month: 'Apr', value: 3.9, hasData: true, trades: 7 },
  { month: 'May', value: -0.30, hasData: true, trades: 3 },
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
  { label: 'Total Trades', value: '33', type: 'neutral' },
  { label: 'Win Rate', value: '62.1%', type: 'winrate' },
  { label: 'Average RR', value: '1:2.10', type: 'neutral' },
  { label: 'Profit Factor', value: '1.95', type: 'neutral' },
  { label: 'Max Drawdown', value: '-8.3%', type: 'negative' },
  { label: 'Best Trade', value: '+6.3%', type: 'positive' },
  { label: 'Worst Trade', value: '-2.3%', type: 'negative' },
  { label: 'Avg Holding Time', value: '7h 20m', type: 'neutral' },
];
