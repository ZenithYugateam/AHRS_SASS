import React from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  CreditCard,
  BarChart3,
  LogOut,
  TrendingUp,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };
  return (
    <div className="w-64 bg-gray-800 p-4">
      <div className="flex items-center mb-8">
        <LayoutDashboard className="h-8 w-8 mr-2 text-purple-500" />
        <h1 className="text-xl font-bold">AHRS Admin</h1>
      </div>

      <nav>
        <ul>
          <li
            className={`mb-2 p-2 rounded ${
              activeTab === "dashboard" ? "bg-purple-900" : "hover:bg-gray-700"
            }`}
          >
            <button
              className="flex items-center w-full text-left"
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </button>
          </li>
          <li
            className={`mb-2 p-2 rounded ${
              activeTab === "pricing" ? "bg-purple-900" : "hover:bg-gray-700"
            }`}
          >
            <button
              className="flex items-center w-full text-left"
              onClick={() => setActiveTab("pricing")}
            >
              <CreditCard className="h-5 w-5 mr-3" />
              Pricing Plans
            </button>
          </li>
          <li
            className={`mb-2 p-2 rounded ${
              activeTab === "revenue" ? "bg-purple-900" : "hover:bg-gray-700"
            }`}
          >
            <button
              className="flex items-center w-full text-left"
              onClick={() => setActiveTab("revenue")}
            >
              <TrendingUp className="h-5 w-5 mr-3" />
              Revenue
            </button>
          </li>
          <li
            className={`mb-2 p-2 rounded ${
              activeTab === "customers" ? "bg-purple-900" : "hover:bg-gray-700"
            }`}
          >
            <button
              className="flex items-center w-full text-left"
              onClick={() => setActiveTab("customers")}
            >
              <Users className="h-5 w-5 mr-3" />
              Customers
            </button>
          </li>
          <li
            className={`mb-2 p-2 rounded ${
              activeTab === "analytics" ? "bg-purple-900" : "hover:bg-gray-700"
            }`}
          >
            <button
              className="flex items-center w-full text-left"
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              Analytics
            </button>
          </li>
          <li
            className={`mb-2 p-2 rounded ${
              activeTab === "settings" ? "bg-purple-900" : "hover:bg-gray-700"
            }`}
          >
            <button
              className="flex items-center w-full text-left"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </button>
          </li>
          <li
            className={`mb-2 p-2 rounded ${
              activeTab === "logout" ? "bg-purple-900" : "hover:bg-gray-500/30"
            }`}
          >
            <button
              className="flex items-center w-full text-left text-red-500 hover:text-red-500 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3 text-red-500 hover:text-red-500  " />
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4"></div>
    </div>
  );
};

export default Sidebar;
