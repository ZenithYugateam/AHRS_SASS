import React, { useState, useEffect } from 'react';
import { DollarSign, Wallet, Users, TrendingUp, Download, Calendar } from 'lucide-react';
import StatCard from '../components/StatCard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

const RevenuePage: React.FC = () => {
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pricing plans from the pricing API
  useEffect(() => {
    const fetchPricingPlans = async () => {
      try {
        const response = await fetch(
          'https://ngwu0au0uh.execute-api.us-east-1.amazonaws.com/default/get_pricing_list'
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedData = data.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          duration: Number(plan.duration),
          tokensPerMinute: Number(plan.tokensPerMinute),
          tokens: Number(plan.tokens),
          price: Number(plan.price),
          subscribers: Number(plan.subscribers),
          revenue: Number(plan.revenue),
        }));
        setPricingPlans(formattedData);
      } catch (err) {
        console.error('Error fetching pricing plans:', err);
        setError('Failed to load pricing plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPricingPlans();
  }, []);

  // Fetch transactions from the dash API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          'https://upftf5d4qb.execute-api.us-east-1.amazonaws.com/default/dash'
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        // If the API returns a single transaction, wrap it in an array.
        setTransactions(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        // Optionally set an error state for transactions if needed
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <p>{error}</p>
      </div>
    );
  }

  // Group transactions by subscription type and sum their revenue
  const transactionRevenueByType = transactions.reduce((acc: Record<string, number>, tx: any) => {
    if (tx.subscriptionType && tx.amount) {
      const amount = Number(tx.amount);
      acc[tx.subscriptionType] = (acc[tx.subscriptionType] || 0) + amount;
    }
    return acc;
  }, {});

  // Merge transaction revenue into pricing plans. If a subscription type from transactions
  // does not exist in the pricing plans, add it as a new plan.
  const plansMap: Record<string, PricingPlan> = {};
  pricingPlans.forEach(plan => {
    plansMap[plan.name] = { ...plan };
  });

  Object.entries(transactionRevenueByType).forEach(([subscription, revenue]) => {
    if (plansMap[subscription]) {
      plansMap[subscription].revenue += revenue;
      // Optionally update subscribers count if you want to count each new transaction as a subscriber
      plansMap[subscription].subscribers += 1;
    } else {
      plansMap[subscription] = {
        id: Date.now(), // Use a unique ID generator as needed
        name: subscription,
        duration: 0,
        tokensPerMinute: 0,
        tokens: 0,
        price: 0,
        subscribers: 1,
        revenue: revenue,
      };
    }
  });

  const aggregatedPlans = Object.values(plansMap);
  const totalRevenue = aggregatedPlans.reduce((sum, plan) => sum + plan.revenue, 0);
  const totalSubscribers = aggregatedPlans.reduce((sum, plan) => sum + plan.subscribers, 0);

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
          value={`$${totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change="↑"
          icon={<DollarSign className="h-5 w-5 text-green-400" />}
        />
        <StatCard
          title="Annual Revenue"
          value={`$${(totalRevenue * 12).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change="↑"
          icon={<Wallet className="h-5 w-5 text-green-400" />}
        />
        <StatCard
          title="Avg. Revenue Per User"
          value={`$${(totalSubscribers > 0 ? totalRevenue / totalSubscribers : 0).toFixed(2)}`}
          change="↑"
          icon={<Users className="h-5 w-5 text-blue-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Plan Table */}
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
                {aggregatedPlans.map((plan) => {
                  const lastMonth = plan.revenue * (0.85 + Math.random() * 0.1);
                  const growth = lastMonth ? ((plan.revenue - lastMonth) / lastMonth) * 100 : 0;
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

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Revenue Distribution</h4>
            <div className="flex h-10 rounded-md overflow-hidden shadow-lg">
              {aggregatedPlans.map((plan, index) => {
                const percentage = totalRevenue > 0 ? (plan.revenue / totalRevenue) * 100 : 0;
                const colors = [
                  'bg-gradient-to-r from-purple-700 to-purple-500',
                  'bg-gradient-to-r from-indigo-700 to-indigo-500',
                  'bg-gradient-to-r from-blue-700 to-blue-500',
                  'bg-gradient-to-r from-cyan-700 to-cyan-500',
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

        {/* Forecasted Revenue Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Forecasted Revenue</h3>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>

          <div className="h-40 mb-6 relative">
            <div className="absolute inset-x-0 bottom-0 h-px bg-gray-700"></div>
            <div className="absolute inset-y-0 left-0 w-px bg-gray-700"></div>
            <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
              <path
                d="M0,40 L10,38 L20,35 L30,32"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="3"
                filter="drop-shadow(0 1px 2px rgba(139, 92, 246, 0.5))"
              />
              <path
                d="M30,32 L40,28 L50,25 L60,21 L70,18 L80,15 L90,12 L100,10"
                fill="none"
                stroke="url(#forecastGradient)"
                strokeWidth="3"
                strokeDasharray="3,3"
                filter="drop-shadow(0 1px 2px rgba(79, 70, 229, 0.5))"
              />
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
