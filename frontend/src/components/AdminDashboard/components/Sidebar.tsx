import React from 'react';
import { LayoutDashboard, DollarSign, Users, BarChart2, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-gray-800 p-4 flex flex-col h-full">
      <div>
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">AHRS Admin</h1>
        </div>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center p-2 rounded-md ${
              activeTab === 'dashboard' ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <LayoutDashboard className="h-5 w-5 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`w-full flex items-center p-2 rounded-md ${
              activeTab === 'pricing' ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <DollarSign className="h-5 w-5 mr-2" />
            Pricing Plans
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`w-full flex items-center p-2 rounded-md ${
              activeTab === 'revenue' ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <DollarSign className="h-5 w-5 mr-2" />
            Revenue
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center p-2 rounded-md ${
              activeTab === 'customers' ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <Users className="h-5 w-5 mr-2" />
            Customers
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center p-2 rounded-md ${
              activeTab === 'analytics' ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <BarChart2 className="h-5 w-5 mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center p-2 rounded-md ${
              activeTab === 'settings' ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;