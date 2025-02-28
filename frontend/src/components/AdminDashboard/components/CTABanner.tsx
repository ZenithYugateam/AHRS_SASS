import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTABannerProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

const CTABanner: React.FC<CTABannerProps> = ({ title, description, buttonText, onClick }) => {
  return (
    <div className="mt-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-6 shadow-xl border border-purple-700">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-purple-200">{description}</p>
        </div>
        <button 
          className="bg-white text-purple-900 hover:bg-purple-100 px-6 py-3 rounded-md font-medium flex items-center shadow-lg transition-all duration-300"
          onClick={onClick}
        >
          {buttonText}
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default CTABanner;