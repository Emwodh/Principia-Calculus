import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import type { LabType } from '../types/course';
import {
  computeRevolutionVolume,
  computeRiemannSum,
  computeSecantAndTangent,
  computeSeriesPartialSums,
  evaluatePIntegral,
  evaluateTaylor,
  samplePolarCurve,
  solveOdeEuler,
  type OdePresetId,
  type PolarPresetId,
  type RiemannRule,
  type SeriesPresetId,
  type TaylorFunctionId,
} from '../utils/calculusMath';
import { MathTex } from './MathTex';

interface InteractiveLabProps {
  labType: LabType;
  title: string;
  objective: string;
}

const SVG_W = 640;
const SVG_H = 380;
const PAD = 46;

function mapX(x: number, xMin: number, xMax: number): number {
  return PAD + ((x - xMin) / (xMax - xMin)) * (SVG_W - 2 * PAD);
}

function mapY(y: number, yMin: number, yMax: number): number {
  return SVG_H - PAD - ((y - yMin) / (yMax - yMin)) * (SVG_H - 2 * PAD);
}

function buildPolylinePath(
  fn: (x: number) => number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  samples = 180
): string {
  const segments: string[] = [];
  let penDown = false;
  for (let i = 0; i <= samples; i++) {
    const x = xMin + ((xMax - xMin) * i) / samples;
    const y = fn(x);
    if (!Number.isFinite(y) || y < yMin - 6 || y > yMax + 6) {
      penDown = false;
      continue;
    }
    const sx = mapX(x, xMin, xMax).toFixed(1);
    const sy = mapY(y, yMin, yMax).toFixed(1);
    segments.push(`${penDown ? 'L' : 'M'}${sx},${sy}`);
    penDown = true;
  }
  return segments.join(' ');
}

function PlotClipDefs({ id }: { id: string }) {
  return (
    <defs>
      <clipPath id={id}>
        <rect
          x={PAD}
          y={PAD}
          width={SVG_W - 2 * PAD}
          height={SVG_H - 2 * PAD}
        />
      </clipPath>
    </defs>
  );
}

function CoordinateGrid({
  xMin,
  xMax,
  yMin,
  yMax,
  xStep = 1,
  yStep = 1,
  xLabel = 'x',
  yLabel = 'y',
}: {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xStep?: number;
  yStep?: number;
  xLabel?: string;
  yLabel?: string;
}) {
  const xTicks: number[] = [];
  for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax + 1e-6; x += xStep) {
    xTicks.push(Number(x.toFixed(2)));
  }
  const yTicks: number[] = [];
  for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax + 1e-6; y += yStep) {
    yTicks.push(Number(y.toFixed(2)));
  }

  const zeroX = xMin <= 0 && xMax >= 0 ? mapX(0, xMin, xMax) : PAD;
  const zeroY = yMin <= 0 && yMax >= 0 ? mapY(0, yMin, yMax) : SVG_H - PAD;

  return (
    <g>
      {xTicks.map((x) => {
        const px = mapX(x, xMin, xMax);
        return (
          <g key={`gx-${x}`}>
            <line
              x1={px}
              y1={PAD}
              x2={px}
              y2={SVG_H - PAD}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
            <text
              x={px}
              y={SVG_H - PAD + 16}
              textAnchor="middle"
              fontSize="11"
              fill="#64748B"
              className="font-mono-tabular"
            >
              {x}
            </text>
          </g>
        );
      })}
      {yTicks.map((y) => {
        const py = mapY(y, yMin, yMax);
        return (
          <g key={`gy-${y}`}>
            <line
              x1={PAD}
              y1={py}
              x2={SVG_W - PAD}
              y2={py}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
            <text
              x={PAD - 10}
              y={py + 4}
              textAnchor="end"
              fontSize="11"
              fill="#64748B"
              className="font-mono-tabular"
            >
              {y}
            </text>
          </g>
        );
      })}

      {/* Axes */}
      <line
        x1={PAD}
        y1={zeroY}
        x2={SVG_W - PAD}
        y2={zeroY}
        stroke="#475569"
        strokeWidth="1.5"
      />
      <line
        x1={zeroX}
        y1={PAD}
        x2={zeroX}
        y2={SVG_H - PAD}
        stroke="#475569"
        strokeWidth="1.5"
      />

      <text x={SVG_W - PAD + 12} y={zeroY + 4} fontSize="12" fill="#334155" fontWeight="600">
        {xLabel}
      </text>
      <text x={zeroX} y={PAD - 14} textAnchor="middle" fontSize="12" fill="#334155" fontWeight="600">
        {yLabel}
      </text>
    </g>
  );
}

/* ============================================================================
 * 1. Limit & Epsilon-Delta Lab (Day 1)
 * ========================================================================== */
function LimitLab() {
  const [xVal, setXVal] = useState(1.2);
  const [epsilon, setEpsilon] = useState(0.5);
  const [playing, setPlaying] = useState(false);

  // f(x) = (x^2 - 4)/(x - 2) = x + 2 for x != 2, with hole at (2, 4)
  const limitL = 4;
  const targetA = 2;
  const delta = epsilon; // since |(x+2) - 4| = |x - 2|
  const fx = Math.abs(xVal - targetA) < 1e-4 ? NaN : xVal + 2;
  const withinBand = Number.isFinite(fx) && Math.abs(fx - limitL) < epsilon;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setXVal((prev) => {
        const diff = targetA - prev;
        if (Math.abs(diff) < 0.03) {
          setPlaying(false);
          return 1.98;
        }
        return Number((prev + diff * 0.14).toFixed(3));
      });
    }, 80);
    return () => window.clearInterval(id);
  }, [playing]);

  const xMin = 0;
  const xMax = 4;
  const yMin = 1;
  const yMax = 7;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Epsilon-delta limit graph for f(x) = (x^2 - 4)/(x - 2)"
          data-testid="lab-svg"
        >
          <CoordinateGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />

          {/* Epsilon horizontal tolerance band */}
          <rect
            x={PAD}
            y={mapY(limitL + epsilon, yMin, yMax)}
            width={SVG_W - 2 * PAD}
            height={mapY(limitL - epsilon, yMin, yMax) - mapY(limitL + epsilon, yMin, yMax)}
            fill="#DBEAFE"
            opacity="0.55"
          />

          {/* Delta vertical window */}
          <rect
            x={mapX(Math.max(xMin, targetA - delta), xMin, xMax)}
            y={PAD}
            width={
              mapX(Math.min(xMax, targetA + delta), xMin, xMax) -
              mapX(Math.max(xMin, targetA - delta), xMin, xMax)
            }
            height={SVG_H - 2 * PAD}
            fill="#FEF3C7"
            opacity="0.55"
          />

          {/* Curve y = x + 2 */}
          <line
            x1={mapX(0, xMin, xMax)}
            y1={mapY(2, yMin, yMax)}
            x2={mapX(4, xMin, xMax)}
            y2={mapY(6, yMin, yMax)}
            stroke="#1D4ED8"
            strokeWidth="2.75"
          />

          {/* Dotted guides to limit L = 4 */}
          <line
            x1={PAD}
            y1={mapY(limitL, yMin, yMax)}
            x2={mapX(targetA, xMin, xMax)}
            y2={mapY(limitL, yMin, yMax)}
            stroke="#64748B"
            strokeDasharray="4 4"
          />
          <line
            x1={mapX(targetA, xMin, xMax)}
            y1={mapY(limitL, yMin, yMax)}
            x2={mapX(targetA, xMin, xMax)}
            y2={SVG_H - PAD}
            stroke="#64748B"
            strokeDasharray="4 4"
          />

          {/* Removable discontinuity hole at (2, 4) */}
          <circle
            cx={mapX(targetA, xMin, xMax)}
            cy={mapY(limitL, yMin, yMax)}
            r="6"
            fill="#FFFFFF"
            stroke="#1D4ED8"
            strokeWidth="2.5"
          />

          {/* Active test point (x, f(x)) */}
          {Number.isFinite(fx) && (
            <g>
              <line
                x1={mapX(xVal, xMin, xMax)}
                y1={SVG_H - PAD}
                x2={mapX(xVal, xMin, xMax)}
                y2={mapY(fx, yMin, yMax)}
                stroke={withinBand ? '#059669' : '#D97706'}
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />
              <circle
                cx={mapX(xVal, xMin, xMax)}
                cy={mapY(fx, yMin, yMax)}
                r="6.5"
                fill={withinBand ? '#059669' : '#D97706'}
              />
            </g>
          )}
        </svg>
      </div>

      <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-5">
        <div>
          <div className="text-xs font-medium text-[#64748B]">Active Function</div>
          <MathTex tex="f(x) = \frac{x^2 - 4}{x - 2}, \quad \lim_{x \to 2} f(x) = 4" display />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <label htmlFor="limit-x-slider" className="text-[#334155]">
                Test point x
              </label>
              <span className="font-mono-tabular text-[#0F172A]">{xVal.toFixed(3)}</span>
            </div>
            <input
              id="limit-x-slider"
              type="range"
              min="0.2"
              max="3.8"
              step="0.02"
              value={xVal}
              onChange={(e) => {
                setPlaying(false);
                setXVal(Number(e.target.value));
              }}
              className="calc-slider"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <label htmlFor="limit-eps-slider" className="text-[#334155]">
                Tolerance band ε
              </label>
              <span className="font-mono-tabular text-[#1D4ED8]">±{epsilon.toFixed(2)}</span>
            </div>
            <input
              id="limit-eps-slider"
              type="range"
              min="0.1"
              max="1.2"
              step="0.05"
              value={epsilon}
              onChange={(e) => setEpsilon(Number(e.target.value))}
              className="calc-slider"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs font-mono-tabular">
          <div className="flex justify-between">
            <span className="text-[#64748B]">f(x) output</span>
            <span className="font-semibold text-[#0F172A]">
              {Number.isFinite(fx) ? fx.toFixed(3) : 'Undefined (0/0 hole)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Required δ window</span>
            <span className="font-semibold text-[#0F172A]">δ = {delta.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Status</span>
            <span
              className={`font-sans font-semibold ${
                !Number.isFinite(fx)
                  ? 'text-[#DC2626]'
                  : withinBand
                    ? 'text-[#059669]'
                    : 'text-[#D97706]'
              }`}
            >
              {!Number.isFinite(fx)
                ? 'At hole x = 2 (excluded)'
                : withinBand
                  ? 'Inside ε-δ guarantee'
                  : 'Outside δ window'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              if (Math.abs(xVal - 2) < 0.08) setXVal(0.8);
              setPlaying((p) => !p);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg cursor-pointer"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{playing ? 'Pause Approach' : 'Animate x → 2'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setXVal(1.2);
              setEpsilon(0.5);
            }}
            aria-label="Reset Limit Lab"
            className="p-2 text-[#475569] hover:text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 2. Secant-to-Tangent & Curve Anatomy Lab (Days 2 & 3)
 * ========================================================================== */
function DerivativeLab({ showSecondDerivative }: { showSecondDerivative: boolean }) {
  const [x0, setX0] = useState(1.0);
  const [h, setH] = useState(1.2);
  const [showFPrime, setShowFPrime] = useState(showSecondDerivative);
  const [showFDoublePrime, setShowFDoublePrime] = useState(showSecondDerivative);
  const [playing, setPlaying] = useState(false);

  // f(x) = 0.25 x^3 - 1.5 x + 1.5 => f'(x) = 0.75 x^2 - 1.5, f''(x) = 1.5 x
  const f = (x: number) => 0.25 * x ** 3 - 1.5 * x + 1.5;
  const fp = (x: number) => 0.75 * x ** 2 - 1.5;
  const fpp = (x: number) => 1.5 * x;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      if (showSecondDerivative) {
        setX0((prev) => (prev >= 2.6 ? -2.6 : Number((prev + 0.08).toFixed(2))));
      } else {
        setH((prev) => {
          if (prev <= 0.04) {
            setPlaying(false);
            return 0.02;
          }
          return Number((prev * 0.86).toFixed(3));
        });
      }
    }, 80);
    return () => window.clearInterval(id);
  }, [playing, showSecondDerivative]);

  const metrics = useMemo(() => computeSecantAndTangent(f, x0, h), [x0, h]);
  const xMin = -3;
  const xMax = 3;
  const yMin = -3;
  const yMax = 5;

  const tangentLine = (x: number) => metrics.fx0 + metrics.tangentSlope * (x - x0);
  const secantLine = (x: number) => metrics.fx0 + metrics.secantSlope * (x - x0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Interactive derivative and curve anatomy graph"
          data-testid="lab-svg"
        >
          <PlotClipDefs id="clip-derivative" />
          <CoordinateGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />

          <g clipPath="url(#clip-derivative)">
            {/* Optional f'(x) and f''(x) overlays */}
            {showFPrime && (
              <path
                d={buildPolylinePath(fp, xMin, xMax, yMin, yMax)}
                fill="none"
                stroke="#059669"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            )}
            {showFDoublePrime && (
              <path
                d={buildPolylinePath(fpp, xMin, xMax, yMin, yMax)}
                fill="none"
                stroke="#DC2626"
                strokeWidth="1.75"
                strokeDasharray="2 4"
              />
            )}

            {/* Main curve f(x) */}
            <path
              d={buildPolylinePath(f, xMin, xMax, yMin, yMax)}
              fill="none"
              stroke="#1D4ED8"
              strokeWidth="2.75"
            />

            {/* Tangent line */}
            <line
              x1={mapX(x0 - 1.4, xMin, xMax)}
              y1={mapY(tangentLine(x0 - 1.4), yMin, yMax)}
              x2={mapX(x0 + 1.4, xMin, xMax)}
              y2={mapY(tangentLine(x0 + 1.4), yMin, yMax)}
              stroke="#0F172A"
              strokeWidth="2"
            />

            {/* Secant line (Day 2 focus) */}
            {!showSecondDerivative && (
              <>
                <line
                  x1={mapX(x0 - 0.5, xMin, xMax)}
                  y1={mapY(secantLine(x0 - 0.5), yMin, yMax)}
                  x2={mapX(x0 + h + 0.5, xMin, xMax)}
                  y2={mapY(secantLine(x0 + h + 0.5), yMin, yMax)}
                  stroke="#D97706"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />
                <circle
                  cx={mapX(x0 + h, xMin, xMax)}
                  cy={mapY(metrics.fx0PlusH, yMin, yMax)}
                  r="5.5"
                  fill="#D97706"
                />
              </>
            )}

            {/* Active point (x0, f(x0)) */}
            <circle
              cx={mapX(x0, xMin, xMax)}
              cy={mapY(metrics.fx0, yMin, yMax)}
              r="6"
              fill="#1D4ED8"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          </g>
        </svg>

        <div className="mt-2 px-2 flex flex-wrap items-center gap-4 text-xs text-[#475569]">
          <span className="font-semibold text-[#1D4ED8]">— f(x)</span>
          <span className="font-semibold text-[#0F172A]">— Tangent line</span>
          {!showSecondDerivative && (
            <span className="font-semibold text-[#D97706]">- - Secant line</span>
          )}
          {showFPrime && <span className="font-semibold text-[#059669]">- - f′(x)</span>}
          {showFDoublePrime && <span className="font-semibold text-[#DC2626]">··· f″(x)</span>}
        </div>
      </div>

      <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-5">
        <div>
          <div className="text-xs font-medium text-[#64748B]">Cubic Model</div>
          <MathTex tex="f(x) = \tfrac{1}{4}x^3 - \tfrac{3}{2}x + \tfrac{3}{2}" display />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <label htmlFor="der-x0-slider" className="text-[#334155]">
                Base point x₀
              </label>
              <span className="font-mono-tabular text-[#0F172A]">{x0.toFixed(2)}</span>
            </div>
            <input
              id="der-x0-slider"
              type="range"
              min="-2.4"
              max="2.4"
              step="0.05"
              value={x0}
              onChange={(e) => {
                setPlaying(false);
                setX0(Number(e.target.value));
              }}
              className="calc-slider"
            />
          </div>

          {!showSecondDerivative && (
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <label htmlFor="der-h-slider" className="text-[#334155]">
                  Secant step h
                </label>
                <span className="font-mono-tabular text-[#D97706]">{h.toFixed(3)}</span>
              </div>
              <input
                id="der-h-slider"
                type="range"
                min="0.02"
                max="1.8"
                step="0.02"
                value={h}
                onChange={(e) => {
                  setPlaying(false);
                  setH(Number(e.target.value));
                }}
                className="calc-slider"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowFPrime((v) => !v)}
              aria-pressed={showFPrime}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
                showFPrime
                  ? 'bg-[#ECFDF5] border-[#059669] text-[#065F46]'
                  : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#475569]'
              }`}
            >
              Overlay f′(x)
            </button>
            <button
              type="button"
              onClick={() => setShowFDoublePrime((v) => !v)}
              aria-pressed={showFDoublePrime}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
                showFDoublePrime
                  ? 'bg-[#FEF2F2] border-[#DC2626] text-[#991B1B]'
                  : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#475569]'
              }`}
            >
              Overlay f″(x)
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs font-mono-tabular">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Exact tangent f′(x₀)</span>
            <span className="font-semibold text-[#0F172A]">
              {metrics.tangentSlope.toFixed(3)}
            </span>
          </div>
          {!showSecondDerivative ? (
            <>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Secant slope (Δy/h)</span>
                <span className="font-semibold text-[#D97706]">
                  {metrics.secantSlope.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Approximation error</span>
                <span className="font-semibold text-[#059669]">
                  {metrics.slopeError.toFixed(4)}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Curvature f″(x₀)</span>
                <span className="font-semibold text-[#0F172A]">{fpp(x0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Concavity</span>
                <span className="font-sans font-semibold text-[#1D4ED8]">
                  {Math.abs(fpp(x0)) < 0.08
                    ? 'Inflection point (x = 0)'
                    : fpp(x0) > 0
                      ? 'Concave Up (f″ > 0)'
                      : 'Concave Down (f″ < 0)'}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (!showSecondDerivative && h < 0.06) setH(1.5);
              setPlaying((p) => !p);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg cursor-pointer"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>
              {playing
                ? 'Pause'
                : showSecondDerivative
                  ? 'Sweep x₀ Across Curve'
                  : 'Shrink h → 0'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setX0(1.0);
              setH(1.2);
            }}
            aria-label="Reset Derivative Lab"
            className="p-2 text-[#475569] hover:text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 3. Riemann Sum & FTC Convergence Lab (Day 4 & Day 6)
 * ========================================================================== */
function RiemannLab({ ibpFocus }: { ibpFocus?: boolean }) {
  const [n, setN] = useState(8);
  const [rule, setRule] = useState<RiemannRule>('midpoint');
  const [preset, setPreset] = useState<'poly' | 'ibp_xexp'>(ibpFocus ? 'ibp_xexp' : 'poly');

  const fn =
    preset === 'poly'
      ? (x: number) => 0.35 * x * x + 0.6
      : (x: number) => x * Math.exp(-0.45 * x) + 0.2;

  const a = 0;
  const b = 3;
  const xMin = -0.3;
  const xMax = 3.4;
  const yMin = 0;
  const yMax = 4.2;

  const result = useMemo(() => computeRiemannSum(fn, a, b, n, rule), [n, rule, preset]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Interactive Riemann sum visualization"
          data-testid="lab-svg"
        >
          <CoordinateGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} xStep={0.5} yStep={1} />

          {/* Riemann Rectangles or Trapezoids */}
          {result.rects.map((r, idx) => {
            const xLeft = mapX(r.x0, xMin, xMax);
            const xRight = mapX(r.x1, xMin, xMax);
            const yBase = mapY(0, yMin, yMax);
            if (rule === 'trapezoid') {
              const pts = `${xLeft},${yBase} ${xLeft},${mapY(r.yLeft, yMin, yMax)} ${xRight},${mapY(r.yRight, yMin, yMax)} ${xRight},${yBase}`;
              return (
                <polygon
                  key={idx}
                  points={pts}
                  fill="#93C5FD"
                  fillOpacity="0.45"
                  stroke="#1D4ED8"
                  strokeWidth="1"
                />
              );
            }
            const yTop = mapY(r.height, yMin, yMax);
            return (
              <rect
                key={idx}
                x={xLeft}
                y={yTop}
                width={Math.max(1, xRight - xLeft)}
                height={Math.max(0, yBase - yTop)}
                fill="#93C5FD"
                fillOpacity="0.45"
                stroke="#1D4ED8"
                strokeWidth="1"
              />
            );
          })}

          {/* Curve f(x) */}
          <path
            d={buildPolylinePath(fn, 0, 3.2, yMin, yMax)}
            fill="none"
            stroke="#0F172A"
            strokeWidth="2.5"
          />
        </svg>
      </div>

      <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-5">
        <div className="space-y-2">
          <div className="text-xs font-medium text-[#64748B]">Integrand on [0, 3]</div>
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#F1F5F9] rounded-lg">
            <button
              type="button"
              onClick={() => setPreset('poly')}
              className={`py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                preset === 'poly' ? 'bg-white text-[#0F172A] shadow-xs font-semibold' : 'text-[#475569]'
              }`}
            >
              0.35x² + 0.6
            </button>
            <button
              type="button"
              onClick={() => setPreset('ibp_xexp')}
              className={`py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                preset === 'ibp_xexp'
                  ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                  : 'text-[#475569]'
              }`}
            >
              x·e^(−0.45x) + 0.2
            </button>
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-[#334155] mb-1.5">Sampling Rule</div>
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#F1F5F9] rounded-lg">
            {(['left', 'right', 'midpoint', 'trapezoid'] as RiemannRule[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRule(r)}
                className={`py-1.5 text-xs font-medium rounded-md capitalize cursor-pointer ${
                  rule === r ? 'bg-white text-[#0F172A] shadow-xs font-semibold' : 'text-[#475569]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <label htmlFor="riemann-n-slider" className="text-[#334155]">
              Subintervals n
            </label>
            <span className="font-mono-tabular text-[#1D4ED8]">{n} slices</span>
          </div>
          <input
            id="riemann-n-slider"
            type="range"
            min="2"
            max="60"
            step="1"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="calc-slider"
          />
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs font-mono-tabular">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Riemann Sum</span>
            <span className="font-semibold text-[#1D4ED8]">
              {result.approximation.toFixed(5)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Exact Definite Integral</span>
            <span className="font-semibold text-[#0F172A]">
              {result.exactIntegral.toFixed(5)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Absolute Error |Δ|</span>
            <span className="font-semibold text-[#059669]">
              {result.error.toFixed(5)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 4. Volume of Revolution Cross-Section Lab (Day 5)
 * ========================================================================== */
function VolumeLab() {
  const [method, setMethod] = useState<'disk' | 'shell'>('disk');
  const [sliceX, setSliceX] = useState(1.2);

  // Region between y = sqrt(x) and y = 0.5 x on [0, 2] (re-scaled nicely: y = sqrt(x) and y = 0.5x intersect at x = 0 and x = 4; we show [0, 4])
  const outerFn = (x: number) => Math.sqrt(Math.max(0, x));
  const innerFn = (x: number) => 0.5 * x;

  const totalVolume = useMemo(
    () => computeRevolutionVolume(method, outerFn, innerFn, 0, 4),
    [method]
  );

  const R = outerFn(sliceX);
  const r = innerFn(sliceX);
  const crossArea =
    method === 'disk'
      ? Math.PI * (R * R - r * r)
      : 2 * Math.PI * sliceX * Math.max(0, R - r);

  const xMin = -0.3;
  const xMax = 4.4;
  const yMin = -2.4;
  const yMax = 2.6;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Volume of revolution cross-section visualizer"
          data-testid="lab-svg"
        >
          <CoordinateGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />

          {/* Mirrored reflection below x-axis for washer visual */}
          {method === 'disk' && (
            <>
              <path
                d={buildPolylinePath((x) => -outerFn(x), 0, 4, yMin, yMax)}
                fill="none"
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d={buildPolylinePath((x) => -innerFn(x), 0, 4, yMin, yMax)}
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* Highlighted Washer Slice Ellipse */}
              <ellipse
                cx={mapX(sliceX, xMin, xMax)}
                cy={mapY(0, yMin, yMax)}
                rx="11"
                ry={Math.abs(mapY(R, yMin, yMax) - mapY(0, yMin, yMax))}
                fill="#93C5FD"
                fillOpacity="0.45"
                stroke="#1D4ED8"
                strokeWidth="2"
              />
              <ellipse
                cx={mapX(sliceX, xMin, xMax)}
                cy={mapY(0, yMin, yMax)}
                rx="5"
                ry={Math.abs(mapY(r, yMin, yMax) - mapY(0, yMin, yMax))}
                fill="#FFFFFF"
                stroke="#D97706"
                strokeWidth="1.5"
              />
            </>
          )}

          {/* Cylindrical shell vertical strip */}
          {method === 'shell' && (
            <rect
              x={mapX(sliceX - 0.08, xMin, xMax)}
              y={mapY(R, yMin, yMax)}
              width={mapX(sliceX + 0.08, xMin, xMax) - mapX(sliceX - 0.08, xMin, xMax)}
              height={Math.max(1, mapY(r, yMin, yMax) - mapY(R, yMin, yMax))}
              fill="#60A5FA"
              fillOpacity="0.65"
              stroke="#1D4ED8"
              strokeWidth="2"
            />
          )}

          {/* Primary curves y = sqrt(x) and y = 0.5x */}
          <path
            d={buildPolylinePath(outerFn, 0, 4, yMin, yMax)}
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="2.75"
          />
          <path
            d={buildPolylinePath(innerFn, 0, 4, yMin, yMax)}
            fill="none"
            stroke="#D97706"
            strokeWidth="2.5"
          />
        </svg>
      </div>

      <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-5">
        <div className="space-y-2">
          <div className="text-xs font-medium text-[#64748B]">Slicing Geometry</div>
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#F1F5F9] rounded-lg">
            <button
              type="button"
              onClick={() => setMethod('disk')}
              className={`py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                method === 'disk' ? 'bg-white text-[#0F172A] shadow-xs font-semibold' : 'text-[#475569]'
              }`}
            >
              Washer (x-axis)
            </button>
            <button
              type="button"
              onClick={() => setMethod('shell')}
              className={`py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                method === 'shell' ? 'bg-white text-[#0F172A] shadow-xs font-semibold' : 'text-[#475569]'
              }`}
            >
              Shell (y-axis)
            </button>
          </div>
        </div>

        <MathTex
          tex={
            method === 'disk'
              ? 'V = \\pi\\int_0^4 \\left((\\sqrt{x})^2 - (\\tfrac{x}{2})^2\\right)dx'
              : 'V = 2\\pi\\int_0^4 x\\left(\\sqrt{x} - \\tfrac{x}{2}\\right)dx'
          }
          display
        />

        <div>
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <label htmlFor="vol-slice-slider" className="text-[#334155]">
              Slice Position xᵢ
            </label>
            <span className="font-mono-tabular text-[#1D4ED8]">{sliceX.toFixed(2)}</span>
          </div>
          <input
            id="vol-slice-slider"
            type="range"
            min="0.15"
            max="3.85"
            step="0.05"
            value={sliceX}
            onChange={(e) => setSliceX(Number(e.target.value))}
            className="calc-slider"
          />
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs font-mono-tabular">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Upper curve √xᵢ</span>
            <span className="font-semibold text-[#1D4ED8]">{R.toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Lower curve 0.5xᵢ</span>
            <span className="font-semibold text-[#D97706]">{r.toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Slice Area A(xᵢ)</span>
            <span className="font-semibold text-[#0F172A]">{crossArea.toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Total Volume V</span>
            <span className="font-semibold text-[#059669]">
              {totalVolume.toFixed(3)} ({(totalVolume / Math.PI).toFixed(2)}π)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 5. Trig Substitution Reference Triangle Studio (Day 7)
 * ========================================================================== */
function TrigSubLab() {
  const [kind, setKind] = useState<'sin' | 'tan' | 'sec'>('sin');
  const [a, setA] = useState(3);
  const [thetaDeg, setThetaDeg] = useState(38);

  const theta = (thetaDeg * Math.PI) / 180;
  const xVal =
    kind === 'sin'
      ? a * Math.sin(theta)
      : kind === 'tan'
        ? a * Math.tan(theta)
        : a / Math.cos(theta);

  const config =
    kind === 'sin'
      ? {
          radicalTex: `\\sqrt{${a}^2 - x^2}`,
          subTex: `x = ${a}\\sin\\theta,\\; dx = ${a}\\cos\\theta\\,d\\theta`,
          opp: 'x',
          adj: `√(${a}² − x²)`,
          hyp: `${a}`,
          sinVal: `x / ${a}`,
          cosVal: `√(${a}² − x²) / ${a}`,
        }
      : kind === 'tan'
        ? {
            radicalTex: `\\sqrt{${a}^2 + x^2}`,
            subTex: `x = ${a}\\tan\\theta,\\; dx = ${a}\\sec^2\\theta\\,d\\theta`,
            opp: 'x',
            adj: `${a}`,
            hyp: `√(${a}² + x²)`,
            sinVal: `x / √(${a}² + x²)`,
            cosVal: `${a} / √(${a}² + x²)`,
          }
        : {
            radicalTex: `\\sqrt{x^2 - ${a}^2}`,
            subTex: `x = ${a}\\sec\\theta,\\; dx = ${a}\\sec\\theta\\tan\\theta\\,d\\theta`,
            opp: `√(x² − ${a}²)`,
            adj: `${a}`,
            hyp: 'x',
            sinVal: `√(x² − ${a}²) / x`,
            cosVal: `${a} / x`,
          };

  const baseW = 290;
  const triH = Math.min(220, Math.max(85, baseW * Math.tan(Math.min(theta, 1.15)) * 0.72));
  const x0 = 155;
  const y0 = 300;
  const x1 = x0 + baseW;
  const yTop = y0 - triH;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Trigonometric substitution reference right triangle"
          data-testid="lab-svg"
        >
          {/* Triangle */}
          <polygon
            points={`${x0},${y0} ${x1},${y0} ${x1},${yTop}`}
            fill="#EFF6FF"
            stroke="#1D4ED8"
            strokeWidth="2.75"
            strokeLinejoin="round"
          />
          {/* Right angle marker */}
          <polyline
            points={`${x1 - 18},${y0} ${x1 - 18},${y0 - 18} ${x1},${y0 - 18}`}
            fill="none"
            stroke="#475569"
            strokeWidth="1.5"
          />
          {/* Theta arc */}
          <path
            d={`M ${x0 + 48},${y0} A 48 48 0 0 0 ${x0 + 48 * Math.cos(Math.atan2(triH, baseW))},${y0 - 48 * Math.sin(Math.atan2(triH, baseW))}`}
            fill="none"
            stroke="#D97706"
            strokeWidth="2"
          />
          <text x={x0 + 62} y={y0 - 10} fontSize="14" fontWeight="600" fill="#B45309">
            θ = {thetaDeg}°
          </text>

          {/* Side Labels */}
          <text
            x={(x0 + x1) / 2}
            y={y0 + 28}
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fill="#0F172A"
            className="font-mono-tabular"
          >
            Adjacent = {config.adj}
          </text>
          <text
            x={x1 + 16}
            y={(y0 + yTop) / 2}
            textAnchor="start"
            fontSize="14"
            fontWeight="600"
            fill="#1D4ED8"
            className="font-mono-tabular"
          >
            Opp = {config.opp}
          </text>
          <text
            x={(x0 + x1) / 2 - 24}
            y={(y0 + yTop) / 2 - 14}
            textAnchor="end"
            fontSize="14"
            fontWeight="600"
            fill="#059669"
            className="font-mono-tabular"
          >
            Hyp = {config.hyp}
          </text>
        </svg>
      </div>

      <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-5">
        <div className="space-y-2">
          <div className="text-xs font-medium text-[#64748B]">Radical Pattern</div>
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#F1F5F9] rounded-lg">
            {(
              [
                { id: 'sin', label: '√(a² − x²)' },
                { id: 'tan', label: '√(a² + x²)' },
                { id: 'sec', label: '√(x² − a²)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setKind(opt.id)}
                className={`py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  kind === opt.id
                    ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                    : 'text-[#475569]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <MathTex tex={config.subTex} display />

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="trig-a-slider" className="text-[#334155]">
                Constant a
              </label>
              <span className="font-mono-tabular text-[#0F172A]">a = {a}</span>
            </div>
            <input
              id="trig-a-slider"
              type="range"
              min="1"
              max="6"
              step="1"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              className="calc-slider"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="trig-theta-slider" className="text-[#334155]">
                Angle θ
              </label>
              <span className="font-mono-tabular text-[#D97706]">{thetaDeg}°</span>
            </div>
            <input
              id="trig-theta-slider"
              type="range"
              min="15"
              max="72"
              step="1"
              value={thetaDeg}
              onChange={(e) => setThetaDeg(Number(e.target.value))}
              className="calc-slider"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs font-mono-tabular">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Numeric x(θ)</span>
            <span className="font-semibold text-[#0F172A]">{xVal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">sin θ back-sub</span>
            <span className="font-semibold text-[#1D4ED8]">{config.sinVal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">cos θ back-sub</span>
            <span className="font-semibold text-[#059669]">{config.cosVal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 6. Improper p-Integral Convergence Lab (Day 8)
 * ========================================================================== */
function ImproperLab() {
  const [p, setP] = useState(1.5);
  const [tBound, setTBound] = useState(8);

  const fn = (x: number) => 1 / Math.pow(x, p);
  const res = useMemo(() => evaluatePIntegral(p, tBound), [p, tBound]);

  const xMin = 0.5;
  const xMax = 12;
  const yMin = 0;
  const yMax = 1.4;

  // Build shaded area polygon from x=1 to x=tBound
  const areaPath = useMemo(() => {
    const pts: string[] = [`M${mapX(1, xMin, xMax).toFixed(1)},${mapY(0, yMin, yMax).toFixed(1)}`];
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const x = 1 + ((tBound - 1) * i) / steps;
      pts.push(
        `L${mapX(x, xMin, xMax).toFixed(1)},${mapY(Math.min(yMax, fn(x)), yMin, yMax).toFixed(1)}`
      );
    }
    pts.push(`L${mapX(tBound, xMin, xMax).toFixed(1)},${mapY(0, yMin, yMax).toFixed(1)} Z`);
    return pts.join(' ');
  }, [p, tBound]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Improper p-integral tail area visualizer"
          data-testid="lab-svg"
        >
          <CoordinateGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} xStep={2} yStep={0.5} />

          <path
            d={areaPath}
            fill={res.converges ? '#93C5FD' : '#FCA5A5'}
            fillOpacity="0.45"
          />

          <path
            d={buildPolylinePath(fn, 0.9, 12, yMin, yMax)}
            fill="none"
            stroke={res.converges ? '#1D4ED8' : '#DC2626'}
            strokeWidth="2.75"
          />

          <line
            x1={mapX(tBound, xMin, xMax)}
            y1={PAD}
            x2={mapX(tBound, xMin, xMax)}
            y2={SVG_H - PAD}
            stroke="#0F172A"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-5">
        <MathTex tex={`\\int_1^{${tBound.toFixed(1)}} \\frac{1}{x^{${p.toFixed(2)}}}\\,dx`} display />

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <label htmlFor="imp-p-slider" className="text-[#334155]">
                Exponent p (critical at p = 1)
              </label>
              <span className="font-mono-tabular font-semibold text-[#0F172A]">
                p = {p.toFixed(2)}
              </span>
            </div>
            <input
              id="imp-p-slider"
              type="range"
              min="0.4"
              max="3.0"
              step="0.1"
              value={p}
              onChange={(e) => setP(Number(e.target.value))}
              className="calc-slider"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <label htmlFor="imp-t-slider" className="text-[#334155]">
                Upper Bound t
              </label>
              <span className="font-mono-tabular text-[#1D4ED8]">t = {tBound.toFixed(1)}</span>
            </div>
            <input
              id="imp-t-slider"
              type="range"
              min="1.5"
              max="12"
              step="0.5"
              value={tBound}
              onChange={(e) => setTBound(Number(e.target.value))}
              className="calc-slider"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs font-mono-tabular">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Finite Area [1, t]</span>
            <span className="font-semibold text-[#0F172A]">{res.finiteArea.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Infinite Limit (t → ∞)</span>
            <span
              className={`font-semibold ${
                res.converges ? 'text-[#059669]' : 'text-[#DC2626]'
              }`}
            >
              {res.infiniteLimit !== null
                ? `${res.infiniteLimit.toFixed(4)} (Converges)`
                : '∞ (Diverges)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 7. Slope Field & Euler's Method ODE Lab (Day 9)
 * ========================================================================== */
function OdeLab() {
  const [preset, setPreset] = useState<OdePresetId>('logistic');
  const [y0, setY0] = useState(0.7);
  const [stepH, setStepH] = useState(0.6);

  const xMin = 0;
  const xMax = 5;
  const yMin = -1;
  const yMax = 5;

  const res = useMemo(() => solveOdeEuler(preset, 0, y0, 5, stepH), [preset, y0, stepH]);

  const slopeFn = (x: number, y: number) => {
    if (preset === 'exponential') return 0.5 * y;
    if (preset === 'logistic') return 0.9 * y * (1 - y / 4);
    return Math.cos(x) - 0.5 * y;
  };

  const slopeTicks = useMemo(() => {
    const items: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let x = 0.25; x <= 4.75; x += 0.5) {
      for (let y = -0.5; y <= 4.5; y += 0.625) {
        const m = slopeFn(x, y);
        const angle = Math.atan(m);
        const len = 0.16;
        const dx = len * Math.cos(angle);
        const dy = len * Math.sin(angle);
        items.push({
          x1: mapX(x - dx, xMin, xMax),
          y1: mapY(y - dy, yMin, yMax),
          x2: mapX(x + dx, xMin, xMax),
          y2: mapY(y + dy, yMin, yMax),
        });
      }
    }
    return items;
  }, [preset]);

  const exactPath = res.exactPoints
    .filter((pt) => pt.y >= yMin - 1 && pt.y <= yMax + 1)
    .map((pt, i) => `${i === 0 ? 'M' : 'L'}${mapX(pt.x, xMin, xMax).toFixed(1)},${mapY(pt.y, yMin, yMax).toFixed(1)}`)
    .join(' ');

  const eulerPath = res.eulerPoints
    .filter((pt) => pt.y >= yMin - 1 && pt.y <= yMax + 1)
    .map((pt, i) => `${i === 0 ? 'M' : 'L'}${mapX(pt.x, xMin, xMax).toFixed(1)},${mapY(pt.y, yMin, yMax).toFixed(1)}`)
    .join(' ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto"
          role="img"
          aria-label="ODE slope field and Euler trajectory simulator"
          data-testid="lab-svg"
        >
          <CoordinateGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />

          {/* Slope field segments */}
          {slopeTicks.map((seg, i) => (
            <line
              key={i}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke="#94A3B8"
              strokeWidth="1.25"
            />
          ))}

          {/* Exact solution */}
          <path d={exactPath} fill="none" stroke="#1D4ED8" strokeWidth="2.75" />

          {/* Euler polygonal path */}
          <path
            d={eulerPath}
            fill="none"
            stroke="#D97706"
            strokeWidth="2.25"
            strokeDasharray="5 3"
          />
          {res.eulerPoints
            .filter((pt) => pt.y >= yMin && pt.y <= yMax)
            .map((pt, idx) => (
              <circle
                key={idx}
                cx={mapX(pt.x, xMin, xMax)}
                cy={mapY(pt.y, yMin, yMax)}
                r="3.5"
                fill="#D97706"
              />
            ))}
        </svg>
      </div>

      <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-5">
        <div className="space-y-2">
          <div className="text-xs font-medium text-[#64748B]">Differential Equation</div>
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#F1F5F9] rounded-lg">
            {(
              [
                { id: 'logistic', label: 'Logistic' },
                { id: 'exponential', label: 'y′ = 0.5y' },
                { id: 'damped_wave', label: 'Forced' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPreset(opt.id)}
                className={`py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  preset === opt.id
                    ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                    : 'text-[#475569]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="ode-y0-slider" className="text-[#334155]">
                Initial Value y(0)
              </label>
              <span className="font-mono-tabular text-[#0F172A]">{y0.toFixed(2)}</span>
            </div>
            <input
              id="ode-y0-slider"
              type="range"
              min="0.2"
              max="3.6"
              step="0.1"
              value={y0}
              onChange={(e) => setY0(Number(e.target.value))}
              className="calc-slider"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="ode-h-slider" className="text-[#334155]">
                Euler Step Size h
              </label>
              <span className="font-mono-tabular text-[#D97706]">{stepH.toFixed(2)}</span>
            </div>
            <input
              id="ode-h-slider"
              type="range"
              min="0.1"
              max="1.25"
              step="0.05"
              value={stepH}
              onChange={(e) => setStepH(Number(e.target.value))}
              className="calc-slider"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs font-mono-tabular">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Euler Steps Taken</span>
            <span className="font-semibold text-[#0F172A]">{res.eulerPoints.length - 1}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Final Error at x = 5</span>
            <span className="font-semibold text-[#059669]">{res.finalError.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 8. Series & Alternating Partial Sums Lab (Days 10 & 11)
 * ========================================================================== */
function SeriesLab({ defaultPreset }: { defaultPreset: SeriesPresetId }) {
  const [preset, setPreset] = useState<SeriesPresetId>(defaultPreset);
  const [param, setParam] = useState(
    defaultPreset === 'geometric' ? 0.65 : defaultPreset === 'alternating_harmonic' ? 1.0 : 1.5
  );
  const [maxN, setMaxN] = useState(20);

  const data = useMemo(
    () => computeSeriesPartialSums(preset, param, maxN),
    [preset, param, maxN]
  );

  const yVals = data.points.flatMap((p) => [p.partialSum, p.term]);
  const yMax = Math.max(2.2, Math.min(12, Math.ceil(Math.max(...yVals) * 1.15)));
  const yMin = Math.min(-0.8, Math.floor(Math.min(...yVals) - 0.5));
  const xMin = 0;
  const xMax = maxN + 1;

  const last = data.points[data.points.length - 1];
  const nextErrorBound =
    preset === 'alternating_harmonic' ? 1 / Math.pow(maxN + 1, param) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Infinite series terms and partial sums chart"
          data-testid="lab-svg"
        >
          <CoordinateGrid
            xMin={xMin}
            xMax={xMax}
            yMin={yMin}
            yMax={yMax}
            xStep={Math.max(2, Math.round(maxN / 5))}
            yStep={Math.max(0.5, Number(((yMax - yMin) / 5).toFixed(1)))}
            xLabel="n"
            yLabel="Sₙ"
          />

          {/* Exact limit asymptote if known */}
          {data.exactLimit !== null && data.exactLimit <= yMax && (
            <line
              x1={PAD}
              y1={mapY(data.exactLimit, yMin, yMax)}
              x2={SVG_W - PAD}
              y2={mapY(data.exactLimit, yMin, yMax)}
              stroke="#059669"
              strokeDasharray="6 4"
              strokeWidth="1.75"
            />
          )}

          {/* Term bars a_n */}
          {data.points.map((pt) => {
            const x = mapX(pt.n, xMin, xMax);
            const y0 = mapY(0, yMin, yMax);
            const y1 = mapY(Math.max(yMin, Math.min(yMax, pt.term)), yMin, yMax);
            return (
              <line
                key={`t-${pt.n}`}
                x1={x}
                y1={y0}
                x2={x}
                y2={y1}
                stroke="#94A3B8"
                strokeWidth="3"
                opacity="0.7"
              />
            );
          })}

          {/* Partial Sum polyline S_N */}
          <path
            d={data.points
              .map(
                (pt, i) =>
                  `${i === 0 ? 'M' : 'L'}${mapX(pt.n, xMin, xMax).toFixed(1)},${mapY(Math.max(yMin, Math.min(yMax, pt.partialSum)), yMin, yMax).toFixed(1)}`
              )
              .join(' ')}
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="2.25"
          />
          {data.points.map((pt) => (
            <circle
              key={`s-${pt.n}`}
              cx={mapX(pt.n, xMin, xMax)}
              cy={mapY(Math.max(yMin, Math.min(yMax, pt.partialSum)), yMin, yMax)}
              r="3.5"
              fill="#1D4ED8"
            />
          ))}
        </svg>

        <div className="mt-2 px-2 flex flex-wrap items-center gap-4 text-xs text-[#475569]">
          <span className="font-semibold text-[#1D4ED8]">● Partial Sum Sₙ</span>
          <span className="font-semibold text-[#64748B]">| Term aₙ</span>
          {data.exactLimit !== null && (
            <span className="font-semibold text-[#059669]">- - Exact Limit L</span>
          )}
        </div>
      </div>

      <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-5">
        <div className="space-y-2">
          <div className="text-xs font-medium text-[#64748B]">Series Family</div>
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#F1F5F9] rounded-lg">
            {(
              [
                { id: 'geometric', label: 'Geometric', def: 0.65 },
                { id: 'pseries', label: 'p-Series', def: 1.5 },
                { id: 'alternating_harmonic', label: 'Alternating', def: 1.0 },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setPreset(opt.id);
                  setParam(opt.def);
                }}
                className={`py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  preset === opt.id
                    ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                    : 'text-[#475569]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="ser-param-slider" className="text-[#334155]">
                {preset === 'geometric' ? 'Common ratio r' : 'Exponent p'}
              </label>
              <span className="font-mono-tabular text-[#0F172A]">
                {preset === 'geometric' ? `r = ${param.toFixed(2)}` : `p = ${param.toFixed(2)}`}
              </span>
            </div>
            <input
              id="ser-param-slider"
              type="range"
              min={preset === 'geometric' ? '-0.85' : '0.4'}
              max={preset === 'geometric' ? '1.15' : '2.5'}
              step="0.05"
              value={param}
              onChange={(e) => setParam(Number(e.target.value))}
              className="calc-slider"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="ser-n-slider" className="text-[#334155]">
                Partial Sum Terms N
              </label>
              <span className="font-mono-tabular text-[#1D4ED8]">N = {maxN}</span>
            </div>
            <input
              id="ser-n-slider"
              type="range"
              min="5"
              max="40"
              step="1"
              value={maxN}
              onChange={(e) => setMaxN(Number(e.target.value))}
              className="calc-slider"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs font-mono-tabular">
          <div className="flex justify-between">
            <span className="text-[#64748B]">S_{maxN} Partial Sum</span>
            <span className="font-semibold text-[#1D4ED8]">
              {last.partialSum.toFixed(4)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Verdict</span>
            <span
              className={`font-sans font-semibold ${
                data.converges ? 'text-[#059669]' : 'text-[#DC2626]'
              }`}
            >
              {data.converges ? 'Converges' : 'Diverges'}
            </span>
          </div>
          {nextErrorBound !== null && (
            <div className="flex justify-between">
              <span className="text-[#64748B]">AST Error Bound b_{maxN + 1}</span>
              <span className="font-semibold text-[#059669]">
                ≤ {nextErrorBound.toFixed(4)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 9. Taylor / Maclaurin Polynomial Studio (Day 12)
 * ========================================================================== */
function TaylorLab() {
  const [fnId, setFnId] = useState<TaylorFunctionId>('sin');
  const [degree, setDegree] = useState(3);
  const [evalX, setEvalX] = useState(1.5);

  const xMin = fnId === 'ln1px' || fnId === 'geometric' ? -1.4 : -5.5;
  const xMax = fnId === 'ln1px' || fnId === 'geometric' ? 1.8 : 5.5;
  const yMin = -2.5;
  const yMax = 3.5;

  const evalMetrics = useMemo(
    () => evaluateTaylor(fnId, evalX, degree),
    [fnId, evalX, degree]
  );

  const exactPath = useMemo(
    () =>
      buildPolylinePath(
        (x) => evaluateTaylor(fnId, x, degree).exact,
        xMin,
        xMax,
        yMin,
        yMax
      ),
    [fnId, degree, xMin, xMax]
  );

  const approxPath = useMemo(
    () =>
      buildPolylinePath(
        (x) => evaluateTaylor(fnId, x, degree).approx,
        xMin,
        xMax,
        yMin,
        yMax
      ),
    [fnId, degree, xMin, xMax]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Taylor polynomial approximation studio"
          data-testid="lab-svg"
        >
          <PlotClipDefs id="clip-taylor" />
          <CoordinateGrid
            xMin={xMin}
            xMax={xMax}
            yMin={yMin}
            yMax={yMax}
            xStep={fnId === 'ln1px' || fnId === 'geometric' ? 0.5 : 1}
          />

          <g clipPath="url(#clip-taylor)">
            {/* Radius of convergence boundary markers when finite R = 1 */}
            {(fnId === 'ln1px' || fnId === 'geometric') && (
              <>
                <line
                  x1={mapX(-1, xMin, xMax)}
                  y1={PAD}
                  x2={mapX(-1, xMin, xMax)}
                  y2={SVG_H - PAD}
                  stroke="#DC2626"
                  strokeDasharray="4 4"
                  strokeWidth="1.25"
                />
                <line
                  x1={mapX(1, xMin, xMax)}
                  y1={PAD}
                  x2={mapX(1, xMin, xMax)}
                  y2={SVG_H - PAD}
                  stroke="#DC2626"
                  strokeDasharray="4 4"
                  strokeWidth="1.25"
                />
              </>
            )}

            {/* Exact transcendental curve */}
            <path d={exactPath} fill="none" stroke="#94A3B8" strokeWidth="2.5" />

            {/* Taylor polynomial T_n(x) */}
            <path d={approxPath} fill="none" stroke="#1D4ED8" strokeWidth="2.75" />

            {/* Evaluation point x */}
            {Number.isFinite(evalMetrics.approx) &&
              evalMetrics.approx >= yMin &&
              evalMetrics.approx <= yMax && (
                <circle
                  cx={mapX(evalX, xMin, xMax)}
                  cy={mapY(evalMetrics.approx, yMin, yMax)}
                  r="5.5"
                  fill="#1D4ED8"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}
          </g>
        </svg>

        <div className="mt-2 px-2 flex flex-wrap items-center gap-4 text-xs text-[#475569]">
          <span className="font-semibold text-[#64748B]">— Exact f(x)</span>
          <span className="font-semibold text-[#1D4ED8]">
            — Taylor Polynomial T<sub>{degree}</sub>(x)
          </span>
          {(fnId === 'ln1px' || fnId === 'geometric') && (
            <span className="font-semibold text-[#DC2626]">- - Radius |x| = 1</span>
          )}
        </div>
      </div>

      <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-5">
        <div className="space-y-2">
          <div className="text-xs font-medium text-[#64748B]">Target Function</div>
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#F1F5F9] rounded-lg">
            {(
              [
                { id: 'sin', label: 'sin(x)' },
                { id: 'cos', label: 'cos(x)' },
                { id: 'exp', label: 'eˣ' },
                { id: 'ln1px', label: 'ln(1+x)' },
                { id: 'geometric', label: '1/(1−x)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFnId(opt.id);
                  if (opt.id === 'ln1px' || opt.id === 'geometric') {
                    setEvalX(0.6);
                  }
                }}
                className={`py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  fnId === opt.id
                    ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                    : 'text-[#475569]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="taylor-deg-slider" className="text-[#334155]">
                Polynomial Degree n
              </label>
              <span className="font-mono-tabular font-semibold text-[#1D4ED8]">
                n = {degree}
              </span>
            </div>
            <input
              id="taylor-deg-slider"
              type="range"
              min="0"
              max="11"
              step="1"
              value={degree}
              onChange={(e) => setDegree(Number(e.target.value))}
              className="calc-slider"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="taylor-x-slider" className="text-[#334155]">
                Test Point x
              </label>
              <span className="font-mono-tabular text-[#0F172A]">
                x = {evalX.toFixed(2)}
              </span>
            </div>
            <input
              id="taylor-x-slider"
              type="range"
              min={fnId === 'ln1px' || fnId === 'geometric' ? '-0.9' : '-4.0'}
              max={fnId === 'ln1px' || fnId === 'geometric' ? '1.2' : '4.0'}
              step="0.1"
              value={evalX}
              onChange={(e) => setEvalX(Number(e.target.value))}
              className="calc-slider"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs font-mono-tabular">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Exact f({evalX.toFixed(2)})</span>
            <span className="font-semibold text-[#0F172A]">
              {Number.isFinite(evalMetrics.exact) ? evalMetrics.exact.toFixed(5) : 'Undefined'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">
              T<sub>{degree}</sub>({evalX.toFixed(2)})
            </span>
            <span className="font-semibold text-[#1D4ED8]">
              {evalMetrics.approx.toFixed(5)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">
              Remainder |R<sub>{degree}</sub>|
            </span>
            <span className="font-semibold text-[#059669]">
              {Number.isFinite(evalMetrics.error) ? evalMetrics.error.toFixed(5) : 'Diverges'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Radius of Convergence</span>
            <span className="font-semibold text-[#0F172A]">
              R = {evalMetrics.radiusOfConvergence}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 10. Polar Curve & Sector Area Lab (Day 13)
 * ========================================================================== */
function PolarLab() {
  const [preset, setPreset] = useState<PolarPresetId>('cardioid');
  const [thetaDeg, setThetaDeg] = useState(240);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setThetaDeg((prev) => (prev >= 360 ? 10 : prev + 6));
    }, 60);
    return () => window.clearInterval(id);
  }, [playing]);

  const thetaMax = (thetaDeg * Math.PI) / 180;
  const sampled = useMemo(() => samplePolarCurve(preset, thetaMax, 180), [preset, thetaMax]);

  const cx = SVG_W / 2;
  const cy = SVG_H / 2;
  const scale = 54;

  const curvePath = sampled.points
    .map((pt, i) => `${i === 0 ? 'M' : 'L'}${(cx + pt.x * scale).toFixed(1)},${(cy - pt.y * scale).toFixed(1)}`)
    .join(' ');

  const sectorPath = `M${cx},${cy} ${sampled.points
    .map((pt) => `L${(cx + pt.x * scale).toFixed(1)},${(cy - pt.y * scale).toFixed(1)}`)
    .join(' ')} Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Polar coordinate curve and swept sector area visualizer"
          data-testid="lab-svg"
        >
          {/* Polar concentric rings */}
          {[1, 2, 3].map((r) => (
            <circle
              key={r}
              cx={cx}
              cy={cy}
              r={r * scale}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          ))}
          <line x1={PAD} y1={cy} x2={SVG_W - PAD} y2={cy} stroke="#CBD5E1" strokeWidth="1.25" />
          <line x1={cx} y1={PAD / 2} x2={cx} y2={SVG_H - PAD / 2} stroke="#CBD5E1" strokeWidth="1.25" />

          {/* Swept sector fill */}
          <path d={sectorPath} fill="#93C5FD" fillOpacity="0.32" />

          {/* Traced polar curve */}
          <path d={curvePath} fill="none" stroke="#1D4ED8" strokeWidth="2.75" />

          {/* Current radius ray */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + sampled.currentPoint.x * scale}
            y2={cy - sampled.currentPoint.y * scale}
            stroke="#D97706"
            strokeWidth="2"
          />
          <circle
            cx={cx + sampled.currentPoint.x * scale}
            cy={cy - sampled.currentPoint.y * scale}
            r="5.5"
            fill="#D97706"
          />
        </svg>
      </div>

      <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-5">
        <div className="space-y-2">
          <div className="text-xs font-medium text-[#64748B]">Polar Curve</div>
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#F1F5F9] rounded-lg">
            {(
              [
                { id: 'cardioid', label: 'Cardioid' },
                { id: 'rose3', label: '3-Petal Rose' },
                { id: 'limacon', label: 'Inner-Loop Limaçon' },
                { id: 'lemniscate', label: '4-Petal Rose' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPreset(opt.id)}
                className={`py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  preset === opt.id
                    ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                    : 'text-[#475569]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <label htmlFor="polar-theta-slider" className="text-[#334155]">
              Sweep Angle θ
            </label>
            <span className="font-mono-tabular text-[#1D4ED8]">
              {thetaDeg}° ({(thetaDeg / 180).toFixed(2)}π)
            </span>
          </div>
          <input
            id="polar-theta-slider"
            type="range"
            min="10"
            max="360"
            step="5"
            value={thetaDeg}
            onChange={(e) => {
              setPlaying(false);
              setThetaDeg(Number(e.target.value));
            }}
            className="calc-slider"
          />
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs font-mono-tabular">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Radius r(θ)</span>
            <span className="font-semibold text-[#0F172A]">{sampled.currentR.toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Swept Area ½∫r² dθ</span>
            <span className="font-semibold text-[#059669]">
              {sampled.sectorArea.toFixed(4)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg cursor-pointer"
        >
          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{playing ? 'Pause Sweep' : 'Animate θ: 0 → 2π'}</span>
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
 * 11. Rapid Exam Triage Trainer (Day 14)
 * ========================================================================== */
const TRIAGE_CARDS = [
  {
    id: 't1',
    kind: 'Integral',
    exprTex: '\\int x e^{x^2}\\,dx',
    choices: ['u-Substitution', 'Integration by Parts', 'Trig Substitution', 'Partial Fractions'],
    answer: 'u-Substitution',
    why: 'Always scan for u-sub FIRST: u = x² has du = 2x dx sitting right outside!',
  },
  {
    id: 't2',
    kind: 'Integral',
    exprTex: '\\int x^2 \\ln(x)\\,dx',
    choices: ['u-Substitution', 'Integration by Parts', 'Trig Substitution', 'Partial Fractions'],
    answer: 'Integration by Parts',
    why: 'Product of Algebraic × Logarithmic with no inner derivative match. Choose u = ln(x) via LIATE.',
  },
  {
    id: 't3',
    kind: 'Integral',
    exprTex: '\\int \\frac{3x + 5}{(x - 1)(x + 4)}\\,dx',
    choices: ['u-Substitution', 'Integration by Parts', 'Trig Substitution', 'Partial Fractions'],
    answer: 'Partial Fractions',
    why: 'Proper rational function with factored linear denominator → Heaviside Cover-Up in 10 seconds.',
  },
  {
    id: 't4',
    kind: 'Series',
    exprTex: '\\sum_{n=1}^{\\infty} \\frac{5^n}{(2n)!}',
    choices: ['Ratio Test', 'Limit Comparison', 'Divergence Test', 'Integral Test'],
    answer: 'Ratio Test',
    why: 'Factorials (2n)! and exponentials 5^n cancel cleanly in a_{n+1}/a_n → L = 0 < 1.',
  },
  {
    id: 't5',
    kind: 'Series',
    exprTex: '\\sum_{n=1}^{\\infty} \\frac{2n^2 + 3}{n^4 - 5n + 9}',
    choices: ['Ratio Test', 'Limit Comparison', 'Alternating Series Test', 'Geometric Series'],
    answer: 'Limit Comparison',
    why: 'Pure rational expression in n: Ratio Test gives L = 1 (useless). Compare to 1/n² (p = 2 > 1).',
  },
];

function TriageLab() {
  const [cardIdx, setCardIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const card = TRIAGE_CARDS[cardIdx];
  const isCorrect = selected === card.answer;

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
        <span>
          Rapid Recognition Card {cardIdx + 1} of {TRIAGE_CARDS.length} · {card.kind}
        </span>
        <span className="font-mono-tabular">Goal: Pick optimal method in &lt; 5 sec</span>
      </div>

      <div className="py-6 px-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-center">
        <MathTex tex={card.exprTex} display className="text-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {card.choices.map((choice) => {
          const isPicked = selected === choice;
          const showCorrect = selected !== null && choice === card.answer;
          const showWrong = isPicked && !isCorrect;
          return (
            <button
              key={choice}
              type="button"
              onClick={() => setSelected(choice)}
              className={`px-4 py-3 text-sm font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                showCorrect
                  ? 'bg-[#ECFDF5] border-[#059669] text-[#065F46]'
                  : showWrong
                    ? 'bg-[#FEF2F2] border-[#DC2626] text-[#991B1B]'
                    : 'bg-[#FFFFFF] border-[#CBD5E1] text-[#0F172A] hover:border-[#1D4ED8]'
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          className={`p-4 rounded-lg border text-sm ${
            isCorrect
              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
              : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
          }`}
        >
          <strong className="font-semibold">
            {isCorrect ? 'Optimal choice. ' : `Faster route: ${card.answer}. `}
          </strong>
          {card.why}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            setCardIdx((i) => (i - 1 + TRIAGE_CARDS.length) % TRIAGE_CARDS.length);
          }}
          className="px-4 py-2 text-xs font-medium text-[#334155] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg cursor-pointer"
        >
          Previous Pattern
        </button>
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            setCardIdx((i) => (i + 1) % TRIAGE_CARDS.length);
          }}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg cursor-pointer"
        >
          Next Pattern
        </button>
      </div>
    </div>
  );
}

function PreAlgFunctionsLab() {
  const [family, setFamily] = useState<'sqrt' | 'abs'>('sqrt');
  const [a, setA] = useState(1.5);
  const [h, setH] = useState(-1);
  const [k, setK] = useState(1);

  const xMin = -6;
  const xMax = 8;
  const yMin = -6;
  const yMax = 8;

  const parentFn = (x: number) => (family === 'sqrt' ? (x >= 0 ? Math.sqrt(x) : Number.NaN) : Math.abs(x));
  const transFn = (x: number) =>
    family === 'sqrt' ? (x >= h ? a * Math.sqrt(x - h) + k : Number.NaN) : a * Math.abs(x - h) + k;

  const parentPath = useMemo(() => buildPolylinePath(parentFn, xMin, xMax, yMin, yMax, 240), [family]);
  const transPath = useMemo(
    () => buildPolylinePath(transFn, xMin, xMax, yMin, yMax, 240),
    [family, a, h, k]
  );

  const domainLabel = family === 'sqrt' ? `[${h.toFixed(1)}, ∞)` : '(-∞, ∞)';
  const rangeLabel =
    a > 0 ? `[${k.toFixed(1)}, ∞)` : a < 0 ? `(-∞, ${k.toFixed(1)}]` : `{${k.toFixed(1)}}`;

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg">
          <button
            type="button"
            onClick={() => setFamily('sqrt')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
              family === 'sqrt' ? 'bg-white text-[#0F172A] shadow-xs font-semibold' : 'text-[#475569]'
            }`}
          >
            Square Root (Restricted Domain)
          </button>
          <button
            type="button"
            onClick={() => setFamily('abs')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
              family === 'abs' ? 'bg-white text-[#0F172A] shadow-xs font-semibold' : 'text-[#475569]'
            }`}
          >
            Absolute Value (Corner Vertex)
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setA(1.5);
            setH(-1);
            setK(1);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] hover:text-[#0F172A] bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        <div className="lg:col-span-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2">
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto block">
            <PlotClipDefs id="clip-pa-fn" />
            <CoordinateGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} xStep={2} yStep={2} />
            <g clipPath="url(#clip-pa-fn)">
              <path d={parentPath} fill="none" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" />
              <path d={transPath} fill="none" stroke="#1D4ED8" strokeWidth={2.75} />
              <circle cx={mapX(h, xMin, xMax)} cy={mapY(k, yMin, yMax)} r={5.5} fill="#059669" stroke="#FFFFFF" strokeWidth={2} />
            </g>
          </svg>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
            <MathTex
              tex={
                family === 'sqrt'
                  ? `f(x) = ${a.toFixed(1)}\\sqrt{x ${h >= 0 ? '-' : '+'} ${Math.abs(h).toFixed(1)}} ${k >= 0 ? '+' : '-'} ${Math.abs(k).toFixed(1)}`
                  : `f(x) = ${a.toFixed(1)}|x ${h >= 0 ? '-' : '+'} ${Math.abs(h).toFixed(1)}| ${k >= 0 ? '+' : '-'} ${Math.abs(k).toFixed(1)}`
              }
              display
            />
          </div>

          <div className="space-y-3 text-xs">
            <label className="block space-y-1">
              <div className="flex justify-between font-mono-tabular">
                <span className="font-sans text-[#475569]">Vertical Stretch / Flip (a)</span>
                <span className="font-semibold text-[#1D4ED8]">{a.toFixed(1)}</span>
              </div>
              <input type="range" min={-2.5} max={2.5} step={0.5} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full accent-[#1D4ED8]" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-mono-tabular">
                <span className="font-sans text-[#475569]">Horizontal Shift (h)</span>
                <span className="font-semibold text-[#1D4ED8]">{h.toFixed(1)}</span>
              </div>
              <input type="range" min={-4} max={4} step={0.5} value={h} onChange={(e) => setH(Number(e.target.value))} className="w-full accent-[#1D4ED8]" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-mono-tabular">
                <span className="font-sans text-[#475569]">Vertical Shift (k)</span>
                <span className="font-semibold text-[#1D4ED8]">{k.toFixed(1)}</span>
              </div>
              <input type="range" min={-4} max={4} step={0.5} value={k} onChange={(e) => setK(Number(e.target.value))} className="w-full accent-[#1D4ED8]" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono-tabular">
            <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
              <div className="text-[#64748B] font-sans">Domain</div>
              <div className="font-semibold text-[#0F172A] mt-0.5">{domainLabel}</div>
            </div>
            <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
              <div className="text-[#64748B] font-sans">Range</div>
              <div className="font-semibold text-[#0F172A] mt-0.5">{rangeLabel}</div>
            </div>
          </div>
          <p className="text-xs text-[#475569]">
            Dashed gray curve is the parent function; green dot tracks the anchor point ({h.toFixed(1)}, {k.toFixed(1)}).
          </p>
        </div>
      </div>
    </div>
  );
}

function PreAlgQuadraticsLab() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);

  const xMin = -6;
  const xMax = 6;
  const yMin = -8;
  const yMax = 8;

  const safeA = a === 0 ? 0.5 : a;
  const h = -b / (2 * safeA);
  const k = safeA * h * h + b * h + c;
  const disc = b * b - 4 * safeA * c;
  const roots =
    disc > 1e-6
      ? [(-b - Math.sqrt(disc)) / (2 * safeA), (-b + Math.sqrt(disc)) / (2 * safeA)]
      : Math.abs(disc) <= 1e-6
        ? [h]
        : [];

  const path = useMemo(
    () => buildPolylinePath((x) => safeA * x * x + b * x + c, xMin, xMax, yMin, yMax, 240),
    [safeA, b, c]
  );

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        <div className="lg:col-span-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2">
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto block">
            <PlotClipDefs id="clip-pa-quad" />
            <CoordinateGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} xStep={2} yStep={2} />
            <g clipPath="url(#clip-pa-quad)">
              <line
                x1={mapX(h, xMin, xMax)}
                y1={PAD}
                x2={mapX(h, xMin, xMax)}
                y2={SVG_H - PAD}
                stroke="#94A3B8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <path d={path} fill="none" stroke="#1D4ED8" strokeWidth={2.75} />
              <circle cx={mapX(h, xMin, xMax)} cy={mapY(k, yMin, yMax)} r={5.5} fill="#D97706" stroke="#FFFFFF" strokeWidth={2} />
              {roots.map((r, i) => (
                <circle key={i} cx={mapX(r, xMin, xMax)} cy={mapY(0, yMin, yMax)} r={5} fill="#059669" stroke="#FFFFFF" strokeWidth={2} />
              ))}
            </g>
          </svg>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
            <MathTex
              tex={`f(x) = ${safeA.toFixed(1)}x^2 ${b >= 0 ? '+' : '-'} ${Math.abs(b).toFixed(1)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c).toFixed(1)}`}
              display
            />
          </div>

          <div className="space-y-3 text-xs">
            <label className="block space-y-1">
              <div className="flex justify-between font-mono-tabular">
                <span className="font-sans text-[#475569]">Leading Coefficient (a)</span>
                <span className="font-semibold text-[#1D4ED8]">{safeA.toFixed(1)}</span>
              </div>
              <input type="range" min={-2} max={2} step={0.5} value={safeA} onChange={(e) => setA(Number(e.target.value) === 0 ? 0.5 : Number(e.target.value))} className="w-full accent-[#1D4ED8]" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-mono-tabular">
                <span className="font-sans text-[#475569]">Linear Term (b)</span>
                <span className="font-semibold text-[#1D4ED8]">{b.toFixed(1)}</span>
              </div>
              <input type="range" min={-6} max={6} step={0.5} value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full accent-[#1D4ED8]" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-mono-tabular">
                <span className="font-sans text-[#475569]">Constant y-Intercept (c)</span>
                <span className="font-semibold text-[#1D4ED8]">{c.toFixed(1)}</span>
              </div>
              <input type="range" min={-6} max={6} step={0.5} value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full accent-[#1D4ED8]" />
            </label>
          </div>

          <div className="space-y-2 text-xs font-mono-tabular">
            <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex justify-between">
              <span className="font-sans text-[#64748B]">Vertex (amber)</span>
              <span className="font-semibold text-[#0F172A]">({h.toFixed(2)}, {k.toFixed(2)})</span>
            </div>
            <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex justify-between">
              <span className="font-sans text-[#64748B]">Discriminant Δ = b²−4ac</span>
              <span className={`font-semibold ${disc > 0 ? 'text-[#059669]' : disc < 0 ? 'text-[#DC2626]' : 'text-[#D97706]'}`}>
                {disc.toFixed(1)}
              </span>
            </div>
            <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
              <div className="font-sans text-[#64748B]">Real Zeros (green)</div>
              <div className="font-semibold text-[#0F172A] mt-0.5">
                {roots.length === 2
                  ? `x = ${roots[0].toFixed(2)},  x = ${roots[1].toFixed(2)}`
                  : roots.length === 1
                    ? `Double root at x = ${roots[0].toFixed(2)}`
                    : 'No real roots (2 complex conjugates)'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreAlgRationalsLab() {
  const [mode, setMode] = useState<'asymptote' | 'hole'>('asymptote');
  const [pole, setPole] = useState(2);
  const [ha, setHa] = useState(1);

  const xMin = -6;
  const xMax = 6;
  const yMin = -6;
  const yMax = 6;

  const leftPath = useMemo(() => {
    if (mode === 'hole') {
      return buildPolylinePath((x) => (Math.abs(x - pole) < 0.08 ? Number.NaN : x + ha), xMin, xMax, yMin, yMax, 240);
    }
    return buildPolylinePath((x) => (x < pole - 0.08 ? ha + 2 / (x - pole) : Number.NaN), xMin, xMax, yMin, yMax, 200);
  }, [mode, pole, ha]);

  const rightPath = useMemo(() => {
    if (mode === 'hole') return '';
    return buildPolylinePath((x) => (x > pole + 0.08 ? ha + 2 / (x - pole) : Number.NaN), xMin, xMax, yMin, yMax, 200);
  }, [mode, pole, ha]);

  const holeY = pole + ha;

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 space-y-5">
      <div className="inline-flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg">
        <button
          type="button"
          onClick={() => setMode('asymptote')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
            mode === 'asymptote' ? 'bg-white text-[#0F172A] shadow-xs font-semibold' : 'text-[#475569]'
          }`}
        >
          Uncanceled Factor (Vertical &amp; Horizontal Asymptotes)
        </button>
        <button
          type="button"
          onClick={() => setMode('hole')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
            mode === 'hole' ? 'bg-white text-[#0F172A] shadow-xs font-semibold' : 'text-[#475569]'
          }`}
        >
          Canceled Factor (Removable Hole)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        <div className="lg:col-span-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2">
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto block">
            <PlotClipDefs id="clip-pa-rat" />
            <CoordinateGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} xStep={2} yStep={2} />
            <g clipPath="url(#clip-pa-rat)">
              {mode === 'asymptote' && (
                <>
                  <line x1={mapX(pole, xMin, xMax)} y1={PAD} x2={mapX(pole, xMin, xMax)} y2={SVG_H - PAD} stroke="#DC2626" strokeWidth={1.75} strokeDasharray="6 4" />
                  <line x1={PAD} y1={mapY(ha, yMin, yMax)} x2={SVG_W - PAD} y2={mapY(ha, yMin, yMax)} stroke="#059669" strokeWidth={1.75} strokeDasharray="6 4" />
                </>
              )}
              <path d={leftPath} fill="none" stroke="#1D4ED8" strokeWidth={2.75} />
              {rightPath && <path d={rightPath} fill="none" stroke="#1D4ED8" strokeWidth={2.75} />}
              {mode === 'hole' && (
                <circle cx={mapX(pole, xMin, xMax)} cy={mapY(holeY, yMin, yMax)} r={6} fill="#FFFFFF" stroke="#DC2626" strokeWidth={2.5} />
              )}
            </g>
          </svg>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
            <MathTex
              tex={
                mode === 'asymptote'
                  ? `f(x) = ${ha} + \\frac{2}{x ${pole >= 0 ? '-' : '+'} ${Math.abs(pole)}}`
                  : `f(x) = \\frac{(x ${pole >= 0 ? '-' : '+'} ${Math.abs(pole)})(x ${ha >= 0 ? '+' : '-'} ${Math.abs(ha)})}{x ${pole >= 0 ? '-' : '+'} ${Math.abs(pole)}}`
              }
              display
            />
          </div>

          <div className="space-y-3 text-xs">
            <label className="block space-y-1">
              <div className="flex justify-between font-mono-tabular">
                <span className="font-sans text-[#475569]">Excluded x-Value</span>
                <span className="font-semibold text-[#DC2626]">x = {pole}</span>
              </div>
              <input type="range" min={-3} max={3} step={1} value={pole} onChange={(e) => setPole(Number(e.target.value))} className="w-full accent-[#DC2626]" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-mono-tabular">
                <span className="font-sans text-[#475569]">{mode === 'asymptote' ? 'Horizontal Asymptote (y = k)' : 'Vertical Offset'}</span>
                <span className="font-semibold text-[#059669]">{ha}</span>
              </div>
              <input type="range" min={-2} max={2} step={1} value={ha} onChange={(e) => setHa(Number(e.target.value))} className="w-full accent-[#059669]" />
            </label>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#334155] leading-relaxed">
            {mode === 'asymptote' ? (
              <>
                <strong className="text-[#DC2626]">Vertical Asymptote:</strong> x = {pole} does not cancel, so y blows up to ±∞.{' '}
                <strong className="text-[#059669]">Horizontal Asymptote:</strong> y = {ha} as x → ±∞.
              </>
            ) : (
              <>
                <strong className="text-[#DC2626]">Removable Hole:</strong> (x {pole >= 0 ? '−' : '+'} {Math.abs(pole)}) cancels out, leaving a single missing open dot at ({pole}, {holeY}).
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreAlgExpLogLab() {
  const [base, setBase] = useState(2);
  const [t, setT] = useState(1.2);

  const xMin = -3;
  const xMax = 7;
  const yMin = -3;
  const yMax = 7;

  const expVal = Math.pow(base, t);
  const expPath = useMemo(() => buildPolylinePath((x) => Math.pow(base, x), xMin, xMax, yMin, yMax, 220), [base]);
  const logPath = useMemo(
    () => buildPolylinePath((x) => (x > 0.02 ? Math.log(x) / Math.log(base) : Number.NaN), xMin, xMax, yMin, yMax, 240),
    [base]
  );

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        <div className="lg:col-span-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2">
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto block">
            <PlotClipDefs id="clip-pa-exp" />
            <CoordinateGrid xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} xStep={1} yStep={1} />
            <g clipPath="url(#clip-pa-exp)">
              {/* Mirror line y = x */}
              <line x1={mapX(xMin, xMin, xMax)} y1={mapY(xMin, yMin, yMax)} x2={mapX(xMax, xMin, xMax)} y2={mapY(xMax, yMin, yMax)} stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="5 5" />
              <path d={expPath} fill="none" stroke="#1D4ED8" strokeWidth={2.75} />
              <path d={logPath} fill="none" stroke="#059669" strokeWidth={2.75} />
              {/* Reflection chord between (t, b^t) and (b^t, t) */}
              <line x1={mapX(t, xMin, xMax)} y1={mapY(expVal, yMin, yMax)} x2={mapX(expVal, xMin, xMax)} y2={mapY(t, yMin, yMax)} stroke="#D97706" strokeWidth={1.5} strokeDasharray="3 3" />
              <circle cx={mapX(t, xMin, xMax)} cy={mapY(expVal, yMin, yMax)} r={5.5} fill="#1D4ED8" stroke="#FFFFFF" strokeWidth={2} />
              <circle cx={mapX(expVal, xMin, xMax)} cy={mapY(t, yMin, yMax)} r={5.5} fill="#059669" stroke="#FFFFFF" strokeWidth={2} />
            </g>
          </svg>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-1">
            <MathTex tex={`y = ${base.toFixed(1)}^x \\quad \\Longleftrightarrow \\quad y = \\log_{${base.toFixed(1)}}(x)`} display />
          </div>

          <div className="space-y-3 text-xs">
            <label className="block space-y-1">
              <div className="flex justify-between font-mono-tabular">
                <span className="font-sans text-[#475569]">Base (b)</span>
                <span className="font-semibold text-[#1D4ED8]">{base.toFixed(1)}</span>
              </div>
              <input type="range" min={1.5} max={3.5} step={0.1} value={base} onChange={(e) => setBase(Number(e.target.value))} className="w-full accent-[#1D4ED8]" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-mono-tabular">
                <span className="font-sans text-[#475569]">Test Exponent (t)</span>
                <span className="font-semibold text-[#059669]">{t.toFixed(1)}</span>
              </div>
              <input type="range" min={-1.5} max={1.8} step={0.1} value={t} onChange={(e) => setT(Number(e.target.value))} className="w-full accent-[#059669]" />
            </label>
          </div>

          <div className="space-y-2 text-xs font-mono-tabular">
            <div className="p-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg flex justify-between text-[#1E3A8A]">
              <span className="font-sans">Exponential point</span>
              <span className="font-semibold">({t.toFixed(2)}, {expVal.toFixed(2)})</span>
            </div>
            <div className="p-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg flex justify-between text-[#065F46]">
              <span className="font-sans">Reflected Log point</span>
              <span className="font-semibold">({expVal.toFixed(2)}, {t.toFixed(2)})</span>
            </div>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            Swapping (x, y) reflects every point across the dashed line y = x: exponential horizontal asymptote y = 0 becomes logarithm vertical asymptote x = 0.
          </p>
        </div>
      </div>
    </div>
  );
}

const SPECIAL_ANGLES: { deg: number; radLabel: string }[] = [
  { deg: 0, radLabel: '0' },
  { deg: 30, radLabel: 'π/6' },
  { deg: 45, radLabel: 'π/4' },
  { deg: 60, radLabel: 'π/3' },
  { deg: 90, radLabel: 'π/2' },
  { deg: 120, radLabel: '2π/3' },
  { deg: 180, radLabel: 'π' },
  { deg: 270, radLabel: '3π/2' },
];

function PreAlgUnitCircleLab() {
  const [deg, setDeg] = useState(45);
  const rad = (deg * Math.PI) / 180;
  const cosV = Math.cos(rad);
  const sinV = Math.sin(rad);

  const cx = 170;
  const cy = 190;
  const r = 115;
  const px = cx + r * cosV;
  const py = cy - r * sinV;

  // Sine wave on right side (x from 340 to 600 maps 0..2pi)
  const waveLeft = 345;
  const waveWidth = 265;
  const wavePoints: string[] = [];
  for (let i = 0; i <= 90; i++) {
    const theta = (i / 90) * Math.PI * 2;
    const wx = waveLeft + (theta / (Math.PI * 2)) * waveWidth;
    const wy = cy - r * Math.sin(theta);
    wavePoints.push(`${i === 0 ? 'M' : 'L'}${wx.toFixed(1)},${wy.toFixed(1)}`);
  }
  const activeWaveX = waveLeft + (rad / (Math.PI * 2)) * waveWidth;

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center gap-1.5">
        {SPECIAL_ANGLES.map((item) => (
          <button
            key={item.deg}
            type="button"
            onClick={() => setDeg(item.deg)}
            className={`px-2.5 py-1 text-xs font-mono-tabular rounded-md border cursor-pointer ${
              deg === item.deg
                ? 'bg-[#1D4ED8] text-white border-[#1D4ED8] font-semibold'
                : 'bg-[#F8FAFC] text-[#334155] border-[#CBD5E1] hover:border-[#1D4ED8]'
            }`}
          >
            {item.radLabel} ({item.deg}°)
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        <div className="lg:col-span-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2">
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto block">
            {/* Unit Circle axes */}
            <line x1={cx - r - 20} y1={cy} x2={cx + r + 20} y2={cy} stroke="#CBD5E1" strokeWidth={1.5} />
            <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20} stroke="#CBD5E1" strokeWidth={1.5} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#94A3B8" strokeWidth={2} />

            {/* Right triangle legs: cos (blue) and sin (emerald) */}
            <line x1={cx} y1={cy} x2={px} y2={cy} stroke="#1D4ED8" strokeWidth={3} />
            <line x1={px} y1={cy} x2={px} y2={py} stroke="#059669" strokeWidth={3} />
            <line x1={cx} y1={cy} x2={px} y2={py} stroke="#0F172A" strokeWidth={2.25} />
            <circle cx={px} cy={py} r={5.5} fill="#0F172A" stroke="#FFFFFF" strokeWidth={2} />

            {/* Projection line from circle point to sine wave */}
            <line x1={px} y1={py} x2={activeWaveX} y2={py} stroke="#059669" strokeWidth={1.25} strokeDasharray="4 4" />

            {/* Right side sine wave */}
            <line x1={waveLeft} y1={cy} x2={waveLeft + waveWidth} y2={cy} stroke="#CBD5E1" strokeWidth={1.5} />
            <line x1={waveLeft} y1={cy - r - 15} x2={waveLeft} y2={cy + r + 15} stroke="#CBD5E1" strokeWidth={1.5} />
            <path d={wavePoints.join(' ')} fill="none" stroke="#059669" strokeWidth={2.5} />
            <circle cx={activeWaveX} cy={py} r={5.5} fill="#059669" stroke="#FFFFFF" strokeWidth={2} />

            <text x={cx} y={32} textAnchor="middle" fontSize="12" fill="#475569" fontWeight="600">
              Unit Circle (r = 1)
            </text>
            <text x={waveLeft + waveWidth / 2} y={32} textAnchor="middle" fontSize="12" fill="#059669" fontWeight="600">
              y = sin(θ) over [0, 2π]
            </text>
          </svg>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <label className="block space-y-1 text-xs">
            <div className="flex justify-between font-mono-tabular">
              <span className="font-sans text-[#475569]">Angle θ</span>
              <span className="font-semibold text-[#0F172A]">{deg}° ({rad.toFixed(2)} rad)</span>
            </div>
            <input type="range" min={0} max={360} step={5} value={deg} onChange={(e) => setDeg(Number(e.target.value))} className="w-full accent-[#1D4ED8]" />
          </label>

          <div className="space-y-2 text-xs font-mono-tabular">
            <div className="p-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg flex justify-between text-[#1E3A8A]">
              <span className="font-sans">cos(θ) (horizontal)</span>
              <span className="font-semibold">{cosV.toFixed(3)}</span>
            </div>
            <div className="p-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg flex justify-between text-[#065F46]">
              <span className="font-sans">sin(θ) (vertical)</span>
              <span className="font-semibold">{sinV.toFixed(3)}</span>
            </div>
            <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex justify-between text-[#0F172A]">
              <span className="font-sans">tan(θ) = sin/cos</span>
              <span className="font-semibold">
                {Math.abs(cosV) < 1e-4 ? 'Undefined' : (sinV / cosV).toFixed(3)}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#475569] leading-relaxed">
            Every point on the unit circle has coordinates (cos θ, sin θ), and cos²θ + sin²θ = 1 holds at every angle.
          </p>
        </div>
      </div>
    </div>
  );
}

export function InteractiveLab({ labType, title, objective }: InteractiveLabProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-display text-xl font-semibold text-[#0F172A]">{title}</h3>
        <p className="text-sm text-[#475569] max-w-3xl">{objective}</p>
      </div>

      {labType === 'prealg-functions' && <PreAlgFunctionsLab />}
      {labType === 'prealg-quadratics' && <PreAlgQuadraticsLab />}
      {labType === 'prealg-rationals' && <PreAlgRationalsLab />}
      {labType === 'prealg-exp-log' && <PreAlgExpLogLab />}
      {labType === 'prealg-unit-circle' && <PreAlgUnitCircleLab />}
      {labType === 'limit' && <LimitLab />}
      {labType === 'derivative' && <DerivativeLab showSecondDerivative={false} />}
      {labType === 'extrema' && <DerivativeLab showSecondDerivative={true} />}
      {labType === 'riemann' && <RiemannLab ibpFocus={false} />}
      {labType === 'ibp' && <RiemannLab ibpFocus={true} />}
      {labType === 'volume' && <VolumeLab />}
      {labType === 'trigsub' && <TrigSubLab />}
      {labType === 'improper' && <ImproperLab />}
      {labType === 'ode' && <OdeLab />}
      {labType === 'series' && <SeriesLab defaultPreset="pseries" />}
      {labType === 'alternating' && <SeriesLab defaultPreset="alternating_harmonic" />}
      {labType === 'taylor' && <TaylorLab />}
      {labType === 'polar' && <PolarLab />}
      {labType === 'triage' && <TriageLab />}
    </section>
  );
}
