import React, { useRef } from 'react';
import { Building2, Users, Calendar, Globe, Upload } from 'lucide-react';

interface CompanyBasicInfoProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
  handleLogoUpload: (file: File) => void;
  isEditing: boolean;
}

const CompanyBasicInfo: React.FC<CompanyBasicInfoProps> = ({ 
  formData, 
  handleInputChange,
  handleLogoUpload,
  isEditing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const companySizeRanges = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', 
    '1001-5000', '5001-10000', '10000+'
  ];

  const inputStyles = "w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-500 transition-all duration-300 hover:border-indigo-500/50";
  const cardStyles = "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 hover:border-indigo-500/30";
  const labelStyles = "block text-sm font-medium mb-2 text-gray-200";
  const previewTextStyles = "text-lg font-medium text-gray-100";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleLogoUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
        <Building2 className="mr-2 h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
        Basic Information
      </h2>

      <div className={`${cardStyles} p-6`}>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Logo Section */}
          <div className="w-full md:w-1/3">
            <label className={labelStyles}>Company Logo</label>
            <div className="relative aspect-square w-full max-w-[200px] mx-auto">
              {formData.companyProfile.logo ? (
                <div className="relative w-full h-full">
                  <img
                    src={formData.companyProfile.logo}
                    alt="Company Logo"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
                    >
                      <Upload className="h-8 w-8" />
                    </button>
                  )}
                </div>
              ) : (
                isEditing ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full border-2 border-dashed border-indigo-500/30 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-indigo-500/50 transition-colors duration-300"
                  >
                    <Upload className="h-8 w-8 text-indigo-500" />
                    <span className="text-sm text-gray-400">Upload Logo</span>
                  </button>
                ) : (
                  <div className="w-full h-full border-2 border-dashed border-indigo-500/30 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-400">No logo uploaded</span>
                  </div>
                )
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Company Details */}
          <div className="flex-1 space-y-4 w-full">
            {isEditing ? (
              <>
                <div>
                  <label className={labelStyles}>Company Name *</label>
                  <input
                    type="text"
                    className={inputStyles}
                    value={formData.companyProfile.name}
                    onChange={(e) => handleInputChange('companyProfile', 'name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className={labelStyles}>Industry/Sector *</label>
                  <input
                    type="text"
                    className={inputStyles}
                    value={formData.companyProfile.industry}
                    onChange={(e) => handleInputChange('companyProfile', 'industry', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`${labelStyles} flex items-center`}>
                      <Users className="inline-block mr-2 h-4 w-4 text-indigo-500" />
                      Company Size *
                    </label>
                    <select
                      className={inputStyles}
                      value={formData.companyProfile.size}
                      onChange={(e) => handleInputChange('companyProfile', 'size', e.target.value)}
                      required
                    >
                      <option value="">Select size</option>
                      {companySizeRanges.map((range) => (
                        <option key={range} value={range}>{range} employees</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`${labelStyles} flex items-center`}>
                      <Calendar className="inline-block mr-2 h-4 w-4 text-indigo-500" />
                      Year Founded *
                    </label>
                    <input
                      type="number"
                      min="1800"
                      max={new Date().getFullYear()}
                      className={inputStyles}
                      value={formData.companyProfile.yearFounded}
                      onChange={(e) => handleInputChange('companyProfile', 'yearFounded', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className={`${labelStyles} flex items-center`}>
                      <Globe className="inline-block mr-2 h-4 w-4 text-indigo-500" />
                      Website *
                    </label>
                    <input
                      type="url"
                      className={inputStyles}
                      value={formData.companyProfile.website}
                      onChange={(e) => handleInputChange('companyProfile', 'website', e.target.value)}
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Company Name</h3>
                  <p className={previewTextStyles}>{formData.companyProfile.name || 'Not specified'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400">Industry/Sector</h3>
                  <p className={previewTextStyles}>{formData.companyProfile.industry || 'Not specified'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 flex items-center">
                      <Users className="inline-block mr-2 h-4 w-4 text-indigo-500" />
                      Company Size
                    </h3>
                    <p className={previewTextStyles}>{formData.companyProfile.size || 'Not specified'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-400 flex items-center">
                      <Calendar className="inline-block mr-2 h-4 w-4 text-indigo-500" />
                      Founded
                    </h3>
                    <p className={previewTextStyles}>{formData.companyProfile.yearFounded || 'Not specified'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-400 flex items-center">
                      <Globe className="inline-block mr-2 h-4 w-4 text-indigo-500" />
                      Website
                    </h3>
                    {formData.companyProfile.website ? (
                      <a
                        href={formData.companyProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-500 hover:text-indigo-400 transition-colors duration-300"
                      >
                        {formData.companyProfile.website}
                      </a>
                    ) : (
                      <p className={previewTextStyles}>Not specified</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBasicInfo;