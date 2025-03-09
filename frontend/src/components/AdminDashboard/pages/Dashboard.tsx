import React, { useEffect, useState } from 'react';
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
  const [pricingPlans1, setPricingPlans1] = useState<PricingPlan[]>([]);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('https://ngwu0au0uh.execute-api.us-east-1.amazonaws.com/default/get_pricing_list');
        const data = await response.json();

        const formattedData = data.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          duration: Number(plan.duration),
          tokensPerMinute: Number(plan.tokensPerMinute),
          tokens: Number(plan.tokens),
          price: Number(plan.price),
          subscribers: Number(plan.subscribers),
          revenue: Number(plan.revenue)
        }));

        setPricingPlans1(formattedData);

        // Calculate total subscribers, revenue, and tokens
        const totalSubs = formattedData.reduce((acc: any, plan: { subscribers: any; }) => acc + plan.subscribers, 0);
        const totalRev = formattedData.reduce((acc: any, plan: { revenue: any; }) => acc + plan.revenue, 0);
        const totalToks = formattedData.reduce((acc: any, plan: { tokens: any; }) => acc + plan.tokens, 0);

        setTotalSubscribers(totalSubs);
        setTotalRevenue(totalRev);
        setTotalTokens(totalToks);

      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  const premiumPlans = pricingPlans1.filter(plan => plan.name.toLowerCase().includes('premium'));
  const standardPlans = pricingPlans1.filter(plan => plan.name.toLowerCase().includes('standard'));
  const basicPlans = pricingPlans1.filter(plan => plan.name.toLowerCase().includes('basic'));

  const totalPremiumSubscribers = premiumPlans.reduce((acc, plan) => acc + plan.subscribers, 0);
  const totalStandardSubscribers = standardPlans.reduce((acc, plan) => acc + plan.subscribers, 0);
  const totalBasicSubscribers = basicPlans.reduce((acc, plan) => acc + plan.subscribers, 0);

  const premiumPercentage = ((totalPremiumSubscribers / totalSubscribers) * 100).toFixed(1);
  const standardPercentage = ((totalStandardSubscribers / totalSubscribers) * 100).toFixed(1);
  const basicPercentage = ((totalBasicSubscribers / totalSubscribers) * 100).toFixed(1);

  


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
          value={totalTokens.toLocaleString()} 
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
    {pricingPlans.map((plan) => {
     
      const maxRevenue = Math.max(...pricingPlans1.map(p => p.revenue));
      const height = maxRevenue ? (plan.revenue / maxRevenue) * 100 : 0;

      // Set colors based on plan type
      const color = plan.name.toLowerCase().includes('premium')
        ? 'from-blue-500 to-blue-400'
        : plan.name.toLowerCase().includes('standard')
        ? 'from-indigo-600 to-indigo-400'
        : 'from-purple-600 to-purple-400';

      return (
        <div key={plan.id} className="flex flex-col items-center">
          <div
            className={`w-16 bg-gradient-to-t ${color} rounded-t relative group shadow-lg shadow-purple-900/20`}
            style={{ height: `${height}%` }}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              ${plan.revenue.toFixed(2)} ({plan.price.toFixed(2)} × {plan.subscribers})
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400 text-center w-16 truncate">
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
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Interactive Pie Chart */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    #3b82f6 ${premiumPercentage}%,
                    #6366f1 ${premiumPercentage}% ${parseFloat(premiumPercentage) + parseFloat(standardPercentage)}%,
                    #a855f7 ${parseFloat(premiumPercentage) + parseFloat(standardPercentage)}% 100%
                  )`
                }}
              />

              {/* Hover labels */}
              {/* Premium */}
              {totalPremiumSubscribers > 0 && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div
                    className="absolute w-20 h-20 -top-6 left-0 flex items-center justify-center"
                    style={{ transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded">
                      Premium: {totalPremiumSubscribers} users ({premiumPercentage}%)
                    </div>
                  </div>
                </div>
              )}

              {/* Standard */}
              {totalStandardSubscribers > 0 && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div
                    className="absolute w-20 h-20 -top-6 right-0 flex items-center justify-center"
                    style={{ transform: 'translate(50%, -50%)' }}
                  >
                    <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded">
                      Standard: {totalStandardSubscribers} users ({standardPercentage}%)
                    </div>
                  </div>
                </div>
              )}

              {/* Basic */}
              {totalBasicSubscribers > 0 && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div
                    className="absolute w-20 h-20 bottom-0 flex items-center justify-center"
                    style={{ transform: 'translate(0%, 50%)' }}
                  >
                    <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded">
                      Basic: {totalBasicSubscribers} users ({basicPercentage}%)
                    </div>
                  </div>
                </div>
              )}

              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalSubscribers}</p>
                  <p className="text-sm text-gray-400">Total Subscribers</p>
                </div>
              </div>
            </div>

            </div>
          </div>
          
          {/* Legend with percentages */}
          <div className="mt-4 flex justify-center space-x-6">
            {/* Premium */}
            {totalPremiumSubscribers >= 0 && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-xs">
                  Premium ({premiumPercentage}%)
                </span>
              </div>
            )}
            
            {/* Standard */}
            {totalStandardSubscribers >= 0 && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
                <span className="text-xs">
                  Standard ({standardPercentage}%)
                </span>
              </div>
            )}

            {/* Basic */}
            {totalBasicSubscribers >= 0 && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
                <span className="text-xs">
                  Basic ({basicPercentage}%)
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
        <h3 className="text-xl font-bold mb-4">Plan Performance</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="pb-3">Plan Name</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Subscribers</th>
              <th className="pb-3">Revenue</th>
              <th className="pb-3">Tokens/Min</th>
              <th className="pb-3">Total Tokens</th>
            </tr>
          </thead>
          <tbody>
            {pricingPlans1.map((plan) => (
              <tr key={plan.id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="py-3">{plan.name}</td>
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