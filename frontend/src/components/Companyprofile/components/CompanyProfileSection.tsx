import React, { useState } from 'react';
import { Building2, Users, Calendar, Globe, Target, Trophy, Heart, Rocket, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

interface CompanyProfileSectionProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
  handleAddTag: (section: string, field: string, value: string, inputSetter: React.Dispatch<React.SetStateAction<string>>) => void;
  handleRemoveTag: (section: string, field: string, index: number) => void;
}

const CompanyProfileSection: React.FC<CompanyProfileSectionProps> = ({
  formData,
  handleInputChange,
  handleAddTag,
  handleRemoveTag
}) => {
  const [locationInput, setLocationInput] = useState('');
  const [competitorInput, setCompetitorInput] = useState('');
  const [productInput, setProductInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [initiativeInput, setInitiativeInput] = useState('');

  // Business type options
  const businessTypes = ['B2B', 'B2C', 'B2B2C', 'D2C', 'Other'];
  
  // Company size ranges
  const companySizeRanges = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', 
    '1001-5000', '5001-10000', '10000+'
  ];

  // Revenue ranges
  const revenueRanges = [
    'Less than $1M', '$1M - $10M', '$10M - $50M', '$50M - $100M',
    '$100M - $500M', '$500M - $1B', 'More than $1B', 'Prefer not to disclose'
  ];

  return (
    <div className="space-y-6 lg:space-y-8 max-w-screen-lg mx-auto">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center">
        <Building2 className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary" />
        Company Profile
      </h2>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
          <label className="block text-sm font-medium mb-1">Company Name *</label>
          <input
            type="text"
            className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={formData.companyProfile.name}
            onChange={(e) => handleInputChange('companyProfile', 'name', e.target.value)}
            required
          />
        </div>

        <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
          <label className="block text-sm font-medium mb-1">Industry/Sector *</label>
          <input
            type="text"
            className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={formData.companyProfile.industry}
            onChange={(e) => handleInputChange('companyProfile', 'industry', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Company Size and Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
          <label className="block text-sm font-medium mb-1">
            <Users className="inline-block mr-1 h-4 w-4 text-primary" />
            Company Size *
          </label>
          <select
            className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={formData.companyProfile.size}
            onChange={(e) => handleInputChange('companyProfile', 'size', e.target.value)}
            required
          >
            <option value="">Select company size</option>
            {companySizeRanges.map((range) => (
              <option key={range} value={range}>{range} employees</option>
            ))}
          </select>
        </div>

        <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
          <label className="block text-sm font-medium mb-1">
            <Calendar className="inline-block mr-1 h-4 w-4 text-primary" />
            Year Founded *
          </label>
          <input
            type="number"
            min="1800"
            max={new Date().getFullYear()}
            className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={formData.companyProfile.yearFounded}
            onChange={(e) => handleInputChange('companyProfile', 'yearFounded', e.target.value)}
            required
          />
        </div>

        <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
          <label className="block text-sm font-medium mb-1">
            <Globe className="inline-block mr-1 h-4 w-4 text-primary" />
            Company Website *
          </label>
          <input
            type="url"
            className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={formData.companyProfile.website}
            onChange={(e) => handleInputChange('companyProfile', 'website', e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>
      </div>

      {/* Company Description */}
      <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
        <label className="block text-sm font-medium mb-1">Company Description (200-300 words) *</label>
        <textarea
          className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary h-32"
          value={formData.companyProfile.description}
          onChange={(e) => handleInputChange('companyProfile', 'description', e.target.value)}
          required
        ></textarea>
        <p className="text-xs text-primary mt-1">
          {formData.companyProfile.description.length}/1500 characters
        </p>
      </div>

      {/* Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
          <label className="block text-sm font-medium mb-1">Headquarters Location *</label>
          <input
            type="text"
            className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={formData.companyProfile.headquarters}
            onChange={(e) => handleInputChange('companyProfile', 'headquarters', e.target.value)}
            required
          />
        </div>

        <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
          <label className="block text-sm font-medium mb-1">Office Locations</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.companyProfile.officeLocations.map((location, index) => (
              <span
                key={index}
                className="bg-secondary/30 border border-secondary/50 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {location}
                <button
                  type="button"
                  className="ml-2 text-primary hover:text-white"
                  onClick={() => handleRemoveTag('companyProfile', 'officeLocations', index)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              className="flex-grow bg-black/30 border border-primary/50 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Add office location"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag('companyProfile', 'officeLocations', locationInput, setLocationInput);
                }
              }}
            />
            <button
              type="button"
              className="bg-primary hover:bg-secondary px-4 py-2 rounded-r-lg transition-colors duration-300"
              onClick={() => handleAddTag('companyProfile', 'officeLocations', locationInput, setLocationInput)}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Business Type and Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
          <label className="block text-sm font-medium mb-1">Business Type *</label>
          <select
            className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={formData.companyProfile.businessType}
            onChange={(e) => handleInputChange('companyProfile', 'businessType', e.target.value)}
            required
          >
            <option value="">Select business type</option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
          <label className="block text-sm font-medium mb-1">Annual Revenue Range</label>
          <select
            className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={formData.companyProfile.revenueRange}
            onChange={(e) => handleInputChange('companyProfile', 'revenueRange', e.target.value)}
          >
            <option value="">Select revenue range</option>
            {revenueRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products/Services and Target Market */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
          <label className="block text-sm font-medium mb-1">Products/Services Offered *</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.companyProfile.products.map((product, index) => (
              <span
                key={index}
                className="bg-secondary/30 border border-secondary/50 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {product}
                <button
                  type="button"
                  className="ml-2 text-primary hover:text-white"
                  onClick={() => handleRemoveTag('companyProfile', 'products', index)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              className="flex-grow bg-black/30 border border-primary/50 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              value={productInput}
              onChange={(e) => setProductInput(e.target.value)}
              placeholder="Add product/service"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag('companyProfile', 'products', productInput, setProductInput);
                }
              }}
            />
            <button
              type="button"
              className="bg-primary hover:bg-secondary px-4 py-2 rounded-r-lg transition-colors duration-300"
              onClick={() => handleAddTag('companyProfile', 'products', productInput, setProductInput)}
            >
              Add
            </button>
          </div>
        </div>

        <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
          <label className="block text-sm font-medium mb-1">
            <Target className="inline-block mr-1 h-4 w-4 text-primary" />
            Target Market *
          </label>
          <textarea
            className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary h-24"
            value={formData.companyProfile.targetMarket}
            onChange={(e) => handleInputChange('companyProfile', 'targetMarket', e.target.value)}
            placeholder="Describe your target market"
            required
          ></textarea>
        </div>
      </div>

      {/* Key Competitors */}
      <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
        <label className="block text-sm font-medium mb-1">Key Competitors</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.companyProfile.competitors.map((competitor, index) => (
            <span
              key={index}
              className="bg-secondary/30 border border-secondary/50 px-3 py-1 rounded-full text-sm flex items-center"
            >
              {competitor}
              <button
                type="button"
                className="ml-2 text-primary hover:text-white"
                onClick={() => handleRemoveTag('companyProfile', 'competitors', index)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-grow bg-black/30 border border-primary/50 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={competitorInput}
            onChange={(e) => setCompetitorInput(e.target.value)}
            placeholder="Add competitor"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag('companyProfile', 'competitors', competitorInput, setCompetitorInput);
              }
            }}
          />
          <button
            type="button"
            className="bg-primary hover:bg-secondary px-4 py-2 rounded-r-lg transition-colors duration-300"
            onClick={() => handleAddTag('companyProfile', 'competitors', competitorInput, setCompetitorInput)}
          >
            Add
          </button>
        </div>
      </div>

      {/* Company Culture and Values */}
      <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
        <label className="block text-sm font-medium mb-1">
          <Heart className="inline-block mr-1 h-4 w-4 text-primary" />
          Company Culture and Values *
        </label>
        <textarea
          className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary h-24"
          value={formData.companyProfile.culture}
          onChange={(e) => handleInputChange('companyProfile', 'culture', e.target.value)}
          required
        ></textarea>
      </div>

      {/* Mission and Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
          <label className="block text-sm font-medium mb-1">Mission Statement *</label>
          <textarea
            className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary h-24"
            value={formData.companyProfile.mission}
            onChange={(e) => handleInputChange('companyProfile', 'mission', e.target.value)}
            required
          ></textarea>
        </div>

        <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
          <label className="block text-sm font-medium mb-1">Vision Statement *</label>
          <textarea
            className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary h-24"
            value={formData.companyProfile.vision}
            onChange={(e) => handleInputChange('companyProfile', 'vision', e.target.value)}
            required
          ></textarea>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
        <label className="block text-sm font-medium mb-1">Leadership Team Structure *</label>
        <textarea
          className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary h-24"
          value={formData.companyProfile.leadership}
          onChange={(e) => handleInputChange('companyProfile', 'leadership', e.target.value)}
          placeholder="Describe your leadership team structure"
          required
        ></textarea>
      </div>

      {/* Achievements */}
      <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
        <label className="block text-sm font-medium mb-1">
          <Trophy className="inline-block mr-1 h-4 w-4 text-primary" />
          Notable Achievements/Awards
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.companyProfile.achievements.map((achievement, index) => (
            <span
              key={index}
              className="bg-secondary/30 border border-secondary/50 px-3 py-1 rounded-full text-sm flex items-center"
            >
              {achievement}
              <button
                type="button"
                className="ml-2 text-primary hover:text-white"
                onClick={() => handleRemoveTag('companyProfile', 'achievements', index)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-grow bg-black/30 border border-primary/50 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={achievementInput}
            onChange={(e) => setAchievementInput(e.target.value)}
            placeholder="Add achievement/award"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag('companyProfile', 'achievements', achievementInput, setAchievementInput);
              }
            }}
          />
          <button
            type="button"
            className="bg-primary hover:bg-secondary px-4 py-2 rounded-r-lg transition-colors duration-300"
            onClick={() => handleAddTag('companyProfile', 'achievements', achievementInput, setAchievementInput)}
          >
            Add
          </button>
        </div>
      </div>

      {/* Social Media */}
      <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
        <label className="block text-sm font-medium mb-2">Social Media Presence</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Facebook className="h-5 w-5 text-primary" />
            <input
              type="url"
              className="flex-grow bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              value={formData.companyProfile.socialMedia.facebook}
              onChange={(e) => handleInputChange('companyProfile', 'socialMedia', {
                ...formData.companyProfile.socialMedia,
                facebook: e.target.value
              })}
              placeholder="Facebook URL"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Twitter className="h-5 w-5 text-primary" />
            <input
              type="url"
              className="flex-grow bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              value={formData.companyProfile.socialMedia.twitter}
              onChange={(e) => handleInputChange('companyProfile', 'socialMedia', {
                ...formData.companyProfile.socialMedia,
                twitter: e.target.value
              })}
              placeholder="Twitter URL"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Linkedin className="h-5 w-5 text-primary" />
            <input
              type="url"
              className="flex-grow bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              value={formData.companyProfile.socialMedia.linkedin}
              onChange={(e) => handleInputChange('companyProfile', 'socialMedia', {
                ...formData.companyProfile.socialMedia,
                linkedin: e.target.value
              })}
              placeholder="LinkedIn URL"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Instagram className="h-5 w-5 text-primary" />
            <input
              type="url"
              className="flex-grow bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              value={formData.companyProfile.socialMedia.instagram}
              onChange={(e) => handleInputChange('companyProfile', 'socialMedia', {
                ...formData.companyProfile.socialMedia,
                instagram: e.target.value
              })}
              placeholder="Instagram URL"
            />
          </div>
        </div>
      </div>

      {/* CSR Initiatives */}
      <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
        <label className="block text-sm font-medium mb-1">Corporate Social Responsibility Initiatives</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.companyProfile.csrInitiatives.map((initiative, index) => (
            <span
              key={index}
              className="bg-secondary/30 border border-secondary/50 px-3 py-1 rounded-full text-sm flex items-center"
            >
              {initiative}
              <button
                type="button"
                className="ml-2 text-primary hover:text-white"
                onClick={() => handleRemoveTag('companyProfile', 'csrInitiatives', index)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-grow bg-black/30 border border-primary/50 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={initiativeInput}
            onChange={(e) => setInitiativeInput(e.target.value)}
            placeholder="Add CSR initiative"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag('companyProfile', 'csrInitiatives', initiativeInput, setInitiativeInput);
              }
            }}
          />
          <button
            type="button"
            className="bg-primary hover:bg-secondary px-4 py-2 rounded-r-lg transition-colors duration-300"
            onClick={() => handleAddTag('companyProfile', 'csrInitiatives', initiativeInput, setInitiativeInput)}
          >
            Add
          </button>
        </div>
      </div>

      {/* Growth Plans */}
      <div className="p-4 border border-primary/30 rounded-lg bg-header/80 backdrop-blur-sm shadow-md">
        <label className="block text-sm font-medium mb-1">
          <Rocket className="inline-block mr-1 h-4 w-4 text-primary" />
          Growth Plans/Future Outlook *
        </label>
        <textarea
          className="w-full bg-black/30 border border-primary/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary h-32"
          value={formData.companyProfile.growthPlans}
          onChange={(e) => handleInputChange('companyProfile', 'growthPlans', e.target.value)}
          placeholder="Describe your company's growth plans and future outlook"
          required
        ></textarea>
      </div>
    </div>
  );
};

export default CompanyProfileSection;