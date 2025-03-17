import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin } from "lucide-react";

interface CompanyLocationsProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
  handleAddTag: (
    section: string,
    field: string,
    value: string,
    inputSetter: React.Dispatch<React.SetStateAction<string>>
  ) => void;
  handleRemoveTag: (section: string, field: string, index: number) => void;
  isEditing: boolean;
}

const CompanyLocations: React.FC<CompanyLocationsProps> = ({
  formData,
  handleInputChange,
  handleAddTag,
  handleRemoveTag,
  isEditing,
}) => {
  const [locationInput, setLocationInput] = useState("");
  const [headquarters, setHeadquarters] = useState(formData.companyProfile.headquarters || "");
  const [officeLocations, setOfficeLocations] = useState(formData.companyProfile.officeLocations || []);

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
          setHeadquarters(response.data.companyProfile.headquarters || "");
          setOfficeLocations(response.data.companyProfile.officeLocations || []);
        }
      } catch (error) {
        console.error("Error fetching company profile details:", error);
      }
    };

    fetchCompanyDetails();
  }, []);

  const cardStyles = "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300";
  const inputStyles = "w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-500 transition-all duration-300";
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
          <label className="block text-sm font-medium mb-2 text-gray-200">
            Headquarters Location *
          </label>
          {isEditing ? (
            <input
              type="text"
              className={inputStyles}
              value={headquarters}
              onChange={(e) => handleInputChange("companyProfile", "headquarters", e.target.value)}
              required
            />
          ) : (
            <p className={previewTextStyles}>{headquarters || "Not specified"}</p>
          )}
        </div>

        <div className={`${cardStyles} p-4`}>
          <label className="block text-sm font-medium mb-2 text-gray-200">
            Office Locations
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {officeLocations.map((location: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
              <span key={index} className={tagStyles}>
                {location}
                {isEditing && (
                  <button
                    type="button"
                    className="ml-2 text-indigo-500 hover:text-white"
                    onClick={() => handleRemoveTag("companyProfile", "officeLocations", index)}
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
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag("companyProfile", "officeLocations", locationInput, setLocationInput);
                  }
                }}
              />
              <button
                type="button"
                className={buttonStyles}
                onClick={() => handleAddTag("companyProfile", "officeLocations", locationInput, setLocationInput)}
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
