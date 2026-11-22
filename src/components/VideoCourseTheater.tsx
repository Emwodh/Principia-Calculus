import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  ExternalLink,
  Maximize2,
  Minimize2,
  PlayCircle,
  RefreshCw,
} from 'lucide-react';
import type { ExternalResource, VideoLecture } from '../types/course';
import {
  estimateVideoDurationMinutes,
  formatDurationPair,
} from '../utils/courseProgress';

interface VideoCourseTheaterProps {
  moduleLabel: string;
  videos: VideoLecture[];
  externalResources: ExternalResource[];
  watchedVideoIds: string[];
  savedVideoId?: string;
  isTheaterMode: boolean;
  onSelectVideoId: (videoId: string) => void;
  onToggleTheaterMode: () => void;
  onToggleWatchedVideo: (videoId: string) => void;
  onProceedToTextbook: () => void;
}

function formatResourceKind(kind?: ExternalResource['resourceKind']): string | null {
  if (kind === 'theory') return 'Textbook Theory';
  if (kind === 'exercises') return 'Practice Exercises';
  if (kind === 'playlist') return 'Full Playlist';
  return null;
}

export function VideoCourseTheater({
  moduleLabel,
  videos,
  externalResources,
  watchedVideoIds,
  savedVideoId,
  isTheaterMode,
  onSelectVideoId,
  onToggleTheaterMode,
  onToggleWatchedVideo,
  onProceedToTextbook,
}: VideoCourseTheaterProps) {
  const stageRef = useRef<HTMLElement | null>(null);
  const watchedSet = useMemo(() => new Set(watchedVideoIds), [watchedVideoIds]);

  // Resume saved lecture, otherwise first unwatched lecture, otherwise first lecture
  const activeVideoId = useMemo(() => {
    if (savedVideoId && videos.some((v) => v.id === savedVideoId)) {
      return savedVideoId;
    }
    const firstUnwatched = videos.find((v) => !watchedSet.has(v.id));
    return firstUnwatched?.id ?? videos[0]?.id ?? '';
  }, [savedVideoId, videos, watchedSet]);

  const [embedFallbackOpen, setEmbedFallbackOpen] = useState(false);

  useEffect(() => {
    setEmbedFallbackOpen(false);
  }, [activeVideoId]);

  useEffect(() => {
    if (activeVideoId && activeVideoId !== savedVideoId) {
      onSelectVideoId(activeVideoId);
    }
  }, [activeVideoId, savedVideoId, onSelectVideoId]);

  const scrollPlayerIntoView = () => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.requestAnimationFrame(() => {
      stageRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  };

  const handlePickLecture = (videoId: string, shouldScroll = false) => {
    onSelectVideoId(videoId);
    if (shouldScroll) {
      scrollPlayerIntoView();
    }
  };

  const handleToggleTheater = () => {
    onToggleTheaterMode();
    scrollPlayerIntoView();
  };

  const activeIndex = Math.max(
    0,
    videos.findIndex((v) => v.id === activeVideoId)
  );
  const activeVideo = videos[activeIndex] ?? videos[0];

  const watchedInModule = videos.filter((v) => watchedSet.has(v.id)).length;

  if (!activeVideo) {
    return null;
  }

  const prevVideo = activeIndex > 0 ? videos[activeIndex - 1] : null;
  const nextVideo = activeIndex < videos.length - 1 ? videos[activeIndex + 1] : null;
  const isActiveWatched = watchedSet.has(activeVideo.id);
  const activeDuration = formatDurationPair(estimateVideoDurationMinutes(activeVideo));
  const embedUrl = `https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?rel=0`;
  const watchOnYoutubeUrl = `https://www.youtube.com/watch?v=${activeVideo.youtubeId}`;
  const playlistResource = externalResources.find((r) => r.resourceKind === 'playlist');
  const playlistUrl =
    playlistResource?.url ??
    (activeVideo.instructor === '3Blue1Brown'
      ? 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr'
      : activeVideo.lectureCode.startsWith('Precalculus Prep')
        ? 'https://www.youtube.com/playlist?list=PLDesaqWTN6ESsmwELdrzhcGiRhk5DjwLP'
        : activeVideo.lectureCode.startsWith('Calc 1')
          ? 'https://www.youtube.com/playlist?list=PLF797E961509B4EB5'
          : 'https://www.youtube.com/playlist?list=PLDesaqWTN6EQ2J4vgsN1HyBeRADEh4Cw-');

  const handleCompleteAndNext = () => {
    if (!isActiveWatched) {
      onToggleWatchedVideo(activeVideo.id);
    }
    if (nextVideo) {
      handlePickLecture(nextVideo.id, true);
    } else {
      onProceedToTextbook();
    }
  };

  return (
    <div className="space-y-6">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Loaded lecture {activeIndex + 1} of {videos.length}: {activeVideo.instructor},{' '}
        {activeVideo.title}.
      </div>
      {/* Full-Width Cinema Video Stage */}
      <section
        ref={stageRef}
        aria-label="Video lecture stage"
        className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl overflow-hidden scroll-mt-20"
      >
        {/* Large 16:9 Cinema Canvas (scales up to full width, capped cleanly at 74vh so controls remain visible) */}
        <div className="w-full bg-[#0B1120] flex justify-center">
          <div className="relative w-full aspect-video max-h-[74vh]">
            {!embedFallbackOpen ? (
              <iframe
                key={activeVideo.youtubeId}
                src={embedUrl}
                title={`${activeVideo.instructor}: ${activeVideo.title}`}
                onError={() => setEmbedFallbackOpen(true)}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div
                role="region"
                aria-label="Video embed fallback"
                className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-[#0F172A] text-[#F8FAFC] space-y-4"
              >
                <AlertTriangle className="w-8 h-8 text-[#FBBF24]" />
                <div className="space-y-1.5 max-w-lg">
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-white">
                    Embedded Player Unavailable
                  </h3>
                  <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                    YouTube embeds can be blocked by school/corporate firewalls, privacy
                    extensions, or offline mode. Open this lecture directly on YouTube or
                    browse the full course playlist instead.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <a
                    href={watchOnYoutubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg"
                  >
                    <span>Watch Directly on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#F8FAFC] bg-[#1E293B] hover:bg-[#334155] border border-[#475569] rounded-lg"
                  >
                    <span>Open Full Course Playlist</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setEmbedFallbackOpen(false)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#CBD5E1] hover:text-white border border-[#475569] rounded-lg cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Embed</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Transport & Lecture Info Panel */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569]">
                <span className="font-semibold text-[#1D4ED8]">
                  {activeVideo.instructor}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">{activeVideo.lectureCode}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">
                  Lecture {activeIndex + 1} of {videos.length}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-mono-tabular text-[#475569]">
                  <Clock className="w-3 h-3" />
                  <span>
                    {activeDuration.normal} ({activeDuration.fast15x})
                  </span>
                </span>
                {isActiveWatched && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[#059669]">Watched</span>
                  </>
                )}
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#0F172A] leading-snug">
                {activeVideo.title}
              </h2>
            </div>

            {/* Action & Transport Controls */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="inline-flex items-center rounded-lg border border-[#CBD5E1] overflow-hidden bg-[#F8FAFC]">
                <button
                  type="button"
                  disabled={!prevVideo}
                  onClick={() => prevVideo && handlePickLecture(prevVideo.id, false)}
                  aria-label="Previous lecture"
                  className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-[#334155] hover:bg-[#E2E8F0] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <span className="w-px h-5 bg-[#CBD5E1]" aria-hidden="true" />
                <button
                  type="button"
                  disabled={!nextVideo}
                  onClick={() => nextVideo && handlePickLecture(nextVideo.id, false)}
                  aria-label="Next lecture"
                  className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-[#334155] hover:bg-[#E2E8F0] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onToggleWatchedVideo(activeVideo.id)}
                aria-pressed={isActiveWatched}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border cursor-pointer whitespace-nowrap ${
                  isActiveWatched
                    ? 'bg-[#ECFDF5] border-[#059669] text-[#065F46]'
                    : 'bg-[#FFFFFF] border-[#CBD5E1] text-[#0F172A] hover:border-[#1D4ED8]'
                }`}
              >
                {isActiveWatched ? (
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                ) : (
                  <Circle className="w-4 h-4 text-[#94A3B8]" />
                )}
                <span>{isActiveWatched ? 'Watched' : 'Mark Lecture Watched'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleTheater}
                aria-pressed={isTheaterMode}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#334155] hover:text-[#0F172A] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg whitespace-nowrap cursor-pointer"
              >
                {isTheaterMode ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Default View</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Theater Mode</span>
                  </>
                )}
              </button>

              <a
                href={watchOnYoutubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#334155] hover:text-[#0F172A] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg whitespace-nowrap"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setEmbedFallbackOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-[#475569] hover:text-[#1D4ED8] bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#CBD5E1] rounded-lg whitespace-nowrap cursor-pointer"
              >
                <span>{embedFallbackOpen ? 'Show Player' : 'Video Not Loading?'}</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div>
              <div className="text-xs font-semibold text-[#0F172A] mb-1">
                What This Lecture Covers
              </div>
              <p className="text-sm text-[#475569] leading-relaxed">
                {activeVideo.focusSummary}
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#1D4ED8] mb-1">
                Active Viewing Strategy
              </div>
              <p className="text-sm text-[#475569] leading-relaxed">
                {activeVideo.watchStrategy}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Multi-Column Module Lecture Playlist Queue */}
      <section
        aria-label="Module lecture playlist"
        className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="font-display text-lg font-semibold text-[#0F172A]">
              {moduleLabel} Lecture Queue{' '}
              <span className="font-mono-tabular text-sm font-medium text-[#1D4ED8] ml-1.5">
                {watchedInModule}/{videos.length} watched
              </span>
            </h3>
            <p className="text-xs text-[#475569] mt-0.5">
              Select any lecture below to load it and jump straight to the cinema player.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {nextVideo && (
              <button
                type="button"
                onClick={handleCompleteAndNext}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#065F46] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-lg cursor-pointer whitespace-nowrap"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Watched &amp; Next Lecture</span>
              </button>
            )}
            <button
              type="button"
              onClick={onProceedToTextbook}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg cursor-pointer whitespace-nowrap"
            >
              <span>Read Full Textbook Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <ul
          className={`grid grid-cols-1 gap-3 ${
            videos.length === 2
              ? 'md:grid-cols-2'
              : videos.length === 4
                ? 'md:grid-cols-2 xl:grid-cols-4'
                : 'md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {videos.map((vid, idx) => {
            const isSelected = vid.id === activeVideo.id;
            const isWatched = watchedSet.has(vid.id);
            const dur = formatDurationPair(estimateVideoDurationMinutes(vid));
            return (
              <li key={vid.id}>
                <button
                  type="button"
                  onClick={() => handlePickLecture(vid.id, true)}
                  aria-current={isSelected ? 'true' : undefined}
                  className={`w-full h-full text-left p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#EFF6FF] border-[#1D4ED8]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#94A3B8] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isWatched ? (
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    ) : (
                      <PlayCircle
                        className={`w-4 h-4 ${
                          isSelected ? 'text-[#1D4ED8]' : 'text-[#475569]'
                        }`}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 text-[11px] text-[#475569] font-mono-tabular">
                      <span className="truncate">
                        0{idx + 1} · {vid.instructor}
                      </span>
                      <span className="shrink-0 text-[#475569]">{dur.normal}</span>
                    </div>
                    <div
                      className={`text-sm leading-snug ${
                        isSelected
                          ? 'font-semibold text-[#1E3A8A]'
                          : 'font-medium text-[#0F172A]'
                      }`}
                    >
                      {vid.title}
                    </div>
                    <div className="text-[11px] font-mono-tabular text-[#475569]">
                      {vid.lectureCode} · {dur.fast15x}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Curated Open-University Web Material for This Module */}
      <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#1D4ED8] shrink-0" />
            <h3 className="font-display text-lg font-semibold text-[#0F172A]">
              University Readings &amp; Problem Archives for {moduleLabel}
            </h3>
          </div>
          <span className="text-xs text-[#475569] hidden sm:inline">
            OpenStax theory · Paul&rsquo;s Notes exercises
          </span>
        </div>

        <div
          className={`grid grid-cols-1 gap-4 ${
            externalResources.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
          }`}
        >
          {externalResources.map((res) => {
            const kindLabel = formatResourceKind(res.resourceKind);
            return (
              <a
                key={res.title}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-[#F8FAFC] hover:bg-[#EFF6FF]/60 border border-[#E2E8F0] hover:border-[#93C5FD] transition-colors flex flex-col justify-between gap-2.5 group"
              >
                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-[#1D4ED8]">
                    {res.provider}
                    {kindLabel && (
                      <span className="text-[#475569]"> · {kindLabel}</span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-[#0F172A] group-hover:text-[#1D4ED8] leading-snug">
                    {res.title}
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {res.description}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] pt-1">
                  <span>Open Resource</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
