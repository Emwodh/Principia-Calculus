export type RiemannRule = 'left' | 'right' | 'midpoint' | 'trapezoid';

export interface Point2D {
  x: number;
  y: number;
}

export interface RiemannRect {
  x0: number;
  x1: number;
  sampleX: number;
  yLeft: number;
  yRight: number;
  height: number;
  area: number;
}

export interface RiemannResult {
  rects: RiemannRect[];
  approximation: number;
  exactIntegral: number;
  error: number;
}

export function factorial(n: number): number {
  if (n < 0) return NaN;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * High-precision composite Simpson's rule for reference definite integrals.
 */
export function simpsonIntegrate(
  fn: (x: number) => number,
  a: number,
  b: number,
  subintervals = 400
): number {
  const n = subintervals % 2 === 0 ? subintervals : subintervals + 1;
  const h = (b - a) / n;
  let sum = fn(a) + fn(b);
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += (i % 2 === 0 ? 2 : 4) * fn(x);
  }
  return (h / 3) * sum;
}

/**
 * Computes secant slope and central-difference derivative approximation.
 */
export function computeSecantAndTangent(
  fn: (x: number) => number,
  x0: number,
  h: number
): {
  fx0: number;
  fx0PlusH: number;
  secantSlope: number;
  tangentSlope: number;
  slopeError: number;
} {
  const safeH = Math.abs(h) < 1e-6 ? (h < 0 ? -1e-6 : 1e-6) : h;
  const fx0 = fn(x0);
  const fx0PlusH = fn(x0 + safeH);
  const secantSlope = (fx0PlusH - fx0) / safeH;
  const eps = 1e-5;
  const tangentSlope = (fn(x0 + eps) - fn(x0 - eps)) / (2 * eps);
  return {
    fx0,
    fx0PlusH,
    secantSlope,
    tangentSlope,
    slopeError: Math.abs(secantSlope - tangentSlope),
  };
}

/**
 * Computes Riemann sum rectangles and approximation error against Simpson's reference.
 */
export function computeRiemannSum(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number,
  rule: RiemannRule
): RiemannResult {
  const count = Math.max(1, Math.floor(n));
  const dx = (b - a) / count;
  const rects: RiemannRect[] = [];
  let approximation = 0;

  for (let i = 0; i < count; i++) {
    const x0 = a + i * dx;
    const x1 = x0 + dx;
    const yLeft = fn(x0);
    const yRight = fn(x1);
    let sampleX = x0;
    let height = yLeft;
    let area = 0;

    if (rule === 'left') {
      sampleX = x0;
      height = yLeft;
      area = height * dx;
    } else if (rule === 'right') {
      sampleX = x1;
      height = yRight;
      area = height * dx;
    } else if (rule === 'midpoint') {
      sampleX = (x0 + x1) / 2;
      height = fn(sampleX);
      area = height * dx;
    } else {
      sampleX = (x0 + x1) / 2;
      height = (yLeft + yRight) / 2;
      area = height * dx;
    }

    approximation += area;
    rects.push({ x0, x1, sampleX, yLeft, yRight, height, area });
  }

  const exactIntegral = simpsonIntegrate(fn, a, b, 400);
  return {
    rects,
    approximation,
    exactIntegral,
    error: Math.abs(approximation - exactIntegral),
  };
}

export type TaylorFunctionId = 'sin' | 'cos' | 'exp' | 'ln1px' | 'geometric';

/**
 * Evaluates exact function and its Maclaurin/Taylor polynomial T_n(x) centered at a = 0.
 */
export function evaluateTaylor(
  fnId: TaylorFunctionId,
  x: number,
  degree: number
): { exact: number; approx: number; error: number; radiusOfConvergence: string } {
  const nMax = Math.max(0, Math.min(15, Math.floor(degree)));
  let exact = 0;
  let approx = 0;
  let radiusOfConvergence = '∞';

  if (fnId === 'sin') {
    exact = Math.sin(x);
    for (let k = 0; 2 * k + 1 <= nMax; k++) {
      const p = 2 * k + 1;
      approx += (Math.pow(-1, k) * Math.pow(x, p)) / factorial(p);
    }
  } else if (fnId === 'cos') {
    exact = Math.cos(x);
    for (let k = 0; 2 * k <= nMax; k++) {
      const p = 2 * k;
      approx += (Math.pow(-1, k) * Math.pow(x, p)) / factorial(p);
    }
  } else if (fnId === 'exp') {
    exact = Math.exp(x);
    for (let k = 0; k <= nMax; k++) {
      approx += Math.pow(x, k) / factorial(k);
    }
  } else if (fnId === 'ln1px') {
    exact = x > -1 ? Math.log(1 + x) : NaN;
    radiusOfConvergence = '1';
    for (let k = 1; k <= nMax; k++) {
      approx += (Math.pow(-1, k - 1) * Math.pow(x, k)) / k;
    }
  } else {
    exact = Math.abs(1 - x) > 1e-6 ? 1 / (1 - x) : NaN;
    radiusOfConvergence = '1';
    for (let k = 0; k <= nMax; k++) {
      approx += Math.pow(x, k);
    }
  }

  return {
    exact,
    approx,
    error: Number.isFinite(exact) ? Math.abs(exact - approx) : NaN,
    radiusOfConvergence,
  };
}

export type SeriesPresetId = 'geometric' | 'pseries' | 'alternating_harmonic';

export interface SeriesTermPoint {
  n: number;
  term: number;
  partialSum: number;
}

/**
 * Generates term-by-term values and partial sums S_N for classic Calculus II series.
 */
export function computeSeriesPartialSums(
  preset: SeriesPresetId,
  param: number,
  maxN: number
): {
  points: SeriesTermPoint[];
  converges: boolean;
  exactLimit: number | null;
} {
  const count = Math.max(1, Math.min(80, Math.floor(maxN)));
  const points: SeriesTermPoint[] = [];
  let sum = 0;

  if (preset === 'geometric') {
    // Sum_{n=0}^{N-1} r^n
    for (let n = 0; n < count; n++) {
      const term = Math.pow(param, n);
      sum += term;
      points.push({ n, term, partialSum: sum });
    }
    const converges = Math.abs(param) < 1;
    return {
      points,
      converges,
      exactLimit: converges ? 1 / (1 - param) : null,
    };
  }

  if (preset === 'pseries') {
    // Sum_{n=1}^{N} 1 / n^p
    for (let n = 1; n <= count; n++) {
      const term = 1 / Math.pow(n, param);
      sum += term;
      points.push({ n, term, partialSum: sum });
    }
    const converges = param > 1;
    let exactLimit: number | null = null;
    if (Math.abs(param - 2) < 1e-6) exactLimit = (Math.PI * Math.PI) / 6;
    if (Math.abs(param - 4) < 1e-6) exactLimit = Math.pow(Math.PI, 4) / 90;
    return { points, converges, exactLimit };
  }

  // Alternating harmonic: Sum_{n=1}^{N} (-1)^{n-1} / n^p
  for (let n = 1; n <= count; n++) {
    const term = Math.pow(-1, n - 1) / Math.pow(n, param);
    sum += term;
    points.push({ n, term, partialSum: sum });
  }
  const converges = param > 0;
  const exactLimit = Math.abs(param - 1) < 1e-6 ? Math.LN2 : null;
  return { points, converges, exactLimit };
}

/**
 * Evaluates improper integral int_1^t (1 / x^p) dx and theoretical limit as t -> infinity.
 */
export function evaluatePIntegral(
  p: number,
  upperBound: number
): {
  finiteArea: number;
  converges: boolean;
  infiniteLimit: number | null;
} {
  const t = Math.max(1, upperBound);
  let finiteArea: number;
  if (Math.abs(p - 1) < 1e-6) {
    finiteArea = Math.log(t);
  } else {
    finiteArea = (Math.pow(t, 1 - p) - 1) / (1 - p);
  }
  const converges = p > 1;
  return {
    finiteArea,
    converges,
    infiniteLimit: converges ? 1 / (p - 1) : null,
  };
}

export type OdePresetId = 'exponential' | 'logistic' | 'damped_wave';

/**
 * Runs Euler's method for y' = f(x, y) starting at (x0, y0) with step h.
 */
export function solveOdeEuler(
  preset: OdePresetId,
  x0: number,
  y0: number,
  xEnd: number,
  stepSize: number
): {
  eulerPoints: Point2D[];
  exactPoints: Point2D[];
  finalError: number;
} {
  const h = Math.max(0.05, Math.min(1.5, stepSize));
  const slopeFn = (x: number, y: number): number => {
    if (preset === 'exponential') return 0.5 * y;
    if (preset === 'logistic') return 0.9 * y * (1 - y / 4);
    return Math.cos(x) - 0.5 * y;
  };

  const exactFn = (x: number): number => {
    const dx = x - x0;
    if (preset === 'exponential') {
      return y0 * Math.exp(0.5 * dx);
    }
    if (preset === 'logistic') {
      if (Math.abs(y0) < 1e-6) return 0;
      const ratio = (4 - y0) / y0;
      return 4 / (1 + ratio * Math.exp(-0.9 * dx));
    }
    // Exact solution to y' + 0.5y = cos(x):
    // y_p(x) = (0.5 cos x + sin x) / 1.25 = 0.4 cos x + 0.8 sin x
    const yp = (t: number) => 0.4 * Math.cos(t) + 0.8 * Math.sin(t);
    const c = (y0 - yp(x0)) * Math.exp(0.5 * x0);
    return yp(x) + c * Math.exp(-0.5 * x);
  };

  const eulerPoints: Point2D[] = [{ x: x0, y: y0 }];
  let cx = x0;
  let cy = y0;
  const maxSteps = 200;
  let steps = 0;

  while (cx < xEnd - 1e-6 && steps < maxSteps) {
    const nextStep = Math.min(h, xEnd - cx);
    const slope = slopeFn(cx, cy);
    cy = cy + nextStep * slope;
    cx = cx + nextStep;
    eulerPoints.push({ x: cx, y: cy });
    steps++;
  }

  const exactPoints: Point2D[] = [];
  const sampleCount = 80;
  for (let i = 0; i <= sampleCount; i++) {
    const x = x0 + ((xEnd - x0) * i) / sampleCount;
    exactPoints.push({ x, y: exactFn(x) });
  }

  const lastEuler = eulerPoints[eulerPoints.length - 1];
  const finalError = Math.abs(lastEuler.y - exactFn(lastEuler.x));

  return { eulerPoints, exactPoints, finalError };
}

export type PolarPresetId = 'rose3' | 'cardioid' | 'limacon' | 'lemniscate';

/**
 * Evaluates polar curve r(theta) and computes enclosed sector area 1/2 int_0^thetaMax r^2 dtheta.
 */
export function samplePolarCurve(
  preset: PolarPresetId,
  thetaMax: number,
  samples = 180
): {
  points: Point2D[];
  currentPoint: Point2D;
  currentR: number;
  sectorArea: number;
} {
  const rFn = (theta: number): number => {
    if (preset === 'rose3') return 2.2 * Math.cos(3 * theta);
    if (preset === 'cardioid') return 1.3 + 1.3 * Math.cos(theta);
    if (preset === 'limacon') return 1.0 + 1.8 * Math.cos(theta);
    // Lemniscate-like smooth figure-eight: r = 2.2 cos(2 theta)
    return 2.2 * Math.cos(2 * theta);
  };

  const points: Point2D[] = [];
  const count = Math.max(16, samples);
  for (let i = 0; i <= count; i++) {
    const t = (thetaMax * i) / count;
    const r = rFn(t);
    points.push({ x: r * Math.cos(t), y: r * Math.sin(t) });
  }

  const currentR = rFn(thetaMax);
  const currentPoint = {
    x: currentR * Math.cos(thetaMax),
    y: currentR * Math.sin(thetaMax),
  };

  const sectorArea =
    thetaMax > 0
      ? 0.5 * simpsonIntegrate((t) => Math.pow(rFn(t), 2), 0, thetaMax, 180)
      : 0;

  return { points, currentPoint, currentR, sectorArea };
}

/**
 * Computes volume of revolution via Disk/Washer or Cylindrical Shells on [a, b].
 */
export function computeRevolutionVolume(
  method: 'disk' | 'shell',
  outerRadiusFn: (x: number) => number,
  innerRadiusFn: (x: number) => number,
  a: number,
  b: number
): number {
  if (method === 'disk') {
    return (
      Math.PI *
      simpsonIntegrate(
        (x) => Math.pow(outerRadiusFn(x), 2) - Math.pow(innerRadiusFn(x), 2),
        a,
        b,
        240
      )
    );
  }
  return (
    2 *
    Math.PI *
    simpsonIntegrate(
      (x) => x * Math.max(0, outerRadiusFn(x) - innerRadiusFn(x)),
      a,
      b,
      240
    )
  );
}
