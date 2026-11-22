import type { TextbookSection } from '../types/course';

export const TEXTBOOK_CALC1: Record<string, TextbookSection[]> = {
  'calc1-limits': [
    {
      heading: '1.1 Why Calculus Starts with Limits (and Not Plugging In)',
      paragraphs: [
        'Algebra gives you tools to compute slopes of straight lines and areas of flat polygons, but physics and engineering revolve around curved motion and continuously changing rates. If you try to compute the exact velocity of a falling object at a single instant t = 2, the distance traveled during zero elapsed time is 0/0—algebra breaks down completely.',
        'A limit resolves this paradox by asking what value f(x) approaches as x gets arbitrarily close to a from both the left (x → a⁻) and the right (x → a⁺), without ever setting x equal to a. A two-sided limit exists if and only if both one-sided limits exist, are finite, and equal the exact same real number L. The actual dot f(a) might be missing (a hole), displaced to another height, or equal to L—none of that changes the limit.',
      ],
      keyFormulaTex:
        '\\lim_{x \\to a} f(x) = L \\iff \\lim_{x \\to a^-} f(x) = L \\;\\text{ and }\\; \\lim_{x \\to a^+} f(x) = L',
      keyFormulaCaption:
        'Existence criterion: left-hand and right-hand limits must agree and be finite.',
      bulletPoints: [
        'Removable discontinuity (hole): Two-sided limit exists, but f(a) is undefined or differs from L.',
        'Jump discontinuity: Left and right limits are both finite, but they disagree (e.g., |x|/x at x = 0 gives −1 from the left and +1 from the right).',
        'Infinite discontinuity (vertical asymptote): One or both one-sided limits shoot to +∞ or −∞; technically the limit does not exist, though we write +∞ or −∞ to describe the direction.',
      ],
    },
    {
      heading: '1.2 Algebraic Toolkit for 0/0 Indeterminate Forms',
      paragraphs: [
        'Whenever direct substitution produces a finite number divided by a non-zero denominator, you are done immediately. When substitution gives c/0 with c ≠ 0, you have a vertical asymptote—check signs from each side to determine +∞ vs. −∞. The true computational heart of Calculus I limits is the indeterminate form 0/0, which signals that numerator and denominator share a hidden zero factor (x − a) that must be exposed and canceled.',
        'There are four reliable algebraic moves that resolve virtually every 0/0 limit before L’Hôpital’s Rule is introduced: (1) Factor polynomials (including difference of cubes a³ − b³ = (a − b)(a² + ab + b²)), (2) Multiply numerator and denominator by the radical conjugate (√A − B)(√A + B) = A − B², (3) Combine complex fractions over a single common denominator, and (4) Expand binomials like (x + h)ⁿ so constant terms cancel.',
      ],
      keyFormulaTex:
        '\\frac{\\sqrt{x+h} - \\sqrt{x}}{h} \\cdot \\frac{\\sqrt{x+h} + \\sqrt{x}}{\\sqrt{x+h} + \\sqrt{x}} = \\frac{(x+h) - x}{h(\\sqrt{x+h} + \\sqrt{x})} = \\frac{1}{\\sqrt{x+h} + \\sqrt{x}}',
      keyFormulaCaption:
        'Conjugate multiplication turns a 0/0 difference quotient into a clean continuous expression.',
    },
    {
      heading: '1.3 Limits at Infinity, Horizontal Asymptotes & The Squeeze Theorem',
      paragraphs: [
        'To evaluate limits as x → +∞ or x → −∞ for rational and radical functions, divide every term in the numerator and denominator by the highest power of x appearing in the denominator. Any term of the form c/xᵖ (p > 0) collapses to 0. Be extra vigilant when x → −∞ with even roots: √(x²) = |x| = −x for negative x, which flips the sign of the horizontal asymptote.',
        'When a function oscillates rapidly—such as x² sin(1/x) as x → 0—limit laws cannot be split because lim sin(1/x) does not exist. Instead, deploy the Squeeze Theorem: trap sin(1/x) inside [−1, 1], multiply by the non-negative envelope x² to get −x² ≤ x² sin(1/x) ≤ x², and observe that both outer bounds go to 0, forcing the trapped function to 0. The same geometric squeeze on the unit circle proves the cornerstone trigonometric limit lim_{x→0} (sin x)/x = 1.',
      ],
      keyFormulaTex:
        '-1 \\le \\sin\\left(\\frac{1}{x}\\right) \\le 1 \\implies -x^2 \\le x^2\\sin\\left(\\frac{1}{x}\\right) \\le x^2 \\implies \\lim_{x\\to 0} x^2\\sin\\left(\\frac{1}{x}\\right) = 0',
      keyFormulaCaption:
        'Bounding an oscillating factor between two envelopes that converge to the same limit.',
    },
    {
      heading: '1.4 Continuity, ε-δ Rigor & The Intermediate Value Theorem',
      paragraphs: [
        'A function f is continuous at c when three checkpoints pass simultaneously: (1) f(c) is defined, (2) lim_{x→c} f(x) exists, and (3) lim_{x→c} f(x) = f(c). Polynomials, sine, cosine, exponentials, and rational functions (where denominator ≠ 0) are continuous everywhere on their domains, and sums, products, quotients, and compositions of continuous functions remain continuous.',
        'In rigorous university exams, you may be asked to prove a linear limit using the ε-δ definition. Work backward from |f(x) − L| < ε to isolate |x − a| < (expression in ε), set δ equal to that expression, and then write the forward proof starting with "Given any ε > 0, choose δ = ...". Finally, the Intermediate Value Theorem (IVT) guarantees that a continuous function on a closed interval [a, b] cannot jump over any height between f(a) and f(b)—making it the primary proof that equations like x⁵ + x − 1 = 0 possess a real root on [0, 1].',
      ],
    },
  ],

  'calc1-derivatives': [
    {
      heading: '2.1 From Secant Slopes to Instantaneous Rate of Change',
      paragraphs: [
        'Given two points (x, f(x)) and (x + h, f(x + h)) on a smooth curve, the secant line connecting them has slope [f(x + h) − f(x)]/h—this represents the average rate of change over the interval [x, x + h]. Shrinking the interval width h toward zero pivots the secant line until it kisses the curve at a single point, becoming the tangent line. Its limiting slope is the derivative f′(x).',
        'Differentiability is a strictly stronger property than continuity. Every differentiable function is guaranteed to be continuous, because if f′(a) exists, the numerator f(x) − f(a) must shrink to 0 as fast as (x − a). However, continuity does NOT guarantee differentiability: a curve can be continuous yet fail to have a derivative at a sharp corner (|x| at 0), a cusp (x^{2/3} at 0), or a vertical tangent line (x^{1/3} at 0).',
      ],
      keyFormulaTex:
        "f'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h} = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}",
      keyFormulaCaption:
        'Both equivalent definitions of the derivative—learn to recognize both on conceptual exam questions.',
    },
    {
      heading: '2.2 Mastering Differentiation Rules & Composite Chains',
      paragraphs: [
        'Computing limits from scratch for every function is too slow, so we build an algebraic calculus of derivatives. Linearity lets you differentiate term-by-term and pull out constants. The Power Rule d/dx(xⁿ) = n x^{n−1} holds for EVERY real exponent n—positive integers, negative fractions, and irrational numbers alike. Always rewrite roots like 1/√(x³) as x^{-3/2} before differentiating.',
        'For products and quotients, never differentiate factors independently: the Product Rule (fg)′ = f′g + fg′ accounts for how both sides of a growing rectangle contribute new area simultaneously, while the Quotient Rule (f/g)′ = (f′g − fg′)/g² has a mandatory minus sign in the numerator. The most important rule of all is the Chain Rule: whenever a function wraps an inner expression u = g(x), differentiate the outer layer with respect to u and multiply by u′ = g′(x). In multi-layered expressions like sin³(e^{4x}), peel one layer at a time from outermost to innermost: power 3 → sine → exponential → 4x.',
      ],
      keyFormulaTex:
        '\\frac{d}{dx}\\Big[\\sin^3(e^{4x})\\Big] = 3\\sin^2(e^{4x}) \\cdot \\cos(e^{4x}) \\cdot e^{4x} \\cdot 4',
      keyFormulaCaption:
        'Four-layer Chain Rule peeling: outer power, trig, exponential, and linear inner factor.',
      bulletPoints: [
        'Exponential & Log anchors: (eˣ)′ = eˣ, (aˣ)′ = aˣ ln(a), (ln|x|)′ = 1/x, (log_a x)′ = 1/(x ln a).',
        'Trigonometric sign rule: Every "co-" function (cos, cot, csc) carries a negative sign in its derivative.',
        'Inverse trigonometric derivatives: (arcsin x)′ = 1/√(1 − x²), (arctan x)′ = 1/(1 + x²), (arcsec x)′ = 1/(|x|√(x² − 1)).',
      ],
    },
    {
      heading: '2.3 Implicit Differentiation & Logarithmic Differentiation',
      paragraphs: [
        'Many curves in geometry and physics—circles x² + y² = 25, folium of Descartes x³ + y³ = 6xy, or thermodynamic state equations—cannot be neatly solved for y as a single explicit function of x. Implicit differentiation treats y as an unknown differentiable function y(x) and applies d/dx to both sides of the equation. Whenever you differentiate an expression containing y, the Chain Rule automatically attaches a factor of dy/dx (for instance, d/dx[y⁴] = 4y³ dy/dx). Afterward, collect all dy/dx terms on one side, factor out dy/dx, and divide.',
        'Logarithmic differentiation solves two notoriously messy classes of problems effortlessly: (1) Variable bases raised to variable exponents like y = x^{sin x} or y = (1 + 1/x)^x, and (2) Massive rational products/powers like y = (x² + 1)⁵ √(2x − 3) / (x⁴ + 7)³. Taking ln of both sides turns exponents into products and products/quotients into simple sums/differences. Differentiate implicitly to get y′/y on the left, then multiply the entire right side by the original expression for y.',
      ],
      keyFormulaTex:
        'y = f(x)^{g(x)} \\implies \\ln y = g(x)\\ln f(x) \\implies \\frac{dy}{dx} = f(x)^{g(x)}\\left[g\'(x)\\ln f(x) + g(x)\\frac{f\'(x)}{f(x)}\\right]',
      keyFormulaCaption:
        'Logarithmic differentiation converts variable-exponent differentiation into a clean product rule.',
    },
  ],

  'calc1-applications': [
    {
      heading: '3.1 Extreme Value Theorem, Critical Numbers & The Mean Value Theorem',
      paragraphs: [
        'Derivatives tell us the complete global shape of a function without plotting hundreds of points. The Extreme Value Theorem (EVT) guarantees that any continuous function on a closed, bounded interval [a, b] attains both an absolute maximum and an absolute minimum. Fermat’s Theorem narrows the search dramatically: interior local extrema can occur ONLY at critical numbers c where either f′(c) = 0 (horizontal tangent) or f′(c) does not exist (sharp corner/cusp).',
        'The Mean Value Theorem (MVT) is the theoretical bridge connecting local derivative information to global behavior. If f is continuous on [a, b] and differentiable on (a, b), there exists at least one point c ∈ (a, b) where f′(c) = [f(b) − f(a)]/(b − a). From MVT immediately follow the core laws of calculus: if f′(x) > 0 on an interval, f is strictly increasing; if f′(x) = 0 everywhere on an interval, f must be constant (which is why two antiderivatives of the same function can differ only by + C!).',
      ],
      keyFormulaTex:
        "f'(c) = \\frac{f(b) - f(a)}{b - a} \\quad \\text{for some } c \\in (a, b)",
      keyFormulaCaption:
        'MVT links instantaneous slope f′(c) to average secant slope across [a, b].',
    },
    {
      heading: '3.2 Curve Anatomy: First & Second Derivative Tests',
      paragraphs: [
        'Sign charts organize shape analysis cleanly. First, find all critical points and domain discontinuities to partition the real line; test the sign of f′(x) in each subinterval. Where f′ changes from + to −, f reaches a local maximum; where f′ changes from − to +, f reaches a local minimum; if f′ keeps the same sign (like x³ at 0), there is no extremum.',
        'Next, compute f″(x)—the rate of change of the slope. Where f″(x) > 0, the slope is increasing and the curve bends upward (concave up, lying above its tangent lines). Where f″(x) < 0, the curve bends downward (concave down, lying below its tangent lines). A point where the curve is continuous and concavity flips sign is an inflection point. Note that f″(c) = 0 is only a candidate—check that f″ actually changes sign across c (for example, f(x) = x⁴ has f″(0) = 0 yet no inflection point).',
      ],
      bulletPoints: [
        'First Derivative Test works at ALL critical points, including corners where f′ DNE.',
        'Second Derivative Test is faster when f″ is simple: if f′(c) = 0 and f″(c) > 0 → local min; f″(c) < 0 → local max; f″(c) = 0 → test is inconclusive (fall back to First Derivative Test).',
      ],
    },
    {
      heading: '3.3 L’Hôpital’s Rule Across All 7 Indeterminate Forms',
      paragraphs: [
        'L’Hôpital’s Rule is valid directly ONLY for quotients yielding 0/0 or ±∞/±∞. Before differentiating numerator and denominator separately, always verify the indeterminate form—applying L’Hôpital to a determinate fraction like 1/0 produces completely bogus numbers.',
        'The remaining five indeterminate forms must be algebraically converted into 0/0 or ∞/∞ first: (1) Product 0 · ∞: flip one factor into the denominator as f · g = f / (1/g); (2) Difference ∞ − ∞: combine fractions over a common denominator or factor out the dominant term; (3) Exponential powers 1^∞, 0⁰, ∞⁰: set y = f(x)^{g(x)}, take ln(y) = g(x) ln f(x) to get a 0 · ∞ form, find L = lim ln(y), and remember to exponentiate back to e^L at the end!',
      ],
      keyFormulaTex:
        '0\\cdot\\infty \\to \\frac{f}{1/g} \\qquad\\Big|\\qquad 1^\\infty,\\;0^0,\\;\\infty^0 \\xrightarrow{\\ln} g(x)\\ln f(x) \\implies \\text{Limit} = e^{L}',
      keyFormulaCaption:
        'Conversion pipeline turning all 7 indeterminate forms into direct L’Hôpital ratios.',
    },
    {
      heading: '3.4 Related Rates & Closed-Interval Optimization Blueprints',
      paragraphs: [
        'In Related Rates, multiple physical quantities vary simultaneously with respect to time t. Follow a rigid four-step protocol: (1) Sketch the geometry and label changing quantities with variables (x, y, r, θ) and fixed constants with numbers; (2) Write a geometric equation linking the variables (Pythagorean theorem, similar triangles, volume formula, or trig ratio); (3) Differentiate both sides with respect to time t using the Chain Rule; (4) Only AFTER differentiating, substitute the instantaneous snapshot values and solve for the target rate.',
        'In Optimization, identify two equations: the Objective Function you want to maximize or minimize (e.g., Area, Cost, Distance) and the Constraint Equation tying variables together (e.g., fixed perimeter or fixed volume). Solve the constraint for one variable and substitute into the objective so it depends on a single variable on a feasible domain [a, b]. Find critical points via f′(x) = 0, then verify your optimum either by comparing endpoints (Closed-Interval Method) or by checking the sign of f″(x) on an open domain.',
      ],
    },
  ],

  'calc1-integrals': [
    {
      heading: '4.1 Area as a Limit of Riemann Sums',
      paragraphs: [
        'Just as derivatives generalize slope from straight lines to curves via limits, definite integrals generalize area from rectangles to curved regions via limits of sums. Partition a closed interval [a, b] into n subintervals of equal width Δx = (b − a)/n. On each slice [x_{i−1}, x_i], pick a sample point x_i* (left endpoint, right endpoint, or midpoint) and construct a rectangle of signed height f(x_i*) and area f(x_i*)Δx.',
        'Summing all n rectangles produces a Riemann sum. When f(x) drops below the x-axis, f(x_i*) is negative, so the definite integral computes NET SIGNED AREA (area above the x-axis minus area below). Letting n → ∞ shrinks the width Δx → 0 and turns the discrete sum Σ into the continuous integral ∫_a^b f(x) dx.',
      ],
      keyFormulaTex:
        '\\int_{a}^{b} f(x)\\,dx = \\lim_{n\\to\\infty} \\sum_{i=1}^{n} f(x_i^*)\\,\\Delta x, \\qquad \\Delta x = \\frac{b - a}{n}',
      keyFormulaCaption:
        'The definite integral is literally the infinite limit of thin rectangular slices.',
    },
    {
      heading: '4.2 The Fundamental Theorem of Calculus (Parts I & II)',
      paragraphs: [
        'Computing definite integrals directly from Riemann sums is tedious even for x³. The Fundamental Theorem of Calculus (FTC) reveals the core bridge: accumulation (integration) and rate of change (differentiation) are exact inverses.',
        'FTC Part I defines the area-so-far function g(x) = ∫_a^x f(t) dt for a continuous function f. If you nudge x forward by a tiny dx, the extra sliver of area added is a thin rectangle of height f(x) and width dx, so dg/dx = f(x). Combined with the Chain Rule, differentiating an integral with moving bounds u(x) and v(x) gives f(v(x))v′(x) − f(u(x))u′(x). FTC Part II then follows immediately: if F is ANY antiderivative of f (so F′ = f), then ∫_a^b f(x) dx = F(b) − F(a). Physically, integrating velocity yields net displacement (Net Change Theorem), whereas integrating |v(t)| yields total distance traveled.',
      ],
      keyFormulaTex:
        '\\frac{d}{dx}\\int_{u(x)}^{v(x)} f(t)\\,dt = f(v(x))v\'(x) - f(u(x))u\'(x) \\qquad\\text{and}\\qquad \\int_a^b F\'(x)\\,dx = F(b) - F(a)',
      keyFormulaCaption:
        'FTC Part I (generalized Leibniz form) and FTC Part II (Net Change Theorem).',
    },
    {
      heading: '4.3 Mastery of u-Substitution & Symmetry Properties',
      paragraphs: [
        'The Chain Rule produces derivatives of the form f(g(x)) · g′(x). Reversing that rule is u-Substitution: look inside a composite expression (inside a radical, denominator, exponent, or trig argument) for an inner chunk u = g(x) whose derivative g′(x) dx also appears as a multiplicative factor up to a constant multiple. Replace g(x) with u and g′(x) dx with du, integrate in u, and return to x for indefinite integrals.',
        'For DEFINITE integrals, always transform the bounds immediately: when x = a, u = g(a); when x = b, u = g(b). This avoids back-substitution mistakes and keeps every step transparent. Also inspect every symmetric interval [−a, a] before calculating: if f(−x) = −f(x) (odd function like x³ cos x), the integral is 0 by cancellation; if f(−x) = f(x) (even function like x² + cos x), double the integral over [0, a].',
      ],
    },
  ],

  'calc1-volumes': [
    {
      heading: '5.1 Area Between Curves: Choosing dx vs. dy Slices',
      paragraphs: [
        'To compute the geometric area enclosed between two curves, slice the region into infinitely thin strips. If you use vertical strips (thickness dx), each strip has height (y_top − y_bottom), so A = ∫_a^b [f(x) − g(x)] dx. Always solve f(x) = g(x) first to find exact intersection points and check whether the upper and lower curves trade places mid-interval—if they cross, split the integral at the crossing point.',
        'Whenever a region has two different "top" curves or is written naturally as x = f(y) (like sideways parabolas x = y² and lines x = y + 2), switch immediately to horizontal strips (thickness dy): each strip has length (x_right − x_left), giving A = ∫_c^d [x_right(y) − x_left(y)] dy in a single clean integral instead of splitting into two messy dx integrals.',
      ],
      keyFormulaTex:
        'A = \\int_{a}^{b} (y_{\\text{top}} - y_{\\text{bottom}})\\,dx = \\int_{c}^{d} (x_{\\text{right}} - x_{\\text{left}})\\,dy',
      keyFormulaCaption:
        'Pick whichever slicing direction keeps one single boundary curve on each side.',
    },
    {
      heading: '5.2 Slicing 3D Solids: Cross-Sections, Disks & Washers',
      paragraphs: [
        'Any 3D solid whose cross-sectional area perpendicular to the x-axis is a known function A(x) has total volume V = ∫_a^b A(x) dx. For solids with square cross-sections of base s(x), A(x) = [s(x)]²; for semicircular cross-sections with diameter s(x), A(x) = (π/8)[s(x)]²; for equilateral triangles, A(x) = (√3/4)[s(x)]².',
        'When a planar region revolves around an axis, a slice PERPENDICULAR to the axis sweeps out a circular Disk (if touching the axis) or a hollow Washer (if there is a gap between the region and the axis). Measure BOTH the outer radius R (distance from the axis to the farther boundary) and the inner radius r (distance from the axis to the closer boundary). For a shifted axis like y = −2, distance is always (curve − axis) or (axis − curve) so R ≥ r ≥ 0. The slice area is π(R² − r²)—never π(R − r)²!',
      ],
      keyFormulaTex:
        'V_{\\text{washer}} = \\pi \\int_a^b \\Big([R(x)]^2 - [r(x)]^2\\Big)\\,dx',
      keyFormulaCaption:
        'Washer volume subtracts the inner hole area πr² from the outer disk area πR².',
    },
    {
      heading: '5.3 Cylindrical Shells & How to Pick the Faster Method',
      paragraphs: [
        'Sometimes revolving a region around a vertical axis (like the y-axis) makes Disk/Washer painful or impossible because solving y = x − x³ or y = sin(x²) for x in terms of y cannot be done algebraically. The Cylindrical Shell Method solves this by taking slices PARALLEL to the axis of rotation.',
        'When a thin vertical strip at position x with height h(x) and thickness dx revolves around the y-axis, it sweeps out a hollow cylindrical shell (like the paper label on a tin can). Cut and unroll that shell flat: its width is the circumference 2πr, its height is h(x), and its thickness is dx, giving elemental volume dV = 2π(radius)(height) dx. If rotating around a shifted vertical line x = c, the radius is simply |x − c| (either x − c when the region is to the right of the axis, or c − x when to the left).',
      ],
      bulletPoints: [
        'Golden Axis Decision Rule: Slice PERPENDICULAR to the axis → Disk/Washer (π(R² − r²)). Slice PARALLEL to the axis → Cylindrical Shell (2π r h).',
        'Rotating around the x-axis with y = f(x) → use Disk/Washer in dx. Rotating around the y-axis with y = f(x) → use Shells in dx.',
      ],
    },
  ],
};
