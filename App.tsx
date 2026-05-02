
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
import HeroHeadline from './components/HeroHeadline';
import AboutMe from './components/AboutMe';
import Roadmap from './components/Roadmap';
import MentorshipView from './components/MentorshipView';
import MentorshipAmbientBackground from './components/MentorshipAmbientBackground';
import MentorshipPersonalPathIcon from './components/MentorshipPersonalPathIcon';
import MentorshipSupportIcon from './components/MentorshipSupportIcon';
import MentorshipConferenceIcon from './components/MentorshipConferenceIcon';
import MentorshipFlexibleIcon from './components/MentorshipFlexibleIcon';
import PerformanceAmbientBackground from './components/PerformanceAmbientBackground';
import ArchiveAmbientBackground from './components/ArchiveAmbientBackground';
import InfiniteGridBackground from './components/InfiniteGridBackground';
import { 
  ChevronDown, 
  FolderCode, 
  ArrowLeft, 
  Volume,
  Volume1,
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
    resultTitle: string;
    resultLead: string;
    resultItems: string[];
    resultHighlight: string;
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
    resultTitle: 'What you get in the end',
    resultLead: 'After full training, you leave not with theory, but with a practical base for independent trading:',
    resultItems: [
      'Market understanding at an earning level',
      'A fully formed trading system',
      'Capital management skills',
      'A structured trading routine',
      'Skills for working with prop firms',
    ],
    resultHighlight: 'And most importantly, you build your own unique approach to trading.',
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
    resultTitle: 'Что вы получите на выходе',
    resultLead: 'После полного обучения вы выйдете не с теорией, а с практической базой для самостоятельной торговли:',
    resultItems: [
      'Понимание рынка на уровне заработка',
      'Полностью сформированную торговую систему',
      'Навыки по управлению капиталом',
      'Сформированную торговую рутину',
      'Навыки работы с проп-компаниями',
    ],
    resultHighlight: 'И самое главное - вы сформируете ваш личный, уникальный подход к трейдингу.',
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
  // Quiet default — first level of the cycle, very gentle on entry
  const [volume, setVolume] = useState(0.03);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [performanceAnimReady, setPerformanceAnimReady] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

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

  // Discrete volume levels, ascending from very-quiet to loud-ish
  const VOLUME_LEVELS = [0.03, 0.12, 0.35, 0.7] as const;

  const cycleVolume = () => {
    if (!hasInteracted) setHasInteracted(true);
    if (isMuted || volume <= 0) {
      // Was muted → first audible level
      setIsMuted(false);
      setVolume(VOLUME_LEVELS[0]);
      return;
    }
    const currentIdx = VOLUME_LEVELS.findIndex((l) => Math.abs(l - volume) < 0.005);
    if (currentIdx === -1 || currentIdx === VOLUME_LEVELS.length - 1) {
      // Custom volume or already at the loudest level → mute
      setIsMuted(true);
      return;
    }
    setVolume(VOLUME_LEVELS[currentIdx + 1]);
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

  // Hero → About me cinematic transition driven by scroll position.
  // Hero content tilts back / scales / fades as user scrolls past 0..vh.
  // About me header lifts in (translateY + scale) over the same range.
  useEffect(() => {
    if (viewMode !== 'main') return;
    const main = scrollContainerRef.current;
    if (!main) return;

    let scheduled = false;
    const update = () => {
      scheduled = false;
      const vh = window.innerHeight;
      const scrollTop = main.scrollTop;
      const progress = Math.max(0, Math.min(1, scrollTop / vh));
      const eased = progress * progress;

      const hero = heroContentRef.current;
      if (hero) {
        const ty = -eased * 60;
        const scale = 1 - eased * 0.14;
        const rotateX = eased * 16;
        const opacity = 1 - progress * 0.85;
        const blur = progress * 3;
        hero.style.transform = `translateY(${ty}px) scale(${scale}) perspective(900px) rotateX(${rotateX}deg)`;
        hero.style.opacity = String(opacity);
        hero.style.filter = blur > 0.05 ? `blur(${blur}px)` : 'none';
      }

    };

    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    };

    main.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      main.removeEventListener('scroll', onScroll);
    };
  }, [viewMode]);

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
      <header className="fixed top-0 left-0 w-full p-6 md:p-10 z-[300] flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-3 md:gap-4 pointer-events-auto">
          <button
            type="button"
            onClick={cycleVolume}
            className="group flex items-center gap-2.5 md:gap-3 pl-3 pr-3.5 md:pl-3.5 md:pr-4 py-2 md:py-2.5 bg-white/[0.04] hover:bg-white/[0.09] backdrop-blur-xl rounded-full border border-white/10 hover:border-white/25 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
            aria-label={isMuted || volume === 0 ? 'Volume muted, click to unmute' : `Volume level ${VOLUME_LEVELS.findIndex((l) => Math.abs(l - volume) < 0.005) + 1} of ${VOLUME_LEVELS.length}, click to cycle`}
            title="Click to change volume"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={14} className="text-white/40 group-hover:text-white/70 transition-colors md:w-4 md:h-4" />
            ) : volume < 0.08 ? (
              <Volume size={14} className="text-white md:w-4 md:h-4" />
            ) : volume < 0.25 ? (
              <Volume1 size={14} className="text-white md:w-4 md:h-4" />
            ) : (
              <Volume2 size={14} className="text-white md:w-4 md:h-4" />
            )}

            {/* Bar visualizer — ascending heights, lit white when level reached */}
            <span className="flex items-end gap-[3px] md:gap-1 h-4 md:h-[18px]" aria-hidden>
              {VOLUME_LEVELS.map((lvl, i) => {
                const isOn = !isMuted && volume >= lvl - 0.005;
                return (
                  <span
                    key={i}
                    className="w-[2.5px] md:w-[3px] rounded-full transition-all duration-300 ease-out"
                    style={{
                      height: `${5 + i * 3}px`,
                      background: isOn ? '#fff' : 'rgba(255,255,255,0.18)',
                      boxShadow: isOn ? '0 0 8px rgba(255,255,255,0.45)' : 'none',
                      transitionDelay: `${i * 40}ms`,
                    }}
                  />
                );
              })}
            </span>
          </button>
          
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
          <div
            ref={heroContentRef}
            className="flex flex-col items-center text-center gap-14 md:gap-24"
            style={{ transformOrigin: 'center top', willChange: 'transform, opacity, filter' }}
          >
            <Sparkles>
              <div
                className="relative group py-6 md:py-10 animate-fade-in-up"
                style={{ animationFillMode: 'both' }}
              >
                <HeroHeadline />
              </div>
            </Sparkles>

            <div className="flex flex-wrap justify-center gap-7 md:gap-10 max-w-5xl px-4">
              {SOCIAL_LINKS.map((link, idx) => (
                <MainSocialIcon key={idx} link={link} index={idx} />
              ))}
            </div>

          </div>

          <button
            type="button"
            onClick={() => handleNavigation('about')}
            aria-label={homeT.scrollToExperienceAria}
            className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30 hover:opacity-80 transition-opacity pointer-events-auto"
          >
             <ChevronDown size={24} className="md:w-[32px]" />
          </button>
        </Section>

        <AboutMe
          watermark={homeT.aboutMeWatermark}
          subtitle={homeT.aboutMeSubtitle}
          stats={homeT.stats}
        />

        <Roadmap
          watermark={homeT.roadmapWatermark}
          subtitle={homeT.roadmapSubtitle}
          soonBadge={homeT.roadmapSoonBadge}
          plans={homeT.roadmapPlans}
          icons={ROADMAP_ICONS}
        />

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
            <InfiniteGridBackground accent="yellow" />
          </div>
          <div
            className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/30 to-black/60"
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
        <MentorshipView
          copy={mentorshipT}
          features={MENTORSHIP_FEATURE_ICONS}
          locale={mentorshipLocale}
          isRu={mentorshipIsRu}
          onLocaleChange={setMentorshipLocale}
          onClose={() => setViewMode('main')}
          telegramUrl={MENTORSHIP_TELEGRAM_URL}
        />
      )}


      {viewMode === 'performance' && (
        <div className="fixed inset-0 z-[200] isolate overflow-y-auto">
          <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
            <InfiniteGridBackground accent="cyan" />
          </div>
          <div
            className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/30 to-black/60"
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
