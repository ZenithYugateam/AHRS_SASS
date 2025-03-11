import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface CompanyLocationsProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
  handleAddTag: (section: string, field: string, value: string, inputSetter: React.Dispatch<React.SetStateAction<string>>) => void;
  handleRemoveTag: (section: string, field: string, index: number) => void;
  isEditing: boolean;
}

const CompanyLocations: React.FC<CompanyLocationsProps> = ({ 
  formData, 
  handleInputChange, 
  handleAddTag, 
  handleRemoveTag,
  isEditing
}) => {
  const [locationInput, setLocationInput] = useState('');

  const cardStyles = "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 hover:border-indigo-500/30";
  const inputStyles = "w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-500 transition-all duration-300 hover:border-indigo-500/50";
  const tagStyles = "bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full text-sm flex items-center hover:bg-indigo-500/30 transition-colors duration-300";
  const buttonStyles = "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 px-4 py-3 rounded-r-lg transition-all duration-300 font-medium";
  const previewTextStyles = "text-lg font-medium text-gray-100";

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
        <MapPin className="mr-2 h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
        Company Locations
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${cardStyles} p-4`}>
          <label className="block text-sm font-medium mb-2 text-gray-200">Headquarters Location *</label>
          {isEditing ? (
            <input
              type="text"
              className={inputStyles}
              value={formData.companyProfile.headquarters}
              onChange={(e) => handleInputChange('companyProfile', 'headquarters', e.target.value)}
              required
            />
          ) : (
            <p className={previewTextStyles}>
              {formData.companyProfile.headquarters || 'Not specified'}
            </p>
          )}
        </div>

        <div className={`${cardStyles} p-4`}>
          <label className="block text-sm font-medium mb-2 text-gray-200">Office Locations</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.companyProfile.officeLocations.map((location, index) => (
              <span key={index} className={tagStyles}>
                {location}
                {isEditing && (
                  <button
                    type="button"
                    className="ml-2 text-indigo-500 hover:text-white"
                    onClick={() => handleRemoveTag('companyProfile', 'officeLocations', index)}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
          {isEditing && (
            <div className="flex">
              <input
                type="text"
                className={`${inputStyles} rounded-r-none`}
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Add office location"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag('companyProfile', 'officeLocations', locationInput, setLocationInput);
                  }
                }}
              />
              <button
                type="button"
                className={buttonStyles}
                onClick={() => handleAddTag('companyProfile', 'officeLocations', locationInput, setLocationInput)}
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyLocations;