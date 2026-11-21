import { PREALG_MODULES } from './curriculumPreAlg';
import { CALC1_MODULES } from './curriculumCalc1';
import { CALC2_MODULES } from './curriculumCalc2';
import type { CourseModule, ExamTemplate, PracticeProblem } from '../types/course';

export const ALL_MODULES: CourseModule[] = [
  ...PREALG_MODULES,
  ...CALC1_MODULES,
  ...CALC2_MODULES,
];

export const ALL_PROBLEMS: PracticeProblem[] = ALL_MODULES.flatMap(
  (m) => m.practiceProblems
);

export const EXAM_TEMPLATES: ExamTemplate[] = [
  {
    id: 'exam-prealg-readiness',
    title: 'Pre-Algebra & Precalculus Readiness Check',
    subtitle: 'Domains, difference quotients, completing the square, asymptotes, logarithms, unit circle, and trig equations.',
    durationMinutes: 25,
    questionCount: 15,
    filterCourse: 'prealg',
  },
  {
    id: 'exam-calc1-midterm',
    title: 'Calculus I Comprehensive Midterm',
    subtitle: 'Limits, differentiation rules, optimization, FTC, u-sub, and volumes of revolution.',
    durationMinutes: 25,
    questionCount: 12,
    filterCourse: 'calc1',
  },
  {
    id: 'exam-integration-blitz',
    title: 'Integration Techniques Speed Blitz',
    subtitle: 'High-intensity drill across u-sub, IBP, trig integrals, trig sub, partial fractions, and improper integrals.',
    durationMinutes: 20,
    questionCount: 12,
    filterCourse: 'both',
    moduleIds: [
      'calc1-integrals',
      'calc2-ibp-trig',
      'calc2-trigsub-pf',
      'calc2-improper',
      'calc2-synthesis',
    ],
  },
  {
    id: 'exam-series-blitz',
    title: 'Infinite Series & Taylor Mastery Test',
    subtitle: 'Geometric sums, convergence tests, alternating error bounds, radius of convergence, and Maclaurin series.',
    durationMinutes: 20,
    questionCount: 10,
    filterCourse: 'calc2',
    moduleIds: ['calc2-series-1', 'calc2-series-2', 'calc2-taylor', 'calc2-synthesis'],
  },
  {
    id: 'exam-calc2-final',
    title: 'Calculus II University Final Exam',
    subtitle: 'All Calculus II topics: advanced integration, ODEs, infinite series, Taylor polynomials, and polar curves.',
    durationMinutes: 35,
    questionCount: 18,
    filterCourse: 'calc2',
  },
  {
    id: 'exam-full-gauntlet',
    title: 'Full Calc I & II Mastery Gauntlet',
    subtitle: 'Complete end-to-end diagnostic sampling every single day from Day 1 Limits to Day 14 Synthesis.',
    durationMinutes: 45,
    questionCount: 24,
    filterCourse: 'both',
  },
];

function shuffleWithRng<T>(items: T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const OPTION_LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'];

function shuffleProblemOptions(
  problem: PracticeProblem,
  rng: () => number
): PracticeProblem {
  const shuffledOpts = shuffleWithRng(problem.options, rng);
  let newCorrectId = problem.correctOptionId;
  const remappedOptions = shuffledOpts.map((opt, idx) => {
    const letter = OPTION_LETTERS[idx] ?? opt.id;
    if (opt.id === problem.correctOptionId) {
      newCorrectId = letter;
    }
    return {
      id: letter,
      labelTex: opt.labelTex,
    };
  });
  return {
    ...problem,
    options: remappedOptions,
    correctOptionId: newCorrectId,
  };
}

export function selectProblemsForExam(
  template: ExamTemplate,
  rng: () => number = Math.random
): PracticeProblem[] {
  let pool = ALL_PROBLEMS;
  if (template.moduleIds && template.moduleIds.length > 0) {
    const allowed = new Set(template.moduleIds);
    pool = pool.filter((p) => allowed.has(p.moduleId));
  } else if (template.filterCourse === 'both') {
    pool = pool.filter((p) => p.course === 'calc1' || p.course === 'calc2');
  } else {
    pool = pool.filter((p) => p.course === template.filterCourse);
  }

  // Group eligible problems by moduleId and shuffle within each module
  const moduleOrder: string[] = [];
  const buckets = new Map<string, PracticeProblem[]>();
  for (const prob of pool) {
    if (!buckets.has(prob.moduleId)) {
      moduleOrder.push(prob.moduleId);
      buckets.set(prob.moduleId, []);
    }
    buckets.get(prob.moduleId)!.push(prob);
  }

  const shuffledBuckets = new Map<string, PracticeProblem[]>();
  for (const modId of moduleOrder) {
    shuffledBuckets.set(modId, shuffleWithRng(buckets.get(modId)!, rng));
  }

  // Stratified round-robin sampling guarantees every covered module appears before repeats
  const picked: PracticeProblem[] = [];
  const orderedModIds = shuffleWithRng(moduleOrder, rng);
  let round = 0;
  while (picked.length < template.questionCount) {
    let addedInRound = false;
    for (const modId of orderedModIds) {
      const bucket = shuffledBuckets.get(modId)!;
      if (round < bucket.length) {
        picked.push(bucket[round]);
        addedInRound = true;
        if (picked.length >= template.questionCount) break;
      }
    }
    if (!addedInRound) break;
    round += 1;
  }

  // Shuffle final question sequence and randomize A/B/C/D option order
  return shuffleWithRng(picked, rng).map((p) => shuffleProblemOptions(p, rng));
}
