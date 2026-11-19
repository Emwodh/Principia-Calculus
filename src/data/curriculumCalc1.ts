import type { CourseModule } from '../types/course';

export const CALC1_MODULES: CourseModule[] = [
  {
    id: 'calc1-limits',
    dayNumber: 1,
    course: 'calc1',
    phase: 'Phase 1 · Calculus I Foundations',
    title: 'Limits, Continuity & The Squeeze Theorem',
    subtitle: 'Master indeterminate forms, epsilon-delta rigor, asymptotes, and continuity in one focused session.',
    estimatedMinutes: 120,
    labType: 'limit',
    labTitle: 'Interactive Limit & Epsilon-Delta Window',
    labObjective:
      'Approach a removable discontinuity x = 2 from both sides and shrink the tolerance band ε to see why a limit exists even when f(2) is undefined.',
    keyTopics: [
      'Two-sided limits & Limit Laws',
      '0/0 algebraic cancellation & rationalizing conjugates',
      'Squeeze Theorem & trig limits',
      'Formal ε-δ definition & IVT',
    ],
    prerequisites: ['Factoring polynomials', 'Unit circle trigonometry', 'Rational functions'],
    studySprintChecklist: [
      'Spend 15 min manipulating x → 2 and ε in the Limit Lab until one-sided convergence clicks.',
      'Memorize the two benchmark trigonometric limits and the 3 conditions of continuity.',
      'Work through all 3 step-by-step derivations without peaking at the final line.',
      'Score 3/3 on the Mastery Check before advancing to Day 2.',
    ],
    theorems: [
      {
        title: 'Formal (ε-δ) Definition of a Limit',
        statement:
          'We write lim_{x→a} f(x) = L if for every tolerance ε > 0, there exists a distance δ > 0 such that whenever x stays within δ of a (without equaling a), f(x) stays within ε of L.',
        formulaTex: '\\forall \\varepsilon > 0,\\; \\exists \\delta > 0 \\text{ such that } 0 < |x - a| < \\delta \\implies |f(x) - L| < \\varepsilon',
        intuition:
          'Limits only care about the neighborhood around a, never the exact dot at x = a. A hole in the graph never changes the limit.',
        examTip: 'On 0/0 limits, factor, expand, or multiply by the radical conjugate to cancel the (x - a) factor.',
      },
      {
        title: 'The Squeeze (Sandwich) Theorem & Fundamental Trig Limits',
        statement:
          'If g(x) ≤ f(x) ≤ h(x) near a and both outer functions approach L, then f(x) is trapped and must also approach L.',
        formulaTex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1 \\qquad \\text{and} \\qquad \\lim_{x \\to 0} \\frac{1 - \\cos x}{x} = 0',
        intuition:
          'Whenever you see x² sin(1/x) or oscillating terms, bound sine/cosine between -1 and 1 and watch the outer envelope collapse to 0.',
        examTip: 'Remember that lim_{x→0} sin(kx)/(mx) = k/m. Always work in radians.',
      },
      {
        title: 'Continuity & Intermediate Value Theorem (IVT)',
        statement:
          'A function f is continuous at c if f(c) is defined, the two-sided limit exists, and both match. If f is continuous on [a, b], it hits every height between f(a) and f(b).',
        formulaTex: '\\lim_{x \\to c} f(x) = f(c)',
        intuition:
          'IVT is the standard proof tool for showing an equation has at least one root on [a, b]: just check that f(a) and f(b) have opposite signs.',
      },
    ],
    commonTraps: [
      {
        trap: 'Plugging in x = a and concluding "Does Not Exist" upon getting 0/0.',
        fix: '0/0 is indeterminate, not undefined. Simplify algebraically (factor, conjugate, or common denominator) first.',
      },
      {
        trap: 'Forgetting √(x²) = |x| when taking limits as x → -∞.',
        fix: 'When x < 0, dividing by x inside a square root requires pulling out -√(x²) so signs remain negative.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-d1-1',
        title: 'Radical Conjugate Cancellation (0/0 Form)',
        difficulty: 'Exam Standard',
        problemTex: '\\lim_{x \\to 4} \\frac{\\sqrt{x + 5} - 3}{x - 4}',
        steps: [
          {
            label: 'Check direct substitution',
            explanation: 'Substituting x = 4 yields (√9 - 3)/(4 - 4) = 0/0, confirming an indeterminate form.',
            mathTex: '\\frac{\\sqrt{4 + 5} - 3}{4 - 4} = \\frac{0}{0}',
          },
          {
            label: 'Multiply by the conjugate',
            explanation: 'Multiply numerator and denominator by √(x + 5) + 3 to eliminate the radical in the numerator.',
            mathTex: '\\lim_{x \\to 4} \\frac{(\\sqrt{x + 5} - 3)(\\sqrt{x + 5} + 3)}{(x - 4)(\\sqrt{x + 5} + 3)} = \\lim_{x \\to 4} \\frac{(x + 5) - 9}{(x - 4)(\\sqrt{x + 5} + 3)}',
          },
          {
            label: 'Cancel the zero factor and evaluate',
            explanation: 'Since x → 4 means x ≠ 4, cancel (x - 4) cleanly and substitute x = 4.',
            mathTex: '\\lim_{x \\to 4} \\frac{1}{\\sqrt{x + 5} + 3} = \\frac{1}{3 + 3} = \\frac{1}{6}',
          },
        ],
        finalAnswerTex: '\\frac{1}{6}',
      },
      {
        id: 'ex-d1-2',
        title: 'Limit at Negative Infinity with a Square Root',
        difficulty: 'Challenge',
        problemTex: '\\lim_{x \\to -\\infty} \\frac{3x + 2}{\\sqrt{4x^2 + 5x}}',
        steps: [
          {
            label: 'Factor x² carefully out of the square root',
            explanation: 'For x < 0, √(x²) = |x| = -x. Missing this sign flip is the #1 Calc I midterm mistake.',
            mathTex: '\\sqrt{4x^2 + 5x} = |x|\\sqrt{4 + \\frac{5}{x}} = -x\\sqrt{4 + \\frac{5}{x}}',
          },
          {
            label: 'Divide numerator and denominator by x',
            explanation: 'Simplify powers of x so all 1/x terms vanish as x → -∞.',
            mathTex: '\\lim_{x \\to -\\infty} \\frac{3 + \\frac{2}{x}}{-\\sqrt{4 + \\frac{5}{x}}} = \\frac{3 + 0}{-\\sqrt{4 + 0}} = -\\frac{3}{2}',
          },
        ],
        finalAnswerTex: '-\\frac{3}{2}',
      },
    ],
    practiceProblems: [
      {
        id: 'p-d1-1',
        moduleId: 'calc1-limits',
        course: 'calc1',
        topicTag: 'Limits',
        difficulty: 'Core',
        prompt: 'Evaluate the exact limit:',
        promptTex: '\\lim_{x \\to 3} \\frac{x^2 - 9}{x^2 - 5x + 6}',
        options: [
          { id: 'a', labelTex: '3' },
          { id: 'b', labelTex: '6' },
          { id: 'c', labelTex: '0' },
          { id: 'd', labelTex: '\\text{Does not exist}' },
        ],
        correctOptionId: 'b',
        hint: 'Factor both numerator and denominator to cancel (x - 3).',
        solutionTex: '\\lim_{x \\to 3} \\frac{(x - 3)(x + 3)}{(x - 3)(x - 2)} = \\frac{3 + 3}{3 - 2} = 6',
        solutionExplanation: 'Factoring removes the removable discontinuity at x = 3, leaving (x + 3)/(x - 2) → 6.',
      },
      {
        id: 'p-d1-2',
        moduleId: 'calc1-limits',
        course: 'calc1',
        topicTag: 'Trig Limits',
        difficulty: 'Exam Standard',
        prompt: 'Evaluate the trigonometric limit:',
        promptTex: '\\lim_{x \\to 0} \\frac{\\sin(5x)}{\\tan(2x)}',
        options: [
          { id: 'a', labelTex: '\\frac{2}{5}' },
          { id: 'b', labelTex: '\\frac{5}{2}' },
          { id: 'c', labelTex: '1' },
          { id: 'd', labelTex: '0' },
        ],
        correctOptionId: 'b',
        hint: 'Rewrite tan(2x) = sin(2x)/cos(2x) and match each sine with its angle.',
        solutionTex: '\\lim_{x \\to 0} \\frac{\\sin(5x)}{5x} \\cdot \\frac{2x}{\\sin(2x)} \\cdot \\frac{5}{2} \\cos(2x) = 1 \\cdot 1 \\cdot \\frac{5}{2} \\cdot 1 = \\frac{5}{2}',
        solutionExplanation: 'Use lim_{u→0} (sin u)/u = 1 on both sin(5x) and sin(2x), while cos(2x) → 1.',
      },
      {
        id: 'p-d1-3',
        moduleId: 'calc1-limits',
        course: 'calc1',
        topicTag: 'Continuity',
        difficulty: 'Exam Standard',
        prompt: 'For what value of k is f(x) continuous at x = 2?',
        promptTex: 'f(x) = \\begin{cases} \\dfrac{x^2 - 4}{x - 2} & x \\neq 2 \\\\[6pt] k^2 - 5 & x = 2 \\end{cases} \\quad (k > 0)',
        options: [
          { id: 'a', labelTex: 'k = 2' },
          { id: 'b', labelTex: 'k = 3' },
          { id: 'c', labelTex: 'k = 4' },
          { id: 'd', labelTex: 'k = 9' },
        ],
        correctOptionId: 'b',
        hint: 'Set the limit as x → 2 equal to f(2) = k² - 5.',
        solutionTex: '\\lim_{x \\to 2}(x + 2) = 4 \\implies k^2 - 5 = 4 \\implies k^2 = 9 \\implies k = 3 \\;(k > 0)',
        solutionExplanation: 'Continuity requires lim_{x→2} f(x) = f(2). Solving k² - 5 = 4 with k > 0 gives k = 3.',
      },
    ],
  },
  {
    id: 'calc1-derivatives',
    dayNumber: 2,
    course: 'calc1',
    phase: 'Phase 1 · Calculus I Foundations',
    title: 'Derivatives, Chain Rule & Implicit Differentiation',
    subtitle: 'Build instantaneous fluency with every differentiation rule—from limit definitions to logarithmic differentiation.',
    estimatedMinutes: 135,
    labType: 'derivative',
    labTitle: 'Secant-to-Tangent Limit Studio',
    labObjective:
      'Slide h toward 0 and move x₀ along f(x) to watch the secant slope collapse onto the exact tangent slope f′(x₀).',
    keyTopics: [
      'Limit definition of f′(x)',
      'Product, Quotient & Chain Rules',
      'Trig, Inverse Trig, Exp & Log derivatives',
      'Implicit & Logarithmic Differentiation',
    ],
    prerequisites: ['Day 1 Limits', 'Laws of logarithms and exponents'],
    studySprintChecklist: [
      'Use the Secant Lab to verify how h → 0 drives slope error to zero.',
      'Drill Chain Rule peeling (outer derivative × inner derivative) until automatic.',
      'Practice implicit differentiation: multiply every y-derivative by dy/dx.',
      'Use logarithmic differentiation whenever the variable appears in both base and exponent.',
    ],
    theorems: [
      {
        title: 'Limit Definition of the Derivative',
        statement:
          'The instantaneous rate of change of f at x is the limit of the average rate of change over an interval of width h as h shrinks to zero.',
        formulaTex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}",
        intuition:
          'Geometrically, f′(x) is the slope of the tangent line; physically, it is instantaneous velocity.',
      },
      {
        title: 'Product, Quotient & Chain Rules',
        statement:
          'Complex functions decompose into products, ratios, and nested compositions.',
        formulaTex: '(fg)\' = f\'g + fg\' \\qquad \\left(\\frac{f}{g}\\right)\' = \\frac{f\'g - fg\'}{g^2} \\qquad \\frac{d}{dx}\\big[f(g(x))\\big] = f\'(g(x))\\cdot g\'(x)',
        intuition:
          'Think of the Chain Rule as peeling an onion from outside to inside: differentiate the outer shell while keeping the inside untouched, then multiply by the derivative of the inside.',
      },
      {
        title: 'Logarithmic Differentiation',
        statement:
          'For variable-exponent functions y = f(x)^{g(x)}, take ln of both sides first to convert exponentiation into multiplication.',
        formulaTex: '\\ln y = g(x)\\ln f(x) \\implies \\frac{y\'}{y} = g\'(x)\\ln f(x) + g(x)\\frac{f\'(x)}{f(x)}',
        intuition:
          'Never apply the power rule (d/dx x^n) or exponential rule (d/dx a^x) to x^x—both fail because neither base nor exponent is constant.',
        examTip: 'Always multiply back by the original y = f(x)^{g(x)} at the very last step!',
      },
    ],
    commonTraps: [
      {
        trap: 'Differentiating (f · g)′ as f′ · g′ or forgetting the chain factor on sin(3x²).',
        fix: 'Write out u and v explicitly for products, and check if the argument inside any trig/log/exp is anything other than bare x.',
      },
      {
        trap: 'Treating x^x as x · x^{x-1}.',
        fix: 'Rewrite x^x = e^{x ln x} or take ln of both sides first. Answer is x^x (1 + ln x).',
      },
    ],
    workedExamples: [
      {
        id: 'ex-d2-1',
        title: 'Implicit Differentiation on a Non-Function Curve',
        difficulty: 'Exam Standard',
        problemTex: '\\text{Find } \\frac{dy}{dx} \\text{ for } x^3 + y^3 = 6xy \\text{ at } (3, 3).',
        steps: [
          {
            label: 'Differentiate both sides with respect to x',
            explanation: 'Apply the chain rule to y³ and the product rule to 6xy.',
            mathTex: '3x^2 + 3y^2\\frac{dy}{dx} = 6y + 6x\\frac{dy}{dx}',
          },
          {
            label: 'Isolate dy/dx',
            explanation: 'Group all dy/dx terms on the left and remaining terms on the right.',
            mathTex: '(3y^2 - 6x)\\frac{dy}{dx} = 6y - 3x^2 \\implies \\frac{dy}{dx} = \\frac{2y - x^2}{y^2 - 2x}',
          },
          {
            label: 'Evaluate at (3, 3)',
            explanation: 'Substitute x = 3 and y = 3 into the simplified slope formula.',
            mathTex: '\\left.\\frac{dy}{dx}\\right|_{(3,3)} = \\frac{6 - 9}{9 - 6} = -1',
          },
        ],
        finalAnswerTex: '-1',
      },
      {
        id: 'ex-d2-2',
        title: 'Logarithmic Differentiation of x^{\sin x}',
        difficulty: 'Challenge',
        problemTex: '\\text{Compute } \\frac{d}{dx}\\left(x^{\\sin x}\\right) \\text{ for } x > 0.',
        steps: [
          {
            label: 'Take natural logarithm of both sides',
            explanation: 'Bring the exponent sin(x) down as a product.',
            mathTex: '\\ln y = (\\sin x)\\ln x',
          },
          {
            label: 'Differentiate implicitly using the product rule',
            explanation: 'Differentiate ln(y) to y′/y on the left and apply product rule on the right.',
            mathTex: '\\frac{1}{y}\\frac{dy}{dx} = (\\cos x)\\ln x + \\frac{\\sin x}{x}',
          },
          {
            label: 'Multiply through by y',
            explanation: 'Substitute y = x^{sin x} back in.',
            mathTex: '\\frac{dy}{dx} = x^{\\sin x}\\left((\\cos x)\\ln x + \\frac{\\sin x}{x}\\right)',
          },
        ],
        finalAnswerTex: 'x^{\\sin x}\\left((\\cos x)\\ln x + \\frac{\\sin x}{x}\\right)',
      },
    ],
    practiceProblems: [
      {
        id: 'p-d2-1',
        moduleId: 'calc1-derivatives',
        course: 'calc1',
        topicTag: 'Chain Rule',
        difficulty: 'Core',
        prompt: 'Find the derivative of:',
        promptTex: 'f(x) = \\ln\\left(\\sec x + \\tan x\\right)',
        options: [
          { id: 'a', labelTex: '\\sec x' },
          { id: 'b', labelTex: '\\tan x' },
          { id: 'c', labelTex: '\\sec^2 x' },
          { id: 'd', labelTex: '\\frac{1}{\\sec x + \\tan x}' },
        ],
        correctOptionId: 'a',
        hint: 'Factor sec(x) out of the numerator after differentiating sec(x) + tan(x).',
        solutionTex: "f'(x) = \\frac{\\sec x\\tan x + \\sec^2 x}{\\sec x + \\tan x} = \\frac{\\sec x(\\tan x + \\sec x)}{\\sec x + \\tan x} = \\sec x",
        solutionExplanation: 'This classic cancellation is also why ∫ sec(x) dx = ln|sec x + tan x| + C in Calculus II!',
      },
      {
        id: 'p-d2-2',
        moduleId: 'calc1-derivatives',
        course: 'calc1',
        topicTag: 'Inverse Trig',
        difficulty: 'Exam Standard',
        prompt: 'Compute the derivative at x = 1:',
        promptTex: 'g(x) = \\arctan(x^2), \\quad g\'(1) = \\text{?}',
        options: [
          { id: 'a', labelTex: '\\frac{1}{2}' },
          { id: 'b', labelTex: '1' },
          { id: 'c', labelTex: '2' },
          { id: 'd', labelTex: '\\frac{1}{4}' },
        ],
        correctOptionId: 'b',
        hint: 'Remember d/du [arctan(u)] = 1 / (1 + u²), then multiply by du/dx = 2x.',
        solutionTex: "g'(x) = \\frac{2x}{1 + (x^2)^2} = \\frac{2x}{1 + x^4} \\implies g'(1) = \\frac{2}{1 + 1} = 1",
        solutionExplanation: 'By the chain rule, g′(x) = 2x / (1 + x⁴), which evaluates to 2/2 = 1 at x = 1.',
      },
      {
        id: 'p-d2-3',
        moduleId: 'calc1-derivatives',
        course: 'calc1',
        topicTag: 'Implicit Diff',
        difficulty: 'Exam Standard',
        prompt: 'Find the slope of the tangent line to e^{xy} = x + y at (0, 1):',
        promptTex: '\\left.\\frac{dy}{dx}\\right|_{(0, 1)}',
        options: [
          { id: 'a', labelTex: '0' },
          { id: 'b', labelTex: '1' },
          { id: 'c', labelTex: '-1' },
          { id: 'd', labelTex: '2' },
        ],
        correctOptionId: 'a',
        hint: 'Differentiate both sides first: e^{xy}(y + x y′) = 1 + y′, then plug in x = 0, y = 1 immediately.',
        solutionTex: 'e^{0}(1 + 0\\cdot y\') = 1 + y\' \\implies 1 = 1 + y\' \\implies y\' = 0',
        solutionExplanation: 'Plugging (0, 1) right after implicit differentiation saves algebra: 1(1) = 1 + y′ ⇒ y′ = 0.',
      },
    ],
  },
  {
    id: 'calc1-applications',
    dayNumber: 3,
    course: 'calc1',
    phase: 'Phase 1 · Calculus I Foundations',
    title: 'Extrema, L’Hôpital’s Rule, Related Rates & Optimization',
    subtitle: 'Turn derivatives into a precision problem-solving weapon for curves, limits, and physical rates.',
    estimatedMinutes: 140,
    labType: 'extrema',
    labTitle: 'f(x), f′(x) & f″(x) Curve Anatomy Explorer',
    labObjective:
      'Toggle derivative overlays and sweep x to inspect how zeros of f′ align with local extrema and zeros of f″ align with inflection points.',
    keyTopics: [
      'Mean Value Theorem (MVT) & Rolle’s Theorem',
      'First & Second Derivative Tests + Concavity',
      'L’Hôpital’s Rule (0/0, ∞/∞, 0·∞, 1^∞, 0^0)',
      'Related Rates & Closed-Interval Optimization',
    ],
    prerequisites: ['Day 2 Differentiation Rules'],
    studySprintChecklist: [
      'Explore f, f′, and f″ together in the Curve Anatomy Lab to lock in visual intuition.',
      'Master converting 0·∞ and 1^∞ indeterminate forms into 0/0 or ∞/∞ before L’Hôpital.',
      'Follow the 4-step Related Rates template: Draw → Relate → Differentiate w.r.t. t → Substitute.',
      'Check endpoints AND critical points on every closed-interval optimization problem.',
    ],
    theorems: [
      {
        title: 'Mean Value Theorem (MVT)',
        statement:
          'If f is continuous on [a, b] and differentiable on (a, b), there exists at least one c ∈ (a, b) where the instantaneous slope equals the average secant slope.',
        formulaTex: "f'(c) = \\frac{f(b) - f(a)}{b - a}",
        intuition:
          'If you drive 120 miles in 2 hours (average 60 mph), your speedometer must have read exactly 60 mph at least once.',
      },
      {
        title: 'L’Hôpital’s Rule',
        statement:
          'If lim_{x→a} f(x)/g(x) produces 0/0 or ±∞/±∞ and the ratio of derivatives has a limit, then both limits are equal.',
        formulaTex: "\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}",
        intuition:
          'Near a tie (0/0 or ∞/∞), whichever function grows faster wins the race—and derivatives measure growth rate.',
        examTip: 'Always verify the indeterminate form BEFORE every single application of L’Hôpital’s Rule!',
      },
      {
        title: 'Closed-Interval Optimization & Second Derivative Test',
        statement:
          'Absolute extrema on [a, b] occur only at critical points (f′(c) = 0 or DNE) or endpoints a, b. At a stationary point f′(c) = 0: f″(c) > 0 gives a local min; f″(c) < 0 gives a local max.',
        formulaTex: "f'(c) = 0 \\;\\land\\; f''(c) > 0 \\implies \\text{Local Min} \\qquad f'(c) = 0 \\;\\land\\; f''(c) < 0 \\implies \\text{Local Max}",
        intuition:
          'Positive second derivative means concave up (like a cup holding water at the bottom = minimum).',
      },
    ],
    commonTraps: [
      {
        trap: 'Applying L’Hôpital’s Rule to a fraction that is NOT 0/0 or ∞/∞ (e.g., 1/0).',
        fix: 'Write the limit of numerator and denominator first. Also remember: differentiate top and bottom separately—do NOT use the quotient rule.',
      },
      {
        trap: 'Plugging static numbers into a Related Rates equation BEFORE differentiating with respect to t.',
        fix: 'Only substitute constants that never change over time (like ladder length) before differentiating. Instantaneous snapshots go in AFTER d/dt.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-d3-1',
        title: 'Exponential Indeterminate Form (1^∞) via L’Hôpital',
        difficulty: 'Exam Standard',
        problemTex: '\\lim_{x \\to \\infty} \\left(1 + \\frac{3}{x}\\right)^{2x}',
        steps: [
          {
            label: 'Take the natural log to drop the exponent',
            explanation: 'Let L be the limit; taking ln converts 1^∞ into ∞ · 0.',
            mathTex: '\\ln L = \\lim_{x \\to \\infty} 2x \\ln\\left(1 + \\frac{3}{x}\\right)',
          },
          {
            label: 'Rewrite as a 0/0 ratio and apply L’Hôpital',
            explanation: 'Move 2x to the denominator as 1/(2x), yielding 0/0.',
            mathTex: '\\ln L = \\lim_{x \\to \\infty} \\frac{\\ln(1 + 3/x)}{1/(2x)} \\stackrel{\\text{L\'H}}{=} \\lim_{x \\to \\infty} \\frac{\\frac{-3/x^2}{1 + 3/x}}{-1/(2x^2)} = \\lim_{x \\to \\infty} \\frac{6}{1 + 3/x} = 6',
          },
          {
            label: 'Exponentiate to recover L',
            explanation: 'Never forget to undo the logarithm at the end!',
            mathTex: 'L = e^6',
          },
        ],
        finalAnswerTex: 'e^6',
      },
      {
        id: 'ex-d3-2',
        title: 'Optimization: Maximum Area Inscribed Under a Parabola',
        difficulty: 'Exam Standard',
        problemTex: '\\text{Maximize the area of a rectangle with base on the } x\\text{-axis and top corners on } y = 12 - x^2.',
        steps: [
          {
            label: 'Express area as a single-variable function',
            explanation: 'With top-right corner at (x, 12 - x²), width is 2x and height is 12 - x² on [0, √12].',
            mathTex: 'A(x) = 2x(12 - x^2) = 24x - 2x^3',
          },
          {
            label: 'Differentiate and locate critical point',
            explanation: 'Set A′(x) = 0 for x > 0.',
            mathTex: "A'(x) = 24 - 6x^2 = 0 \\implies x^2 = 4 \\implies x = 2",
          },
          {
            label: 'Verify maximum and compute A(2)',
            explanation: 'A″(2) = -12(2) = -24 < 0 confirms a maximum.',
            mathTex: 'A(2) = 24(2) - 2(8) = 32',
          },
        ],
        finalAnswerTex: 'A_{\\max} = 32',
      },
    ],
    practiceProblems: [
      {
        id: 'p-d3-1',
        moduleId: 'calc1-applications',
        course: 'calc1',
        topicTag: 'L’Hôpital’s Rule',
        difficulty: 'Exam Standard',
        prompt: 'Evaluate the limit using L’Hôpital’s Rule:',
        promptTex: '\\lim_{x \\to 0} \\frac{e^{2x} - 1 - 2x}{x^2}',
        options: [
          { id: 'a', labelTex: '1' },
          { id: 'b', labelTex: '2' },
          { id: 'c', labelTex: '4' },
          { id: 'd', labelTex: '0' },
        ],
        correctOptionId: 'b',
        hint: 'Apply L’Hôpital’s Rule twice (both steps are 0/0).',
        solutionTex: '\\lim_{x \\to 0} \\frac{2e^{2x} - 2}{2x} = \\lim_{x \\to 0} \\frac{4e^{2x}}{2} = 2',
        solutionExplanation: 'Two applications of L’Hôpital reduce the ratio to 4e^{2x}/2 → 2.',
      },
      {
        id: 'p-d3-2',
        moduleId: 'calc1-applications',
        course: 'calc1',
        topicTag: 'Related Rates',
        difficulty: 'Exam Standard',
        prompt: 'A spherical balloon inflates at dV/dt = 36π cm³/s. Find dr/dt when r = 3 cm:',
        promptTex: 'V = \\frac{4}{3}\\pi r^3 \\implies \\left.\\frac{dr}{dt}\\right|_{r=3} = \\text{?}',
        options: [
          { id: 'a', labelTex: '1\\text{ cm/s}' },
          { id: 'b', labelTex: '3\\text{ cm/s}' },
          { id: 'c', labelTex: '\\frac{1}{3}\\text{ cm/s}' },
          { id: 'd', labelTex: '4\\text{ cm/s}' },
        ],
        correctOptionId: 'a',
        hint: 'Differentiate V with respect to t: dV/dt = 4πr² (dr/dt).',
        solutionTex: '36\\pi = 4\\pi(3)^2 \\frac{dr}{dt} = 36\\pi \\frac{dr}{dt} \\implies \\frac{dr}{dt} = 1\\text{ cm/s}',
        solutionExplanation: 'Dividing 36π by 4π(9) = 36π yields exactly 1 cm/s.',
      },
      {
        id: 'p-d3-3',
        moduleId: 'calc1-applications',
        course: 'calc1',
        topicTag: 'Inflection Points',
        difficulty: 'Core',
        prompt: 'Find the x-coordinate of the inflection point of:',
        promptTex: 'f(x) = x^3 - 6x^2 + 9x + 1',
        options: [
          { id: 'a', labelTex: 'x = 1' },
          { id: 'b', labelTex: 'x = 2' },
          { id: 'c', labelTex: 'x = 3' },
          { id: 'd', labelTex: 'x = 0' },
        ],
        correctOptionId: 'b',
        hint: 'Compute f″(x) and check where it changes sign.',
        solutionTex: "f'(x) = 3x^2 - 12x + 9,\\quad f''(x) = 6x - 12 = 0 \\implies x = 2",
        solutionExplanation: 'f″(x) = 6(x - 2) changes from negative to positive at x = 2.',
      },
    ],
  },
  {
    id: 'calc1-integrals',
    dayNumber: 4,
    course: 'calc1',
    phase: 'Phase 1 · Calculus I Foundations',
    title: 'Riemann Sums, Fundamental Theorem & u-Substitution',
    subtitle: 'Connect accumulated area to antiderivatives and master the #1 integration engine: u-substitution.',
    estimatedMinutes: 135,
    labType: 'riemann',
    labTitle: 'Riemann Sum & FTC Convergence Lab',
    labObjective:
      'Compare Left, Right, Midpoint, and Trapezoidal approximations as n increases and measure how fast approximation error shrinks toward the exact integral.',
    keyTopics: [
      'Riemann Sums & Definite Integral as a Limit',
      'Fundamental Theorem of Calculus (Parts I & II)',
      'Net Change Theorem & Symmetry (Even/Odd)',
      'u-Substitution (indefinite & changing definite bounds)',
    ],
    prerequisites: ['Day 2 Differentiation Rules'],
    studySprintChecklist: [
      'Compare Left vs Midpoint error at n = 10 in the Riemann Lab.',
      'Practice FTC Part I with a chain-rule upper bound (e.g., d/dx ∫₀^{x²} f(t) dt).',
      'Always convert the limits of integration when doing definite u-substitution—never switch back to x!',
      'Check for odd functions on [-a, a] before computing: their integral is immediately 0.',
    ],
    theorems: [
      {
        title: 'Fundamental Theorem of Calculus (Part I & Part II)',
        statement:
          'Differentiation and integration are inverse operations. Part I differentiates an accumulation function; Part II evaluates any definite integral via an antiderivative F.',
        formulaTex: '\\frac{d}{dx}\\int_{a}^{g(x)} f(t)\\,dt = f(g(x))\\cdot g\'(x) \\qquad \\text{and} \\qquad \\int_{a}^{b} f(x)\\,dx = F(b) - F(a)',
        intuition:
          'Accumulating tiny slices of rate of change f′(x) dx from a to b gives the exact net change F(b) - F(a).',
      },
      {
        title: 'Change of Variables (u-Substitution)',
        statement:
          'The reverse of the Chain Rule: identify an inner function u = g(x) whose derivative g′(x) dx appears as a factor inside the integral.',
        formulaTex: '\\int_{a}^{b} f(g(x))\\,g\'(x)\\,dx = \\int_{g(a)}^{g(b)} f(u)\\,du',
        intuition:
          'Transforming the bounds a → g(a) and b → g(b) saves time and eliminates back-substitution errors on exams.',
      },
    ],
    commonTraps: [
      {
        trap: 'Keeping the original x-bounds [a, b] after changing the integrand to u.',
        fix: 'Either write x = a, x = b explicitly or immediately substitute u(a) and u(b).',
      },
      {
        trap: 'Forgetting absolute value bars in ∫ (1/x) dx = ln|x| + C.',
        fix: 'Whenever the domain can include negative x, ln|x| is mandatory.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-d4-1',
        title: 'FTC Part I Combined with Chain Rule',
        difficulty: 'Exam Standard',
        problemTex: '\\text{Find } \\frac{d}{dx}\\int_{2}^{x^3} \\cos(t^2)\\,dt',
        steps: [
          {
            label: 'Identify outer accumulation and inner upper limit',
            explanation: 'Let g(x) = x³ and f(t) = cos(t²). Do NOT attempt to integrate cos(t²)—it has no elementary antiderivative!',
            mathTex: 'F(x) = \\int_2^{g(x)} f(t)\\,dt \\implies F\'(x) = f(g(x))\\cdot g\'(x)',
          },
          {
            label: 'Substitute t = x³ and multiply by g′(x)',
            explanation: 'Replace t with x³ and multiply by 3x².',
            mathTex: '\\cos\\big((x^3)^2\\big)\\cdot 3x^2 = 3x^2\\cos(x^6)',
          },
        ],
        finalAnswerTex: '3x^2\\cos(x^6)',
      },
      {
        id: 'ex-d4-2',
        title: 'Definite u-Substitution with Bound Change',
        difficulty: 'Core',
        problemTex: '\\int_{0}^{1} x\\sqrt{1 + 3x^2}\\,dx',
        steps: [
          {
            label: 'Choose u and compute du',
            explanation: 'Let u = 1 + 3x² so du = 6x dx, meaning x dx = du/6.',
            mathTex: 'u = 1 + 3x^2,\\quad x\\,dx = \\frac{1}{6}\\,du',
          },
          {
            label: 'Convert limits of integration',
            explanation: 'When x = 0, u = 1. When x = 1, u = 4.',
            mathTex: '\\frac{1}{6}\\int_{1}^{4} u^{1/2}\\,du',
          },
          {
            label: 'Integrate and evaluate cleanly in u',
            explanation: 'Use the power rule ∫ u^{1/2} du = (2/3) u^{3/2}.',
            mathTex: '\\frac{1}{6}\\cdot \\frac{2}{3}\\Big[u^{3/2}\\Big]_1^4 = \\frac{1}{9}(8 - 1) = \\frac{7}{9}',
          },
        ],
        finalAnswerTex: '\\frac{7}{9}',
      },
    ],
    practiceProblems: [
      {
        id: 'p-d4-1',
        moduleId: 'calc1-integrals',
        course: 'calc1',
        topicTag: 'u-Substitution',
        difficulty: 'Core',
        prompt: 'Evaluate the definite integral:',
        promptTex: '\\int_{1}^{e} \\frac{\\ln x}{x}\\,dx',
        options: [
          { id: 'a', labelTex: '\\frac{1}{2}' },
          { id: 'b', labelTex: '1' },
          { id: 'c', labelTex: 'e - 1' },
          { id: 'd', labelTex: '\\frac{e^2}{2}' },
        ],
        correctOptionId: 'a',
        hint: 'Set u = ln(x), so du = (1/x) dx. Bounds become 0 to 1.',
        solutionTex: '\\int_0^1 u\\,du = \\left[\\frac{u^2}{2}\\right]_0^1 = \\frac{1}{2}',
        solutionExplanation: 'With u = ln x, the integral simplifies directly to ∫₀¹ u du = 1/2.',
      },
      {
        id: 'p-d4-2',
        moduleId: 'calc1-integrals',
        course: 'calc1',
        topicTag: 'Symmetry & FTC',
        difficulty: 'Exam Standard',
        prompt: 'Evaluate without unnecessary expansion:',
        promptTex: '\\int_{-2}^{2} \\left(x^5\\cos x + 3x^2\\right)\\,dx',
        options: [
          { id: 'a', labelTex: '0' },
          { id: 'b', labelTex: '8' },
          { id: 'c', labelTex: '16' },
          { id: 'd', labelTex: '32' },
        ],
        correctOptionId: 'c',
        hint: 'Split into odd and even parts on the symmetric interval [-2, 2].',
        solutionTex: '0 + 2\\int_0^2 3x^2\\,dx = 2\\big[x^3\\big]_0^2 = 16',
        solutionExplanation: 'x⁵ cos(x) is odd, so its integral over [-2, 2] is 0. The even term 3x² integrates to [x³]_{-2}^{2} = 8 - (-8) = 16.',
      },
      {
        id: 'p-d4-3',
        moduleId: 'calc1-integrals',
        course: 'calc1',
        topicTag: 'FTC Part I',
        difficulty: 'Exam Standard',
        prompt: 'Compute F′(1) where:',
        promptTex: 'F(x) = \\int_{x}^{x^2} \\frac{1}{1 + t^2}\\,dt',
        options: [
          { id: 'a', labelTex: '\\frac{1}{2}' },
          { id: 'b', labelTex: '1' },
          { id: 'c', labelTex: '0' },
          { id: 'd', labelTex: '\\frac{3}{2}' },
        ],
        correctOptionId: 'a',
        hint: 'Split at 0: F′(x) = f(x²)·2x - f(x)·1.',
        solutionTex: "F'(x) = \\frac{2x}{1 + x^4} - \\frac{1}{1 + x^2} \\implies F'(1) = \\frac{2}{2} - \\frac{1}{2} = \\frac{1}{2}",
        solutionExplanation: 'Differentiating both moving bounds gives 2x/(1 + x⁴) - 1/(1 + x²), which equals 1 - 1/2 = 1/2 at x = 1.',
      },
    ],
  },
  {
    id: 'calc1-volumes',
    dayNumber: 5,
    course: 'calc1',
    phase: 'Phase 2 · Geometric & Physical Integrals',
    title: 'Area Between Curves & Volumes of Revolution',
    subtitle: 'Bridge Calculus I and II by slicing 2D regions and 3D solids using Disks, Washers, and Cylindrical Shells.',
    estimatedMinutes: 130,
    labType: 'volume',
    labTitle: 'Disk/Washer vs. Cylindrical Shell Visualizer',
    labObjective:
      'Switch between Disk/Washer and Shell slicing methods, drag the slice cursor xᵢ across the region, and inspect cross-sectional radius, slice volume, and total revolved volume.',
    keyTopics: [
      'Area between curves (top − bottom vs right − left)',
      'Disk & Washer Method (slices perpendicular to axis)',
      'Cylindrical Shell Method (slices parallel to axis)',
      'Volumes by known cross-sections (squares, semicircles)',
    ],
    prerequisites: ['Day 4 Definite Integrals'],
    studySprintChecklist: [
      'Memorize the axis rule: Perpendicular slice = Disk/Washer; Parallel slice = Shell.',
      'Use the Volume Lab to compare outer radius R(x) and inner radius r(x) on washers.',
      'Practice shifted axes of rotation (e.g., rotating around y = -1 adds +1 to every radius).',
      'Complete all 3 practice problems to seal Calculus I mastery.',
    ],
    theorems: [
      {
        title: 'Disk & Washer Method (Perpendicular Slicing)',
        statement:
          'When rotating the region between outer radius R(x) and inner radius r(x) around a horizontal axis:',
        formulaTex: 'V = \\pi \\int_{a}^{b} \\Big([R(x)]^2 - [r(x)]^2\\Big)\\,dx',
        intuition:
          'Always compute R² − r², NEVER (R − r)². A washer is a big disk minus a hole.',
      },
      {
        title: 'Cylindrical Shell Method (Parallel Slicing)',
        statement:
          'When rotating a vertical strip at x of height h(x) around the y-axis (or vertical line x = c):',
        formulaTex: 'V = 2\\pi \\int_{a}^{b} (\\text{radius})\\cdot(\\text{height})\\,dx = 2\\pi \\int_{a}^{b} x\\,f(x)\\,dx',
        intuition:
          'Unroll a thin soup-can label: circumference 2πr × height h × thickness dx. Shells rescue you when solving for x in terms of y is impossible!',
        examTip: 'Rotating y = sin(x²) around the y-axis is trivial with Shells (u = x²) and impossible with Washers.',
      },
    ],
    commonTraps: [
      {
        trap: 'Writing π ∫ (R(x) - r(x))² dx instead of π ∫ (R(x)² - r(x)²) dx.',
        fix: 'Square each radius individually first, then subtract.',
      },
      {
        trap: 'Getting negative radius when rotating around a shifted axis like y = 4.',
        fix: 'Radius is always |axis − curve|, i.e. (top − bottom) or (right − left) so R ≥ r ≥ 0.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-d5-1',
        title: 'Washer Method Between y = x and y = x²',
        difficulty: 'Core',
        problemTex: '\\text{Find the volume when the region between } y = x \\text{ and } y = x^2 \\text{ is rotated around the } x\\text{-axis}.',
        steps: [
          {
            label: 'Find intersection bounds and radii',
            explanation: 'x = x² gives x = 0 and x = 1. On [0, 1], x ≥ x², so R(x) = x and r(x) = x².',
            mathTex: 'R(x) = x,\\qquad r(x) = x^2,\\qquad x \\in [0, 1]',
          },
          {
            label: 'Set up and evaluate the washer integral',
            explanation: 'Integrate π(R² − r²) from 0 to 1.',
            mathTex: 'V = \\pi\\int_0^1 (x^2 - x^4)\\,dx = \\pi\\left[\\frac{x^3}{3} - \\frac{x^5}{5}\\right]_0^1 = \\frac{2\\pi}{15}',
          },
        ],
        finalAnswerTex: '\\frac{2\\pi}{15}',
      },
      {
        id: 'ex-d5-2',
        title: 'Cylindrical Shells Around the y-Axis',
        difficulty: 'Exam Standard',
        problemTex: '\\text{Rotate } y = e^{-x^2},\\; y = 0,\\; x \\in [0, 1] \\text{ about the } y\\text{-axis}.',
        steps: [
          {
            label: 'Choose Shells to avoid inverting e^{-x²}',
            explanation: 'Vertical slices are parallel to the y-axis, giving radius r = x and height h = e^{-x²}.',
            mathTex: 'V = 2\\pi\\int_0^1 x e^{-x^2}\\,dx',
          },
          {
            label: 'Evaluate via u-substitution',
            explanation: 'Set u = -x², du = -2x dx (so 2x dx = -du), bounds 0 to -1.',
            mathTex: 'V = -\\pi\\int_0^{-1} e^u\\,du = \\pi\\int_{-1}^{0} e^u\\,du = \\pi\\left(1 - e^{-1}\\right)',
          },
        ],
        finalAnswerTex: '\\pi\\left(1 - \\frac{1}{e}\\right)',
      },
    ],
    practiceProblems: [
      {
        id: 'p-d5-1',
        moduleId: 'calc1-volumes',
        course: 'calc1',
        topicTag: 'Area Between Curves',
        difficulty: 'Core',
        prompt: 'Find the exact area enclosed by y = x² and y = 2x:',
        promptTex: 'A = \\int_{0}^{2} (2x - x^2)\\,dx',
        options: [
          { id: 'a', labelTex: '\\frac{2}{3}' },
          { id: 'b', labelTex: '\\frac{4}{3}' },
          { id: 'c', labelTex: '\\frac{8}{3}' },
          { id: 'd', labelTex: '2' },
        ],
        correctOptionId: 'b',
        hint: 'Integrate 2x - x² from x = 0 to x = 2.',
        solutionTex: '\\left[x^2 - \\frac{x^3}{3}\\right]_0^2 = 4 - \\frac{8}{3} = \\frac{4}{3}',
        solutionExplanation: 'The parabola and line intersect at x = 0 and x = 2, enclosing area 4 - 8/3 = 4/3.',
      },
      {
        id: 'p-d5-2',
        moduleId: 'calc1-volumes',
        course: 'calc1',
        topicTag: 'Disk Method',
        difficulty: 'Core',
        prompt: 'Find the volume generated by rotating y = √x on [0, 4] about the x-axis:',
        promptTex: 'V = \\pi \\int_{0}^{4} (\\sqrt{x})^2\\,dx',
        options: [
          { id: 'a', labelTex: '4\\pi' },
          { id: 'b', labelTex: '8\\pi' },
          { id: 'c', labelTex: '16\\pi' },
          { id: 'd', labelTex: '32\\pi' },
        ],
        correctOptionId: 'b',
        hint: '(√x)² simplifies cleanly to x.',
        solutionTex: 'V = \\pi\\int_0^4 x\\,dx = \\pi\\left[\\frac{x^2}{2}\\right]_0^4 = 8\\pi',
        solutionExplanation: 'Integrating πx from 0 to 4 gives π(16/2) = 8π.',
      },
      {
        id: 'p-d5-3',
        moduleId: 'calc1-volumes',
        course: 'calc1',
        topicTag: 'Shell Method',
        difficulty: 'Exam Standard',
        prompt: 'Find the volume when y = 3x - x² (above y = 0) is rotated about the y-axis:',
        promptTex: 'V = 2\\pi \\int_{0}^{3} x(3x - x^2)\\,dx',
        options: [
          { id: 'a', labelTex: '\\frac{27\\pi}{2}' },
          { id: 'b', labelTex: '\\frac{27\\pi}{4}' },
          { id: 'c', labelTex: '9\\pi' },
          { id: 'd', labelTex: '18\\pi' },
        ],
        correctOptionId: 'a',
        hint: 'Expand 3x² - x³ and integrate from 0 to 3.',
        solutionTex: '2\\pi\\left[x^3 - \\frac{x^4}{4}\\right]_0^3 = 2\\pi\\left(27 - \\frac{81}{4}\\right) = 2\\pi\\left(\\frac{27}{4}\\right) = \\frac{27\\pi}{2}',
        solutionExplanation: '2π(27 - 81/4) = 2π(27/4) = 27π/2.',
      },
    ],
  },
];
