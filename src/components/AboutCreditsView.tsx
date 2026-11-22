import { ArrowLeft, BookOpen, ExternalLink, Info, Scale, ShieldAlert } from 'lucide-react';

interface AboutCreditsViewProps {
  onBackToPlan: () => void;
}

export function AboutCreditsView({ onBackToPlan }: AboutCreditsViewProps) {
  return (
    <main className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      <div className="space-y-3">
        <button
          type="button"
          onClick={onBackToPlan}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#0F172A] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Course Plan</span>
        </button>

        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F172A] text-balance">
          About, Educational Credits &amp; Licensing
        </h1>
        <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-[68ch]">
          This self-study workspace organizes freely available university mathematics
          lectures, open-access textbooks, interactive visualizations, and practice
          assessments into one structured syllabus.
        </p>
      </div>

      {/* Explicit Non-Affiliation Disclaimer */}
      <section
        aria-labelledby="disclaimer-heading"
        className="bg-[#FFFBEB] border border-[#F59E0B]/60 rounded-xl p-6 space-y-2.5"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[#92400E]">
          <ShieldAlert className="w-4 h-4 shrink-0 text-[#B45309]" />
          <h2 id="disclaimer-heading">Independent Project — Non-Affiliation Notice</h2>
        </div>
        <p className="text-sm text-[#78350F] leading-relaxed">
          This application is an independent educational project. It is{' '}
          <strong>
            NOT affiliated with, sponsored by, or endorsed by Professor Leonard or
            3Blue1Brown
          </strong>
          , nor by OpenStax (Rice University), Paul Dawkins (Lamar University), or MIT
          OpenCourseWare. All embedded YouTube lectures stream directly from their
          creators&rsquo; official YouTube channels and remain the sole property of
          their respective authors.
        </p>
      </section>

      {/* Dual Licensing */}
      <section
        aria-labelledby="licensing-heading"
        className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
          <Scale className="w-4 h-4 text-[#1D4ED8] shrink-0" />
          <h2 id="licensing-heading" className="font-display text-xl">
            Dual Licensing: Code vs. Educational Content
          </h2>
        </div>

        <p className="text-sm text-[#334155] leading-relaxed">
          Source code and OpenStax-derived educational notes in this repository are
          governed by <strong>different licenses</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
            <div className="text-xs font-mono-tabular font-semibold text-[#1D4ED8]">
              Application Source Code
            </div>
            <div className="text-sm font-semibold text-[#0F172A]">
              Apache License 2.0
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              Applies to the React/TypeScript UI, numerical math utilities, interactive
              SVG labs, scheduler, and automated test suite.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
            <div className="text-xs font-mono-tabular font-semibold text-[#059669]">
              OpenStax-Derived Study Notes
            </div>
            <div className="text-sm font-semibold text-[#0F172A]">
              Creative Commons Attribution 4.0 (CC BY 4.0)
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              Applies to chapter summaries and textbook notes adapted from OpenStax
              Precalculus 2e and OpenStax Calculus Volumes 1 &amp; 2. You may share and
              adapt these notes with attribution under{' '}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1D4ED8] hover:underline font-medium"
              >
                CC BY 4.0
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* OpenStax CC BY 4.0 Attribution */}
      <section
        aria-labelledby="openstax-heading"
        className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
          <BookOpen className="w-4 h-4 text-[#1D4ED8] shrink-0" />
          <h2 id="openstax-heading" className="font-display text-xl">
            OpenStax Textbook Attribution (CC BY 4.0)
          </h2>
        </div>

        <p className="text-sm text-[#334155] leading-relaxed">
          In-app textbook chapters are condensed study notes aligned to and adapted from
          the following peer-reviewed OpenStax textbooks (Rice University). Access the
          complete original books free of charge at OpenStax:
        </p>

        <ul className="divide-y divide-[#E2E8F0] text-sm">
          <li className="py-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-[#0F172A]">
                OpenStax Precalculus 2e (Prep 1–6)
              </div>
              <div className="text-xs text-[#475569]">
                Jay Abramson, Senior Contributing Author · Licensed under CC BY 4.0
              </div>
            </div>
            <a
              href="https://openstax.org/details/books/precalculus-2e"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] hover:underline shrink-0"
            >
              <span>openstax.org</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </li>
          <li className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-[#0F172A]">
                OpenStax Calculus Volume 1 (Days 1–5)
              </div>
              <div className="text-xs text-[#475569]">
                Gilbert Strang &amp; Edwin &ldquo;Jed&rdquo; Herman · Licensed under CC BY 4.0
              </div>
            </div>
            <a
              href="https://openstax.org/details/books/calculus-volume-1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] hover:underline shrink-0"
            >
              <span>openstax.org</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </li>
          <li className="py-3 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-[#0F172A]">
                OpenStax Calculus Volume 2 (Days 6–14)
              </div>
              <div className="text-xs text-[#475569]">
                Gilbert Strang &amp; Edwin &ldquo;Jed&rdquo; Herman · Licensed under CC BY 4.0
              </div>
            </div>
            <a
              href="https://openstax.org/details/books/calculus-volume-2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] hover:underline shrink-0"
            >
              <span>openstax.org</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </li>
        </ul>
      </section>

      {/* Video Creators & External Links Only */}
      <section
        aria-labelledby="external-heading"
        className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
          <Info className="w-4 h-4 text-[#1D4ED8] shrink-0" />
          <h2 id="external-heading" className="font-display text-xl">
            Embedded Video Creators &amp; External Reference Links
          </h2>
        </div>

        <div className="divide-y divide-[#E2E8F0] text-sm">
          <div className="py-3 first:pt-0 space-y-1">
            <div className="font-semibold text-[#0F172A]">
              Professor Leonard (YouTube Embeds Only · No Affiliation)
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              Full-length Precalculus / College Algebra, Calculus 1, and Calculus 2
              lectures are embedded directly via YouTube&rsquo;s privacy-enhanced
              embed player. Consider supporting Professor Leonard directly on his
              YouTube channel.
            </p>
          </div>

          <div className="py-3 space-y-1">
            <div className="font-semibold text-[#0F172A]">
              3Blue1Brown (YouTube Embeds Only · No Affiliation)
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              Selected episodes from Grant Sanderson&rsquo;s <em>Essence of Calculus</em>{' '}
              series are embedded directly from YouTube as visual intuition companions.
            </p>
          </div>

          <div className="py-3 space-y-1">
            <div className="font-semibold text-[#0F172A]">
              Paul&rsquo;s Online Math Notes — Lamar University (External Links Only)
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              Referenced strictly via external outbound hyperlinks to{' '}
              <a
                href="https://tutorial.math.lamar.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1D4ED8] hover:underline"
              >
                tutorial.math.lamar.edu
              </a>{' '}
              for supplemental practice exercises. No content from Paul&rsquo;s Online
              Math Notes is copied or hosted inside this application.
            </p>
          </div>

          <div className="py-3 last:pb-0 space-y-1">
            <div className="font-semibold text-[#0F172A]">
              MIT OpenCourseWare 18.01SC (External Links Only)
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              Referenced strictly via external outbound hyperlinks to{' '}
              <a
                href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1D4ED8] hover:underline"
              >
                ocw.mit.edu
              </a>
              . No MIT OCW course materials are copied or hosted inside this application.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
