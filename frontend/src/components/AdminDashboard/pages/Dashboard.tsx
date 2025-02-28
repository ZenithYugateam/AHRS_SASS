import React from 'react';
import { DollarSign, Users, Zap, Download, ArrowRight, PlusCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import CTABanner from '../components/CTABanner';

interface PricingPlan {
  id: number;
  name: string;
  duration: number;
  tokensPerMinute: number;
  tokens: number;
  price: number;
  subscribers: number;
  revenue: number;
}

interface DashboardProps {
  pricingPlans: PricingPlan[];
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
  navigateToPricing: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  pricingPlans, 
  timeFilter, 
  setTimeFilter,
  navigateToPricing
}) => {
  const totalRevenue = pricingPlans.reduce((sum, plan) => sum + plan.revenue, 0);
  const totalSubscribers = pricingPlans.reduce((sum, plan) => sum + plan.subscribers, 0);
  const totalTokensAllocated = pricingPlans.reduce((sum, plan) => sum + (plan.tokens * plan.subscribers), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Revenue Dashboard</h2>
        <div className="flex space-x-3">
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${timeFilter === 'week' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setTimeFilter('week')}
            >
              Week
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${timeFilter === 'month' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setTimeFilter('month')}
            >
              Month
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${timeFilter === 'year' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setTimeFilter('year')}
            >
              Year
            </button>
          </div>
          <button 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md flex items-center shadow-md"
            onClick={navigateToPricing}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Pricing Plan
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} 
          change="15%" 
          icon={<DollarSign className="h-5 w-5 text-green-400" />}
          period={timeFilter}
        />
        
        <StatCard 
          title="Active Subscribers" 
          value={totalSubscribers} 
          change="8%" 
          icon={<Users className="h-5 w-5 text-blue-400" />}
          period={timeFilter}
        />
        
        <StatCard 
          title="Tokens Allocated" 
          value={totalTokensAllocated.toLocaleString()} 
          change="12%" 
          icon={<Zap className="h-5 w-5 text-yellow-400" />}
          period={timeFilter}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Revenue by Plan</h3>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
          <div className="h-64 flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-end justify-around px-4">
              {pricingPlans.map((plan, index) => {
                const height = (plan.revenue / totalRevenue) * 100 * 0.8;
                const colors = [
                  'from-purple-600 to-indigo-600',
                  'from-indigo-600 to-blue-600',
                  'from-blue-600 to-cyan-600'
                ];
                return (
                  <div key={plan.id} className="flex flex-col items-center">
                    <div 
                      className={`w-20 bg-gradient-to-t ${colors[index % colors.length]} rounded-t relative group shadow-lg shadow-purple-900/20`}
                      style={{height: `${height}%`}}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${plan.revenue.toFixed(2)} (${plan.price.toFixed(2)} × {plan.subscribers})
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 text-center w-20 truncate">
                      {plan.name}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between items-start text-xs text-gray-500 pointer-events-none">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Subscribers by Plan</h3>
            <div className="flex space-x-2">
              <button className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">Day</button>
              <button className="text-xs bg-purple-600 px-2 py-1 rounded">Week</button>
              <button className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">Month</button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-48 h-48">
                {/* Interactive pie chart with hover effects */}
                <div className="absolute inset-0 rounded-full border-8 border-purple-600 group" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded">
                      Basic: {pricingPlans[0]?.subscribers || 0} users
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-8 border-indigo-600 group" style={{clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'}}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded">
                      Standard: {pricingPlans[1]?.subscribers || 0} users
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-8 border-blue-500 group" style={{clipPath: 'polygon(0 0, 50% 0, 50% 50%, 0 50%)'}}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded">
                      Premium: {pricingPlans[2]?.subscribers || 0} users
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{totalSubscribers}</p>
                    <p className="text-sm text-gray-400">Total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend with percentages */}
          <div className="mt-4 flex justify-center space-x-6">
            {pricingPlans.map((plan, index) => {
              const colors = ['bg-purple-600', 'bg-indigo-600', 'bg-blue-500'];
              const percentage = ((plan.subscribers / totalSubscribers) * 100).toFixed(1);
              
              return (
                <div key={plan.id} className="flex items-center">
                  <div className={`w-3 h-3 ${colors[index]} rounded-full mr-2`}></div>
                  <span className="text-xs">{plan.name} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Plan Performance</h3>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
            View Details
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-3">Plan Name</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Subscribers</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Tokens/Min</th>
                <th className="pb-3">Total Tokens</th>
              </tr>
            </thead>
            <tbody>
              {pricingPlans.map((plan) => (
                <tr key={plan.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-3 font-medium">{plan.name}</td>
                  <td className="py-3">${plan.price.toFixed(2)}</td>
                  <td className="py-3">{plan.subscribers}</td>
                  <td className="py-3">${plan.revenue.toFixed(2)}</td>
                  <td className="py-3">{plan.tokensPerMinute}</td>
                  <td className="py-3">{plan.tokens.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Visual representation of token allocation */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Token Allocation by Plan</h4>
          <div className="flex h-10 rounded-md overflow-hidden shadow-lg">
            {pricingPlans.map((plan, index) => {
              const percentage = (plan.tokens * plan.subscribers) / totalTokensAllocated * 100;
              const colors = [
                'bg-gradient-to-r from-purple-700 to-purple-500',
                'bg-gradient-to-r from-indigo-700 to-indigo-500',
                'bg-gradient-to-r from-blue-700 to-blue-500'
              ];
              return (
                <div 
                  key={plan.id}
                  className={`${colors[index % colors.length]} relative group`}
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {plan.name}: {percentage.toFixed(1)}% ({(plan.tokens * plan.subscribers).toLocaleString()} tokens)
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      
      <CTABanner 
        title="Ready to create or update your pricing plans?"
        description="Optimize your pricing strategy to maximize revenue and customer satisfaction."
        buttonText="Manage Pricing Plans"
        onClick={navigateToPricing}
      />
    </div>
  );
};

export default Dashboard;