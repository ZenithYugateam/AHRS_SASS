import React, { useEffect, useState } from 'react';
import { DollarSign, Users, Zap, Download, PlusCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import CTABanner from '../components/CTABanner';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Transaction {
  transactionId: string;
  amount: number;
  currency: string;
  date: string;
  email: string;
  paymentMethod: string;
  subscriptionType: string;
  timestamp: string;
}

interface AggregatedData {
  subscriptionType: string;
  revenue: number;
  subscribers: number;
}

interface DashboardProps {
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
  navigateToPricing: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ timeFilter, setTimeFilter, navigateToPricing }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Fetch transactions from the API endpoint
        const response = await fetch('https://upftf5d4qb.execute-api.us-east-1.amazonaws.com/default/dash');
        const data = await response.json();

        // Filter out transactions with unknown or empty subscription type
        const validTransactions = data.filter((txn: Transaction) => {
          const st = txn.subscriptionType?.trim().toLowerCase();
          return st && st !== 'unknown';
        });
        setTransactions(validTransactions);

        // Aggregate revenue and subscriber counts by subscription type
        const aggregation: { [key: string]: { revenue: number; subscribers: number } } = {};
        validTransactions.forEach((txn: Transaction) => {
          const subType = txn.subscriptionType.trim();
          if (!aggregation[subType]) {
            aggregation[subType] = { revenue: 0, subscribers: 0 };
          }
          aggregation[subType].revenue += Number(txn.amount);
          aggregation[subType].subscribers += 1;
        });

        const aggregatedArray: AggregatedData[] = Object.entries(aggregation).map(
          ([subscriptionType, values]) => ({
            subscriptionType,
            revenue: values.revenue,
            subscribers: values.subscribers
          })
        );
        setAggregatedData(aggregatedArray);

        // Calculate totals using only valid transactions
        const totalRev = validTransactions.reduce((acc: number, txn: Transaction) => acc + Number(txn.amount), 0);
        const totalSubs = validTransactions.length;
        setTotalRevenue(totalRev);
        setTotalSubscribers(totalSubs);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  // Prepare Chart.js data using the aggregatedData
  const chartData = {
    labels: aggregatedData.map(item => item.subscriptionType),
    datasets: [
      {
        label: 'Revenue',
        data: aggregatedData.map(item => item.revenue),
        backgroundColor: aggregatedData.map((_, idx) => {
          const colors = [
            'rgba(59, 130, 246, 0.6)',
            'rgba(99, 102, 241, 0.6)',
            'rgba(168, 85, 247, 0.6)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(245, 158, 11, 0.6)'
          ];
          return colors[idx % colors.length];
        }),
        borderColor: aggregatedData.map((_, idx) => {
          const colors = [
            'rgba(59, 130, 246, 1)',
            'rgba(99, 102, 241, 1)',
            'rgba(168, 85, 247, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)'
          ];
          return colors[idx % colors.length];
        }),
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Revenue by Subscription Type',
      },
    },
  };

  // For conic-gradient pie chart (Subscribers by Subscription Type)
  const totalSubsForPie = aggregatedData.reduce(
    (sum, item) => sum + item.subscribers,
    0
  );
  let cumulativePercent = 0;
  const pieSlices = aggregatedData.map((item, index) => {
    const colors = ['#3b82f6', '#6366f1', '#a855f7', '#10B981', '#F59E0B'];
    const color = colors[index % colors.length];
    const slicePercent = totalSubsForPie ? (item.subscribers / totalSubsForPie) * 100 : 0;
    const startPercent = cumulativePercent;
    cumulativePercent += slicePercent;
    return `${color} ${startPercent}% ${cumulativePercent}%`;
  }).join(', ');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex space-x-3">
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
          value={`$${totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`} 
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
          title="Total Transactions" 
          value={transactions.length} 
          change="12%" 
          icon={<Zap className="h-5 w-5 text-yellow-400" />}
          period={timeFilter}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue by Subscription Type Bar Chart using Chart.js */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Revenue by Subscription Type</h3>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
          <div className="h-64">
            {aggregatedData.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <span className="text-gray-400">No subscription data available</span>
            )}
          </div>
        </div>

        {/* Subscribers by Subscription Type Pie Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Subscribers by Subscription Type</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Pie Chart using conic-gradient with computed slices */}
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: `conic-gradient(${pieSlices})` }}
              />
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalSubscribers}</p>
                  <p className="text-sm text-gray-400">Total Subscribers</p>
                </div>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="mt-4 flex justify-center space-x-6">
            {aggregatedData.map((item, index) => {
              const colors = ['#3b82f6', '#6366f1', '#a855f7', '#10B981', '#F59E0B'];
              const color = colors[index % colors.length];
              const percentage = totalSubsForPie
                ? ((item.subscribers / totalSubsForPie) * 100).toFixed(1)
                : '0';
              return (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                  <span className="text-xs">
                    {item.subscriptionType} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <CTABanner 
        title="Ready to manage your subscriptions?"
        description="Optimize your pricing strategy to maximize revenue and customer satisfaction."
        buttonText="Manage Subscriptions"
        onClick={navigateToPricing}
      />
    </div>
  );
};

export default Dashboard;
