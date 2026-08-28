import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import {
  Building2,
  ChevronDown,
  FolderCode,
  GraduationCap,
  MonitorPlay,
  TrendingUp,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { MAIN_SITE_COPY, MEDIA_CONFIG, SOCIAL_LINKS } from './constants';
import type { UiLocale } from './constants';
import { MENTORSHIP_COPY } from './mentorshipCopy';
import AboutMe from './components/AboutMe';
import CustomCursor from './components/CustomCursor';
import HeroHeadline from './components/HeroHeadline';
import MainSocialIcon from './components/MainSocialIcon';
import OverlayFallback from './components/OverlayFallback';
import Roadmap from './components/Roadmap';
import ScrollProgress from './components/ScrollProgress';
import Section from './components/Section';
import SelectedWork from './components/SelectedWork';
import SocialCard from './components/SocialCard';
import { useMediaQuery } from './hooks/useMediaQuery';

const loadProjectsView = () => import('./components/ProjectsView');
const loadPerformanceView = () => import('./components/PerformanceView');
const loadMentorshipView = () => import('./components/MentorshipView');

const ProjectsView = lazy(loadProjectsView);
const PerformanceView = lazy(loadPerformanceView);
const MentorshipView = lazy(loadMentorshipView);

const ROADMAP_ICONS = [MonitorPlay, Users, GraduationCap, Building2] as const;
const MENTORSHIP_TELEGRAM_URL = SOCIAL_LINKS.find((link) => link.name === 'Telegram')?.url ?? '#';

type ViewMode = 'main' | 'projects' | 'performance' | 'mentorship';
type HistoryMode = 'push' | 'replace' | 'none';
type PortfolioDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

const OVERLAY_VIEWS = new Set<ViewMode>(['projects', 'performance', 'mentorship']);

const viewFromHash = (): ViewMode => {
  const candidate = window.location.hash.slice(1) as ViewMode;
  return OVERLAY_VIEWS.has(candidate) ? candidate : 'main';
};

const initialView = (): ViewMode => {
  const hashView = viewFromHash();
  if (hashView !== 'main') return hashView;
  try {
    const saved = sessionStorage.getItem('viewMode') as ViewMode | null;
    return saved && OVERLAY_VIEWS.has(saved) ? saved : 'main';
  } catch {
    return 'main';
  }
};

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [mainSiteLocale, setMainSiteLocale] = useState<UiLocale>('en');
  const [mentorshipLocale, setMentorshipLocale] = useState<UiLocale>('en');
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [pendingView, setPendingView] = useState<Exclude<ViewMode, 'main'> | null>(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const hasFinePointer = useMediaQuery('(min-width: 768px) and (hover: hover) and (pointer: fine)');
  const scrollContainerRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);
  const navigationRequestRef = useRef(0);

  const transitionToView = useCallback(
    (nextView: ViewMode) => {
      const update = () => setViewMode(nextView);
      const documentWithTransitions = document as PortfolioDocument;
      if (!isMobile && !reducedMotion && documentWithTransitions.startViewTransition) {
        documentWithTransitions.startViewTransition(() => flushSync(update));
      } else {
        update();
      }
    },
    [isMobile, reducedMotion],
  );

  const navigateToView = useCallback(
    (nextView: ViewMode, historyMode: HistoryMode = 'push') => {
      if (historyMode !== 'none') {
        const nextUrl = `${window.location.pathname}${window.location.search}${nextView === 'main' ? '' : `#${nextView}`}`;
        if (historyMode === 'replace') history.replaceState({ view: nextView }, '', nextUrl);
        else history.pushState({ view: nextView }, '', nextUrl);
      }
      transitionToView(nextView);
    },
    [transitionToView],
  );

  const openView = (
    nextView: Exclude<ViewMode, 'main'>,
    loader: () => Promise<unknown>,
    trigger: HTMLButtonElement,
  ) => {
    if (viewMode === nextView || pendingView === nextView) return;
    const requestId = ++navigationRequestRef.current;
    lastTriggerRef.current = trigger;
    setPendingView(nextView);

    // Start loading the split chunk, but never block navigation on the network.
    // Suspense provides immediate visual feedback while a cold chunk arrives.
    void loader().then(
      () => {
        if (navigationRequestRef.current === requestId) setPendingView(null);
      },
      () => {
        if (navigationRequestRef.current !== requestId) return;
        setPendingView(null);
        navigateToView('main', 'replace');
      },
    );

    // Let the pressed state reach the compositor before mounting a heavier
    // overlay such as the performance charts on mobile.
    if (isMobile) {
      requestAnimationFrame(() => {
        if (navigationRequestRef.current === requestId) navigateToView(nextView);
      });
    } else navigateToView(nextView);
  };

  const closeView = useCallback(() => {
    navigationRequestRef.current += 1;
    setPendingView(null);
    navigateToView('main', 'replace');
    requestAnimationFrame(() => lastTriggerRef.current?.focus({ preventScroll: true }));
  }, [navigateToView]);

  useEffect(() => {
    const onPopState = () => transitionToView(viewFromHash());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [transitionToView]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && viewMode !== 'main') closeView();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeView, viewMode]);

  useEffect(() => {
    try {
      sessionStorage.setItem('viewMode', viewMode);
    } catch {
      // Storage can be disabled in private contexts.
    }
    if (viewMode !== 'main' && viewFromHash() === 'main') {
      history.replaceState({ view: viewMode }, '', `#${viewMode}`);
    }
  }, [viewMode]);

  useEffect(() => {
    document.documentElement.lang =
      viewMode === 'mentorship' ? mentorshipLocale : viewMode === 'main' ? mainSiteLocale : 'en';
  }, [mainSiteLocale, mentorshipLocale, viewMode]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let frame = 0;
    const save = () => {
      frame = 0;
      try {
        sessionStorage.setItem('mainScroll', String(container.scrollTop));
      } catch {
        // Ignore unavailable storage.
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(save);
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      container.removeEventListener('scroll', onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    if (viewMode !== 'main') return;
    const container = scrollContainerRef.current;
    if (!container) return;
    let target = 0;
    try {
      target = Number(sessionStorage.getItem('mainScroll') || 0);
    } catch {
      return;
    }
    if (!target) return;
    let attempts = 0;
    let frame = 0;
    const restore = () => {
      const maximum = container.scrollHeight - container.clientHeight;
      if (maximum >= target || attempts++ >= 60) {
        container.scrollTop = Math.min(target, Math.max(0, maximum));
        return;
      }
      frame = requestAnimationFrame(restore);
    };
    restore();
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [viewMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
    audio.volume = 0.05;
    const syncPlayback = () => {
      if (hasInteracted && !isMuted && !document.hidden) void audio.play().catch(() => undefined);
      else audio.pause();
    };
    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);
    return () => document.removeEventListener('visibilitychange', syncPlayback);
  }, [hasInteracted, isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const syncPlayback = () => {
      if (viewMode === 'main' && !reducedMotion && !isMobile && !document.hidden) void video.play().catch(() => undefined);
      else video.pause();
    };
    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);
    return () => document.removeEventListener('visibilitychange', syncPlayback);
  }, [isMobile, reducedMotion, viewMode]);

  useEffect(() => {
    if (!isMobile) return;
    const connection = (navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    }).connection;
    if (connection?.saveData || connection?.effectiveType?.includes('2g')) return;

    const preloadTimer = window.setTimeout(() => {
      void loadMentorshipView();
      void loadProjectsView();
      void loadPerformanceView();
    }, 800);
    return () => window.clearTimeout(preloadTimer);
  }, [isMobile]);

  useEffect(() => {
    if (viewMode !== 'main' || reducedMotion || isMobile) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, container.scrollTop / window.innerHeight));
      const eased = progress * progress;
      const hero = heroContentRef.current;
      if (!hero) return;
      hero.style.transform = `translateY(${-eased * 60}px) scale(${1 - eased * 0.14}) perspective(900px) rotateX(${eased * 16}deg)`;
      hero.style.opacity = String(1 - progress * 0.85);
      hero.style.filter = progress > 0.02 ? `blur(${progress * 3}px)` : 'none';
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      container.removeEventListener('scroll', onScroll);
    };
  }, [isMobile, reducedMotion, viewMode]);

  const handleNavigation = (id: string) => {
    if (viewMode !== 'main') navigateToView('main', 'replace');
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  };

  const toggleAudio = () => {
    if (!hasInteracted) setHasInteracted(true);
    setIsMuted((muted) => !muted);
  };

  const homeT = MAIN_SITE_COPY[mainSiteLocale];
  const mentorshipT = MENTORSHIP_COPY[mentorshipLocale];
  const isAudioPlaying = hasInteracted && !isMuted;
  const disableAmbientMotion = reducedMotion || isMobile;
  const navigationItems = [
    { view: 'mentorship', label: homeT.navMentorship, Icon: Users, loader: loadMentorshipView },
    { view: 'performance', label: homeT.navPerformance, Icon: TrendingUp, loader: loadPerformanceView },
    { view: 'projects', label: homeT.navArchive, Icon: FolderCode, loader: loadProjectsView },
  ] as const;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black font-sans text-white selection:bg-white/20 selection:text-white">
      {hasFinePointer && !reducedMotion && <CustomCursor />}
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[500] -translate-y-24 bg-white px-4 py-3 font-mono text-xs font-bold text-black transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${viewMode === 'main' ? '' : 'hidden'}`} aria-hidden>
        <video
          ref={videoRef}
          autoPlay={!disableAmbientMotion}
          loop
          muted
          playsInline
          preload={isMobile ? 'none' : 'metadata'}
          disablePictureInPicture
          className="h-full w-full object-cover opacity-40 grayscale"
        >
          <source src={MEDIA_CONFIG.videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.98)_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />
      </div>

      <audio ref={audioRef} src={MEDIA_CONFIG.audioUrl} loop preload="metadata" />

      <header className="mobile-safe-header pointer-events-none fixed left-0 top-0 z-[300] flex w-full items-start justify-between gap-4 px-4 pb-3 md:p-10">
        <div className="pointer-events-auto flex items-center gap-3 md:flex-col md:items-start md:gap-4">
          <button
            type="button"
            onClick={toggleAudio}
            className="group flex min-h-11 min-w-11 items-center justify-center gap-2.5 rounded-full border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-xl transition-colors hover:border-white/25 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:min-h-0 md:min-w-0 md:px-4 md:py-2.5"
            aria-label={isAudioPlaying ? 'Mute background audio' : 'Play background audio'}
            aria-pressed={isAudioPlaying}
          >
            {isAudioPlaying ? <Volume2 size={15} /> : <VolumeX size={15} className="text-white/45" />}
            <span className="flex h-4 items-end gap-[3px]" aria-hidden>
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className="w-[3px] rounded-full bg-white"
                  style={{
                    height: `${5 + index * 3}px`,
                    opacity: isAudioPlaying ? 1 : 0.25,
                    transformOrigin: 'bottom',
                    animation: isAudioPlaying && !reducedMotion
                      ? `equalizer-bar ${0.7 + index * 0.13}s ease-in-out ${index * 0.08}s infinite`
                      : 'none',
                  }}
                />
              ))}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleNavigation('personality')}
            aria-label={mainSiteLocale === 'ru' ? 'Вернуться на главную' : 'Back to home'}
            className="py-2 text-left font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-white/80 transition-colors active:text-white focus-visible:outline-none focus-visible:text-white md:py-0 md:text-[9px] md:tracking-[0.5em] md:hover:text-white"
          >
            danil.karagodin
          </button>
        </div>

        <div className="pointer-events-auto flex max-w-[75%] flex-wrap items-center justify-end gap-2 md:gap-3">
          {viewMode === 'main' && (
            <div className="flex rounded-full border border-white/15 bg-black/55 p-0.5 font-mono text-[9px] backdrop-blur-xl md:bg-black/35 md:text-[10px]" role="group" aria-label="Site language">
              {(['en', 'ru'] as const).map((locale) => (
                <button
                  key={locale}
                  type="button"
                  onClick={() => setMainSiteLocale(locale)}
                  aria-pressed={mainSiteLocale === locale}
                  className={`min-h-10 rounded-full px-2.5 py-1.5 uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 md:min-h-0 md:px-3 ${
                    mainSiteLocale === locale ? 'bg-white/15 text-white' : 'text-white/45 hover:text-white/85'
                  }`}
                >
                  {locale}
                </button>
              ))}
            </div>
          )}
          {navigationItems.map(({ view, label, Icon, loader }) => {
            const isPending = pendingView === view;
            return (
              <button
                key={view}
                type="button"
                onPointerEnter={() => void loader()}
                onFocus={() => void loader()}
                onClick={(event) => void openView(view, loader, event.currentTarget)}
                aria-pressed={viewMode === view}
                aria-busy={isPending}
                className="group hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 backdrop-blur-md transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:flex"
              >
                <Icon size={13} className={isPending && !reducedMotion ? 'animate-pulse' : undefined} /> {label}
              </button>
            );
          })}
        </div>
      </header>

      <nav
        className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-[350] grid grid-cols-3 border-t border-white/10 bg-black/[0.94] px-2 pt-2 md:hidden"
        aria-label={mainSiteLocale === 'ru' ? 'Основная навигация' : 'Primary navigation'}
      >
        {navigationItems.map(({ view, label, Icon, loader }) => {
          const isActive = viewMode === view;
          const isPending = pendingView === view;
          return (
            <button
              key={view}
              type="button"
              onPointerDown={() => void loader()}
              onFocus={() => void loader()}
              onClick={(event) => void openView(view, loader, event.currentTarget)}
              aria-current={isActive ? 'page' : undefined}
              aria-busy={isPending}
              className={`relative flex min-h-14 min-w-0 touch-manipulation select-none flex-col items-center justify-center gap-1 px-1 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60 ${
                isActive ? 'text-white' : 'text-white/[0.48] active:text-white/80'
              }`}
            >
              <span className={`absolute inset-x-3 top-0 h-px ${isActive || isPending ? 'bg-white/80' : 'bg-transparent'}`} aria-hidden />
              <Icon
                size={18}
                strokeWidth={isActive ? 2.2 : 1.7}
                className={isPending && !reducedMotion ? 'animate-pulse' : undefined}
              />
              <span className="max-w-full truncate text-[9px] font-bold uppercase tracking-[0.08em]">{label}</span>
            </button>
          );
        })}
      </nav>

      <main
        id="main-content"
        ref={scrollContainerRef}
        hidden={viewMode !== 'main'}
        className="scroll-container relative z-10 w-full pb-[calc(4.5rem+env(safe-area-inset-bottom))] no-scrollbar md:pb-0"
      >
        <Section id="personality">
          <div
            ref={heroContentRef}
            className="flex flex-col items-center gap-14 text-center md:gap-24"
            style={{ transformOrigin: 'center top', willChange: disableAmbientMotion ? 'auto' : 'transform, opacity, filter' }}
          >
            <div className="relative py-6 md:py-10"><HeroHeadline /></div>
            <div className="w-full max-w-4xl px-4">
              <nav aria-label="Social profiles" className="grid grid-cols-3 justify-items-center gap-x-6 gap-y-10 sm:grid-cols-6 sm:gap-x-8 md:gap-x-12">
                {SOCIAL_LINKS.map((link, index) => <MainSocialIcon key={link.name} link={link} index={index} />)}
              </nav>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleNavigation('about')}
            aria-label={homeT.scrollToExperienceAria}
            className="pointer-events-auto absolute bottom-24 left-1/2 -translate-x-1/2 opacity-35 transition-opacity active:opacity-80 focus-visible:opacity-100 focus-visible:outline-none md:bottom-10 md:animate-bounce md:hover:opacity-80"
          >
            <ChevronDown size={28} />
          </button>
        </Section>

        <AboutMe watermark={homeT.aboutMeWatermark} subtitle={homeT.aboutMeSubtitle} bio={homeT.aboutMeBio} stats={homeT.stats} />
        <SelectedWork watermark={homeT.buildWatermark} subtitle={homeT.buildSubtitle} lead={homeT.buildLead} projects={homeT.buildProjects} />
        <Roadmap
          watermark={homeT.roadmapWatermark}
          subtitle={homeT.roadmapSubtitle}
          plans={homeT.roadmapPlans}
          icons={ROADMAP_ICONS}
          parallelTitle={homeT.roadmapParallelTitle}
          parallelDescription={homeT.roadmapParallelDescription}
        />

        <Section id="connect">
          <div className="flex h-full w-full max-w-5xl flex-col justify-center text-center">
            <h2 className="mb-10 select-none text-5xl font-black uppercase tracking-tighter text-white opacity-[0.03] md:mb-20 md:text-[12rem]">{homeT.connectWatermark}</h2>
            <div className="relative z-10 grid grid-cols-1 gap-4 px-2 text-left md:grid-cols-2 md:gap-6">
              {SOCIAL_LINKS.slice(0, 4).map((link) => <SocialCard key={link.name} link={link} />)}
            </div>
            <p className="mt-12 px-4 text-center font-mono text-[9px] uppercase leading-relaxed tracking-[0.22em] text-white/55 md:mt-28 md:text-[11px] md:tracking-[0.28em]">
              © {homeT.footerDeveloped} <span className="text-white">shou</span> · {homeT.footerRights}
            </p>
          </div>
        </Section>
      </main>

      {viewMode === 'main' && <ScrollProgress containerRef={scrollContainerRef} active />}

      <Suspense fallback={<OverlayFallback />}>
        {viewMode === 'projects' && <ProjectsView copy={homeT} onClose={closeView} reducedMotion={disableAmbientMotion} />}
        {viewMode === 'mentorship' && (
          <MentorshipView
            copy={mentorshipT}
            locale={mentorshipLocale}
            isRu={mentorshipLocale === 'ru'}
            onLocaleChange={setMentorshipLocale}
            onClose={closeView}
            telegramUrl={MENTORSHIP_TELEGRAM_URL}
            reducedMotion={disableAmbientMotion}
          />
        )}
        {viewMode === 'performance' && <PerformanceView onClose={closeView} reducedMotion={disableAmbientMotion} />}
      </Suspense>
    </div>
  );
};

export default App;
