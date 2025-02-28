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
        <button className="relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <div className="flex items-center">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="Profile" 
            className="h-8 w-8 rounded-full mr-2"
          />
          <span className="mr-1">Admin User</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
};

export default Header;