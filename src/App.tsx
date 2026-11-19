import { useEffect, useMemo, useState } from 'react';
import { CoursePlanView } from './components/CoursePlanView';
import { DrillExamView } from './components/DrillExamView';
import { FormulaVaultView } from './components/FormulaVaultView';
import { StudyStudioView } from './components/StudyStudioView';
import { TopBar } from './components/TopBar';
import { ALL_MODULES } from './data/curriculum';
import type { ExamAttemptRecord, NavView, PaceId, UserProgressState } from './types/course';
import {
  computeProgressSummary,
  createInitialProgress,
  loadProgressFromStorage,
  saveProgressToStorage,
} from './utils/courseProgress';

export default function App() {
  const firstModuleId = ALL_MODULES[0].id;
  const [activeView, setActiveView] = useState<NavView>('plan');
  const [progress, setProgress] = useState<UserProgressState>(() =>
    loadProgressFromStorage(firstModuleId)
  );

  // Persist user progress on every update
  useEffect(() => {
    saveProgressToStorage(progress);
  }, [progress]);

  // Support deep link ?autostart=1 to jump straight into Study Studio
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setActiveView('studio');
    }
  }, []);

  const summary = useMemo(
    () => computeProgressSummary(ALL_MODULES, progress),
    [progress]
  );

  const activeModule = useMemo(
    () => ALL_MODULES.find((m) => m.id === progress.activeModuleId) ?? ALL_MODULES[0],
    [progress.activeModuleId]
  );

  const handleSelectModule = (moduleId: string) => {
    setProgress((prev) => ({ ...prev, activeModuleId: moduleId }));
    setActiveView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleComplete = (moduleId: string) => {
    setProgress((prev) => {
      const exists = prev.completedModuleIds.includes(moduleId);
      return {
        ...prev,
        completedModuleIds: exists
          ? prev.completedModuleIds.filter((id) => id !== moduleId)
          : [...prev.completedModuleIds, moduleId],
      };
    });
  };

  const handleToggleWatchedVideo = (videoId: string) => {
    setProgress((prev) => {
      const exists = prev.watchedVideoIds.includes(videoId);
      return {
        ...prev,
        watchedVideoIds: exists
          ? prev.watchedVideoIds.filter((id) => id !== videoId)
          : [...prev.watchedVideoIds, videoId],
      };
    });
  };

  const handleRecordAnswer = (
    problemId: string,
    selectedOptionId: string,
    isCorrect: boolean
  ) => {
    setProgress((prev) => ({
      ...prev,
      solvedProblemIds: {
        ...prev.solvedProblemIds,
        [problemId]: { selectedOptionId, isCorrect },
      },
    }));
  };

  const handleChangePace = (paceId: PaceId) => {
    setProgress((prev) => ({ ...prev, paceId }));
  };

  const handleChangeStartDate = (startDateIso: string) => {
    setProgress((prev) => ({ ...prev, startDateIso }));
  };

  const handleSaveExamAttempt = (record: ExamAttemptRecord) => {
    setProgress((prev) => ({
      ...prev,
      examHistory: [record, ...prev.examHistory].slice(0, 20),
    }));
  };

  const handleResetProgress = () => {
    setProgress(createInitialProgress(firstModuleId));
  };

  const handleNavigate = (view: NavView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextModForCta =
    ALL_MODULES.find((m) => m.id === summary.nextRecommendedModuleId) ?? ALL_MODULES[0];
  const primaryCtaLabel =
    summary.completedModules === 0
      ? 'Start Day 1'
      : `Resume Day ${nextModForCta.dayNumber}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <TopBar
        activeView={activeView}
        onNavigate={handleNavigate}
        primaryCtaLabel={primaryCtaLabel}
        onPrimaryCta={() => handleSelectModule(nextModForCta.id)}
      />

      {activeView === 'plan' && (
        <CoursePlanView
          modules={ALL_MODULES}
          progress={progress}
          summary={summary}
          onSelectModule={handleSelectModule}
          onToggleComplete={handleToggleComplete}
          onChangePace={handleChangePace}
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
          progress={progress}
          onSelectModule={handleSelectModule}
          onToggleComplete={handleToggleComplete}
          onToggleWatchedVideo={handleToggleWatchedVideo}
          onRecordAnswer={handleRecordAnswer}
          onBackToPlan={() => handleNavigate('plan')}
        />
      )}

      {activeView === 'exam' && (
        <DrillExamView
          examHistory={progress.examHistory}
          onSaveExamAttempt={handleSaveExamAttempt}
          onJumpToModule={handleSelectModule}
        />
      )}

      {activeView === 'formulas' && <FormulaVaultView />}
    </div>
  );
}
