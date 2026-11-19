import { CALC1_MODULES } from './curriculumCalc1';
import { CALC2_MODULES } from './curriculumCalc2';
import type { CourseModule, ExamTemplate, PracticeProblem } from '../types/course';

export const ALL_MODULES: CourseModule[] = [...CALC1_MODULES, ...CALC2_MODULES];

export const ALL_PROBLEMS: PracticeProblem[] = ALL_MODULES.flatMap(
  (m) => m.practiceProblems
);

export const EXAM_TEMPLATES: ExamTemplate[] = [
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

export function selectProblemsForExam(template: ExamTemplate): PracticeProblem[] {
  let pool = ALL_PROBLEMS;
  if (template.moduleIds && template.moduleIds.length > 0) {
    const allowed = new Set(template.moduleIds);
    pool = pool.filter((p) => allowed.has(p.moduleId));
  } else if (template.filterCourse !== 'both') {
    pool = pool.filter((p) => p.course === template.filterCourse);
  }
  return pool.slice(0, template.questionCount);
}
