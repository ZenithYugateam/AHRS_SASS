import React from 'react';
import { Users } from 'lucide-react';

interface CompanyLeadershipProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
  isEditing: boolean;
}

const CompanyLeadership: React.FC<CompanyLeadershipProps> = ({ formData, handleInputChange, isEditing }) => {
  const cardStyles = "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 hover:border-indigo-500/30";
  const textareaStyles = "w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-500 transition-all duration-300 hover:border-indigo-500/50";
  const previewTextStyles = "text-lg font-medium text-gray-100 whitespace-pre-wrap";

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
        <Users className="mr-2 h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
        Leadership Team
      </h2>

      <div className={`${cardStyles} p-4`}>
        <label className="block text-sm font-medium mb-2 text-gray-200">Leadership Team Structure *</label>
        {isEditing ? (
          <textarea
            className={`${textareaStyles} h-48`}
            value={formData.companyProfile.leadership}
            onChange={(e) => handleInputChange('companyProfile', 'leadership', e.target.value)}
            placeholder="Describe your leadership team structure, including key positions and responsibilities"
            required
          ></textarea>
        ) : (
          <p className={previewTextStyles}>
            {formData.companyProfile.leadership || 'Not specified'}
          </p>
        )}
        {isEditing && (
          <p className="mt-2 text-xs text-gray-400">
            Include information about key executives, their roles, and areas of responsibility
          </p>
        )}
      </div>
    </div>
  );
};

export default CompanyLeadership;