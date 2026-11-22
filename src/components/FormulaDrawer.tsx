import { useEffect, useMemo, useState } from 'react';
import { BookMarked, Flag, Search, X } from 'lucide-react';
import { FORMULA_VAULT } from '../data/formulas';
import type { CourseTrack } from '../types/course';
import { formatCourseTrackName } from '../utils/courseProgress';
import { buildMathErrorIssueUrl } from '../utils/issueLinks';
import { MathTex } from './MathTex';

interface FormulaDrawerProps {
  open: boolean;
  activeCourse: CourseTrack;
  onClose: () => void;
}

export function FormulaDrawer({
  open,
  activeCourse,
  onClose,
}: FormulaDrawerProps) {
  const [query, setQuery] = useState('');
  const [onlyCurrentTrack, setOnlyCurrentTrack] = useState(true);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FORMULA_VAULT.filter((entry) => {
      if (onlyCurrentTrack && !q && entry.course !== activeCourse) return false;
      if (!q) return true;
      return (
        entry.name.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.recallCue.toLowerCase().includes(q) ||
        entry.lhsTex.toLowerCase().includes(q) ||
        entry.rhsTex.toLowerCase().includes(q)
      );
    });
  }, [query, onlyCurrentTrack, activeCourse]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0F172A]/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="Quick Formula Reference Drawer"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FFFFFF] h-full shadow-2xl border-l border-[#E2E8F0] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-[#1D4ED8]" />
              <h2 className="font-display text-lg font-semibold text-[#0F172A]">
                Quick Formula Reference
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close formula reference"
              className="p-1.5 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search trig, log, L'Hôpital, IBP, Taylor..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#0F172A] placeholder:text-[#64748B]"
            />
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="inline-flex items-center gap-1 p-0.5 bg-[#F1F5F9] rounded-lg">
              <button
                type="button"
                onClick={() => setOnlyCurrentTrack(true)}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                  onlyCurrentTrack
                    ? 'bg-[#FFFFFF] text-[#0F172A] shadow-xs font-semibold'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {formatCourseTrackName(activeCourse)}
              </button>
              <button
                type="button"
                onClick={() => setOnlyCurrentTrack(false)}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                  !onlyCurrentTrack
                    ? 'bg-[#FFFFFF] text-[#0F172A] shadow-xs font-semibold'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                All {FORMULA_VAULT.length}
              </button>
            </div>
            <span className="font-mono-tabular text-[#475569]">
              {filtered.length} shown · Esc to close
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#F8FAFC]">
          {filtered.length === 0 ? (
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 text-center text-sm text-[#475569]">
              No matching identities found. Try clearing your search.
            </div>
          ) : (
            filtered.map((entry) => (
              <div
                key={entry.id}
                className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 space-y-2"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-sm font-semibold text-[#0F172A]">
                    {entry.name}
                  </div>
                  <span className="text-[11px] font-mono-tabular text-[#475569] shrink-0">
                    {entry.category}
                  </span>
                </div>
                <div className="px-3 py-2 bg-[#F8FAFC] rounded-lg overflow-x-auto">
                  <MathTex
                    tex={`${entry.lhsTex} ${entry.relationTex ?? '='} ${entry.rhsTex}`}
                    className="text-sm"
                  />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {entry.recallCue}
                  </p>
                  <a
                    href={buildMathErrorIssueUrl({
                      itemId: entry.id,
                      itemLabel: entry.name,
                      kind: 'formula',
                      context: entry.category,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#475569] hover:text-[#1D4ED8] whitespace-nowrap shrink-0"
                  >
                    <Flag className="w-3 h-3" />
                    <span>Report</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
