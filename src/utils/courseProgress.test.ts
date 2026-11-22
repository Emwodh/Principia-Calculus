import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CURRENT_PROGRESS_SCHEMA_VERSION,
  addCalendarDays,
  buildHashRoute,
  computeProgressSummary,
  createInitialProgress,
  formatDurationPair,
  getModuleScheduleSlot,
  gradeExamSubmission,
  migrateProgressState,
  parseHashRoute,
  parseProgressImport,
  serializeProgressExport,
} from './courseProgress';
import { ALL_PROBLEMS, EXAM_TEMPLATES, selectProblemsForExam } from '../data/curriculum';
import type { CourseModule, CourseTrack, PracticeProblem } from '../types/course';

function makeMockProblem(
  id: string,
  course: CourseTrack,
  correctOptionId: string
): PracticeProblem {
  return {
    id,
    moduleId: `${course}-m1`,
    course,
    topicTag: 'Test Topic',
    difficulty: 'Core',
    prompt: 'Evaluate:',
    promptTex: '1 + 1',
    options: [
      { id: 'a', labelTex: '1' },
      { id: 'b', labelTex: '2' },
    ],
    correctOptionId,
    hint: 'Add them',
    solutionTex: '1 + 1 = 2',
    solutionExplanation: 'Basic addition.',
  };
}

function makeMockModule(id: string, dayNumber: number, course: CourseTrack): CourseModule {
  return {
    id,
    dayNumber,
    course,
    phase: 'Phase 1',
    title: `Day ${dayNumber}`,
    subtitle: 'Subtitle',
    estimatedMinutes: 120,
    labType: 'limit',
    labTitle: 'Lab',
    labObjective: 'Obj',
    keyTopics: ['Topic'],
    prerequisites: [],
    studySprintChecklist: ['Step 1'],
    theorems: [],
    commonTraps: [],
    workedExamples: [],
    practiceProblems: [makeMockProblem(`${id}-p1`, course, 'b')],
  };
}

test('addCalendarDays handles month rollovers cleanly', () => {
  assert.equal(addCalendarDays('2026-01-30', 3), '2026-02-02');
  assert.equal(addCalendarDays('2026-11-19', 13), '2026-12-02');
});

test('getModuleScheduleSlot compresses 14 modules across 7-day, 14-day, and 28-day paces', () => {
  const cram1 = getModuleScheduleSlot(1, 'cram7', '2026-11-19');
  const cram2 = getModuleScheduleSlot(2, 'cram7', '2026-11-19');
  const cram14 = getModuleScheduleSlot(14, 'cram7', '2026-11-19');
  assert.equal(cram1.scheduleDayLabel, 'Day 1 (AM)');
  assert.equal(cram2.scheduleDayLabel, 'Day 1 (PM)');
  assert.equal(cram14.scheduleDayLabel, 'Day 7 (PM)');
  assert.equal(cram14.calendarDateIso, '2026-11-25');

  const sprint14 = getModuleScheduleSlot(14, 'sprint14', '2026-11-19');
  assert.equal(sprint14.scheduleDayLabel, 'Day 14');
  assert.equal(sprint14.calendarDateIso, '2026-12-02');

  const std14 = getModuleScheduleSlot(14, 'standard28', '2026-11-19');
  assert.equal(std14.scheduleDayLabel, 'Days 27–28');
});

test('computeProgressSummary reconciles completion, next module, days, and hours/day per startingTrack', () => {
  const modules = [
    makeMockModule('p1', 1, 'precalc'),
    makeMockModule('m1', 1, 'calc1'),
    makeMockModule('m2', 2, 'calc1'),
    makeMockModule('m3', 3, 'calc2'),
  ];
  const progress = createInitialProgress('p1');
  assert.equal(progress.paceId, 'standard28');
  progress.completedModuleIds = ['p1', 'm1'];
  progress.watchedVideoIds = ['v1', 'v2'];
  progress.solvedProblemIds = {
    'm1-p1': { selectedOptionId: 'b', isCorrect: true },
    'm2-p1': { selectedOptionId: 'a', isCorrect: false },
  };

  // Full path at default standard28 (4 modules * 2 hrs = 8 hrs across 8 days = 1.0 hrs/day)
  const fullSummary = computeProgressSummary(modules, progress);
  assert.equal(fullSummary.completedModules, 2);
  assert.equal(fullSummary.totalModules, 4);
  assert.equal(fullSummary.completionPercent, 50);
  assert.equal(fullSummary.nextRecommendedModuleId, 'm2');
  assert.equal(fullSummary.remainingMinutes, 240);
  assert.equal(fullSummary.effectiveTotalDays, 8);
  assert.equal(fullSummary.requiredHoursPerDay, 1.0);

  // Calc I -> II track at sprint14 (3 modules: m1 done, m2/m3 left, 3 days, 2.0 hrs/day)
  const calc1Summary = computeProgressSummary(modules, {
    ...progress,
    paceId: 'sprint14',
    startingTrack: 'calc1',
  });
  assert.equal(calc1Summary.totalModules, 3);
  assert.equal(calc1Summary.completedModules, 1);
  assert.equal(calc1Summary.nextRecommendedModuleId, 'm2');
  assert.equal(calc1Summary.effectiveTotalDays, 3);
  assert.equal(calc1Summary.requiredHoursPerDay, 2.0);

  // Calc II only track at standard28 (1 module: m3 left, 2 days)
  const calc2Summary = computeProgressSummary(modules, {
    ...progress,
    startingTrack: 'calc2',
  });
  assert.equal(calc2Summary.totalModules, 1);
  assert.equal(calc2Summary.completedModules, 0);
  assert.equal(calc2Summary.nextRecommendedModuleId, 'm3');
  assert.equal(calc2Summary.effectiveTotalDays, 2);
});

test('gradeExamSubmission computes accurate scores and missed problem breakdown', () => {
  const problems = [
    makeMockProblem('p0', 'precalc', 'a'),
    makeMockProblem('p1', 'calc1', 'b'),
    makeMockProblem('p2', 'calc1', 'a'),
    makeMockProblem('p3', 'calc2', 'b'),
  ];
  const report = gradeExamSubmission(problems, { p0: 'a', p1: 'b', p2: 'b', p3: 'b' });
  assert.equal(report.score, 3);
  assert.equal(report.total, 4);
  assert.equal(report.percent, 75);
  assert.equal(report.byCourse.precalc.correct, 1);
  assert.equal(report.byCourse.calc1.correct, 1);
  assert.equal(report.byCourse.calc2.correct, 1);
  assert.equal(report.missedProblems.length, 1);
  assert.equal(report.missedProblems[0].id, 'p2');
});

test('selectProblemsForExam samples every Calc I & II day in Full Gauntlet and preserves correct answer under shuffling', () => {
  const gauntlet = EXAM_TEMPLATES.find((t) => t.id === 'exam-full-gauntlet');
  assert.ok(gauntlet, 'Full Gauntlet template must exist');

  // Deterministic LCG PRNG for reproducible test
  let seed = 42;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const selected = selectProblemsForExam(gauntlet, rng);
  assert.equal(selected.length, 24);

  // Must cover ALL 14 Calc I & II modules (Days 1..14)
  const distinctModules = new Set(selected.map((p) => p.moduleId));
  assert.equal(distinctModules.size, 14);
  assert.ok(distinctModules.has('calc1-limits'));
  assert.ok(distinctModules.has('calc2-synthesis'));

  // Shuffled options must preserve exact correct answer labelTex
  const originalById = new Map(ALL_PROBLEMS.map((p) => [p.id, p]));
  for (const q of selected) {
    const orig = originalById.get(q.id)!;
    const origCorrectTex = orig.options.find((o) => o.id === orig.correctOptionId)?.labelTex;
    const newCorrectTex = q.options.find((o) => o.id === q.correctOptionId)?.labelTex;
    assert.equal(newCorrectTex, origCorrectTex);
  }
});

test('parseHashRoute and buildHashRoute round-trip cleanly', () => {
  const validMods = new Set(['prealg-functions', 'calc2-taylor']);
  const hash = buildHashRoute('studio', 'calc2-taylor', 'theory');
  assert.equal(hash, '#/studio/calc2-taylor/theory');
  const parsed = parseHashRoute(hash, validMods);
  assert.deepEqual(parsed, {
    view: 'studio',
    moduleId: 'calc2-taylor',
    studioTab: 'theory',
  });
  assert.equal(parseHashRoute('#/unknown', validMods), null);
});

test('formatDurationPair formats standard and 1.5x lecture durations cleanly', () => {
  assert.deepEqual(formatDurationPair(45), { normal: '~45m', fast15x: '~30m @ 1.5x' });
  assert.deepEqual(formatDurationPair(90), { normal: '~1h 30m', fast15x: '~1h @ 1.5x' });
});

test('addCalendarDays handles year boundaries, leap years, and malformed dates safely', () => {
  assert.equal(addCalendarDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addCalendarDays('2026-12-30', 5), '2027-01-04');
  assert.equal(addCalendarDays('2028-02-28', 1), '2028-02-29'); // leap year
  assert.equal(addCalendarDays('2028-02-28', 2), '2028-03-01');
  assert.equal(addCalendarDays('2027-02-28', 1), '2027-03-01'); // non-leap year
  assert.equal(addCalendarDays('not-a-date', 3), 'not-a-date');
});

test('computeProgressSummary handles pace switching and 100% completion cleanly', () => {
  const modules = [
    makeMockModule('m1', 1, 'calc1'),
    makeMockModule('m2', 2, 'calc1'),
    makeMockModule('m3', 3, 'calc2'),
    makeMockModule('m4', 4, 'calc2'),
  ];
  const base = {
    ...createInitialProgress('m1'),
    startingTrack: 'calc1' as const,
    startDateIso: '2028-02-27',
  };

  // Switching across standard28 -> sprint14 -> cram7 updates days, finish date, and hours/day
  const std = computeProgressSummary(modules, { ...base, paceId: 'standard28' });
  assert.equal(std.effectiveTotalDays, 8);
  assert.equal(std.projectedFinishDateIso, '2028-03-05'); // crosses leap day 2028-02-29
  assert.equal(std.requiredHoursPerDay, 1.0);

  const spr = computeProgressSummary(modules, { ...base, paceId: 'sprint14' });
  assert.equal(spr.effectiveTotalDays, 4);
  assert.equal(spr.projectedFinishDateIso, '2028-03-01');
  assert.equal(spr.requiredHoursPerDay, 2.0);

  const rev = computeProgressSummary(modules, { ...base, paceId: 'cram7' });
  assert.equal(rev.effectiveTotalDays, 2);
  assert.equal(rev.projectedFinishDateIso, '2028-02-28');
  assert.equal(rev.requiredHoursPerDay, 4.0);

  // All modules completed -> 0 remaining minutes and 0 remaining schedule days
  const done = computeProgressSummary(modules, {
    ...base,
    completedModuleIds: ['m1', 'm2', 'm3', 'm4'],
  });
  assert.equal(done.completionPercent, 100);
  assert.equal(done.remainingMinutes, 0);
  assert.equal(done.remainingScheduleDays, 0);
  assert.equal(done.nextRecommendedModuleId, 'm4');
});

test('gradeExamSubmission handles empty sets, unanswered items, and unknown option IDs', () => {
  const emptyReport = gradeExamSubmission([], {});
  assert.equal(emptyReport.score, 0);
  assert.equal(emptyReport.total, 0);
  assert.equal(emptyReport.percent, 0);

  const problems = [
    makeMockProblem('q1', 'precalc', 'a'),
    makeMockProblem('q2', 'calc1', 'b'),
    makeMockProblem('q3', 'calc2', 'a'),
  ];
  // Unanswered q1, invalid option 'z' for q2, correct 'a' for q3
  const partial = gradeExamSubmission(problems, { q2: 'z', q3: 'a' });
  assert.equal(partial.score, 1);
  assert.equal(partial.total, 3);
  assert.equal(partial.percent, 33);
  assert.deepEqual(
    partial.missedProblems.map((p) => p.id),
    ['q1', 'q2']
  );

  // Perfect score
  const perfect = gradeExamSubmission(problems, { q1: 'a', q2: 'b', q3: 'a' });
  assert.equal(perfect.score, 3);
  assert.equal(perfect.percent, 100);
  assert.equal(perfect.missedProblems.length, 0);
});

test('migrateProgressState upgrades legacy unversioned v1 data and sanitizes corrupt fields', () => {
  const legacyV1 = {
    // No schemaVersion field
    paceId: 'sprint14',
    startingTrack: 'calc1',
    startDateIso: '2026-10-01',
    completedModuleIds: ['calc1-limits', 'calc1-limits', 42],
    watchedVideoIds: ['vid-d1-1', null],
    lastVideoByModule: { 'calc1-limits': 'vid-d1-1', bad: 123 },
    solvedProblemIds: {
      'p-d1-1': { selectedOptionId: 'b', isCorrect: true },
      corrupt: 'not-an-object',
    },
    examHistory: [
      {
        id: 'ex-1',
        templateId: 'exam-calc1-midterm',
        title: 'Midterm',
        completedAtIso: '2026-10-02T12:00:00.000Z',
        score: 10,
        total: 12,
        durationSeconds: 900,
      },
      { bad: true },
    ],
    activeModuleId: 'calc1-derivatives',
  };

  const migrated = migrateProgressState(legacyV1, 'prealg-functions');
  assert.equal(migrated.schemaVersion, CURRENT_PROGRESS_SCHEMA_VERSION);
  assert.equal(migrated.paceId, 'sprint14');
  assert.equal(migrated.startingTrack, 'calc1');
  assert.deepEqual(migrated.completedModuleIds, ['calc1-limits']);
  assert.deepEqual(migrated.watchedVideoIds, ['vid-d1-1']);
  assert.deepEqual(migrated.lastVideoByModule, { 'calc1-limits': 'vid-d1-1' });
  assert.deepEqual(migrated.solvedProblemIds, {
    'p-d1-1': { selectedOptionId: 'b', isCorrect: true },
  });
  assert.equal(migrated.examHistory.length, 1);
  assert.equal(migrated.activeModuleId, 'calc1-derivatives');

  // Completely invalid root falls back cleanly
  const fallback = migrateProgressState('garbage', 'prealg-functions');
  assert.equal(fallback.schemaVersion, CURRENT_PROGRESS_SCHEMA_VERSION);
  assert.equal(fallback.paceId, 'standard28');
  assert.equal(fallback.activeModuleId, 'prealg-functions');
});

test('serializeProgressExport and parseProgressImport round-trip cleanly and reject malformed files', () => {
  const initial = createInitialProgress('prealg-functions');
  initial.completedModuleIds = ['prealg-functions', 'calc1-limits'];
  initial.watchedVideoIds = ['vid-pa1-1'];
  initial.paceId = 'sprint14';

  const exported = serializeProgressExport(initial);
  const imported = parseProgressImport(exported, 'prealg-functions');
  assert.equal(imported.ok, true);
  if (imported.ok) {
    assert.equal(imported.state.schemaVersion, CURRENT_PROGRESS_SCHEMA_VERSION);
    assert.deepEqual(imported.state.completedModuleIds, ['prealg-functions', 'calc1-limits']);
    assert.deepEqual(imported.state.watchedVideoIds, ['vid-pa1-1']);
    assert.equal(imported.state.paceId, 'sprint14');
  }

  // Reject bad JSON
  const badJson = parseProgressImport('{broken json', 'prealg-functions');
  assert.equal(badJson.ok, false);
  if (!badJson.ok) assert.match(badJson.error, /Invalid JSON/i);

  // Reject unrelated JSON object
  const unrelated = parseProgressImport('{"hello":"world"}', 'prealg-functions');
  assert.equal(unrelated.ok, false);
  if (!unrelated.ok) assert.match(unrelated.error, /missing progress fields/i);

  // Reject unsupported future schema version
  const future = parseProgressImport(
    JSON.stringify({ schemaVersion: 99, progress: { completedModuleIds: [] } }),
    'prealg-functions'
  );
  assert.equal(future.ok, false);
  if (!future.ok) assert.match(future.error, /Unsupported progress schema version/i);

  // Reject wrong field type
  const wrongType = parseProgressImport(
    JSON.stringify({ schemaVersion: 2, completedModuleIds: 'not-an-array' }),
    'prealg-functions'
  );
  assert.equal(wrongType.ok, false);
  if (!wrongType.ok) assert.match(wrongType.error, /completedModuleIds/i);
});


