import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="relative w-64">
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full bg-gray-700 rounded-md py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>
      
      <div className="flex items-center space-x-4">

      </div>
    </header>
  );
};

export default Header;