'use client';

import { getStandardSections } from '@/lib/beamSections';
import { BeamSection } from '@/types/beam';

interface StandardSectionsProps {
  units: 'metric' | 'imperial';
  selectedSection: string;
  onSectionChange: (section: string) => void;
}

export default function StandardSections({
  units,
  selectedSection,
  onSectionChange,
}: StandardSectionsProps) {
  const sections = getStandardSections(units);

  return (
    <div className="w-full">
      <label htmlFor="standard-section" className="block text-sm font-medium text-gray-700 mb-2">
        Standard Beam Section
      </label>
      <select
        id="standard-section"
        value={selectedSection}
        onChange={(e) => onSectionChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select a section</option>
        {sections.map((section: BeamSection) => (
          <option key={section.name} value={section.name}>
            {section.name} (Depth: {section.depth.toFixed(2)} {units === 'metric' ? 'm' : 'in'})
          </option>
        ))}
      </select>
      {selectedSection && (
        <div className="mt-2 text-sm text-gray-600">
          {(() => {
            const section = sections.find((s) => s.name === selectedSection);
            if (section) {
              return (
                <div className="space-y-1">
                  <p>Depth: {section.depth.toFixed(3)} {units === 'metric' ? 'm' : 'in'}</p>
                  <p>Width: {section.width.toFixed(3)} {units === 'metric' ? 'm' : 'in'}</p>
                  <p>I: {section.momentOfInertia.toFixed(6)} {units === 'metric' ? 'm⁴' : 'in⁴'}</p>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}
    </div>
  );
}

