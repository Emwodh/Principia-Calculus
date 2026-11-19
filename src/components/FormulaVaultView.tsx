import { useMemo, useState } from 'react';
import { Eye, EyeOff, Printer, Search } from 'lucide-react';
import { FORMULA_VAULT } from '../data/formulas';
import type { FormulaEntry } from '../types/course';
import { MathTex } from './MathTex';

const CATEGORIES: ('All' | FormulaEntry['category'])[] = [
  'All',
  'Limits & Continuity',
  'Derivatives',
  'Integrals',
  'Integration Techniques',
  'Series & Convergence',
  'Taylor & Maclaurin',
  'Parametric & Polar',
];

export function FormulaVaultView() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<('All' | FormulaEntry['category'])>('All');
  const [recallMode, setRecallMode] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FORMULA_VAULT.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.recallCue.toLowerCase().includes(q) ||
        item.lhsTex.toLowerCase().includes(q) ||
        item.rhsTex.toLowerCase().includes(q)
      );
    });
  }, [query, selectedCategory]);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const revealedVisibleCount = filtered.filter((item) => revealedIds[item.id]).length;
  const hasActiveFilter = query.trim().length > 0 || selectedCategory !== 'All';

  return (
    <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-medium text-[#64748B]">
            Master Reference &amp; Active Recall · {FORMULA_VAULT.length} Essential University Identities
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F172A] text-balance">
            Calculus I &amp; II Formula Vault
          </h1>
          <p className="text-sm sm:text-base text-[#475569]">
            Every limit, derivative, integration technique, convergence test, and Maclaurin
            expansion in one searchable sheet. Switch on Active Recall Mode to test your
            memory before exams.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 no-print">
          <button
            type="button"
            onClick={() => {
              setRecallMode((r) => !r);
              setRevealedIds({});
            }}
            aria-pressed={recallMode}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border cursor-pointer ${
              recallMode
                ? 'bg-[#1D4ED8] text-white border-[#1D4ED8] hover:bg-[#1E40AF]'
                : 'bg-[#FFFFFF] text-[#0F172A] border-[#CBD5E1] hover:border-[#1D4ED8]'
            }`}
          >
            {recallMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{recallMode ? 'Show All Formulas' : 'Hide Answers (Recall Mode)'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#334155] bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <section className="space-y-4 no-print">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <label htmlFor="formula-search" className="sr-only">
              Search formulas by name, theorem, or symbol
            </label>
            <input
              id="formula-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Taylor, secant, Ratio Test, polar..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg text-[#0F172A] placeholder:text-[#94A3B8]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] font-mono-tabular">
            <span>
              Showing {filtered.length} of {FORMULA_VAULT.length}
            </span>
            {recallMode && filtered.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#1D4ED8] font-semibold">
                  Revealed {revealedVisibleCount}/{filtered.length}
                </span>
                {revealedVisibleCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setRevealedIds({})}
                    className="font-sans font-medium text-[#1D4ED8] hover:underline cursor-pointer"
                  >
                    Hide All Again
                  </button>
                )}
              </>
            )}
            {hasActiveFilter && (
              <>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSelectedCategory('All');
                  }}
                  className="font-sans font-medium text-[#1D4ED8] hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        </div>

        <div
          role="group"
          aria-label="Filter formula categories"
          className="flex flex-wrap items-center gap-1.5"
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={active}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#0F172A] text-white border-[#0F172A]'
                    : 'bg-[#FFFFFF] text-[#475569] border-[#E2E8F0] hover:border-[#94A3B8]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Formula Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-10 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#0F172A]">
            No matching formulas found
          </p>
          <p className="text-sm text-[#475569]">
            Try clearing your search query or selecting &ldquo;All&rdquo; categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg cursor-pointer"
          >
            Reset Search &amp; Filters
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((entry) => {
            const isHidden = recallMode && !revealedIds[entry.id];
            return (
              <article
                key={entry.id}
                className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-[#64748B]">
                      {entry.category} ·{' '}
                      {entry.course === 'calc1' ? 'Calculus I' : 'Calculus II'}
                    </div>
                    <h2 className="text-base font-semibold text-[#0F172A] mt-0.5">
                      {entry.name}
                    </h2>
                  </div>
                  {entry.condition && (
                    <span className="text-xs font-mono-tabular text-[#475569] text-right">
                      {entry.condition}
                    </span>
                  )}
                </div>

                {recallMode ? (
                  <button
                    type="button"
                    onClick={() => toggleReveal(entry.id)}
                    aria-pressed={!isHidden}
                    className="w-full p-3.5 bg-[#F8FAFC] hover:bg-[#EFF6FF]/60 rounded-lg flex flex-wrap items-center justify-between gap-3 text-left cursor-pointer"
                  >
                    <div className="overflow-x-auto">
                      {isHidden ? (
                        <MathTex tex={`${entry.lhsTex} = \\;\\text{?}`} />
                      ) : (
                        <MathTex tex={`${entry.lhsTex} = ${entry.rhsTex}`} />
                      )}
                    </div>
                    <span className="px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] bg-[#EFF6FF] rounded-md whitespace-nowrap shrink-0">
                      {isHidden ? 'Reveal Formula' : 'Hide Again'}
                    </span>
                  </button>
                ) : (
                  <div className="p-3.5 bg-[#F8FAFC] rounded-lg flex flex-wrap items-center justify-between gap-3">
                    <div className="overflow-x-auto">
                      <MathTex tex={`${entry.lhsTex} = ${entry.rhsTex}`} />
                    </div>
                  </div>
                )}

                <p className="text-xs text-[#475569] leading-relaxed">
                  <strong className="font-medium text-[#0F172A]">Memory Cue: </strong>
                  {entry.recallCue}
                </p>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
