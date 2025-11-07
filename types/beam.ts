export interface BeamInput {
  load: number; // P - point load at center (N or lb)
  spanLength: number; // L - span length (m or ft)
  beamType: 'custom' | 'standard';
  // Custom beam properties
  width?: number; // width of cross-section (m or in)
  height?: number; // height/depth of cross-section (m or in)
  momentOfInertia?: number; // I - moment of inertia (m^4 or in^4)
  // Standard section
  standardSection?: string; // section name/identifier
  // Material properties
  modulusOfElasticity: number; // E - modulus of elasticity (Pa or psi)
  units: 'metric' | 'imperial';
}

export interface BeamSection {
  name: string;
  depth: number; // depth of beam (m or in)
  width: number; // width of flange (m or in)
  momentOfInertia: number; // I (m^4 or in^4)
  sectionModulus: number; // S = I/c (m^3 or in^3)
  c: number; // distance from neutral axis to outer fiber (m or in)
}

export interface MaterialProperties {
  modulusOfElasticity: number; // E (Pa or psi)
  units: 'metric' | 'imperial';
}

export interface CalculationResult {
  bendingMoment: number; // M = PL/8 (N·m or lb·ft)
  bendingStress: number; // σ = Mc/I (Pa or psi)
  maxBendingStress: number; // Maximum stress value
  units: 'metric' | 'imperial';
  isValid: boolean;
  error?: string;
}

