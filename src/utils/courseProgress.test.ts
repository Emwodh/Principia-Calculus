import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addCalendarDays,
  computeProgressSummary,
  createInitialProgress,
  getModuleScheduleSlot,
  gradeExamSubmission,
} from './courseProgress';
import type { CourseModule, PracticeProblem } from '../types/course';

function makeMockProblem(
  id: string,
  course: 'calc1' | 'calc2',
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

function makeMockModule(id: string, dayNumber: number, course: 'calc1' | 'calc2'): CourseModule {
  return {
    id,
    dayNumber,
    course,
    phase: 'Phase 1',
    title: `Day ${dayNumber}`,
    subtitle: 'Subtitle',
    estimatedMinutes: 60,
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

test('computeProgressSummary tracks Calc I / II completion and next recommended module', () => {
  const modules = [
    makeMockModule('m1', 1, 'calc1'),
    makeMockModule('m2', 2, 'calc1'),
    makeMockModule('m3', 3, 'calc2'),
  ];
  const progress = createInitialProgress('m1');
  progress.completedModuleIds = ['m1'];
  progress.watchedVideoIds = ['v1', 'v2'];
  progress.solvedProblemIds = {
    'm1-p1': { selectedOptionId: 'b', isCorrect: true },
    'm2-p1': { selectedOptionId: 'a', isCorrect: false },
  };

  const summary = computeProgressSummary(modules, progress);
  assert.equal(summary.completedModules, 1);
  assert.equal(summary.totalModules, 3);
  assert.equal(summary.completionPercent, 33);
  assert.equal(summary.calc1Completed, 1);
  assert.equal(summary.calc1Total, 2);
  assert.equal(summary.calc2Completed, 0);
  assert.equal(summary.watchedVideoCount, 2);
  assert.equal(summary.solvedCorrectCount, 1);
  assert.equal(summary.nextRecommendedModuleId, 'm2');
  assert.equal(summary.remainingMinutes, 120);
});

test('gradeExamSubmission computes accurate scores and missed problem breakdown', () => {
  const problems = [
    makeMockProblem('p1', 'calc1', 'b'),
    makeMockProblem('p2', 'calc1', 'a'),
    makeMockProblem('p3', 'calc2', 'b'),
  ];
  const report = gradeExamSubmission(problems, { p1: 'b', p2: 'b', p3: 'b' });
  assert.equal(report.score, 2);
  assert.equal(report.total, 3);
  assert.equal(report.percent, 67);
  assert.equal(report.byCourse.calc1.correct, 1);
  assert.equal(report.byCourse.calc1.total, 2);
  assert.equal(report.byCourse.calc2.correct, 1);
  assert.equal(report.missedProblems.length, 1);
  assert.equal(report.missedProblems[0].id, 'p2');
});
