'use client';

import { useState, useEffect } from 'react';
import { BeamInput, CalculationResult } from '@/types/beam';
import { calculateBeamStress } from '@/lib/calculations';
import StandardSections from './StandardSections';
import ResultDisplay from './ResultDisplay';
import BeamVisualization from './BeamVisualization';

export default function BeamCalculator() {
  const [input, setInput] = useState<BeamInput>({
    load: 0,
    spanLength: 0,
    beamType: 'custom',
    width: 0,
    height: 0,
    modulusOfElasticity: 200000000000, // Default: 200 GPa for steel (metric)
    units: 'metric',
    standardSection: '',
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    if (input.load > 0 && input.spanLength > 0) {
      const calculatedResult = calculateBeamStress(input);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [input]);

  const handleInputChange = <K extends keyof BeamInput>(field: K, value: BeamInput[K]) => {
    setInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUnitsChange = (newUnits: 'metric' | 'imperial') => {
    // Convert values when switching units
    const conversionFactor = newUnits === 'imperial' ? 3.28084 : 1 / 3.28084; // m to ft
    
    setInput((prev) => ({
      ...prev,
      units: newUnits,
      spanLength: prev.spanLength * conversionFactor,
      width: prev.width ? prev.width * conversionFactor : 0,
      height: prev.height ? prev.height * conversionFactor : 0,
      // Convert load: N to lb (1 N = 0.224809 lb)
      load: newUnits === 'imperial' ? prev.load * 0.224809 : prev.load / 0.224809,
      // Convert E: Pa to psi (1 Pa = 0.000145038 psi)
      modulusOfElasticity: newUnits === 'imperial' 
        ? prev.modulusOfElasticity * 0.000145038 
        : prev.modulusOfElasticity / 0.000145038,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Beam Stress Load Calculator
        </h1>
        <p className="text-gray-600 mb-6">
          Calculate bending stress for a fixed-fixed beam with a point load at the center
        </p>

        {/* Units Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="units"
                value="metric"
                checked={input.units === 'metric'}
                onChange={() => handleUnitsChange('metric')}
                className="mr-2"
              />
              Metric (N, m, Pa)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="units"
                value="imperial"
                checked={input.units === 'imperial'}
                onChange={() => handleUnitsChange('imperial')}
                className="mr-2"
              />
              Imperial (lb, ft, psi)
            </label>
          </div>
        </div>

        {/* Load Input */}
        <div className="mb-4">
          <label htmlFor="load" className="block text-sm font-medium text-gray-700 mb-2">
            Point Load (P) {input.units === 'metric' ? '(N)' : '(lb)'}
          </label>
          <input
            type="number"
            id="load"
            value={input.load || ''}
            onChange={(e) => handleInputChange('load', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter load"
            min="0"
            step="0.01"
          />
        </div>

        {/* Span Length Input */}
        <div className="mb-4">
          <label htmlFor="spanLength" className="block text-sm font-medium text-gray-700 mb-2">
            Span Length (L) {input.units === 'metric' ? '(m)' : '(ft)'}
          </label>
          <input
            type="number"
            id="spanLength"
            value={input.spanLength || ''}
            onChange={(e) => handleInputChange('spanLength', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter span length"
            min="0"
            step="0.01"
          />
        </div>

        {/* Beam Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Beam Type</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="beamType"
                value="custom"
                checked={input.beamType === 'custom'}
                onChange={() => handleInputChange('beamType', 'custom')}
                className="mr-2"
              />
              Custom Dimensions
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="beamType"
                value="standard"
                checked={input.beamType === 'standard'}
                onChange={() => handleInputChange('beamType', 'standard')}
                className="mr-2"
              />
              Standard Section
            </label>
          </div>
        </div>

        {/* Custom Beam Dimensions */}
        {input.beamType === 'custom' && (
          <div className="mb-4 space-y-4 p-4 bg-gray-50 rounded-md">
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">
                Width (b) {input.units === 'metric' ? '(m)' : '(in)'}
              </label>
              <input
                type="number"
                id="width"
                value={input.width || ''}
                onChange={(e) => handleInputChange('width', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter width"
                min="0"
                step="0.001"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                Height/Depth (h) {input.units === 'metric' ? '(m)' : '(in)'}
              </label>
              <input
                type="number"
                id="height"
                value={input.height || ''}
                onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter height"
                min="0"
                step="0.001"
              />
            </div>
            <div>
              <label htmlFor="momentOfInertia" className="block text-sm font-medium text-gray-700 mb-2">
                Moment of Inertia (I) {input.units === 'metric' ? '(m⁴)' : '(in⁴)'} (Optional)
              </label>
              <input
                type="number"
                id="momentOfInertia"
                value={input.momentOfInertia || ''}
                onChange={(e) => handleInputChange('momentOfInertia', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter moment of inertia (optional)"
                min="0"
                step="0.000001"
              />
              <p className="mt-1 text-xs text-gray-500">
                If not provided, I will be calculated from width and height for a rectangular section
              </p>
            </div>
          </div>
        )}

        {/* Standard Sections */}
        {input.beamType === 'standard' && (
          <div className="mb-4">
            <StandardSections
              units={input.units}
              selectedSection={input.standardSection || ''}
              onSectionChange={(section) => handleInputChange('standardSection', section)}
            />
          </div>
        )}

        {/* Material Properties */}
        <div className="mb-4">
          <label htmlFor="modulusOfElasticity" className="block text-sm font-medium text-gray-700 mb-2">
            Modulus of Elasticity (E) {input.units === 'metric' ? '(Pa)' : '(psi)'}
          </label>
          <input
            type="number"
            id="modulusOfElasticity"
            value={input.modulusOfElasticity || ''}
            onChange={(e) => handleInputChange('modulusOfElasticity', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={input.units === 'metric' ? 'e.g., 200000000000 for steel (200 GPa)' : 'e.g., 29000000 for steel (29 Mpsi)'}
            min="0"
            step="1000000"
          />
          <p className="mt-1 text-xs text-gray-500">
            Common values: Steel ≈ {input.units === 'metric' ? '200 GPa' : '29 Mpsi'}, 
            Concrete ≈ {input.units === 'metric' ? '20-30 GPa' : '3-4 Mpsi'}
          </p>
        </div>

        {/* Results Display */}
        <ResultDisplay result={result} />
        <BeamVisualization
          spanLength={input.spanLength}
          units={input.units}
          load={input.load}
          result={result}
        />
      </div>
    </div>
  );
}

