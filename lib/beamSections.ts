import { BeamSection } from '@/types/beam';

// Standard steel beam sections database
// Properties in metric (SI) units
export const standardSectionsMetric: BeamSection[] = [
  // W-shapes (Wide Flange)
  { name: 'W14x22', depth: 0.356, width: 0.102, momentOfInertia: 0.000199, sectionModulus: 0.00112, c: 0.178 },
  { name: 'W14x30', depth: 0.358, width: 0.135, momentOfInertia: 0.000291, sectionModulus: 0.00163, c: 0.179 },
  { name: 'W14x38', depth: 0.358, width: 0.172, momentOfInertia: 0.000385, sectionModulus: 0.00215, c: 0.179 },
  { name: 'W14x48', depth: 0.356, width: 0.203, momentOfInertia: 0.000485, sectionModulus: 0.00272, c: 0.178 },
  { name: 'W14x61', depth: 0.358, width: 0.254, momentOfInertia: 0.000636, sectionModulus: 0.00355, c: 0.179 },
  { name: 'W16x26', depth: 0.403, width: 0.102, momentOfInertia: 0.000301, sectionModulus: 0.00149, c: 0.2015 },
  { name: 'W16x31', depth: 0.403, width: 0.135, momentOfInertia: 0.000376, sectionModulus: 0.00187, c: 0.2015 },
  { name: 'W16x40', depth: 0.399, width: 0.178, momentOfInertia: 0.000518, sectionModulus: 0.00260, c: 0.1995 },
  { name: 'W16x50', depth: 0.403, width: 0.203, momentOfInertia: 0.000659, sectionModulus: 0.00327, c: 0.2015 },
  { name: 'W18x35', depth: 0.457, width: 0.152, momentOfInertia: 0.000510, sectionModulus: 0.00223, c: 0.2285 },
  { name: 'W18x50', depth: 0.457, width: 0.190, momentOfInertia: 0.000753, sectionModulus: 0.00329, c: 0.2285 },
  { name: 'W18x65', depth: 0.460, width: 0.229, momentOfInertia: 0.000978, sectionModulus: 0.00425, c: 0.230 },
  { name: 'W21x44', depth: 0.533, width: 0.165, momentOfInertia: 0.000843, sectionModulus: 0.00316, c: 0.2665 },
  { name: 'W21x57', depth: 0.533, width: 0.216, momentOfInertia: 0.00117, sectionModulus: 0.00439, c: 0.2665 },
  { name: 'W21x68', depth: 0.533, width: 0.254, momentOfInertia: 0.00141, sectionModulus: 0.00529, c: 0.2665 },
  { name: 'W24x55', depth: 0.610, width: 0.203, momentOfInertia: 0.00135, sectionModulus: 0.00443, c: 0.305 },
  { name: 'W24x76', depth: 0.610, width: 0.229, momentOfInertia: 0.00187, sectionModulus: 0.00613, c: 0.305 },
  { name: 'W27x84', depth: 0.686, width: 0.254, momentOfInertia: 0.00285, sectionModulus: 0.00831, c: 0.343 },
  { name: 'W30x99', depth: 0.762, width: 0.267, momentOfInertia: 0.00428, sectionModulus: 0.0112, c: 0.381 },
  { name: 'W36x135', depth: 0.914, width: 0.305, momentOfInertia: 0.00875, sectionModulus: 0.0191, c: 0.457 },
];

// Standard steel beam sections in imperial units
export const standardSectionsImperial: BeamSection[] = [
  // W-shapes (Wide Flange) - converted to imperial
  { name: 'W14x22', depth: 14.0, width: 4.02, momentOfInertia: 199, sectionModulus: 28.3, c: 7.0 },
  { name: 'W14x30', depth: 14.1, width: 5.31, momentOfInertia: 291, sectionModulus: 41.1, c: 7.05 },
  { name: 'W14x38', depth: 14.1, width: 6.77, momentOfInertia: 385, sectionModulus: 54.3, c: 7.05 },
  { name: 'W14x48', depth: 14.0, width: 7.99, momentOfInertia: 485, sectionModulus: 68.7, c: 7.0 },
  { name: 'W14x61', depth: 14.1, width: 10.0, momentOfInertia: 636, sectionModulus: 89.6, c: 7.05 },
  { name: 'W16x26', depth: 15.9, width: 4.02, momentOfInertia: 301, sectionModulus: 37.6, c: 7.95 },
  { name: 'W16x31', depth: 15.9, width: 5.31, momentOfInertia: 376, sectionModulus: 47.2, c: 7.95 },
  { name: 'W16x40', depth: 15.7, width: 7.01, momentOfInertia: 518, sectionModulus: 65.6, c: 7.85 },
  { name: 'W16x50', depth: 15.9, width: 7.99, momentOfInertia: 659, sectionModulus: 82.6, c: 7.95 },
  { name: 'W18x35', depth: 18.0, width: 5.98, momentOfInertia: 510, sectionModulus: 56.3, c: 9.0 },
  { name: 'W18x50', depth: 18.0, width: 7.48, momentOfInertia: 753, sectionModulus: 83.0, c: 9.0 },
  { name: 'W18x65', depth: 18.1, width: 9.02, momentOfInertia: 978, sectionModulus: 107, c: 9.05 },
  { name: 'W21x44', depth: 21.0, width: 6.50, momentOfInertia: 843, sectionModulus: 80.3, c: 10.5 },
  { name: 'W21x57', depth: 21.0, width: 8.50, momentOfInertia: 1170, sectionModulus: 111, c: 10.5 },
  { name: 'W21x68', depth: 21.0, width: 10.0, momentOfInertia: 1410, sectionModulus: 134, c: 10.5 },
  { name: 'W24x55', depth: 24.0, width: 7.99, momentOfInertia: 1350, sectionModulus: 112, c: 12.0 },
  { name: 'W24x76', depth: 24.0, width: 9.02, momentOfInertia: 1870, sectionModulus: 155, c: 12.0 },
  { name: 'W27x84', depth: 27.0, width: 10.0, momentOfInertia: 2850, sectionModulus: 211, c: 13.5 },
  { name: 'W30x99', depth: 30.0, width: 10.5, momentOfInertia: 4280, sectionModulus: 285, c: 15.0 },
  { name: 'W36x135', depth: 36.0, width: 12.0, momentOfInertia: 8750, sectionModulus: 485, c: 18.0 },
];

export function getStandardSections(units: 'metric' | 'imperial'): BeamSection[] {
  return units === 'metric' ? standardSectionsMetric : standardSectionsImperial;
}

export function getSectionByName(name: string, units: 'metric' | 'imperial'): BeamSection | undefined {
  const sections = getStandardSections(units);
  return sections.find(section => section.name === name);
}

