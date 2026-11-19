import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeRevolutionVolume,
  computeRiemannSum,
  computeSecantAndTangent,
  computeSeriesPartialSums,
  evaluatePIntegral,
  evaluateTaylor,
  samplePolarCurve,
  simpsonIntegrate,
  solveOdeEuler,
} from './calculusMath';

test('simpsonIntegrate computes exact definite integrals accurately', () => {
  // int_0^pi sin(x) dx = 2
  const resSin = simpsonIntegrate(Math.sin, 0, Math.PI, 100);
  assert.ok(Math.abs(resSin - 2) < 1e-6);

  // int_0^2 x^3 dx = 4
  const resCubic = simpsonIntegrate((x) => x ** 3, 0, 2, 100);
  assert.ok(Math.abs(resCubic - 4) < 1e-8);
});

test('computeSecantAndTangent converges to analytical derivative as h shrinks', () => {
  // f(x) = x^2 at x0 = 3 => f'(3) = 6
  const largeH = computeSecantAndTangent((x) => x * x, 3, 1);
  const smallH = computeSecantAndTangent((x) => x * x, 3, 0.001);
  assert.ok(Math.abs(largeH.secantSlope - 7) < 1e-9);
  assert.ok(Math.abs(largeH.tangentSlope - 6) < 1e-6);
  assert.ok(smallH.slopeError < largeH.slopeError);
  assert.ok(smallH.slopeError < 0.002);
});

test('computeRiemannSum produces tighter error with midpoint and higher n', () => {
  const fn = (x: number) => x * x;
  const left4 = computeRiemannSum(fn, 0, 2, 4, 'left');
  const mid4 = computeRiemannSum(fn, 0, 2, 4, 'midpoint');
  const left40 = computeRiemannSum(fn, 0, 2, 40, 'left');

  assert.ok(Math.abs(left4.exactIntegral - 8 / 3) < 1e-6);
  assert.ok(mid4.error < left4.error);
  assert.ok(left40.error < left4.error);
});

test('evaluateTaylor converges for sin(x) and respects radius for geometric series', () => {
  const sinDeg1 = evaluateTaylor('sin', 1, 1);
  const sinDeg7 = evaluateTaylor('sin', 1, 7);
  assert.ok(sinDeg7.error < sinDeg1.error);
  assert.ok(sinDeg7.error < 1e-4);

  const geo = evaluateTaylor('geometric', 0.5, 10);
  assert.equal(geo.radiusOfConvergence, '1');
  assert.ok(Math.abs(geo.exact - 2) < 1e-9);
  assert.ok(geo.error < 0.002);
});

test('computeSeriesPartialSums distinguishes convergent and divergent series', () => {
  const geomConv = computeSeriesPartialSums('geometric', 0.5, 30);
  assert.equal(geomConv.converges, true);
  assert.equal(geomConv.exactLimit, 2);
  assert.ok(Math.abs(geomConv.points[geomConv.points.length - 1].partialSum - 2) < 1e-5);

  const pDiv = computeSeriesPartialSums('pseries', 1, 20);
  assert.equal(pDiv.converges, false);
  assert.equal(pDiv.exactLimit, null);

  const altHarm = computeSeriesPartialSums('alternating_harmonic', 1, 40);
  assert.equal(altHarm.converges, true);
  assert.ok(altHarm.exactLimit !== null && Math.abs(altHarm.exactLimit - Math.LN2) < 1e-9);
});

test('evaluatePIntegral handles p > 1 convergence and p = 1 logarithmic divergence', () => {
  const conv = evaluatePIntegral(2, 100);
  assert.equal(conv.converges, true);
  assert.equal(conv.infiniteLimit, 1);
  assert.ok(Math.abs(conv.finiteArea - 0.99) < 1e-9);

  const harmonic = evaluatePIntegral(1, Math.E);
  assert.equal(harmonic.converges, false);
  assert.ok(Math.abs(harmonic.finiteArea - 1) < 1e-9);
});

test('solveOdeEuler error decreases when step size shrinks', () => {
  const coarse = solveOdeEuler('exponential', 0, 1, 2, 0.5);
  const fine = solveOdeEuler('exponential', 0, 1, 2, 0.05);
  assert.ok(fine.finalError < coarse.finalError);
  assert.ok(fine.finalError < 0.05);
});

test('samplePolarCurve computes cardioid full area = 3/2 pi a^2', () => {
  // cardioid uses a = 1.3 => full area on [0, 2pi] is (3/2) * pi * 1.3^2
  const res = samplePolarCurve('cardioid', Math.PI * 2, 180);
  const expected = 1.5 * Math.PI * 1.3 * 1.3;
  assert.ok(Math.abs(res.sectorArea - expected) < 1e-3);
});

test('computeRevolutionVolume matches cone volume for y = x on [0, 2]', () => {
  // Rotating y = x around x-axis on [0, 2]: V = pi * int_0^2 x^2 dx = 8pi/3
  const volDisk = computeRevolutionVolume('disk', (x) => x, () => 0, 0, 2);
  assert.ok(Math.abs(volDisk - (8 * Math.PI) / 3) < 1e-4);
});
