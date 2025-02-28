import React from 'react';
import { Download, Search, Filter, UserPlus } from 'lucide-react';

const CustomersPage: React.FC = () => {
  // Sample customer data
  const customers = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', plan: 'Premium Plan', status: 'Active', joined: '2025-01-15', lastActive: '2025-05-10' },
    { id: 2, name: 'Sarah Williams', email: 'sarah@example.com', plan: 'Standard Plan', status: 'Active', joined: '2025-02-03', lastActive: '2025-05-09' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', plan: 'Basic Plan', status: 'Active', joined: '2025-02-18', lastActive: '2025-05-08' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', plan: 'Premium Plan', status: 'Inactive', joined: '2025-03-05', lastActive: '2025-04-22' },
    { id: 5, name: 'David Wilson', email: 'david@example.com', plan: 'Basic Plan', status: 'Active', joined: '2025-03-12', lastActive: '2025-05-10' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customer Management</h2>
        <div className="flex space-x-3">
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center shadow-md">
            <UserPlus className="h-5 w-5 mr-2" />
            Add Customer
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md flex items-center shadow-md">
            <Download className="h-5 w-5 mr-2" />
            Export Customers
          </button>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full bg-gray-700 rounded-md py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <div className="flex space-x-3">
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center text-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <select className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>All Plans</option>
              <option>Basic Plan</option>
              <option>Standard Plan</option>
              <option>Premium Plan</option>
            </select>
            <select className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="p-4 rounded-tl-md">Customer</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 rounded-tr-md">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center mr-3">
                        <span className="text-white font-medium">{customer.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      customer.plan === 'Premium Plan' ? 'bg-purple-900 text-purple-200' : 
                      customer.plan === 'Standard Plan' ? 'bg-indigo-900 text-indigo-200' : 
                      'bg-blue-900 text-blue-200'
                    }`}>
                      {customer.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      customer.status === 'Active' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{customer.joined}</td>
                  <td className="p-4 text-sm">{customer.lastActive}</td>
                  <td className="p-4">
                    <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-400">Showing 5 of 86 customers</p>
          <div className="flex space-x-2">
            <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm">Previous</button>
            <button className="bg-purple-600 px-3 py-1 rounded-md text-sm">1</button>
            <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm">2</button>
            <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm">3</button>
            <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;