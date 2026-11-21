import type { CourseModule } from '../types/course';

export const PREALG_MODULES: CourseModule[] = [
  {
    id: 'prealg-functions',
    dayNumber: 1,
    course: 'prealg',
    phase: 'Pre-Algebra · Foundation 1',
    title: 'Functions, Domains, Graphs & Transformations',
    subtitle:
      'Build rock-solid mastery of function notation, domain restrictions, even/odd symmetry, transformations, and average rate of change.',
    estimatedMinutes: 110,
    labType: 'prealg-functions',
    labTitle: 'Function Behavior, Domains & Discontinuities Lab',
    labObjective:
      'Inspect how algebraic expressions behave near domain exclusions and how transformations shift a parent curve.',
    keyTopics: [
      'Function evaluation & domain restrictions (denominators, even roots)',
      'Even vs. odd symmetry & increasing/decreasing intervals',
      'Parent library graphs & rigid/non-rigid transformations',
      'Average rate of change & the difference quotient',
    ],
    prerequisites: ['Basic arithmetic', 'Linear equations'],
    studySprintChecklist: [
      'Watch Professor Leonard’s Precalculus College Algebra 1–15 selections (focus on domain and transformations).',
      'Read OpenStax Precalculus 2e Chapter 1 theory notes below.',
      'Practice domain and difference quotient drills on Paul’s Online Math Notes.',
      'Pass all 3 Mastery Check problems without checking hints.',
    ],
    theorems: [
      {
        title: 'Domain Restrictions for Real-Valued Functions',
        statement:
          'For algebraic functions over the real numbers, exclude any input x that causes division by zero or places a negative value inside an even-index radical.',
        formulaTex:
          '\\frac{P(x)}{Q(x)}:\\; Q(x) \\neq 0 \\qquad\\Big|\\qquad \\sqrt[2k]{g(x)}:\\; g(x) \\ge 0',
        intuition:
          'Every domain problem in calculus reduces to checking three guards: no dividing by zero, no negative numbers under even roots, and strictly positive arguments inside logarithms.',
        examTip:
          'When an even root sits in the denominator, like 1/√(x − 3), the inequality becomes strict: x − 3 > 0.',
      },
      {
        title: 'Average Rate of Change & Difference Quotient',
        statement:
          'The average rate of change of f on [a, b] equals the slope of the secant line joining (a, f(a)) and (b, f(b)). Setting b = x + h yields the difference quotient.',
        formulaTex:
          '\\text{AROC}_{[a,b]} = \\frac{f(b) - f(a)}{b - a} \\qquad\\Big|\\qquad \\frac{f(x+h) - f(x)}{h} \\quad (h \\neq 0)',
        intuition:
          'Simplifying the difference quotient until the h in the denominator cancels is the exact algebraic skill Calculus I uses to compute every derivative from first principles.',
        examTip:
          'Always wrap f(x) in parentheses when subtracting f(x + h) − f(x) so every sign distributes cleanly.',
      },
    ],
    commonTraps: [
      {
        trap: 'Shifting f(x − 3) to the LEFT by 3 units.',
        fix: 'Horizontal transformations act inversely: f(x − h) shifts RIGHT by h, while f(x + h) shifts LEFT by h.',
      },
      {
        trap: 'Expanding (x + h)² as x² + h² inside a difference quotient.',
        fix: 'Always include the middle cross-term: (x + h)² = x² + 2xh + h².',
      },
    ],
    workedExamples: [
      {
        id: 'ex-pa1-1',
        title: 'Find the Domain of a Radical Rational Function',
        difficulty: 'Core',
        problemTex: 'f(x) = \\frac{\\sqrt{x + 4}}{x^2 - 9}',
        steps: [
          {
            label: 'Enforce the even-root condition',
            explanation: 'The radicand inside the square root must be non-negative.',
            mathTex: 'x + 4 \\ge 0 \\implies x \\ge -4',
          },
          {
            label: 'Exclude zeros of the denominator',
            explanation: 'Factor x² − 9 = 0 to find forbidden vertical-asymptote inputs.',
            mathTex: 'x^2 - 9 = (x - 3)(x + 3) = 0 \\implies x \\neq -3,\\; x \\neq 3',
          },
          {
            label: 'Combine both restrictions in interval notation',
            explanation: 'Start at −4 (included) and punch holes at −3 and 3.',
            mathTex: '[-4, -3) \\cup (-3, 3) \\cup (3, \\infty)',
          },
        ],
        finalAnswerTex: '[-4, -3) \\cup (-3, 3) \\cup (3, \\infty)',
      },
      {
        id: 'ex-pa1-2',
        title: 'Simplify a Quadratic Difference Quotient',
        difficulty: 'Exam Standard',
        problemTex: '\\text{For } f(x) = 2x^2 - 3x + 1,\\; \\text{simplify } \\frac{f(x+h) - f(x)}{h}',
        steps: [
          {
            label: 'Expand f(x + h)',
            explanation: 'Substitute (x + h) everywhere x appears and distribute carefully.',
            mathTex: 'f(x+h) = 2(x^2 + 2xh + h^2) - 3(x + h) + 1 = 2x^2 + 4xh + 2h^2 - 3x - 3h + 1',
          },
          {
            label: 'Subtract f(x) and cancel non-h terms',
            explanation: 'Every term without an h must cancel completely; if not, re-check your algebra.',
            mathTex: 'f(x+h) - f(x) = 4xh + 2h^2 - 3h = h(4x + 2h - 3)',
          },
          {
            label: 'Divide by h',
            explanation: 'Cancel the common factor h (valid for h ≠ 0).',
            mathTex: '\\frac{h(4x + 2h - 3)}{h} = 4x + 2h - 3',
          },
        ],
        finalAnswerTex: '4x + 2h - 3',
      },
    ],
    practiceProblems: [
      {
        id: 'prob-pa1-1',
        moduleId: 'prealg-functions',
        course: 'prealg',
        topicTag: 'Domain Restrictions',
        difficulty: 'Core',
        prompt: 'What is the domain of the real-valued function below?',
        promptTex: 'g(x) = \\frac{1}{\\sqrt{5 - x}}',
        options: [
          { id: 'a', labelTex: '(-\\infty, 5]' },
          { id: 'b', labelTex: '(-\\infty, 5)' },
          { id: 'c', labelTex: '(5, \\infty)' },
          { id: 'd', labelTex: '[5, \\infty)' },
        ],
        correctOptionId: 'b',
        hint: 'Because the square root is in the denominator, the radicand must be strictly greater than 0.',
        solutionTex: '5 - x > 0 \\implies x < 5 \\implies (-\\infty, 5)',
        solutionExplanation:
          'A square root requires 5 − x ≥ 0, and sitting in the denominator excludes 5 − x = 0, leaving strictly x < 5.',
      },
      {
        id: 'prob-pa1-2',
        moduleId: 'prealg-functions',
        course: 'prealg',
        topicTag: 'Even & Odd Symmetry',
        difficulty: 'Core',
        prompt: 'Classify the symmetry of the function:',
        promptTex: 'f(x) = x^3 - 4x',
        options: [
          { id: 'a', labelTex: '\\text{Even (symmetric about } y\\text{-axis)}' },
          { id: 'b', labelTex: '\\text{Odd (symmetric about origin)}' },
          { id: 'c', labelTex: '\\text{Neither even nor odd}' },
          { id: 'd', labelTex: '\\text{Both even and odd}' },
        ],
        correctOptionId: 'b',
        hint: 'Evaluate f(−x) and compare with f(x) and −f(x).',
        solutionTex: 'f(-x) = (-x)^3 - 4(-x) = -x^3 + 4x = -(x^3 - 4x) = -f(x)',
        solutionExplanation:
          'Because f(−x) = −f(x) for all x, the function is odd and symmetric with respect to the origin.',
      },
      {
        id: 'prob-pa1-3',
        moduleId: 'prealg-functions',
        course: 'prealg',
        topicTag: 'Difference Quotient',
        difficulty: 'Exam Standard',
        prompt: 'Evaluate and simplify the difference quotient for f(x) = x² + 5x:',
        promptTex: '\\frac{f(x+h) - f(x)}{h}',
        options: [
          { id: 'a', labelTex: '2x + h + 5' },
          { id: 'b', labelTex: '2x + 5' },
          { id: 'c', labelTex: '2x + h' },
          { id: 'd', labelTex: 'x + h + 5' },
        ],
        correctOptionId: 'a',
        hint: 'Expand (x + h)² + 5(x + h), subtract (x² + 5x), then factor out h.',
        solutionTex: '\\frac{(x^2 + 2xh + h^2 + 5x + 5h) - (x^2 + 5x)}{h} = \\frac{h(2x + h + 5)}{h} = 2x + h + 5',
        solutionExplanation:
          'Both x² and 5x cancel out, leaving h(2x + h + 5)/h = 2x + h + 5.',
      },
    ],
  },
  {
    id: 'prealg-quadratics-polys',
    dayNumber: 2,
    course: 'prealg',
    phase: 'Pre-Algebra · Foundation 2',
    title: 'Quadratics, Polynomials, Division & Zeros',
    subtitle:
      'Master completing the square, the quadratic formula, polynomial end behavior, multiplicity, synthetic division, and the Rational Zeros Theorem.',
    estimatedMinutes: 115,
    labType: 'prealg-quadratics',
    labTitle: 'Polynomial Roots, Turning Points & End Behavior Lab',
    labObjective:
      'Explore how leading degree, roots, and turning points govern polynomial shapes and sign changes.',
    keyTopics: [
      'Factoring, Completing the Square & Quadratic Formula',
      'Polynomial end behavior & root multiplicity (cross vs. bounce)',
      'Long division & Synthetic division + Remainder Theorem',
      'Rational Zeros Theorem & Complex Conjugate Roots',
    ],
    prerequisites: ['Prep 1: Functions & Graphs'],
    studySprintChecklist: [
      'Watch Professor Leonard’s Completing the Square, Quadratic Formula, Multiplicity, and Division lectures.',
      'Study OpenStax Precalculus 2e Chapter 3 (Sections 3.2–3.6) theory notes below.',
      'Work through Paul’s Online Math Notes quadratic and polynomial division exercises.',
      'Complete all 3 Mastery Check drills.',
    ],
    theorems: [
      {
        title: 'Completing the Square & Vertex Form',
        statement:
          'Any quadratic ax² + bx + c (a ≠ 0) can be rewritten in vertex form a(x − h)² + k by factoring out a from the x-terms and adding/subtracting (b / 2a)² inside.',
        formulaTex:
          'ax^2 + bx + c = a\\left(x + \\frac{b}{2a}\\right)^2 + \\left(c - \\frac{b^2}{4a}\\right) \\qquad\\Big|\\qquad x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        intuition:
          'Completing the square is not just for solving quadratics—in Calculus II you will use it constantly to rewrite integrals into arctan and arcsin forms.',
        examTip:
          'When factoring out a from ax² + bx, remember that adding (b/2a)² inside the parentheses actually adds a·(b/2a)² to the expression—subtract that same scaled amount outside.',
      },
      {
        title: 'Factor Theorem, Multiplicity & Rational Zeros',
        statement:
          'c is a zero of polynomial P(x) iff (x − c) is a factor. At a zero of odd multiplicity the graph crosses the x-axis; at even multiplicity it bounces tangent to the x-axis.',
        formulaTex:
          'P(x) = a_n x^n + \\cdots + a_0 \\implies \\text{possible rational zeros} = \\pm \\frac{\\text{factors of } a_0}{\\text{factors of } a_n}',
        intuition:
          'Combined with synthetic division, the Rational Zeros Theorem lets you peel off linear factors from cubic and quartic polynomials until only a quadratic remains.',
        examTip:
          'Always check whether complex roots come in conjugate pairs a ± bi whenever polynomial coefficients are real.',
      },
    ],
    commonTraps: [
      {
        trap: 'Forgetting a 0 placeholder column in synthetic division when a power of x is missing (e.g., x³ − 4x + 1).',
        fix: 'Write every descending power explicitly: 1, 0, −4, 1 before running synthetic division.',
      },
      {
        trap: 'Forgetting the ± when taking the square root of both sides of (x − 3)² = 7.',
        fix: 'Square-rooting a squared variable always produces two branches: x − 3 = ±√7.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-pa2-1',
        title: 'Complete the Square with Leading Coefficient a ≠ 1',
        difficulty: 'Core',
        problemTex: '\\text{Rewrite } f(x) = 2x^2 - 12x + 23 \\text{ in vertex form } a(x - h)^2 + k.',
        steps: [
          {
            label: 'Factor out a = 2 from the x-terms',
            explanation: 'Leave the constant 23 outside.',
            mathTex: 'f(x) = 2(x^2 - 6x) + 23',
          },
          {
            label: 'Add and balance (b/2)² = (−6/2)² = 9',
            explanation: 'Adding 9 inside multiplies by 2, so subtract 2(9) = 18 outside.',
            mathTex: 'f(x) = 2(x^2 - 6x + 9) + 23 - 18',
          },
          {
            label: 'Write as a perfect square',
            explanation: 'Read off the vertex directly as (3, 5).',
            mathTex: 'f(x) = 2(x - 3)^2 + 5',
          },
        ],
        finalAnswerTex: '2(x - 3)^2 + 5',
      },
      {
        id: 'ex-pa2-2',
        title: 'Factor a Cubic Using the Rational Zeros Theorem',
        difficulty: 'Exam Standard',
        problemTex: '\\text{Find all real zeros of } P(x) = x^3 - 2x^2 - 5x + 6.',
        steps: [
          {
            label: 'Test simple candidate zeros (±1, ±2, ±3, ±6)',
            explanation: 'Check x = 1 first: 1 − 2 − 5 + 6 = 0, so (x − 1) is a factor.',
            mathTex: 'P(1) = 1 - 2 - 5 + 6 = 0 \\implies (x - 1) \\text{ divides } P(x)',
          },
          {
            label: 'Divide out (x − 1) via synthetic division',
            explanation: 'Coefficients 1, −2, −5, 6 with c = 1 yield depressed quotient 1, −1, −6, remainder 0.',
            mathTex: 'P(x) = (x - 1)(x^2 - x - 6)',
          },
          {
            label: 'Factor the remaining quadratic',
            explanation: 'Split x² − x − 6 into (x − 3)(x + 2).',
            mathTex: 'P(x) = (x - 1)(x - 3)(x + 2) \\implies x = -2,\\; 1,\\; 3',
          },
        ],
        finalAnswerTex: 'x \\in \\{-2,\\; 1,\\; 3\\}',
      },
    ],
    practiceProblems: [
      {
        id: 'prob-pa2-1',
        moduleId: 'prealg-quadratics-polys',
        course: 'prealg',
        topicTag: 'Completing the Square',
        difficulty: 'Core',
        prompt: 'Which expression equals x² + 8x + 21 in completed-square form?',
        promptTex: 'x^2 + 8x + 21',
        options: [
          { id: 'a', labelTex: '(x + 4)^2 + 5' },
          { id: 'b', labelTex: '(x + 4)^2 + 21' },
          { id: 'c', labelTex: '(x + 8)^2 - 43' },
          { id: 'd', labelTex: '(x + 4)^2 + 37' },
        ],
        correctOptionId: 'a',
        hint: 'Take half of 8 (which is 4), square it (16), and rewrite 21 = 16 + 5.',
        solutionTex: 'x^2 + 8x + 16 + 5 = (x + 4)^2 + 5',
        solutionExplanation:
          'Adding and subtracting (8/2)² = 16 turns x² + 8x + 21 into (x + 4)² + 5.',
      },
      {
        id: 'prob-pa2-2',
        moduleId: 'prealg-quadratics-polys',
        course: 'prealg',
        topicTag: 'Multiplicity',
        difficulty: 'Core',
        prompt: 'How does the graph of P(x) = −2(x + 1)²(x − 4)³ behave at x = −1 and x = 4?',
        promptTex: 'P(x) = -2(x + 1)^2(x - 4)^3',
        options: [
          { id: 'a', labelTex: '\\text{Crosses at } -1,\\; \\text{bounces at } 4' },
          { id: 'b', labelTex: '\\text{Bounces at } -1,\\; \\text{crosses at } 4' },
          { id: 'c', labelTex: '\\text{Crosses at both } -1 \\text{ and } 4' },
          { id: 'd', labelTex: '\\text{Bounces at both } -1 \\text{ and } 4' },
        ],
        correctOptionId: 'b',
        hint: 'Even multiplicity touches and turns around (bounces); odd multiplicity crosses the x-axis.',
        solutionTex: 'm(-1)=2 \\text{ (even: bounce)},\\quad m(4)=3 \\text{ (odd: cross)}',
        solutionExplanation:
          'Zero −1 has even multiplicity 2 so the curve is tangent and bounces; zero 4 has odd multiplicity 3 so it flattens and crosses.',
      },
      {
        id: 'prob-pa2-3',
        moduleId: 'prealg-quadratics-polys',
        course: 'prealg',
        topicTag: 'Remainder Theorem',
        difficulty: 'Exam Standard',
        prompt: 'Find the remainder when P(x) = 2x³ − 5x + 7 is divided by (x − 2):',
        promptTex: '\\frac{2x^3 - 5x + 7}{x - 2}',
        options: [
          { id: 'a', labelTex: '13' },
          { id: 'b', labelTex: '11' },
          { id: 'c', labelTex: '1' },
          { id: 'd', labelTex: '23' },
        ],
        correctOptionId: 'a',
        hint: 'By the Remainder Theorem, dividing P(x) by (x − c) leaves remainder P(c).',
        solutionTex: 'P(2) = 2(2)^3 - 5(2) + 7 = 16 - 10 + 7 = 13',
        solutionExplanation:
          'Evaluating P(2) directly gives 16 − 10 + 7 = 13 without needing full long division.',
      },
    ],
  },
  {
    id: 'prealg-rationals-inequalities',
    dayNumber: 3,
    course: 'prealg',
    phase: 'Pre-Algebra · Foundation 3',
    title: 'Rational Functions, Asymptotes, Holes & Inequalities',
    subtitle:
      'Analyze vertical, horizontal, and oblique asymptotes, removable holes, and sign charts for polynomial and rational inequalities.',
    estimatedMinutes: 110,
    labType: 'prealg-rationals',
    labTitle: 'Holes vs. Vertical Asymptotes Explorer',
    labObjective:
      'Distinguish canceled common factors (removable holes) from uncanceled denominator zeros (vertical asymptotes).',
    keyTopics: [
      'Removable holes vs. vertical asymptotes (factoring first!)',
      'Horizontal asymptotes by degree comparison (n < m, n = m, n > m)',
      'Oblique (slant) asymptotes via polynomial long division',
      'Sign charts for polynomial and rational inequalities',
    ],
    prerequisites: ['Prep 2: Polynomials & Factoring'],
    studySprintChecklist: [
      'Watch Professor Leonard’s Rational Functions & Asymptotes series (College Algebra 38–47).',
      'Read OpenStax Precalculus 2e Section 3.7 theory notes below.',
      'Solve rational graphing and inequality problems on Paul’s Online Math Notes.',
      'Score 3/3 on the Mastery Check below.',
    ],
    theorems: [
      {
        title: 'Asymptotes & Holes of R(x) = P(x) / Q(x)',
        statement:
          'Factor P(x) and Q(x) completely first. A factor (x − c) that cancels produces a hole at x = c; a denominator factor remaining after cancellation produces a vertical asymptote.',
        formulaTex:
          '\\deg P < \\deg Q \\Rightarrow y = 0 \\quad|\\quad \\deg P = \\deg Q \\Rightarrow y = \\frac{a_n}{b_m} \\quad|\\quad \\deg P = \\deg Q + 1 \\Rightarrow \\text{slant}',
        intuition:
          'Horizontal asymptotes directly preview Calculus I limits at infinity—only the highest powers in numerator and denominator matter when |x| grows huge.',
        examTip:
          'A graph can NEVER cross a vertical asymptote, but it CAN cross a horizontal or slant asymptote at finite x.',
      },
      {
        title: 'Sign-Chart Method for Rational Inequalities',
        statement:
          'Never cross-multiply by an expression containing x (whose sign is unknown). Move everything to one side as a single fraction N(x)/D(x) ⋛ 0, mark all zeros of N and D on a number line, and test each interval.',
        formulaTex:
          '\\frac{N(x)}{D(x)} \\ge 0 \\implies \\text{include } N(x)=0,\\; \\text{ALWAYS exclude } D(x)=0',
        intuition:
          'Sign charts are the exact same engine used in Calculus I First and Second Derivative Tests to classify increasing/decreasing intervals and concavity.',
        examTip:
          'Even for ≥ or ≤ inequalities, denominator zeros get open parentheses because division by zero is always undefined.',
      },
    ],
    commonTraps: [
      {
        trap: 'Multiplying both sides of (x + 1)/(x − 2) ≥ 3 by (x − 2).',
        fix: 'Since (x − 2) can be negative, multiplying flips the inequality unpredictably. Subtract 3 and combine over the common denominator (x − 2) instead.',
      },
      {
        trap: 'Calling x = 2 a vertical asymptote for (x² − 4)/(x − 2).',
        fix: 'Factor first! (x − 2)(x + 2)/(x − 2) = x + 2 for x ≠ 2, so x = 2 is a removable HOLE at (2, 4), not a vertical asymptote.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-pa3-1',
        title: 'Classify All Holes and Asymptotes of a Rational Function',
        difficulty: 'Core',
        problemTex: 'R(x) = \\frac{2x^2 - 2x - 4}{x^2 - 4}',
        steps: [
          {
            label: 'Factor numerator and denominator completely',
            explanation: 'Pull out the GCF 2 in the numerator and factor the difference of squares below.',
            mathTex: 'R(x) = \\frac{2(x - 2)(x + 1)}{(x - 2)(x + 2)}',
          },
          {
            label: 'Identify removable hole vs. vertical asymptote',
            explanation: '(x − 2) cancels (hole at x = 2); (x + 2) remains in the denominator (VA at x = −2).',
            mathTex: '\\text{Hole at } x = 2:\\; y = \\frac{2(2+1)}{2+2} = \\frac{3}{2} \\quad\\big|\\quad \\text{VA: } x = -2',
          },
          {
            label: 'Find the horizontal asymptote',
            explanation: 'Degrees are equal (both degree 2), so take the ratio of leading coefficients 2/1.',
            mathTex: '\\text{HA: } y = \\frac{2}{1} = 2',
          },
        ],
        finalAnswerTex: '\\text{Hole } (2, 3/2),\\; \\text{VA } x = -2,\\; \\text{HA } y = 2',
      },
      {
        id: 'ex-pa3-2',
        title: 'Solve a Rational Inequality with a Sign Chart',
        difficulty: 'Exam Standard',
        problemTex: '\\frac{x + 3}{x - 1} \\ge 0',
        steps: [
          {
            label: 'Locate critical boundary points',
            explanation: 'Numerator zero at x = −3 (included); denominator zero at x = 1 (excluded).',
            mathTex: 'x = -3 \\text{ (closed)},\\qquad x = 1 \\text{ (open)}',
          },
          {
            label: 'Test signs on (−∞, −3), (−3, 1), and (1, ∞)',
            explanation: 'At x = −4: (−)/(−) = +. At x = 0: (+)/(−) = −. At x = 2: (+)/(+) = +.',
            mathTex: '(-\\infty, -3): + \\quad|\\quad (-3, 1): - \\quad|\\quad (1, \\infty): +',
          },
          {
            label: 'Write the union of non-negative intervals',
            explanation: 'Bracket −3 and keep a parenthesis on 1.',
            mathTex: '(-\\infty, -3] \\cup (1, \\infty)',
          },
        ],
        finalAnswerTex: '(-\\infty, -3] \\cup (1, \\infty)',
      },
    ],
    practiceProblems: [
      {
        id: 'prob-pa3-1',
        moduleId: 'prealg-rationals-inequalities',
        course: 'prealg',
        topicTag: 'Horizontal Asymptotes',
        difficulty: 'Core',
        prompt: 'Find the horizontal asymptote of:',
        promptTex: 'f(x) = \\frac{6x^2 - 5x + 1}{3x^2 + 4}',
        options: [
          { id: 'a', labelTex: 'y = 0' },
          { id: 'b', labelTex: 'y = 2' },
          { id: 'c', labelTex: 'y = \\frac{1}{4}' },
          { id: 'd', labelTex: '\\text{No horizontal asymptote}' },
        ],
        correctOptionId: 'b',
        hint: 'Compare the degrees of numerator and denominator, then take the ratio of leading coefficients.',
        solutionTex: '\\deg(\\text{num}) = \\deg(\\text{den}) = 2 \\implies y = \\frac{6}{3} = 2',
        solutionExplanation:
          'When numerator and denominator have the same degree, the horizontal asymptote is the ratio of their leading coefficients: 6/3 = 2.',
      },
      {
        id: 'prob-pa3-2',
        moduleId: 'prealg-rationals-inequalities',
        course: 'prealg',
        topicTag: 'Oblique Asymptote',
        difficulty: 'Exam Standard',
        prompt: 'Find the oblique (slant) asymptote of:',
        promptTex: 'R(x) = \\frac{x^2 + 3x + 5}{x + 1}',
        options: [
          { id: 'a', labelTex: 'y = x + 2' },
          { id: 'b', labelTex: 'y = x + 4' },
          { id: 'c', labelTex: 'y = x + 3' },
          { id: 'd', labelTex: 'y = x - 1' },
        ],
        correctOptionId: 'a',
        hint: 'Perform polynomial or synthetic division by (x + 1) and keep the linear quotient.',
        solutionTex: '\\frac{x^2 + 3x + 5}{x + 1} = (x + 2) + \\frac{3}{x + 1} \\implies y = x + 2',
        solutionExplanation:
          'As |x| → ∞, the remainder 3/(x + 1) vanishes, leaving the oblique asymptote y = x + 2.',
      },
      {
        id: 'prob-pa3-3',
        moduleId: 'prealg-rationals-inequalities',
        course: 'prealg',
        topicTag: 'Rational Inequalities',
        difficulty: 'Exam Standard',
        prompt: 'Solve the inequality:',
        promptTex: '\\frac{x - 4}{x + 2} < 0',
        options: [
          { id: 'a', labelTex: '(-\\infty, -2) \\cup (4, \\infty)' },
          { id: 'b', labelTex: '[-2, 4]' },
          { id: 'c', labelTex: '(-2, 4)' },
          { id: 'd', labelTex: '(-2, 4]' },
        ],
        correctOptionId: 'c',
        hint: 'Check the sign on each of the three intervals separated by x = −2 and x = 4.',
        solutionTex: '\\text{Test } x = 0:\\; \\frac{-4}{2} = -2 < 0 \\implies (-2, 4)',
        solutionExplanation:
          'The fraction is strictly negative only between its numerator and denominator zeros, giving (−2, 4).',
      },
    ],
  },
  {
    id: 'prealg-exp-log',
    dayNumber: 4,
    course: 'prealg',
    phase: 'Pre-Algebra · Foundation 4',
    title: 'Composite, Inverse, Exponential & Logarithmic Functions',
    subtitle:
      'Master function composition, one-to-one inverses, logarithm expansion/condensing laws, change of base, and exponential/log equations.',
    estimatedMinutes: 120,
    labType: 'prealg-exp-log',
    labTitle: 'Exponential Growth & Logarithmic Inverse Curves',
    labObjective:
      'Observe how exponential growth scales proportionally to its current value and why logarithms invert exponentials.',
    keyTopics: [
      'Composition (f ∘ g)(x) & domain of composite functions',
      'One-to-one test & finding inverse functions f⁻¹(x)',
      'Laws of logarithms (product, quotient, power & change of base)',
      'Solving exponential & logarithmic equations + extraneous roots',
    ],
    prerequisites: ['Prep 1: Functions & Domains'],
    studySprintChecklist: [
      'Watch Professor Leonard’s Composition, Inverses, Exponentials & Logarithms lectures (College Algebra 48–64).',
      'Read OpenStax Precalculus 2e Chapter 4 theory notes below.',
      'Practice inverse, exponential, and logarithmic equation drills on Paul’s Online Math Notes.',
      'Verify all 3 Mastery Check problems.',
    ],
    theorems: [
      {
        title: 'Logarithm Equivalence & Fundamental Log Laws',
        statement:
          'For base b > 0 (b ≠ 1) and strictly positive arguments M, N > 0, logarithms turn multiplication into addition, division into subtraction, and powers into front coefficients.',
        formulaTex:
          'y = \\log_b(x) \\iff b^y = x \\qquad\\Big|\\qquad \\ln(MN) = \\ln M + \\ln N,\\quad \\ln\\!\\left(\\frac{M}{N}\\right) = \\ln M - \\ln N,\\quad \\ln(M^r) = r\\ln M',
        intuition:
          'In Calculus I & II, expanding complex products/powers with ln before differentiating (logarithmic differentiation) turns brutal quotient/power rules into trivial linear sums.',
        examTip:
          'Change of base to natural log: log_b(x) = ln(x) / ln(b). Memorize ln(1) = 0, ln(e) = 1, and e^(ln x) = x.',
      },
      {
        title: 'Inverse Function Cancellation Identity',
        statement:
          'A function f has an inverse f⁻¹ iff f is one-to-one (passes the Horizontal Line Test). Its graph reflects across y = x, swapping domain and range.',
        formulaTex:
          'f\\big(f^{-1}(x)\\big) = x \\quad\\text{and}\\quad f^{-1}\\big(f(x)\\big) = x',
        intuition:
          'Every time you solve e^(2x) = 7 by taking ln of both sides, you are applying the inverse cancellation identity ln(e^(2x)) = 2x.',
        examTip:
          'Always plug solutions of logarithmic equations back into the ORIGINAL equation—any value that makes a log argument ≤ 0 is extraneous and must be rejected.',
      },
    ],
    commonTraps: [
      {
        trap: 'Writing ln(a + b) = ln(a) + ln(b) or ln(a)/ln(b) = ln(a − b).',
        fix: 'There is NO rule to split ln(a + b). Logs only split PRODUCTS and QUOTIENTS inside a single log: ln(ab) = ln a + ln b and ln(a/b) = ln a − ln b.',
      },
      {
        trap: 'Forgetting to reject negative extraneous solutions after solving log₂(x) + log₂(x − 2) = 3.',
        fix: 'Combining into x(x − 2) = 8 gives x = 4 or x = −2, but log₂(−2) is undefined! Only x = 4 survives.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-pa4-1',
        title: 'Solve an Exponential Equation Using Natural Logarithms',
        difficulty: 'Core',
        problemTex: '5 \\cdot e^{3x - 1} = 20',
        steps: [
          {
            label: 'Isolate the exponential term first',
            explanation: 'Divide both sides by 5 before taking logarithms.',
            mathTex: 'e^{3x - 1} = 4',
          },
          {
            label: 'Take the natural log of both sides',
            explanation: 'Apply the inverse property ln(e^u) = u.',
            mathTex: '\\ln(e^{3x - 1}) = \\ln(4) \\implies 3x - 1 = \\ln(4)',
          },
          {
            label: 'Solve linearly for x',
            explanation: 'Add 1 and divide by 3.',
            mathTex: 'x = \\frac{1 + \\ln 4}{3}',
          },
        ],
        finalAnswerTex: 'x = \\frac{1 + \\ln 4}{3}',
      },
      {
        id: 'ex-pa4-2',
        title: 'Solve a Logarithmic Equation & Check Domain',
        difficulty: 'Exam Standard',
        problemTex: '\\log_2(x) + \\log_2(x - 2) = 3',
        steps: [
          {
            label: 'Condense the left side into a single logarithm',
            explanation: 'Use the product rule log_b(M) + log_b(N) = log_b(MN).',
            mathTex: '\\log_2\\big(x(x - 2)\\big) = 3',
          },
          {
            label: 'Rewrite in exponential form and solve the quadratic',
            explanation: 'Base 2 raised to 3 equals 8.',
            mathTex: 'x^2 - 2x = 2^3 = 8 \\implies x^2 - 2x - 8 = 0 \\implies (x - 4)(x + 2) = 0',
          },
          {
            label: 'Reject extraneous roots violating the log domain',
            explanation: 'x = −2 gives log₂(−2), which is undefined; x = 4 satisfies both log₂(4) and log₂(2).',
            mathTex: 'x = 4 \\quad (\\text{reject } x = -2)',
          },
        ],
        finalAnswerTex: 'x = 4',
      },
    ],
    practiceProblems: [
      {
        id: 'prob-pa4-1',
        moduleId: 'prealg-exp-log',
        course: 'prealg',
        topicTag: 'Logarithm Properties',
        difficulty: 'Core',
        prompt: 'Which expression is the complete expansion of:',
        promptTex: '\\ln\\!\\left(\\frac{x^3 \\sqrt{y}}{e^2}\\right)',
        options: [
          { id: 'a', labelTex: '3\\ln x + \\frac{1}{2}\\ln y - 2' },
          { id: 'b', labelTex: '3\\ln x + \\frac{1}{2}\\ln y - 2e' },
          { id: 'c', labelTex: '\\frac{3\\ln x \\cdot \\frac{1}{2}\\ln y}{2}' },
          { id: 'd', labelTex: '3\\ln x - \\frac{1}{2}\\ln y - 2' },
        ],
        correctOptionId: 'a',
        hint: 'Write √y as y^(1/2), split the product/quotient, bring exponents forward, and use ln(e²) = 2.',
        solutionTex: '\\ln(x^3) + \\ln(y^{1/2}) - \\ln(e^2) = 3\\ln x + \\frac{1}{2}\\ln y - 2',
        solutionExplanation:
          'Product becomes addition, quotient becomes subtraction, exponents pull in front, and ln(e²) simplifies to 2.',
      },
      {
        id: 'prob-pa4-2',
        moduleId: 'prealg-exp-log',
        course: 'prealg',
        topicTag: 'Inverse Functions',
        difficulty: 'Core',
        prompt: 'Find the inverse function f⁻¹(x) for:',
        promptTex: 'f(x) = \\frac{2x + 1}{x - 3}',
        options: [
          { id: 'a', labelTex: 'f^{-1}(x) = \\frac{3x + 1}{x - 2}' },
          { id: 'b', labelTex: 'f^{-1}(x) = \\frac{x - 3}{2x + 1}' },
          { id: 'c', labelTex: 'f^{-1}(x) = \\frac{3x - 1}{x + 2}' },
          { id: 'd', labelTex: 'f^{-1}(x) = \\frac{2x - 1}{x + 3}' },
        ],
        correctOptionId: 'a',
        hint: 'Swap x and y, multiply by (y − 3), gather all y-terms on one side, and factor out y.',
        solutionTex: 'x(y - 3) = 2y + 1 \\implies xy - 2y = 3x + 1 \\implies y = \\frac{3x + 1}{x - 2}',
        solutionExplanation:
          'Collecting y(x − 2) = 3x + 1 immediately yields f⁻¹(x) = (3x + 1)/(x − 2).',
      },
      {
        id: 'prob-pa4-3',
        moduleId: 'prealg-exp-log',
        course: 'prealg',
        topicTag: 'Exponential Equations',
        difficulty: 'Exam Standard',
        prompt: 'Solve for x:',
        promptTex: '3^{2x - 1} = 27^{x + 2}',
        options: [
          { id: 'a', labelTex: 'x = -7' },
          { id: 'b', labelTex: 'x = 7' },
          { id: 'c', labelTex: 'x = -3' },
          { id: 'd', labelTex: 'x = 5' },
        ],
        correctOptionId: 'a',
        hint: 'Rewrite 27 as 3³ so both sides share the common base 3.',
        solutionTex: '3^{2x - 1} = (3^3)^{x + 2} = 3^{3x + 6} \\implies 2x - 1 = 3x + 6 \\implies x = -7',
        solutionExplanation:
          'Equating exponents of base 3 gives 2x − 1 = 3x + 6, so x = −7.',
      },
    ],
  },
  {
    id: 'prealg-trig-unit-circle',
    dayNumber: 5,
    course: 'prealg',
    phase: 'Pre-Algebra · Foundation 5',
    title: 'Radians, The Unit Circle & Trigonometric Graphs',
    subtitle:
      'Internalize radian measure, exact special-angle values on the unit circle, all six trig functions, and amplitude/period/phase-shift graphs.',
    estimatedMinutes: 115,
    labType: 'prealg-unit-circle',
    labTitle: 'Unit Circle & Trigonometric Angle Geometry Lab',
    labObjective:
      'Connect angle sweeps θ in radians to circular coordinates (cos θ, sin θ) and periodic wave amplitudes.',
    keyTopics: [
      'Radian measure (π rad = 180°), arc length s = rθ & sector area',
      'Unit circle exact values at 0, π/6, π/4, π/3, π/2 & quadrant signs',
      'Reciprocal, quotient & Pythagorean trig identities',
      'Graphing sin, cos, tan, sec, csc with amplitude, period & phase shift',
    ],
    prerequisites: ['Prep 1: Graph Transformations'],
    studySprintChecklist: [
      'Watch Professor Leonard’s Trigonometry 1–16 highlights (Radians, Unit Circle, Trig Graphs).',
      'Read OpenStax Precalculus 2e Chapters 5 & 6 theory notes below.',
      'Drill exact unit circle evaluations on Paul’s Online Math Notes.',
      'Pass all 3 Mastery Check problems cleanly without a calculator.',
    ],
    theorems: [
      {
        title: 'Unit Circle Definition & Pythagorean Identities',
        statement:
          'For any real angle θ in radians, the terminal point on the unit circle x² + y² = 1 is (cos θ, sin θ). Dividing x² + y² = 1 by cos² θ or sin² θ yields all three Pythagorean identities.',
        formulaTex:
          '\\sin^2\\theta + \\cos^2\\theta = 1 \\qquad\\Big|\\qquad \\tan^2\\theta + 1 = \\sec^2\\theta \\qquad\\Big|\\qquad 1 + \\cot^2\\theta = \\csc^2\\theta',
        intuition:
          'Calculus ALWAYS uses radians—derivative formulas like d/dx(sin x) = cos x fail completely if x is measured in degrees!',
        examTip:
          'Memorize just Quadrant I (π/6, π/4, π/3) using the square-root pattern sin θ = √1/2, √2/2, √3/2, then attach quadrant signs via ASTC.',
      },
      {
        title: 'Sinusoidal Wave Parameters',
        statement:
          'For y = A sin(B(x − C)) + D (or cos), |A| is the amplitude, 2π/|B| is the period, C is the horizontal phase shift, and D is the vertical midline.',
        formulaTex:
          'y = A\\sin\\!\\big(B(x - C)\\big) + D \\implies \\text{Period } T = \\frac{2\\pi}{|B|} \\quad (\\text{for } \\tan/\\cot:\\; T = \\frac{\\pi}{|B|})',
        intuition:
          'Factoring B out of Bx − φ is the single step that prevents phase-shift errors.',
        examTip:
          'For y = sin(2x − π/3), factor as sin(2(x − π/6))—the phase shift is π/6 right, NOT π/3.',
      },
    ],
    commonTraps: [
      {
        trap: 'Using degrees instead of radians in arc length s = rθ or calculus formulas.',
        fix: 'Convert degrees to radians immediately by multiplying by π/180°.',
      },
      {
        trap: 'Misreading the phase shift of cos(3x − π) as π instead of π/3.',
        fix: 'Always factor out the coefficient of x first: cos(3(x − π/3)) shifts right by π/3.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-pa5-1',
        title: 'Evaluate Exact Unit Circle Values Using Reference Angles',
        difficulty: 'Core',
        problemTex: '\\text{Find exact values of } \\sin\\!\\left(\\frac{5\\pi}{6}\\right),\\; \\cos\\!\\left(\\frac{4\\pi}{3}\\right),\\; \\text{and } \\sec\\!\\left(\\frac{7\\pi}{4}\\right).',
        steps: [
          {
            label: 'Locate quadrant and reference angle for 5π/6',
            explanation: '5π/6 is in Quadrant II (sin > 0) with reference angle π/6.',
            mathTex: '\\sin\\!\\left(\\frac{5\\pi}{6}\\right) = +\\sin\\!\\left(\\frac{\\pi}{6}\\right) = \\frac{1}{2}',
          },
          {
            label: 'Locate quadrant and reference angle for 4π/3',
            explanation: '4π/3 is in Quadrant III (cos < 0) with reference angle π/3.',
            mathTex: '\\cos\\!\\left(\\frac{4\\pi}{3}\\right) = -\\cos\\!\\left(\\frac{\\pi}{3}\\right) = -\\frac{1}{2}',
          },
          {
            label: 'Use reciprocal identity for sec(7π/4)',
            explanation: '7π/4 is in Quadrant IV (cos > 0) with reference angle π/4.',
            mathTex: '\\sec\\!\\left(\\frac{7\\pi}{4}\\right) = \\frac{1}{\\cos(7\\pi/4)} = \\frac{1}{\\sqrt{2}/2} = \\sqrt{2}',
          },
        ],
        finalAnswerTex: '\\frac{1}{2},\\; -\\frac{1}{2},\\; \\sqrt{2}',
      },
    ],
    practiceProblems: [
      {
        id: 'prob-pa5-1',
        moduleId: 'prealg-trig-unit-circle',
        course: 'prealg',
        topicTag: 'Unit Circle Exact Values',
        difficulty: 'Core',
        prompt: 'Evaluate the exact value of:',
        promptTex: '\\tan\\!\\left(\\frac{2\\pi}{3}\\right)',
        options: [
          { id: 'a', labelTex: '-\\sqrt{3}' },
          { id: 'b', labelTex: '\\sqrt{3}' },
          { id: 'c', labelTex: '-\\frac{\\sqrt{3}}{3}' },
          { id: 'd', labelTex: '-\\frac{1}{2}' },
        ],
        correctOptionId: 'a',
        hint: '2π/3 lies in Quadrant II where sin = √3/2 and cos = −1/2.',
        solutionTex: '\\tan\\!\\left(\\frac{2\\pi}{3}\\right) = \\frac{\\sin(2\\pi/3)}{\\cos(2\\pi/3)} = \\frac{\\sqrt{3}/2}{-1/2} = -\\sqrt{3}',
        solutionExplanation:
          'In Quadrant II tangent is negative, and tan(π/3) = √3, yielding −√3.',
      },
      {
        id: 'prob-pa5-2',
        moduleId: 'prealg-trig-unit-circle',
        course: 'prealg',
        topicTag: 'Period & Phase Shift',
        difficulty: 'Core',
        prompt: 'What are the period and horizontal phase shift of:',
        promptTex: 'y = 4\\cos\\!\\left(2x - \\frac{\\pi}{2}\\right)',
        options: [
          { id: 'a', labelTex: '\\text{Period } \\pi,\\; \\text{shift } \\frac{\\pi}{4} \\text{ right}' },
          { id: 'b', labelTex: '\\text{Period } \\pi,\\; \\text{shift } \\frac{\\pi}{2} \\text{ right}' },
          { id: 'c', labelTex: '\\text{Period } 2\\pi,\\; \\text{shift } \\frac{\\pi}{4} \\text{ left}' },
          { id: 'd', labelTex: '\\text{Period } 4\\pi,\\; \\text{shift } \\frac{\\pi}{2} \\text{ right}' },
        ],
        correctOptionId: 'a',
        hint: 'Factor 2 out of (2x − π/2) first.',
        solutionTex: '2\\!\\left(x - \\frac{\\pi}{4}\\right) \\implies T = \\frac{2\\pi}{2} = \\pi,\\; C = +\\frac{\\pi}{4}',
        solutionExplanation:
          'With B = 2, the period is 2π/2 = π and factoring gives shift π/4 to the right.',
      },
      {
        id: 'prob-pa5-3',
        moduleId: 'prealg-trig-unit-circle',
        course: 'prealg',
        topicTag: 'Pythagorean Identities',
        difficulty: 'Exam Standard',
        prompt: 'If sin θ = −3/5 and θ is in Quadrant III, what is sec θ?',
        promptTex: '\\sin\\theta = -\\frac{3}{5},\\; \\theta \\in \\text{QIII} \\implies \\sec\\theta = ?',
        options: [
          { id: 'a', labelTex: '-\\frac{5}{4}' },
          { id: 'b', labelTex: '\\frac{5}{4}' },
          { id: 'c', labelTex: '-\\frac{4}{5}' },
          { id: 'd', labelTex: '-\\frac{5}{3}' },
        ],
        correctOptionId: 'a',
        hint: 'Use cos²θ = 1 − sin²θ, pick the negative sign in QIII, then invert for sec θ = 1/cos θ.',
        solutionTex: '\\cos\\theta = -\\sqrt{1 - \\frac{9}{25}} = -\\frac{4}{5} \\implies \\sec\\theta = -\\frac{5}{4}',
        solutionExplanation:
          'In Quadrant III both sine and cosine are negative, giving cos θ = −4/5 and sec θ = −5/4.',
      },
    ],
  },
  {
    id: 'prealg-trig-identities-series',
    dayNumber: 6,
    course: 'prealg',
    phase: 'Pre-Algebra · Foundation 6',
    title: 'Inverse Trig, Trig Identities, Equations & Sequences',
    subtitle:
      'Master inverse trig domain/range restrictions, sum/difference and double/half-angle identities, solving trig equations, and sigma notation.',
    estimatedMinutes: 120,
    labType: 'series',
    labTitle: 'Sequences, Partial Sums & Sigma Notation Explorer',
    labObjective:
      'Visualize how arithmetic and geometric sequences accumulate under sigma notation—bridging straight into Riemann sums and Calculus II series.',
    keyTopics: [
      'Inverse trig functions (arcsin, arccos, arctan) & restricted ranges',
      'Proving trig identities & sum/difference formulas',
      'Double-angle & power-reducing (half-angle) formulas for Calculus II',
      'Solving trig equations on [0, 2π) & sigma summation notation',
    ],
    prerequisites: ['Prep 5: Unit Circle & Trig Graphs'],
    studySprintChecklist: [
      'Watch Professor Leonard’s Trigonometry 17–27 & College Algebra 67–72 selections.',
      'Study OpenStax Precalculus 2e Chapters 7 & 11 theory notes below.',
      'Practice trig equation drills on Paul’s Online Math Notes.',
      'Finish all 3 Mastery Check drills—you are now 100% ready for Calculus I Day 1!',
    ],
    theorems: [
      {
        title: 'Power-Reducing & Double-Angle Identities (Calculus II Lifesavers)',
        statement:
          'Double-angle identities for cos(2θ) rearrange immediately into the power-reducing formulas needed to integrate sin²(x) and cos²(x) in Calculus II.',
        formulaTex:
          '\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta \\qquad\\Big|\\qquad \\sin^2\\theta = \\frac{1 - \\cos(2\\theta)}{2},\\quad \\cos^2\\theta = \\frac{1 + \\cos(2\\theta)}{2}',
        intuition:
          'These exact identities appear repeatedly in Calc I derivatives, Calc II trig integrals, and polar area integrals—memorizing them now saves hours later.',
        examTip:
          'Notice the sign cue: sin² has the MINUS sign, cos² has the PLUS sign.',
      },
      {
        title: 'Restricted Ranges of Inverse Trigonometric Functions',
        statement:
          'To make sin, cos, and tan one-to-one, their inverse outputs are restricted to principal intervals.',
        formulaTex:
          '\\arcsin(x) \\in \\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right] \\quad|\\quad \\arccos(x) \\in [0, \\pi] \\quad|\\quad \\arctan(x) \\in \\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)',
        intuition:
          'Because of these restrictions, arcsin(sin(5π/6)) is NOT 5π/6—it wraps back into [−π/2, π/2] to give π/6.',
        examTip:
          'Draw a right triangle whenever evaluating mixed compositions like cos(arcsin(x)) = √(1 − x²)—this is the core move of Calculus II Trig Substitution.',
      },
    ],
    commonTraps: [
      {
        trap: 'Dividing both sides of sin(x)cos(x) = sin(x) by sin(x) and losing half the solutions.',
        fix: 'Never divide by a trig factor that could be 0! Move everything to one side and factor: sin(x)(cos(x) − 1) = 0.',
      },
      {
        trap: 'Answering arcsin(−1/2) = 11π/6 instead of −π/6.',
        fix: 'arcsin outputs MUST lie inside [−π/2, π/2], so use −π/6.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-pa6-1',
        title: 'Solve a Trigonometric Equation by Factoring',
        difficulty: 'Exam Standard',
        problemTex: '\\text{Solve } 2\\cos^2(x) - \\cos(x) - 1 = 0 \\text{ on } [0, 2\\pi).',
        steps: [
          {
            label: 'Factor as a quadratic in cos(x)',
            explanation: 'Treat u = cos(x): 2u² − u − 1 = (2u + 1)(u − 1).',
            mathTex: '(2\\cos x + 1)(\\cos x - 1) = 0',
          },
          {
            label: 'Split into two elementary equations',
            explanation: 'Solve cos x = −1/2 and cos x = 1 separately on [0, 2π).',
            mathTex: '\\cos x = -\\frac{1}{2} \\implies x = \\frac{2\\pi}{3},\\; \\frac{4\\pi}{3} \\qquad\\Big|\\qquad \\cos x = 1 \\implies x = 0',
          },
        ],
        finalAnswerTex: 'x \\in \\left\\{0,\\; \\frac{2\\pi}{3},\\; \\frac{4\\pi}{3}\\right\\}',
      },
      {
        id: 'ex-pa6-2',
        title: 'Evaluate a Mixed Inverse Trig Composition Algebraically',
        difficulty: 'Core',
        problemTex: '\\text{Simplify } \\tan\\!\\big(\\arcsin(x)\\big) \\text{ for } -1 < x < 1.',
        steps: [
          {
            label: 'Define θ = arcsin(x) and draw a reference right triangle',
            explanation: 'Since sin θ = x = x/1, label opposite = x and hypotenuse = 1.',
            mathTex: '\\sin\\theta = \\frac{x}{1} \\implies \\text{adjacent} = \\sqrt{1 - x^2}',
          },
          {
            label: 'Read tan θ = opposite / adjacent directly from the triangle',
            explanation: 'Because θ ∈ (−π/2, π/2), cos θ = √(1 − x²) is strictly positive.',
            mathTex: '\\tan\\!\\big(\\arcsin(x)\\big) = \\frac{x}{\\sqrt{1 - x^2}}',
          },
        ],
        finalAnswerTex: '\\frac{x}{\\sqrt{1 - x^2}}',
      },
    ],
    practiceProblems: [
      {
        id: 'prob-pa6-1',
        moduleId: 'prealg-trig-identities-series',
        course: 'prealg',
        topicTag: 'Inverse Trig Ranges',
        difficulty: 'Core',
        prompt: 'Evaluate the exact value of:',
        promptTex: '\\arcsin\\!\\left(\\sin\\!\\left(\\frac{5\\pi}{6}\\right)\\right)',
        options: [
          { id: 'a', labelTex: '\\frac{5\\pi}{6}' },
          { id: 'b', labelTex: '\\frac{\\pi}{6}' },
          { id: 'c', labelTex: '-\\frac{\\pi}{6}' },
          { id: 'd', labelTex: '\\frac{\\pi}{3}' },
        ],
        correctOptionId: 'b',
        hint: 'First evaluate sin(5π/6) = 1/2, then choose the angle in [−π/2, π/2] whose sine is 1/2.',
        solutionTex: '\\sin\\!\\left(\\frac{5\\pi}{6}\\right) = \\frac{1}{2} \\implies \\arcsin\\!\\left(\\frac{1}{2}\\right) = \\frac{\\pi}{6}',
        solutionExplanation:
          '5π/6 lies outside the principal range [−π/2, π/2] of arcsin, so the answer wraps to π/6.',
      },
      {
        id: 'prob-pa6-2',
        moduleId: 'prealg-trig-identities-series',
        course: 'prealg',
        topicTag: 'Solving Trig Equations',
        difficulty: 'Exam Standard',
        prompt: 'How many solutions does sin(2x) = 1/2 have on the interval [0, 2π)?',
        promptTex: '\\sin(2x) = \\frac{1}{2},\\quad x \\in [0, 2\\pi)',
        options: [
          { id: 'a', labelTex: '2 \\text{ solutions}' },
          { id: 'b', labelTex: '4 \\text{ solutions}' },
          { id: 'c', labelTex: '1 \\text{ solution}' },
          { id: 'd', labelTex: '3 \\text{ solutions}' },
        ],
        correctOptionId: 'b',
        hint: 'As x runs from 0 to 2π, the angle 2x completes TWO full revolutions [0, 4π).',
        solutionTex: '2x \\in \\left\\{\\frac{\\pi}{6},\\; \\frac{5\\pi}{6},\\; \\frac{13\\pi}{6},\\; \\frac{17\\pi}{6}\\right\\} \\implies 4 \\text{ solutions in } [0, 2\\pi)',
        solutionExplanation:
          'Doubling the frequency doubles the number of hits per 2π interval, giving 4 distinct solutions.',
      },
      {
        id: 'prob-pa6-3',
        moduleId: 'prealg-trig-identities-series',
        course: 'prealg',
        topicTag: 'Sigma Notation',
        difficulty: 'Core',
        prompt: 'Compute the finite arithmetic sum:',
        promptTex: '\\sum_{k=1}^{5} (3k - 1)',
        options: [
          { id: 'a', labelTex: '40' },
          { id: 'b', labelTex: '45' },
          { id: 'c', labelTex: '35' },
          { id: 'd', labelTex: '38' },
        ],
        correctOptionId: 'a',
        hint: 'Write out k = 1, 2, 3, 4, 5: 2 + 5 + 8 + 11 + 14.',
        solutionTex: '2 + 5 + 8 + 11 + 14 = 40',
        solutionExplanation:
          'Summing the 5 terms (or using n(a₁ + aₙ)/2 = 5(2 + 14)/2) yields 40.',
      },
    ],
  },
];
