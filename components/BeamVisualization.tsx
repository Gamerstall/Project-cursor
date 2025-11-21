'use client';
import { useMemo } from 'react';
import { CalculationResult } from '@/types/beam';
import { formatDeflection } from '@/lib/calculations';

interface BeamVisualizationProps {
  spanLength: number;
  units: 'metric' | 'imperial';
  load: number;
  result: CalculationResult | null;
}

const svgWidth = 700;
const svgHeight = 220;
const baselineY = svgHeight / 2;

function getSpanUnitLabel(units: 'metric' | 'imperial') {
  return units === 'metric' ? 'm' : 'ft';
}

function getLoadUnitLabel(units: 'metric' | 'imperial') {
  return units === 'metric' ? 'N' : 'lb';
}

export default function BeamVisualization({ spanLength, units, load, result }: BeamVisualizationProps) {
  const hasResult = !!(result && result.isValid);

  const { curvePath, areaPath, scaleLabel, hasDeflection } = useMemo(() => {
    if (!hasResult || !result) {
      return {
        curvePath: `M 0 ${baselineY} L ${svgWidth} ${baselineY}`,
        areaPath: `M 0 ${baselineY} L ${svgWidth} ${baselineY} L ${svgWidth} ${baselineY} L 0 ${baselineY} Z`,
        scaleLabel: '0',
        hasDeflection: false,
      };
    }

    const points = result.deflectionPoints ?? [];

    if (points.length === 0) {
      return {
        curvePath: `M 0 ${baselineY} L ${svgWidth} ${baselineY}`,
        areaPath: `M 0 ${baselineY} L ${svgWidth} ${baselineY} L ${svgWidth} ${baselineY} L 0 ${baselineY} Z`,
        scaleLabel: '0',
        hasDeflection: false,
      };
    }

    const maxAbsDeflection = points.reduce(
      (max, point) => Math.max(max, Math.abs(point.deflection)),
      Math.abs(result.maxDeflection)
    );

    const verticalScale =
      maxAbsDeflection > 0 ? (svgHeight / 2 - 40) / maxAbsDeflection : 0;

    const pathSegments: string[] = [];

    points.forEach((point, index) => {
      const x = point.position * svgWidth;
      const y = baselineY + point.deflection * verticalScale;
      pathSegments.push(`${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
    });

    const curvePath = pathSegments.join(' ');
    const areaPath = `${curvePath} L ${svgWidth} ${baselineY} L 0 ${baselineY} Z`;

    return {
      curvePath,
      areaPath,
      scaleLabel: maxAbsDeflection.toExponential(2),
      hasDeflection: maxAbsDeflection > 0,
    };
  }, [hasResult, result]);

  const spanLabel =
    spanLength > 0 ? `${spanLength.toFixed(2)} ${getSpanUnitLabel(units)}` : '—';
  const loadLabel = load > 0 ? `${load.toFixed(2)} ${getLoadUnitLabel(units)}` : 'No load applied';
  const deflectionLabel =
    hasResult && result
      ? formatDeflection(result.maxDeflection, result.units)
      : 'Awaiting valid inputs';

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800">Beam Deflection Visualization</h3>
      <p className="text-sm text-gray-600 mt-1">
        Visual guide to how the span flexes under the current point load.
      </p>

      <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        {hasResult ? (
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            role="img"
            aria-label="Beam deflection curve"
            className="w-full h-auto"
          >
            <defs>
              <linearGradient id="deflection-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <rect
              x={0}
              y={baselineY - 6}
              width={svgWidth}
              height={12}
              fill="#1f2937"
              opacity={0.12}
            />
            <line
              x1={0}
              y1={baselineY}
              x2={svgWidth}
              y2={baselineY}
              stroke="#1f2937"
              strokeWidth={2}
              strokeDasharray="6 6"
              opacity={0.4}
            />
            <rect x={0} y={baselineY - 40} width={20} height={80} fill="#9ca3af" opacity={0.35} />
            <rect
              x={svgWidth - 20}
              y={baselineY - 40}
              width={20}
              height={80}
              fill="#9ca3af"
              opacity={0.35}
            />
            <line
              x1={svgWidth / 2}
              y1={baselineY - 70}
              x2={svgWidth / 2}
              y2={baselineY - 10}
              stroke="#ef4444"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <polygon
              points={`${svgWidth / 2 - 8},${baselineY - 10} ${svgWidth / 2 + 8},${baselineY - 10} ${svgWidth / 2},${baselineY + 4}`}
              fill="#ef4444"
            />
            <path d={areaPath} fill="url(#deflection-fill)" opacity={hasDeflection ? 0.9 : 0} />
            <path
              d={curvePath}
              fill="none"
              stroke="#2563eb"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <div className="text-sm text-gray-500">
            Provide a positive load and span length to view the deflection curve.
          </div>
        )}

        {hasResult && (
          <div className="mt-4 text-xs text-gray-400">
            Scale reference (max |δ| in base units): {scaleLabel}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="bg-white border border-gray-200 rounded-md p-3 shadow-sm">
          <div className="text-gray-500 uppercase tracking-wide text-xs">Span</div>
          <div className="text-lg font-semibold text-gray-800">{spanLabel}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-3 shadow-sm">
          <div className="text-gray-500 uppercase tracking-wide text-xs">Load</div>
          <div className="text-lg font-semibold text-gray-800">{loadLabel}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-3 shadow-sm">
          <div className="text-gray-500 uppercase tracking-wide text-xs">Max Deflection</div>
          <div className="text-lg font-semibold text-emerald-600">{deflectionLabel}</div>
        </div>
      </div>
    </div>
  );
}


