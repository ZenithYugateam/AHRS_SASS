import React, { useEffect, useState } from 'react';
import { Download, Search, Filter, Loader, CircleDollarSign } from 'lucide-react';
import Papa from 'papaparse';

interface Customer {
  id: number;
  name: string;
  email: string;
  plan: string;
  status: string;
  tokensLeft: number;
  tokensPurchased: number;
  transactionId: string;
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('All Plans');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');

  // Fetch customer data from the API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://3a42g08nvb.execute-api.us-east-1.amazonaws.com/default/fetchusers");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const mappedCustomers: Customer[] = data.map((item: any, index: number) => ({
          id: index,
          name: item.email ? item.email.split('@')[0] : "Unknown",
          email: item.email,
          plan: item.subscriptionType
            ? item.subscriptionType.toLowerCase().includes('premium')
              ? 'Premium Plan'
              : item.subscriptionType.toLowerCase().includes('standard')
              ? 'Standard Plan'
              : item.subscriptionType.toLowerCase().includes('basic')
              ? 'Basic Plan'
              : item.subscriptionType
            : "Unknown Plan",
          status: "Active",
          tokensLeft: item.tokensLeft,
          tokensPurchased: item.tokensPurchased,
          transactionId: item.transactionId || "N/A"
        }));
        
        setCustomers(mappedCustomers);
        setFilteredCustomers(mappedCustomers);
      } catch (err: any) {
        console.error("Error fetching customers:", err);
        setError("Error fetching customers.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter Logic
  useEffect(() => {
    let filtered = customers;

    // Global search
    if (searchTerm) {
      filtered = filtered.filter((customer) => {
        const searchValue = searchTerm.toLowerCase();
        return (
          customer.name.toLowerCase().includes(searchValue) ||
          customer.email.toLowerCase().includes(searchValue) ||
          customer.plan.toLowerCase().includes(searchValue) ||
          customer.status.toLowerCase().includes(searchValue) ||
          customer.tokensLeft.toString().includes(searchValue) ||
          customer.tokensPurchased.toString().includes(searchValue) ||
          customer.transactionId.toLowerCase().includes(searchValue)
        );
      });
    }

    // Filter by selected plan
    if (selectedPlan !== 'All Plans') {
      filtered = filtered.filter((customer) => {
        const normalizedPlan = customer.plan.toLowerCase().trim();
        if (selectedPlan === 'Basic Plan' && normalizedPlan === 'basic plan') return true;
        if (selectedPlan === 'Standard Plan' && normalizedPlan === 'standard plan') return true;
        if (selectedPlan === 'Premium Plan' && normalizedPlan === 'premium plan') return true;
        return false;
      });
    }
    
    // Filter by selected status
    if (selectedStatus !== 'All Status') {
      filtered = filtered.filter((customer) => customer.status === selectedStatus);
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, selectedPlan, selectedStatus, customers]);


  const handleExportCSV = () => {
    const csvData = filteredCustomers.map((customer) => ({
      Name: customer.name,
      Email: customer.email,
      Plan: customer.plan,
      Status: customer.status,
      'Tokens Left': customer.tokensLeft,
      'Tokens Purchased': customer.tokensPurchased,
      'Transaction ID': customer.transactionId,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', 'customers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Customer Management</h2>
        <div className="flex space-x-3">
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md flex items-center shadow-md"
          onClick={handleExportCSV}
          >
            <Download className="h-5 w-5 mr-2" />
            Export Customers
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full bg-gray-700 rounded-md py-2 px-4 pl-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <div className="flex space-x-3">
            <select
              className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option>All Plans</option>
              <option>Basic Plan</option>
              <option>Standard Plan</option>
              <option>Premium Plan</option>
            </select>
            <select
              className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin h-10 w-10 text-purple-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700 text-left">
                  <th className="p-4 rounded-tl-md">Customer</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Tokens Left</th>
                  <th className="p-4">Tokens Purchased</th>
                  <th className="p-4">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4">
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-white font-medium text-lg">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Customer Info */}
                      <div>
                        <p className="font-medium text-white">{customer.name}</p>
                        <p className="text-sm text-gray-400">{customer.email}</p>
                      </div>
                    </div>
                    </td>
                    <td className="p-4">{customer.plan}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          customer.status === 'Active'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center space-x-2">
                     
                      <span>{customer.tokensLeft}</span>
                    </td>

                    <td className="p-4">{customer.tokensPurchased}</td>
                    <td className="p-4">{customer.transactionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
