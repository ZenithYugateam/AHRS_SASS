import React from 'react';
import { Briefcase } from 'lucide-react';

interface CompanyBusinessDetailsProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
  isEditing: boolean;
}

const CompanyBusinessDetails: React.FC<CompanyBusinessDetailsProps> = ({ formData, handleInputChange, isEditing }) => {
  const businessTypes = ['B2B', 'B2C', 'B2B2C', 'D2C', 'Other'];
  const revenueRanges = [
    'Less than $1M', '$1M - $10M', '$10M - $50M', '$50M - $100M',
    '$100M - $500M', '$500M - $1B', 'More than $1B', 'Prefer not to disclose'
  ];

  const cardStyles = "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 hover:border-indigo-500/30";
  const selectStyles = "w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 hover:border-indigo-500/50";
  const previewTextStyles = "text-lg font-medium text-gray-100";

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
        <Briefcase className="mr-2 h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
        Business Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${cardStyles} p-4`}>
          <label className="block text-sm font-medium mb-2 text-gray-200">Business Type *</label>
          {isEditing ? (
            <select
              className={selectStyles}
              value={formData.companyProfile.businessType}
              onChange={(e) => handleInputChange('companyProfile', 'businessType', e.target.value)}
              required
            >
              <option value="">Select business type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          ) : (
            <p className={previewTextStyles}>
              {formData.companyProfile.businessType || 'Not specified'}
            </p>
          )}
        </div>

        <div className={`${cardStyles} p-4`}>
          <label className="block text-sm font-medium mb-2 text-gray-200">Annual Revenue Range</label>
          {isEditing ? (
            <select
              className={selectStyles}
              value={formData.companyProfile.revenueRange}
              onChange={(e) => handleInputChange('companyProfile', 'revenueRange', e.target.value)}
            >
              <option value="">Select revenue range</option>
              {revenueRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          ) : (
            <p className={previewTextStyles}>
              {formData.companyProfile.revenueRange || 'Not specified'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyBusinessDetails;