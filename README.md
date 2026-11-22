# CalcAtlas

An all-in-one university-level **Precalculus Prep & Calculus I–II** self-study platform designed to take learners from foundational functions and trigonometry through limits, integration, Taylor series, and polar geometry in one structured workspace—without bouncing between scattered tabs, textbooks, and playlists.

> **Live Demo:** `[Add your deployed URL here]`
>
> **Screenshots:** `[Add desktop & mobile screenshots here — Course Plan, Video Theater, Interactive Lab, Formula Vault]`

---

## Key Features

- **20-Module Three-Track Curriculum**: Combines an optional **Precalculus Prep** warmup (Prep 1–6) with full university **Calculus I** (Days 1–5) and **Calculus II** (Days 6–14), each structured into a 5-stage workflow:
  1. **Video Lectures** — Full-width 16:9 cinema player with collapsible syllabus **Theater Mode**, **77 unique YouTube lectures across 80 module slots** from Professor Leonard's Precalculus / College Algebra, Calculus 1, and Calculus 2 playlists plus 3Blue1Brown visual companions (confirmed live via `npm run check-links`), embed failure fallback UI with direct YouTube/playlist links, active viewing strategies, transport controls (`Prev` / `Next` / `Mark Watched & Next Lecture`), and persistent watched tracking.
  2. **Full Textbook & Theory** — Multi-section university lecture notes aligned to OpenStax Precalculus 2e and OpenStax Calculus Volumes 1–2 for every module, with KaTeX-typeset equations, quick in-chapter jump links, formal theorems with hypotheses, key insights, per-section CC BY 4.0 attribution, and common conceptual pitfalls.
  3. **Interactive Mathematical Labs** — 19 interactive visual lab modes (15 accessible SVG visualizations + 1 method recognition trainer) with keyboard-operable sliders, dynamic SVG `<desc>` summaries, and `aria-live="polite"` readouts across Precalculus Prep and Calculus I–II.
  4. **Worked Examples** — 36 step-by-step interactive derivations revealed one algebraic move at a time, each with a `"Report an error"` link.
  5. **Mastery Check** — 60 graded university-level problems (18 Precalculus Prep, 15 Calculus I, 27 Calculus II) with hints, instant grading, full LaTeX proofs, and per-item `"Report an error"` links.
- **Flexible Study Pace Scheduler**: Defaults to the **28-Day Steady Mastery** pace (½ module/day) with spaced practice; also supports a **14-Day Intensive** pace (1 module/day) and a **7-Day Review Only** pace (2 modules/day, clearly labeled for people who have already studied this material—fast pacing builds familiarity, not mastery).
- **Timed Practice Exams**: 6 assessment templates (**Precalculus Prep Readiness Check**, Calculus I Midterm, Integration Techniques Practice Drill, Infinite Series & Taylor Mastery Test, Calculus II Final, and Full Calc I & II Gauntlet) featuring countdown timers, progress tracking, toggleable keyboard shortcuts (`A`–`D` or `1`–`4` to answer, `←` / `→` to navigate, pausable for screen readers), per-track accuracy breakdowns, score history, and missed-problem derivation reviews.
- **Searchable Formula Vault**: 49 essential Precalculus, Trigonometry, and Calculus I–II identities rendered in KaTeX with live category filtering (including **Precalculus Prep & Trig**), **Active Recall Mode** (click-to-reveal flashcards with progress tracking), `"Report an error"` links, and print-friendly layout.
- **Curated Open-Access References**: 36 verified chapter-aligned outbound links to **OpenStax Precalculus 2e**, **Paul's Online Math Notes**, **OpenStax Calculus Volumes 1 & 2**, and **MIT OCW 18.01SC**, labeled by resource type (*Textbook Theory*, *Practice Exercises*, *Full Playlist*).
- **Versioned Local Persistence & Backup**: Progress saves automatically in `localStorage` under schema version `2` with automatic migration from legacy saves, plus validated **Export Progress / Import Progress (JSON)** controls in the Course Plan footer.

---

## Complete 20-Module Syllabus

### Foundation Track — Precalculus Prep (Prep 1–6 · Optional Warmup)

| Prep | Module | Paired Visual Lab |
| --- | --- | --- |
| P01 | Functions, Domains, Graphs & Transformations | Function Behavior, Domains & Discontinuities Lab |
| P02 | Quadratics, Polynomials, Division & Zeros | Polynomial Roots, Turning Points & End Behavior Lab |
| P03 | Rational Functions, Asymptotes, Holes & Inequalities | Holes vs. Vertical Asymptotes Explorer |
| P04 | Composite, Inverse, Exponential & Logarithmic Functions | Exponential Growth & Logarithmic Inverse Curves |
| P05 | Radians, The Unit Circle & Trigonometric Graphs | Unit Circle & Trigonometric Angle Geometry Lab |
| P06 | Inverse Trig, Trig Identities, Equations & Sequences | Partial Sums $S_N$ vs. $a_n$ Lab |

### Semester I — Calculus I Core (Days 1–5)

| Day | Module | Interactive Lab |
| --- | --- | --- |
| 01 | Limits, Continuity & The Squeeze Theorem | Two-Sided Limit & Discontinuity Explorer |
| 02 | Derivatives, Chain Rule & Implicit Differentiation | Secant-to-Tangent Slope Lab ($h \to 0$) |
| 03 | Extrema, L'Hôpital's Rule, Related Rates & Optimization *(heavy — plan 2 sessions, ~180 min)* | Extrema & Concavity Analyzer |
| 04 | Riemann Sums, Fundamental Theorem & $u$-Substitution | Riemann Sum & FTC Convergence Lab |
| 05 | Area Between Curves & Volumes of Revolution | Disk / Washer / Shell Volume Visualizer |

### Semester II — Calculus II (Days 6–14)

| Day | Module | Interactive Lab |
| --- | --- | --- |
| 06 | Integration by Parts & Trigonometric Integrals | IBP Decomposition & Area Explorer |
| 07 | Trigonometric Substitution & Partial Fractions | Reference Triangle & Radical Geometry Lab |
| 08 | Improper Integrals & Comparison Tests | $p$-Integral Tail Convergence Lab |
| 09 | Arc Length, Surface Area & Differential Equations | Slope Field & Euler's Method Solver |
| 10 | Sequences & Series Convergence Tests I | Partial Sums $S_N$ vs. $a_n$ Lab |
| 11 | Alternating Series, Ratio & Root Tests | Alternating Series Error Bound Visualizer |
| 12 | Power Series, Radius of Convergence & Taylor Polynomials | Taylor Polynomial Degree-$n$ Approximator |
| 13 | Parametric Curves & Polar Coordinates | Polar Curve & Area Sweeper |
| 14 | Problem-Solving Synthesis & Method Selection Playbook | Interactive Method Recognition Simulator |

> **Pacing note on Calculus I Day 3:** Day 3 combines the Mean Value Theorem, curve sketching, L'Hôpital's Rule, Related Rates, and Optimization (~180 min). On the default 28-day Steady Mastery plan, split it cleanly across two 90-minute sessions (Session A: MVT, Extrema & L'Hôpital; Session B: Related Rates & Optimization).

### Planned

Standard university Calculus I–II topics not yet covered with dedicated modules and scheduled for future additions:

- **Calculus I**: Linear Approximation & Differentials, Newton's Method for root finding, Hyperbolic Functions ($\sinh, \cosh, \tanh$ and their derivatives/antiderivatives)
- **Calculus II**: Numerical Integration error bounds (Trapezoidal & Simpson's Rules — currently linked in Day 8 lectures, planned as a dedicated drill module), Physical Applications of Integration (Work, Hydrostatic Force, Moments & Centers of Mass), Conic Sections in Polar Coordinates

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4, Fraunces + Plus Jakarta Sans + IBM Plex Mono typography
- **Math Rendering**: KaTeX (`katex`)
- **Icons**: Lucide React (`lucide-react`)
- **Testing & CI**: Node's built-in test runner (`node:test`) via `tsx`, GitHub Actions (`.github/workflows/ci.yml`)

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation & Local Development

```bash
# Install dependencies
npm install

# Start the development server on http://localhost:3000
npm run dev
```

### Type-Check, Tests, Link Check & Build

```bash
# Type-check with TypeScript
npm run lint

# Run all unit, data integrity, progress migration, and math verification tests
npm test

# Verify all 77 YouTube video IDs and 36 external reference URLs
npm run check-links

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Reporting Math Errors & Contributing

Every mastery problem, worked example, drill exam question, and formula card includes a **"Report an error"** link that opens a prefilled GitHub issue containing the exact item ID. Items currently flagged for manual review are tracked in [`KNOWN_ISSUES.md`](./KNOWN_ISSUES.md).

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for development conventions and mathematical verification requirements, and [`CHANGELOG.md`](./CHANGELOG.md) for release notes.

---

## Project Structure

```text
.github/workflows/ci.yml          # CI workflow: install, lint, test, build
scripts/check-links.ts            # Live validator for YouTube IDs & external URLs
src/
├── App.tsx                       # Root navigation & persisted user progress state
├── main.tsx                      # React entry point
├── index.css                     # Tailwind CSS v4 theme, focus rings, KaTeX & print styles
├── assets/                       # Architectural drafting plate artwork
├── types/
│   └── course.ts                 # TypeScript interfaces for modules, videos, exams & state
├── data/
│   ├── curriculum.ts             # Combined 20-module catalog & 6 exam templates
│   ├── curriculumPreAlg.ts       # Precalculus Prep 1–6 modules & drills
│   ├── curriculumCalc1.ts        # Calculus I modules, theorems, examples & drills
│   ├── curriculumCalc2.ts        # Calculus II modules, theorems, examples & drills
│   ├── moduleMediaAndNotes.ts    # 77 unique YouTube lectures (80 slots) & 36 external URLs
│   ├── moduleTextbookPreAlg.ts   # OpenStax Precalculus 2e-aligned textbook chapters (Prep 1–6)
│   ├── moduleTextbookCalc1.ts    # Full Calculus I university textbook chapters
│   ├── moduleTextbookCalc2.ts    # Full Calculus II university textbook chapters
│   └── formulas.ts               # 49-entry KaTeX Formula Vault dataset
├── utils/
│   ├── calculusMath.ts           # Pure numerical calculus routines (Simpson, Taylor, ODE, Polar)
│   ├── calculusMath.test.ts      # Unit tests for numerical calculus engine
│   ├── courseProgress.ts         # Scheduler, grading, storage migrations & JSON export/import
│   ├── courseProgress.test.ts    # Unit tests for scheduling, grading & storage migrations
│   ├── dataIntegrity.test.ts     # Cross-dataset ID, lab, video & exam template integrity tests
│   ├── mathVerification.test.ts  # Independent verification of all 60 problems & 36 examples
│   └── issueLinks.ts             # Prefilled GitHub math-error issue URL builder
└── components/
    ├── TopBar.tsx                # 3-zone sticky navigation bar
    ├── CoursePlanView.tsx        # Hero, metrics, pace planner, roadmap & JSON backup
    ├── StudyStudioView.tsx       # 5-stage learning studio with collapsible syllabus rail
    ├── VideoCourseTheater.tsx    # Full-width cinema video player, Theater Mode & fallback UI
    ├── InteractiveLab.tsx        # 19 accessible interactive mathematical labs
    ├── DrillExamView.tsx         # Timed assessments, toggleable shortcuts & mistake review
    ├── FormulaVaultView.tsx      # Searchable KaTeX reference & Active Recall mode
    ├── FormulaDrawer.tsx         # Slide-over quick formula reference drawer
    ├── AboutCreditsView.tsx      # Disclaimers, OpenStax CC BY 4.0 attribution & licenses
    └── MathTex.tsx               # KaTeX display & inline math renderer
```

---

## Educational Credits & Disclaimers

> **Non-Affiliation Notice:** CalcAtlas is an independent open-source self-study platform and is **NOT affiliated with, sponsored by, or endorsed by Professor Leonard or 3Blue1Brown**, nor by OpenStax (Rice University), Paul Dawkins (Lamar University), or MIT OpenCourseWare.

This platform curates, embeds, or links to freely available university mathematics resources:

- **Professor Leonard** *(YouTube embeds only)* — Full-length university Precalculus / College Algebra, Calculus 1, and Calculus 2 YouTube lecture playlists streamed directly via YouTube's official embed player.
- **3Blue1Brown** *(YouTube embeds only)* — *Essence of Calculus* visual intuition companion videos streamed directly via YouTube.
- **OpenStax Precalculus 2e, Calculus Volume 1, and Calculus Volume 2** *(CC BY 4.0)* — Peer-reviewed open-access university textbooks published by Rice University, free at [openstax.org](https://openstax.org/subjects/math). In-app chapter study notes are adapted from and aligned to these textbooks under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- **Paul's Online Math Notes** (Lamar University) *(external links only)* — Linked strictly as outbound references for supplemental exercises; no content is copied into this repository.
- **MIT OpenCourseWare 18.01SC** *(external links only)* — Linked strictly as outbound references; no content is copied into this repository.

---

## Licensing (Code vs. Content)

Source code and OpenStax-derived educational content in this repository use **different licenses**:

- **Source Code**: Licensed under the **Apache License 2.0** (React/TypeScript application, numerical utilities, interactive SVG labs, and tests).
- **OpenStax-Derived Study Notes**: Licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**, with per-section attribution in the app to OpenStax *Precalculus 2e*, *Calculus Volume 1*, and *Calculus Volume 2*.
