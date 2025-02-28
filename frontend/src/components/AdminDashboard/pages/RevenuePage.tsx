import React from 'react';
import { DollarSign, Wallet, Users, TrendingUp, Download, Calendar } from 'lucide-react';
import StatCard from '../components/StatCard';

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

interface RevenuePageProps {
  pricingPlans: PricingPlan[];
}

const RevenuePage: React.FC<RevenuePageProps> = ({ pricingPlans }) => {
  const totalRevenue = pricingPlans.reduce((sum, plan) => sum + plan.revenue, 0);
  const totalSubscribers = pricingPlans.reduce((sum, plan) => sum + plan.subscribers, 0);

  // Generate monthly data for the chart
  const monthlyData = Array.from({ length: 12 }).map((_, i) => {
    // Create a realistic growth pattern with some randomness
    const baseValue = totalRevenue * (0.7 + (i * 0.05));
    const randomFactor = 0.9 + (Math.random() * 0.2); // Random between 0.9 and 1.1
    return baseValue * randomFactor;
  });

  // Calculate the maximum value for scaling
  const maxValue = Math.max(...monthlyData);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Revenue Analytics</h2>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md flex items-center shadow-md">
          <Download className="h-5 w-5 mr-2" />
          Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Monthly Revenue" 
          value={`$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} 
          change="15%" 
          icon={<DollarSign className="h-5 w-5 text-green-400" />}
        />
        
        <StatCard 
          title="Annual Revenue" 
          value={`$${(totalRevenue * 12).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} 
          change="22% YoY" 
          icon={<Wallet className="h-5 w-5 text-green-400" />}
        />
        
        <StatCard 
          title="Avg. Revenue Per User" 
          value={`$${(totalRevenue / totalSubscribers).toFixed(2)}`} 
          change="5%" 
          icon={<Users className="h-5 w-5 text-blue-400" />}
        />
        
        <StatCard 
          title="Churn Rate" 
          value="3.2%" 
          change="0.8%" 
          icon={<TrendingUp className="h-5 w-5 text-red-400" />}
        />
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Revenue Trends</h3>
          <div className="flex space-x-2">
            <button className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">3M</button>
            <button className="text-xs bg-purple-600 px-2 py-1 rounded">6M</button>
            <button className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">1Y</button>
          </div>
        </div>
        <div className="h-64 flex items-end space-x-2">
          {monthlyData.map((value, i) => {
            const height = (value / maxValue) * 90; // Scale to 90% of container height
            const colors = [
              'from-purple-600 to-indigo-600',
              'from-indigo-600 to-blue-600',
              'from-blue-600 to-cyan-600'
            ];
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full bg-gradient-to-t ${colors[i % 3]} rounded-t relative group shadow-lg shadow-purple-900/20`}
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${value.toFixed(2)}
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Revenue by Plan</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">This Month</th>
                  <th className="pb-3">Last Month</th>
                  <th className="pb-3">Growth</th>
                </tr>
              </thead>
              <tbody>
                {pricingPlans.map((plan) => {
                  const lastMonth = plan.revenue * (0.85 + Math.random() * 0.1);
                  const growth = ((plan.revenue - lastMonth) / lastMonth) * 100;
                  return (
                    <tr key={plan.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="py-3 font-medium">{plan.name}</td>
                      <td className="py-3">${plan.revenue.toFixed(2)}</td>
                      <td className="py-3">${lastMonth.toFixed(2)}</td>
                      <td className={`py-3 ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Add visual representation of revenue distribution */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Revenue Distribution</h4>
            <div className="flex h-10 rounded-md overflow-hidden shadow-lg">
              {pricingPlans.map((plan, index) => {
                const percentage = (plan.revenue / totalRevenue) * 100;
                const colors = [
                  'bg-gradient-to-r from-purple-700 to-purple-500',
                  'bg-gradient-to-r from-indigo-700 to-indigo-500',
                  'bg-gradient-to-r from-blue-700 to-blue-500',
                  'bg-gradient-to-r from-cyan-700 to-cyan-500'
                ];
                return (
                  <div 
                    key={plan.id}
                    className={`${colors[index % colors.length]} relative group`}
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {plan.name}: {percentage.toFixed(1)}%
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
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Forecasted Revenue</h3>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          
          {/* Add visual forecast chart */}
          <div className="h-40 mb-6 relative">
            <div className="absolute inset-x-0 bottom-0 h-px bg-gray-700"></div>
            <div className="absolute inset-y-0 left-0 w-px bg-gray-700"></div>
            
            <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
              {/* Historical data line */}
              <path 
                d="M0,40 L10,38 L20,35 L30,32" 
                fill="none" 
                stroke="#8B5CF6" 
                strokeWidth="3"
                filter="drop-shadow(0 1px 2px rgba(139, 92, 246, 0.5))"
              />
              
              {/* Forecast line (dashed) */}
              <path 
                d="M30,32 L40,28 L50,25 L60,21 L70,18 L80,15 L90,12 L100,10" 
                fill="none" 
                stroke="url(#forecastGradient)" 
                strokeWidth="3"
                strokeDasharray="3,3"
                filter="drop-shadow(0 1px 2px rgba(79, 70, 229, 0.5))"
              />
              
              {/* Confidence area */}
              <path 
                d="M30,32 L40,28 L50,25 L60,21 L70,18 L80,15 L90,12 L100,10 L100,20 L90,22 L80,25 L70,28 L60,31 L50,35 L40,38 L30,32 Z" 
                fill="url(#areaGradient)"
                opacity="0.3"
              />
              
              <defs>
                <linearGradient id="forecastGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400">
              <span>Current</span>
              <span>Q3</span>
              <span>Q4</span>
              <span>FY 2025</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3">Period</th>
                  <th className="pb-3">Projected Revenue</th>
                  <th className="pb-3">Growth</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-3 font-medium">Next Month</td>
                  <td className="py-3">${(totalRevenue * 1.08).toFixed(2)}</td>
                  <td className="py-3 text-green-500">↑ 8.0%</td>
                </tr>
                <tr className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-3 font-medium">Q3 2025</td>
                  <td className="py-3">${(totalRevenue * 3.5).toFixed(2)}</td>
                  <td className="py-3 text-green-500">↑ 16.7%</td>
                </tr>
                <tr className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-3 font-medium">Q4 2025</td>
                  <td className="py-3">${(totalRevenue * 4.2).toFixed(2)}</td>
                  <td className="py-3 text-green-500">↑ 20.0%</td>
                </tr>
                <tr className="hover:bg-gray-750">
                  <td className="py-3 font-medium">FY 2025</td>
                  <td className="py-3">${(totalRevenue * 14).toFixed(2)}</td>
                  <td className="py-3 text-green-500">↑ 22.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenuePage;