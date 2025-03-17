import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react";

interface CompanyCSRProps {
  formData: any;
  handleAddTag: (
    section: string,
    field: string,
    value: string,
    inputSetter: React.Dispatch<React.SetStateAction<string>>
  ) => void;
  handleRemoveTag: (section: string, field: string, index: number) => void;
  isEditing: boolean;
}

const CompanyCSR: React.FC<CompanyCSRProps> = ({
  formData,
  handleAddTag,
  handleRemoveTag,
  isEditing,
}) => {
  const [csrInitiatives, setCsrInitiatives] = useState<string[]>(
    formData.companyProfile.csrInitiatives || []
  );
  const [initiativeInput, setInitiativeInput] = useState("");

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
          setCsrInitiatives(response.data.companyProfile.csrInitiatives || []);
        }
      } catch (error) {
        console.error("Error fetching CSR details:", error);
      }
    };

    fetchCompanyDetails();
  }, []);

  const cardStyles =
    "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 hover:border-indigo-500/30";
  const inputStyles =
    "w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-500 transition-all duration-300 hover:border-indigo-500/50";
  const tagStyles =
    "bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full text-sm flex items-center hover:bg-indigo-500/30 transition-colors duration-300";
  const buttonStyles =
    "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 px-4 py-3 rounded-r-lg transition-all duration-300 font-medium";

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
        <Heart className="mr-2 h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
        Corporate Social Responsibility
      </h2>

      <div className={`${cardStyles} p-4`}>
        <label className="block text-sm font-medium mb-2 text-gray-200">
          CSR Initiatives
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {csrInitiatives.map((initiative, index) => (
            <span key={index} className={tagStyles}>
              {initiative}
              {isEditing && (
                <button
                  type="button"
                  className="ml-2 text-indigo-500 hover:text-white"
                  onClick={() =>
                    handleRemoveTag("companyProfile", "csrInitiatives", index)
                  }
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
        {isEditing && (
          <>
            <div className="flex">
              <input
                type="text"
                className={`${inputStyles} rounded-r-none`}
                value={initiativeInput}
                onChange={(e) => setInitiativeInput(e.target.value)}
                placeholder="Add CSR initiative"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(
                      "companyProfile",
                      "csrInitiatives",
                      initiativeInput,
                      setInitiativeInput
                    );
                  }
                }}
              />
              <button
                type="button"
                className={buttonStyles}
                onClick={() =>
                  handleAddTag(
                    "companyProfile",
                    "csrInitiatives",
                    initiativeInput,
                    setInitiativeInput
                  )
                }
              >
                Add
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Add your company's social responsibility initiatives, sustainability programs, and community engagement activities
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyCSR;
