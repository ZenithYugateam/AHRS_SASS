import React from 'react';
import { Heart } from 'lucide-react';

interface CompanyCultureProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
  isEditing: boolean;
}

const CompanyCulture: React.FC<CompanyCultureProps> = ({ formData, handleInputChange, isEditing }) => {
  const cardStyles = "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 hover:border-indigo-500/30";
  const textareaStyles = "w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-500 transition-all duration-300 hover:border-indigo-500/50";
  const previewTextStyles = "text-lg font-medium text-gray-100 whitespace-pre-wrap";

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
        <Heart className="mr-2 h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
        Culture & Values
      </h2>

      <div className={`${cardStyles} p-4`}>
        <label className="block text-sm font-medium mb-2 text-gray-200">Company Culture and Values *</label>
        {isEditing ? (
          <textarea
            className={`${textareaStyles} h-32`}
            value={formData.companyProfile.culture}
            onChange={(e) => handleInputChange('companyProfile', 'culture', e.target.value)}
            placeholder="Describe your company's culture and core values"
            required
          ></textarea>
        ) : (
          <p className={previewTextStyles}>
            {formData.companyProfile.culture || 'Not specified'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${cardStyles} p-4`}>
          <label className="block text-sm font-medium mb-2 text-gray-200">Mission Statement *</label>
          {isEditing ? (
            <textarea
              className={`${textareaStyles} h-24`}
              value={formData.companyProfile.mission}
              onChange={(e) => handleInputChange('companyProfile', 'mission', e.target.value)}
              placeholder="Enter your company's mission statement"
              required
            ></textarea>
          ) : (
            <p className={previewTextStyles}>
              {formData.companyProfile.mission || 'Not specified'}
            </p>
          )}
        </div>

        <div className={`${cardStyles} p-4`}>
          <label className="block text-sm font-medium mb-2 text-gray-200">Vision Statement *</label>
          {isEditing ? (
            <textarea
              className={`${textareaStyles} h-24`}
              value={formData.companyProfile.vision}
              onChange={(e) => handleInputChange('companyProfile', 'vision', e.target.value)}
              placeholder="Enter your company's vision statement"
              required
            ></textarea>
          ) : (
            <p className={previewTextStyles}>
              {formData.companyProfile.vision || 'Not specified'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCulture;