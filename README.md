# Principia Calculus

An all-in-one, accelerated university-level **Calculus I & II** learning platform designed to take learners from limits to Taylor series and polar geometry in the shortest possible time—without needing to bounce between scattered tabs, textbooks, and playlists.

## Key Features

- **14-Module Two-Semester Curriculum**: Distills full university Calculus I (Days 1–5) and Calculus II (Days 6–14) into structured daily modules with a clear 5-stage workflow:
  1. **Video Lectures** — Full-width 16:9 cinema player with collapsible syllabus **Theater Mode**, **47 embedded lectures** from Professor Leonard's official Calculus 1 & 2 playlists plus 3Blue1Brown visual companions, lecture focus guides, fastest-path watch strategies, transport controls (`Prev` / `Next` / `Mark Watched & Next Lecture`), and persistent watched tracking.
  2. **Full Textbook & Theory** — Multi-section university lecture notes for every day with KaTeX-typeset equations, quick in-chapter jump links, formal theorems, exam shortcuts, and high-frequency exam traps.
  3. **Interactive Mathematical Labs** — 14 custom SVG visual labs with live sliders for limits, secant-to-tangent convergence, extrema/concavity, Riemann sums, volumes of revolution, integration by parts, trig substitution, improper $p$-integrals, Euler's ODE method, infinite series partial sums, alternating series error bounds, Taylor polynomial approximations, polar curves, and exam triage.
  4. **Worked Examples** — Step-by-step interactive derivations revealed one algebraic move at a time.
  5. **Mastery Check** — 42 graded university-level problems with hints, instant grading, and full LaTeX proofs.
- **Adaptive Compression Scheduler**: Switch between **7-Day Exam Cram**, **14-Day Sprint**, and **28-Day Mastery** paces with a custom start date; every syllabus date and daily hour commitment updates live.
- **Timed Drill Exams**: 5 assessment templates (Diagnostic, Calculus I Midterm, Integration Blitz, Series Blitz, Full Final Gauntlet) featuring countdown timers, progress tracking, keyboard shortcuts (`A`–`D` or `1`–`4` to answer, `←` / `→` to navigate), score history, and missed-problem derivation reviews.
- **Searchable Formula Vault**: 39 essential Calculus I & II identities rendered in KaTeX with live category filtering, **Active Recall Mode** (click-to-reveal flashcards with progress tracking), and print-friendly layout.
- **Curated Open-Access References**: Direct chapter-aligned links to **Paul's Online Math Notes**, **OpenStax Calculus Volumes 1 & 2**, and **MIT OCW 18.01SC**.
- **Automatic Local Persistence**: Module completion, watched lectures, solved drills, exam history, and schedule pace are saved automatically in `localStorage`.

---

## Complete 14-Module Syllabus

### Semester I — Calculus I Core (Days 1–5)

| Day | Module | Interactive Lab |
| --- | --- | --- |
| 01 | Limits, Continuity & The Squeeze Theorem | Two-Sided Limit & Discontinuity Explorer |
| 02 | Derivatives, Chain Rule & Implicit Differentiation | Secant-to-Tangent Slope Lab ($h \to 0$) |
| 03 | Extrema, L'Hôpital's Rule, Related Rates & Optimization | Extrema & Concavity Analyzer |
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
| 14 | 60-Second Exam Triage & Full Synthesis Playbook | Interactive Method Triage Simulator |

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4, Fraunces + Plus Jakarta Sans + IBM Plex Mono typography
- **Math Rendering**: KaTeX (`katex`)
- **Icons**: Lucide React (`lucide-react`)
- **Testing**: Node's built-in test runner (`node:test`) via `tsx`

---

## Getting Started

### Prerequisites

- Node.js 20+ (or Bun)

### Installation & Local Development

```bash
# Install dependencies
npm install

# Start the development server on http://localhost:3000
npm run dev
```

### Build, Type-Check & Tests

```bash
# Type-check with TypeScript
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview

# Run math engine & course progress unit tests
npx tsx --test src/utils/calculusMath.test.ts src/utils/courseProgress.test.ts
```

---

## Project Structure

```text
src/
├── App.tsx                       # Root navigation & persisted user progress state
├── main.tsx                      # React entry point
├── index.css                     # Tailwind CSS v4 theme, KaTeX & print styles
├── assets/                       # Generated architectural drafting plate artwork
├── types/
│   └── course.ts                 # TypeScript interfaces for modules, videos, exams & state
├── data/
│   ├── curriculum.ts             # Combined 14-module catalog & exam templates
│   ├── curriculumCalc1.ts        # Calculus I modules, theorems, examples & drills
│   ├── curriculumCalc2.ts        # Calculus II modules, theorems, examples & drills
│   ├── moduleMediaAndNotes.ts    # 47 verified YouTube lectures & open-access web references
│   ├── moduleTextbookCalc1.ts    # Full Calculus I university textbook chapters
│   ├── moduleTextbookCalc2.ts    # Full Calculus II university textbook chapters
│   └── formulas.ts               # 39-entry KaTeX Formula Vault dataset
├── utils/
│   ├── calculusMath.ts           # Pure numerical calculus routines (Simpson, Taylor, ODE, Polar)
│   ├── calculusMath.test.ts      # Unit tests for numerical calculus engine
│   ├── courseProgress.ts         # Adaptive scheduler, progress summaries & exam grading
│   └── courseProgress.test.ts    # Unit tests for scheduling & grading logic
└── components/
    ├── TopBar.tsx                # 3-zone sticky navigation bar
    ├── CoursePlanView.tsx        # Hero, metrics, pace planner & 14-module roadmap
    ├── StudyStudioView.tsx       # 5-stage learning studio with collapsible syllabus rail
    ├── VideoCourseTheater.tsx    # Full-width cinema video player, Theater Mode & queue
    ├── InteractiveLab.tsx        # 14 interactive SVG mathematical simulations
    ├── DrillExamView.tsx         # Timed assessments, keyboard shortcuts & mistake review
    ├── FormulaVaultView.tsx      # Searchable KaTeX reference & Active Recall mode
    └── MathTex.tsx               # KaTeX display & inline math renderer
```

---

## Educational Credits

This platform curates and embeds freely available university mathematics resources:

- **Professor Leonard** — Full-length university Calculus 1 & Calculus 2 YouTube lecture playlists
- **3Blue1Brown** — *Essence of Calculus* visual intuition companion videos
- **Paul's Online Math Notes** (Lamar University) — Structured notes and worked problem sets
- **OpenStax Calculus Volumes 1 & 2** — Peer-reviewed open-access university textbooks
- **MIT OpenCourseWare 18.01SC** — Single Variable Calculus course archives

---

## License

This project is licensed under the Apache-2.0 License.
