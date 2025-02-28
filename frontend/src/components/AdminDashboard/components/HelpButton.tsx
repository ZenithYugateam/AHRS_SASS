import React from 'react';
import { HelpCircle } from 'lucide-react';

const HelpButton: React.FC = () => {
  return (
    <button className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110">
      <HelpCircle className="h-6 w-6" />
    </button>
  );
};

export default HelpButton;