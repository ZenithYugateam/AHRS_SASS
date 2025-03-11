import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

interface CompanySocialMediaProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
  isEditing: boolean;
}

const CompanySocialMedia: React.FC<CompanySocialMediaProps> = ({ formData, handleInputChange, isEditing }) => {
  const cardStyles = "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 hover:border-indigo-500/30";
  const inputStyles = "w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-500 transition-all duration-300 hover:border-indigo-500/50";
  const iconContainerStyles = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-500";
  const previewTextStyles = "text-lg font-medium text-gray-100";

  const socialLinks = [
    { key: 'facebook', icon: Facebook, label: 'Facebook' },
    { key: 'twitter', icon: Twitter, label: 'Twitter' },
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    { key: 'instagram', icon: Instagram, label: 'Instagram' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
        <Linkedin className="mr-2 h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
        Social Media Presence
      </h2>

      <div className={`${cardStyles} p-4`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {socialLinks.map(({ key, icon: Icon, label }) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-200 flex items-center">
                <Icon className="h-4 w-4 mr-2 text-indigo-500" />
                {label}
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className={iconContainerStyles}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <input
                    type="url"
                    className={`${inputStyles} pl-10`}
                    value={formData.companyProfile.socialMedia[key]}
                    onChange={(e) => handleInputChange('companyProfile', 'socialMedia', {
                      ...formData.companyProfile.socialMedia,
                      [key]: e.target.value
                    })}
                    placeholder={`${label} URL`}
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-indigo-500" />
                  {formData.companyProfile.socialMedia[key] ? (
                    <a
                      href={formData.companyProfile.socialMedia[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-indigo-400 transition-colors duration-300"
                    >
                      {formData.companyProfile.socialMedia[key]}
                    </a>
                  ) : (
                    <span className={previewTextStyles}>Not specified</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanySocialMedia;