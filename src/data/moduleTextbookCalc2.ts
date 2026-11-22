import type { TextbookSection } from '../types/course';

export const TEXTBOOK_CALC2: Record<string, TextbookSection[]> = {
  'calc2-ibp-trig': [
    {
      heading: '6.1 Integration by Parts: Reversing the Product Rule',
      paragraphs: [
        'While u-substitution reverses the Chain Rule, Integration by Parts (IBP) reverses the Product Rule. Start with d/dx[u(x)v(x)] = u′(x)v(x) + u(x)v′(x), integrate both sides, and rearrange: ∫ u dv = uv − ∫ v du. Notice that IBP does not finish the integral in one shot; instead, it trades a difficult integral ∫ u dv for a simpler integral ∫ v du.',
        'The entire art of IBP lies in splitting the integrand into u (which you will differentiate) and dv (which you will integrate). Use the LIATE hierarchy to pick u—choose whichever factor appears earliest: Logarithmic (ln x), Inverse trig (arctan x, arcsin x), Algebraic (xⁿ), Trigonometric (sin x, cos x), Exponential (eˣ). Why does LIATE work? Logarithms and inverse trig functions turn into clean algebraic fractions when differentiated, polynomials eventually differentiate down to zero, and exponentials/trig functions integrate effortlessly without growing messier.',
      ],
      keyFormulaTex:
        '\\int u\\,dv = u v - \\int v\\,du \\qquad\\Big|\\qquad \\text{LIATE: } \\mathbf{L}\\text{og} \\to \\mathbf{I}\\text{nv Trig} \\to \\mathbf{A}\\text{lg} \\to \\mathbf{T}\\text{rig} \\to \\mathbf{E}\\text{xp}',
      keyFormulaCaption:
        'Always verify that your new integral ∫ v du is strictly simpler than the original.',
    },
    {
      heading: '6.2 Speed Weapons: The Tabular (DI) Method & Cyclic Boomerang IBP',
      paragraphs: [
        'When integrating a polynomial times an exponential or trig function—such as ∫ x⁴ e^{2x} dx or ∫ x³ cos(x) dx—writing standard IBP four times invites sign errors and burns 5 minutes. Instead, set up a two-column Tabular (DI) table: place the polynomial in the D (Differentiate) column and differentiate down to 0; place the exponential/trig factor in the I (Integrate) column and integrate the same number of times; write alternating signs (+, −, +, −, ...) down the left margin; multiply diagonally downward (row k of D × row k+1 of I) and sum!',
        'A second exam classic is the Cyclic ("Boomerang") IBP for ∫ e^{ax} sin(bx) dx or ∫ sec³(x) dx. Neither factor ever differentiates to zero. Apply IBP twice—keeping your choice of u consistent (e.g., exponential both times)—until the exact original integral I reappears on the right side with a negative coefficient. Move that term to the left side (e.g., I + (a²/b²)I = ...), divide by the combined coefficient, and add + C.',
      ],
      keyFormulaTex:
        '\\int \\sec^3(x)\\,dx = \\frac{1}{2}\\Big(\\sec x\\tan x + \\ln|\\sec x + \\tan x|\\Big) + C',
      keyFormulaCaption:
        'Memorize ∫ sec³(x) dx—it arises constantly in Trig Sub and Arc Length problems.',
    },
    {
      heading: '6.3 Systematic Playbook for Trigonometric Integrals',
      paragraphs: [
        'Trigonometric integrals look intimidating only until you categorize them by parity (odd vs. even exponents). For products ∫ sinᵐ(x) cosⁿ(x) dx: if at least one exponent is ODD, peel off a single factor of the odd-powered function to serve as du, convert all remaining even powers of that function using sin² x + cos² x = 1, and run a clean polynomial u-substitution. If BOTH exponents are EVEN (such as ∫ sin² x cos² x dx or ∫ cos⁴ x dx), u-sub fails—deploy the half-angle power-reduction identities sin² x = (1 − cos 2x)/2 and cos² x = (1 + cos 2x)/2 until all even powers drop to degree 1.',
        'For ∫ tanᵐ(x) secⁿ(x) dx, use the exact twin rules built on d(tan x) = sec² x dx and d(sec x) = sec x tan x dx: (1) If the power of sec is EVEN (n ≥ 2), save sec² x dx for du, convert remaining sec² x → 1 + tan² x, and substitute u = tan x; (2) If the power of tan is ODD (m ≥ 1), save sec x tan x dx for du, convert remaining tan² x → sec² x − 1, and substitute u = sec x; (3) If tan is even and sec is odd (like ∫ tan² x sec x dx), rewrite everything in terms of sec x and use cyclic IBP.',
      ],
    },
  ],

  'calc2-trigsub-pf': [
    {
      heading: '7.1 Trigonometric Substitution: Killing Quadratic Radicals',
      paragraphs: [
        'When an integrand contains √(a² − x²), √(a² + x²), or √(x² − a²) without a convenient x dx factor outside for u-substitution, Trigonometric Substitution eliminates the square root by exploiting the three Pythagorean identities: 1 − sin² θ = cos² θ, 1 + tan² θ = sec² θ, and sec² θ − 1 = tan² θ.',
        'Execute every Trig Sub in four disciplined steps: (1) Complete the square first if there is a linear bx term (e.g., x² + 6x + 13 = (x + 3)² + 2², then set u = x + 3); (2) Choose the matching substitution (a sin θ, a tan θ, or a sec θ) and compute BOTH the radical simplification AND dx = ... dθ; (3) Evaluate the resulting trigonometric integral using Day 6 techniques; (4) Draw the reference right triangle directly from your initial substitution (e.g., sin θ = x/a ⇒ opposite = x, hypotenuse = a, adjacent = √(a² − x²)) and read every trig function of θ straight off the triangle sides.',
      ],
      keyFormulaTex:
        '\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta \\qquad\\text{and}\\qquad \\cos(2\\theta) = 1 - 2\\sin^2\\theta',
      keyFormulaCaption:
        'Always expand double-angle results like sin(2θ) before reading sides off your θ reference triangle!',
    },
    {
      heading: '7.2 Partial Fraction Decomposition (All 4 Algebraic Cases)',
      paragraphs: [
        'Any rational function P(x)/Q(x) (ratio of polynomials) can be integrated cleanly by splitting it into simpler fractions whose denominators are the irreducible factors of Q(x). STEP ZERO IS MANDATORY: compare polynomial degrees. If deg(P) ≥ deg(Q), the fraction is improper—perform polynomial long division FIRST so P(x)/Q(x) = Quotient(x) + Remainder(x)/Q(x) where deg(Remainder) < deg(Q).',
        'Next, factor Q(x) completely over the real numbers into linear factors (ax + b) and irreducible quadratics (ax² + bx + c with b² − 4ac < 0). Assign undetermined constants according to four rules: (1) Distinct linear factor (x − r) gets A/(x − r); (2) Repeated linear factor (x − r)ᵏ gets k terms A₁/(x − r) + A₂/(x − r)² + ... + Aₖ/(x − r)ᵏ; (3) Irreducible quadratic (ax² + bx + c) gets a LINEAR numerator (Bx + C)/(ax² + bx + c); (4) Repeated irreducible quadratic gets k such linear-numerator terms.',
      ],
      bulletPoints: [
        'Heaviside Cover-Up Method: For any distinct linear factor (x − r), multiplying both sides by (x − r) and evaluating at x = r isolates the coefficient A directly—giving both speed and intuition for residues.',
        'Integrating an irreducible quadratic (Bx + C)/(x² + a²): split into TWO integrals—B · x/(x² + a²) integrates to a logarithm via u-sub, while C/(x² + a²) integrates to (C/a) arctan(x/a).',
      ],
    },
  ],

  'calc2-improper': [
    {
      heading: '8.1 Type I (Infinite Intervals) & Type II (Vertical Asymptotes)',
      paragraphs: [
        'The Fundamental Theorem of Calculus strictly requires a continuous function on a finite closed interval [a, b]. An integral becomes IMPROPER whenever either condition fails. Type I improper integrals extend to +∞, −∞, or both. We define ∫_a^∞ f(x) dx = lim_{t→∞} ∫_a^t f(x) dx. If the limit exists as a finite real number, the integral converges; otherwise it diverges. For doubly infinite bounds ∫_{-∞}^{∞}, you MUST split at an arbitrary point (like 0) and verify that BOTH independent limits converge separately.',
        'Type II improper integrals hide vertical asymptotes either at an endpoint (like ∫_0^1 (1/√x) dx at x = 0) or—most dangerously—STRICTLY INSIDE the interval (like ∫_{-1}^2 (1/x²) dx, which blows up at x = 0). Always check the domain of your integrand across [a, b] before integrating. If a discontinuity sits at c ∈ (a, b), split into ∫_a^c + ∫_c^b and take one-sided limits approaching c⁻ and c⁺. If even ONE half diverges, the entire integral diverges.',
      ],
      keyFormulaTex:
        '\\int_{a}^{\\infty} f(x)\\,dx = \\lim_{t\\to\\infty}\\int_{a}^{t} f(x)\\,dx \\qquad\\Big|\\qquad \\int_{a}^{b} f(x)\\,dx = \\lim_{t\\to c^-}\\int_a^t f + \\lim_{s\\to c^+}\\int_s^b f',
      keyFormulaCaption:
        'Proper limit notation is mandatory—never substitute ∞ directly into an antiderivative.',
    },
    {
      heading: '8.2 The p-Integral Benchmark, Gabriel’s Horn & Comparison Tests',
      paragraphs: [
        'Calculating ∫_1^t x^{-p} dx reveals the fundamental dividing line of Calculus II: for p = 1 we get ln(t) → ∞ (diverges); for p ≠ 1 we get (t^{1−p} − 1)/(1 − p), which converges to 1/(p − 1) if and only if p > 1. Near x = 0 on (0, 1], the exact opposite happens: ∫_0^1 x^{-p} dx converges if and only if p < 1. Notice how p = 1 (1/x) diverges at BOTH infinity and zero! This leads to Gabriel’s Horn: rotating y = 1/x for x ≥ 1 around the x-axis produces a trumpet with FINITE volume (π ∫_1^∞ 1/x² dx = π) yet INFINITE surface area (≥ 2π ∫_1^∞ 1/x dx = ∞).',
        'Many vital improper integrals—such as the Gaussian bell curve ∫_0^∞ e^{-x²} dx—have no elementary antiderivative. To prove convergence without integrating, use the Direct Comparison Test (bound 0 ≤ f(x) ≤ g(x) where g is a known convergent p-integral or exponential e^{-x}) or the Limit Comparison Test (if lim_{x→∞} f(x)/g(x) = L with 0 < L < ∞, both integrals converge or both diverge together).',
      ],
    },
  ],

  'calc2-odes': [
    {
      heading: '9.1 Arc Length & Surface Area of Revolution',
      paragraphs: [
        'To measure the exact length of a smooth curve y = f(x) from x = a to x = b, approximate it by tiny polygonal line segments. By the Pythagorean Theorem, each tiny hypotenuse has length ds = √(dx² + dy²) = √(1 + [dy/dx]²) dx. Integrating ds sums the entire arc length L = ∫_a^b √(1 + [f′(x)]²) dx. Likewise, if the curve is easier to write as x = g(y), swap roles to ds = √(1 + [g′(y)]²) dy.',
        'Revolving each tiny arc segment ds around the x-axis sweeps out a slanted frustum band of circumference 2πy and slant width ds, giving Surface Area S = 2π ∫ y ds = 2π ∫_a^b f(x) √(1 + [f′(x)]²) dx. Notice the key distinction from Volume: surface area uses slant length ds = √(1 + (f′)²) dx rather than flat horizontal width dx.',
      ],
      keyFormulaTex:
        'ds = \\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2}\\,dx \\implies L = \\int_a^b ds, \\quad S_x = 2\\pi\\int_a^b y\\,ds, \\quad S_y = 2\\pi\\int_a^b x\\,ds',
      keyFormulaCaption:
        'One unified differential arc element ds governs arc length and both surface area formulas.',
    },
    {
      heading: '9.2 Slope Fields, Euler’s Method & Separable Differential Equations',
      paragraphs: [
        'A differential equation relates an unknown function y(x) to its own rate of change dy/dx = F(x, y). Even before solving it algebraically, we can visualize every possible solution by drawing a Direction (Slope) Field: at each grid point (x, y), draw a tiny line segment of slope F(x, y). Solution curves flow tangent to these arrows like leaves drifting in a stream. Euler’s Method turns a slope field into a numerical algorithm: starting at (x₀, y₀) with step size h, step repeatedly via y_{n+1} = y_n + h · F(x_n, y_n) and x_{n+1} = x_n + h.',
        'When an ODE factors cleanly as dy/dx = g(x) · h(y), it is SEPARABLE. Divide by h(y) (first noting any constant equilibrium solutions where h(y) = 0!), multiply by dx, and integrate both sides: ∫ [1/h(y)] dy = ∫ g(x) dx. Exponential growth dP/dt = kP solves to P(t) = P₀ e^{kt}, while realistic bounded populations obey the Logistic Equation dP/dt = kP(1 − P/K), solved via Partial Fractions to produce an S-shaped curve approaching carrying capacity K with peak growth rate at P = K/2.',
      ],
      keyFormulaTex:
        'y_{n+1} = y_n + h\\cdot F(x_n, y_n) \\qquad\\Big|\\qquad \\int \\frac{dy}{h(y)} = \\int g(x)\\,dx',
      keyFormulaCaption:
        'Euler’s numerical stepping rule alongside exact Separation of Variables.',
    },
  ],

  'calc2-series-1': [
    {
      heading: '10.1 Sequences vs. Infinite Series (The #1 Conceptual Distinction)',
      paragraphs: [
        'Most students stumble in Chapter 9 because they blur two completely different objects: a SEQUENCE {aₙ} is an ordered list of numbers (a₁, a₂, a₃, ...), whereas an INFINITE SERIES ∑ aₙ is the infinite SUM of those numbers. We define the sum of a series as the limit of its sequence of partial sums S_N = a₁ + a₂ + ... + a_N as N → ∞. If lim_{N→∞} S_N exists and equals a finite number S, the series converges to S; otherwise it diverges.',
        'To evaluate sequence limits lim_{n→∞} aₙ rapidly, memorize the Hierarchy of Growth Rates as n → ∞: ln(n) ≪ nᵖ ≪ bⁿ (b > 1) ≪ n! ≪ nⁿ. Any slower-growing function divided by a faster-growing function collapses to 0 immediately.',
      ],
      keyFormulaTex:
        '\\ln n \\;\\ll\\; n^p \\;\\ll\\; b^n \\;\\ll\\; n! \\;\\ll\\; n^n \\qquad (p > 0,\\; b > 1)',
      keyFormulaCaption:
        'Asymptotic growth hierarchy: factorials crush exponentials, and exponentials crush polynomials.',
    },
    {
      heading: '10.2 Exact Sums: Geometric & Telescoping Series + Divergence Test',
      paragraphs: [
        'In Calculus II, there are only two series families whose exact sum you compute directly before Taylor series: Geometric Series ∑ a rⁿ (converges iff |r| < 1 to S = (first term)/(1 − r)) and Telescoping Series (where partial fractions make intermediate terms cancel in pairs, leaving only the first couple of terms plus a vanishing tail as N → ∞).',
        'Before running any heavy convergence test, ALWAYS run the 2-second nth-Term Divergence Test: compute lim_{n→∞} aₙ. If that limit is anything other than 0 (or fails to exist), the series DIVERGES immediately. However, if lim_{n→∞} aₙ = 0, the test tells you NOTHING—the Harmonic Series ∑ 1/n has terms shrinking to 0 yet diverges to ∞.',
      ],
    },
    {
      heading: '10.3 Integral Test, p-Series & Direct/Limit Comparison Tests',
      paragraphs: [
        'If aₙ = f(n) where f(x) is positive, continuous, and decreasing for x ≥ N, the Integral Test proves that ∑ aₙ and the improper integral ∫_N^∞ f(x) dx share the exact same fate (both converge or both diverge). Applying this to f(x) = 1/xᵖ instantly establishes the p-Series benchmark: ∑ 1/nᵖ converges iff p > 1. Note that when ∑ aₙ converges by the Integral Test, the integral value is NOT the sum of the series—only a bound on it.',
        'For complicated positive series built from polynomials and radicals (like ∑ (3n + 1)/√(n⁵ + 4n)), the Integral Test is awful, so use Comparison Tests. Direct Comparison requires establishing a strict inequality (0 ≤ aₙ ≤ bₙ for convergence, or aₙ ≥ bₙ ≥ 0 for divergence). Whenever signs point the "wrong" way (like 1/(n² − 5) > 1/n²), skip the inequality headaches and deploy the Limit Comparison Test (LCT): choose bₙ by keeping ONLY the leading power of n in top and bottom, compute L = lim_{n→∞} (aₙ / bₙ), and if 0 < L < ∞, both series behave identically.',
      ],
    },
  ],

  'calc2-series-2': [
    {
      heading: '11.1 Alternating Series Test & Guaranteed Truncation Error',
      paragraphs: [
        'When signs flip strictly back and forth—∑ (−1)^{n−1} bₙ with bₙ > 0—cancellation helps the series converge much more easily than a positive series. The Alternating Series Test (AST) requires just two verifications: (1) bₙ₊₁ ≤ bₙ eventually (the magnitudes decrease monotonically, verified either by algebra or showing f′(x) < 0), and (2) lim_{n→∞} bₙ = 0. If both hold, the series converges!',
        'Better yet, alternating partial sums jump back and forth across the true limit S with ever-shrinking hops. Therefore, stopping after N terms leaves a remainder |R_N| = |S − S_N| that is ALWAYS smaller than the very first neglected term b_{N+1}. To guarantee accuracy within tolerance ε (say 10⁻⁴), simply solve b_{N+1} < ε for the smallest integer N.',
      ],
      keyFormulaTex:
        '|R_N| = |S - S_N| \\le b_{N+1}',
      keyFormulaCaption:
        'Alternating Series Estimation Theorem: truncation error never exceeds the next term.',
    },
    {
      heading: '11.2 Absolute vs. Conditional Convergence',
      paragraphs: [
        'A series ∑ aₙ is ABSOLUTELY CONVERGENT if the series of absolute values ∑ |aₙ| converges. Every absolutely convergent series is guaranteed to converge (and can even be rearranged in any order without changing its sum). A series is CONDITIONALLY CONVERGENT if ∑ aₙ converges (usually by AST), while ∑ |aₙ| diverges—the classic example is the Alternating Harmonic Series ∑ (−1)^{n−1}/n, which converges to ln(2) while ∑ 1/n diverges.',
        'On exams asking "Does ∑ aₙ converge absolutely, conditionally, or diverge?", always test ∑ |aₙ| FIRST. If ∑ |aₙ| converges, stop—you are done (Absolutely Convergent). If ∑ |aₙ| diverges, test the original signed series via AST: if AST passes → Conditionally Convergent; if lim |aₙ| ≠ 0 → Divergent.',
      ],
    },
    {
      heading: '11.3 Ratio Test & Root Test (The Heavy Artillery)',
      paragraphs: [
        'The Ratio Test computes L = lim_{n→∞} |aₙ₊₁ / aₙ|. It measures whether the series shrinks geometrically in the tail: if L < 1, the series converges ABSOLUTELY; if L > 1 (or ∞), it DIVERGES; if L = 1, the test is INCONCLUSIVE. Reach for the Ratio Test immediately whenever you spot factorials n!, double factorials, or exponentials cⁿ—and NEVER waste time running it on pure rational functions of n (which always give L = 1).',
        'The Root Test computes L = lim_{n→∞} |aₙ|^{1/n} with the exact same L < 1 / L > 1 / L = 1 verdict rules. It is custom-built for expressions raised to the n-th power like [(2n + 1)/(3n + 5)]ⁿ or (ln n)^{-n}, where the n-th root strips the outer exponent in one clean move.',
      ],
      keyFormulaTex:
        'L = \\lim_{n\\to\\infty}\\left|\\frac{a_{n+1}}{a_n}\\right| \\quad\\text{or}\\quad L = \\lim_{n\\to\\infty}\\sqrt[n]{|a_n|} \\implies \\begin{cases} L < 1 & \\text{Abs. Conv.} \\\\ L > 1 & \\text{Diverges} \\\\ L = 1 & \\text{Inconclusive}\\end{cases}',
      keyFormulaCaption:
        'Ratio Test for factorials/exponentials; Root Test for n-th powers.',
    },
  ],

  'calc2-taylor': [
    {
      heading: '12.1 Power Series & Finding the Exact Interval of Convergence',
      paragraphs: [
        'A Power Series centered at x = a is an infinite polynomial ∑_{n=0}^∞ cₙ (x − a)ⁿ. Unlike a numerical series that simply converges or diverges, a power series defines a function f(x) whose domain is the set of all x values making the series converge. A fundamental theorem guarantees that EVERY power series has only three possible convergence domains: (1) Only at the center x = a (Radius R = 0), (2) Everywhere on (−∞, ∞) (R = ∞), or (3) On a symmetric interval of radius R around a: (a − R, a + R), possibly including either or both endpoints.',
        'To find the exact Interval of Convergence on an exam, run a strict two-phase protocol: Phase 1—apply the Ratio (or Root) Test to |cₙ₊₁(x − a)^{n+1} / cₙ(x − a)ⁿ| < 1 to solve for |x − a| < R. Phase 2—plug the left endpoint x = a − R and right endpoint x = a + R individually into the original power series and test each resulting numerical series using Day 10–11 tests (AST, p-series, Divergence Test) to decide between open parentheses ( ) and closed brackets [ ].',
      ],
    },
    {
      heading: '12.2 Term-by-Term Calculus & The Big 6 Maclaurin Series',
      paragraphs: [
        'Inside its interval of convergence, a power series behaves just like a finite polynomial: you can differentiate it term-by-term, integrate it term-by-term, multiply by xᵏ, and substitute expressions like −x² or 3x without changing the Radius of Convergence R (though endpoints must be rechecked after differentiating or integrating).',
        'Starting from the geometric series 1/(1 − x) = ∑ xⁿ (|x| < 1), substituting −x and integrating gives ln(1 + x) = ∑ (−1)^{n−1} xⁿ/n; substituting −x² and integrating gives arctan(x) = ∑ (−1)ⁿ x^{2n+1}/(2n + 1). Together with eˣ, sin(x), and cos(x) derived from Taylor’s formula cₙ = f^{(n)}(0)/n!, these six expansions solve virtually every series construction, difficult limit (like lim (sin x − x)/x³), and non-elementary integral (like ∫ e^{-x²} dx) in university Calculus II.',
      ],
      keyFormulaTex:
        '\\frac{1}{1+x^2} = \\sum_{n=0}^{\\infty} (-1)^n x^{2n} \\xrightarrow{\\int} \\arctan(x) = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{2n+1} \\quad (|x| \\le 1)',
      keyFormulaCaption:
        'Term-by-term integration generates new Maclaurin series in two lines instead of taking n derivatives.',
    },
    {
      heading: '12.3 Taylor Polynomials & The Lagrange Remainder Bound',
      paragraphs: [
        'Truncating a Taylor series at degree n yields the n-th degree Taylor Polynomial Tₙ(x) = ∑_{k=0}^n [f^{(k)}(a)/k!](x − a)ᵏ. T₁(x) is simply the Calc I tangent line approximation; T₂(x) adds exact curvature (best-fitting parabola); higher degrees match higher bends so Tₙ(x) hugs f(x) tightly near x = a.',
        'When approximating f(x) with Tₙ(x), Taylor’s Inequality (Lagrange Error Bound) guarantees |f(x) − Tₙ(x)| = |Rₙ(x)| ≤ [M / (n + 1)!] |x − a|^{n+1}, where M is any upper bound on |f^{(n+1)}(z)| for z between a and x. For sine and cosine, every derivative is bounded by M = 1; for eˣ on [0, b], the increasing exponential is bounded by M = eᵇ.',
      ],
      keyFormulaTex:
        '|R_n(x)| = |f(x) - T_n(x)| \\le \\frac{M}{(n+1)!}|x - a|^{n+1}, \\qquad |f^{(n+1)}(z)| \\le M',
      keyFormulaCaption:
        'Lagrange Error Bound looks exactly like the next omitted Taylor term with worst-case derivative M.',
    },
  ],

  'calc2-polar': [
    {
      heading: '13.1 Parametric Motion: Slopes, Concavity & Arc Length',
      paragraphs: [
        'Parametric equations x = x(t), y = y(t) describe a particle’s trajectory over time t, allowing curves to loop, cross themselves, or move vertically—all impossible for a single function y = f(x). The tangent slope at time t follows from the Chain Rule: dy/dx = (dy/dt)/(dx/dt). Horizontal tangents occur where dy/dt = 0 (with dx/dt ≠ 0); vertical tangents occur where dx/dt = 0 (with dy/dt ≠ 0).',
        'Watch out for a common concavity pitfall: to compute d²y/dx², you are differentiating (dy/dx) with respect to x, NOT t! Therefore d²y/dx² = [d/dt(dy/dx)] / (dx/dt)—you must divide by dx/dt a second time. Parametric arc length follows directly from the speed vector √([x′(t)]² + [y′(t)]²): integrating speed over [t₁, t₂] gives exact distance traveled.',
      ],
      keyFormulaTex:
        '\\frac{dy}{dx} = \\frac{y\'(t)}{x\'(t)}, \\qquad \\frac{d^2y}{dx^2} = \\frac{\\frac{d}{dt}(dy/dx)}{x\'(t)}, \\qquad L = \\int_{t_1}^{t_2} \\sqrt{[x\'(t)]^2 + [y\'(t)]^2}\\,dt',
      keyFormulaCaption:
        'Complete parametric calculus toolkit: slope, curvature, and speed-integral arc length.',
    },
    {
      heading: '13.2 Polar Geometry, Tangents & Swept Sector Area',
      paragraphs: [
        'Polar coordinates locate a point by distance r from the origin (pole) and angle θ from the positive x-axis, linked to Cartesian coordinates by x = r cos θ, y = r sin θ, r² = x² + y², and tan θ = y/x. When r(θ) turns negative, you walk backward through the origin along the ray θ + π—which creates inner loops on limaçons and petals on roses. To find tangent slopes to r = f(θ), treat θ as a parameter for x(θ) = f(θ) cos θ and y(θ) = f(θ) sin θ and apply dy/dx = (dy/dθ)/(dx/dθ).',
        'Polar area does NOT sum vertical rectangles—it sums infinitely thin pie wedges (circular sectors) of radius r and angle dθ, each having area ½r² dθ. Thus A = ½ ∫_α^β [r(θ)]² dθ. For the area between an outer polar curve r_out and an inner curve r_in, integrate ½ ∫ (r_out² − r_in²) dθ. Always sketch the curves and solve r(θ) = 0 to identify exact petal/loop entry and exit angles, and verify whether two polar curves intersect at the pole (r = 0) at DIFFERENT values of θ!',
      ],
      keyFormulaTex:
        'A = \\frac{1}{2}\\int_{\\alpha}^{\\beta} \\Big([r_{\\text{outer}}(\\theta)]^2 - [r_{\\text{inner}}(\\theta)]^2\\Big)\\,d\\theta',
      keyFormulaCaption:
        'Polar area between curves subtracts squared radii, analogous to the Washer Method.',
    },
  ],

  'calc2-synthesis': [
    {
      heading: '14.1 The 60-Second Integration Recognition Algorithm',
      paragraphs: [
        'On a timed university final exam, you are never told which chapter a problem came from. The difference between an A and running out of time is recognizing the winning technique inside the first 15 seconds. Always descend this strict 5-rung ladder—never skip straight to heavy machinery when a top rung works:',
        '(1) Algebra & Direct Table: Can you split the numerator, divide polynomials, simplify trig identities, or match arctan/arcsin immediately? (2) u-Substitution: Is there an inner chunk whose derivative sits right outside (e.g., ∫ x/(x² + 9) dx or ∫ (ln x)/x dx)? (3) Integration by Parts (LIATE): Is it a product of two mismatched families (polynomial × exp/trig/log) or a standalone inverse function (ln x, arctan x)? (4) Trig Integrals & Trig Sub: Powers of sin/cos or sec/tan → parity rules; quadratic radical √(a² ± x²) or √(x² − a²) → sin/tan/sec substitution after completing the square. (5) Partial Fractions: Rational function P(x)/Q(x) with factorable denominator → long division if improper, then decompose.',
      ],
    },
    {
      heading: '14.2 The Deterministic Series Convergence Flowchart',
      paragraphs: [
        'Apply this exact 5-step decision tree to every infinite series on your final exam so you never guess blindly:',
        '(1) Run the 2-second nth-Term Divergence Test: if lim aₙ ≠ 0, STOP → Diverges. (2) Check instant forms: Geometric ∑ a rⁿ (|r| < 1) or p-Series ∑ 1/nᵖ (p > 1) or Telescoping partial fractions. (3) Scan for factorials (n!), exponentials (cⁿ), or whole n-th powers (·)ⁿ → deploy Ratio Test or Root Test immediately. (4) Pure algebraic/rational/radical terms in n → extract dominant powers nᵃ/nᵇ and run Limit Comparison Test (LCT) against ∑ 1/n^{b−a}. (5) Alternating signs (−1)ⁿ → test ∑ |aₙ| first (for Absolute Convergence), then run AST (decreasing & → 0) for Conditional Convergence. Reserve the Integral Test as a last resort for cleanly integrable expressions like 1/(n ln n).',
      ],
      bulletPoints: [
        'Cross-Course Exam Secret: If a Calculus I limit like lim_{x→0} (eˣ − 1 − x − x²/2)/x³ requires 3 painful rounds of L’Hôpital, drop in the Calculus II Maclaurin series to solve it in 5 seconds!',
        'Before turning in any exam: check + C on indefinite integrals, check both endpoints on Intervals of Convergence, check interior asymptotes on definite integrals, and differentiate your antiderivatives mentally to verify zero sign mistakes.',
      ],
    },
  ],
};
