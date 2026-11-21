import { useCallback, useEffect, useMemo, useState } from 'react';
import { CoursePlanView } from './components/CoursePlanView';
import { DrillExamView } from './components/DrillExamView';
import { FormulaVaultView } from './components/FormulaVaultView';
import { StudyStudioView } from './components/StudyStudioView';
import { TopBar } from './components/TopBar';
import { ALL_MODULES } from './data/curriculum';
import type {
  ExamAttemptRecord,
  NavView,
  PaceId,
  StartingTrack,
  StudioTab,
  UserProgressState,
} from './types/course';
import {
  buildHashRoute,
  computeProgressSummary,
  createInitialProgress,
  formatModuleShortLabel,
  loadProgressFromStorage,
  parseHashRoute,
  saveProgressToStorage,
} from './utils/courseProgress';

const VALID_MODULE_IDS = new Set(ALL_MODULES.map((m) => m.id));

type PendingNavigationAction =
  | { type: 'view'; view: NavView }
  | { type: 'module'; moduleId: string; tab?: StudioTab };

export default function App() {
  const firstModuleId = ALL_MODULES[0].id;

  const initialRoute = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const parsed = parseHashRoute(window.location.hash, VALID_MODULE_IDS);
    if (parsed) return parsed;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      return { view: 'studio' as NavView };
    }
    return null;
  }, []);

  const [progress, setProgress] = useState<UserProgressState>(() => {
    const loaded = loadProgressFromStorage(firstModuleId);
    if (initialRoute?.moduleId) {
      return { ...loaded, activeModuleId: initialRoute.moduleId };
    }
    return loaded;
  });

  const [activeView, setActiveView] = useState<NavView>(
    () => initialRoute?.view ?? 'plan'
  );
  const [studioTab, setStudioTab] = useState<StudioTab>(
    () => initialRoute?.studioTab ?? 'videos'
  );
  const [isExamRunning, setIsExamRunning] = useState(false);
  const [pendingNav, setPendingNav] = useState<PendingNavigationAction | null>(null);

  // Persist user progress on every update
  useEffect(() => {
    saveProgressToStorage(progress);
  }, [progress]);

  // Sync active view / module / studio tab to URL hash for Back/Forward & Refresh support
  useEffect(() => {
    const targetHash = buildHashRoute(activeView, progress.activeModuleId, studioTab);
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }
  }, [activeView, progress.activeModuleId, studioTab]);

  // Handle browser Back / Forward hash changes
  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHashRoute(window.location.hash, VALID_MODULE_IDS);
      if (!parsed) return;
      setActiveView(parsed.view);
      if (parsed.moduleId) {
        setProgress((prev) =>
          prev.activeModuleId === parsed.moduleId
            ? prev
            : { ...prev, activeModuleId: parsed.moduleId! }
        );
      }
      if (parsed.studioTab) {
        setStudioTab(parsed.studioTab);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const summary = useMemo(
    () => computeProgressSummary(ALL_MODULES, progress),
    [progress]
  );

  const activeModule = useMemo(
    () => ALL_MODULES.find((m) => m.id === progress.activeModuleId) ?? ALL_MODULES[0],
    [progress.activeModuleId]
  );

  const commitNavigation = useCallback((action: PendingNavigationAction) => {
    setPendingNav(null);
    if (action.type === 'module') {
      setProgress((prev) => ({ ...prev, activeModuleId: action.moduleId }));
      setStudioTab(action.tab ?? 'videos');
      setActiveView('studio');
    } else {
      setActiveView(action.view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const requestNavigation = useCallback(
    (action: PendingNavigationAction) => {
      if (
        isExamRunning &&
        activeView === 'exam' &&
        (action.type === 'module' || action.view !== 'exam')
      ) {
        setPendingNav(action);
        return;
      }
      commitNavigation(action);
    },
    [isExamRunning, activeView, commitNavigation]
  );

  const handleSelectModule = useCallback(
    (moduleId: string) => {
      requestNavigation({ type: 'module', moduleId, tab: 'videos' });
    },
    [requestNavigation]
  );

  const handleNavigate = useCallback(
    (view: NavView) => {
      requestNavigation({ type: 'view', view });
    },
    [requestNavigation]
  );

  const handleToggleComplete = useCallback((moduleId: string) => {
    setProgress((prev) => {
      const exists = prev.completedModuleIds.includes(moduleId);
      return {
        ...prev,
        completedModuleIds: exists
          ? prev.completedModuleIds.filter((id) => id !== moduleId)
          : [...prev.completedModuleIds, moduleId],
      };
    });
  }, []);

  const handleToggleWatchedVideo = useCallback((videoId: string) => {
    setProgress((prev) => {
      const exists = prev.watchedVideoIds.includes(videoId);
      return {
        ...prev,
        watchedVideoIds: exists
          ? prev.watchedVideoIds.filter((id) => id !== videoId)
          : [...prev.watchedVideoIds, videoId],
      };
    });
  }, []);

  const handleSelectModuleVideo = useCallback((moduleId: string, videoId: string) => {
    setProgress((prev) => {
      if (prev.lastVideoByModule[moduleId] === videoId) return prev;
      return {
        ...prev,
        lastVideoByModule: {
          ...prev.lastVideoByModule,
          [moduleId]: videoId,
        },
      };
    });
  }, []);

  const handleRecordAnswer = useCallback(
    (problemId: string, selectedOptionId: string, isCorrect: boolean) => {
      setProgress((prev) => ({
        ...prev,
        solvedProblemIds: {
          ...prev.solvedProblemIds,
          [problemId]: { selectedOptionId, isCorrect },
        },
      }));
    },
    []
  );

  const handleClearAnswer = useCallback((problemId: string) => {
    setProgress((prev) => {
      const next = { ...prev.solvedProblemIds };
      delete next[problemId];
      return {
        ...prev,
        solvedProblemIds: next,
      };
    });
  }, []);

  const handleChangePace = useCallback((paceId: PaceId) => {
    setProgress((prev) => ({ ...prev, paceId }));
  }, []);

  const handleChangeStartingTrack = useCallback((startingTrack: StartingTrack) => {
    setProgress((prev) => ({ ...prev, startingTrack }));
  }, []);

  const handleChangeStartDate = useCallback((startDateIso: string) => {
    setProgress((prev) => ({ ...prev, startDateIso }));
  }, []);

  const handleSaveExamAttempt = useCallback((record: ExamAttemptRecord) => {
    setProgress((prev) => ({
      ...prev,
      examHistory: [record, ...prev.examHistory].slice(0, 20),
    }));
  }, []);

  const handleResetProgress = useCallback(() => {
    setProgress(createInitialProgress(firstModuleId));
  }, [firstModuleId]);

  const nextModForCta =
    ALL_MODULES.find((m) => m.id === summary.nextRecommendedModuleId) ?? ALL_MODULES[0];
  const primaryCtaLabel =
    summary.completedModules === 0
      ? `Start ${formatModuleShortLabel(nextModForCta)}`
      : `Resume ${formatModuleShortLabel(nextModForCta)}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <TopBar
        activeView={activeView}
        onNavigate={handleNavigate}
        primaryCtaLabel={primaryCtaLabel}
        onPrimaryCta={() => handleSelectModule(nextModForCta.id)}
      />

      {/* Active Timed Exam Leave Guard Banner */}
      {pendingNav && isExamRunning && activeView === 'exam' && (
        <div
          role="alert"
          className="bg-[#FEF2F2] border-b border-[#FECACA] px-4 sm:px-6 lg:px-8 py-3"
        >
          <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <span className="text-[#991B1B] font-medium">
              Timed exam in progress — leaving this page will discard your current
              answers and timer.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsExamRunning(false);
                  commitNavigation(pendingNav);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-md cursor-pointer"
              >
                Leave Exam
              </button>
              <button
                type="button"
                onClick={() => setPendingNav(null)}
                className="px-3 py-1.5 text-xs font-medium text-[#334155] bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-md cursor-pointer"
              >
                Stay in Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {activeView === 'plan' && (
        <CoursePlanView
          modules={ALL_MODULES}
          progress={progress}
          summary={summary}
          onSelectModule={handleSelectModule}
          onToggleComplete={handleToggleComplete}
          onChangePace={handleChangePace}
          onChangeStartingTrack={handleChangeStartingTrack}
          onChangeStartDate={handleChangeStartDate}
          onOpenExams={() => handleNavigate('exam')}
          onOpenFormulas={() => handleNavigate('formulas')}
          onResetProgress={handleResetProgress}
        />
      )}

      {activeView === 'studio' && (
        <StudyStudioView
          modules={ALL_MODULES}
          activeModule={activeModule}
          activeTab={studioTab}
          progress={progress}
          onSelectModule={handleSelectModule}
          onChangeTab={setStudioTab}
          onToggleComplete={handleToggleComplete}
          onToggleWatchedVideo={handleToggleWatchedVideo}
          onSelectModuleVideo={handleSelectModuleVideo}
          onRecordAnswer={handleRecordAnswer}
          onClearAnswer={handleClearAnswer}
          onBackToPlan={() => handleNavigate('plan')}
        />
      )}

      {activeView === 'exam' && (
        <DrillExamView
          examHistory={progress.examHistory}
          onSaveExamAttempt={handleSaveExamAttempt}
          onJumpToModule={handleSelectModule}
          onExamActiveChange={setIsExamRunning}
        />
      )}

      {activeView === 'formulas' && <FormulaVaultView />}
    </div>
  );
}
