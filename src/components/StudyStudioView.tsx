import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  ExternalLink,
  Eye,
  HelpCircle,
  List,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import { MODULE_MEDIA_MAP } from '../data/moduleMediaAndNotes';
import { TEXTBOOK_CALC1 } from '../data/moduleTextbookCalc1';
import { TEXTBOOK_CALC2 } from '../data/moduleTextbookCalc2';
import type { CourseModule, StudioTab, UserProgressState } from '../types/course';
import { getModuleScheduleSlot } from '../utils/courseProgress';
import { InteractiveLab } from './InteractiveLab';
import { MathTex } from './MathTex';
import { VideoCourseTheater } from './VideoCourseTheater';

interface StudyStudioViewProps {
  modules: CourseModule[];
  activeModule: CourseModule;
  progress: UserProgressState;
  onSelectModule: (moduleId: string) => void;
  onToggleComplete: (moduleId: string) => void;
  onToggleWatchedVideo: (videoId: string) => void;
  onRecordAnswer: (problemId: string, selectedOptionId: string, isCorrect: boolean) => void;
  onBackToPlan: () => void;
}

const STUDIO_TABS: { id: StudioTab; label: string }[] = [
  { id: 'videos', label: '1. Video Lectures' },
  { id: 'theory', label: '2. Full Textbook & Theory' },
  { id: 'lab', label: '3. Interactive Lab' },
  { id: 'examples', label: '4. Worked Examples' },
  { id: 'practice', label: '5. Mastery Check' },
];

export function StudyStudioView({
  modules,
  activeModule,
  progress,
  onSelectModule,
  onToggleComplete,
  onToggleWatchedVideo,
  onRecordAnswer,
  onBackToPlan,
}: StudyStudioViewProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>('videos');
  const [mobileRailOpen, setMobileRailOpen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [revealedStepsByExample, setRevealedStepsByExample] = useState<Record<string, number>>({});
  const [shownHints, setShownHints] = useState<Record<string, boolean>>({});

  // Reset per-module interactive state when switching days
  useEffect(() => {
    setActiveTab('videos');
    setRevealedStepsByExample({});
    setShownHints({});
    setMobileRailOpen(false);
  }, [activeModule.id]);

  const completedSet = new Set(progress.completedModuleIds);
  const watchedSet = new Set(progress.watchedVideoIds);
  const isCompleted = completedSet.has(activeModule.id);
  const currentIndex = modules.findIndex((m) => m.id === activeModule.id);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  const scheduleSlot = getModuleScheduleSlot(
    activeModule.dayNumber,
    progress.paceId,
    progress.startDateIso
  );

  const mediaBundle = MODULE_MEDIA_MAP[activeModule.id] ?? {
    videos: [],
    externalResources: [],
  };
  const textbookSections =
    TEXTBOOK_CALC1[activeModule.id] ?? TEXTBOOK_CALC2[activeModule.id] ?? [];

  const watchedInModule = mediaBundle.videos.filter((v) => watchedSet.has(v.id)).length;

  const solvedCorrectInModule = activeModule.practiceProblems.filter(
    (p) => progress.solvedProblemIds[p.id]?.isCorrect
  ).length;

  const syllabusContent = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToPlan}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#0F172A] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Course Plan</span>
        </button>
        <span className="text-xs font-mono-tabular text-[#64748B]">
          {progress.completedModuleIds.length}/{modules.length}
        </span>
      </div>

      {(['calc1', 'calc2'] as const).map((courseKey) => {
        const courseMods = modules.filter((m) => m.course === courseKey);
        return (
          <div key={courseKey} className="space-y-1.5">
            <div className="text-xs font-semibold text-[#64748B] px-2 pb-1 border-b border-[#E2E8F0]">
              {courseKey === 'calc1' ? 'Calculus I (Days 1–5)' : 'Calculus II (Days 6–14)'}
            </div>
            <ul className="space-y-0.5">
              {courseMods.map((mod) => {
                const isSelected = mod.id === activeModule.id;
                const done = completedSet.has(mod.id);
                const modVids = MODULE_MEDIA_MAP[mod.id]?.videos ?? [];
                const modWatched = modVids.filter((v) => watchedSet.has(v.id)).length;
                return (
                  <li key={mod.id}>
                    <button
                      type="button"
                      onClick={() => onSelectModule(mod.id)}
                      aria-current={isSelected ? 'true' : undefined}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-start gap-2.5 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#EFF6FF] text-[#1D4ED8] font-semibold'
                          : 'text-[#334155] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#CBD5E1] shrink-0 mt-0.5" />
                      )}
                      <span className="min-w-0 flex-1 leading-snug">
                        <span className="font-mono-tabular mr-1">
                          D{mod.dayNumber}
                        </span>
                        {mod.title}
                      </span>
                      {modWatched > 0 && (
                        <span className="font-mono-tabular text-[10px] text-[#64748B] shrink-0 mt-0.5">
                          {modWatched}/{modVids.length}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
      {/* Mobile Syllabus Drawer Trigger */}
      <div className="lg:hidden mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setMobileRailOpen((o) => !o)}
          aria-expanded={mobileRailOpen}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0F172A] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg cursor-pointer"
        >
          {mobileRailOpen ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
          <span>{mobileRailOpen ? 'Close Syllabus' : `Syllabus (Day ${activeModule.dayNumber}/14)`}</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleComplete(activeModule.id)}
          className={`px-3 py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
            isCompleted
              ? 'bg-[#ECFDF5] border-[#059669] text-[#065F46]'
              : 'bg-[#FFFFFF] border-[#CBD5E1] text-[#334155]'
          }`}
        >
          {isCompleted ? 'Completed' : 'Mark Complete'}
        </button>
      </div>

      {mobileRailOpen && (
        <div className="lg:hidden mb-6 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
          {syllabusContent}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Left Syllabus Rail (collapsible for Theater Mode) */}
        {!isTheaterMode && (
          <aside
            aria-label="Course syllabus navigation"
            className="hidden lg:block lg:col-span-3 sticky top-20 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 max-h-[calc(100vh-6.5rem)] overflow-y-auto"
          >
            {syllabusContent}
          </aside>
        )}

        {/* Main Studio Workspace */}
        <main className={`${isTheaterMode ? 'lg:col-span-12' : 'lg:col-span-9'} space-y-5 min-w-0`}>
          {/* Module Header */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 sm:p-5 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] font-mono-tabular">
                  <span className="font-semibold text-[#1D4ED8]">
                    {scheduleSlot.scheduleDayLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{scheduleSlot.formattedDate}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-sans">{activeModule.phase}</span>
                  <span aria-hidden="true">·</span>
                  <span>{mediaBundle.videos.length} lectures</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeModule.estimatedMinutes} min</span>
                </div>

                <h1 className="font-display text-2xl sm:text-[1.75rem] font-semibold text-[#0F172A] leading-tight text-balance">
                  {String(activeModule.dayNumber).padStart(2, '0')}. {activeModule.title}
                </h1>

                <p className="text-sm text-[#475569] leading-relaxed max-w-4xl">
                  {activeModule.subtitle}
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTheaterMode((prev) => !prev)}
                  aria-pressed={isTheaterMode}
                  title={isTheaterMode ? 'Show course syllabus sidebar' : 'Hide syllabus for wider view'}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#334155] hover:text-[#0F172A] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg whitespace-nowrap cursor-pointer"
                >
                  {isTheaterMode ? (
                    <>
                      <PanelLeftOpen className="w-4 h-4" />
                      <span>Show Syllabus</span>
                    </>
                  ) : (
                    <>
                      <PanelLeftClose className="w-4 h-4" />
                      <span>Wide View</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onToggleComplete(activeModule.id)}
                  aria-pressed={isCompleted}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isCompleted
                      ? 'bg-[#ECFDF5] border-[#059669] text-[#065F46] hover:bg-[#D1FAE5]'
                      : 'bg-[#FFFFFF] border-[#CBD5E1] text-[#0F172A] hover:border-[#1D4ED8]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#94A3B8]" />
                  )}
                  <span>{isCompleted ? 'Lesson Completed' : 'Mark Lesson Complete'}</span>
                </button>
              </div>
            </div>

            {/* 5-Stage Studio Sub-Navigation */}
            <div
              role="tablist"
              aria-label="Lesson learning stages"
              className="pt-2 border-t border-[#E2E8F0] flex flex-nowrap sm:flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0"
            >
              {STUDIO_TABS.map((tab) => {
                const selected = activeTab === tab.id;
                let badgeText = '';
                if (tab.id === 'videos' && mediaBundle.videos.length > 0) {
                  badgeText = ` (${watchedInModule}/${mediaBundle.videos.length})`;
                } else if (tab.id === 'practice') {
                  badgeText = ` (${solvedCorrectInModule}/${activeModule.practiceProblems.length})`;
                }
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
                      selected
                        ? 'bg-[#1D4ED8] text-white'
                        : 'bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    {tab.label}
                    {badgeText}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: Embedded Professor Leonard Video Course & Curated Web References */}
          {activeTab === 'videos' && (
            <VideoCourseTheater
              moduleDayNumber={activeModule.dayNumber}
              videos={mediaBundle.videos}
              externalResources={mediaBundle.externalResources}
              watchedVideoIds={progress.watchedVideoIds}
              isTheaterMode={isTheaterMode}
              onToggleTheaterMode={() => setIsTheaterMode((prev) => !prev)}
              onToggleWatchedVideo={onToggleWatchedVideo}
              onProceedToTextbook={() => setActiveTab('theory')}
            />
          )}

          {/* TAB 2: Complete University Textbook Chapter, Formal Theorems & Exam Traps */}
          {activeTab === 'theory' && (
            <div className="space-y-6">
              {/* Full Multi-Section University Textbook Notes */}
              {textbookSections.length > 0 && (
                <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 sm:p-8 space-y-6">
                  <div className="pb-4 border-b border-[#E2E8F0] space-y-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <div className="text-xs font-medium text-[#1D4ED8]">
                          Chapter {activeModule.dayNumber} · Complete University Lecture Notes
                        </div>
                        <h2 className="font-display text-2xl font-semibold text-[#0F172A] mt-1">
                          {activeModule.title}
                        </h2>
                      </div>
                      <span className="text-xs font-mono-tabular text-[#64748B]">
                        {textbookSections.length} textbook sections
                      </span>
                    </div>

                    {/* Quick In-Chapter Jump Bar */}
                    <nav
                      aria-label="Jump to textbook section"
                      className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs pt-1"
                    >
                      <span className="text-[#64748B] font-medium">Jump to:</span>
                      {textbookSections.map((sec, sIdx) => (
                        <a
                          key={sIdx}
                          href={`#tb-sec-${sIdx}`}
                          className="text-[#1D4ED8] hover:underline font-medium"
                        >
                          {sec.heading.split(':')[0]}
                        </a>
                      ))}
                      <a href="#tb-theorems" className="text-[#1D4ED8] hover:underline font-medium">
                        Core Theorems
                      </a>
                      <a href="#tb-traps" className="text-[#1D4ED8] hover:underline font-medium">
                        Exam Traps
                      </a>
                    </nav>
                  </div>

                  <div className="divide-y divide-[#E2E8F0]">
                    {textbookSections.map((sec, sIdx) => (
                      <article
                        key={sIdx}
                        id={`tb-sec-${sIdx}`}
                        className="py-6 first:pt-0 last:pb-0 space-y-4 scroll-mt-24"
                      >
                        <h3 className="font-display text-lg sm:text-xl font-semibold text-[#0F172A]">
                          {sec.heading}
                        </h3>

                        <div className="space-y-3.5 max-w-[72ch]">
                          {sec.paragraphs.map((para, pIdx) => (
                            <p
                              key={pIdx}
                              className="text-[15px] text-[#334155] leading-relaxed"
                            >
                              {para}
                            </p>
                          ))}
                        </div>

                        {sec.keyFormulaTex && (
                          <div className="py-4 px-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2">
                            <MathTex
                              tex={sec.keyFormulaTex}
                              display
                              className="text-base sm:text-lg"
                            />
                            {sec.keyFormulaCaption && (
                              <p className="text-xs text-[#64748B] text-center">
                                {sec.keyFormulaCaption}
                              </p>
                            )}
                          </div>
                        )}

                        {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                          <ul className="list-disc pl-5 space-y-2 text-sm text-[#334155] leading-relaxed max-w-[72ch]">
                            {sec.bulletPoints.map((pt, bIdx) => (
                              <li key={bIdx}>{pt}</li>
                            ))}
                          </ul>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Core Theorems & Formal Proofs */}
              <div id="tb-theorems" className="space-y-4 scroll-mt-24">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] px-1">
                  <BookOpen className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                  <span>Essential Theorems &amp; Exam Shortcuts</span>
                </div>

                {activeModule.theorems.map((thm, idx) => (
                  <article
                    key={idx}
                    className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-4"
                  >
                    <div className="flex items-center gap-2 text-xs font-medium text-[#1D4ED8]">
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span>Core Theorem 0{idx + 1}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[#0F172A]">
                      {thm.title}
                    </h3>
                    <p className="text-sm text-[#334155] leading-relaxed max-w-[72ch]">
                      {thm.statement}
                    </p>

                    <div className="py-4 px-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                      <MathTex tex={thm.formulaTex} display className="text-base sm:text-lg" />
                    </div>

                    <div className="space-y-2 text-sm text-[#475569] max-w-[72ch]">
                      <p>
                        <strong className="font-semibold text-[#0F172A]">Intuition: </strong>
                        {thm.intuition}
                      </p>
                      {thm.examTip && (
                        <p className="text-[#1E40AF]">
                          <strong className="font-semibold">Exam Shortcut: </strong>
                          {thm.examTip}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* Common University Exam Traps */}
              <section
                id="tb-traps"
                className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-4 scroll-mt-24"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-[#B45309]">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>High-Frequency Exam Traps to Avoid</span>
                </div>
                <div className="divide-y divide-[#E2E8F0]">
                  {activeModule.commonTraps.map((item, idx) => (
                    <div key={idx} className="py-3.5 first:pt-0 last:pb-0 space-y-1.5 text-sm">
                      <p className="text-[#991B1B] font-medium">
                        Trap: {item.trap}
                      </p>
                      <p className="text-[#334155]">
                        <strong className="font-semibold text-[#059669]">Fix: </strong>
                        {item.fix}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Curated External Textbooks & Problem Sets */}
              {mediaBundle.externalResources.length > 0 && (
                <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                      Additional Open-Access University Notes &amp; Problem Sets
                    </h3>
                    <span className="text-xs text-[#64748B]">
                      Paul&rsquo;s Notes · OpenStax · MIT OCW
                    </span>
                  </div>
                  <div className="divide-y divide-[#E2E8F0]">
                    {mediaBundle.externalResources.map((res) => (
                      <a
                        key={res.title}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 group"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="text-xs font-medium text-[#1D4ED8]">
                            {res.provider}
                          </div>
                          <div className="text-sm font-semibold text-[#0F172A] group-hover:text-[#1D4ED8]">
                            {res.title}
                          </div>
                          <p className="text-xs text-[#475569] leading-relaxed">
                            {res.description}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] shrink-0">
                          <span>Read</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('lab')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg cursor-pointer"
                >
                  <span>Proceed to Interactive Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Interactive Mathematical Lab + Rapid Sprint Checklist */}
          {activeTab === 'lab' && (
            <div className="space-y-6">
              <InteractiveLab
                labType={activeModule.labType}
                title={activeModule.labTitle}
                objective={activeModule.labObjective}
              />

              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                    Day {activeModule.dayNumber} Rapid Mastery Checklist
                  </h3>
                  <span className="text-xs text-[#64748B]">
                    Prerequisites: {activeModule.prerequisites.join(' · ')}
                  </span>
                </div>
                <ol className="space-y-2.5 text-sm text-[#334155]">
                  {activeModule.studySprintChecklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="font-mono-tabular text-xs font-semibold text-[#1D4ED8] mt-0.5">
                        0{i + 1}.
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('examples')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg cursor-pointer"
                  >
                    <span>Proceed to Worked Examples</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Step-by-Step Interactive Worked Examples */}
          {activeTab === 'examples' && (
            <div className="space-y-6">
              {activeModule.workedExamples.map((ex) => {
                const revealedCount = revealedStepsByExample[ex.id] ?? 1;
                const allRevealed = revealedCount >= ex.steps.length;
                return (
                  <article
                    key={ex.id}
                    className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-xs text-[#64748B] font-medium">
                          Worked Derivation · {ex.difficulty}
                        </div>
                        <h3 className="font-display text-xl font-semibold text-[#0F172A] mt-0.5">
                          {ex.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {!allRevealed && (
                          <button
                            type="button"
                            onClick={() =>
                              setRevealedStepsByExample((prev) => ({
                                ...prev,
                                [ex.id]: ex.steps.length,
                              }))
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] hover:text-[#0F172A] bg-[#F1F5F9] rounded-lg cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Reveal All Steps</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="py-4 px-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                      <MathTex tex={ex.problemTex} display className="text-base sm:text-lg" />
                    </div>

                    <div className="space-y-4">
                      {ex.steps.slice(0, revealedCount).map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="pt-4 border-t border-[#E2E8F0] first:border-t-0 first:pt-0 space-y-2"
                        >
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#1D4ED8]">
                            <span className="font-mono-tabular">Step {sIdx + 1}</span>
                            <span aria-hidden="true">·</span>
                            <span>{step.label}</span>
                          </div>
                          <p className="text-sm text-[#475569]">{step.explanation}</p>
                          <div className="px-4 py-2.5 bg-[#F8FAFC] rounded-lg">
                            <MathTex tex={step.mathTex} display />
                          </div>
                        </div>
                      ))}
                    </div>

                    {!allRevealed ? (
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedStepsByExample((prev) => ({
                            ...prev,
                            [ex.id]: Math.min(ex.steps.length, revealedCount + 1),
                          }))
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg cursor-pointer"
                      >
                        <span>
                          Reveal Next Step ({revealedCount}/{ex.steps.length})
                        </span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-[#065F46]">
                          Final Verified Result
                        </span>
                        <MathTex tex={ex.finalAnswerTex} className="text-[#065F46] font-medium" />
                      </div>
                    )}
                  </article>
                );
              })}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('practice')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg cursor-pointer"
                >
                  <span>Start Mastery Check ({activeModule.practiceProblems.length} Problems)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Graded Mastery Check */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              {activeModule.practiceProblems.map((prob, idx) => {
                const record = progress.solvedProblemIds[prob.id];
                const isHintShown = Boolean(shownHints[prob.id]);

                return (
                  <article
                    key={prob.id}
                    className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
                      <span className="font-mono-tabular font-semibold text-[#0F172A]">
                        Problem {idx + 1} of {activeModule.practiceProblems.length} ·{' '}
                        {prob.topicTag} · {prob.difficulty}
                      </span>
                      {record && (
                        <span
                          className={`font-semibold ${
                            record.isCorrect ? 'text-[#059669]' : 'text-[#DC2626]'
                          }`}
                        >
                          {record.isCorrect ? 'Verified Correct' : 'Needs Review'}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-medium text-[#0F172A]">{prob.prompt}</p>

                    <div className="py-3.5 px-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                      <MathTex tex={prob.promptTex} display className="text-base sm:text-lg" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {prob.options.map((opt) => {
                        const isPicked = record?.selectedOptionId === opt.id;
                        const isRightOption = opt.id === prob.correctOptionId;
                        let cls =
                          'bg-[#FFFFFF] border-[#CBD5E1] text-[#0F172A] hover:border-[#1D4ED8]';
                        if (record) {
                          if (isRightOption) {
                            cls = 'bg-[#ECFDF5] border-[#059669] text-[#065F46]';
                          } else if (isPicked && !isRightOption) {
                            cls = 'bg-[#FEF2F2] border-[#DC2626] text-[#991B1B]';
                          } else {
                            cls = 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]';
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              onRecordAnswer(prob.id, opt.id, opt.id === prob.correctOptionId)
                            }
                            className={`px-4 py-3 rounded-lg border text-left flex items-center gap-3 transition-colors cursor-pointer ${cls}`}
                          >
                            <span className="font-mono-tabular text-xs font-semibold uppercase shrink-0">
                              {opt.id}.
                            </span>
                            <MathTex tex={opt.labelTex} className="text-sm" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Hint toggle before answering */}
                    {!record && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setShownHints((prev) => ({ ...prev, [prob.id]: !prev[prob.id] }))
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1D4ED8] hover:text-[#1E40AF] cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{isHintShown ? 'Hide Hint' : 'Show Method Hint'}</span>
                        </button>
                        {isHintShown && (
                          <p className="mt-2 text-xs text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3">
                            {prob.hint}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Full Worked Solution after answering */}
                    {record && (
                      <div
                        className={`p-4 rounded-lg border space-y-2 ${
                          record.isCorrect
                            ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                            : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                        }`}
                      >
                        <div className="text-xs font-semibold">
                          {record.isCorrect
                            ? 'Correct Derivation'
                            : `Incorrect — Correct choice is (${prob.correctOptionId.toUpperCase()})`}
                        </div>
                        <div className="bg-white/80 rounded-md px-3 py-2 text-[#0F172A]">
                          <MathTex tex={prob.solutionTex} display />
                        </div>
                        <p className="text-xs leading-relaxed text-[#1E293B]">
                          {prob.solutionExplanation}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {/* Bottom Day-to-Day Progression Bar */}
          <nav
            aria-label="Lesson progression"
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4"
          >
            {prevModule ? (
              <button
                type="button"
                onClick={() => onSelectModule(prevModule.id)}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#334155] hover:text-[#0F172A] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Day {prevModule.dayNumber}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {!isCompleted && (
                <button
                  type="button"
                  onClick={() => onToggleComplete(activeModule.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#065F46] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-lg cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Day {activeModule.dayNumber} Complete</span>
                </button>
              )}

              {nextModule && (
                <button
                  type="button"
                  onClick={() => {
                    if (!isCompleted) onToggleComplete(activeModule.id);
                    onSelectModule(nextModule.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg cursor-pointer"
                >
                  <span>
                    Next: Day {nextModule.dayNumber}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </nav>
        </main>
      </div>
    </div>
  );
}
