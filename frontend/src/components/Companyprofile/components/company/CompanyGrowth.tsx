import React, { useEffect, useState } from "react";
import axios from "axios";
import { Rocket } from "lucide-react";

interface CompanyGrowthProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
  isEditing: boolean;
}

const CompanyGrowth: React.FC<CompanyGrowthProps> = ({
  formData,
  handleInputChange,
  isEditing,
}) => {
  const [growthPlans, setGrowthPlans] = useState(
    formData.companyProfile.growthPlans || ""
  );

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
          setGrowthPlans(response.data.companyProfile.growthPlans || "");
        }
      } catch (error) {
        console.error("Error fetching growth details:", error);
      }
    };

    fetchCompanyDetails();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setGrowthPlans(newValue);
    handleInputChange("companyProfile", "growthPlans", newValue);
  };

  const cardStyles =
    "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 hover:border-indigo-500/30";
  const textareaStyles =
    "w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-500 transition-all duration-300 hover:border-indigo-500/50";
  const previewTextStyles = "text-lg font-medium text-gray-100 whitespace-pre-wrap";

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
        <Rocket className="mr-2 h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
        Growth & Future Plans
      </h2>

      <div className={`${cardStyles} p-4`}>
        <label className="block text-sm font-medium mb-2 text-gray-200">
          Growth Plans/Future Outlook *
        </label>
        {isEditing ? (
          <>
            <textarea
              className={`${textareaStyles} h-48 resize-none`}
              value={growthPlans}
              onChange={handleChange}
              placeholder="Describe your company's growth plans, expansion strategies, and future outlook"
              required
            ></textarea>
            <p className="mt-2 text-xs text-gray-400">
              Include information about market expansion plans, product development roadmap, and strategic initiatives
            </p>
          </>
        ) : (
          <p className={previewTextStyles}>
            {growthPlans || "Not specified"}
          </p>
        )}
      </div>
    </div>
  );
};

export default CompanyGrowth;
