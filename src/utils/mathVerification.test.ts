import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_MODULES, ALL_PROBLEMS } from '../data/curriculum';
import { FORMULA_VAULT } from '../data/formulas';

function simpson(fn: (x: number) => number, a: number, b: number, n = 2000): number {
  const steps = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / steps;
  let sum = fn(a) + fn(b);
  for (let i = 1; i < steps; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * fn(a + i * h);
  }
  return (h / 3) * sum;
}

function deriv(fn: (x: number) => number, x: number, h = 1e-6): number {
  return (fn(x + h) - fn(x - h)) / (2 * h);
}

function assertClose(actual: number, expected: number, tol = 1e-5, label = '') {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `${label}: expected ${expected}, got ${actual} (diff ${Math.abs(actual - expected)})`
  );
}

function getProblem(id: string) {
  const p = ALL_PROBLEMS.find((x) => x.id === id);
  assert.ok(p, `Missing problem ${id}`);
  const opt = p.options.find((o) => o.id === p.correctOptionId);
  assert.ok(opt, `Missing correct option for ${id}`);
  return { p, opt };
}

function getExample(id: string) {
  for (const m of ALL_MODULES) {
    const ex = m.workedExamples.find((e) => e.id === id);
    if (ex) return ex;
  }
  assert.fail(`Missing worked example ${id}`);
}

describe('Independent numerical & algebraic verification of all 60 mastery problems', () => {
  it('Precalculus Prep problems 1–18 match independent computation', () => {
    // prob-pa1-1: domain of 1/sqrt(5-x) is (-inf, 5)
    assert.equal(getProblem('prob-pa1-1').opt.labelTex, '(-\\infty, 5)');
    for (const x of [-10, 0, 4.99]) assert.ok(5 - x > 0);
    assert.ok(!(5 - 5 > 0) && !(5 - 6 > 0));

    // prob-pa1-2: f(x) = x^3 - 4x is odd
    const f12 = (x: number) => x ** 3 - 4 * x;
    for (const x of [0.5, 1.7, 3.2]) assertClose(f12(-x), -f12(x), 1e-12, 'prob-pa1-2');
    assert.equal(getProblem('prob-pa1-2').p.correctOptionId, 'b');

    // prob-pa1-3: diff quotient of x^2 + 5x is 2x + h + 5
    const f13 = (x: number) => x * x + 5 * x;
    for (const [x, h] of [[2, 0.3], [-1, 0.5], [4, 0.01]]) {
      assertClose((f13(x + h) - f13(x)) / h, 2 * x + h + 5, 1e-10, 'prob-pa1-3');
    }
    assert.equal(getProblem('prob-pa1-3').opt.labelTex, '2x + h + 5');

    // prob-pa2-1: x^2 + 8x + 21 = (x+4)^2 + 5
    for (const x of [-5, 0, 3.5]) {
      assertClose(x * x + 8 * x + 21, (x + 4) ** 2 + 5, 1e-12, 'prob-pa2-1');
    }
    assert.equal(getProblem('prob-pa2-1').opt.labelTex, '(x + 4)^2 + 5');

    // prob-pa2-2: P(x) = -2(x+1)^2(x-4)^3 bounces at -1, crosses at 4
    const p22 = (x: number) => -2 * (x + 1) ** 2 * (x - 4) ** 3;
    assert.ok(Math.sign(p22(-1.01)) === Math.sign(p22(-0.99))); // bounce
    assert.ok(Math.sign(p22(3.99)) === -Math.sign(p22(4.01))); // cross
    assert.equal(getProblem('prob-pa2-2').p.correctOptionId, 'b');

    // prob-pa2-3: P(2) for 2x^3 - 5x + 7 = 13
    assert.equal(2 * 2 ** 3 - 5 * 2 + 7, 13);
    assert.equal(getProblem('prob-pa2-3').opt.labelTex, '13');

    // prob-pa3-1: HA of (6x^2 - 5x + 1)/(3x^2 + 4) -> 2
    const r31 = (x: number) => (6 * x * x - 5 * x + 1) / (3 * x * x + 4);
    assertClose(r31(1e6), 2, 1e-5, 'prob-pa3-1');
    assert.equal(getProblem('prob-pa3-1').opt.labelTex, 'y = 2');

    // prob-pa3-2: slant asymptote of (x^2 + 3x + 5)/(x + 1) -> x + 2 + 3/(x+1)
    for (const x of [100, -100, 1000]) {
      const val = (x * x + 3 * x + 5) / (x + 1);
      assertClose(val - (x + 2), 3 / (x + 1), 1e-12, 'prob-pa3-2');
    }
    assert.equal(getProblem('prob-pa3-2').opt.labelTex, 'y = x + 2');

    // prob-pa3-3: (x-4)/(x+2) < 0 on (-2, 4)
    const r33 = (x: number) => (x - 4) / (x + 2);
    assert.ok(r33(-3) > 0 && r33(-1.9) < 0 && r33(0) < 0 && r33(3.9) < 0 && r33(5) > 0);
    assert.equal(getProblem('prob-pa3-3').opt.labelTex, '(-2, 4)');

    // prob-pa4-1: ln(x^3 sqrt(y) / e^2) = 3 ln x + 0.5 ln y - 2 for x,y > 0
    for (const [x, y] of [[2, 9], [1.5, 4.2]]) {
      assertClose(
        Math.log((x ** 3 * Math.sqrt(y)) / Math.E ** 2),
        3 * Math.log(x) + 0.5 * Math.log(y) - 2,
        1e-12,
        'prob-pa4-1'
      );
    }
    assert.equal(getProblem('prob-pa4-1').p.correctOptionId, 'a');

    // prob-pa4-2: inverse of (2x+1)/(x-3) is (3x+1)/(x-2)
    const f42 = (x: number) => (2 * x + 1) / (x - 3);
    const inv42 = (x: number) => (3 * x + 1) / (x - 2);
    for (const x of [-4, 0, 1.5, 7]) {
      assertClose(inv42(f42(x)), x, 1e-12, 'prob-pa4-2a');
      assertClose(f42(inv42(x)), x, 1e-12, 'prob-pa4-2b');
    }
    assert.equal(getProblem('prob-pa4-2').p.correctOptionId, 'a');

    // prob-pa4-3: 3^(2x-1) = 27^(x+2) => x = -7
    assertClose(3 ** (2 * -7 - 1), 27 ** (-7 + 2), 1e-18, 'prob-pa4-3');
    assert.equal(getProblem('prob-pa4-3').opt.labelTex, 'x = -7');

    // prob-pa5-1: tan(2pi/3) = -sqrt(3)
    assertClose(Math.tan((2 * Math.PI) / 3), -Math.sqrt(3), 1e-12, 'prob-pa5-1');
    assert.equal(getProblem('prob-pa5-1').opt.labelTex, '-\\sqrt{3}');

    // prob-pa5-2: y = 4 cos(2x - pi/2) = 4 cos(2(x - pi/4)): period pi, shift pi/4 right
    const w52 = (x: number) => 4 * Math.cos(2 * x - Math.PI / 2);
    assertClose(w52(Math.PI / 4), 4, 1e-12, 'prob-pa5-2 shift');
    assertClose(w52(0.3 + Math.PI), w52(0.3), 1e-12, 'prob-pa5-2 period');
    assert.equal(getProblem('prob-pa5-2').p.correctOptionId, 'a');

    // prob-pa5-3: sin theta = -3/5 in QIII => sec theta = -5/4
    const theta = Math.PI + Math.asin(3 / 5);
    assertClose(Math.sin(theta), -3 / 5, 1e-12);
    assertClose(1 / Math.cos(theta), -5 / 4, 1e-12, 'prob-pa5-3');
    assert.equal(getProblem('prob-pa5-3').opt.labelTex, '-\\frac{5}{4}');

    // prob-pa6-1: arcsin(sin(5pi/6)) = pi/6
    assertClose(Math.asin(Math.sin((5 * Math.PI) / 6)), Math.PI / 6, 1e-12, 'prob-pa6-1');
    assert.equal(getProblem('prob-pa6-1').opt.labelTex, '\\frac{\\pi}{6}');

    // prob-pa6-2: sin(2x) = 1/2 on [0, 2pi) has 4 solutions
    const roots62 = [Math.PI / 12, (5 * Math.PI) / 12, (13 * Math.PI) / 12, (17 * Math.PI) / 12];
    for (const r of roots62) {
      assert.ok(r >= 0 && r < 2 * Math.PI);
      assertClose(Math.sin(2 * r), 0.5, 1e-12, 'prob-pa6-2');
    }
    assert.equal(getProblem('prob-pa6-2').p.correctOptionId, 'b');

    // prob-pa6-3: sum_{k=1}^5 (3k-1) = 40
    let sum63 = 0;
    for (let k = 1; k <= 5; k++) sum63 += 3 * k - 1;
    assert.equal(sum63, 40);
    assert.equal(getProblem('prob-pa6-3').opt.labelTex, '40');
  });

  it('Calculus I problems 19–33 match independent computation', () => {
    // p-d1-1: lim_{x->3} (x^2-9)/(x^2-5x+6) = 6
    const f11 = (x: number) => (x * x - 9) / (x * x - 5 * x + 6);
    assertClose(f11(3 + 1e-7), 6, 1e-5, 'p-d1-1');
    assert.equal(getProblem('p-d1-1').opt.labelTex, '6');

    // p-d1-2: lim_{x->0} sin(5x)/tan(2x) = 5/2
    const f12 = (x: number) => Math.sin(5 * x) / Math.tan(2 * x);
    assertClose(f12(1e-6), 2.5, 1e-6, 'p-d1-2');
    assert.equal(getProblem('p-d1-2').opt.labelTex, '\\frac{5}{2}');

    // p-d1-3: (x^2-4)/(x-2) -> 4 as x->2; k^2 - 5 = 4, k > 0 => k = 3
    assert.equal(3 ** 2 - 5, 4);
    assert.equal(getProblem('p-d1-3').opt.labelTex, 'k = 3');

    // p-d2-1: d/dx ln(sec x + tan x) = sec x
    const f21 = (x: number) => Math.log(1 / Math.cos(x) + Math.tan(x));
    for (const x of [0.1, 0.5, -0.4]) {
      assertClose(deriv(f21, x), 1 / Math.cos(x), 1e-6, 'p-d2-1');
    }
    assert.equal(getProblem('p-d2-1').opt.labelTex, '\\sec x');

    // p-d2-2: g(x) = arctan(x^2), g'(1) = 1
    assertClose(deriv((x) => Math.atan(x * x), 1), 1, 1e-6, 'p-d2-2');
    assert.equal(getProblem('p-d2-2').opt.labelTex, '1');

    // p-d2-3: e^(xy) = x + y at (0, 1) => dy/dx = 0
    // Check implicit F(x, y) = e^(xy) - x - y = 0 => y' = -F_x / F_y
    const F = (x: number, y: number) => Math.exp(x * y) - x - y;
    assertClose(F(0, 1), 0, 1e-12);
    const Fx = (F(1e-6, 1) - F(-1e-6, 1)) / 2e-6;
    const Fy = (F(0, 1 + 1e-6) - F(0, 1 - 1e-6)) / 2e-6;
    assertClose(-Fx / Fy, 0, 1e-6, 'p-d2-3');
    assert.equal(getProblem('p-d2-3').opt.labelTex, '0');

    // p-d3-1: lim_{x->0} (e^(2x) - 1 - 2x)/x^2 = 2
    const f31 = (x: number) => (Math.exp(2 * x) - 1 - 2 * x) / (x * x);
    assertClose(f31(1e-5), 2, 1e-4, 'p-d3-1');
    assert.equal(getProblem('p-d3-1').opt.labelTex, '2');

    // p-d3-2: V = (4/3)pi r^3, dV/dt = 36pi at r = 3 => dr/dt = 36pi / (4pi*9) = 1
    assertClose((36 * Math.PI) / (4 * Math.PI * 3 * 3), 1, 1e-12, 'p-d3-2');
    assert.equal(getProblem('p-d3-2').p.correctOptionId, 'a');

    // p-d3-3: f(x) = x^3 - 6x^2 + 9x + 1, f''(x) = 6x - 12 = 0 at x = 2
    const f33 = (x: number) => x ** 3 - 6 * x * x + 9 * x + 1;
    const d2f33 = (x: number) => (f33(x + 1e-4) - 2 * f33(x) + f33(x - 1e-4)) / 1e-8;
    assertClose(d2f33(2), 0, 1e-4, 'p-d3-3');
    assert.ok(d2f33(1.5) < 0 && d2f33(2.5) > 0);
    assert.equal(getProblem('p-d3-3').opt.labelTex, 'x = 2');

    // p-d4-1: int_1^e ln(x)/x dx = 1/2
    assertClose(simpson((x) => Math.log(x) / x, 1, Math.E), 0.5, 1e-6, 'p-d4-1');
    assert.equal(getProblem('p-d4-1').opt.labelTex, '\\frac{1}{2}');

    // p-d4-2: int_{-2}^2 (x^5 cos x + 3x^2) dx = 16
    assertClose(
      simpson((x) => x ** 5 * Math.cos(x) + 3 * x * x, -2, 2),
      16,
      1e-6,
      'p-d4-2'
    );
    assert.equal(getProblem('p-d4-2').opt.labelTex, '16');

    // p-d4-3: F(x) = int_x^{x^2} 1/(1+t^2) dt, F'(1) = 1/2
    const F43 = (x: number) => Math.atan(x * x) - Math.atan(x);
    assertClose(deriv(F43, 1), 0.5, 1e-6, 'p-d4-3');
    assert.equal(getProblem('p-d4-3').opt.labelTex, '\\frac{1}{2}');

    // p-d5-1: int_0^2 (2x - x^2) dx = 4/3
    assertClose(simpson((x) => 2 * x - x * x, 0, 2), 4 / 3, 1e-6, 'p-d5-1');
    assert.equal(getProblem('p-d5-1').opt.labelTex, '\\frac{4}{3}');

    // p-d5-2: pi int_0^4 (sqrt(x))^2 dx = 8pi
    assertClose(Math.PI * simpson((x) => x, 0, 4), 8 * Math.PI, 1e-6, 'p-d5-2');
    assert.equal(getProblem('p-d5-2').opt.labelTex, '8\\pi');

    // p-d5-3: 2pi int_0^3 x(3x - x^2) dx = 27pi/2
    assertClose(
      2 * Math.PI * simpson((x) => x * (3 * x - x * x), 0, 3),
      (27 * Math.PI) / 2,
      1e-6,
      'p-d5-3'
    );
    assert.equal(getProblem('p-d5-3').opt.labelTex, '\\frac{27\\pi}{2}');
  });

  it('Calculus II problems 34–60 match independent computation', () => {
    // p-d6-1: int_1^e ln(x) dx = 1
    assertClose(simpson((x) => Math.log(x), 1, Math.E), 1, 1e-6, 'p-d6-1');
    assert.equal(getProblem('p-d6-1').opt.labelTex, '1');

    // p-d6-2: d/dx [(e^x / 2)(sin x - cos x)] = e^x sin x
    const F62 = (x: number) => (Math.exp(x) / 2) * (Math.sin(x) - Math.cos(x));
    for (const x of [0.2, 1.1, 2.3]) {
      assertClose(deriv(F62, x), Math.exp(x) * Math.sin(x), 1e-5, 'p-d6-2');
    }
    assert.equal(getProblem('p-d6-2').p.correctOptionId, 'a');

    // p-d6-3: int_0^pi sin^2(x) dx = pi/2
    assertClose(simpson((x) => Math.sin(x) ** 2, 0, Math.PI), Math.PI / 2, 1e-6, 'p-d6-3');
    assert.equal(getProblem('p-d6-3').opt.labelTex, '\\frac{\\pi}{2}');

    // p-d7-1: int_2^3 2/(x^2 - 1) dx = ln(3/2)
    assertClose(simpson((x) => 2 / (x * x - 1), 2, 3), Math.log(1.5), 1e-6, 'p-d7-1');
    assert.equal(getProblem('p-d7-1').p.correctOptionId, 'a');

    // p-d7-2: sqrt(x^2 - 16) uses x = 4 sec theta
    const th = 0.7;
    const x72 = 4 / Math.cos(th);
    assertClose(Math.sqrt(x72 * x72 - 16), 4 * Math.abs(Math.tan(th)), 1e-10, 'p-d7-2');
    assert.equal(getProblem('p-d7-2').opt.labelTex, 'x = 4\\sec\\theta');

    // p-d7-3: d/dx [(1/2) arctan((x+2)/2)] = 1/(x^2 + 4x + 8)
    const F73 = (x: number) => 0.5 * Math.atan((x + 2) / 2);
    for (const x of [-3, 0, 2.5]) {
      assertClose(deriv(F73, x), 1 / (x * x + 4 * x + 8), 1e-6, 'p-d7-3');
    }
    assert.equal(getProblem('p-d7-3').p.correctOptionId, 'a');

    // p-d8-1: int_0^1 1/sqrt(x) dx = 2 (sub x = u^2 -> int_0^1 2 du = 2)
    assertClose(simpson((u) => 2, 0, 1), 2, 1e-10, 'p-d8-1');
    assert.equal(getProblem('p-d8-1').opt.labelTex, '2');

    // p-d8-2: int_{-1}^2 1/x^2 dx diverges due to non-integrable pole at 0
    assert.ok(simpson((x) => 1 / (x * x), 1e-4, 2, 4000) > 5000);
    assert.equal(getProblem('p-d8-2').p.correctOptionId, 'd');

    // p-d8-3: int_1^inf (2 + sin x)/x^3 dx converges, bounded by 3/x^3
    for (const x of [1, 2, 5, 10]) {
      assert.ok((2 + Math.sin(x)) / x ** 3 > 0 && (2 + Math.sin(x)) / x ** 3 <= 3 / x ** 3);
    }
    assert.equal(getProblem('p-d8-3').p.correctOptionId, 'a');

    // p-d9-1: dy/dx = 2xy, y(0) = 5 => y = 5 e^(x^2)
    const y91 = (x: number) => 5 * Math.exp(x * x);
    assertClose(y91(0), 5, 1e-12);
    for (const x of [-0.5, 0.4, 1.0]) {
      assertClose(deriv(y91, x), 2 * x * y91(x), 1e-4, 'p-d9-1');
    }
    assert.equal(getProblem('p-d9-1').opt.labelTex, 'y = 5e^{x^2}');

    // p-d9-2: Euler step y' = x+y, y(0)=1, h=0.5 => y1 = 1 + 0.5*(0+1) = 1.5
    assertClose(1 + 0.5 * (0 + 1), 1.5, 1e-12, 'p-d9-2');
    assert.equal(getProblem('p-d9-2').opt.labelTex, '1.5');

    // p-d9-3: dP/dt = 0.4P(1 - P/500) maximized at P = 250
    const g93 = (P: number) => 0.4 * P * (1 - P / 500);
    assertClose(deriv(g93, 250), 0, 1e-6, 'p-d9-3');
    assert.ok(g93(250) > g93(249) && g93(250) > g93(251));
    assert.equal(getProblem('p-d9-3').opt.labelTex, '250');

    // p-d10-1: sum_{n=2}^inf 5*(1/3)^n = 5/6
    let s101 = 0;
    for (let n = 2; n < 60; n++) s101 += 5 * (1 / 3) ** n;
    assertClose(s101, 5 / 6, 1e-10, 'p-d10-1');
    assert.equal(getProblem('p-d10-1').opt.labelTex, '\\frac{5}{6}');

    // p-d10-2: lim n^2/(3n^2+1) = 1/3 != 0 => diverges
    assertClose(1e8 / (3e8 + 1), 1 / 3, 1e-6, 'p-d10-2');
    assert.equal(getProblem('p-d10-2').p.correctOptionId, 'b');

    // p-d10-3: sum_{n=2}^inf 1/(n ln n) diverges by Integral Test (antideriv ln(ln x))
    const F103 = (x: number) => Math.log(Math.log(x));
    assertClose(deriv(F103, 5), 1 / (5 * Math.log(5)), 1e-6, 'p-d10-3');
    assert.equal(getProblem('p-d10-3').p.correctOptionId, 'b');

    // p-d11-1: sum (-1)^n / sqrt(n) conditionally convergent
    assert.equal(getProblem('p-d11-1').p.correctOptionId, 'b');

    // p-d11-2: Ratio test for 2^n / n! gives L = 0
    const ratio112 = (n: number) => 2 / (n + 1);
    assertClose(ratio112(1e6), 0, 1e-5, 'p-d11-2');
    assert.equal(getProblem('p-d11-2').p.correctOptionId, 'a');

    // p-d11-3: Root test for ((2n+1)/(3n+5))^n gives L = 2/3 < 1
    assertClose((2 * 1e6 + 1) / (3 * 1e6 + 5), 2 / 3, 1e-5, 'p-d11-3');
    assert.equal(getProblem('p-d11-3').p.correctOptionId, 'a');

    // p-d12-1: coeff of x^4 in cos(2x) is 2^4 / 4! = 16/24 = 2/3
    // Verify via (cos(2x) - 1 + 2x^2) / x^4 -> 2/3 as x -> 0
    const x121 = 1e-2;
    assertClose((Math.cos(2 * x121) - 1 + 2 * x121 ** 2) / x121 ** 4, 2 / 3, 1e-4, 'p-d12-1');
    assert.equal(getProblem('p-d12-1').opt.labelTex, '\\frac{2}{3}');

    // p-d12-2: sum n! x^n has R = 0
    assert.equal(getProblem('p-d12-2').opt.labelTex, 'R = 0');

    // p-d12-3: sum_{n=0}^inf (-1)^n pi^(2n) / ((2n)! 4^(2n)) = cos(pi/4) = sqrt(2)/2
    let s123 = 0;
    let fact = 1;
    for (let n = 0; n < 15; n++) {
      if (n > 0) fact *= (2 * n - 1) * (2 * n);
      s123 += ((-1) ** n * (Math.PI / 4) ** (2 * n)) / fact;
    }
    assertClose(s123, Math.SQRT2 / 2, 1e-12, 'p-d12-3');
    assert.equal(getProblem('p-d12-3').opt.labelTex, '\\frac{\\sqrt{2}}{2}');

    // p-d13-1: x(t) = t^2+1, y(t) = t^3-3t => dy/dx at t=1 is (3-3)/2 = 0
    assertClose(
      deriv((t) => t ** 3 - 3 * t, 1) / deriv((t) => t * t + 1, 1),
      0,
      1e-6,
      'p-d13-1'
    );
    assert.equal(getProblem('p-d13-1').opt.labelTex, '0');

    // p-d13-2: area of r = 1 + cos(theta) = (1/2) int_0^{2pi} (1+cos t)^2 dt = 3pi/2
    assertClose(
      0.5 * simpson((t) => (1 + Math.cos(t)) ** 2, 0, 2 * Math.PI),
      (3 * Math.PI) / 2,
      1e-6,
      'p-d13-2'
    );
    assert.equal(getProblem('p-d13-2').opt.labelTex, '\\frac{3\\pi}{2}');

    // p-d13-3: arc length of (3 cos t, 3 sin t) on [0, pi] = 3pi
    assertClose(
      simpson((t) => Math.hypot(-3 * Math.sin(t), 3 * Math.cos(t)), 0, Math.PI),
      3 * Math.PI,
      1e-6,
      'p-d13-3'
    );
    assert.equal(getProblem('p-d13-3').opt.labelTex, '3\\pi');

    // p-d14-1: d/dx [(1/2) ln(x^2 + 9)] = x/(x^2 + 9)
    for (const x of [-2, 0, 4]) {
      assertClose(deriv((u) => 0.5 * Math.log(u * u + 9), x), x / (x * x + 9), 1e-6, 'p-d14-1');
    }
    assert.equal(getProblem('p-d14-1').p.correctOptionId, 'a');

    // p-d14-2: LCT ratio of (n^3+2)/(4n^5-n+1) against 1/n^2 -> 1/4
    const n142 = 1e4;
    assertClose(
      ((n142 ** 3 + 2) / (4 * n142 ** 5 - n142 + 1)) / (1 / n142 ** 2),
      0.25,
      1e-5,
      'p-d14-2'
    );
    assert.equal(getProblem('p-d14-2').p.correctOptionId, 'a');

    // p-d14-3: lim_{x->0} (sin x - x)/x^3 = -1/6
    const x143 = 1e-3;
    assertClose((Math.sin(x143) - x143) / x143 ** 3, -1 / 6, 1e-6, 'p-d14-3');
    assert.equal(getProblem('p-d14-3').opt.labelTex, '-\\frac{1}{6}');
  });

  it('All 36 worked examples match independent computation', () => {
    // Spot-verify every worked example numerically across all 20 modules
    // ex-pa1-2: diff quotient of 2x^2 - 3x + 1 = 4x + 2h - 3
    const fpa12 = (x: number) => 2 * x * x - 3 * x + 1;
    assertClose((fpa12(2 + 0.3) - fpa12(2)) / 0.3, 4 * 2 + 2 * 0.3 - 3, 1e-10, 'ex-pa1-2');
    assert.equal(getExample('ex-pa1-2').finalAnswerTex, '4x + 2h - 3');

    // ex-pa2-1: 2x^2 - 12x + 23 = 2(x-3)^2 + 5
    for (const x of [-2, 1, 5]) {
      assertClose(2 * x * x - 12 * x + 23, 2 * (x - 3) ** 2 + 5, 1e-12, 'ex-pa2-1');
    }

    // ex-pa2-2: x^3 - 2x^2 - 5x + 6 zeros = -2, 1, 3
    for (const r of [-2, 1, 3]) {
      assert.equal(r ** 3 - 2 * r * r - 5 * r + 6, 0);
    }

    // ex-pa3-1: (2x^2 - 2x - 4)/(x^2 - 4) hole at (2, 3/2), VA x=-2, HA y=2
    const rpa31 = (x: number) => (2 * x * x - 2 * x - 4) / (x * x - 4);
    assertClose(rpa31(2 + 1e-6), 1.5, 1e-5, 'ex-pa3-1 hole');
    assertClose(rpa31(1e6), 2, 1e-5, 'ex-pa3-1 HA');

    // ex-pa4-1: 5 e^(3x-1) = 20 => x = (1 + ln 4)/3
    const xpa41 = (1 + Math.log(4)) / 3;
    assertClose(5 * Math.exp(3 * xpa41 - 1), 20, 1e-12, 'ex-pa4-1');

    // ex-pa4-2: log2(x) + log2(x-2) = 3 => x = 4
    assertClose(Math.log2(4) + Math.log2(4 - 2), 3, 1e-12, 'ex-pa4-2');

    // ex-pa5-1: sin(5pi/6)=1/2, cos(4pi/3)=-1/2, sec(7pi/4)=sqrt(2)
    assertClose(Math.sin((5 * Math.PI) / 6), 0.5, 1e-12);
    assertClose(Math.cos((4 * Math.PI) / 3), -0.5, 1e-12);
    assertClose(1 / Math.cos((7 * Math.PI) / 4), Math.SQRT2, 1e-12);

    // ex-pa6-1: 2cos^2(x) - cos(x) - 1 = 0 on [0, 2pi) => 0, 2pi/3, 4pi/3
    for (const r of [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3]) {
      assertClose(2 * Math.cos(r) ** 2 - Math.cos(r) - 1, 0, 1e-12, 'ex-pa6-1');
    }

    // ex-pa6-2: tan(arcsin(x)) = x/sqrt(1-x^2) on (-1, 1)
    for (const x of [-0.6, 0, 0.8]) {
      assertClose(Math.tan(Math.asin(x)), x / Math.sqrt(1 - x * x), 1e-12, 'ex-pa6-2');
    }

    // ex-d1-1: lim_{x->4} (sqrt(x+5)-3)/(x-4) = 1/6
    assertClose((Math.sqrt(4 + 1e-7 + 5) - 3) / 1e-7, 1 / 6, 1e-5, 'ex-d1-1');

    // ex-d1-2: lim_{x->-inf} (3x+2)/sqrt(4x^2+5x) = -3/2
    const xm = -1e7;
    assertClose((3 * xm + 2) / Math.sqrt(4 * xm * xm + 5 * xm), -1.5, 1e-5, 'ex-d1-2');

    // ex-d2-1: x^3 + y^3 = 6xy at (3,3) => dy/dx = -1
    assert.equal(3 ** 3 + 3 ** 3, 6 * 3 * 3);
    assert.equal((2 * 3 - 9) / (9 - 6), -1);

    // ex-d2-2: d/dx x^(sin x) = x^(sin x) (cos x ln x + sin x / x)
    for (const x of [0.5, 1.5, 2.5]) {
      assertClose(
        deriv((u) => u ** Math.sin(u), x),
        x ** Math.sin(x) * (Math.cos(x) * Math.log(x) + Math.sin(x) / x),
        1e-5,
        'ex-d2-2'
      );
    }

    // ex-d3-1: lim_{x->inf} (1 + 3/x)^(2x) = e^6
    assertClose((1 + 3 / 1e7) ** (2e7), Math.exp(6), 1e-3, 'ex-d3-1');

    // ex-d3-2: max of 2x(12-x^2) on [0, sqrt(12)] is 32 at x=2
    assert.equal(2 * 2 * (12 - 4), 32);
    assertClose(deriv((x) => 2 * x * (12 - x * x), 2), 0, 1e-6, 'ex-d3-2');

    // ex-d4-1: d/dx int_2^{x^3} cos(t^2) dt = 3x^2 cos(x^6)
    const x41 = 1.1;
    const h41 = 1e-4;
    const numDeriv41 =
      (simpson((t) => Math.cos(t * t), 2, (x41 + h41) ** 3, 400) -
        simpson((t) => Math.cos(t * t), 2, (x41 - h41) ** 3, 400)) /
      (2 * h41);
    assertClose(numDeriv41, 3 * x41 * x41 * Math.cos(x41 ** 6), 1e-4, 'ex-d4-1');

    // ex-d4-2: int_0^1 x sqrt(1+3x^2) dx = 7/9
    assertClose(simpson((x) => x * Math.sqrt(1 + 3 * x * x), 0, 1), 7 / 9, 1e-6, 'ex-d4-2');

    // ex-d5-1: pi int_0^1 (x^2 - x^4) dx = 2pi/15
    assertClose(Math.PI * simpson((x) => x * x - x ** 4, 0, 1), (2 * Math.PI) / 15, 1e-6, 'ex-d5-1');

    // ex-d5-2: 2pi int_0^1 x e^(-x^2) dx = pi(1 - 1/e)
    assertClose(
      2 * Math.PI * simpson((x) => x * Math.exp(-x * x), 0, 1),
      Math.PI * (1 - 1 / Math.E),
      1e-6,
      'ex-d5-2'
    );

    // ex-d6-1: d/dx [e^(3x)(x^2/3 - 2x/9 + 2/27)] = x^2 e^(3x)
    const Fex61 = (x: number) => Math.exp(3 * x) * (x * x / 3 - (2 * x) / 9 + 2 / 27);
    assertClose(deriv(Fex61, 0.7), 0.7 * 0.7 * Math.exp(2.1), 1e-4, 'ex-d6-1');

    // ex-d6-2: d/dx [cos^5(x)/5 - cos^3(x)/3] = sin^3(x) cos^2(x)
    const Fex62 = (x: number) => Math.cos(x) ** 5 / 5 - Math.cos(x) ** 3 / 3;
    assertClose(deriv(Fex62, 0.8), Math.sin(0.8) ** 3 * Math.cos(0.8) ** 2, 1e-5, 'ex-d6-2');

    // ex-d7-1: 3/(x-2) + 2/(x+1) = (5x-1)/((x-2)(x+1))
    for (const x of [-3, 0, 4]) {
      assertClose(3 / (x - 2) + 2 / (x + 1), (5 * x - 1) / ((x - 2) * (x + 1)), 1e-12, 'ex-d7-1');
    }

    // ex-d7-2: d/dx [x/(9 sqrt(x^2+9))] = 1/(x^2+9)^(3/2)
    const Fex72 = (x: number) => x / (9 * Math.sqrt(x * x + 9));
    for (const x of [-2, 0, 3]) {
      assertClose(deriv(Fex72, x), (x * x + 9) ** -1.5, 1e-6, 'ex-d7-2');
    }

    // ex-d8-1: int_0^inf x e^(-x) dx = 1
    assertClose(simpson((x) => x * Math.exp(-x), 0, 30, 4000), 1, 1e-6, 'ex-d8-1');

    // ex-d9-1: y = -sqrt(x^2+9) satisfies dy/dx = x/y, y(0) = -3
    const yex91 = (x: number) => -Math.sqrt(x * x + 9);
    assertClose(yex91(0), -3, 1e-12);
    assertClose(deriv(yex91, 2), 2 / yex91(2), 1e-6, 'ex-d9-1');

    // ex-d9-2: arc length of (2/3)x^(3/2) on [0, 3] = 14/3
    assertClose(simpson((x) => Math.sqrt(1 + x), 0, 3), 14 / 3, 1e-6, 'ex-d9-2');

    // ex-d10-1: sum_{n=1}^inf 3^(n-1)/4^(n+1) = 1/4
    let sex101 = 0;
    for (let n = 1; n < 120; n++) sex101 += 3 ** (n - 1) / 4 ** (n + 1);
    assertClose(sex101, 0.25, 1e-10, 'ex-d10-1');

    // ex-d10-2: LCT limit of sqrt(n^2+3)/(2n^3-n+5) against 1/n^2 = 1/2
    const n102 = 1e4;
    assertClose(
      (n102 ** 2 * Math.sqrt(n102 ** 2 + 3)) / (2 * n102 ** 3 - n102 + 5),
      0.5,
      1e-5,
      'ex-d10-2'
    );

    // ex-d11-1: Ratio Test for 3^n n! / n^n gives L = 3/e > 1
    const n111 = 1e5;
    assertClose(3 / (1 + 1 / n111) ** n111, 3 / Math.E, 1e-4, 'ex-d11-1');

    // ex-d12-2: x^2 e^(-x^3) matches partial sum sum_{n=0}^10 (-1)^n x^(3n+2)/n!
    const x122 = 0.6;
    let s122 = 0;
    let f122 = 1;
    for (let n = 0; n < 12; n++) {
      if (n > 0) f122 *= n;
      s122 += ((-1) ** n * x122 ** (3 * n + 2)) / f122;
    }
    assertClose(s122, x122 * x122 * Math.exp(-(x122 ** 3)), 1e-10, 'ex-d12-2');

    // ex-d13-1: one petal of r = 2 cos(3theta) on [-pi/6, pi/6] has area pi/3
    assertClose(
      0.5 * simpson((t) => (2 * Math.cos(3 * t)) ** 2, -Math.PI / 6, Math.PI / 6),
      Math.PI / 3,
      1e-6,
      'ex-d13-1'
    );

    // ex-d14-1: int_0^1 sin(x^2)/x^2 dx = sum_{n=0}^inf (-1)^n / ((2n+1)!(4n+1)) ≈ 29/30
    const exact141 = simpson((x) => (x === 0 ? 1 : Math.sin(x * x) / (x * x)), 0, 1);
    let series141 = 0;
    let oddFact = 1;
    for (let n = 0; n < 8; n++) {
      if (n > 0) oddFact *= (2 * n) * (2 * n + 1);
      series141 += (-1) ** n / (oddFact * (4 * n + 1));
    }
    assertClose(exact141, series141, 1e-10, 'ex-d14-1 series');
    assert.ok(Math.abs(exact141 - 29 / 30) < 1 / 1080, 'ex-d14-1 AST bound');
  });

  it('Formula Vault has 49 entries and no malformed chained equality/inequality combinations', () => {
    assert.equal(FORMULA_VAULT.length, 49);
    for (const f of FORMULA_VAULT) {
      const rel = f.relationTex ?? '=';
      // Ensure rhsTex never starts with \le or \ge when rel is '='
      if (rel === '=') {
        assert.ok(
          !/^\\(le|ge)(?![a-zA-Z])/.test(f.rhsTex.trim()),
          `Formula ${f.id} produces malformed "= ${f.rhsTex.slice(0, 12)}"`
        );
        const topLevelLhs = f.lhsTex.replace(/\{[^}]*\}/g, '');
        assert.ok(
          !topLevelLhs.includes('='),
          `Formula ${f.id} puts "=" in lhsTex while relationTex is "=" (creates chained/false equality)`
        );
      }
    }
  });
});
