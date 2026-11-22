import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_MODULES,
  ALL_PROBLEMS,
  EXAM_TEMPLATES,
  selectProblemsForExam,
} from '../data/curriculum';
import { FORMULA_VAULT } from '../data/formulas';
import { MODULE_MEDIA_MAP } from '../data/moduleMediaAndNotes';
import { TEXTBOOK_PREALG } from '../data/moduleTextbookPreAlg';
import { TEXTBOOK_CALC1 } from '../data/moduleTextbookCalc1';
import { TEXTBOOK_CALC2 } from '../data/moduleTextbookCalc2';
import type { LabType } from '../types/course';

const VALID_LAB_TYPES = new Set<LabType>([
  'precalc-functions',
  'precalc-quadratics',
  'precalc-rationals',
  'precalc-exp-log',
  'precalc-unit-circle',
  'limit',
  'derivative',
  'extrema',
  'riemann',
  'volume',
  'ibp',
  'trigsub',
  'improper',
  'ode',
  'series',
  'alternating',
  'taylor',
  'polar',
  'triage',
]);

test('Data integrity: every module has a unique ID, valid labType, textbook sections, and video bundle', () => {
  const seenModuleIds = new Set<string>();
  const allTextbooks = { ...TEXTBOOK_PREALG, ...TEXTBOOK_CALC1, ...TEXTBOOK_CALC2 };

  for (const mod of ALL_MODULES) {
    assert.ok(!seenModuleIds.has(mod.id), `Duplicate module ID: ${mod.id}`);
    seenModuleIds.add(mod.id);

    assert.ok(
      VALID_LAB_TYPES.has(mod.labType),
      `Module ${mod.id} references unknown labType: ${mod.labType}`
    );
    assert.ok(mod.estimatedMinutes > 0, `Module ${mod.id} must have positive estimatedMinutes`);
    assert.ok(mod.theorems.length > 0, `Module ${mod.id} must have at least one theorem`);
    assert.ok(
      mod.workedExamples.length > 0,
      `Module ${mod.id} must have at least one worked example`
    );
    assert.ok(
      mod.practiceProblems.length > 0,
      `Module ${mod.id} must have at least one practice problem`
    );

    const media = MODULE_MEDIA_MAP[mod.id];
    assert.ok(media, `Missing MODULE_MEDIA_MAP entry for module ${mod.id}`);
    assert.ok(
      media.videos.length > 0,
      `Module ${mod.id} must have at least one video lecture`
    );
    assert.ok(
      media.externalResources.length > 0,
      `Module ${mod.id} must have at least one external resource`
    );

    const textbook = allTextbooks[mod.id];
    assert.ok(
      textbook && textbook.length > 0,
      `Module ${mod.id} must have at least one textbook section`
    );
  }
});

test('Data integrity: every problem has a unique ID, valid answer option, non-empty solution, and matching module', () => {
  const moduleById = new Map(ALL_MODULES.map((m) => [m.id, m]));
  const seenProblemIds = new Set<string>();

  assert.equal(ALL_PROBLEMS.length, 60, 'Expected 60 mastery problems across all 20 modules');

  for (const prob of ALL_PROBLEMS) {
    assert.ok(!seenProblemIds.has(prob.id), `Duplicate problem ID: ${prob.id}`);
    seenProblemIds.add(prob.id);

    const parent = moduleById.get(prob.moduleId);
    assert.ok(parent, `Problem ${prob.id} references unknown module ${prob.moduleId}`);
    assert.equal(
      prob.course,
      parent.course,
      `Problem ${prob.id} course (${prob.course}) mismatches module course (${parent.course})`
    );

    assert.ok(prob.prompt.trim().length > 0, `Problem ${prob.id} has empty prompt`);
    assert.ok(prob.promptTex.trim().length > 0, `Problem ${prob.id} has empty promptTex`);
    assert.ok(prob.hint.trim().length > 0, `Problem ${prob.id} has empty hint`);
    assert.ok(prob.solutionTex.trim().length > 0, `Problem ${prob.id} has empty solutionTex`);
    assert.ok(
      prob.solutionExplanation.trim().length > 0,
      `Problem ${prob.id} has empty solutionExplanation`
    );

    assert.ok(prob.options.length >= 2, `Problem ${prob.id} must have at least 2 options`);
    const optIds = new Set(prob.options.map((o) => o.id));
    assert.equal(optIds.size, prob.options.length, `Problem ${prob.id} has duplicate option IDs`);
    assert.ok(
      optIds.has(prob.correctOptionId),
      `Problem ${prob.id} correctOptionId "${prob.correctOptionId}" not found in options`
    );
    for (const opt of prob.options) {
      assert.ok(
        opt.labelTex.trim().length > 0,
        `Problem ${prob.id} option ${opt.id} has empty labelTex`
      );
    }
  }
});

test('Data integrity: worked examples, formulas, and videos have unique IDs and valid fields', () => {
  const seenExampleIds = new Set<string>();
  for (const mod of ALL_MODULES) {
    for (const ex of mod.workedExamples) {
      assert.ok(!seenExampleIds.has(ex.id), `Duplicate worked example ID: ${ex.id}`);
      seenExampleIds.add(ex.id);
      assert.ok(ex.steps.length > 0, `Worked example ${ex.id} has no steps`);
      assert.ok(ex.finalAnswerTex.trim().length > 0, `Worked example ${ex.id} has empty final answer`);
    }
  }

  const seenFormulaIds = new Set<string>();
  for (const f of FORMULA_VAULT) {
    assert.ok(!seenFormulaIds.has(f.id), `Duplicate formula ID: ${f.id}`);
    seenFormulaIds.add(f.id);
    assert.ok(f.lhsTex.trim().length > 0, `Formula ${f.id} has empty lhsTex`);
    assert.ok(f.rhsTex.trim().length > 0, `Formula ${f.id} has empty rhsTex`);
    assert.ok(f.recallCue.trim().length > 0, `Formula ${f.id} has empty recallCue`);
  }

  const seenVideoIds = new Set<string>();
  const ytIdRegex = /^[A-Za-z0-9_-]{11}$/;
  for (const [modId, bundle] of Object.entries(MODULE_MEDIA_MAP)) {
    for (const vid of bundle.videos) {
      assert.ok(!seenVideoIds.has(vid.id), `Duplicate video ID ${vid.id} in ${modId}`);
      seenVideoIds.add(vid.id);
      assert.match(
        vid.youtubeId,
        ytIdRegex,
        `Video ${vid.id} has malformed YouTube ID: ${vid.youtubeId}`
      );
    }
    for (const res of bundle.externalResources) {
      assert.ok(
        res.url.startsWith('https://'),
        `External resource "${res.title}" in ${modId} must use https://`
      );
    }
  }
});

test('Data integrity: every ExamTemplate produces exact questionCount with valid answer keys', () => {
  const seenTemplateIds = new Set<string>();
  const moduleIds = new Set(ALL_MODULES.map((m) => m.id));

  for (const tpl of EXAM_TEMPLATES) {
    assert.ok(!seenTemplateIds.has(tpl.id), `Duplicate exam template ID: ${tpl.id}`);
    seenTemplateIds.add(tpl.id);
    if (tpl.moduleIds) {
      for (const mId of tpl.moduleIds) {
        assert.ok(moduleIds.has(mId), `Exam template ${tpl.id} references unknown module ${mId}`);
      }
    }
    const questions = selectProblemsForExam(tpl, () => 0.5);
    assert.equal(
      questions.length,
      tpl.questionCount,
      `Exam template ${tpl.id} returned ${questions.length} instead of ${tpl.questionCount}`
    );
    for (const q of questions) {
      assert.ok(
        q.options.some((o) => o.id === q.correctOptionId),
        `Shuffled question ${q.id} in ${tpl.id} lost its correctOptionId`
      );
    }
  }
});
