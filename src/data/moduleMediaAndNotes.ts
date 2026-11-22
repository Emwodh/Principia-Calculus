import type { ExternalResource, VideoLecture } from '../types/course';

export interface ModuleMediaBundle {
  videos: VideoLecture[];
  externalResources: ExternalResource[];
}

/**
 * Every YouTube ID below is verified directly against Professor Leonard's official
 * Precalculus / College Algebra & Trig (PLDesaqWTN6ESsmwELdrzhcGiRhk5DjwLP),
 * Calculus 1 (PLF797E961509B4EB5), and Calculus 2 (PLDesaqWTN6EQ2J4vgsN1HyBeRADEh4Cw-)
 * playlists, plus 3Blue1Brown's Essence of Calculus (PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr).
 */
export const MODULE_MEDIA_MAP: Record<string, ModuleMediaBundle> = {
  'prealg-functions': {
    videos: [
      {
        id: 'vid-pa1-1',
        youtubeId: '9OOrhA2iKak',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 01',
        title: 'Intro to Precalculus (College Algebra 1)',
        focusSummary:
          'Roadmap of the algebraic and trigonometric foundations required to thrive in university Calculus I and II.',
        watchStrategy:
          'Watch at 1.5x to orient yourself on how functions, graphs, and trigonometry connect directly into limits and derivatives.',
      },
      {
        id: 'vid-pa1-2',
        youtubeId: 'FkUEsP9efFg',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 02',
        title: 'Introduction to Functions (College Algebra 2)',
        focusSummary:
          'Rigorous definition of functions, relations, inputs/outputs, and reading function notation f(x) accurately.',
        watchStrategy:
          'Focus closely on algebraic substitution inside f(x + h)—this sets up difference quotients.',
      },
      {
        id: 'vid-pa1-3',
        youtubeId: 'LvUCDcp6Z3k',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 04',
        title: 'Finding the Domain of Functions (College Algebra 4)',
        focusSummary:
          'Step-by-step method for finding implied domains of rational, radical, and combined functions in interval notation.',
        watchStrategy:
          'Pause before each radical-in-denominator example and test whether the boundary is open or closed.',
      },
      {
        id: 'vid-pa1-4',
        youtubeId: '6897XAx3O9Q',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 08',
        title: 'Properties of Functions — Even vs Odd (College Algebra 8)',
        focusSummary:
          'Algebraic symmetry tests f(−x) = f(x) and f(−x) = −f(x) alongside geometric y-axis and origin symmetry.',
        watchStrategy:
          'High-value foundation—recognizing even and odd symmetry simplifies definite integrals across symmetric intervals later in Calculus I.',
      },
      {
        id: 'vid-pa1-5',
        youtubeId: 'H5Y-ONkezDM',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 11',
        title: 'Average Rate of Change of a Function (College Algebra 11)',
        focusSummary:
          'Secant slope [f(b) − f(a)] / (b − a) and simplifying the difference quotient—the direct algebraic gateway to derivatives.',
        watchStrategy:
          'Work every difference quotient example on paper alongside Professor Leonard until canceling h feels automatic.',
      },
      {
        id: 'vid-pa1-6',
        youtubeId: 'HkrMJLSpJFI',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 15',
        title: 'How to Graph with Transformations (College Algebra 15)',
        focusSummary:
          'Combining shifts, reflections, and stretches on parent functions without plotting tables of points.',
        watchStrategy:
          'Pay special attention to horizontal transformations—operations inside f(x) act in reverse.',
      },
    ],
    externalResources: [
      {
        title: 'OpenStax Precalculus 2e — Chapter 1: Functions (Full Theory)',
        provider: 'OpenStax Precalculus 2e',
        resourceKind: 'theory',
        url: 'https://openstax.org/books/precalculus-2e/pages/1-introduction-to-functions',
        description:
          'Complete university textbook theory covering function notation, domains, average rate of change, and transformations.',
      },
      {
        title: 'Paul’s Online Math Notes — Function Definition & Evaluation Exercises',
        provider: "Paul's Online Math Notes",
        resourceKind: 'exercises',
        url: 'https://tutorial.math.lamar.edu/Problems/Alg/FunctionDefn.aspx',
        description:
          'Worked practice problems with step-by-step solutions on domains, evaluations, and difference quotients.',
      },
      {
        title: 'Professor Leonard — Complete 100-Video Precalculus Playlist',
        provider: 'Professor Leonard Playlist',
        resourceKind: 'playlist',
        url: 'https://www.youtube.com/playlist?list=PLDesaqWTN6ESsmwELdrzhcGiRhk5DjwLP',
        description:
          'Full 100-lecture Precalculus / College Algebra & Trigonometry playlist on YouTube if you want every bonus walkthrough.',
      },
    ],
  },

  'prealg-quadratics-polys': {
    videos: [
      {
        id: 'vid-pa2-1',
        youtubeId: 'pYSYL_vy6YQ',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 19',
        title: 'Completing the Square Made Easy (College Algebra 19)',
        focusSummary:
          'Converting ax² + bx + c into vertex form cleanly—essential for both quadratics and Calculus II trig-sub/arctan integrals.',
        watchStrategy:
          'Watch carefully when leading coefficient a ≠ 1; balancing the outside constant is the most common algebra pitfall.',
      },
      {
        id: 'vid-pa2-2',
        youtubeId: '2BUg_w1Cu9E',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 20',
        title: 'Proving the Quadratic Formula — Twice (College Algebra 20)',
        focusSummary:
          'Derives the Quadratic Formula directly from completing the square so you never rely on rote memorization.',
        watchStrategy:
          'Follow the derivation once at 1.25x, then practice solving with discriminant analysis.',
      },
      {
        id: 'vid-pa2-3',
        youtubeId: 'Gxh-mEt1K-o',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 29',
        title: 'Multiplicity and End Behavior of Polynomials (College Algebra 29)',
        focusSummary:
          'Leading-term end behavior plus how odd vs. even root multiplicity makes a curve cross or bounce at the x-axis.',
        watchStrategy:
          'Pause on the sketching summary to verify you can predict end behavior and bounces in under 10 seconds.',
      },
      {
        id: 'vid-pa2-4',
        youtubeId: 'AKJgo-WR_K4',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 32',
        title: 'Synthetic Division and Long Division of Polynomials (College Algebra 32)',
        focusSummary:
          'Long division for any divisor and rapid synthetic division for linear divisors (x − c), plus missing-term 0 placeholders.',
        watchStrategy:
          'Crucial prerequisite for Calculus II Partial Fractions when numerator degree ≥ denominator degree.',
      },
      {
        id: 'vid-pa2-5',
        youtubeId: 'xuhk2kSVwe0',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 37',
        title: 'Finding ALL Solutions of Polynomials (College Algebra 37)',
        focusSummary:
          'Combines Rational Zeros Theorem, synthetic division, and complex conjugate pairs to completely factor higher-degree polynomials.',
        watchStrategy:
          'Pause after Professor Leonard lists candidate rational zeros and test your own first root before resuming.',
      },
    ],
    externalResources: [
      {
        title: 'OpenStax Precalculus 2e — Chapter 3: Polynomial & Rational Functions (Theory)',
        provider: 'OpenStax Precalculus 2e',
        resourceKind: 'theory',
        url: 'https://openstax.org/books/precalculus-2e/pages/3-introduction-to-polynomial-and-rational-functions',
        description:
          'Formal OpenStax theory on vertex form, power functions, polynomial graphs, synthetic division, and complex zeros.',
      },
      {
        title: 'Paul’s Online Math Notes — Solving Quadratic Equations Exercises',
        provider: "Paul's Online Math Notes",
        resourceKind: 'exercises',
        url: 'https://tutorial.math.lamar.edu/Problems/Alg/SolveQuadraticEqnsII.aspx',
        description:
          'Practice problem set on completing the square and the quadratic formula with full worked solutions.',
      },
      {
        title: 'Paul’s Online Math Notes — Dividing Polynomials Exercises',
        provider: "Paul's Online Math Notes",
        resourceKind: 'exercises',
        url: 'https://tutorial.math.lamar.edu/Problems/Alg/DividingPolynomials.aspx',
        description:
          'Targeted polynomial long division and synthetic division drills with step-by-step verification.',
      },
    ],
  },

  'prealg-rationals-inequalities': {
    videos: [
      {
        id: 'vid-pa3-1',
        youtubeId: 'y-bSJaEonho',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 38',
        title: 'Finding Vertical Asymptotes of Rational Functions (College Algebra 38)',
        focusSummary:
          'Factoring denominators to isolate vertical asymptotes and reading infinite behavior from both sides.',
        watchStrategy:
          'Connects directly to infinite limits and vertical asymptotes in Calculus I Day 1.',
      },
      {
        id: 'vid-pa3-2',
        youtubeId: 'D-H9N-_Y77Y',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 40',
        title: 'Finding a Horizontal Asymptote of a Rational Function (College Algebra 40)',
        focusSummary:
          'Comparing numerator and denominator degrees (n < m, n = m, n > m) to determine exact horizontal end behavior.',
        watchStrategy:
          'Watch at 1.25x and verify why dividing by the highest power of x produces the leading-coefficient ratio.',
      },
      {
        id: 'vid-pa3-3',
        youtubeId: 'NVhaVk4wNu8',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 41',
        title: 'Finding an Oblique Asymptote of a Rational Function (College Algebra 41)',
        focusSummary:
          'Using polynomial long division whenever deg(P) = deg(Q) + 1 to extract the slant asymptote y = mx + b.',
        watchStrategy:
          'Notice how the remainder fraction vanishes as x → ±∞, leaving only the linear quotient.',
      },
      {
        id: 'vid-pa3-4',
        youtubeId: 'tyXWPcvSQvk',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 43',
        title: 'Finding Asymptotes and Holes of Rational Functions (College Algebra 43)',
        focusSummary:
          'Complete workflow separating canceled factors (removable holes) from surviving denominator roots (vertical asymptotes).',
        watchStrategy:
          'Always factor numerator AND denominator first before naming any asymptote.',
      },
      {
        id: 'vid-pa3-5',
        youtubeId: 'QSh1xcbYKZk',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 47',
        title: 'Inequalities with Rational Functions (College Algebra 47)',
        focusSummary:
          'Constructing clean number-line sign charts for N(x)/D(x) ≥ 0 without falling into the sign-flipping cross-multiplication pitfall.',
        watchStrategy:
          'Master this sign-chart method—it is identical to the First & Second Derivative Tests in Calculus I.',
      },
    ],
    externalResources: [
      {
        title: 'OpenStax Precalculus 2e — Section 3.7: Rational Functions (Full Theory)',
        provider: 'OpenStax Precalculus 2e',
        resourceKind: 'theory',
        url: 'https://openstax.org/books/precalculus-2e/pages/3-introduction-to-polynomial-and-rational-functions',
        description:
          'OpenStax reference covering arrow notation, removable discontinuities, and vertical/horizontal/slant asymptotes.',
      },
      {
        title: 'Paul’s Online Math Notes — Graphing Rational Functions Exercises',
        provider: "Paul's Online Math Notes",
        resourceKind: 'exercises',
        url: 'https://tutorial.math.lamar.edu/Problems/Alg/GraphRationalFcns.aspx',
        description:
          'Full practice set on intercepts, asymptotes, holes, and sketching rational curves with worked solutions.',
      },
      {
        title: 'Paul’s Online Math Notes — Complete College Algebra Exercise Bank',
        provider: "Paul's Online Math Notes",
        resourceKind: 'exercises',
        url: 'https://tutorial.math.lamar.edu/Problems/Alg/Alg.aspx',
        description:
          'Direct index to every algebra inequality, polynomial, and rational practice sheet.',
      },
    ],
  },

  'prealg-exp-log': {
    videos: [
      {
        id: 'vid-pa4-1',
        youtubeId: 'EsgHKmLSPVc',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 48',
        title: 'Composition of Functions (College Algebra 48)',
        focusSummary:
          'Evaluating (f ∘ g)(x) = f(g(x)) and decomposing nested expressions into inner and outer layers.',
        watchStrategy:
          'Essential training for recognizing inner/outer layers in the Calculus I Chain Rule and u-Substitution.',
      },
      {
        id: 'vid-pa4-2',
        youtubeId: 'fK7IPeeZoFE',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 51',
        title: 'Finding Inverse Functions (College Algebra 51)',
        focusSummary:
          'Algebraic inversion workflow (swap x and y, solve for y) plus domain/range reversal for rational and radical functions.',
        watchStrategy:
          'Practice the rational inverse example carefully—collecting y-terms and factoring out y is a classic exam skill.',
      },
      {
        id: 'vid-pa4-3',
        youtubeId: '2w14jBb0e9Q',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 52',
        title: 'Graphs of Exponential Functions (College Algebra 52)',
        focusSummary:
          'Growth vs. decay curves bˣ, horizontal asymptote y = 0, and why natural base e sits at the center of calculus.',
        watchStrategy:
          'Watch at 1.5x and memorize the anchor points (0, 1) and (1, b) plus the horizontal asymptote.',
      },
      {
        id: 'vid-pa4-4',
        youtubeId: 'u0uScdsBPfk',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 58',
        title: 'Properties of Logarithms (College Algebra 58)',
        focusSummary:
          'Product, quotient, and power laws of logarithms—turning multiplication and powers into simple addition and scaling.',
        watchStrategy:
          'Pause and verify you never split ln(a + b); log rules apply only to products, quotients, and powers.',
      },
      {
        id: 'vid-pa4-5',
        youtubeId: 'jNUyVClUQfc',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 63',
        title: 'Solving Logarithmic Equations with Exponentials (College Algebra 63)',
        focusSummary:
          'Condensing logs to one term, rewriting in exponential form, and catching extraneous roots outside the log domain.',
        watchStrategy:
          'Never skip the final domain check—any root making a log argument ≤ 0 must be crossed out.',
      },
      {
        id: 'vid-pa4-6',
        youtubeId: 'rDcLCA2W-UI',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 64',
        title: 'Solving Exponential Equations with Logarithms (College Algebra 64)',
        focusSummary:
          'Using ln on both sides to pull variables out of exponents and solve exact university-style exponential equations.',
        watchStrategy:
          'Practice leaving answers in exact logarithmic form (like ln 4 / 3) rather than rounded decimals.',
      },
    ],
    externalResources: [
      {
        title: 'OpenStax Precalculus 2e — Chapter 4: Exponential & Logarithmic Functions (Theory)',
        provider: 'OpenStax Precalculus 2e',
        resourceKind: 'theory',
        url: 'https://openstax.org/books/precalculus-2e/pages/4-introduction-to-exponential-and-logarithmic-functions',
        description:
          'Complete OpenStax theory on exponential growth/decay, logarithm properties, change of base, and models.',
      },
      {
        title: 'Paul’s Online Math Notes — Solving Exponential Equations Exercises',
        provider: "Paul's Online Math Notes",
        resourceKind: 'exercises',
        url: 'https://tutorial.math.lamar.edu/Problems/Alg/SolveExpEqns.aspx',
        description:
          'Graded practice problems with full worked solutions on common-base and logarithmic exponential equations.',
      },
      {
        title: 'Paul’s Online Math Notes — Solving Logarithm Equations Exercises',
        provider: "Paul's Online Math Notes",
        resourceKind: 'exercises',
        url: 'https://tutorial.math.lamar.edu/Problems/Alg/SolveLogEqns.aspx',
        description:
          'Extensive practice drills on condensing logarithms and checking for extraneous roots.',
      },
    ],
  },

  'prealg-trig-unit-circle': {
    videos: [
      {
        id: 'vid-pa5-1',
        youtubeId: 'EWd_FtOfyPc',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Trig 03',
        title: 'Introduction to Radians (Precalculus — Trigonometry 3)',
        focusSummary:
          'Geometric meaning of radian measure, why π = 180°, and thinking natively in fractions of π.',
        watchStrategy:
          'Internalize π/6 = 30°, π/4 = 45°, π/3 = 60°, π/2 = 90°—every calculus formula assumes radians.',
      },
      {
        id: 'vid-pa5-2',
        youtubeId: '__nefjOhVks',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Trig 06',
        title: 'Trigonometric Functions and the Unit Circle (Trigonometry 6)',
        focusSummary:
          'Building the entire unit circle from 30-60-90 and 45-45-90 triangles and defining all six trig functions from (x, y).',
        watchStrategy:
          'Sketch Quadrant I once alongside Professor Leonard—understanding the geometry beats memorizing 16 points blindly.',
      },
      {
        id: 'vid-pa5-3',
        youtubeId: 'GdRZfemxTFI',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Trig 07',
        title: 'How to Use the Unit Circle in Trigonometry (Trigonometry 7)',
        focusSummary:
          'Rapid exact evaluation of sin, cos, tan, sec, csc, cot at negative angles, large angles, and all four quadrants.',
        watchStrategy:
          'Pause before each evaluation and call out the quadrant sign and exact value in under 5 seconds.',
      },
      {
        id: 'vid-pa5-4',
        youtubeId: '3HHgZopzL_s',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Trig 11',
        title: 'The Graphs of Sine and Cosine (Trigonometry 11)',
        focusSummary:
          'Unwrapping the unit circle into periodic sine and cosine waves with amplitude, period 2π/|B|, and key quarter-points.',
        watchStrategy:
          'Watch at 1.25x and pay attention to how even/odd symmetry shows up visually at x = 0.',
      },
      {
        id: 'vid-pa5-5',
        youtubeId: '8eMEBrPYJ0I',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Trig 13',
        title: 'How to Graph Tangent and Cotangent (Trigonometry 13)',
        focusSummary:
          'Period π behavior and exact vertical asymptote locations of tan(x) and cot(x)—crucial for limits and arctan.',
        watchStrategy:
          'Note tan(x) → +∞ as x → (π/2)⁻ and −∞ as x → (−π/2)⁺; this directly determines arctan’s horizontal asymptotes.',
      },
    ],
    externalResources: [
      {
        title: 'OpenStax Precalculus 2e — Chapters 5 & 6: Unit Circle & Periodic Graphs (Theory)',
        provider: 'OpenStax Precalculus 2e',
        resourceKind: 'theory',
        url: 'https://openstax.org/books/precalculus-2e/pages/5-introduction-to-trigonometric-functions',
        description:
          'OpenStax theory on radian measure, unit circle coordinates, right-triangle trig, and wave transformations.',
      },
      {
        title: 'OpenStax Precalculus 2e — Chapter 6: Periodic Functions (Theory)',
        provider: 'OpenStax Precalculus 2e',
        resourceKind: 'theory',
        url: 'https://openstax.org/books/precalculus-2e/pages/6-introduction-to-periodic-functions',
        description:
          'Detailed graphing guide for sine, cosine, tangent, secant, cosecant, and inverse trigonometric curves.',
      },
      {
        title: 'Paul’s Online Math Notes — Trig Functions Evaluation Exercises',
        provider: "Paul's Online Math Notes",
        resourceKind: 'exercises',
        url: 'https://tutorial.math.lamar.edu/Problems/CalcI/TrigFcns.aspx',
        description:
          'Calculator-free exact trig evaluation drills tailored specifically for incoming Calculus I students.',
      },
    ],
  },

  'prealg-trig-identities-series': {
    videos: [
      {
        id: 'vid-pa6-1',
        youtubeId: 'ih01YszlraY',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Trig 17',
        title: 'Introduction to Inverse Trigonometric Functions (Trigonometry 17)',
        focusSummary:
          'Why sin, cos, and tan domains must be restricted and how arcsin, arccos, and arctan principal ranges work.',
        watchStrategy:
          'Memorize all three principal ranges cold—arctan’s (−π/2, π/2) range reappears constantly in Calc I & II.',
      },
      {
        id: 'vid-pa6-2',
        youtubeId: 'hBk7OnEYPcw',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Trig 22',
        title: 'How to Solve Trigonometric Equations (Trigonometry 22)',
        focusSummary:
          'Factoring trig quadratics, using Pythagorean swaps, and finding all solutions on [0, 2π) for multiple angles like 2x.',
        watchStrategy:
          'Watch carefully how Professor Leonard never divides by sin(x) or cos(x) so zero solutions are never lost.',
      },
      {
        id: 'vid-pa6-3',
        youtubeId: 'az_veh1FLbo',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Trig 24',
        title: 'How to Prove Trigonometric Identities (Trigonometry 24)',
        focusSummary:
          'Strategic identity manipulation: working one side, converting to sine/cosine, common denominators, and conjugates.',
        watchStrategy:
          'This algebraic fluency makes Calculus II trigonometric integrals dramatically faster.',
      },
      {
        id: 'vid-pa6-4',
        youtubeId: '9R5Nz1eYddM',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Trig 25',
        title: 'Introduction to Sum and Difference Formulas (Trigonometry 25)',
        focusSummary:
          'Deriving and applying sin(α ± β) and cos(α ± β)—the parent formulas behind double-angle and half-angle identities.',
        watchStrategy:
          'Notice the sign flip in cos(α + β) = cos α cos β − sin α sin β.',
      },
      {
        id: 'vid-pa6-5',
        youtubeId: 'Epa2mi8hzBA',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Trig 27',
        title: 'Proving the Double and Half Angle Formulas (Trigonometry 27)',
        focusSummary:
          'Proof of sin(2θ), cos(2θ), and the power-reducing formulas sin²θ = (1 − cos 2θ)/2 and cos²θ = (1 + cos 2θ)/2.',
        watchStrategy:
          'Highest-ROI trig video for Calculus II—power reduction is mandatory for integrating even powers of sine and cosine.',
      },
      {
        id: 'vid-pa6-6',
        youtubeId: 'Ipz9xXeoaRc',
        instructor: 'Professor Leonard',
        lectureCode: 'Precalculus Prep · Video 68',
        title: 'Introduction to Series and Summation Notation (College Algebra 68)',
        focusSummary:
          'Reading and expanding sigma notation Σ, index shifts, and connecting finite sums to infinite series.',
        watchStrategy:
          'Direct bridge into Calculus I Riemann Sums (Day 4) and Calculus II Infinite Series (Day 10).',
      },
    ],
    externalResources: [
      {
        title: 'OpenStax Precalculus 2e — Chapter 7: Trig Identities & Equations (Theory)',
        provider: 'OpenStax Precalculus 2e',
        resourceKind: 'theory',
        url: 'https://openstax.org/books/precalculus-2e/pages/7-introduction-to-trigonometric-identities-and-equations',
        description:
          'Complete OpenStax derivations of Pythagorean, sum/difference, double-angle, half-angle identities, and trig equations.',
      },
      {
        title: 'OpenStax Precalculus 2e — Chapter 11: Sequences & Series Foundations (Theory)',
        provider: 'OpenStax Precalculus 2e',
        resourceKind: 'theory',
        url: 'https://openstax.org/books/precalculus-2e/pages/11-introduction-to-sequences-probability-and-counting-theory',
        description:
          'Theory of arithmetic/geometric sequences, sigma notation, and finite/infinite geometric sums.',
      },
      {
        title: 'Paul’s Online Math Notes — Solving Trig Equations Exercises',
        provider: "Paul's Online Math Notes",
        resourceKind: 'exercises',
        url: 'https://tutorial.math.lamar.edu/Problems/CalcI/TrigEquations.aspx',
        description:
          'Practice problem set on solving trig equations on [0, 2π) and general intervals with full solutions.',
      },
    ],
  },

  'calc1-limits': {
    videos: [
      {
        id: 'vid-d1-1',
        youtubeId: '54_XRjHhZzI',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 1.1',
        title: 'An Introduction to Limits',
        focusSummary:
          'Builds intuitive left-hand and right-hand limit behavior, graphical discontinuities, and why limits ignore the point itself.',
        watchStrategy:
          'Watch at 1.5x speed during graphical warmups; slow to 1.0x for piecewise jump and infinite limit examples.',
      },
      {
        id: 'vid-d1-2',
        youtubeId: 'VSqOZNULRjQ',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 1.2',
        title: 'Properties of Limits & Techniques of Limit Computation',
        focusSummary:
          'Full algebraic mastery of 0/0 indeterminate forms: polynomial factoring, radical conjugates, common denominators, and Squeeze Theorem.',
        watchStrategy:
          'Pause the video right after Professor Leonard writes each limit on the board and attempt the algebraic simplification before pressing play.',
      },
      {
        id: 'vid-d1-3',
        youtubeId: 'OEE5-M4aY4k',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 1.4',
        title: 'Continuity of Functions & IVT',
        focusSummary:
          'The 3-part continuity test, removable vs. jump vs. infinite discontinuities, and proving roots with the Intermediate Value Theorem.',
        watchStrategy:
          'Focus closely on finding constants k that make piecewise functions continuous—a guaranteed university midterm question.',
      },
      {
        id: 'vid-d1-4',
        youtubeId: 'kfF40MiS7zA',
        instructor: '3Blue1Brown',
        lectureCode: 'Visual Companion · Ch. 7',
        title: 'Limits, L’Hôpital’s Rule, and Epsilon-Delta Definitions',
        focusSummary:
          'Visualizes the exact geometric dance between epsilon (ε) output bands and delta (δ) input neighborhoods.',
        watchStrategy:
          'Watch this 18-minute visual synthesis after Professor Leonard Lecture 1.2 to lock in ε-δ intuition permanently.',
      },
    ],
    externalResources: [
      {
        title: 'Paul’s Online Math Notes — Calculus I: Limits',
        provider: "Paul's Online Math Notes",
        url: 'https://tutorial.math.lamar.edu/Classes/CalcI/LimitsIntro.aspx',
        description:
          'Complete written notes, extra worked limit problems, and downloadable practice sheets with full solutions.',
      },
      {
        title: 'OpenStax Calculus Volume 1 — Chapter 2: Limits',
        provider: 'OpenStax Calculus',
        url: 'https://openstax.org/details/books/calculus-volume-1',
        description:
          'Peer-reviewed open university textbook covering formal ε-δ proofs, limit laws, and continuity exercises.',
      },
      {
        title: 'MIT 18.01SC Single Variable Calculus — Unit 1',
        provider: 'MIT OCW 18.01SC',
        url: 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/',
        description:
          'MIT problem sets, recitation videos, and exam archive for limits and introductory differentiation.',
      },
    ],
  },

  'calc1-derivatives': {
    videos: [
      {
        id: 'vid-d2-1',
        youtubeId: '962lLfW-8Jo',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 2.1',
        title: 'Introduction to the Derivative of a Function',
        focusSummary:
          'Derives f′(x) from the limit of the difference quotient and explains differentiability vs. continuity.',
        watchStrategy:
          'Work through at least two difference-quotient derivatives on paper (one polynomial, one rational/radical).',
      },
      {
        id: 'vid-d2-2',
        youtubeId: 'AvCQQ3X4Nuc',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 2.3',
        title: 'The Product and Quotient Rules for Derivatives',
        focusSummary:
          'Full proof and rapid execution drills for products, quotients, and algebraic factoring of derivatives.',
        watchStrategy:
          'Skip ahead at 1.75x once you solve two consecutive examples faster than the board.',
      },
      {
        id: 'vid-d2-3',
        youtubeId: '8dr1dZjfhmc',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 2.6',
        title: 'Discussion of the Chain Rule for Derivatives',
        focusSummary:
          'Professor Leonard’s signature deep dive into nested composite functions, trig chains, and multi-layer derivatives.',
        watchStrategy:
          'Do NOT skip this lecture—Chain Rule fluency determines your speed in both Calc I and Calc II u-substitution.',
      },
      {
        id: 'vid-d2-4',
        youtubeId: 'RUS4mKo9tBk',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 2.7',
        title: 'Implicit Differentiation',
        focusSummary:
          'Differentiating non-function curves x³ + y³ = 6xy, finding tangent lines, and computing second implicit derivatives.',
        watchStrategy:
          'Pay close attention to grouping dy/dx terms and substituting numerical coordinates early when asked for slope at a point.',
      },
      {
        id: 'vid-d2-5',
        youtubeId: 'YG15m2VwSjA',
        instructor: '3Blue1Brown',
        lectureCode: 'Visual Companion · Ch. 4',
        title: 'Visualizing the Chain Rule and Product Rule',
        focusSummary:
          'Geometric proof of why (fg)′ = f′g + fg′ (expanding rectangle area) and why compositions multiply local stretch factors.',
        watchStrategy:
          'Great 16-minute break between Lecture 2.3 and Lecture 2.6.',
      },
    ],
    externalResources: [
      {
        title: 'Paul’s Online Math Notes — Calculus I: Derivatives',
        provider: "Paul's Online Math Notes",
        url: 'https://tutorial.math.lamar.edu/Classes/CalcI/DerivativeIntro.aspx',
        description:
          'Comprehensive rules, chain rule drill sets, implicit differentiation, and logarithmic differentiation notes.',
      },
      {
        title: 'OpenStax Calculus Volume 1 — Chapter 3: Derivatives',
        provider: 'OpenStax Calculus',
        url: 'https://openstax.org/details/books/calculus-volume-1',
        description:
          'Full university chapter covering power, product, quotient, trig, inverse trig, exponential, and log derivatives.',
      },
    ],
  },

  'calc1-applications': {
    videos: [
      {
        id: 'vid-d3-1',
        youtubeId: '43Qt6wc44To',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 2.8',
        title: 'Related Rates',
        focusSummary:
          'Mastery blueprint for sliding ladders, inflating spheres, conical tanks, and shadow problems.',
        watchStrategy:
          'Write down the 4-step template (Known rates → Geometry equation → d/dt → Plug in snapshot) for every problem.',
      },
      {
        id: 'vid-d3-2',
        youtubeId: 'Mx39JbbzEAo',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 3.1',
        title: 'Increasing/Decreasing and Concavity of Functions',
        focusSummary:
          'Sign charts for f′(x) and f″(x), critical numbers, local extrema, and inflection point analysis.',
        watchStrategy:
          'Watch alongside our Curve Anatomy Lab to map sign-chart intervals straight to graph curvature.',
      },
      {
        id: 'vid-d3-3',
        youtubeId: 'SWZcq_biZLw',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 3.7',
        title: 'Optimization; Max/Min Application Problems',
        focusSummary:
          'Step-by-step constraint elimination, domain endpoints, and verifying maxima/minima in geometry and cost problems.',
        watchStrategy:
          'Always identify the Objective Function (what to max/min) and the Constraint Equation (fixed quantity) first.',
      },
      {
        id: 'vid-d3-4',
        youtubeId: 'Zd7wd24jeok',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 6.7',
        title: 'L’Hôpital’s Rule & Indeterminate Forms',
        focusSummary:
          'Covers all 7 indeterminate forms: 0/0, ∞/∞, 0·∞, ∞ − ∞, 0⁰, 1^∞, and ∞⁰ using algebraic rewrites and logarithms.',
        watchStrategy:
          'Focus especially on the last third covering exponential forms (1^∞ and 0⁰) via ln(L).',
      },
    ],
    externalResources: [
      {
        title: 'Paul’s Online Math Notes — Applications of Derivatives',
        provider: "Paul's Online Math Notes",
        url: 'https://tutorial.math.lamar.edu/Classes/CalcI/DerivAppsIntro.aspx',
        description:
          'Dozens of fully solved Related Rates, Optimization, MVT, and L’Hôpital’s Rule problems.',
      },
      {
        title: 'OpenStax Calculus Volume 1 — Chapter 4: Applications',
        provider: 'OpenStax Calculus',
        url: 'https://openstax.org/details/books/calculus-volume-1',
        description:
          'Complete textbook treatment of Extreme Value Theorem, MVT, curve sketching, and Newton’s Method.',
      },
    ],
  },

  'calc1-integrals': {
    videos: [
      {
        id: 'vid-d4-1',
        youtubeId: 'F0uuW-I6icY',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 4.3',
        title: 'Area Under a Curve, Limit Approach, Riemann Sums',
        focusSummary:
          'Translating area into sigma notation, Δx = (b − a)/n, and taking lim_{n→∞} to define the definite integral.',
        watchStrategy:
          'Focus on the geometric meaning of Σ f(xᵢ)Δx rather than memorizing lengthy sigma sum algebra.',
      },
      {
        id: 'vid-d4-2',
        youtubeId: 'xjtEfS0vY2o',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 4.5',
        title: 'The Fundamental Theorem of Calculus',
        focusSummary:
          'Connects accumulation functions (FTC Part I) and net area evaluation (FTC Part II) with full chain-rule examples.',
        watchStrategy:
          'Watch carefully how variable bounds like ∫_x^{x²} f(t) dt differentiate without ever computing an antiderivative.',
      },
      {
        id: 'vid-d4-3',
        youtubeId: 'aiBD9aI69C8',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 4.2',
        title: 'Integration by Substitution (u-Sub)',
        focusSummary:
          'Complete workshop on spotting u and du, adjusting constants, back-substituting leftover x terms, and changing bounds.',
        watchStrategy:
          'This is the single most-used skill in Calculus II—solve every board example alongside Professor Leonard.',
      },
      {
        id: 'vid-d4-4',
        youtubeId: 'rfG8ce4nNh0',
        instructor: '3Blue1Brown',
        lectureCode: 'Visual Companion · Ch. 8',
        title: 'Integration and the Fundamental Theorem of Calculus',
        focusSummary:
          'Crystal-clear visual narrative linking velocity curves, area accumulation, and why antiderivatives compute exact area.',
        watchStrategy:
          'Watch first if you want a 20-minute bird’s-eye intuition before Professor Leonard’s full proofs.',
      },
    ],
    externalResources: [
      {
        title: 'Paul’s Online Math Notes — Integrals & u-Substitution',
        provider: "Paul's Online Math Notes",
        url: 'https://tutorial.math.lamar.edu/Classes/CalcI/IntegralsIntro.aspx',
        description:
          'Indefinite integrals, FTC Parts I & II, definite u-substitution, and symmetry properties with practice sets.',
      },
      {
        title: 'OpenStax Calculus Volume 1 — Chapter 5: Integration',
        provider: 'OpenStax Calculus',
        url: 'https://openstax.org/details/books/calculus-volume-1',
        description:
          'Rigorous coverage of Riemann sums, Net Change Theorem, and substitution with worked engineering applications.',
      },
    ],
  },

  'calc1-volumes': {
    videos: [
      {
        id: 'vid-d5-1',
        youtubeId: 'c7wur9Lixb0',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 5.1',
        title: 'Finding Area Between Two Curves',
        focusSummary:
          'Setting up top-minus-bottom (dx) vs. right-minus-left (dy) integrals and finding intersection limits cleanly.',
        watchStrategy:
          'Always sketch the region first to see whether vertical or horizontal slices avoid splitting the integral.',
      },
      {
        id: 'vid-d5-2',
        youtubeId: 'GJOJl47l2_4',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 5.2',
        title: 'Volume of Solids By Disks and Washers Method',
        focusSummary:
          'Visualizing perpendicular slices, outer radius R(x) vs. inner radius r(x), and shifted axes like y = −2 or x = 4.',
        watchStrategy:
          'Pay special attention to Professor Leonard’s radius arrow diagrams for shifted axes of rotation.',
      },
      {
        id: 'vid-d5-3',
        youtubeId: 'BDmlottZVd4',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 5.3',
        title: 'Volume of Solids By Cylindrical Shells Method',
        focusSummary:
          'Parallel slicing with 2π∫(radius)(height) dx, and deciding instantly when Shells beats Washers.',
        watchStrategy:
          'Compare his Washer and Shell setups on the exact same region to lock in the perpendicular vs. parallel rule.',
      },
    ],
    externalResources: [
      {
        title: 'Paul’s Online Math Notes — Area & Volumes of Revolution',
        provider: "Paul's Online Math Notes",
        url: 'https://tutorial.math.lamar.edu/Classes/CalcI/AreaBetweenCurves.aspx',
        description:
          'Detailed 3D cross-section diagrams and worked examples for Rings/Washers and Cylindrical Shells.',
      },
      {
        title: 'OpenStax Calculus Volume 2 — Chapter 2: Applications of Integration',
        provider: 'OpenStax Calculus',
        url: 'https://openstax.org/details/books/calculus-volume-2',
        description:
          'Covers Disk/Washer, Shells, known cross-section volumes, work, and hydrostatic force.',
      },
    ],
  },

  'calc2-ibp-trig': {
    videos: [
      {
        id: 'vid-d6-1',
        youtubeId: 'EOwjiFpDY_s',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 7.1',
        title: 'Integration By Parts',
        focusSummary:
          'Complete mastery of ∫ u dv = uv − ∫ v du, LIATE selection, ∫ ln(x) dx, cyclic boomerang integrals, and the Tabular Method.',
        watchStrategy:
          'This is one of the highest-ROI lectures in all of Calculus II—watch the Tabular Method section at the end to save massive exam time.',
      },
      {
        id: 'vid-d6-2',
        youtubeId: 'pLrUBjiEo-w',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 7.2',
        title: 'Techniques For Trigonometric Integrals',
        focusSummary:
          'Systematic decision tree for sin^m(x) cos^n(x) and tan^m(x) sec^n(x), plus half-angle power reduction and ∫ sec³(x) dx.',
        watchStrategy:
          'Create a 2x2 cheat table (odd vs. even powers) while watching so every trig integral becomes mechanical.',
      },
      {
        id: 'vid-d6-3',
        youtubeId: 'ST3ORfqVYQw',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 6.5',
        title: 'Calculus of Inverse Trigonometric Functions',
        focusSummary:
          'Review of arcsin, arctan, and arcsec derivatives and integral patterns that appear throughout Calculus II.',
        watchStrategy:
          'Watch at 1.5x if you need a quick refresher on ∫ dx/(a² + x²) and ∫ dx/√(a² − x²).',
      },
    ],
    externalResources: [
      {
        title: 'Paul’s Online Math Notes — Integration by Parts & Trig Integrals',
        provider: "Paul's Online Math Notes",
        url: 'https://tutorial.math.lamar.edu/Classes/CalcII/IntegrationByParts.aspx',
        description:
          'Full worked solutions for standard IBP, cyclic IBP, and every trigonometric power combination.',
      },
      {
        title: 'OpenStax Calculus Volume 2 — Chapter 3.1–3.2',
        provider: 'OpenStax Calculus',
        url: 'https://openstax.org/details/books/calculus-volume-2',
        description:
          'Textbook derivations of reduction formulas, product-to-sum identities, and extra problem sets.',
      },
    ],
  },

  'calc2-trigsub-pf': {
    videos: [
      {
        id: 'vid-d7-1',
        youtubeId: 'q6JwTGpG8b4',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 7.3',
        title: 'Integrals By Trigonometric Substitution',
        focusSummary:
          'Eliminating √(a²−x²), √(a²+x²), and √(x²−a²), completing the square, and drawing reference right triangles to return to x.',
        watchStrategy:
          'Follow Professor Leonard’s triangle drawing step every single time—never rely on messy trig identities to back-substitute.',
      },
      {
        id: 'vid-d7-2',
        youtubeId: 'KJGp0pyPoVo',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 7.4',
        title: 'Integration By Partial Fractions',
        focusSummary:
          'Polynomial long division, distinct/repeated linear factors, irreducible quadratics, and rapid constant solving.',
        watchStrategy:
          'Pay close attention to when long division is mandatory (deg top ≥ deg bottom) and how repeated factors need k terms.',
      },
      {
        id: 'vid-d7-3',
        youtubeId: 'RTX-ik_8i-k',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Supplemental',
        title: 'Numerical Integration: Trapezoidal & Simpson’s Rule',
        focusSummary:
          'How to approximate non-elementary integrals accurately with error bounds when no algebraic technique applies.',
        watchStrategy:
          'Great concise supplement covering the 1-4-2-4-1 Simpson’s coefficients.',
      },
    ],
    externalResources: [
      {
        title: 'Paul’s Online Math Notes — Trig Substitution & Partial Fractions',
        provider: "Paul's Online Math Notes",
        url: 'https://tutorial.math.lamar.edu/Classes/CalcII/TrigSubstitutions.aspx',
        description:
          'Step-by-step reference tables, completing-the-square examples, and Heaviside partial fraction drills.',
      },
      {
        title: 'OpenStax Calculus Volume 2 — Chapter 3.3–3.4',
        provider: 'OpenStax Calculus',
        url: 'https://openstax.org/details/books/calculus-volume-2',
        description:
          'University textbook coverage of trig substitution and rational function decomposition.',
      },
    ],
  },

  'calc2-improper': {
    videos: [
      {
        id: 'vid-d8-1',
        youtubeId: 'g-M8FHslgdk',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 7.6',
        title: 'Improper Integrals (Type I, Type II & Comparison)',
        focusSummary:
          'Infinite limits, hidden interior vertical asymptotes, p-integrals, and proving convergence without an antiderivative.',
        watchStrategy:
          'Watch carefully how Professor Leonard always writes proper limit notation lim_{t→∞}—university graders deduct points for plugging in ∞ directly.',
      },
      {
        id: 'vid-d8-2',
        youtubeId: 'Zd7wd24jeok',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 6.7',
        title: 'Indeterminate Forms & L’Hôpital’s Rule (Refresher)',
        focusSummary:
          'Essential tool for evaluating the limit tail lim_{t→∞} t e^{-t} or lim_{a→0⁺} a ln(a) inside improper integrals.',
        watchStrategy:
          'Jump straight to the 0·∞ and ∞/∞ sections if your L’Hôpital algebra feels rusty.',
      },
    ],
    externalResources: [
      {
        title: 'Paul’s Online Math Notes — Improper Integrals & Comparison Test',
        provider: "Paul's Online Math Notes",
        url: 'https://tutorial.math.lamar.edu/Classes/CalcII/ImproperIntegrals.aspx',
        description:
          'Clear separation of Type I vs. Type II discontinuities plus comparison test strategy examples.',
      },
      {
        title: 'OpenStax Calculus Volume 2 — Chapter 3.7: Improper Integrals',
        provider: 'OpenStax Calculus',
        url: 'https://openstax.org/details/books/calculus-volume-2',
        description:
          'Includes Gabriel’s Horn (finite volume, infinite surface area) and Comparison Theorem proofs.',
      },
    ],
  },

  'calc2-odes': {
    videos: [
      {
        id: 'vid-d9-1',
        youtubeId: '5Yuw1jCBq-0',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 1 · Lecture 5.4',
        title: 'Finding the Length of a Curve on a Plane (Arc Length)',
        focusSummary:
          'Derives ds = √(1 + [f′(x)]²) dx and demonstrates the exact algebraic perfect-square trick professors put on exams.',
        watchStrategy:
          'Watch the algebra of rewriting (a − b)² + 4ab = (a + b)² under the square root—it unlocks almost every exam arc length integral.',
      },
      {
        id: 'vid-d9-2',
        youtubeId: 'WxVaVzxsDb0',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 8.1',
        title: 'Solving First Order Differential Equations By Separation of Variables',
        focusSummary:
          'Full guide to separable ODEs, initial value problems, exponential models, and handling integration constants properly.',
        watchStrategy:
          'Pay attention to solving for C immediately vs. after exponentiating both sides (y = Ce^{kx}).',
      },
    ],
    externalResources: [
      {
        title: 'Paul’s Online Math Notes — Arc Length, Surface Area & Separable ODEs',
        provider: "Paul's Online Math Notes",
        url: 'https://tutorial.math.lamar.edu/Classes/CalcII/ArcLength.aspx',
        description:
          'Worked arc length, surface area of revolution, and introductory differential equation practice sets.',
      },
      {
        title: 'OpenStax Calculus Volume 2 — Chapter 4: Differential Equations',
        provider: 'OpenStax Calculus',
        url: 'https://openstax.org/details/books/calculus-volume-2',
        description:
          'Covers direction fields, Euler’s Method, separable equations, and logistic population dynamics.',
      },
    ],
  },

  'calc2-series-1': {
    videos: [
      {
        id: 'vid-d10-1',
        youtubeId: 'FoNLQvf4NUs',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 9.1',
        title: 'Convergence and Divergence of Sequences',
        focusSummary:
          'Distinguishes sequences {aₙ} from series ∑ aₙ, covers Squeeze Theorem for sequences, monotonic bounded theorem, and factorial growth rates.',
        watchStrategy:
          'Watch at 1.5x to build rock-solid limit speed with n!, a^n, and n^p before entering infinite series.',
      },
      {
        id: 'vid-d10-2',
        youtubeId: 'DGcWMdW-72M',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 9.2',
        title: 'Series, Geometric Series, Harmonic Series, and Divergence Test',
        focusSummary:
          'Partial sums Sₙ, exact sums of geometric & telescoping series, why the Harmonic series diverges, and the one-way Divergence Test.',
        watchStrategy:
          'Crucial conceptual lecture: make sure you understand why lim aₙ = 0 does NOT prove convergence.',
      },
      {
        id: 'vid-d10-3',
        youtubeId: '8jPpNK4GIVs',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 9.3',
        title: 'Using the Integral Test for Series & p-Series',
        focusSummary:
          'Proves the p-Series test from the p-Integral, verifies the 3 hypotheses (positive, continuous, decreasing), and computes remainder bounds.',
        watchStrategy:
          'Memorize the Integral Test hypotheses—universities require you to state them explicitly on written proofs.',
      },
      {
        id: 'vid-d10-4',
        youtubeId: 'ei8WKMAHky0',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 9.4',
        title: 'Direct Comparison Test & Limit Comparison Test',
        focusSummary:
          'Choosing benchmark series bₙ by stripping lower-order terms and deciding when Limit Comparison beats Direct Comparison.',
        watchStrategy:
          'After watching, LCT will become your #1 fastest weapon for rational and radical series.',
      },
    ],
    externalResources: [
      {
        title: 'Paul’s Online Math Notes — Series & Convergence Tests',
        provider: "Paul's Online Math Notes",
        url: 'https://tutorial.math.lamar.edu/Classes/CalcII/SeriesIntro.aspx',
        description:
          'Comprehensive written guide to sequences, geometric/telescoping sums, Integral Test, and Comparison Tests.',
      },
      {
        title: 'OpenStax Calculus Volume 2 — Chapter 5.1–5.4',
        provider: 'OpenStax Calculus',
        url: 'https://openstax.org/details/books/calculus-volume-2',
        description:
          'Full formal proofs and dozens of graded convergence exercises with odd answers.',
      },
    ],
  },

  'calc2-series-2': {
    videos: [
      {
        id: 'vid-d11-1',
        youtubeId: 'BhYPrQHDrjk',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 9.5',
        title: 'Alternating Series Test & Finding Error of Sums',
        focusSummary:
          'Two conditions of AST, proving bₙ is decreasing, and computing how many terms N are needed for a target error tolerance |Rₙ| ≤ bₙ₊₁.',
        watchStrategy:
          'Pay close attention to the error-bound examples ("find N so error < 0.001")—they appear on almost every Calc II exam.',
      },
      {
        id: 'vid-d11-2',
        youtubeId: 'g4iZJOwMkjU',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 9.6',
        title: 'Absolute Convergence, Ratio Test and Root Test',
        focusSummary:
          'Absolute vs. conditional convergence, factorial simplification in the Ratio Test, Root Test for n-th powers, and full test selection strategy.',
        watchStrategy:
          'Practice the factorial algebra (2n+2)! / (2n)! = (2n+2)(2n+1) alongside Professor Leonard until automatic.',
      },
    ],
    externalResources: [
      {
        title: 'Paul’s Online Math Notes — Alternating, Ratio & Root Tests',
        provider: "Paul's Online Math Notes",
        url: 'https://tutorial.math.lamar.edu/Classes/CalcII/AlternatingSeries.aspx',
        description:
          'Includes Paul’s famous "Strategy for Series" decision guide plus absolute vs. conditional drills.',
      },
      {
        title: 'OpenStax Calculus Volume 2 — Chapter 5.5–5.6',
        provider: 'OpenStax Calculus',
        url: 'https://openstax.org/details/books/calculus-volume-2',
        description:
          'Rigorous proofs of the Alternating Series Estimation Theorem, Ratio Test, and Root Test.',
      },
    ],
  },

  'calc2-taylor': {
    videos: [
      {
        id: 'vid-d12-1',
        youtubeId: 'TGD-TP1c7i4',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 9.7',
        title: 'Power Series, Calculus of Power Series & Interval of Convergence',
        focusSummary:
          'Finding Radius R via Ratio Test, testing BOTH endpoints individually, and differentiating/integrating power series term by term.',
        watchStrategy:
          'Never skip endpoint checks! Watch Professor Leonard’s exact checklist for testing x = a − R and x = a + R.',
      },
      {
        id: 'vid-d12-2',
        youtubeId: '3VHol7eosLA',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 9.8',
        title: 'Representation of Functions by Taylor & Maclaurin Series',
        focusSummary:
          'Deriving the core Maclaurin expansions (eˣ, sin x, cos x, ln(1+x), arctan x) and building new series by substitution and algebra.',
        watchStrategy:
          'Memorize the Big 6 table during this lecture—then practice transforming them into new functions in seconds.',
      },
      {
        id: 'vid-d12-3',
        youtubeId: 'RbreIk02B3c',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 9.9',
        title: 'Approximation of Functions by Taylor Polynomials & Remainder',
        focusSummary:
          'Constructing Tₙ(x) centered at x = a and bounding approximation error rigorously using Taylor’s / Lagrange Remainder Formula.',
        watchStrategy:
          'Pair this directly with our Taylor Polynomial Lab to visually confirm the Lagrange error bound.',
      },
      {
        id: 'vid-d12-4',
        youtubeId: '3d6DsjIBzJ4',
        instructor: '3Blue1Brown',
        lectureCode: 'Visual Companion · Ch. 11',
        title: 'Taylor Series (Visual Geometric Proof)',
        focusSummary:
          'Stunning geometric explanation of why dividing by n! matches higher-order derivatives and why convergence can fail outside R.',
        watchStrategy:
          'Watch this 22-minute masterpiece right before or after Lecture 9.8.',
      },
    ],
    externalResources: [
      {
        title: 'Paul’s Online Math Notes — Power Series & Taylor Series',
        provider: "Paul's Online Math Notes",
        url: 'https://tutorial.math.lamar.edu/Classes/CalcII/PowerSeries.aspx',
        description:
          'Interval of convergence examples, term-by-term integration, and complete Taylor/Maclaurin tables.',
      },
      {
        title: 'OpenStax Calculus Volume 2 — Chapter 6: Power Series',
        provider: 'OpenStax Calculus',
        url: 'https://openstax.org/details/books/calculus-volume-2',
        description:
          'Full chapter on power series, Binomial series, Taylor’s Theorem, and physics approximations.',
      },
    ],
  },

  'calc2-polar': {
    videos: [
      {
        id: 'vid-d13-1',
        youtubeId: 'd4KADBFqpR0',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 10.2',
        title: 'Introduction to Parametric Equations',
        focusSummary:
          'Plotting orientation, eliminating parameter t, cycloids, and converting conic curves into parametric form.',
        watchStrategy:
          'Watch at 1.5x to master orientation arrows and trig parameterization (x = a cos t, y = b sin t).',
      },
      {
        id: 'vid-d13-2',
        youtubeId: '1H6HrfX_qCA',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 10.3',
        title: 'Calculus of Parametric Equations',
        focusSummary:
          'Horizontal/vertical tangents, the d²y/dx² chain-rule formula, parametric arc length, and surface area.',
        watchStrategy:
          'Focus carefully on the second derivative formula d²y/dx² = (d/dt [dy/dx]) / (dx/dt).',
      },
      {
        id: 'vid-d13-3',
        youtubeId: 'sWUyFQQ5QeI',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 10.4',
        title: 'Using Polar Coordinates and Polar Equations',
        focusSummary:
          'Converting (r, θ) ↔ (x, y), negative radii, and sketching cardioids, limaçons, roses, and lemniscates.',
        watchStrategy:
          'Use our Polar Lab simultaneously to see how r < 0 flips across the origin to trace inner loops.',
      },
      {
        id: 'vid-d13-4',
        youtubeId: 'Kh265EC11OI',
        instructor: 'Professor Leonard',
        lectureCode: 'Calc 2 · Lecture 10.5',
        title: 'Calculus of Polar Equations (Area, Tangents & Arc Length)',
        focusSummary:
          'Swept sector area ½∫ r² dθ, finding exact petal/loop intersection bounds, and area between two polar curves.',
        watchStrategy:
          'Watch his technique for checking intersection points at the pole (r = 0) separately from algebraic r₁(θ) = r₂(θ).',
      },
    ],
    externalResources: [
      {
        title: 'Paul’s Online Math Notes — Parametric & Polar Calculus',
        provider: "Paul's Online Math Notes",
        url: 'https://tutorial.math.lamar.edu/Classes/CalcII/ParametricEqn.aspx',
        description:
          'Worked problems for parametric tangents, polar curve sketching, and overlapping polar areas.',
      },
      {
        title: 'OpenStax Calculus Volume 2 — Chapter 7: Parametric & Polar',
        provider: 'OpenStax Calculus',
        url: 'https://openstax.org/details/books/calculus-volume-2',
        description:
          'Complete chapter including conic sections in polar coordinates and Kepler’s area law.',
      },
    ],
  },

  'calc2-synthesis': {
    videos: [
      {
        id: 'vid-d14-1',
        youtubeId: 'WUvTyaaNkzM',
        instructor: '3Blue1Brown',
        lectureCode: 'Synthesis · Ch. 1',
        title: 'The Essence of Calculus (Full Big-Picture Synthesis)',
        focusSummary:
          'Pulls together derivatives, integrals, infinite sums, and geometry into one unified mental framework before your exam.',
        watchStrategy:
          'Watch this 17-minute synthesis to step back and see how all 14 days connect into one coherent machine.',
      },
      {
        id: 'vid-d14-2',
        youtubeId: 'EOwjiFpDY_s',
        instructor: 'Professor Leonard',
        lectureCode: 'High-Yield Review · 7.1',
        title: 'Integration Strategy Benchmark: Integration By Parts',
        focusSummary:
          'Revisit core integration decision cues and rapid tabular execution before sitting a timed comprehensive exam.',
        watchStrategy:
          'Skim only the mixed-strategy examples and jump straight into our Interactive Triage Lab and Timed Gauntlet.',
      },
      {
        id: 'vid-d14-3',
        youtubeId: 'g4iZJOwMkjU',
        instructor: 'Professor Leonard',
        lectureCode: 'High-Yield Review · 9.6',
        title: 'Series Convergence Master Strategy (Ratio, Root & Comparison)',
        focusSummary:
          'Final review of selecting the fastest convergence test on sight without wasting exam minutes.',
        watchStrategy:
          'Jump to the mixed-series review section and call out the winning test within 5 seconds of each problem appearing.',
      },
    ],
    externalResources: [
      {
        title: 'Professor Leonard — Complete Calculus 1 Full-Length Playlist',
        provider: 'Professor Leonard Playlist',
        url: 'https://www.youtube.com/playlist?list=PLF797E961509B4EB5',
        description:
          'Direct link to all 32 full-length Calculus 1 whiteboard lectures on YouTube for any topic you want extra depth on.',
      },
      {
        title: 'Professor Leonard — Complete Calculus 2 Full-Length Playlist',
        provider: 'Professor Leonard Playlist',
        url: 'https://www.youtube.com/playlist?list=PLDesaqWTN6EQ2J4vgsN1HyBeRADEh4Cw-',
        description:
          'Direct link to all 27 full-length Calculus 2 lectures covering integration, ODEs, series, Taylor, and polar curves.',
      },
      {
        title: 'Paul’s Online Math Notes — Integration & Series Strategy Guides',
        provider: "Paul's Online Math Notes",
        url: 'https://tutorial.math.lamar.edu/Classes/CalcII/SeriesStrategy.aspx',
        description:
          'Gold-standard university exam flowcharts for mixed integration and series convergence.',
      },
    ],
  },
};

export const TOTAL_COURSE_VIDEOS = Object.values(MODULE_MEDIA_MAP).reduce(
  (sum, bundle) => sum + bundle.videos.length,
  0
);
