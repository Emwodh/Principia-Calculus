import type { TextbookSection } from '../types/course';

/**
 * OpenStax Precalculus 2e-aligned university theory chapters for Pre-Algebra Prep 1-6.
 */
export const TEXTBOOK_PREALG: Record<string, TextbookSection[]> = {
  'prealg-functions': [
    {
      heading: 'P1.1 OpenStax Ch. 1.1–1.2: Functions, Function Notation & Domain/Range',
      paragraphs: [
        'A function f is a deterministic rule assigning to each input x in a set called the domain exactly one output y = f(x) in the range. Graphically, a curve in the xy-plane represents y as a function of x if and only if it passes the Vertical Line Test—no vertical line intersects the graph more than once.',
        'Finding the implied domain of an algebraic formula before attempting limits or derivatives prevents subtle sign and existence errors. For real-valued functions built from polynomials, radicals, and fractions, start with all real numbers (−∞, ∞) and enforce two hard constraints: (1) set every denominator ≠ 0, and (2) force every radicand under an even root (√, ⁴√, ...) to be ≥ 0 (or strictly > 0 if the radical sits in a denominator).',
      ],
      keyFormulaTex:
        '\\text{Domain of } \\frac{\\sqrt{A(x)}}{B(x)} = \\big\\{\\, x \\in \\mathbb{R} \\;:\\; A(x) \\ge 0 \\;\\text{ and }\\; B(x) \\neq 0 \\,\\big\\}',
      keyFormulaCaption:
        'OpenStax Precalculus 2e §1.2: Intersect every individual algebraic guard to determine the exact domain.',
      bulletPoints: [
        'Piecewise functions evaluate different formulas on disjoint sub-intervals; check the boundary inequalities (< vs. ≤) carefully before substituting.',
        'Even functions satisfy f(−x) = f(x) (y-axis symmetry); odd functions satisfy f(−x) = −f(x) (origin symmetry). Recognizing symmetry cuts many definite integrals in half in Calculus I.',
      ],
    },
    {
      heading: 'P1.2 OpenStax Ch. 1.3: Average Rate of Change & The Difference Quotient',
      paragraphs: [
        'While linear functions have a constant slope m = Δy/Δx everywhere, curved functions change steepness from point to point. On an interval [a, b], the Average Rate of Change measures the slope of the secant line connecting (a, f(a)) and (b, f(b)).',
        'Replacing the second endpoint b with x + h yields the Difference Quotient [f(x + h) − f(x)] / h. In Calculus I Day 2, taking the limit of this exact expression as h → 0 defines the derivative f′(x). Practicing algebraic expansion, radical conjugates, and common denominators on difference quotients now makes Calculus I feel effortless.',
      ],
      keyFormulaTex:
        '\\frac{\\Delta y}{\\Delta x} = \\frac{f(x + h) - f(x)}{h} \\qquad (h \\neq 0)',
      keyFormulaCaption:
        'Goal of every difference quotient simplification: cancel the standalone h in the denominator.',
    },
    {
      heading: 'P1.3 OpenStax Ch. 1.5: Parent Library Graphs & Transformations',
      paragraphs: [
        'Instead of plotting dozens of points by hand, memorize the shape, domain, and asymptotes of eight core parent functions: x, x², x³, |x|, √x, ∛x, 1/x, and 1/x². Any transformed graph y = a·f(b(x − h)) + k is obtained systematically from the parent curve.',
        'Apply transformations in order: (1) Horizontal shift by h (right if x − h, left if x + h), (2) Horizontal stretch/compression by 1/|b| and y-axis reflection if b < 0, (3) Vertical stretch/compression by |a| and x-axis reflection if a < 0, and (4) Vertical shift by k (up if +k, down if −k). Remember that operations INSIDE f(·) affect x inversely, while operations OUTSIDE f(·) affect y directly.',
      ],
    },
  ],
  'prealg-quadratics-polys': [
    {
      heading: 'P2.1 OpenStax Ch. 3.2: Quadratic Functions, Completing the Square & Vertex Form',
      paragraphs: [
        'Every quadratic function f(x) = ax² + bx + c (a ≠ 0) traces a parabola opening upward if a > 0 and downward if a < 0. Completing the square converts standard form into vertex form f(x) = a(x − h)² + k, revealing the global extremum (vertex) immediately at (h, k) where h = −b/(2a) and k = f(h).',
        'Setting a(x − h)² + k = 0 and solving via the square root property proves the Quadratic Formula directly. The discriminant Δ = b² − 4ac classifies the roots instantly: Δ > 0 gives two distinct real roots, Δ = 0 gives one repeated real root (tangent to the x-axis), and Δ < 0 yields a complex conjugate pair.',
      ],
      keyFormulaTex:
        'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\qquad\\Big|\\qquad \\text{Vertex: } \\left(-\\frac{b}{2a},\\; f\\!\\left(-\\frac{b}{2a}\\right)\\right)',
      keyFormulaCaption:
        'OpenStax Precalculus 2e §3.2: Vertex coordinates and the Quadratic Formula derive directly from completing the square.',
    },
    {
      heading: 'P2.2 OpenStax Ch. 3.3–3.4: Power Functions, End Behavior & Multiplicity',
      paragraphs: [
        'A polynomial P(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ⋯ + a₁x + a₀ is smooth and continuous on all of (−∞, ∞) with at most n − 1 turning points. As x → ±∞, the single highest-degree leading term aₙxⁿ dominates every lower power completely: even degree sends both ends in the same direction (up if aₙ > 0, down if aₙ < 0), while odd degree sends opposite ends to opposite infinities.',
        'Near each real zero c where P(x) factors as (x − c)ᵐ·Q(x), the exponent m is the multiplicity of the zero. If m is odd, the graph crosses the x-axis (flattening smoothly at x = c for m ≥ 3); if m is even, the graph touches the x-axis and bounces back without changing sign.',
      ],
    },
    {
      heading: 'P2.3 OpenStax Ch. 3.5–3.6: Polynomial Division, Rational Zeros & Complex Roots',
      paragraphs: [
        'When factoring higher-degree polynomials (cubics, quartics, and beyond), polynomial long division—or synthetic division when dividing by a linear factor (x − c)—expresses P(x) = (x − c)Q(x) + r. By the Remainder Theorem, r = P(c), so (x − c) is an exact factor if and only if P(c) = 0.',
        'To locate candidates systematically, the Rational Zeros Theorem guarantees that every rational root p/q (in lowest terms) of an integer-coefficient polynomial has p dividing the constant term a₀ and q dividing the leading coefficient aₙ. Once a real root is found, divide it out to depress the degree; by the Fundamental Theorem of Algebra, an n-th degree polynomial has exactly n complex zeros counted with multiplicity, and non-real roots always occur in conjugate pairs a ± bi.',
      ],
      keyFormulaTex:
        'P(x) = (x - c)\\,Q(x) + P(c) \\qquad\\Big|\\qquad P(c) = 0 \\iff (x - c) \\mid P(x)',
      keyFormulaCaption:
        'OpenStax Precalculus 2e §3.5–3.6: Division Algorithm, Remainder Theorem, and Factor Theorem.',
    },
  ],
  'prealg-rationals-inequalities': [
    {
      heading: 'P3.1 OpenStax Ch. 3.7: Vertical Asymptotes vs. Removable Holes',
      paragraphs: [
        'A rational function R(x) = P(x)/Q(x) is a ratio of two polynomials. Its domain excludes every x where Q(x) = 0, but not all excluded points behave the same way geometrically. Always factor both numerator and denominator completely before classifying discontinuities.',
        'If a linear factor (x − c) appears in both P(x) and Q(x) and cancels completely from the denominator, the graph has a removable discontinuity (a hole) at x = c whose y-coordinate is found by substituting c into the reduced expression. If a factor (x − c) remains in the denominator after all cancellations, |R(x)| shoots to ∞ as x → c, producing a vertical asymptote x = c.',
      ],
      keyFormulaTex:
        'R(x) = \\frac{(x - c)\\,P_1(x)}{(x - c)\\,Q_1(x)} = \\frac{P_1(x)}{Q_1(x)} \\quad (x \\neq c) \\implies \\text{Hole at } \\left(c,\\; \\frac{P_1(c)}{Q_1(c)}\\right)',
      keyFormulaCaption:
        'OpenStax Precalculus 2e §3.7: Canceled factors create holes; surviving denominator zeros create vertical asymptotes.',
    },
    {
      heading: 'P3.2 OpenStax Ch. 3.7: Horizontal & Oblique (Slant) Asymptotes',
      paragraphs: [
        'End behavior of a rational function as x → ±∞ is governed strictly by comparing the degree n of the numerator with the degree m of the denominator:',
      ],
      bulletPoints: [
        'Bottom-heavy (n < m): The denominator outgrows the numerator, so y = 0 is the horizontal asymptote.',
        'Balanced degrees (n = m): Leading powers cancel, leaving the horizontal asymptote y = aₙ / bₘ (ratio of leading coefficients).',
        'Top-heavy by exactly one (n = m + 1): Perform polynomial long division R(x) = (mx + b) + r(x)/Q(x). Because r(x)/Q(x) → 0 at infinity, the linear quotient y = mx + b is an oblique (slant) asymptote.',
      ],
    },
    {
      heading: 'P3.3 Sign-Chart Architecture for Polynomial & Rational Inequalities',
      paragraphs: [
        'A continuous expression can change sign only at its zeros or points of discontinuity. To solve any polynomial or rational inequality (such as (x + 3)/(x − 1) ≥ 2), move every term to one side so 0 sits alone on the right, combine into a single factored fraction N(x)/D(x), and place all zeros of N and D on a number line.',
        'Test one sample value in each subinterval (or track sign flips across odd vs. even factor multiplicities). Include numerator zeros for ≥ or ≤ inequalities, but NEVER include denominator zeros—they are always excluded from the domain.',
      ],
    },
  ],
  'prealg-exp-log': [
    {
      heading: 'P4.1 OpenStax Ch. 1.4 & 1.7: Composite & One-to-One Inverse Functions',
      paragraphs: [
        'Function composition (f ∘ g)(x) = f(g(x)) feeds the output of an inner function g directly into an outer function f. Its domain requires two checks: x must lie in the domain of g, AND the output g(x) must lie in the domain of f. Decomposing composite expressions into outer and inner layers is the exact foundation of the Calculus I Chain Rule.',
        'A function f is one-to-one if distinct inputs always produce distinct outputs (verified graphically by the Horizontal Line Test). Only one-to-one functions admit an inverse function f⁻¹ satisfying f(f⁻¹(x)) = x and f⁻¹(f(x)) = x. To construct f⁻¹ algebraically, write y = f(x), swap x and y, and solve cleanly for y.',
      ],
    },
    {
      heading: 'P4.2 OpenStax Ch. 4.1–4.4: Exponential & Logarithmic Functions',
      paragraphs: [
        'An exponential function f(x) = a·bˣ (b > 0, b ≠ 1) has domain (−∞, ∞), range (0, ∞) when a > 0, and horizontal asymptote y = 0. In university calculus, the natural base e ≈ 2.7182818 dominates because y = eˣ is the unique exponential whose slope at every point equals its height.',
        'Because bˣ is strictly monotonic (one-to-one), its inverse is the logarithm y = log_b(x), defined by y = log_b(x) ⇔ bʸ = x. Reflecting across y = x swaps everything: log_b(x) has domain (0, ∞), range (−∞, ∞), vertical asymptote x = 0, and x-intercept (1, 0).',
      ],
      keyFormulaTex:
        '\\log_b(x) = \\frac{\\ln x}{\\ln b} \\qquad\\Big|\\qquad \\ln(e^u) = u \\qquad\\Big|\\qquad e^{\\ln u} = u \\; (u > 0)',
      keyFormulaCaption:
        'OpenStax Precalculus 2e §4.5: Change-of-Base and Natural Exponential/Logarithm inverse identities.',
    },
    {
      heading: 'P4.3 OpenStax Ch. 4.5–4.6: Solving Exponential & Logarithmic Equations',
      paragraphs: [
        'For exponential equations: if both sides can share a common base (e.g., 8ˣ = 4ˣ⁺¹ ⇒ 2³ˣ = 2²ˣ⁺²), equate exponents directly. Otherwise, isolate the exponential term, apply ln to both sides, pull the exponent down using ln(Mʳ) = r·ln(M), and solve linearly.',
        'For logarithmic equations: condense multiple logarithms of the same base into a single log using the product/quotient rules, then convert log_b(A) = C into A = bᶜ (or apply one-to-one equality log_b(A) = log_b(B) ⇒ A = B). Always check every candidate root in the original equation to discard extraneous solutions that force a log argument ≤ 0.',
      ],
    },
  ],
  'prealg-trig-unit-circle': [
    {
      heading: 'P5.1 OpenStax Ch. 5.1–5.2: Radians, Arc Length & The Unit Circle',
      paragraphs: [
        'One radian is the central angle subtending an arc equal in length to the circle’s radius r. Because a full circumference is 2πr, a complete revolution measures 2π radians (so π radians = 180°). In radian measure, arc length and sector area simplify to the clean formulas s = rθ and A = ½r²θ.',
        'Placing an angle θ in standard position on the unit circle x² + y² = 1 defines cos θ = x and sin θ = y for ALL real numbers θ, extending right-triangle SOH-CAH-TOA beyond acute angles. The remaining four functions follow directly: tan θ = sin θ/cos θ, cot θ = cos θ/sin θ, sec θ = 1/cos θ, and csc θ = 1/sin θ.',
      ],
      keyFormulaTex:
        's = r\\theta,\\quad A = \\frac{1}{2}r^2\\theta \\qquad\\Big|\\qquad (x, y) = (\\cos\\theta, \\sin\\theta),\\quad \\cos^2\\theta + \\sin^2\\theta = 1',
      keyFormulaCaption:
        'OpenStax Precalculus 2e §5.1–5.2: Always ensure θ is in radians before applying arc-length or calculus formulas.',
    },
    {
      heading: 'P5.2 OpenStax Ch. 5.3–5.4: Exact Reference Angles & Fundamental Identities',
      paragraphs: [
        'University calculus exams rarely permit calculators for trigonometric values. Memorize the exact Quadrant I coordinates at θ = 0, π/6, π/4, π/3, π/2: sine rises cleanly through √0/2, √1/2, √2/2, √3/2, √4/2 while cosine descends in exact reverse.',
        'For any angle outside Quadrant I, find its acute reference angle to the nearest horizontal x-axis (π or 2π), read the Quadrant I magnitude, and assign the sign using ASTC (All positive in QI, Sine/csc in QII, Tangent/cot in QIII, Cosine/sec in QIV). Dividing sin²θ + cos²θ = 1 by cos²θ gives tan²θ + 1 = sec²θ; dividing by sin²θ gives 1 + cot²θ = csc²θ.',
      ],
    },
    {
      heading: 'P5.3 OpenStax Ch. 6.1–6.2: Graphs of Sinusoidal & Reciprocal Trig Functions',
      paragraphs: [
        'Sine and cosine oscillate smoothly between −1 and 1 with fundamental period 2π; sine is odd (starts at 0) while cosine is even (starts at 1). For y = A sin(B(x − C)) + D, |A| scales amplitude, T = 2π/|B| scales period, C shifts horizontally, and D shifts the midline vertically.',
        'Tangent and cotangent have period π (so T = π/|B|) and vertical asymptotes wherever their denominators vanish (cos x = 0 for tan/sec; sin x = 0 for cot/csc). Graphing sec x and csc x is fastest by sketching their guide cosine/sine wave first and drawing U-shaped branches from every peak and valley toward the vertical asymptotes.',
      ],
    },
  ],
  'prealg-trig-identities-series': [
    {
      heading: 'P6.1 OpenStax Ch. 6.3: Inverse Trigonometric Functions & Triangle Compositions',
      paragraphs: [
        'Because periodic functions fail the Horizontal Line Test globally, we restrict their domains to construct one-to-one inverses: sin x on [−π/2, π/2] defines arcsin x (range [−π/2, π/2]); cos x on [0, π] defines arccos x (range [0, π]); and tan x on (−π/2, π/2) defines arctan x (domain all real numbers, horizontal asymptotes y = ±π/2).',
        'To simplify algebraic compositions such as sec(arctan(x)) or sin(arccos(x)), name the inner inverse trig expression θ, draw a right triangle matching the trig ratio, solve the third side via Pythagoras, and read off the outer trig ratio directly. This exact move completes every Trigonometric Substitution integral in Calculus II.',
      ],
      keyFormulaTex:
        '\\sin(\\arccos x) = \\sqrt{1 - x^2} \\qquad\\Big|\\qquad \\sec(\\arctan x) = \\sqrt{1 + x^2}',
      keyFormulaCaption:
        'OpenStax Precalculus 2e §6.3: Right-triangle reduction turns mixed inverse-trig expressions into pure algebra.',
    },
    {
      heading: 'P6.2 OpenStax Ch. 7.1–7.5: Trig Identities, Power Reduction & Solving Equations',
      paragraphs: [
        'Start from the sum/difference identities sin(α ± β) = sin α cos β ± cos α sin β and cos(α ± β) = cos α cos β ∓ sin α sin β. Setting α = β immediately generates the double-angle formulas sin(2θ) = 2 sin θ cos θ and cos(2θ) = cos²θ − sin²θ = 1 − 2 sin²θ = 2 cos²θ − 1.',
        'Solving those last two lines for sin²θ and cos²θ produces the half-angle power-reduction formulas sin²θ = (1 − cos 2θ)/2 and cos²θ = (1 + cos 2θ)/2. When solving trig equations on [0, 2π), isolate or factor the trig expression (never divide by a trig factor that could equal zero), use Pythagorean substitutions to unify mixed functions into one trig type, and remember that frequency multipliers like 2x require scanning [0, 4π) before dividing by 2.',
      ],
      keyFormulaTex:
        '\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta',
      keyFormulaCaption:
        'OpenStax Precalculus 2e §7.3: One identity family yields both double-angle and Calculus II power-reduction formulas.',
    },
    {
      heading: 'P6.3 OpenStax Ch. 11.1–11.4: Sequences, Sigma Notation & Geometric Sums',
      paragraphs: [
        'A sequence {aₙ} is an ordered list indexed by positive integers n = 1, 2, 3, …. Arithmetic sequences add a constant common difference d (aₙ = a₁ + (n − 1)d), while geometric sequences multiply by a constant common ratio r (aₙ = a₁rⁿ⁻¹).',
        'Sigma notation Σ_{k=1}^n a_k compresses long sums cleanly and obeys linearity: constants pull outside and sums split term by term. Mastering index shifts and finite geometric sums Sₙ = a₁(1 − rⁿ)/(1 − r) prepares you directly for Riemann Sums in Calculus I and Infinite Series in Calculus II.',
      ],
      keyFormulaTex:
        '\\sum_{k=1}^{n} a_1 r^{k-1} = a_1\\,\\frac{1 - r^n}{1 - r} \\quad (r \\neq 1) \\qquad\\Big|\\qquad \\sum_{k=1}^{\\infty} a_1 r^{k-1} = \\frac{a_1}{1 - r} \\quad (|r| < 1)',
      keyFormulaCaption:
        'OpenStax Precalculus 2e §11.4: Finite and infinite geometric series formulas.',
    },
  ],
};
