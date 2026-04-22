
import React, { useState, useEffect, useRef } from 'react';
import {
  SOCIAL_LINKS,
  PROJECTS_DATA,
  MEDIA_CONFIG,
  MAIN_SITE_COPY,
  PERFORMANCE_DATA,
  MONTHLY_PERFORMANCE_DATA,
  TRADING_DETAILED_STATS,
  EXPERIENCE_VIDEO,
} from './constants';
import type { UiLocale } from './constants';
import Section from './components/Section';
import SocialCard from './components/SocialCard';
import ProjectCard from './components/ProjectCard';
import CustomCursor from './components/CustomCursor';
import Sparkles from './components/Sparkles';
import MainSocialIcon from './components/MainSocialIcon';
import MentorshipAmbientBackground from './components/MentorshipAmbientBackground';
import MentorshipPersonalPathIcon from './components/MentorshipPersonalPathIcon';
import MentorshipSupportIcon from './components/MentorshipSupportIcon';
import MentorshipConferenceIcon from './components/MentorshipConferenceIcon';
import MentorshipFlexibleIcon from './components/MentorshipFlexibleIcon';
import PerformanceAmbientBackground from './components/PerformanceAmbientBackground';
import ArchiveAmbientBackground from './components/ArchiveAmbientBackground';
import { 
  ChevronDown, 
  FolderCode, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  MonitorPlay,
  Users,
  GraduationCap,
  Building2,
  Clock,
  TrendingUp,
  Award,
  Send,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, BarChart, Bar, Cell, LabelList } from 'recharts';

const MENTORSHIP_TELEGRAM_URL = SOCIAL_LINKS.find((l) => l.name === 'Telegram')?.url ?? '#';
const EXPERIENCE_TELEGRAM_HANDLE = '@Danya_shouuu';

const MENTORSHIP_FEATURE_ICONS: {
  step: string;
  CustomIcon: React.ComponentType<{ className?: string }>;
}[] = [
  { step: '01', CustomIcon: MentorshipPersonalPathIcon },
  { step: '02', CustomIcon: MentorshipSupportIcon },
  { step: '03', CustomIcon: MentorshipConferenceIcon },
  { step: '04', CustomIcon: MentorshipFlexibleIcon },
];

const MENTORSHIP_COPY: Record<
  UiLocale,
  {
    back: string;
    badge1: string;
    badge2: string;
    title: string;
    heroSub: string;
    heroBody: string;
    asideTitle: string;
    asideLines: [string, string, string];
    sectionTitle: string;
    features: { title: string; desc: string }[];
    ctaEyebrow: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    ctaNote: string;
  }
> = {
  en: {
    back: 'BACK TO TERMINAL',
    badge1: 'One-on-one',
    badge2: 'Trading training',
    title: 'Mentorship',
    heroSub: 'Sessions one-on-one, adapted to your level of knowledge.',
    heroBody:
      'Mentorship is a way to learn trading as effectively and safely as possible for your capital: you get full support from day one to your first results, a clear learning structure, and an individual approach.',
    asideTitle: 'At a glance',
    asideLines: [
      'One-on-one dialogue — not recorded lectures',
      'Homework',
      'Individual approach',
    ],
    sectionTitle: 'Why mentorship?',
    features: [
      {
        title: 'Personal program',
        desc: 'Individual approach — from the basics to your own system.',
      },
      {
        title: 'Full support',
        desc: 'Full mentor support — from the start to your first results.',
      },
      {
        title: 'Online conferences 1-on-1',
        desc: 'Conferences on Discord and Google Meet.',
      },
      {
        title: 'Flexible format',
        desc: 'Voice or video; length and frequency by agreement.',
      },
    ],
    ctaEyebrow: 'Next step',
    ctaTitle: 'Start on Telegram',
    ctaBody:
      'Send your experience level and time zone — we’ll suggest a format before any commitment.',
    ctaButton: 'Discuss on Telegram',
    ctaNote: 'No spam · private chat',
  },
  ru: {
    back: 'НАЗАД К ТЕРМИНАЛУ',
    badge1: 'Один на один',
    badge2: 'Обучение трейдингу',
    title: 'Менторство',
    heroSub: 'Занятия 1 на 1 и адаптация к вашему уровню знаний',
    heroBody:
      'Менторшип — это не групповой курс, где ты теряешься среди десятков студентов. Здесь ты в приоритете: каждое занятие, каждый разбор, каждая обратная связь — только про тебя. Ты получишь сопровождение на всём пути от нулевых знаний до первого стабильного результата, индивидуальную программу под твой уровень.',
    asideTitle: 'Кратко',
    asideLines: [
      'Диалоги один на один, не записанные лекции',
      'Домашка',
      'Индивидуальный подход',
    ],
    sectionTitle: 'Почему менторшип?',
    features: [
      {
        title: 'Персональная программа',
        desc: 'Индивидуальный подход — от базы до вашей личной системы.',
      },
      {
        title: 'Полное сопровождение',
        desc: 'Полное сопровождение ментором, от начала до ваших первых результатов.',
      },
      {
        title: 'Онлайн конференции 1/1',
        desc: 'Конференции в Discord и Google Meet.',
      },
      {
        title: 'Гибкий формат',
        desc: 'Голос или видео; длительность и частота по договорённости.',
      },
    ],
    ctaEyebrow: 'Следующий шаг',
    ctaTitle: 'Начать в Telegram',
    ctaBody:
      'Напишите уровень опыта и часовой пояс — предложим формат до любых обязательств.',
    ctaButton: 'Обсудить в Telegram',
    ctaNote: 'Без спама · личная переписка',
  },
};

const performanceWithDrawdown = (() => {
  let currentPeak = -Infinity;
  return PERFORMANCE_DATA.map(d => {
    if (d.value > currentPeak) currentPeak = d.value;
    const drawdown = d.value - currentPeak;
    return { 
      ...d, 
      peak: currentPeak, 
      drawdown: parseFloat(drawdown.toFixed(2)),
      drawdownRange: [d.value, currentPeak]
    };
  });
})();

const maxProfit = Math.max(...performanceWithDrawdown.map(d => d.value));
const maxDrawdown = Math.min(...performanceWithDrawdown.map(d => d.drawdown));
const maxDrawdownPoint = performanceWithDrawdown.find(d => d.drawdown === maxDrawdown);

const filteredMonthlyData = (() => {
  const lastIndexWithData = [...MONTHLY_PERFORMANCE_DATA].reverse().findIndex(d => d.hasData);
  const actualLastIndex = lastIndexWithData === -1 ? 0 : MONTHLY_PERFORMANCE_DATA.length - 1 - lastIndexWithData;
  return MONTHLY_PERFORMANCE_DATA.slice(0, Math.min(actualLastIndex + 2, MONTHLY_PERFORMANCE_DATA.length));
})();

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden min-w-[180px] outline-none focus:outline-none">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <div className="flex justify-between items-start mb-3 relative z-10">
          <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest">{label}</p>
          {data.drawdown < 0 && (
            <span className="text-[9px] font-mono text-red-400/80 bg-red-400/10 px-1.5 py-0.5 rounded border border-red-400/20">
              DD: {data.drawdown.toFixed(2)}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)] ${data.value >= 0 ? 'bg-white' : 'bg-red-500'}`} />
          <p className="text-xl font-black text-white tracking-tighter">
            Return: {data.value > 0 ? '+' : ''}{Number(data.value).toFixed(2)}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const ROADMAP_ICONS = [MonitorPlay, Users, GraduationCap, Building2] as const;

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'main' | 'projects' | 'performance' | 'mentorship'>('main');
  const [mainSiteLocale, setMainSiteLocale] = useState<UiLocale>('en');
  const [mentorshipLocale, setMentorshipLocale] = useState<UiLocale>('en');
  const [isMuted, setIsMuted] = useState(false); 
  const [volume, setVolume] = useState(0.05); // Set to 5% as requested
  const [hasInteracted, setHasInteracted] = useState(false);
  const [performanceAnimReady, setPerformanceAnimReady] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (viewMode === 'performance') {
      const timer = setTimeout(() => setPerformanceAnimReady(true), 1500);
      return () => {
        clearTimeout(timer);
        setPerformanceAnimReady(false);
      };
    } else {
      setPerformanceAnimReady(false);
    }
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === 'main') {
      document.documentElement.setAttribute('lang', mainSiteLocale === 'ru' ? 'ru' : 'en');
    } else if (viewMode === 'mentorship') {
      document.documentElement.setAttribute('lang', mentorshipLocale === 'ru' ? 'ru' : 'en');
    } else {
      document.documentElement.setAttribute('lang', 'en');
    }
  }, [viewMode, mainSiteLocale, mentorshipLocale]);

  // Handle global interaction to bypass browser autoplay restrictions
  useEffect(() => {
    if (hasInteracted) return;

    const handleFirstInteraction = () => {
      setHasInteracted(true);
    };

    window.addEventListener('mousedown', handleFirstInteraction, { once: true });
    window.addEventListener('scroll', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('mousedown', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [hasInteracted]);

  // Single source of truth for audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = isMuted;
    audio.volume = volume;

    if (hasInteracted) {
      if (!isMuted && volume > 0) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Playback interaction required or failed:", error);
          });
        }
      } else {
        audio.pause();
      }
    }
  }, [isMuted, volume, hasInteracted]);

  const toggleMute = () => {
    if (!hasInteracted) setHasInteracted(true);
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
    if (!hasInteracted) setHasInteracted(true);
  };

  const handleNavigation = (id: string) => {
    if (viewMode !== 'main') setViewMode('main');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element && scrollContainerRef.current) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const homeT = MAIN_SITE_COPY[mainSiteLocale];
  const mentorshipT = MENTORSHIP_COPY[mentorshipLocale];
  const mentorshipIsRu = mentorshipLocale === 'ru';
  const mainSiteIsRu = mainSiteLocale === 'ru';

  return (
    <div className="bg-black text-white h-[100dvh] w-full relative overflow-hidden font-sans selection:bg-white/20 selection:text-white">
      <CustomCursor />
      
      {/* Background Layer — hidden on Mentorship so only MentorshipAmbientBackground is visible (no bleed-through of grain/grid/video) */}
      <div
        className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${viewMode === 'mentorship' || viewMode === 'performance' || viewMode === 'projects' ? 'hidden' : ''}`}
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-40 grayscale scale-100 transition-opacity duration-1000"
          style={{ 
            imageRendering: 'crisp-edges'
          }}
        >
          <source src={MEDIA_CONFIG.videoUrl} type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Analog Grain */}
        <div className="absolute inset-0 opacity-[0.04] overflow-hidden">
          <div className="absolute inset-[-200%] bg-repeat animate-grain" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
        </div>

        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.98)_100%)]" />
        
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '12px 12px' 
          }} 
        />
      </div>

      <style>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -2%); }
          20% { transform: translate(-4%, 1%); }
          30% { transform: translate(2%, -4%); }
          40% { transform: translate(-1%, 4%); }
          50% { transform: translate(-3%, 2%); }
        }
        .animate-grain {
          animation: grain 0.8s steps(1) infinite;
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 8px;
          height: 8px;
          background: #fff;
          cursor: pointer;
          border-radius: 50%;
        }
        .recharts-wrapper, .recharts-surface, .recharts-layer {
          outline: none !important;
        }
        .recharts-wrapper:focus, .recharts-surface:focus, .recharts-layer:focus, .recharts-active-dot:focus, .recharts-dot:focus {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        .recharts-wrapper * {
          outline: none !important;
          -webkit-tap-highlight-color: transparent;
        }
        svg:focus {
          outline: none !important;
        }
        @keyframes trace-letter {
          0% { stroke-dashoffset: 150; }
          100% { stroke-dashoffset: -2000; }
        }
        .trace-letter {
          stroke-dasharray: 150 2000;
          animation: trace-letter 25s linear infinite;
        }
      `}</style>

      <audio ref={audioRef} src={MEDIA_CONFIG.audioUrl} loop />

      {/* Dynamic Header */}
      <header className="fixed top-0 left-0 w-full p-6 md:p-10 z-[100] flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-3 md:gap-4 pointer-events-auto">
          <div className="flex items-center gap-2 md:gap-3 group/audio">
            <button 
              onClick={toggleMute}
              className="p-2 md:p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/10 transition-all flex items-center justify-center shadow-2xl"
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={16} className="text-white/30 md:w-[18px]" />
              ) : (
                <Volume2 size={16} className="text-white animate-pulse md:w-[18px]" />
              )}
            </button>
            
            <div className="w-0 overflow-hidden group-hover/audio:w-20 md:group-hover/audio:w-28 group-hover/audio:ml-2 transition-all duration-500 ease-out flex items-center bg-white/5 backdrop-blur-md px-0 group-hover/audio:px-3 rounded-full border border-transparent group-hover/audio:border-white/10 h-8 md:h-10">
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
              />
            </div>
          </div>
          
          <div className="flex flex-col cursor-pointer group pointer-events-auto" onClick={() => handleNavigation('personality')}>
            <span className="text-[7px] md:text-[9px] font-mono font-bold tracking-[0.3em] md:tracking-[0.5em] text-white/80 group-hover:text-white transition-all duration-500 uppercase">
              danil.karagodin
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pointer-events-auto">
          <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3">
            {viewMode === 'main' && (
              <div
                className="flex w-fit rounded-full border border-white/15 bg-black/35 p-0.5 font-mono text-[9px] md:text-[10px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                role="group"
                aria-label={mainSiteIsRu ? 'Язык основного сайта' : 'Main site language'}
              >
                <button
                  type="button"
                  onClick={() => setMainSiteLocale('en')}
                  className={`rounded-full px-3 py-1.5 transition-colors ${
                    mainSiteLocale === 'en' ? 'bg-white/15 text-white shadow-sm' : 'text-white/45 hover:text-white/85'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setMainSiteLocale('ru')}
                  className={`rounded-full px-3 py-1.5 transition-colors ${
                    mainSiteLocale === 'ru' ? 'bg-white/15 text-white shadow-sm' : 'text-white/45 hover:text-white/85'
                  }`}
                >
                  RU
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => setViewMode('mentorship')}
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full transition-all text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/80 group"
            >
              <Users size={12} className="group-hover:scale-110 transition-transform md:w-[14px]" />
              {homeT.navMentorship}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('performance')}
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full transition-all text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/80 group"
            >
              <TrendingUp size={12} className="group-hover:scale-110 transition-transform md:w-[14px]" />
              {homeT.navPerformance}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('projects')}
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full transition-all text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/80 group"
            >
              <FolderCode size={12} className="group-hover:scale-110 transition-transform md:w-[14px]" />
              {homeT.navArchive}
            </button>
          </div>
        </div>
      </header>

      <main
        ref={scrollContainerRef}
        className={`w-full scroll-container relative z-10 no-scrollbar ${viewMode === 'main' ? 'block' : 'hidden'}`}
      >
        <Section id="personality">
          <div className="flex flex-col items-center text-center animate-fade-in-up">
            <Sparkles>
              <div className="relative group mb-4 md:mb-8 logo-container py-4">
                <h1 className="text-4xl md:text-8xl font-black tracking-tighter flex items-center justify-center select-none overflow-visible">
                  <span className="outline-text block transform group-hover:-translate-x-4 transition-transform duration-700">Danya</span>
                  <span className="bg-white text-black px-4 md:px-8 py-0 md:py-2 transform -skew-x-12 md:translate-x-[-15%] group-hover:translate-x-4 transition-transform duration-700 shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                    SHOU
                  </span>
                </h1>
                <div className="mt-2 md:mt-4 flex items-center justify-between w-full px-2">
                   <div className="h-[1px] bg-white/20 flex-1" />
                   <div className="px-3 md:px-4 text-[7px] md:text-[9px] font-mono text-white/80 tracking-[0.3em] md:tracking-[0.6em] uppercase">{homeT.tradingDesk}</div>
                   <div className="h-[1px] bg-white/20 flex-1" />
                </div>
              </div>
            </Sparkles>
            
            <p className="text-white/80 text-[9px] md:text-xs font-mono mb-6 md:mb-10 tracking-[0.5em] md:tracking-[0.8em] flex items-center gap-3 md:gap-4">
              <span className="w-6 md:w-8 h-[1px] bg-white/40" />
              {homeT.status}
              <span className="w-6 md:w-8 h-[1px] bg-white/40" />
            </p>

            <div className="flex flex-col items-center gap-2 md:gap-3 mb-8 md:mb-12 max-w-lg px-4">
              <div className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-white/10 border border-white/20 rounded-full group-hover:border-white/40 transition-all">
                <span className="text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] text-white">
                  {homeT.motto}
                </span>
              </div>
              <p className="text-[11px] md:text-[13px] font-mono uppercase tracking-[0.16em] md:tracking-[0.22em] text-white/90 leading-relaxed text-center">
                {homeT.credo}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-10 md:mb-20 max-w-5xl px-4">
              {SOCIAL_LINKS.map((link, idx) => (
                <MainSocialIcon key={idx} link={link} index={idx} />
              ))}
            </div>

          </div>

          <button
            type="button"
            onClick={() => handleNavigation('experience')}
            aria-label={homeT.scrollToExperienceAria}
            className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30 hover:opacity-80 transition-opacity pointer-events-auto"
          >
             <ChevronDown size={24} className="md:w-[32px]" />
          </button>
        </Section>

        <Section id="experience" className="overflow-visible">
           {/* Как в референсе: узкий центрированный блок, две равные колонки — текст ближе к центру, справа телефон вместо сетки/радара */}
           <div className="z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 md:px-8 lg:grid-cols-2 lg:gap-10 xl:gap-14 lg:items-center lg:px-4 xl:px-6">
             <div className="animate-fade-in-up w-full max-w-xl justify-self-center lg:max-w-[540px] lg:justify-self-end">
                <h2 className="text-3xl md:text-7xl font-black mb-6 md:mb-12 flex items-center gap-3 md:gap-5 tracking-tighter">
                  <span className="w-1 h-8 md:w-1.5 md:h-16 bg-white shadow-[0_0_30px_rgba(255,255,255,0.4)]"></span>
                  {homeT.experienceTitle}
                </h2>
                <div className="space-y-4 md:space-y-6">
                  {homeT.stats.map((stat, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/5 p-5 sm:p-7 md:p-10 rounded-2xl md:rounded-[1.75rem] hover:border-white/20 hover:bg-white/10 transition-all duration-500 group">
                       <p className="text-white/50 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] mb-1 md:mb-3 group-hover:text-white/70 transition-colors">{stat.label}</p>
                       {stat.variant === 'markets' ? (
                         <p className="flex flex-wrap items-baseline gap-x-2 md:gap-x-3 gap-y-1 text-2xl md:text-4xl font-black tracking-tighter text-white">
                           <span>{stat.segments[0]}</span>
                           <span className="text-white/35" aria-hidden>/</span>
                           <span>{stat.segments[1]}</span>
                           <span className="text-white/35" aria-hidden>/</span>
                           <span>{stat.segments[2]}</span>
                         </p>
                       ) : (
                         <p className="text-2xl md:text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                       )}
                       <p className="text-[12px] md:text-[14px] text-white/60 mt-3 md:mt-4 font-medium leading-relaxed">{stat.description}</p>
                    </div>
                  ))}
                </div>
             </div>
             <div className="flex w-full min-w-0 flex-col items-center gap-8 lg:flex-row lg:items-end lg:justify-center lg:gap-5 xl:gap-8 justify-self-center lg:pl-2">
                {EXPERIENCE_VIDEO.src ? (
                  <>
                    <div className="experience-section-video-wrap min-w-0 w-full flex-1">
                      <video
                        className="experience-section-video"
                        src={EXPERIENCE_VIDEO.src}
                        poster={EXPERIENCE_VIDEO.poster || undefined}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                      />
                    </div>
                    <aside
                      className="flex w-full max-w-[17rem] shrink-0 flex-col items-center border-t border-white/10 pt-6 text-center lg:w-auto lg:max-w-[13rem] lg:border-l lg:border-t-0 lg:pt-0 lg:pl-6 lg:pr-1 lg:text-left"
                      aria-label={homeT.experienceAsideAria}
                    >
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.45em] text-white/40">
                        Telegram
                      </p>
                      <p className="mt-2 text-[11px] leading-relaxed text-white/55 md:text-xs">
                        {homeT.experienceTelegramHint}
                      </p>
                      <a
                        href={MENTORSHIP_TELEGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-4 inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 font-mono text-[13px] tracking-tight text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-all hover:border-white/35 hover:bg-white/10 hover:shadow-[0_0_28px_rgba(255,255,255,0.08)] md:text-sm"
                      >
                        <Send
                          className="h-4 w-4 shrink-0 text-white/55 transition-colors group-hover:text-white"
                          strokeWidth={2}
                          aria-hidden
                        />
                        <span>{EXPERIENCE_TELEGRAM_HANDLE}</span>
                      </a>
                    </aside>
                  </>
                ) : (
                  <div
                    className="flex h-[min(72vh,820px)] w-full min-h-[280px] max-w-lg items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] md:min-h-[400px] lg:min-h-[480px]"
                    aria-hidden
                  />
                )}
             </div>
           </div>
        </Section>

        <Section id="roadmap">
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
            <div className="text-center w-full relative mb-12 md:mb-20 pt-10">
               <h2 className="text-5xl md:text-[10rem] font-black opacity-[0.07] text-white uppercase tracking-tighter absolute top-0 left-1/2 -translate-x-1/2 select-none pointer-events-none w-full whitespace-nowrap">
                 {homeT.roadmapWatermark}
               </h2>
               <div className="relative z-10 flex flex-col items-center">
                 <p className="text-white font-mono text-[11px] md:text-[16px] uppercase tracking-[0.8em] font-black mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                   {homeT.roadmapSubtitle}
                 </p>
                 <div className="h-[1px] w-32 md:w-56 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
               </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full px-2 md:px-4">
              {homeT.roadmapPlans.map((plan, idx) => {
                const Icon = ROADMAP_ICONS[idx];
                return (
                  <div key={idx} className={`group relative p-6 md:p-8 bg-white/5 border rounded-xl md:rounded-[2.5rem] transition-all duration-500 overflow-hidden ${plan.isHighlight ? 'border-white/40 bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]' : 'border-white/5 hover:bg-white/10 hover:border-white/20'}`}>
                    <div className="absolute -right-2 -top-2 md:-right-4 md:-top-4 text-white/5 font-black text-6xl md:text-8xl italic group-hover:text-white/10 transition-colors select-none">
                      {idx + 1}
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500 ${plan.isHighlight ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-white/10 text-white'}`}>
                        <Icon size={20} className="md:w-[28px] md:h-[28px]" />
                      </div>
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <h3 className="text-base md:text-xl font-bold tracking-tight">{plan.title}</h3>
                        {plan.isSoon && (
                          <span className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-[7px] font-mono text-white/50 animate-pulse uppercase">{homeT.roadmapSoonBadge}</span>
                        )}
                      </div>
                      <p className="text-[12px] md:text-[14px] text-white/80 font-medium leading-relaxed mb-6 md:mb-8">{plan.desc}</p>
                      
                      <div className="flex items-center gap-2 text-[9px] md:text-[11px] font-mono text-white/60 uppercase tracking-widest mt-auto border-t border-white/5 pt-4">
                        <Clock size={8} />
                        {plan.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        <Section id="connect">
           <div className="text-center w-full max-w-5xl flex flex-col h-full justify-center">
              <h2 className="text-5xl md:text-[12rem] font-black mb-10 md:mb-20 opacity-[0.03] text-white uppercase tracking-tighter select-none pointer-events-none">{homeT.connectWatermark}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left relative z-10 px-2">
                {SOCIAL_LINKS.slice(0, 4).map((link, idx) => (
                  <SocialCard key={idx} link={link} />
                ))}
              </div>
              <div className="mt-10 md:mt-32 flex justify-center px-4">
                <div className="relative inline-flex max-w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-black/70 px-5 py-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_12px_48px_rgba(0,0,0,0.65),0_0_36px_rgba(255,255,255,0.08)] backdrop-blur-md md:px-8 md:py-3">
                  <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                  <span className="pointer-events-none absolute -left-0.5 -top-0.5 h-2 w-2 border-l border-t border-white/40" />
                  <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 h-2 w-2 border-b border-r border-white/40" />
                  <span className="relative flex h-1.5 w-1.5 shrink-0 rounded-full bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.9)]" aria-hidden />
                  <p className="text-center text-[9px] font-mono font-medium uppercase leading-relaxed tracking-[0.22em] text-white/88 md:text-[11px] md:tracking-[0.28em]">
                    <span className="text-white/45">©</span>{' '}
                    {homeT.footerDeveloped} <span className="text-white">shou</span>
                    <span className="text-white/35"> · </span>
                    <span className="text-white/75">{homeT.footerRights}</span>
                  </p>
                  <span className="relative flex h-1.5 w-1.5 shrink-0 rounded-full bg-white/30 shadow-[0_0_10px_rgba(255,255,255,0.5)]" aria-hidden />
                </div>
              </div>
           </div>
        </Section>
      </main>

      {viewMode === 'projects' && (
        <div className="fixed inset-0 z-[200] isolate overflow-y-auto">
          <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
            <ArchiveAmbientBackground />
          </div>
          <div
            className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/35 via-black/15 to-black/55"
            aria-hidden
          />
          <div className="relative z-10 min-h-full p-4 md:p-24">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => setViewMode('main')}
                className="inline-flex items-center gap-2 md:gap-3 text-white/50 hover:text-white transition-all mb-8 md:mb-16 group relative z-50 py-2 pr-4"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform md:w-[18px]" />
                <span className="font-mono tracking-widest text-[8px] md:text-[10px]">BACK TO TERMINAL</span>
              </button>
              <h2 className="text-5xl md:text-[10rem] font-black mb-8 md:mb-16 tracking-tighter opacity-5 select-none uppercase pointer-events-none">Archive</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 pb-20">
                {PROJECTS_DATA.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'mentorship' && (
        <div
          className="fixed inset-0 z-[200] isolate overflow-y-auto"
          lang={mentorshipLocale === 'ru' ? 'ru' : 'en'}
        >
          <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
            <MentorshipAmbientBackground />
          </div>
          {/* Light veil for text contrast — keep translucent so aurora/glows stay visible */}
          <div
            className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/35 via-black/15 to-black/55"
            aria-hidden
          />
          <div className="relative z-10 min-h-full px-4 py-8 md:px-12 md:py-16 lg:px-20 lg:py-20 font-['Outfit',sans-serif]">
            <div className="max-w-6xl mx-auto pb-28">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10 md:mb-14">
                <button
                  type="button"
                  onClick={() => setViewMode('main')}
                  className="inline-flex w-fit items-center gap-2 md:gap-3 text-white/50 hover:text-white transition-all group relative z-50 py-2 pr-4"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform md:w-[18px]" />
                  <span className="font-mono tracking-widest text-[8px] md:text-[10px]">{mentorshipT.back}</span>
                </button>
                <div
                  className="flex w-fit rounded-full border border-white/15 bg-black/35 p-0.5 font-mono text-[9px] md:text-[10px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  role="group"
                  aria-label={mentorshipIsRu ? 'Язык страницы' : 'Page language'}
                >
                  <button
                    type="button"
                    onClick={() => setMentorshipLocale('en')}
                    className={`rounded-full px-3 py-1.5 transition-colors ${
                      mentorshipLocale === 'en' ? 'bg-white/15 text-white shadow-sm' : 'text-white/45 hover:text-white/85'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setMentorshipLocale('ru')}
                    className={`rounded-full px-3 py-1.5 transition-colors ${
                      mentorshipLocale === 'ru' ? 'bg-white/15 text-white shadow-sm' : 'text-white/45 hover:text-white/85'
                    }`}
                  >
                    RU
                  </button>
                </div>
              </div>

              {/* Hero — asymmetric grid, not a single column */}
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-start mb-14 md:mb-20">
                <div
                  className="pointer-events-none absolute -left-4 top-0 hidden lg:block h-[min(70%,420px)] w-px bg-gradient-to-b from-white/25 via-white/10 to-transparent"
                  aria-hidden
                />
                <div className="lg:col-span-7 relative">
                  <div className="flex flex-wrap items-center gap-2 mb-5 md:mb-6">
                    <span
                      className={`inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 font-mono text-[9px] text-white/70 ${
                        mentorshipIsRu ? 'tracking-wide' : 'uppercase tracking-[0.25em]'
                      }`}
                    >
                      {mentorshipT.badge1}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[9px] text-white/45 ${
                        mentorshipIsRu ? 'tracking-wide' : 'uppercase tracking-[0.2em]'
                      }`}
                    >
                      {mentorshipT.badge2}
                    </span>
                  </div>
                  <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black tracking-tighter leading-[0.95] text-white mb-6 drop-shadow-[0_4px_40px_rgba(0,0,0,0.6)]">
                    <span className="block bg-gradient-to-br from-white via-white to-white/55 bg-clip-text text-transparent">
                      {mentorshipT.title}
                    </span>
                    <span className="mt-3 block text-[clamp(1rem,2.4vw,1.35rem)] font-semibold tracking-tight text-white/88">
                      {mentorshipT.heroSub}
                    </span>
                  </h2>
                  <p className="text-base md:text-lg text-white/75 leading-relaxed max-w-xl border-l border-white/15 pl-5 md:pl-6">
                    {mentorshipT.heroBody}
                  </p>
                </div>

                <aside className="lg:col-span-5 lg:sticky lg:top-24">
                  <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.02] p-6 md:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                    <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl" aria-hidden />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" aria-hidden />
                    <p
                      className={`relative text-[11px] font-semibold tracking-[0.22em] text-white/50 mb-5 ${
                        mentorshipIsRu ? '' : 'uppercase'
                      }`}
                    >
                      {mentorshipT.asideTitle}
                    </p>
                    <ul className="relative space-y-3.5">
                      {mentorshipT.asideLines.map((line) => (
                        <li key={line} className="flex gap-3.5 text-[15px] leading-relaxed text-white/90">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-white/70 to-white/30 shadow-[0_0_10px_rgba(255,255,255,0.45)]" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>

              {/* Четыре опоры — вертикальный трек (таймлайн), не сетка 2×2 */}
              <div className="mb-14 md:mb-16">
                <div className="mb-8 md:mb-12">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">{mentorshipT.sectionTitle}</h3>
                </div>

                <div className="relative p-0">
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_15%_20%,rgba(255,255,255,0.06),transparent)]"
                    aria-hidden
                  />
                  <ul className="relative grid grid-cols-1 gap-0 overflow-hidden rounded-2xl md:grid-cols-2">
                    {MENTORSHIP_FEATURE_ICONS.map((item, idx) => {
                      const { title, desc } = mentorshipT.features[idx];
                      const step = item.step;
                      return (
                        <li
                          key={step}
                          className="group relative flex h-full min-h-[180px] flex-col border border-white/10 bg-black/35 p-5 md:min-h-[200px] md:p-6"
                        >
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <span
                              className="font-mono text-2xl font-black leading-none tabular-nums tracking-[0.12em] text-white/30 md:text-3xl"
                            >
                              {step}
                            </span>
                            <div
                              className={`flex h-11 w-11 items-center justify-center rounded-xl border ring-4 ring-black/60 ${
                                item.step === '01'
                                  ? 'border-violet-400/40 bg-gradient-to-br from-violet-500/[0.2] via-fuchsia-500/[0.08] to-black/80 text-violet-100'
                                  : item.step === '02'
                                    ? 'border-teal-400/40 bg-gradient-to-br from-teal-500/[0.18] via-cyan-500/[0.1] to-black/80 text-teal-50'
                                    : item.step === '03'
                                      ? 'border-sky-400/40 bg-gradient-to-br from-sky-500/[0.18] via-blue-500/[0.08] to-black/80 text-sky-50'
                                      : 'border-emerald-400/40 bg-gradient-to-br from-emerald-500/[0.18] via-green-500/[0.08] to-black/80 text-emerald-50'
                              }`}
                            >
                              <item.CustomIcon className="h-7 w-7" />
                            </div>
                          </div>
                          <p className="inline-flex w-fit items-center rounded-lg border border-white/20 bg-white/[0.08] px-2.5 py-1 text-lg font-extrabold tracking-tight text-white shadow-[0_0_18px_rgba(255,255,255,0.08)] md:text-xl">
                            {title}
                          </p>
                          <p className="mt-3 text-[13px] leading-relaxed text-white/52 md:text-[15px] md:leading-relaxed">
                            {desc}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* CTA strip */}
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-black/60 via-black/40 to-black/60 p-6 md:p-10">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-400/80 via-white/40 to-indigo-500/80 opacity-80" aria-hidden />
                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between pl-3 md:pl-5">
                  <div>
                    <p
                      className={`text-[11px] font-semibold tracking-[0.22em] text-white/45 mb-2 ${
                        mentorshipIsRu ? '' : 'uppercase'
                      }`}
                    >
                      {mentorshipT.ctaEyebrow}
                    </p>
                    <p className="text-lg md:text-xl font-bold text-white tracking-tight">{mentorshipT.ctaTitle}</p>
                    <p className="mt-2 max-w-md text-sm text-white/55">{mentorshipT.ctaBody}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
                    <a
                      href={MENTORSHIP_TELEGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-2xl text-[11px] font-bold tracking-[0.2em] hover:bg-white/92 transition-all shadow-[0_12px_48px_rgba(0,0,0,0.55)] hover:shadow-[0_16px_56px_rgba(255,255,255,0.12)] ${
                        mentorshipIsRu ? '' : 'uppercase'
                      }`}
                    >
                      <Send size={16} />
                      {mentorshipT.ctaButton}
                    </a>
                    <p
                      className={`text-[10px] font-medium text-white/40 max-w-[14rem] leading-relaxed ${
                        mentorshipIsRu ? '' : 'uppercase tracking-widest'
                      }`}
                    >
                      {mentorshipT.ctaNote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'performance' && (
        <div className="fixed inset-0 z-[200] isolate overflow-y-auto">
          <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
            <PerformanceAmbientBackground />
          </div>
          <div
            className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/35 via-black/15 to-black/55"
            aria-hidden
          />
          <div className="relative z-10 min-h-full p-4 md:p-24">
            <div className="max-w-7xl mx-auto">
             <button 
               onClick={() => setViewMode('main')}
               className="inline-flex items-center gap-2 md:gap-3 text-white/50 hover:text-white transition-all mb-8 md:mb-16 group relative z-50 py-2 pr-4"
             >
               <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform md:w-[18px]" />
               <span className="font-mono tracking-widest text-[8px] md:text-[10px]">BACK TO TERMINAL</span>
             </button>
             
             <div className="relative w-full h-[60px] md:h-[160px] mb-8 md:mb-16 select-none pointer-events-none">
               <svg className="w-full h-full overflow-visible">
                 {/* Background faint outline */}
                 <text x="0" y="50%" dominantBaseline="central" textAnchor="start" 
                       className="text-5xl md:text-[10rem] font-black tracking-tighter uppercase"
                       fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth="1"
                       style={{ fontFamily: 'Inter, sans-serif' }}>
                   {"PERFORMANCE".split('').map((char, i) => (
                     <tspan key={`bg-${i}`}>{char}</tspan>
                   ))}
                 </text>

                 {/* Animated glowing outline per letter */}
                 <text x="0" y="50%" dominantBaseline="central" textAnchor="start" 
                       className={`text-5xl md:text-[10rem] font-black tracking-tighter uppercase transition-opacity duration-[3000ms] ${performanceAnimReady ? 'opacity-100' : 'opacity-0'}`}
                       fill="transparent" stroke="rgba(255,255,255,0.9)" strokeWidth="2"
                       style={{ fontFamily: 'Inter, sans-serif' }}>
                   {"PERFORMANCE".split('').map((char, i) => (
                     <tspan key={`fg-${i}`} className="trace-letter" style={{ animationDelay: `${-10 + i * 0.8}s` }}>
                       {char}
                     </tspan>
                   ))}
                 </text>
               </svg>
             </div>
             
             <div className="w-full h-[400px] md:h-[600px] bg-black/40 rounded-xl md:rounded-[2rem] border border-white/10 p-4 md:p-8 relative overflow-hidden flex flex-col group/chart outline-none focus:outline-none">
                {/* Decorative Tech Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-t border-l border-white/30 rounded-tl-xl md:rounded-tl-[2rem] opacity-30 group-hover/chart:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 border-t border-r border-white/30 rounded-tr-xl md:rounded-tr-[2rem] opacity-30 group-hover/chart:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-8 h-8 md:w-12 md:h-12 border-b border-l border-white/30 rounded-bl-xl md:rounded-bl-[2rem] opacity-30 group-hover/chart:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-8 h-8 md:w-12 md:h-12 border-b border-r border-white/30 rounded-br-xl md:rounded-br-[2rem] opacity-30 group-hover/chart:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <div className="flex justify-between items-center mb-6 md:mb-10 relative z-10">
                  <div>
                    <h3 className="text-xl md:text-3xl font-black tracking-tighter text-white flex items-center gap-3">
                      Cumulative Return
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                    </h3>
                    <p className="text-[11px] md:text-[13px] font-mono text-white/60 uppercase tracking-widest mt-1 md:mt-2">Live Trading Data</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-2 md:gap-3">
                      <p className="text-2xl md:text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">+12.25%</p>
                      <span className="bg-white/10 text-white/80 text-[8px] md:text-[10px] font-mono px-2 py-1 rounded-md uppercase tracking-wider border border-white/10">1Y</span>
                    </div>
                    <p className="text-[11px] md:text-[13px] font-mono text-white/60 uppercase tracking-widest mt-1 md:mt-2">Total Growth (Last Year)</p>
                  </div>
                </div>

                <div className="w-full flex-1 min-h-0 relative z-10">
                  <ResponsiveContainer width="100%" height="100%" className="outline-none focus:outline-none">
                    <AreaChart data={performanceWithDrawdown} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} style={{ outline: 'none', border: 'none' }} accessibilityLayer={false} tabIndex={-1}>
                      <defs>
                        <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4}/>
                          <stop offset="50%" stopColor="#ffffff" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ff4444" stopOpacity={0.2}/>
                          <stop offset="100%" stopColor="#ff4444" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="rgba(255,255,255,0.1)" 
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={20}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.1)" 
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                        isAnimationActive={false}
                      />
                      <ReferenceLine y={maxProfit} stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" label={{ position: 'top', value: `MAX PROFIT: +${Number(maxProfit).toFixed(2)}%`, fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace', dy: -12 }} />
                      
                      {maxDrawdownPoint && (
                        <ReferenceLine 
                          y={maxDrawdownPoint.value} 
                          stroke="rgba(255,68,68,0.3)" 
                          strokeDasharray="3 3" 
                          label={{ 
                            position: 'bottom', 
                            value: `MAX DRAWDOWN: ${Number(maxDrawdown).toFixed(2)}%`, 
                            fill: 'rgba(255,68,68,0.6)', 
                            fontSize: 9, 
                            fontFamily: 'monospace', 
                            dy: 12 
                          }} 
                        />
                      )}

                      {/* Drawdown Area Layer */}
                      <Area
                        type="monotone"
                        dataKey="drawdownRange"
                        stroke="none"
                        fill="url(#colorDrawdown)"
                        isAnimationActive={true}
                        animationDuration={1500}
                      />

                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#ffffff" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorReturn)" 
                        activeDot={{ r: 5, fill: '#fff', strokeWidth: 2, stroke: 'rgba(255,255,255,0.5)' }}
                        style={{ outline: 'none', border: 'none' }}
                        animationDuration={1000}
                        animationEasing="ease-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>

             {/* Monthly Performance Chart */}
             <div className="w-full h-[400px] md:h-[500px] bg-black/40 rounded-xl md:rounded-[2rem] border border-white/10 p-4 md:p-8 relative overflow-hidden flex flex-col group/chart mt-8 md:mt-16 outline-none focus:outline-none">
                {/* Decorative Tech Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-t border-l border-white/30 rounded-tl-xl md:rounded-tl-[2rem] opacity-30 group-hover/chart:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 border-t border-r border-white/30 rounded-tr-xl md:rounded-tr-[2rem] opacity-30 group-hover/chart:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-8 h-8 md:w-12 md:h-12 border-b border-l border-white/30 rounded-bl-xl md:rounded-bl-[2rem] opacity-30 group-hover/chart:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-8 h-8 md:w-12 md:h-12 border-b border-r border-white/30 rounded-br-xl md:rounded-br-[2rem] opacity-30 group-hover/chart:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <div className="flex justify-between items-center mb-6 md:mb-10 relative z-10">
                  <div>
                    <h3 className="text-xl md:text-3xl font-black tracking-tighter text-white flex items-center gap-3">
                      Monthly Performance
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                    </h3>
                    <p className="text-[11px] md:text-[13px] font-mono text-white/60 uppercase tracking-widest mt-1 md:mt-2">Profit/Loss by Month</p>
                  </div>
                </div>

                <div className="w-full flex-1 min-h-0 relative z-10">
                  <ResponsiveContainer width="100%" height="100%" className="outline-none focus:outline-none">
                    <BarChart data={filteredMonthlyData} margin={{ top: 40, right: 0, left: -20, bottom: 20 }} style={{ outline: 'none', border: 'none' }} accessibilityLayer={false} tabIndex={-1}>
                      <defs>
                        <linearGradient id="barPositive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#ffffff" stopOpacity={0.2}/>
                        </linearGradient>
                        <linearGradient id="barNegative" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.1}/>
                          <stop offset="100%" stopColor="#ffffff" stopOpacity={0.4}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="rgba(255,255,255,0.1)" 
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold' }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.1)" 
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'monospace' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        content={({ active, payload, label }: any) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-black/95 backdrop-blur-2xl border border-white/20 p-4 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] min-w-[160px] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                <div className="flex justify-between items-start mb-3">
                                  <p className="text-[11px] font-mono text-white/60 uppercase tracking-[0.2em]">{label}</p>
                                  {data.hasData && (
                                    <span className="text-[10px] font-mono text-white/50 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                                      {data.trades} trades
                                    </span>
                                  )}
                                </div>
                                {data.hasData ? (
                                  <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${data.value >= 0 ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/30'}`} />
                                    <p className="text-xl font-black text-white tracking-tighter">
                                      {data.value >= 0 ? '+' : ''}{Number(data.value).toFixed(2)}%
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest italic">Data pending</p>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                      <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={window.innerWidth < 768 ? 40 : 80}>
                        {filteredMonthlyData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={!entry.hasData ? 'transparent' : (entry.value >= 0 ? 'url(#barPositive)' : 'url(#barNegative)')}
                            className="transition-all duration-300 hover:brightness-150 cursor-crosshair"
                            stroke={entry.hasData ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}
                            strokeWidth={1}
                            strokeDasharray={!entry.hasData ? '3 3' : '0'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 md:mt-6 px-2">
                  <p className="text-[8px] md:text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] italic">
                    * Monthly returns are independent. A negative month does not mean overall loss — see Cumulative Return above.
                  </p>
                </div>
             </div>

             {/* Trading Statistics Section */}
             <div className="mt-8 md:mt-16 mb-20">
                <div className="flex items-center gap-4 mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase">Trading Statistics</h2>
                  <div className="h-[1px] flex-1 bg-white/10" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {TRADING_DETAILED_STATS.map((stat, idx) => {
                    let valueColor = 'text-white';
                    if (stat.type === 'winrate') {
                      const winRate = parseFloat(stat.value);
                      valueColor = winRate >= 50 ? 'text-white' : 'text-white/60'; // Defaulting to white/60 if red is not specified, but user said red if < 50
                      // Actually, let's follow the user's color request exactly
                      valueColor = winRate >= 50 ? 'text-[#ffffff]' : 'text-[#facc15]'; 
                      // Wait, user said "зелёный цвет если >50%, красный если <50%"
                      // But the design is mostly white/black. Let's use a subtle green/red or just follow the prompt.
                      // Prompt: "зелёный цвет если >50%, красный если <50%"
                      valueColor = winRate >= 50 ? 'text-[#4ade80]' : 'text-[#facc15]';
                    } else if (stat.type === 'positive') {
                      valueColor = 'text-[#4ade80]';
                    } else if (stat.type === 'negative') {
                      valueColor = 'text-[#facc15]';
                    }

                    return (
                      <div 
                        key={idx} 
                        className="group relative p-5 md:p-8 bg-black/40 border border-white/10 rounded-xl md:rounded-[2rem] transition-all duration-500 hover:bg-white/5 hover:border-white/20 overflow-hidden"
                      >
                        {/* Decorative Corner */}
                        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/10 rounded-tr-xl md:rounded-tr-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10">
                          <p className="text-[9px] md:text-[11px] font-mono text-white/60 uppercase tracking-[0.3em] mb-2 md:mb-4">{stat.label}</p>
                          <p className={`text-xl md:text-3xl font-black tracking-tighter ${valueColor}`}>
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>

            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] opacity-60 text-[8px] md:text-[9px] font-mono tracking-[0.3em] md:tracking-[0.5em] pointer-events-none uppercase text-white/90">
        shou.trade // b02
      </div>
    </div>
  );
};

export default App;
