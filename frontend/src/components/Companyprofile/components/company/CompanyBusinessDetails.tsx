import React, { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase } from "lucide-react";

interface CompanyBusinessDetailsProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
  isEditing: boolean;
}

const CompanyBusinessDetails: React.FC<CompanyBusinessDetailsProps> = ({
  formData,
  handleInputChange,
  isEditing,
}) => {
  const businessTypes = ["B2B", "B2C", "B2B2C", "D2C", "Other"];
  const revenueRanges = [
    "Less than $1M", "$1M - $10M", "$10M - $50M", "$50M - $100M",
    "$100M - $500M", "$500M - $1B", "More than $1B", "Prefer not to disclose"
  ];

  const [businessType, setBusinessType] = useState(formData.companyProfile.businessType || "");
  const [revenueRange, setRevenueRange] = useState(formData.companyProfile.revenueRange || "");

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const username = JSON.parse(sessionStorage.getItem("user") || "{}")
          .username;
        if (!username) {
          console.error("No username found in session storage");
          return;
        }

        const response = await axios.post(
          "https://iu2p4xgbt4.execute-api.us-east-1.amazonaws.com/default/get_company_profile_details",
          { companyId: username }
        );

        if (response.data && response.data.companyProfile) {
          setBusinessType(response.data.companyProfile.businessType || "");
          setRevenueRange(response.data.companyProfile.revenueRange || "");
        }
      } catch (error) {
        console.error("Error fetching company profile details:", error);
      }
    };

    fetchCompanyDetails();
  }, []);

  const cardStyles = "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300";
  const selectStyles = "w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300";
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
              value={businessType}
              onChange={(e) => handleInputChange("companyProfile", "businessType", e.target.value)}
              required
            >
              <option value="">Select business type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          ) : (
            <p className={previewTextStyles}>{businessType || "Not specified"}</p>
          )}
        </div>

        <div className={`${cardStyles} p-4`}>
          <label className="block text-sm font-medium mb-2 text-gray-200">Annual Revenue Range</label>
          {isEditing ? (
            <select
              className={selectStyles}
              value={revenueRange}
              onChange={(e) => handleInputChange("companyProfile", "revenueRange", e.target.value)}
            >
              <option value="">Select revenue range</option>
              {revenueRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          ) : (
            <p className={previewTextStyles}>{revenueRange || "Not specified"}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyBusinessDetails;
