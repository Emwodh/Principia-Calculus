import type {
  CourseModule,
  CourseTrack,
  ExamAttemptRecord,
  PaceId,
  PracticeProblem,
  UserProgressState,
} from '../types/course';

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
    label: '7-Day Exam Cram',
    totalDays: 7,
    hoursPerDay: 5.0,
    summary: '2 modules per day · Maximum compression for urgent university exams',
    modulesPerDay: 2,
  },
  sprint14: {
    id: 'sprint14',
    label: '14-Day Sprint',
    totalDays: 14,
    hoursPerDay: 2.5,
    summary: '1 module per day · Optimal speed-to-retention university track',
    modulesPerDay: 1,
  },
  standard28: {
    id: 'standard28',
    label: '28-Day Mastery',
    totalDays: 28,
    hoursPerDay: 1.25,
    summary: '1 module every 2 days · Built-in spaced repetition alongside classes',
    modulesPerDay: 0.5,
  },
};

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
    startDateIso: getTodayIso(),
    completedModuleIds: [],
    watchedVideoIds: [],
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
 * Maps a 1-indexed module number (1..14) to its scheduled day index and calendar date under a pace plan.
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
}

export function computeProgressSummary(
  modules: CourseModule[],
  progress: UserProgressState
): ProgressSummary {
  const completedSet = new Set(progress.completedModuleIds);
  const totalModules = modules.length;
  const completedModules = modules.filter((m) => completedSet.has(m.id)).length;
  const calc1Modules = modules.filter((m) => m.course === 'calc1');
  const calc2Modules = modules.filter((m) => m.course === 'calc2');
  const calc1Completed = calc1Modules.filter((m) => completedSet.has(m.id)).length;
  const calc2Completed = calc2Modules.filter((m) => completedSet.has(m.id)).length;

  const allProblems = modules.flatMap((m) => m.practiceProblems);
  const solvedCorrectCount = allProblems.filter(
    (p) => progress.solvedProblemIds[p.id]?.isCorrect
  ).length;

  const firstIncomplete = modules.find((m) => !completedSet.has(m.id));
  const nextRecommendedModuleId = firstIncomplete
    ? firstIncomplete.id
    : modules[modules.length - 1]?.id ?? '';

  const remainingMinutes = modules
    .filter((m) => !completedSet.has(m.id))
    .reduce((acc, m) => acc + m.estimatedMinutes, 0);

  const pace = PACE_CONFIGS[progress.paceId];
  const projectedFinishDateIso = addCalendarDays(
    progress.startDateIso,
    Math.max(0, pace.totalDays - 1)
  );

  return {
    completedModules,
    totalModules,
    completionPercent:
      totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
    calc1Completed,
    calc1Total: calc1Modules.length,
    calc2Completed,
    calc2Total: calc2Modules.length,
    watchedVideoCount: progress.watchedVideoIds.length,
    solvedCorrectCount,
    totalProblems: allProblems.length,
    nextRecommendedModuleId,
    projectedFinishDateIso,
    remainingMinutes,
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

export function loadProgressFromStorage(firstModuleId: string): UserProgressState {
  const fallback = createInitialProgress(firstModuleId);
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<UserProgressState>;
    const validPace: PaceId =
      parsed.paceId && parsed.paceId in PACE_CONFIGS ? parsed.paceId : fallback.paceId;
    return {
      paceId: validPace,
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
