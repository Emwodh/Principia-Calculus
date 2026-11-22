import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Circle,
  Download,
  RotateCcw,
  Search,
  Upload,
} from 'lucide-react';
import { MODULE_MEDIA_MAP, TOTAL_COURSE_VIDEOS } from '../data/moduleMediaAndNotes';
import type {
  CourseModule,
  PaceId,
  StartingTrack,
  UserProgressState,
} from '../types/course';
import {
  PACE_CONFIGS,
  STARTING_TRACK_CONFIGS,
  formatCourseTrackName,
  formatModuleNumberPrefix,
  formatModuleShortLabel,
  formatShortDate,
  getModuleScheduleSlot,
  getModulesForStartingTrack,
  parseProgressImport,
  serializeProgressExport,
  type ProgressSummary,
} from '../utils/courseProgress';
import { MathTex } from './MathTex';

interface CoursePlanViewProps {
  modules: CourseModule[];
  progress: UserProgressState;
  summary: ProgressSummary;
  onSelectModule: (moduleId: string) => void;
  onToggleComplete: (moduleId: string) => void;
  onChangePace: (paceId: PaceId) => void;
  onChangeStartingTrack: (track: StartingTrack) => void;
  onChangeStartDate: (isoDate: string) => void;
  onOpenExams: () => void;
  onOpenFormulas: () => void;
  onOpenAbout: () => void;
  onImportProgress: (imported: UserProgressState) => void;
  onResetProgress: () => void;
}

type FilterTrack = 'all' | 'precalc' | 'calc1' | 'calc2' | 'remaining';

const HERO_IMAGE_PATH = '/src/assets/images/hero_calculus_plate_1795077044472.jpg';

const RAPID_PROTOCOL_STEPS = [
  {
    index: '01',
    title: 'Professor Leonard Video & Textbook',
    duration: '35–50 min',
    description:
      'Watch the embedded Professor Leonard university lectures at 1.5x (pausing before board solutions), then read the full chapter notes and open-access references.',
  },
  {
    index: '02',
    title: 'Interactive Lab & Derivations',
    duration: '25–35 min',
    description:
      'Manipulate sliders in the geometric lab until h → 0, Riemann sums, or Taylor degree n feels obvious. Step through worked examples line by line before revealing.',
  },
  {
    index: '03',
    title: 'Graded Recall & Practice Assessment',
    duration: '30–40 min',
    description:
      'Solve all 3 mastery problems cold without checking hints. Finish each phase with a Practice Exam and Formula Vault recall pass to build durable understanding.',
  },
];

export function CoursePlanView({
  modules,
  progress,
  summary,
  onSelectModule,
  onToggleComplete,
  onChangePace,
  onChangeStartingTrack,
  onChangeStartDate,
  onOpenExams,
  onOpenFormulas,
  onOpenAbout,
  onImportProgress,
  onResetProgress,
}: CoursePlanViewProps) {
  const [trackFilter, setTrackFilter] = useState<FilterTrack>('all');
  const [syllabusQuery, setSyllabusQuery] = useState('');
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [transferNotice, setTransferNotice] = useState<{
    kind: 'success' | 'error';
    message: string;
  } | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const handleExportProgress = () => {
    try {
      const json = serializeProgressExport(progress);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `calculus-progress-${progress.startDateIso}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setTransferNotice({
        kind: 'success',
        message: 'Progress exported as JSON backup.',
      });
    } catch {
      setTransferNotice({
        kind: 'error',
        message: 'Could not export progress in this browser environment.',
      });
    }
  };

  const handleImportFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const parsed = parseProgressImport(text, modules[0].id);
      if (!parsed.ok) {
        setTransferNotice({ kind: 'error', message: parsed.error });
        return;
      }
      onImportProgress(parsed.state);
      setTransferNotice({
        kind: 'success',
        message: `Imported backup (${parsed.state.completedModuleIds.length} modules completed, ${parsed.state.watchedVideoIds.length} lectures watched).`,
      });
    };
    reader.onerror = () => {
      setTransferNotice({
        kind: 'error',
        message: 'Could not read the selected file.',
      });
    };
    reader.readAsText(file);
  };

  const completedSet = useMemo(
    () => new Set(progress.completedModuleIds),
    [progress.completedModuleIds]
  );

  const watchedSet = useMemo(
    () => new Set(progress.watchedVideoIds),
    [progress.watchedVideoIds]
  );

  const activePace = PACE_CONFIGS[progress.paceId];
  const activeStartingTrack = STARTING_TRACK_CONFIGS[progress.startingTrack];

  // Build 1-based schedule position map for modules in the active starting track
  const trackScheduleIndexById = useMemo(() => {
    const activeMods = getModulesForStartingTrack(modules, progress.startingTrack);
    const map = new Map<string, number>();
    activeMods.forEach((m, idx) => map.set(m.id, idx + 1));
    return map;
  }, [modules, progress.startingTrack]);

  const filteredModules = useMemo(() => {
    const q = syllabusQuery.trim().toLowerCase();
    return modules.filter((mod) => {
      if (trackFilter === 'precalc' && mod.course !== 'precalc') return false;
      if (trackFilter === 'calc1' && mod.course !== 'calc1') return false;
      if (trackFilter === 'calc2' && mod.course !== 'calc2') return false;
      if (trackFilter === 'remaining' && completedSet.has(mod.id)) return false;
      if (!q) return true;
      return (
        mod.title.toLowerCase().includes(q) ||
        mod.subtitle.toLowerCase().includes(q) ||
        mod.phase.toLowerCase().includes(q) ||
        mod.keyTopics.some((t) => t.toLowerCase().includes(q)) ||
        formatModuleShortLabel(mod).toLowerCase().includes(q)
      );
    });
  }, [modules, trackFilter, syllabusQuery, completedSet]);

  const nextModule =
    modules.find((m) => m.id === summary.nextRecommendedModuleId) ?? modules[0];
  const nextModuleLabel = formatModuleShortLabel(nextModule);
  const shortNextTitle = nextModule.title.split(',')[0].split('&')[0].trim();

  const remainingHours = (summary.remainingMinutes / 60).toFixed(1);

  return (
    <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
      {/* Section 1: Balanced 2-Column Editorial Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 sm:p-8 lg:p-10">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#475569]">
              <span>Precalculus Prep → Calc I &amp; II</span>
              <span aria-hidden="true">·</span>
              <span>{TOTAL_COURSE_VIDEOS} Embedded Video Lectures</span>
              <span aria-hidden="true">·</span>
              <span>Full Textbooks &amp; Labs</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.12] font-semibold tracking-tight text-[#0F172A] text-balance">
              Structured Self-Study for Precalculus Prep &amp; University Calculus I–II
            </h1>

            <p className="text-base text-[#475569] leading-relaxed max-w-[62ch]">
              Choose your starting level below—refresh Precalculus Prep &amp; Trig (Prep 1–6)
              or jump straight into Calculus I &amp; II (Days 1–14)—with{' '}
              {TOTAL_COURSE_VIDEOS} embedded Professor Leonard &amp; 3Blue1Brown lectures,
              OpenStax chapters, interactive labs, and timed university exams.
            </p>
          </div>

          <div className="pt-8 mt-6 border-t border-[#E2E8F0] space-y-4">
            {/* Quick Starting-Level Switcher right above CTA */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-[#475569] mr-1">
                My Path:
              </span>
              {(Object.keys(STARTING_TRACK_CONFIGS) as StartingTrack[]).map((tid) => {
                const cfg = STARTING_TRACK_CONFIGS[tid];
                const isSelected = progress.startingTrack === tid;
                return (
                  <button
                    key={tid}
                    type="button"
                    onClick={() => onChangeStartingTrack(tid)}
                    aria-pressed={isSelected}
                    className={`px-3 py-1 text-xs font-medium rounded-md border cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F172A] text-white border-[#0F172A] font-semibold'
                        : 'bg-[#F8FAFC] text-[#475569] border-[#CBD5E1] hover:border-[#64748B]'
                    }`}
                  >
                    {cfg.shortLabel}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onSelectModule(nextModule.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>
                  {summary.completedModules === 0
                    ? `Start ${nextModuleLabel}: ${shortNextTitle}`
                    : `Continue ${nextModuleLabel}: ${shortNextTitle}`}
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <button
                type="button"
                onClick={onOpenExams}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-[#0F172A] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Take Diagnostic Exam
              </button>

              <button
                type="button"
                onClick={onOpenFormulas}
                className="text-sm font-medium text-[#1D4ED8] hover:text-[#1E40AF] underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer px-1 py-2"
              >
                Open Formula Vault
              </button>
            </div>
          </div>
        </div>

        {/* Right Architectural Drafting Plate */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl overflow-hidden flex flex-col">
          <div className="relative flex-1 min-h-[240px] lg:min-h-0 bg-[#F1F5F9]">
            {!heroImgFailed ? (
              <img
                src={HERO_IMAGE_PATH}
                alt="Architectural mathematical drafting plate illustrating a solid of revolution and spline tangent curves"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#F1F5F9]">
                <MathTex
                  tex="\int_{a}^{b} f'(x)\,dx = f(b) - f(a)"
                  display
                  className="text-[#1D4ED8] text-xl"
                />
                <p className="text-sm text-[#475569] mt-2">
                  Fundamental Theorem &amp; Infinite Series Studio
                </p>
              </div>
            )}
          </div>
          <div className="px-5 py-3.5 bg-[#FFFFFF] border-t border-[#E2E8F0] flex items-center justify-between gap-4 text-xs text-[#475569]">
            <span className="font-medium text-[#0F172A]">
              From Limits to Power Series
            </span>
            <MathTex tex="\lim_{n\to\infty}\sum_{k=1}^{n} f(x_k)\Delta x" />
          </div>
        </div>
      </section>

      {/* Section 2: Full-Width 4-Column Course Metrics Strip (Mathematically Reconciled to Active Path) */}
      <section
        aria-label="Course progress overview"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs font-medium text-[#475569]">
            Path Mastery ({activeStartingTrack.shortLabel})
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono-tabular text-2xl font-semibold text-[#0F172A]">
              {summary.completionPercent}%
            </span>
            <span className="text-xs text-[#475569] font-mono-tabular">
              {summary.completedModules}/{summary.totalModules} modules
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1D4ED8] rounded-full transition-all duration-200"
              style={{ width: `${summary.completionPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs font-medium text-[#475569]">Video Course Lectures</div>
          <div className="mt-2 flex items-baseline gap-2 font-mono-tabular">
            <span className="text-2xl font-semibold text-[#0F172A]">
              {summary.watchedVideoCount}
            </span>
            <span className="text-xs text-[#475569]">/ {TOTAL_COURSE_VIDEOS} watched</span>
          </div>
          <p className="mt-2.5 text-xs text-[#475569]">
            Professor Leonard &amp; 3Blue1Brown embedded
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs font-medium text-[#475569]">Graded Drills Solved</div>
          <div className="mt-2 flex items-baseline gap-2 font-mono-tabular">
            <span className="text-2xl font-semibold text-[#0F172A]">
              {summary.solvedCorrectCount}
            </span>
            <span className="text-xs text-[#475569]">/ {summary.totalProblems} in path</span>
          </div>
          <p className="mt-2.5 text-xs text-[#475569] font-mono-tabular">
            Prep {summary.precalcCompleted}/{summary.precalcTotal} · Calc I {summary.calc1Completed}/{summary.calc1Total} · Calc II {summary.calc2Completed}/{summary.calc2Total}
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5">
          <div className="text-xs font-medium text-[#475569]">Projected Finish</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono-tabular text-2xl font-semibold text-[#0F172A]">
              {formatShortDate(summary.projectedFinishDateIso)}
            </span>
            <span className="text-xs text-[#475569] font-mono-tabular">
              {summary.requiredHoursPerDay.toFixed(1)}h/day
            </span>
          </div>
          <p className="mt-2.5 text-xs text-[#475569] font-mono-tabular">
            {remainingHours} hrs across {summary.effectiveTotalDays} days
          </p>
        </div>
      </section>

      {/* Section 3: Study Pace Planner & 3-Pass Active Study Protocol */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-5">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#0F172A]">
              Study Pace Schedule
            </h2>
            <p className="mt-1 text-sm text-[#475569]">
              {activeStartingTrack.description}
            </p>
          </div>

          {/* Segmented Pace Selector */}
          <div
            role="group"
            aria-label="Select study pace"
            className="grid grid-cols-3 gap-1 p-1 bg-[#F1F5F9] rounded-lg"
          >
            {(Object.keys(PACE_CONFIGS) as PaceId[]).map((pid) => {
              const cfg = PACE_CONFIGS[pid];
              const isSelected = progress.paceId === pid;
              return (
                <button
                  key={pid}
                  type="button"
                  onClick={() => onChangePace(pid)}
                  aria-pressed={isSelected}
                  className={`px-2 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFFFFF] text-[#0F172A] shadow-xs font-semibold'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>

          <div className="text-sm text-[#334155] leading-relaxed">
            {activePace.summary}
          </div>

          {progress.paceId === 'cram7' && (
            <div
              role="note"
              className="p-3.5 rounded-lg bg-[#FFFBEB] border border-[#F59E0B]/60 flex items-start gap-2.5 text-xs text-[#92400E] leading-relaxed"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#B45309]" />
              <div>
                <strong className="font-semibold text-[#78350F]">
                  Review only: for people who already studied this material.
                </strong>{' '}
                Fast pacing builds familiarity, not mastery. If you are learning Calculus
                for the first time, stay on the 28-day Steady Mastery default.
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="course-start-date"
                className="block text-xs font-medium text-[#475569]"
              >
                Start Date
              </label>
              <input
                id="course-start-date"
                type="date"
                value={progress.startDateIso}
                onChange={(e) => {
                  if (e.target.value) onChangeStartDate(e.target.value);
                }}
                className="px-3 py-2 text-sm font-mono-tabular bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#0F172A]"
              />
            </div>

            <div className="text-right font-mono-tabular">
              <div className="text-xs text-[#475569]">Exact Commitment</div>
              <div className="text-lg font-semibold text-[#1D4ED8]">
                {summary.requiredHoursPerDay.toFixed(1)} hrs/day · {summary.effectiveTotalDays} days
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-5">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#0F172A]">
              The 3-Pass Active Study Protocol
            </h2>
            <p className="mt-1 text-sm text-[#475569]">
              Passive watching rarely sticks. Follow this active loop on every module to
              build deep intuition and reliable problem-solving habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
            {RAPID_PROTOCOL_STEPS.map((step) => (
              <div key={step.index} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#475569] font-mono-tabular border-b border-[#E2E8F0] pb-2">
                  <span className="font-semibold text-[#1D4ED8]">{step.index}.</span>
                  <span>{step.duration}</span>
                </div>
                <h3 className="text-sm font-semibold text-[#0F172A] pt-1">
                  {step.title}
                </h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Full 20-Module Curriculum Roadmap (Precalculus Prep + Calculus I & II) */}
      <section aria-labelledby="syllabus-heading" className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h2
              id="syllabus-heading"
              className="font-display text-2xl sm:text-3xl font-semibold text-[#0F172A]"
            >
              Complete {modules.length}-Module Curriculum Plan
            </h2>
            <p className="mt-1 text-sm text-[#475569]">
              Click any module to watch its embedded Professor Leonard lectures, read full
              OpenStax &amp; textbook notes, explore the interactive lab, and pass the
              mastery check.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Quick Topic Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <label htmlFor="syllabus-search" className="sr-only">
                Search modules or topics
              </label>
              <input
                id="syllabus-search"
                type="search"
                value={syllabusQuery}
                onChange={(e) => setSyllabusQuery(e.target.value)}
                placeholder="Jump to L'Hôpital, Taylor, Unit Circle..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg text-[#0F172A] placeholder:text-[#64748B]"
              />
            </div>

            {/* Interactive Track Filter */}
            <div
              role="group"
              aria-label="Filter curriculum modules"
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#E2E8F0]/70 rounded-lg self-start sm:self-auto"
            >
              {(
                [
                  { id: 'all', label: `All (${modules.length})` },
                  { id: 'precalc', label: `Precalculus Prep (${summary.precalcTotal})` },
                  { id: 'calc1', label: `Calculus I (${summary.calc1Total})` },
                  { id: 'calc2', label: `Calculus II (${summary.calc2Total})` },
                  { id: 'remaining', label: 'Remaining' },
                ] as { id: FilterTrack; label: string }[]
              ).map((tab) => {
                const active = trackFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTrackFilter(tab.id)}
                    aria-pressed={active}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#FFFFFF] text-[#0F172A] shadow-xs font-semibold'
                        : 'text-[#475569] hover:text-[#0F172A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Clean Unboxed Table-Like Editorial Syllabus List */}
        {filteredModules.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-10 text-center space-y-3">
            <p className="font-display text-lg font-semibold text-[#0F172A]">
              {syllabusQuery.trim()
                ? `No modules matching "${syllabusQuery.trim()}"`
                : `All ${modules.length} modules are marked complete`}
            </p>
            <p className="text-sm text-[#475569]">
              {syllabusQuery.trim()
                ? 'Try clearing your search or switching back to All modules.'
                : `Switch to "All (${modules.length})" to revisit any module, or test yourself under exam conditions in Drill Exam.`}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSyllabusQuery('');
                  setTrackFilter('all');
                }}
                className="px-4 py-2 text-sm font-medium text-[#0F172A] bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
              >
                Show All Modules
              </button>
              <button
                type="button"
                onClick={onOpenExams}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1D4ED8] rounded-lg hover:bg-[#1E40AF] cursor-pointer"
              >
                Launch Final Gauntlet
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl divide-y divide-[#E2E8F0] overflow-hidden">
            {filteredModules.map((mod, idx) => {
              const isCompleted = completedSet.has(mod.id);
              const isUpNext = !isCompleted && mod.id === summary.nextRecommendedModuleId;
              const prevMod = idx > 0 ? filteredModules[idx - 1] : null;
              const showSemesterBanner =
                trackFilter === 'all' &&
                !syllabusQuery.trim() &&
                (!prevMod || prevMod.course !== mod.course);

              const schedulePosition = trackScheduleIndexById.get(mod.id);
              const slot = schedulePosition
                ? getModuleScheduleSlot(
                    schedulePosition,
                    progress.paceId,
                    progress.startDateIso
                  )
                : null;

              const solvedInMod = mod.practiceProblems.filter(
                (p) => progress.solvedProblemIds[p.id]?.isCorrect
              ).length;
              const modVideos = MODULE_MEDIA_MAP[mod.id]?.videos ?? [];
              const watchedInMod = modVideos.filter((v) => watchedSet.has(v.id)).length;
              const modLabel = formatModuleShortLabel(mod);
              const modPrefix = formatModuleNumberPrefix(mod);

              const bannerTitle =
                mod.course === 'precalc'
                  ? 'Foundation Track · Precalculus Prep (P1–P6 · Optional Warmup)'
                  : mod.course === 'calc1'
                    ? 'Semester I · Calculus I Core (Days 1–5)'
                    : 'Semester II · Calculus II Integration, Series & Polar Geometry (Days 6–14)';

              const bannerProgress =
                mod.course === 'precalc'
                  ? `${summary.precalcCompleted}/${summary.precalcTotal} complete`
                  : mod.course === 'calc1'
                    ? `${summary.calc1Completed}/${summary.calc1Total} complete`
                    : `${summary.calc2Completed}/${summary.calc2Total} complete`;

              return (
                <div key={mod.id}>
                  {showSemesterBanner && (
                    <div className="px-5 sm:px-6 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#475569]">
                      <span>{bannerTitle}</span>
                      <span className="font-mono-tabular text-[#475569] font-normal hidden sm:inline">
                        {bannerProgress}
                      </span>
                    </div>
                  )}

                  <div
                    className={`p-5 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${
                      isUpNext ? 'bg-[#EFF6FF]/40 hover:bg-[#EFF6FF]/70' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <button
                        type="button"
                        onClick={() => onToggleComplete(mod.id)}
                        aria-label={
                          isCompleted
                            ? `Mark ${modLabel} incomplete`
                            : `Mark ${modLabel} complete`
                        }
                        aria-pressed={isCompleted}
                        className="mt-0.5 shrink-0 text-[#94A3B8] hover:text-[#059669] transition-colors cursor-pointer p-1 -m-1"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#475569] font-mono-tabular">
                          <span className="font-semibold text-[#1D4ED8]">
                            {modLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {slot ? `${slot.formattedDate} (${slot.scheduleDayLabel})` : 'Optional / Outside Path'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-sans">
                            {formatCourseTrackName(mod.course)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{modVideos.length} lectures</span>
                          <span aria-hidden="true">·</span>
                          <span>{mod.estimatedMinutes} min</span>
                          {isCompleted && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-sans font-medium text-[#059669]">
                                Completed
                              </span>
                            </>
                          )}
                          {isUpNext && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-sans font-semibold text-[#1D4ED8]">
                                Up Next
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-semibold text-[#0F172A] leading-snug">
                          <button
                            type="button"
                            onClick={() => onSelectModule(mod.id)}
                            className="text-left hover:text-[#1D4ED8] transition-colors cursor-pointer"
                          >
                            {modPrefix}. {mod.title}
                          </button>
                        </h3>

                        <p className="text-sm text-[#475569] leading-relaxed max-w-3xl">
                          {mod.keyTopics.join(' · ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-5 pl-9 lg:pl-0 shrink-0">
                      <div className="text-xs font-mono-tabular text-[#475569] whitespace-nowrap">
                        Videos {watchedInMod}/{modVideos.length} · Drills {solvedInMod}/{mod.practiceProblems.length}
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectModule(mod.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isUpNext
                            ? 'text-white bg-[#1D4ED8] hover:bg-[#1E40AF]'
                            : 'text-[#1D4ED8] hover:text-white bg-[#EFF6FF] hover:bg-[#1D4ED8]'
                        }`}
                      >
                        <span>
                          {isCompleted
                            ? 'Review Module'
                            : isUpNext
                              ? 'Continue Studio'
                              : 'Open Studio'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quiet Footer Actions */}
      <footer className="pt-8 border-t border-[#E2E8F0] space-y-3 text-xs text-[#475569]">
        {transferNotice && (
          <div
            role={transferNotice.kind === 'error' ? 'alert' : 'status'}
            className={`px-3.5 py-2.5 rounded-lg border flex items-center justify-between gap-3 ${
              transferNotice.kind === 'error'
                ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
            }`}
          >
            <span>{transferNotice.message}</span>
            <button
              type="button"
              onClick={() => setTransferNotice(null)}
              className="font-medium underline cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div>
              CalcAtlas · Precalculus Prep &amp; University Calculus I–II
              Self-Study Platform. Progress saves automatically to this browser.
            </div>
            <div>
              Independent project — not affiliated with or endorsed by Professor Leonard
              or 3Blue1Brown.{' '}
              <button
                type="button"
                onClick={onOpenAbout}
                className="text-[#1D4ED8] hover:underline font-medium cursor-pointer"
              >
                About, Credits &amp; Licenses
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFileChange}
              aria-label="Import progress JSON file"
              className="hidden"
            />

            <button
              type="button"
              onClick={handleExportProgress}
              className="inline-flex items-center gap-1.5 text-[#475569] hover:text-[#1D4ED8] transition-colors cursor-pointer py-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Progress</span>
            </button>

            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-[#475569] hover:text-[#1D4ED8] transition-colors cursor-pointer py-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Progress</span>
            </button>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 text-[#475569] hover:text-[#DC2626] transition-colors cursor-pointer py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Progress</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[#DC2626] font-medium">Clear all progress?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                    setTransferNotice(null);
                  }}
                  className="px-2.5 py-1 text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-md font-medium cursor-pointer"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2.5 py-1 text-[#475569] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-md cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </footer>
    </main>
  );
}
