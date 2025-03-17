import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package } from "lucide-react";

interface CompanyProductsProps {
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

const CompanyProducts: React.FC<CompanyProductsProps> = ({
  formData,
  handleInputChange,
  handleAddTag,
  handleRemoveTag,
  isEditing,
}) => {
  const [productInput, setProductInput] = useState("");
  const [products, setProducts] = useState(formData.companyProfile.products || []);
  const [targetMarket, setTargetMarket] = useState(formData.companyProfile.targetMarket || "");

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
          setProducts(response.data.companyProfile.products || []);
          setTargetMarket(response.data.companyProfile.targetMarket || "");
        }
      } catch (error) {
        console.error("Error fetching company profile details:", error);
      }
    };

    fetchCompanyDetails();
  }, []);

  const cardStyles = "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300";
  const inputStyles = "w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300";
  const tagStyles = "bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full text-sm flex items-center hover:bg-indigo-500/30 transition-colors duration-300";
  const buttonStyles = "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 px-4 py-3 rounded-r-lg transition-all duration-300 font-medium";
  const textareaStyles = "w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300";
  const previewTextStyles = "text-lg font-medium text-gray-100";

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
        <Package className="mr-2 h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
        Products & Services
      </h2>

      <div className={`${cardStyles} p-4`}>
        <label className="block text-sm font-medium mb-2 text-gray-200">Products/Services Offered *</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {products.map((product: string, index: number) => (
            <span key={index} className={tagStyles}>
              {product}
              {isEditing && (
                <button
                  type="button"
                  className="ml-2 text-indigo-500 hover:text-white"
                  onClick={() => handleRemoveTag("companyProfile", "products", index)}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className={`${cardStyles} p-4`}>
        <label className="block text-sm font-medium mb-2 text-gray-200">Target Market *</label>
        {isEditing ? (
          <textarea
            className={`${textareaStyles} h-24`}
            value={targetMarket}
            onChange={(e) => handleInputChange("companyProfile", "targetMarket", e.target.value)}
            placeholder="Describe your target market"
            required
          ></textarea>
        ) : (
          <p className={previewTextStyles}>{targetMarket || "Not specified"}</p>
        )}
      </div>
    </div>
  );
};

export default CompanyProducts;
