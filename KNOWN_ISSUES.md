# Known Issues & Math Content Review Log

This file tracks mathematical items, edge cases, and caveats flagged during independent verification. Items marked `NEEDS_REVIEW` require human editorial judgment before changing.

## `NEEDS_REVIEW` Items

1. **Duplicate Power-Reducing Identity Across Categories (`src/data/formulas.ts`, IDs `f-pa-power-red` and `f-tech-halfsin`)** — `NEEDS_REVIEW`
   - Both entries present the same identities ($\sin^2\theta = \frac{1-\cos(2\theta)}{2}$ and $\cos^2\theta = \frac{1+\cos(2\theta)}{2}$), once under Precalculus/Trig and once under Calculus II Integration Techniques.
   - Retained both so Formula Vault filters by course track show the identity in both contexts, and so the vault remains 49 entries. Decide whether to keep both or deduplicate into a cross-track entry.

2. **Technique-Selection Subjectivity (`src/data/curriculumCalc2.ts`, ID `p-d14-1`)** — `NEEDS_REVIEW`
   - Prompt asks for the "fastest optimal technique" to evaluate $\int \frac{x}{x^2+9}\,dx$. While $u$-substitution ($u = x^2 + 9$) is standard and direct, trigonometric substitution ($x = 3\tan\theta$) also produces a valid antiderivative. Consider whether the wording should say "most direct elementary technique" for stricter mathematical precision.

3. **Series Test Selection (`src/data/curriculumCalc2.ts`, ID `p-d14-2`)** — `NEEDS_REVIEW`
   - Prompt asks which test proves convergence of $\sum_{n=1}^\infty \frac{n^3+2}{4n^5-n+1}$ most directly. The stored answer (`Limit Comparison with 1/n²`) is correct and the distractors (`Ratio Test`, `Root Test`, `Alternating Series Test`) are indeed inconclusive or inapplicable, though Direct Comparison could also work if written as an option.

4. **Domain Implicit in Worked Example & Textbook Captions (`src/data/moduleTextbookPreAlg.ts`, section `P3.1`)** — `NEEDS_REVIEW`
   - The hole formula $\left(c, \frac{P_1(c)}{Q_1(c)}\right)$ assumes the factor $(x - c)$ cancels completely so $Q_1(c) \neq 0$ (fixed in the theorem block in `src/data/curriculumPreAlg.ts`; review the textbook prose in `src/data/moduleTextbookPreAlg.ts` to verify consistency).

5. **Placeholder Repository URL for "Report an Error" Links (`src/utils/issueLinks.ts`, constant `REPO_ISSUES_URL`)** — `NEEDS_REVIEW`
   - Currently points to `https://github.com/OWNER/calcatlas/issues/new`. Update `OWNER/calcatlas` to your actual GitHub username and repository name before deploying publicly.

## Verified & Fixed During Audit

- **All 60 Mastery Problems** and **all 36 Worked Examples** were independently checked via numerical integration (Simpson's rule), finite-difference derivatives, partial sums, and exact algebraic/trigonometric evaluation in `src/utils/mathVerification.test.ts`. All stored answer keys match independent calculations.
- **Formula Vault Rendering Fixes (`src/data/formulas.ts`)**: Added `relationTex` support so inequalities (`\le`), implications (`\implies`), and predicates (`:`) no longer concatenate an erroneous `=` sign (previously rendering false chained equalities such as `\sin^2\theta + \cos^2\theta = 1 = \tan^2\theta + 1 = \sec^2\theta` and malformed `|S - S_N| = \le b_{N+1}`).
- **Theorem Hypotheses Tightened**: Added explicit continuity, differentiability, non-zero denominator ($a \neq 0$, $x'(t) \neq 0$, $g'(x) \neq 0$, $P_0 \neq 0$), domain ($x, y > 0$), and Taylor remainder convergence ($R_n(x) \to 0$) hypotheses across `src/data/curriculumPreAlg.ts`, `src/data/curriculumCalc1.ts`, `src/data/curriculumCalc2.ts`, and `src/data/formulas.ts`.
