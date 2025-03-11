import React, { useState } from 'react';
import Header from './components/Header';
import CompanyBasicInfo from './components/company/CompanyBasicInfo';
import CompanyDescription from './components/company/CompanyDescription';
import CompanyLocations from './components/company/CompanyLocations';
import CompanyBusinessDetails from './components/company/CompanyBusinessDetails';
import CompanyProducts from './components/company/CompanyProducts';
import CompanyCulture from './components/company/CompanyCulture';
import CompanyLeadership from './components/company/CompanyLeadership';
import CompanyAchievements from './components/company/CompanyAchievements';
import CompanySocialMedia from './components/company/CompanySocialMedia';
import CompanyCSR from './components/company/CompanyCSR';
import CompanyGrowth from './components/company/CompanyGrowth';
import { useFormData } from './hooks/useFormData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Companyprofile() {
  const { 
    formData, 
    handleInputChange, 
    handleAddTag, 
    handleRemoveTag, 
    handleLogoUpload,
    handleManualSave,
    isEditing,
    toggleEditMode 
  } = useFormData();
  
  const [activeSection, setActiveSection] = useState('basic');
  const [showMobileNav, setShowMobileNav] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'basic':
        return (
          <CompanyBasicInfo 
            formData={formData} 
            handleInputChange={handleInputChange}
            handleLogoUpload={handleLogoUpload}
            isEditing={isEditing}
          />
        );
      case 'description':
        return <CompanyDescription formData={formData} handleInputChange={handleInputChange} isEditing={isEditing} />;
      case 'locations':
        return <CompanyLocations formData={formData} handleInputChange={handleInputChange} handleAddTag={handleAddTag} handleRemoveTag={handleRemoveTag} isEditing={isEditing} />;
      case 'business':
        return <CompanyBusinessDetails formData={formData} handleInputChange={handleInputChange} isEditing={isEditing} />;
      case 'products':
        return <CompanyProducts formData={formData} handleInputChange={handleInputChange} handleAddTag={handleAddTag} handleRemoveTag={handleRemoveTag} isEditing={isEditing} />;
      case 'culture':
        return <CompanyCulture formData={formData} handleInputChange={handleInputChange} isEditing={isEditing} />;
      case 'leadership':
        return <CompanyLeadership formData={formData} handleInputChange={handleInputChange} isEditing={isEditing} />;
      case 'achievements':
        return <CompanyAchievements formData={formData} handleAddTag={handleAddTag} handleRemoveTag={handleRemoveTag} isEditing={isEditing} />;
      case 'social':
        return <CompanySocialMedia formData={formData} handleInputChange={handleInputChange} isEditing={isEditing} />;
      case 'csr':
        return <CompanyCSR formData={formData} handleAddTag={handleAddTag} handleRemoveTag={handleRemoveTag} isEditing={isEditing} />;
      case 'growth':
        return <CompanyGrowth formData={formData} handleInputChange={handleInputChange} isEditing={isEditing} />;
      default:
        return <CompanyBasicInfo formData={formData} handleInputChange={handleInputChange} handleLogoUpload={handleLogoUpload} isEditing={isEditing} />;
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: '1' },
    { id: 'description', label: 'Description', icon: '2' },
    { id: 'locations', label: 'Locations', icon: '3' },
    { id: 'business', label: 'Business Details', icon: '4' },
    { id: 'products', label: 'Products', icon: '5' },
    { id: 'culture', label: 'Culture', icon: '6' },
    { id: 'leadership', label: 'Leadership', icon: '7' },
    { id: 'achievements', label: 'Achievements', icon: '8' },
    { id: 'social', label: 'Social Media', icon: '9' },
    { id: 'csr', label: 'CSR', icon: '10' },
    { id: 'growth', label: 'Growth', icon: '11' }
  ];

  const currentIndex = sections.findIndex(s => s.id === activeSection);
  const prevSection = sections[currentIndex - 1];
  const nextSection = sections[currentIndex + 1];

  const navButtonStyles = "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300";
  const navButtonPrevStyles = `${navButtonStyles} bg-black/30 hover:bg-indigo-500/20`;
  const navButtonNextStyles = `${navButtonStyles} bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90`;

  return (
    <div className="min-h-screen bg-futuristic-ai bg-cover bg-center bg-fixed bg-slate-900 bg-blend-overlay text-white">
      <Header 
        onNavToggle={() => setShowMobileNav(!showMobileNav)} 
        onSave={handleManualSave}
        isEditing={isEditing}
        toggleEditMode={toggleEditMode}
      />
      
      <main className="container mx-auto py-4 md:py-8 lg:py-12 px-3 md:px-6 lg:px-8 xl:px-0 relative z-10 max-w-screen-xl">
        <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-indigo-500/30 overflow-hidden shadow-md">
          {/* Mobile Section Title */}
          <div className="md:hidden bg-slate-900/90 px-4 py-3 border-b border-indigo-500/30 flex items-center justify-between">
            <button 
              className="text-indigo-500 p-2 hover:bg-indigo-500/10 rounded-lg transition-colors duration-300"
              onClick={() => setShowMobileNav(!showMobileNav)}
            >
              {showMobileNav ? 'Hide Menu' : 'Show Menu'}
            </button>
            <span className="font-medium">{sections.find(s => s.id === activeSection)?.label}</span>
            <div className="w-16" />
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-indigo-500/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-indigo-500">Progress</span>
              <span className="text-sm text-indigo-500">
                Step {currentIndex + 1} of {sections.length}
              </span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / sections.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Section List - Mobile Drawer */}
            <div className={`md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-transform duration-300 ${showMobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="h-full w-4/5 max-w-sm bg-slate-900 border-r border-indigo-500/30">
                <div className="p-4 border-b border-indigo-500/30">
                  <h2 className="text-lg font-semibold">Sections</h2>
                </div>
                <nav className="p-2 overflow-y-auto h-[calc(100%-60px)]">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      className={`w-full text-left px-4 py-4 rounded-lg mb-2 transition-all duration-300 flex items-center ${
                        activeSection === section.id 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                          : 'hover:bg-indigo-500/20'
                      }`}
                      onClick={() => {
                        setActiveSection(section.id);
                        setShowMobileNav(false);
                      }}
                    >
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 mr-3 text-sm">
                        {section.icon}
                      </span>
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
              <button 
                className="absolute top-4 right-4 text-white p-2 rounded-lg bg-black/50"
                onClick={() => setShowMobileNav(false)}
              >
                Close
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block md:col-span-3 lg:col-span-2 border-r border-indigo-500/30">
              <nav className="p-2 sticky top-0">
                {sections.map(section => (
                  <button
                    key={section.id}
                    className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-all duration-300 flex items-center ${
                      activeSection === section.id 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                        : 'hover:bg-indigo-500/20'
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-black/30 mr-3 text-sm">
                      {section.icon}
                    </span>
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="md:col-span-9 lg:col-span-10 p-6">
              {renderSection()}
              
              {/* Mobile Navigation Buttons */}
              <div className="md:hidden flex justify-between items-center mt-8 pt-4 border-t border-indigo-500/30">
                {prevSection ? (
                  <button
                    onClick={() => setActiveSection(prevSection.id)}
                    className={navButtonPrevStyles}
                  >
                    <ChevronLeft size={20} />
                    <span>Previous</span>
                  </button>
                ) : <div />}
                
                {nextSection && (
                  <button
                    onClick={() => setActiveSection(nextSection.id)}
                    className={navButtonNextStyles}
                  >
                    <span>Next</span>
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Companyprofile;