import type {
  CourseModule,
  CourseTrack,
  ExamAttemptRecord,
  NavView,
  PaceId,
  PracticeProblem,
  StartingTrack,
  StudioTab,
  UserProgressState,
  VideoLecture,
} from '../types/course';

export function formatCourseTrackName(course: CourseTrack): string {
  if (course === 'prealg') return 'Pre-Algebra';
  if (course === 'calc1') return 'Calculus I';
  return 'Calculus II';
}

export function formatModuleShortLabel(mod: Pick<CourseModule, 'course' | 'dayNumber'>): string {
  return mod.course === 'prealg' ? `Prep ${mod.dayNumber}` : `Day ${mod.dayNumber}`;
}

export function formatModuleNumberPrefix(mod: Pick<CourseModule, 'course' | 'dayNumber'>): string {
  const padded = String(mod.dayNumber).padStart(2, '0');
  return mod.course === 'prealg' ? `P${padded}` : padded;
}

export interface StartingTrackConfig {
  id: StartingTrack;
  label: string;
  shortLabel: string;
  description: string;
}

export const STARTING_TRACK_CONFIGS: Record<StartingTrack, StartingTrackConfig> = {
  full: {
    id: 'full',
    label: 'Full Path (Prep → Calc II)',
    shortLabel: 'Prep → Calc II',
    description: 'Includes Pre-Algebra & Precalculus Prep (P1–P6) plus Calculus I & II (20 modules).',
  },
  calc1: {
    id: 'calc1',
    label: 'Calculus I → II (Days 1–14)',
    shortLabel: 'Calc I → II',
    description: 'Skips Pre-Algebra warmup and schedules Days 1–14 directly (14 modules).',
  },
  calc2: {
    id: 'calc2',
    label: 'Calculus II Only (Days 6–14)',
    shortLabel: 'Calc II Only',
    description: 'Jumps straight into Integration Techniques, Series, Taylor & Polar (9 modules).',
  },
};

export function getModulesForStartingTrack(
  modules: CourseModule[],
  startingTrack: StartingTrack
): CourseModule[] {
  if (startingTrack === 'calc1') {
    return modules.filter((m) => m.course === 'calc1' || m.course === 'calc2');
  }
  if (startingTrack === 'calc2') {
    return modules.filter((m) => m.course === 'calc2');
  }
  return modules;
}

export interface PaceConfig {
  id: PaceId;
  label: string;
  totalDays: number;
  hoursPerDay: number;
  summary: string;
  modulesPerDay: number;
}

export const PACE_CONFIGS: Record<PaceId, PaceConfig> = {
  cram7: {
    id: 'cram7',
    label: 'Exam Cram (2/day)',
    totalDays: 7,
    hoursPerDay: 4.5,
    summary: '2 modules per day · Maximum compression for urgent university exams',
    modulesPerDay: 2,
  },
  sprint14: {
    id: 'sprint14',
    label: 'Daily Sprint (1/day)',
    totalDays: 14,
    hoursPerDay: 2.3,
    summary: '1 module per day · Optimal speed-to-retention university track',
    modulesPerDay: 1,
  },
  standard28: {
    id: 'standard28',
    label: 'Steady Mastery (½/day)',
    totalDays: 28,
    hoursPerDay: 1.2,
    summary: '1 module every 2 days · Built-in spaced repetition alongside classes',
    modulesPerDay: 0.5,
  },
};

export function estimateVideoDurationMinutes(
  video: Pick<VideoLecture, 'instructor' | 'durationMinutes' | 'lectureCode'>
): number {
  if (typeof video.durationMinutes === 'number' && video.durationMinutes > 0) {
    return video.durationMinutes;
  }
  if (video.instructor === '3Blue1Brown') {
    return 18;
  }
  if (video.lectureCode.startsWith('Pre-Algebra')) {
    return 42;
  }
  return 54;
}

export function formatDurationPair(minutes: number): {
  normal: string;
  fast15x: string;
} {
  const fmt = (mins: number) => {
    const rounded = Math.max(1, Math.round(mins));
    if (rounded < 60) return `${rounded}m`;
    const h = Math.floor(rounded / 60);
    const m = rounded % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  };
  return {
    normal: `~${fmt(minutes)}`,
    fast15x: `~${fmt(minutes / 1.5)} @ 1.5x`,
  };
}

export const STORAGE_KEY = 'principia_calculus_progress_v1';

export function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createInitialProgress(firstModuleId: string): UserProgressState {
  return {
    paceId: 'sprint14',
    startingTrack: 'full',
    startDateIso: getTodayIso(),
    completedModuleIds: [],
    watchedVideoIds: [],
    lastVideoByModule: {},
    solvedProblemIds: {},
    examHistory: [],
    activeModuleId: firstModuleId,
  };
}

/**
 * Adds calendar days to an ISO date string (YYYY-MM-DD) safely without timezone drift.
 */
export function addCalendarDays(isoDate: string, daysToAdd: number): string {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some((p) => Number.isNaN(p))) {
    return isoDate;
  }
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  date.setUTCDate(date.getUTCDate() + daysToAdd);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatShortDate(isoDate: string): string {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some((p) => Number.isNaN(p))) {
    return isoDate;
  }
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Maps a 1-indexed module number within the active schedule to its day label and calendar date.
 */
export function getModuleScheduleSlot(
  moduleIndex1Based: number,
  paceId: PaceId,
  startDateIso: string
): {
  scheduleDayLabel: string;
  calendarDateIso: string;
  formattedDate: string;
} {
  const idx = Math.max(1, moduleIndex1Based);
  if (paceId === 'cram7') {
    const dayOffset = Math.floor((idx - 1) / 2);
    const session = idx % 2 === 1 ? 'AM' : 'PM';
    const calendarDateIso = addCalendarDays(startDateIso, dayOffset);
    return {
      scheduleDayLabel: `Day ${dayOffset + 1} (${session})`,
      calendarDateIso,
      formattedDate: formatShortDate(calendarDateIso),
    };
  }
  if (paceId === 'standard28') {
    const startDay = (idx - 1) * 2 + 1;
    const calendarDateIso = addCalendarDays(startDateIso, startDay - 1);
    return {
      scheduleDayLabel: `Days ${startDay}–${startDay + 1}`,
      calendarDateIso,
      formattedDate: formatShortDate(calendarDateIso),
    };
  }
  const calendarDateIso = addCalendarDays(startDateIso, idx - 1);
  return {
    scheduleDayLabel: `Day ${idx}`,
    calendarDateIso,
    formattedDate: formatShortDate(calendarDateIso),
  };
}

export interface ProgressSummary {
  completedModules: number;
  totalModules: number;
  completionPercent: number;
  prealgCompleted: number;
  prealgTotal: number;
  calc1Completed: number;
  calc1Total: number;
  calc2Completed: number;
  calc2Total: number;
  watchedVideoCount: number;
  solvedCorrectCount: number;
  totalProblems: number;
  nextRecommendedModuleId: string;
  projectedFinishDateIso: string;
  remainingMinutes: number;
  effectiveTotalDays: number;
  remainingScheduleDays: number;
  requiredHoursPerDay: number;
}

export function computeProgressSummary(
  modules: CourseModule[],
  progress: UserProgressState
): ProgressSummary {
  const completedSet = new Set(progress.completedModuleIds);
  const trackModules = getModulesForStartingTrack(modules, progress.startingTrack);
  const totalModules = trackModules.length;
  const completedModules = trackModules.filter((m) => completedSet.has(m.id)).length;

  const prealgModules = modules.filter((m) => m.course === 'prealg');
  const calc1Modules = modules.filter((m) => m.course === 'calc1');
  const calc2Modules = modules.filter((m) => m.course === 'calc2');
  const prealgCompleted = prealgModules.filter((m) => completedSet.has(m.id)).length;
  const calc1Completed = calc1Modules.filter((m) => completedSet.has(m.id)).length;
  const calc2Completed = calc2Modules.filter((m) => completedSet.has(m.id)).length;

  const trackProblems = trackModules.flatMap((m) => m.practiceProblems);
  const solvedCorrectCount = trackProblems.filter(
    (p) => progress.solvedProblemIds[p.id]?.isCorrect
  ).length;

  const firstIncomplete = trackModules.find((m) => !completedSet.has(m.id));
  const nextRecommendedModuleId = firstIncomplete
    ? firstIncomplete.id
    : trackModules[trackModules.length - 1]?.id ?? modules[0]?.id ?? '';

  const remainingTrackModules = trackModules.filter((m) => !completedSet.has(m.id));
  const remainingMinutes = remainingTrackModules.reduce(
    (acc, m) => acc + m.estimatedMinutes,
    0
  );
  const totalTrackMinutes = trackModules.reduce(
    (acc, m) => acc + m.estimatedMinutes,
    0
  );

  const pace = PACE_CONFIGS[progress.paceId];
  const effectiveTotalDays = Math.max(
    1,
    Math.ceil(trackModules.length / pace.modulesPerDay)
  );
  const remainingScheduleDays =
    remainingTrackModules.length === 0
      ? 0
      : Math.max(1, Math.ceil(remainingTrackModules.length / pace.modulesPerDay));

  const projectedFinishDateIso = addCalendarDays(
    progress.startDateIso,
    Math.max(0, effectiveTotalDays - 1)
  );

  // Reconciled hours/day = exact total track hours divided by scheduled days
  const requiredHoursPerDay =
    effectiveTotalDays > 0
      ? Number((totalTrackMinutes / 60 / effectiveTotalDays).toFixed(1))
      : 0;

  return {
    completedModules,
    totalModules,
    completionPercent:
      totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
    prealgCompleted,
    prealgTotal: prealgModules.length,
    calc1Completed,
    calc1Total: calc1Modules.length,
    calc2Completed,
    calc2Total: calc2Modules.length,
    watchedVideoCount: progress.watchedVideoIds.length,
    solvedCorrectCount,
    totalProblems: trackProblems.length,
    nextRecommendedModuleId,
    projectedFinishDateIso,
    remainingMinutes,
    effectiveTotalDays,
    remainingScheduleDays,
    requiredHoursPerDay,
  };
}

export interface ExamGradeReport {
  score: number;
  total: number;
  percent: number;
  byCourse: Record<CourseTrack, { correct: number; total: number }>;
  missedProblems: PracticeProblem[];
}

export function gradeExamSubmission(
  problems: PracticeProblem[],
  answers: Record<string, string>
): ExamGradeReport {
  let score = 0;
  const byCourse: Record<CourseTrack, { correct: number; total: number }> = {
    prealg: { correct: 0, total: 0 },
    calc1: { correct: 0, total: 0 },
    calc2: { correct: 0, total: 0 },
  };
  const missedProblems: PracticeProblem[] = [];

  for (const problem of problems) {
    byCourse[problem.course].total += 1;
    const isCorrect = answers[problem.id] === problem.correctOptionId;
    if (isCorrect) {
      score += 1;
      byCourse[problem.course].correct += 1;
    } else {
      missedProblems.push(problem);
    }
  }

  return {
    score,
    total: problems.length,
    percent: problems.length > 0 ? Math.round((score / problems.length) * 100) : 0,
    byCourse,
    missedProblems,
  };
}

const VALID_VIEWS = new Set<NavView>(['plan', 'studio', 'exam', 'formulas']);
const VALID_STUDIO_TABS = new Set<StudioTab>([
  'videos',
  'theory',
  'lab',
  'examples',
  'practice',
]);

export interface ParsedHashRoute {
  view: NavView;
  moduleId?: string;
  studioTab?: StudioTab;
}

export function parseHashRoute(
  hash: string,
  validModuleIds: Set<string>
): ParsedHashRoute | null {
  const cleaned = hash.replace(/^#\/?/, '').trim();
  if (!cleaned) return null;
  const parts = cleaned.split('/').filter(Boolean);
  const rawView = parts[0] as NavView | undefined;
  if (!rawView || !VALID_VIEWS.has(rawView)) return null;

  if (rawView === 'studio') {
    const rawMod = parts[1];
    const rawTab = parts[2] as StudioTab | undefined;
    return {
      view: 'studio',
      moduleId: rawMod && validModuleIds.has(rawMod) ? rawMod : undefined,
      studioTab: rawTab && VALID_STUDIO_TABS.has(rawTab) ? rawTab : undefined,
    };
  }
  return { view: rawView };
}

export function buildHashRoute(
  view: NavView,
  moduleId?: string,
  studioTab?: StudioTab
): string {
  if (view === 'studio' && moduleId) {
    return `#/studio/${moduleId}/${studioTab ?? 'videos'}`;
  }
  return `#/${view}`;
}

export function loadProgressFromStorage(firstModuleId: string): UserProgressState {
  const fallback = createInitialProgress(firstModuleId);
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<UserProgressState>;
    const validPace: PaceId =
      parsed.paceId && parsed.paceId in PACE_CONFIGS ? parsed.paceId : fallback.paceId;
    const validTrack: StartingTrack =
      parsed.startingTrack && parsed.startingTrack in STARTING_TRACK_CONFIGS
        ? parsed.startingTrack
        : fallback.startingTrack;
    const rawLastVid =
      parsed.lastVideoByModule && typeof parsed.lastVideoByModule === 'object'
        ? Object.fromEntries(
            Object.entries(parsed.lastVideoByModule).filter(
              ([k, v]) => typeof k === 'string' && typeof v === 'string'
            )
          )
        : {};
    return {
      paceId: validPace,
      startingTrack: validTrack,
      startDateIso:
        typeof parsed.startDateIso === 'string' && parsed.startDateIso.length === 10
          ? parsed.startDateIso
          : fallback.startDateIso,
      completedModuleIds: Array.isArray(parsed.completedModuleIds)
        ? parsed.completedModuleIds.filter((x): x is string => typeof x === 'string')
        : [],
      watchedVideoIds: Array.isArray(parsed.watchedVideoIds)
        ? parsed.watchedVideoIds.filter((x): x is string => typeof x === 'string')
        : [],
      lastVideoByModule: rawLastVid,
      solvedProblemIds:
        parsed.solvedProblemIds && typeof parsed.solvedProblemIds === 'object'
          ? parsed.solvedProblemIds
          : {},
      examHistory: Array.isArray(parsed.examHistory)
        ? (parsed.examHistory as ExamAttemptRecord[])
        : [],
      activeModuleId:
        typeof parsed.activeModuleId === 'string' && parsed.activeModuleId.length > 0
          ? parsed.activeModuleId
          : firstModuleId,
    };
  } catch {
    return fallback;
  }
}

export function saveProgressToStorage(state: UserProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in restricted sandboxes
  }
}
