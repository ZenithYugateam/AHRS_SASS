import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Building2 } from 'lucide-react';

interface CompanyBasicInfoProps {
  handleInputChange: (section: string, field: string, value: any) => void;
  handleLogoUpload: (file: File) => void;
  isEditing: boolean;
}

const CompanyBasicInfo: React.FC<CompanyBasicInfoProps> = ({ 
  handleInputChange,
  handleLogoUpload,
  isEditing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    companyProfile: {
      logo: '',
      name: '',
      industry: '',
      size: '',
      yearFounded: '',
      website: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const username = JSON.parse(sessionStorage.getItem('user') || '{}').username;

    if (!username) {
      setError("Username not found in session storage.");
      setLoading(false);
      return;
    }

    axios.post(`https://iu2p4xgbt4.execute-api.us-east-1.amazonaws.com/default/get_company_profile_details`, 
      { companyId: username },
      {
        headers: { 
          'Content-Type': 'application/json'
        }
      }
    )
    .then(response => {
      const data = response.data.data;
      setFormData({
        companyProfile: {
          logo: data.logo || '',
          name: data.name || 'Not Available',
          industry: data.industry || 'Not Available',
          size: data.size || 'Not Available',
          yearFounded: data.yearFounded || 'Not Available',
          website: data.website || ''
        }
      });
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching company details:', error);
      setError("Failed to load company details.");
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-gray-400">Loading company details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
        <Building2 className="mr-2 h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
        Basic Information
      </h2>

      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium mb-2 text-gray-200">Company Logo</label>
            <div className="relative aspect-square w-full max-w-[200px] mx-auto">
              {formData.companyProfile.logo ? (
                <img src={formData.companyProfile.logo} alt="Company Logo" className="w-full h-full object-contain rounded-lg" />
              ) : (
                <div className="w-full h-full border-2 border-dashed border-indigo-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-gray-400">No logo uploaded</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Company Name *</label>
                  <input
                    type="text"
                    className="w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3"
                    value={formData.companyProfile.name}
                    onChange={(e) => handleInputChange('companyProfile', 'name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Industry/Sector *</label>
                  <input
                    type="text"
                    className="w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3"
                    value={formData.companyProfile.industry}
                    onChange={(e) => handleInputChange('companyProfile', 'industry', e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <p className="text-lg text-gray-100">Company Name: {formData.companyProfile.name}</p>
                <p className="text-lg text-gray-100">Industry: {formData.companyProfile.industry}</p>
                <p className="text-lg text-gray-100">Size: {formData.companyProfile.size}</p>
                <p className="text-lg text-gray-100">Founded: {formData.companyProfile.yearFounded}</p>
                <p className="text-lg text-gray-100">Website: {formData.companyProfile.website}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBasicInfo;
