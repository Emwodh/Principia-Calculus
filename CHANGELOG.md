# Changelog

All notable changes to **CalcAtlas** are documented in this file.

## [1.0.0] - 2026-11-22

### Added
- **Independent Math Verification Suite (`src/utils/mathVerification.test.ts`)**: Automated numerical and algebraic verification across all 60 mastery problems, 36 worked examples, and 49 Formula Vault entries, plus `KNOWN_ISSUES.md` tracking `NEEDS_REVIEW` items.
- **Per-Item Error Reporting (`src/utils/issueLinks.ts`)**: Added `"Report an error"` links opening prefilled GitHub issues with item IDs on every mastery problem, worked example, drill exam question, and formula card.
- **About, Credits & Licensing Page (`#/about`)**: Explicit non-affiliation disclaimers (Professor Leonard, 3Blue1Brown, OpenStax, Paul's Online Math Notes, MIT OCW), dual licensing explanation (code: Apache-2.0, OpenStax-derived notes: CC BY 4.0), and per-section OpenStax CC BY 4.0 attribution in textbook views.
- **Link & Video Health Checker (`scripts/check-links.ts`)**: Automated `npm run check-links` validator for all 77 unique YouTube lectures and 36 external URLs, plus an in-player fallback UI (`VideoCourseTheater`) with direct YouTube watch and playlist links.
- **Testing & GitHub Actions CI (`.github/workflows/ci.yml`)**: Added `npm test`, expanded scheduler/grading/data-integrity test suites, and automated CI pipeline running `npm ci`, `npm run lint`, `npm test`, and `npm run build`.
- **Versioned Progress Storage & JSON Backup**: Added `schemaVersion: 2`, `migrateProgressState`, legacy key migration, and validated **Export Progress / Import Progress (JSON)** controls with inline status/error feedback.
- **Accessibility Improvements**: Added dynamic `<desc>` elements and accessible names to all 15 SVG labs, `aria-live="polite"` readouts, visible keyboard focus rings on custom and native sliders, WCAG AA text contrast upgrades, `prefers-reduced-motion` scroll handling, and a screen-reader-safe toggle for timed exam single-key shortcuts.
- **Repository Documentation**: Added `CONTRIBUTING.md` and `CHANGELOG.md`.

### Changed
- **Renamed Project to CalcAtlas**: Updated branding, package name, document title, storage key (`calcatlas_progress_v2` with automatic migration from legacy key), and docs.
- **Default Pacing & Understanding-Focused Framing**: Set the 28-day Steady Mastery plan as default, relabeled 7-day pacing as *"Review Only (2/day)"* with a visible mastery warning, and replaced cram/trick language with understanding-focused framing.
- **Syllabus Consistency**: Renamed *"Pre-Algebra"* to *"Precalculus Prep"* throughout types, data, UI, and tests; documented Day 3 two-session guidance and planned future topics in `README.md`.
- **Build Configuration**: Cleaned up `vite.config.ts` (switched to `import.meta.dirname`, aligned `@` alias to `./src`, explained asset-copy plugin) and removed unused `.env.example`.

### Fixed
- Fixed 2 broken Paul's Online Math Notes URLs (`DerivativeIntro.aspx` and `SeriesStrategy.aspx`) identified by `npm run check-links`.
- Fixed chained equality/inequality rendering in `FormulaEntry` (`relationTex`) and tightened continuity, differentiability, and convergence hypotheses on core theorems.
