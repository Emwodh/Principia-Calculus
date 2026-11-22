export type CourseTrack = 'precalc' | 'calc1' | 'calc2';

export type StartingTrack = 'full' | 'calc1' | 'calc2';

export type NavView = 'plan' | 'studio' | 'exam' | 'formulas' | 'about';

export type StudioTab = 'videos' | 'theory' | 'lab' | 'examples' | 'practice';

export type PaceId = 'cram7' | 'sprint14' | 'standard28';

export type LabType =
  | 'precalc-functions'
  | 'precalc-quadratics'
  | 'precalc-rationals'
  | 'precalc-exp-log'
  | 'precalc-unit-circle'
  | 'limit'
  | 'derivative'
  | 'extrema'
  | 'riemann'
  | 'volume'
  | 'ibp'
  | 'trigsub'
  | 'improper'
  | 'ode'
  | 'series'
  | 'alternating'
  | 'taylor'
  | 'polar'
  | 'triage';

export interface VideoLecture {
  id: string;
  youtubeId: string;
  instructor: 'Professor Leonard' | '3Blue1Brown';
  lectureCode: string;
  title: string;
  focusSummary: string;
  watchStrategy: string;
  durationMinutes?: number;
}

export interface TextbookSection {
  heading: string;
  paragraphs: string[];
  keyFormulaTex?: string;
  keyFormulaCaption?: string;
  bulletPoints?: string[];
}

export interface ExternalResource {
  title: string;
  provider:
    | "Paul's Online Math Notes"
    | 'OpenStax Calculus'
    | 'OpenStax Precalculus 2e'
    | 'MIT OCW 18.01SC'
    | 'Professor Leonard Playlist';
  resourceKind?: 'theory' | 'exercises' | 'playlist';
  url: string;
  description: string;
}

export interface TheoremBlock {
  title: string;
  statement: string;
  formulaTex: string;
  intuition: string;
  examTip?: string;
}

export interface WorkedStep {
  label: string;
  explanation: string;
  mathTex: string;
}

export interface WorkedExample {
  id: string;
  title: string;
  difficulty: 'Core' | 'Exam Standard' | 'Challenge';
  problemTex: string;
  problemContext?: string;
  steps: WorkedStep[];
  finalAnswerTex: string;
}

export interface PracticeOption {
  id: string;
  labelTex: string;
}

export interface PracticeProblem {
  id: string;
  moduleId: string;
  course: CourseTrack;
  topicTag: string;
  difficulty: 'Core' | 'Exam Standard' | 'Challenge';
  prompt: string;
  promptTex: string;
  options: PracticeOption[];
  correctOptionId: string;
  hint: string;
  solutionTex: string;
  solutionExplanation: string;
}

export interface CourseModule {
  id: string;
  dayNumber: number;
  course: CourseTrack;
  phase: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  labType: LabType;
  labTitle: string;
  labObjective: string;
  keyTopics: string[];
  prerequisites: string[];
  studySprintChecklist: string[];
  theorems: TheoremBlock[];
  commonTraps: {
    trap: string;
    fix: string;
  }[];
  workedExamples: WorkedExample[];
  practiceProblems: PracticeProblem[];
}

export interface FormulaEntry {
  id: string;
  category:
    | 'Precalculus Prep & Trig'
    | 'Limits & Continuity'
    | 'Derivatives'
    | 'Integrals'
    | 'Integration Techniques'
    | 'Series & Convergence'
    | 'Taylor & Maclaurin'
    | 'Parametric & Polar';
  course: CourseTrack;
  name: string;
  lhsTex: string;
  relationTex?: string;
  rhsTex: string;
  condition?: string;
  recallCue: string;
}

export interface ExamTemplate {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  questionCount: number;
  filterCourse: CourseTrack | 'both';
  moduleIds?: string[];
}

export interface ExamAttemptRecord {
  id: string;
  templateId: string;
  title: string;
  completedAtIso: string;
  score: number;
  total: number;
  durationSeconds: number;
}

export interface UserProgressState {
  schemaVersion: number;
  paceId: PaceId;
  startingTrack: StartingTrack;
  startDateIso: string;
  completedModuleIds: string[];
  watchedVideoIds: string[];
  lastVideoByModule: Record<string, string>;
  solvedProblemIds: Record<string, { selectedOptionId: string; isCorrect: boolean }>;
  examHistory: ExamAttemptRecord[];
  activeModuleId: string;
}
