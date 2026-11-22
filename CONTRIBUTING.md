# Contributing to CalcAtlas

Thank you for helping improve **CalcAtlas**. Contributions are welcome across mathematical accuracy, accessibility, interactive labs, tests, and documentation.

---

## Development Setup

### Prerequisites
- Node.js 20+
- npm 10+

### Local Commands

```bash
# Install dependencies
npm install

# Run development server on http://localhost:3000
npm run dev

# Type-check TypeScript
npm run lint

# Run all unit, data integrity, and math verification tests
npm test

# Verify all 77 YouTube video IDs and 36 external reference URLs
npm run check-links

# Build production bundle
npm run build
```

---

## Mathematical Accuracy Policy

1. **Never invent or guess math.** Every new or modified mastery problem, worked example, or formula entry must be verified independently (symbolically and/or numerically).
2. **Update verification tests.** If you add or edit a problem in `src/data/curriculum*.ts`, update `src/utils/mathVerification.test.ts` so `npm test` independently checks the answer.
3. **Check theorem hypotheses.** Always include required continuity, differentiability, domain, and convergence hypotheses in theorem statements and Formula Vault cards.
4. **Flag uncertainty transparently.** If something looks suspicious and cannot be resolved with certainty, document the file path, item ID, and concern in `KNOWN_ISSUES.md` with status `NEEDS_REVIEW`.
5. **Respect external licensing.**
   - Application source code is licensed under **Apache-2.0**.
   - OpenStax-derived chapter study notes are licensed under **CC BY 4.0** with per-section attribution.
   - Paul's Online Math Notes and MIT OCW 18.01SC must appear as **outbound links only** (do not copy text or problem statements).

---

## Pull Request Checklist

Before opening a pull request, confirm:

- [ ] `npm run lint` passes with zero TypeScript errors.
- [ ] `npm test` passes (all numerical engine, progress/migration, data integrity, and math verification tests).
- [ ] `npm run build` completes cleanly with zero errors.
- [ ] If you edited `src/data/moduleMediaAndNotes.ts`, `npm run check-links` exits `0`.
- [ ] Any new interactive SVG includes `role="img"`, `aria-label`, `<desc>`, keyboard-accessible controls, and `aria-live="polite"` readouts.
- [ ] Changes keep existing directory structure (`src/components`, `src/data`, `src/utils`, `src/types`).
