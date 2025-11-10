import { BeamInput, CalculationResult, BeamSection, DeflectionPoint } from '@/types/beam';
import { getSectionByName } from './beamSections';

/**
 * Calculate moment of inertia for a rectangular cross-section
 * I = (b * h^3) / 12
 */
export function calculateMomentOfInertiaRectangular(width: number, height: number): number {
  return (width * Math.pow(height, 3)) / 12;
}

/**
 * Calculate distance from neutral axis to outer fiber for rectangular section
 * c = h / 2
 */
export function calculateC(height: number): number {
  return height / 2;
}

/**
 * Calculate maximum bending moment for fixed-fixed beam with point load at center
 * M = PL / 8
 */
export function calculateBendingMoment(load: number, spanLength: number): number {
  return (load * spanLength) / 8;
}

/**
 * Calculate bending stress
 * σ = Mc / I
 * Where: M = moment, c = distance to outer fiber, I = moment of inertia
 */
export function calculateBendingStress(
  moment: number,
  c: number,
  momentOfInertia: number
): number {
  if (momentOfInertia === 0) {
    return 0;
  }
  return (moment * c) / momentOfInertia;
}

/**
 * Main calculation function for beam stress
 */
function convertSpanToBaseUnits(spanLength: number, units: 'metric' | 'imperial'): number {
  return units === 'imperial' ? spanLength * 12 : spanLength; // ft -> in for imperial
}

function calculateDeflectionProfile(
  load: number,
  spanLength: number,
  modulusOfElasticity: number,
  momentOfInertia: number,
  units: 'metric' | 'imperial',
  segments = 40
): { maxDeflection: number; deflectionPoints: DeflectionPoint[] } {
  const deflectionPoints: DeflectionPoint[] = [];

  if (segments < 2) {
    segments = 2;
  }

  if (load <= 0 || spanLength <= 0 || modulusOfElasticity <= 0 || momentOfInertia <= 0) {
    for (let i = 0; i <= segments; i++) {
      const position = i / segments;
      deflectionPoints.push({ position, deflection: 0 });
    }
    return {
      maxDeflection: 0,
      deflectionPoints,
    };
  }

  const spanBase = convertSpanToBaseUnits(spanLength, units);
  const effectiveLoad = load;
  const EI = modulusOfElasticity * momentOfInertia;
  const halfSpan = spanBase / 2;

  for (let i = 0; i <= segments; i++) {
    const position = i / segments;
    const x = position * spanBase;
    const localX = x <= halfSpan ? x : spanBase - x;
    const innerTerm = (3 * Math.pow(spanBase, 2)) / 4 - Math.pow(localX, 2);
    const deflection = (effectiveLoad * localX * innerTerm) / (48 * EI);
    deflectionPoints.push({ position, deflection });
  }

  const maxDeflection = (effectiveLoad * Math.pow(spanBase, 3)) / (192 * EI);

  return {
    maxDeflection,
    deflectionPoints,
  };
}

export function formatDeflection(deflection: number, units: 'metric' | 'imperial'): string {
  const absValue = Math.abs(deflection);

  if (units === 'metric') {
    if (absValue >= 1) {
      return `${deflection.toFixed(3)} m`;
    }
    if (absValue >= 1e-3) {
      return `${(deflection * 1e3).toFixed(2)} mm`;
    }
    return `${(deflection * 1e6).toFixed(1)} µm`;
  }

  // Imperial units (inches)
  if (absValue >= 1) {
    return `${deflection.toFixed(3)} in`;
  }
  if (absValue >= 0.01) {
    return `${deflection.toFixed(3)} in`;
  }
  return `${(deflection * 1000).toFixed(1)} mils`;
}

export function calculateBeamStress(input: BeamInput): CalculationResult {
  const result: CalculationResult = {
    bendingMoment: 0,
    bendingStress: 0,
    maxBendingStress: 0,
    maxDeflection: 0,
    deflectionPoints: [],
    deflectionUnits: input.units === 'metric' ? 'm' : 'in',
    units: input.units,
    isValid: false,
  };

  // Validate inputs
  if (input.load <= 0 || input.spanLength <= 0) {
    result.error = 'Load and span length must be greater than zero';
    return result;
  }

  if (input.modulusOfElasticity <= 0) {
    result.error = 'Modulus of elasticity must be greater than zero';
    return result;
  }

  // Calculate bending moment
  const moment = calculateBendingMoment(input.load, input.spanLength);
  result.bendingMoment = moment;

  let momentOfInertia: number;
  let c: number;

  if (input.beamType === 'standard') {
    // Use standard section properties
    if (!input.standardSection) {
      result.error = 'Standard section must be selected';
      return result;
    }

    const section = getSectionByName(input.standardSection, input.units);
    if (!section) {
      result.error = 'Standard section not found';
      return result;
    }

    momentOfInertia = section.momentOfInertia;
    c = section.c;
  } else {
    // Custom beam - calculate from dimensions
    if (!input.width || !input.height) {
      result.error = 'Width and height are required for custom beams';
      return result;
    }

    if (input.width <= 0 || input.height <= 0) {
      result.error = 'Width and height must be greater than zero';
      return result;
    }

    // Use provided I if available, otherwise calculate from dimensions
    if (input.momentOfInertia && input.momentOfInertia > 0) {
      momentOfInertia = input.momentOfInertia;
      c = calculateC(input.height);
    } else {
      momentOfInertia = calculateMomentOfInertiaRectangular(input.width, input.height);
      c = calculateC(input.height);
    }
  }

  // Calculate bending stress
  const stress = calculateBendingStress(moment, c, momentOfInertia);
  result.bendingStress = stress;
  result.maxBendingStress = Math.abs(stress);

  const { maxDeflection, deflectionPoints } = calculateDeflectionProfile(
    input.load,
    input.spanLength,
    input.modulusOfElasticity,
    momentOfInertia,
    input.units
  );

  result.maxDeflection = maxDeflection;
  result.deflectionPoints = deflectionPoints;
  result.isValid = true;

  return result;
}

/**
 * Format number with appropriate units
 */
export function formatStress(stress: number, units: 'metric' | 'imperial'): string {
  if (units === 'metric') {
    if (Math.abs(stress) >= 1e6) {
      return `${(stress / 1e6).toFixed(2)} MPa`;
    } else if (Math.abs(stress) >= 1e3) {
      return `${(stress / 1e3).toFixed(2)} kPa`;
    } else {
      return `${stress.toFixed(2)} Pa`;
    }
  } else {
    // Imperial: psi
    if (Math.abs(stress) >= 1e6) {
      return `${(stress / 1e6).toFixed(2)} Mpsi`;
    } else if (Math.abs(stress) >= 1e3) {
      return `${(stress / 1e3).toFixed(2)} ksi`;
    } else {
      return `${stress.toFixed(2)} psi`;
    }
  }
}

export function formatMoment(moment: number, units: 'metric' | 'imperial'): string {
  if (units === 'metric') {
    return `${moment.toFixed(2)} N·m`;
  } else {
    return `${moment.toFixed(2)} lb·ft`;
  }
}

