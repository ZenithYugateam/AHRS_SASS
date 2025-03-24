import React from 'react';
import { Save, Bell, Lock, CreditCard, Mail, Globe, Users } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md flex items-center shadow-md">
          <Save className="h-5 w-5 mr-2" />
          Save Changes
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
            <nav>
              <ul className="space-y-1">
                <li className="bg-purple-900 rounded-md">
                  <button className="w-full flex items-center p-3 text-left">
                    <Globe className="h-5 w-5 mr-3" />
                    <span>General</span>
                  </button>
                </li>
                <li className="hover:bg-gray-700 rounded-md">
                  <button className="w-full flex items-center p-3 text-left">
                    <Bell className="h-5 w-5 mr-3" />
                    <span>Notifications</span>
                  </button>
                </li>
                <li className="hover:bg-gray-700 rounded-md">
                  <button className="w-full flex items-center p-3 text-left">
                    <Lock className="h-5 w-5 mr-3" />
                    <span>Security</span>
                  </button>
                </li>
                <li className="hover:bg-gray-700 rounded-md">
                  <button className="w-full flex items-center p-3 text-left">
                    <CreditCard className="h-5 w-5 mr-3" />
                    <span>Billing</span>
                  </button>
                </li>
                <li className="hover:bg-gray-700 rounded-md">
                  <button className="w-full flex items-center p-3 text-left">
                    <Mail className="h-5 w-5 mr-3" />
                    <span>Email Templates</span>
                  </button>
                </li>
                <li className="hover:bg-gray-700 rounded-md">
                  <button className="w-full flex items-center p-3 text-left">
                    <Users className="h-5 w-5 mr-3" />
                    <span>Team Members</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-6">
            <h3 className="text-xl font-bold mb-4">General Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">Company Name</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value="AHRS Interview Platform"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Admin Email</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value="admin@ahrsplatform.com"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Time Zone</label>
                <select className="w-full bg-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>EST (Eastern Standard Time)</option>
                  <option>PST (Pacific Standard Time)</option>
                  <option>IST (Indian Standard Time)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Default Language</label>
                <select className="w-full bg-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500 mr-2" checked />
                  <span>Enable dark mode by default</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500 mr-2" checked />
                  <span>Show token usage statistics to users</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-bold mb-4">API Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">API Key</label>
                <div className="flex">
                  <input 
                    type="password" 
                    className="flex-1 bg-gray-700 rounded-l-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value="••••••••••••••••••••••••••••••"
                    readOnly
                  />
                  <button className="bg-gray-600 hover:bg-gray-500 px-4 rounded-r-md">
                    Show
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Last regenerated: May 10, 2025</p>
              </div>
              
              <div>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
                  Regenerate API Key
                </button>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Webhook URL</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://your-domain.com/webhook"
                />
              </div>
              
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500 mr-2" checked />
                  <span>Enable API access</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500 mr-2" />
                  <span>Restrict API access by IP</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;