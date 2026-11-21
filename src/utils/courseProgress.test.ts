import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addCalendarDays,
  buildHashRoute,
  computeProgressSummary,
  createInitialProgress,
  formatDurationPair,
  getModuleScheduleSlot,
  gradeExamSubmission,
  parseHashRoute,
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
    makeMockModule('p1', 1, 'prealg'),
    makeMockModule('m1', 1, 'calc1'),
    makeMockModule('m2', 2, 'calc1'),
    makeMockModule('m3', 3, 'calc2'),
  ];
  const progress = createInitialProgress('p1');
  progress.completedModuleIds = ['p1', 'm1'];
  progress.watchedVideoIds = ['v1', 'v2'];
  progress.solvedProblemIds = {
    'm1-p1': { selectedOptionId: 'b', isCorrect: true },
    'm2-p1': { selectedOptionId: 'a', isCorrect: false },
  };

  // Full path (4 modules * 2 hrs = 8 hrs across 4 days at sprint14 = 2.0 hrs/day)
  const fullSummary = computeProgressSummary(modules, progress);
  assert.equal(fullSummary.completedModules, 2);
  assert.equal(fullSummary.totalModules, 4);
  assert.equal(fullSummary.completionPercent, 50);
  assert.equal(fullSummary.nextRecommendedModuleId, 'm2');
  assert.equal(fullSummary.remainingMinutes, 240);
  assert.equal(fullSummary.effectiveTotalDays, 4);
  assert.equal(fullSummary.requiredHoursPerDay, 2.0);

  // Calc I -> II track skips Pre-Algebra (3 modules: m1 done, m2/m3 left)
  const calc1Summary = computeProgressSummary(modules, {
    ...progress,
    startingTrack: 'calc1',
  });
  assert.equal(calc1Summary.totalModules, 3);
  assert.equal(calc1Summary.completedModules, 1);
  assert.equal(calc1Summary.nextRecommendedModuleId, 'm2');
  assert.equal(calc1Summary.effectiveTotalDays, 3);
  assert.equal(calc1Summary.requiredHoursPerDay, 2.0);

  // Calc II only track (1 module: m3 left)
  const calc2Summary = computeProgressSummary(modules, {
    ...progress,
    startingTrack: 'calc2',
  });
  assert.equal(calc2Summary.totalModules, 1);
  assert.equal(calc2Summary.completedModules, 0);
  assert.equal(calc2Summary.nextRecommendedModuleId, 'm3');
  assert.equal(calc2Summary.effectiveTotalDays, 1);
});

test('gradeExamSubmission computes accurate scores and missed problem breakdown', () => {
  const problems = [
    makeMockProblem('p0', 'prealg', 'a'),
    makeMockProblem('p1', 'calc1', 'b'),
    makeMockProblem('p2', 'calc1', 'a'),
    makeMockProblem('p3', 'calc2', 'b'),
  ];
  const report = gradeExamSubmission(problems, { p0: 'a', p1: 'b', p2: 'b', p3: 'b' });
  assert.equal(report.score, 3);
  assert.equal(report.total, 4);
  assert.equal(report.percent, 75);
  assert.equal(report.byCourse.prealg.correct, 1);
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
