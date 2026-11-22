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
  if (course === 'precalc') return 'Precalculus Prep';
  if (course === 'calc1') return 'Calculus I';
  return 'Calculus II';
}

export function formatModuleShortLabel(mod: Pick<CourseModule, 'course' | 'dayNumber'>): string {
  return mod.course === 'precalc' ? `Prep ${mod.dayNumber}` : `Day ${mod.dayNumber}`;
}

export function formatModuleNumberPrefix(mod: Pick<CourseModule, 'course' | 'dayNumber'>): string {
  const padded = String(mod.dayNumber).padStart(2, '0');
  return mod.course === 'precalc' ? `P${padded}` : padded;
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
    description: 'Includes Precalculus Prep (P1–P6) plus Calculus I & II (20 modules).',
  },
  calc1: {
    id: 'calc1',
    label: 'Calculus I → II (Days 1–14)',
    shortLabel: 'Calc I → II',
    description: 'Skips Precalculus Prep warmup and schedules Days 1–14 directly (14 modules).',
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
  standard28: {
    id: 'standard28',
    label: 'Steady Mastery (½/day)',
    totalDays: 28,
    hoursPerDay: 1.2,
    summary: '1 module every 2 days · Recommended default with spaced practice and time to work derivations',
    modulesPerDay: 0.5,
  },
  sprint14: {
    id: 'sprint14',
    label: 'Intensive (1/day)',
    totalDays: 14,
    hoursPerDay: 2.3,
    summary: '1 module per day · Full-time daily study schedule for focused self-study',
    modulesPerDay: 1,
  },
  cram7: {
    id: 'cram7',
    label: 'Review Only (2/day)',
    totalDays: 7,
    hoursPerDay: 4.5,
    summary: 'Review only: for people who already studied this material. Fast pacing builds familiarity, not mastery.',
    modulesPerDay: 2,
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
  if (video.lectureCode.startsWith('Precalculus Prep')) {
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

export const STORAGE_KEY = 'calcatlas_progress_v2';
export const LEGACY_STORAGE_KEYS = ['principia_calculus_progress_v1'] as const;
export const CURRENT_PROGRESS_SCHEMA_VERSION = 2;

export function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createInitialProgress(firstModuleId: string): UserProgressState {
  return {
    schemaVersion: CURRENT_PROGRESS_SCHEMA_VERSION,
    paceId: 'standard28',
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
  precalcCompleted: number;
  precalcTotal: number;
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

  const precalcModules = modules.filter((m) => m.course === 'precalc');
  const calc1Modules = modules.filter((m) => m.course === 'calc1');
  const calc2Modules = modules.filter((m) => m.course === 'calc2');
  const precalcCompleted = precalcModules.filter((m) => completedSet.has(m.id)).length;
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
    precalcCompleted,
    precalcTotal: precalcModules.length,
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
    precalc: { correct: 0, total: 0 },
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

const VALID_VIEWS = new Set<NavView>(['plan', 'studio', 'exam', 'formulas', 'about']);
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

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function sanitizeSolvedProblems(
  raw: unknown
): Record<string, { selectedOptionId: string; isCorrect: boolean }> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: Record<string, { selectedOptionId: string; isCorrect: boolean }> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (
      v &&
      typeof v === 'object' &&
      !Array.isArray(v) &&
      typeof (v as { selectedOptionId?: unknown }).selectedOptionId === 'string' &&
      typeof (v as { isCorrect?: unknown }).isCorrect === 'boolean'
    ) {
      result[k] = {
        selectedOptionId: (v as { selectedOptionId: string }).selectedOptionId,
        isCorrect: (v as { isCorrect: boolean }).isCorrect,
      };
    }
  }
  return result;
}

function sanitizeExamHistory(raw: unknown): ExamAttemptRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is ExamAttemptRecord => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
    const rec = item as Partial<ExamAttemptRecord>;
    return (
      typeof rec.id === 'string' &&
      typeof rec.templateId === 'string' &&
      typeof rec.title === 'string' &&
      typeof rec.completedAtIso === 'string' &&
      typeof rec.score === 'number' &&
      Number.isFinite(rec.score) &&
      typeof rec.total === 'number' &&
      Number.isFinite(rec.total) &&
      typeof rec.durationSeconds === 'number' &&
      Number.isFinite(rec.durationSeconds)
    );
  });
}

/**
 * Migrates raw persisted progress (including legacy unversioned v1 objects)
 * to CURRENT_PROGRESS_SCHEMA_VERSION, sanitizing any malformed fields.
 */
export function migrateProgressState(
  raw: unknown,
  firstModuleId: string
): UserProgressState {
  const fallback = createInitialProgress(firstModuleId);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return fallback;
  }

  const parsed = raw as Partial<UserProgressState> & Record<string, unknown>;
  const validPace: PaceId =
    typeof parsed.paceId === 'string' && parsed.paceId in PACE_CONFIGS
      ? (parsed.paceId as PaceId)
      : fallback.paceId;

  const validTrack: StartingTrack =
    typeof parsed.startingTrack === 'string' &&
    parsed.startingTrack in STARTING_TRACK_CONFIGS
      ? (parsed.startingTrack as StartingTrack)
      : fallback.startingTrack;

  const rawLastVid =
    parsed.lastVideoByModule &&
    typeof parsed.lastVideoByModule === 'object' &&
    !Array.isArray(parsed.lastVideoByModule)
      ? Object.fromEntries(
          Object.entries(parsed.lastVideoByModule as Record<string, unknown>).filter(
            ([k, v]) => typeof k === 'string' && typeof v === 'string'
          ) as [string, string][]
        )
      : {};

  const dedupeStrings = (arr: unknown): string[] =>
    Array.isArray(arr)
      ? Array.from(new Set(arr.filter((x): x is string => typeof x === 'string')))
      : [];

  return {
    schemaVersion: CURRENT_PROGRESS_SCHEMA_VERSION,
    paceId: validPace,
    startingTrack: validTrack,
    startDateIso:
      typeof parsed.startDateIso === 'string' && ISO_DATE_RE.test(parsed.startDateIso)
        ? parsed.startDateIso
        : fallback.startDateIso,
    completedModuleIds: dedupeStrings(parsed.completedModuleIds),
    watchedVideoIds: dedupeStrings(parsed.watchedVideoIds),
    lastVideoByModule: rawLastVid,
    solvedProblemIds: sanitizeSolvedProblems(parsed.solvedProblemIds),
    examHistory: sanitizeExamHistory(parsed.examHistory),
    activeModuleId:
      typeof parsed.activeModuleId === 'string' && parsed.activeModuleId.length > 0
        ? parsed.activeModuleId
        : firstModuleId,
  };
}

export interface ProgressExportEnvelope {
  schemaVersion: number;
  exportedAtIso: string;
  progress: UserProgressState;
}

export function serializeProgressExport(state: UserProgressState): string {
  const payload: ProgressExportEnvelope = {
    schemaVersion: CURRENT_PROGRESS_SCHEMA_VERSION,
    exportedAtIso: new Date().toISOString(),
    progress: {
      ...state,
      schemaVersion: CURRENT_PROGRESS_SCHEMA_VERSION,
    },
  };
  return JSON.stringify(payload, null, 2);
}

export type ProgressImportResult =
  | { ok: true; state: UserProgressState }
  | { ok: false; error: string };

/**
 * Strictly validates and imports an exported JSON progress file (either wrapped
 * in ProgressExportEnvelope or a raw v1/v2 UserProgressState object).
 */
export function parseProgressImport(
  jsonText: string,
  firstModuleId: string
): ProgressImportResult {
  if (!jsonText.trim()) {
    return { ok: false, error: 'The selected file is empty.' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return {
      ok: false,
      error: 'Invalid JSON syntax. Please choose a valid progress backup (.json) file.',
    };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      ok: false,
      error: 'Invalid backup format: expected a JSON object.',
    };
  }

  const top = parsed as Record<string, unknown>;
  const candidate =
    top.progress && typeof top.progress === 'object' && !Array.isArray(top.progress)
      ? (top.progress as Record<string, unknown>)
      : top;

  const rawVersion =
    typeof top.schemaVersion === 'number'
      ? top.schemaVersion
      : typeof candidate.schemaVersion === 'number'
        ? candidate.schemaVersion
        : undefined;

  if (
    rawVersion !== undefined &&
    (!Number.isInteger(rawVersion) ||
      rawVersion < 1 ||
      rawVersion > CURRENT_PROGRESS_SCHEMA_VERSION)
  ) {
    return {
      ok: false,
      error: `Unsupported progress schema version (${String(rawVersion)}). Supported versions: 1–${CURRENT_PROGRESS_SCHEMA_VERSION}.`,
    };
  }

  const recognizedKeys = [
    'completedModuleIds',
    'watchedVideoIds',
    'solvedProblemIds',
    'paceId',
    'startingTrack',
    'examHistory',
  ];
  const hasAnyRecognizedKey = recognizedKeys.some((k) => k in candidate);
  if (!hasAnyRecognizedKey) {
    return {
      ok: false,
      error:
        'This JSON file does not appear to be a course progress backup (missing progress fields).',
    };
  }

  if (
    'completedModuleIds' in candidate &&
    !Array.isArray(candidate.completedModuleIds)
  ) {
    return {
      ok: false,
      error: 'Invalid backup file: "completedModuleIds" must be an array.',
    };
  }
  if ('watchedVideoIds' in candidate && !Array.isArray(candidate.watchedVideoIds)) {
    return {
      ok: false,
      error: 'Invalid backup file: "watchedVideoIds" must be an array.',
    };
  }
  if (
    'solvedProblemIds' in candidate &&
    (typeof candidate.solvedProblemIds !== 'object' ||
      candidate.solvedProblemIds === null ||
      Array.isArray(candidate.solvedProblemIds))
  ) {
    return {
      ok: false,
      error: 'Invalid backup file: "solvedProblemIds" must be an object.',
    };
  }

  return {
    ok: true,
    state: migrateProgressState(candidate, firstModuleId),
  };
}

export function loadProgressFromStorage(firstModuleId: string): UserProgressState {
  const fallback = createInitialProgress(firstModuleId);
  if (typeof window === 'undefined') return fallback;
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      LEGACY_STORAGE_KEYS.map((k) => window.localStorage.getItem(k)).find(Boolean) ??
      null;
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return migrateProgressState(parsed, firstModuleId);
  } catch {
    return fallback;
  }
}

export function saveProgressToStorage(state: UserProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    const versioned: UserProgressState = {
      ...state,
      schemaVersion: CURRENT_PROGRESS_SCHEMA_VERSION,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(versioned));
  } catch {
    // Ignore storage quota errors in restricted sandboxes
  }
}
