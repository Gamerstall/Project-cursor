'use client';

import { CalculationResult } from '@/types/beam';
import { formatStress, formatMoment } from '@/lib/calculations';

interface ResultDisplayProps {
  result: CalculationResult | null;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result || !result.isValid) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Calculation Results</h3>
        {result?.error ? (
          <div className="text-red-600">{result.error}</div>
        ) : (
          <div className="text-gray-500">Enter beam parameters to calculate stress</div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Calculation Results</h3>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Maximum Bending Moment</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatMoment(result.bendingMoment, result.units)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Maximum Bending Stress</div>
          <div className="text-3xl font-bold text-red-600">
            {formatStress(result.maxBendingStress, result.units)}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-300">
          <div className="text-sm text-gray-600">
            <p className="mb-1">
              <strong>Formula:</strong> σ = Mc/I
            </p>
            <p className="mb-1">
              <strong>Where:</strong> M = PL/8 (for fixed-fixed beam with center load)
            </p>
            <p>
              <strong>Note:</strong> This calculation assumes a fixed-fixed beam with a point load
              at the center of the span.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

