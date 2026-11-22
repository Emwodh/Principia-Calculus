import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Flag, RotateCcw } from 'lucide-react';
import { EXAM_TEMPLATES, selectProblemsForExam } from '../data/curriculum';
import type {
  ExamAttemptRecord,
  ExamTemplate,
  PracticeProblem,
} from '../types/course';
import {
  formatCourseTrackName,
  gradeExamSubmission,
  type ExamGradeReport,
} from '../utils/courseProgress';
import { buildMathErrorIssueUrl } from '../utils/issueLinks';
import { MathTex } from './MathTex';

interface DrillExamViewProps {
  examHistory: ExamAttemptRecord[];
  onSaveExamAttempt: (record: ExamAttemptRecord) => void;
  onJumpToModule: (moduleId: string) => void;
  onExamActiveChange?: (isActive: boolean) => void;
}

function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function DrillExamView({
  examHistory,
  onSaveExamAttempt,
  onJumpToModule,
  onExamActiveChange,
}: DrillExamViewProps) {
  const [activeTemplate, setActiveTemplate] = useState<ExamTemplate | null>(null);
  const [questions, setQuestions] = useState<PracticeProblem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [report, setReport] = useState<ExamGradeReport | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);

  const isExamRunning = Boolean(activeTemplate && !report);

  useEffect(() => {
    onExamActiveChange?.(isExamRunning);
    return () => {
      onExamActiveChange?.(false);
    };
  }, [isExamRunning, onExamActiveChange]);

  const bestPercentByTemplate = useMemo(() => {
    const best: Record<string, number> = {};
    for (const attempt of examHistory) {
      if (attempt.total <= 0) continue;
      const pct = Math.round((attempt.score / attempt.total) * 100);
      if (best[attempt.templateId] === undefined || pct > best[attempt.templateId]) {
        best[attempt.templateId] = pct;
      }
    }
    return best;
  }, [examHistory]);

  const startExam = (template: ExamTemplate) => {
    const selected = selectProblemsForExam(template);
    setActiveTemplate(template);
    setQuestions(selected);
    setCurrentIdx(0);
    setAnswers({});
    setSecondsLeft(template.durationMinutes * 60);
    setElapsedSeconds(0);
    setReport(null);
    setConfirmExit(false);
    setConfirmSubmit(false);
  };

  const exitExamToLobby = () => {
    setActiveTemplate(null);
    setQuestions([]);
    setAnswers({});
    setReport(null);
    setConfirmExit(false);
    setConfirmSubmit(false);
  };

  const submitExam = () => {
    if (!activeTemplate || report) return;
    setConfirmSubmit(false);
    setConfirmExit(false);
    const graded = gradeExamSubmission(questions, answers);
    setReport(graded);
    onSaveExamAttempt({
      id: `${activeTemplate.id}-${Date.now()}`,
      templateId: activeTemplate.id,
      title: activeTemplate.title,
      completedAtIso: new Date().toISOString(),
      score: graded.score,
      total: graded.total,
      durationSeconds: elapsedSeconds,
    });
  };

  const handleRequestSubmit = () => {
    const answered = Object.keys(answers).length;
    if (answered < questions.length) {
      setConfirmExit(false);
      setConfirmSubmit(true);
    } else {
      submitExam();
    }
  };

  useEffect(() => {
    if (!activeTemplate || report) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((e) => e + 1);
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeTemplate, report]);

  // Auto-submit if countdown reaches 0
  useEffect(() => {
    if (activeTemplate && !report && secondsLeft === 0 && elapsedSeconds > 0) {
      submitExam();
    }
  }, [secondsLeft]);

  // Keyboard shortcuts during active exam (A-D / 1-4 select option, Left/Right navigate)
  // Can be toggled off so single-character shortcuts never conflict with screen readers.
  useEffect(() => {
    if (!activeTemplate || report || questions.length === 0 || !shortcutsEnabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'A' ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const activeQ = questions[currentIdx];
      if (!activeQ) return;

      if (key === 'arrowleft') {
        e.preventDefault();
        setCurrentIdx((i) => Math.max(0, i - 1));
      } else if (key === 'arrowright') {
        e.preventDefault();
        setCurrentIdx((i) => Math.min(questions.length - 1, i + 1));
      } else {
        const optionIndex = ['a', 'b', 'c', 'd'].indexOf(key) !== -1
          ? ['a', 'b', 'c', 'd'].indexOf(key)
          : ['1', '2', '3', '4'].indexOf(key);
        if (optionIndex >= 0 && activeQ.options[optionIndex]) {
          const optId = activeQ.options[optionIndex].id;
          setAnswers((prev) => ({ ...prev, [activeQ.id]: optId }));
          setConfirmSubmit(false);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeTemplate, report, questions, currentIdx, shortcutsEnabled]);

  // 1. Exam Selection Lobby
  if (!activeTemplate) {
    return (
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-10">
        <div className="space-y-2 max-w-3xl">
          <div className="text-xs font-medium text-[#475569]">
            Timed Assessment Center · Stratified &amp; Shuffled on Every Attempt
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F172A] text-balance">
            University Practice Exams &amp; Topic Drills
          </h1>
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            Test your understanding across readiness checks, midterms, and comprehensive
            finals. Questions are sampled evenly across every covered module with
            randomized choice order so retakes measure genuine recall.
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXAM_TEMPLATES.map((tpl) => {
            const bestPct = bestPercentByTemplate[tpl.id];
            const trackLabel =
              tpl.filterCourse === 'both'
                ? 'Calc I & II'
                : formatCourseTrackName(tpl.filterCourse);
            return (
              <article
                key={tpl.id}
                className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 flex flex-col justify-between gap-6 hover:border-[#94A3B8] transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569] font-mono-tabular">
                    <span>{tpl.questionCount} questions</span>
                    <span aria-hidden="true">·</span>
                    <span>{tpl.durationMinutes} min</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-sans">{trackLabel}</span>
                    {bestPct !== undefined && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-[#059669]">Best {bestPct}%</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-display text-xl font-semibold text-[#0F172A]">
                    {tpl.title}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">{tpl.subtitle}</p>
                </div>

                <button
                  type="button"
                  onClick={() => startExam(tpl)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors cursor-pointer"
                >
                  <span>{bestPct !== undefined ? 'Retake Timed Exam' : 'Start Timed Exam'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </article>
            );
          })}
        </section>

        {/* Recent Exam Attempts */}
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-[#0F172A]">
            Recent Exam Scores
          </h2>
          {examHistory.length === 0 ? (
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 text-sm text-[#475569]">
              No completed exam attempts yet. Launch any assessment above to establish
              your baseline score.
            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl divide-y divide-[#E2E8F0] overflow-hidden">
              {examHistory.slice(0, 6).map((attempt) => {
                const pct =
                  attempt.total > 0
                    ? Math.round((attempt.score / attempt.total) * 100)
                    : 0;
                return (
                  <div
                    key={attempt.id}
                    className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-sm"
                  >
                    <div>
                      <div className="font-semibold text-[#0F172A]">{attempt.title}</div>
                      <div className="text-xs text-[#475569] font-mono-tabular">
                        Completed in {formatClock(attempt.durationSeconds)}
                      </div>
                    </div>
                    <div className="font-mono-tabular text-right">
                      <span
                        className={`text-base font-semibold ${
                          pct >= 80
                            ? 'text-[#059669]'
                            : pct >= 60
                              ? 'text-[#D97706]'
                              : 'text-[#DC2626]'
                        }`}
                      >
                        {attempt.score}/{attempt.total} ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    );
  }

  // 2. Graded Exam Results & Mistake Review
  if (report) {
    return (
      <main className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
        <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-medium text-[#475569]">
                Graded Report · {activeTemplate.title}
              </div>
              <h1 className="font-display text-3xl font-semibold text-[#0F172A]">
                Score: {report.score} / {report.total} ({report.percent}%)
              </h1>
              <p className="text-sm text-[#475569] font-mono-tabular">
                Time elapsed: {formatClock(elapsedSeconds)} ·{' '}
                {report.percent >= 85
                  ? 'Exam-Ready Mastery'
                  : report.percent >= 65
                    ? 'Solid Foundation — Review Missed Topics Below'
                    : 'Target Weak Modules Below Before Retesting'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => startExam(activeTemplate)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0F172A] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake (Reshuffled)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTemplate(null);
                  setReport(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg cursor-pointer"
              >
                All Exams
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-[#E2E8F0]">
            {report.byCourse.precalc.total > 0 && (
              <div className="p-4 bg-[#F8FAFC] rounded-lg font-mono-tabular">
                <div className="text-xs text-[#475569] font-sans">Precalculus Prep Accuracy</div>
                <div className="text-lg font-semibold text-[#0F172A] mt-1">
                  {report.byCourse.precalc.correct}/{report.byCourse.precalc.total} correct
                </div>
              </div>
            )}
            {report.byCourse.calc1.total > 0 && (
              <div className="p-4 bg-[#F8FAFC] rounded-lg font-mono-tabular">
                <div className="text-xs text-[#475569] font-sans">Calculus I Accuracy</div>
                <div className="text-lg font-semibold text-[#0F172A] mt-1">
                  {report.byCourse.calc1.correct}/{report.byCourse.calc1.total} correct
                </div>
              </div>
            )}
            {report.byCourse.calc2.total > 0 && (
              <div className="p-4 bg-[#F8FAFC] rounded-lg font-mono-tabular">
                <div className="text-xs text-[#475569] font-sans">Calculus II Accuracy</div>
                <div className="text-lg font-semibold text-[#0F172A] mt-1">
                  {report.byCourse.calc2.correct}/{report.byCourse.calc2.total} correct
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Full Solution Review */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-[#0F172A]">
            {report.missedProblems.length > 0
              ? `Missed Problem Derivations (${report.missedProblems.length})`
              : 'Perfect Score — Zero Missed Problems'}
          </h2>

          {report.missedProblems.length === 0 ? (
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-6 text-sm text-[#065F46] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>
                Outstanding execution. You answered every question on {activeTemplate.title}{' '}
                correctly.
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {report.missedProblems.map((prob) => {
                const pickedId = answers[prob.id];
                const pickedOpt = prob.options.find((o) => o.id === pickedId);
                const correctOpt = prob.options.find((o) => o.id === prob.correctOptionId);
                return (
                  <article
                    key={prob.id}
                    className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#475569]">
                      <span>
                        {formatCourseTrackName(prob.course)} · {prob.topicTag}
                      </span>
                      <div className="flex items-center gap-3">
                        <a
                          href={buildMathErrorIssueUrl({
                            itemId: prob.id,
                            itemLabel: prob.topicTag,
                            kind: 'problem',
                            context: activeTemplate.title,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#475569] hover:text-[#1D4ED8] font-medium"
                        >
                          <Flag className="w-3 h-3" />
                          <span>Report an error</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => onJumpToModule(prob.moduleId)}
                          className="text-[#1D4ED8] hover:underline font-medium cursor-pointer"
                        >
                          Open Source Lesson
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-[#0F172A]">{prob.prompt}</p>
                    <div className="px-4 py-3 bg-[#F8FAFC] rounded-lg">
                      <MathTex tex={prob.promptTex} display />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B]">
                        <div className="font-semibold mb-1">Your Answer</div>
                        {pickedOpt ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono-tabular uppercase font-semibold">
                              ({pickedOpt.id})
                            </span>
                            <MathTex tex={pickedOpt.labelTex} />
                          </div>
                        ) : (
                          <span>Unanswered</span>
                        )}
                      </div>
                      <div className="p-3 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46]">
                        <div className="font-semibold mb-1">Correct Answer</div>
                        {correctOpt && (
                          <div className="flex items-center gap-2">
                            <span className="font-mono-tabular uppercase font-semibold">
                              ({correctOpt.id})
                            </span>
                            <MathTex tex={correctOpt.labelTex} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2">
                      <div className="text-xs font-semibold text-[#0F172A]">
                        Full Derivation
                      </div>
                      <MathTex tex={prob.solutionTex} display className="text-[#0F172A]" />
                      <p className="text-xs text-[#334155]">{prob.solutionExplanation}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    );
  }

  // 3. Active Timed Exam Session
  const activeQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);
  const progressPct =
    questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <main className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Exam Top Bar with Progress & Safe Exit / Submit Confirmation */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="h-1 w-full bg-[#E2E8F0]">
          <div
            className="h-full bg-[#1D4ED8] transition-all duration-200"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {!confirmExit ? (
              <button
                type="button"
                onClick={() => {
                  if (answeredCount === 0) {
                    exitExamToLobby();
                  } else {
                    setConfirmSubmit(false);
                    setConfirmExit(true);
                  }
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#475569] hover:text-[#0F172A] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-xs">
                <span className="text-[#DC2626] font-medium">Leave exam?</span>
                <button
                  type="button"
                  onClick={exitExamToLobby}
                  className="px-2 py-1 font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded cursor-pointer"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmExit(false)}
                  className="px-2 py-1 text-[#475569] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            <div>
              <div className="text-xs text-[#475569]">{activeTemplate.title}</div>
              <div className="text-sm font-semibold text-[#0F172A] font-mono-tabular">
                Question {currentIdx + 1} of {questions.length} · {answeredCount} answered
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`inline-flex items-center gap-1.5 font-mono-tabular text-sm font-semibold ${
                secondsLeft < 180 ? 'text-[#DC2626]' : 'text-[#0F172A]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatClock(secondsLeft)}</span>
            </div>

            <button
              type="button"
              onClick={handleRequestSubmit}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg cursor-pointer"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Inline Unanswered Confirmation Guard */}
        {confirmSubmit && (
          <div className="px-4 sm:px-6 py-3 bg-[#FFFBEB] border-t border-[#FDE68A] flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-[#92400E] font-medium">
              You still have{' '}
              <strong className="font-mono-tabular">{unansweredCount}</strong> unanswered{' '}
              {unansweredCount === 1 ? 'question' : 'questions'}. Grade exam now?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={submitExam}
                className="px-3 py-1.5 font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-md cursor-pointer"
              >
                Confirm Submit
              </button>
              <button
                type="button"
                onClick={() => setConfirmSubmit(false)}
                className="px-3 py-1.5 font-medium text-[#334155] bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-md cursor-pointer"
              >
                Keep Working
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Question Card */}
      <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between gap-3 text-xs text-[#475569]">
          <span>
            {formatCourseTrackName(activeQ.course)} · {activeQ.topicTag} · {activeQ.difficulty}
          </span>
          <a
            href={buildMathErrorIssueUrl({
              itemId: activeQ.id,
              itemLabel: activeQ.topicTag,
              kind: 'problem',
              context: activeTemplate.title,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#475569] hover:text-[#1D4ED8] font-medium whitespace-nowrap"
          >
            <Flag className="w-3 h-3" />
            <span>Report an error</span>
          </a>
        </div>

        <p className="text-base font-medium text-[#0F172A]">{activeQ.prompt}</p>

        <div className="py-5 px-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
          <MathTex tex={activeQ.promptTex} display className="text-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeQ.options.map((opt) => {
            const selected = answers[activeQ.id] === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, [activeQ.id]: opt.id }));
                  setConfirmSubmit(false);
                }}
                aria-pressed={selected}
                className={`px-4 py-3.5 rounded-lg border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                  selected
                    ? 'bg-[#EFF6FF] border-[#1D4ED8] text-[#1E3A8A]'
                    : 'bg-[#FFFFFF] border-[#CBD5E1] text-[#0F172A] hover:border-[#64748B]'
                }`}
              >
                <span className="font-mono-tabular text-xs font-semibold uppercase shrink-0">
                  {opt.id}.
                </span>
                <MathTex tex={opt.labelTex} className="text-sm" />
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            className="px-4 py-2 text-xs font-medium text-[#334155] bg-[#F1F5F9] hover:bg-[#E2E8F0] disabled:opacity-40 rounded-lg cursor-pointer"
          >
            Previous
          </button>

          {currentIdx < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg cursor-pointer"
            >
              Next Question
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRequestSubmit}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg cursor-pointer"
            >
              Finish &amp; Grade Exam
            </button>
          )}
        </div>
      </section>

      {/* Question Palette & Keyboard Shortcut Legend */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIdx;
            const isAnswered = Boolean(answers[q.id]);
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Go to question ${idx + 1}`}
                className={`w-9 h-9 rounded-lg text-xs font-mono-tabular font-semibold border cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                    : isAnswered
                      ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#93C5FD]'
                      : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:border-[#94A3B8]'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Question {currentIdx + 1} of {questions.length}: {activeQ.topicTag}.{' '}
          {answers[activeQ.id] ? `Selected option ${answers[activeQ.id]}.` : 'Not yet answered.'}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#E2E8F0]">
          <div className="text-xs text-[#475569] font-mono-tabular">
            {shortcutsEnabled
              ? 'Keyboard shortcuts on: A–D (or 1–4) select answer · ← / → switch questions'
              : 'Single-key shortcuts paused (screen-reader safe mode)'}
          </div>
          <button
            type="button"
            aria-pressed={shortcutsEnabled}
            onClick={() => setShortcutsEnabled((prev) => !prev)}
            className="px-2.5 py-1 text-xs font-medium text-[#334155] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-md cursor-pointer"
          >
            Keyboard shortcuts: {shortcutsEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>
    </main>
  );
}
