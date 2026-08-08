
import { NavItem, SocialLinkItem, StatItem, SkillData, ProjectItem } from './types';
import { FaInstagram, FaTelegramPlane, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6';
import { SiTradingview } from 'react-icons/si';

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

export type DevelopmentProjectCopy = {
  context: string;
  title: string;
  description: string;
  meta: string;
  cta: string;
  url: string;
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
    buildWatermark: string;
    buildSubtitle: string;
    buildLead: string;
    buildProjects: DevelopmentProjectCopy[];
    roadmapWatermark: string;
    roadmapSubtitle: string;
    roadmapSoonBadge: string;
    roadmapPlans: RoadmapPlanCopy[];
    roadmapParallelTitle: string;
    roadmapParallelDescription: string;
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
    aboutMeSubtitle: 'Markets & Digital Products',
    aboutMeBio:
      'I work in two disciplines built on the same mindset: trading and web development. Markets taught me to work with risk, data and distance. In products, I turn that systematic thinking into fast, clear tools people can actually use.',
    buildWatermark: 'Build',
    buildSubtitle: 'Selected Web Work',
    buildLead: 'I build digital products from real problems — especially where markets, data and decision-making meet.',
    buildProjects: [
      {
        context: 'Trading journal',
        title: 'X-Perience',
        description: 'A trading workspace that turns scattered trades into a repeatable review system with a journal, analytics and calendar.',
        meta: 'Product thinking · Analytics · Interface',
        cta: 'View live',
        url: 'https://xperienceone.ru',
      },
      {
        context: 'Personal platform',
        title: 'shou / personal site',
        description: 'The site you are viewing: an interactive portfolio that combines market experience, product work and motion-led frontend development.',
        meta: 'React · TypeScript · Motion',
        cta: 'View source',
        url: 'https://github.com/iamshouu/MyMainWebsite',
      },
    ],
    roadmapWatermark: 'Plans',
    roadmapSubtitle: 'From Audience to an Ecosystem',
    roadmapSoonBadge: 'SOON',
    roadmapPlans: [
      {
        title: 'Content & First Audience',
        desc: 'I am actively putting myself out there: publishing videos and educational material, and building my first engaged audience.',
        status: 'Current stage',
        isHighlight: true,
      },
      {
        title: 'Mentorship',
        desc: 'Once the first audience is formed, I introduce one-on-one mentorship and test the learning format in practice.',
        status: 'Next stage',
      },
      {
        title: 'Online Trading School',
        desc: 'I turn the accumulated experience and methodology into a structured online trading school.',
        status: 'Then',
      },
      {
        title: 'Offline Space',
        desc: 'The online system grows into a physical space for education, community and team work.',
        status: 'Long-term goal',
      },
    ],
    roadmapParallelTitle: 'Products — parallel to every stage',
    roadmapParallelDescription: 'At the same time, I keep developing X-Perience and new web tools for real trading problems.',
    connectWatermark: 'CONTACT',
    footerDeveloped: 'Developed by',
    footerRights: 'All rights reserved',
    stats: [
      {
        label: 'Trading',
        value: 'Risk · Structure · Patience',
        description: 'Decisions under uncertainty, grounded in data, discipline and a long-term view.',
      },
      {
        label: 'Web development',
        value: 'React · TypeScript · Motion',
        description: 'Interfaces and tools where structure, speed and interaction support the product idea.',
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
    aboutMeSubtitle: 'Рынки и цифровые продукты',
    aboutMeBio:
      'Я работаю в двух направлениях с одним способом мышления: трейдинге и веб-разработке. Рынок научил меня работать с риском, данными и дистанцией. В продуктах я превращаю эту системность в быстрые и понятные инструменты, которыми действительно удобно пользоваться.',
    buildWatermark: 'Build',
    buildSubtitle: 'Избранные веб-проекты',
    buildLead: 'Я создаю цифровые продукты из реальных задач — особенно там, где встречаются рынки, данные и принятие решений.',
    buildProjects: [
      {
        context: 'Торговый журнал',
        title: 'X-Perience',
        description: 'Рабочее пространство трейдера, которое превращает разрозненные сделки в систему разбора: журнал, аналитика и календарь.',
        meta: 'Продукт · Аналитика · Интерфейс',
        cta: 'Открыть сайт',
        url: 'https://xperienceone.ru',
      },
      {
        context: 'Личная платформа',
        title: 'shou / personal site',
        description: 'Сайт, который ты сейчас смотришь: интерактивное портфолио, объединяющее рынок, продуктовую работу и frontend-разработку с анимацией.',
        meta: 'React · TypeScript · Motion',
        cta: 'Посмотреть код',
        url: 'https://github.com/iamshouu/MyMainWebsite',
      },
    ],
    roadmapWatermark: 'Планы',
    roadmapSubtitle: 'От аудитории к собственной экосистеме',
    roadmapSoonBadge: 'СКОРО',
    roadmapPlans: [
      {
        title: 'Контент и первая аудитория',
        desc: 'Сейчас я активно заявляю о себе: публикую видео и обучающие материалы, набираю первую вовлечённую аудиторию.',
        status: 'Текущий этап',
        isHighlight: true,
      },
      {
        title: 'Менторство',
        desc: 'После формирования первой аудитории запускаю персональное сопровождение один на один и проверяю формат обучения на практике.',
        status: 'Следующий этап',
      },
      {
        title: 'Онлайн-школа трейдинга',
        desc: 'Собираю накопленный опыт и методику в структурированную онлайн-школу трейдинга.',
        status: 'Затем',
      },
      {
        title: 'Офлайн-пространство',
        desc: 'Развиваю онлайн-систему в физическое пространство для обучения, сообщества и совместной работы команды.',
        status: 'Долгосрочная цель',
      },
    ],
    roadmapParallelTitle: 'Продукты — параллельно каждому этапу',
    roadmapParallelDescription: 'Одновременно я продолжаю развивать X-Perience и новые веб-инструменты для реальных задач трейдера.',
    connectWatermark: 'КОНТАКТЫ',
    footerDeveloped: 'Разработано',
    footerRights: 'Все права защищены',
    stats: [
      {
        label: 'Трейдинг',
        value: 'Риск · Структура · Терпение',
        description: 'Решения в условиях неопределённости, основанные на данных, дисциплине и дистанции.',
      },
      {
        label: 'Веб-разработка',
        value: 'React · TypeScript · Motion',
        description: 'Интерфейсы и инструменты, где структура, скорость и взаимодействие работают на идею продукта.',
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
  { name: 'TikTok', url: 'https://www.tiktok.com/@danyashou?_r=1&_t=ZS-93swsUWH5W8', icon: FaTiktok, username: '@danyashou' },
  { name: 'Telegram', url: 'https://t.me/Danya_shouuu', icon: FaTelegramPlane, username: '@Danya_shouuu' },
  { name: 'YouTube', url: 'https://www.youtube.com/@iamshouu/videos', icon: FaYoutube, username: '@iamshouu' },
  { name: 'Threads', url: 'https://www.threads.com/@iamshouuuu?hl=ru', icon: FaThreads, username: '@iamshouuuu' },
  { name: 'Instagram', url: 'https://www.instagram.com/iamshouuuu/', icon: FaInstagram, username: '@iamshouuuu' },
  { name: 'TradingView', url: 'https://ru.tradingview.com/u/shoouuuuu/', icon: SiTradingview, username: '@shoouuuuu' },
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
  { date: '30 Jun', value: 16.85 },
  { date: '31 Jul', value: 18.15 },
];

export const MONTHLY_PERFORMANCE_DATA = [
  { month: 'Jan', value: 15.8, hasData: true, trades: 12 },
  { month: 'Feb', value: 1.15, hasData: true, trades: 8 },
  { month: 'Mar', value: -4.7, hasData: true, trades: 6 },
  { month: 'Apr', value: 3.9, hasData: true, trades: 7 },
  { month: 'May', value: -0.30, hasData: true, trades: 3 },
  { month: 'Jun', value: 1.0, hasData: true, trades: 9 },
  { month: 'Jul', value: 1.3, hasData: true, trades: 2 },
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
  { label: 'Total Trades', value: '44', type: 'neutral' },
  { label: 'Win Rate', value: '57%', type: 'winrate' },
  { label: 'Average RR', value: '2.2', type: 'neutral' },
  { label: 'Profit Factor', value: '1.31', type: 'neutral' },
  { label: 'Max Drawdown', value: '-8.3%', type: 'negative' },
  { label: 'Best Trade', value: '+6.3%', type: 'positive' },
  { label: 'Worst Trade', value: '-2.3%', type: 'negative' },
  { label: 'Avg Holding Time', value: '13h 8m', type: 'neutral' },
];
