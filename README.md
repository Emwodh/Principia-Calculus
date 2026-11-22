# CalcAtlas

**A free, open-source study platform for Precalculus, Calculus I and Calculus II.**
Videos, notes, interactive labs, worked examples, practice problems and timed exams, organized in one place so you don't have to juggle tabs, textbooks and playlists.

[![CI](https://github.com/OWNER/calcatlas/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/calcatlas/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/code-Apache--2.0-blue.svg)](LICENSE)
[![Content: CC BY 4.0](https://img.shields.io/badge/notes-CC%20BY%204.0-lightgrey.svg)](#licenses-and-credits)

**[Live demo](https://YOUR-DEMO-URL-HERE)** · **[Report a math error](https://github.com/OWNER/calcatlas/issues/new)** · **[Contributing](CONTRIBUTING.md)** · **[Changelog](CHANGELOG.md)**

<!-- Add screenshots here, for example:
![Course map](docs/screenshots/course-map.png)
![Interactive lab](docs/screenshots/lab.png)
-->

---

## Why CalcAtlas?

Calculus is learned by doing, not by watching. CalcAtlas is built around a simple loop for every topic: **watch, read, explore, practice, check.** It favors understanding over speed, so the default plan is a steady 28-day pace and the fastest mode is clearly labeled as review for people who have already studied the material.

## Features

- **20 modules in three tracks:** Precalculus Prep (6 modules), Calculus I (5 modules) and Calculus II (9 modules).
- **A five-stage workflow for each module:**
  1. **Video lectures:** embedded Professor Leonard and 3Blue1Brown videos in a theater-mode player, with watched tracking and a fallback if an embed fails.
  2. **Theory notes:** KaTeX-typeset notes aligned to OpenStax, with theorems, hypotheses and common mistakes.
  3. **Interactive labs:** 15 SVG simulations with sliders (limits, secant to tangent, Riemann sums, volumes of revolution, Taylor polynomials, polar curves and more).
  4. **Worked examples:** step-by-step solutions revealed one move at a time.
  5. **Mastery check:** graded problems with hints, instant feedback and full solutions.
- **Pacing planner:** *Steady Mastery (28 days)* is the default, plus a 14-day sprint and a 7-day **review-only** mode with a clear warning that fast pacing builds familiarity, not mastery.
- **Timed drill exams:** six templates with countdown timers, keyboard shortcuts (which can be turned off), per-topic accuracy and a missed-problem review.
- **Formula vault:** searchable KaTeX formulas with stated conditions, category filters and flashcard-style active recall.
- **Progress that you own:** saved in your browser, with **Export** and **Import** (JSON) so you can back it up or move it between devices.
- **Accessibility work:** text descriptions and live readouts for the labs, visible focus rings on sliders, WCAG AA text contrast, reduced-motion support and a keyboard-shortcut toggle.
- **Report an error:** every problem, example, exam question and formula has a link that opens a prefilled GitHub issue with the item's ID.

## By the numbers

| | |
|---|---|
| Modules | 20 |
| Mastery problems | 60 |
| Worked examples | 36 |
| Formula vault entries | 49 |
| Interactive labs | 15 |
| Timed exam templates | 6 |
| Lecture slots | 80 (77 unique YouTube videos, link-checked) |

## Syllabus

**Precalculus Prep (optional warmup)**
Functions and transformations · Quadratics and polynomials · Rational functions and asymptotes · Exponentials, logarithms and inverses · Radians and the unit circle · Inverse trig, identities and sequences

**Calculus I**
Limits and continuity · Derivatives, chain rule and implicit differentiation · Extrema, L'Hôpital's rule, related rates and optimization · Riemann sums, the Fundamental Theorem and u-substitution · Area between curves and volumes of revolution

**Calculus II**
Integration by parts and trig integrals · Trig substitution and partial fractions · Improper integrals · Arc length, surface area and differential equations · Sequences and series · Alternating series, ratio and root tests · Power series and Taylor polynomials · Parametric and polar · Integration and series strategy review

**Planned:** linear approximation and differentials, Newton's method, hyperbolic functions, numerical integration error bounds, applications (work, hydrostatic force, centers of mass), polar conics.

## Getting started

### Requirements

- Node.js 20 or newer (or Bun)

### Install and run

```bash
git clone https://github.com/OWNER/calcatlas.git
cd calcatlas
npm install
npm run dev
```

Open <http://localhost:3000>.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with TypeScript |
| `npm test` | Run all unit tests (math, scheduler, grading, data integrity, storage migration) |
| `npm run check-links` | Check every YouTube video ID and external URL for dead links |

Continuous integration (`.github/workflows/ci.yml`) runs install, lint, test and build on every push and pull request.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · KaTeX · lucide-react · Node's built-in test runner via `tsx`

## Project structure

```
src/
├── App.tsx               Root navigation and persisted progress state
├── components/           Views: course plan, study studio, video theater,
│                         interactive labs, drill exams, formula vault, About
├── data/                 Curriculum, textbook notes, media and formulas
├── types/                TypeScript interfaces
└── utils/                Math routines, scheduler, grading, storage migration,
                          issue links, and their tests
scripts/
└── check-links.ts        Dead-link checker
```

## Your data and privacy

CalcAtlas has no accounts and no backend. Your progress is stored only in your browser (`localStorage`, key `calcatlas_progress_v2`). Clearing site data erases it, so use **Export Progress** to keep a backup. The app does not call any external API; the only third-party content is the embedded YouTube videos, which are loaded by your browser from YouTube.

## Accuracy and known issues

Mathematical correctness matters more than anything else here. Answer keys, solutions and formulas are checked by an automated test suite, but tests can share a mistake with the code they check, so human review is welcome. Open questions and uncertain items are tracked in [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md).

Found a mistake? Use the **Report an error** link on the item itself, or [open an issue](https://github.com/OWNER/calcatlas/issues/new) with the item ID.

## Contributing

Contributions are welcome, especially:
- math review of problems, solutions and notes
- accessibility testing with screen readers (NVDA, JAWS, VoiceOver)
- new problems, labs and planned topics
- translations

Please read [CONTRIBUTING.md](CONTRIBUTING.md) first, and run `npm run lint && npm test && npm run build` before opening a pull request.

## Licenses and credits

- **Source code:** [Apache-2.0](LICENSE)
- **OpenStax-derived notes:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), with per-section attribution in the app (see the About, Credits & Licensing page at `#/about`)

CalcAtlas links to or embeds the following free resources. It does not own them:

- **[Professor Leonard](https://www.youtube.com/@ProfessorLeonard)**: Precalculus, Calculus 1 and Calculus 2 lecture playlists
- **[3Blue1Brown](https://www.3blue1brown.com/)**: *Essence of Calculus*
- **[OpenStax](https://openstax.org/)**: Precalculus 2e and Calculus Volumes 1-2
- **[Paul's Online Math Notes](https://tutorial.math.lamar.edu/)**: links only
- **[MIT OpenCourseWare 18.01SC](https://ocw.mit.edu/)**: links only

**CalcAtlas is an independent project. It is not affiliated with, sponsored by or endorsed by Professor Leonard, 3Blue1Brown, OpenStax, Lamar University or MIT.**

## Disclaimer

CalcAtlas is a study aid, not a substitute for a course, instructor or textbook, and it does not guarantee any exam result.
