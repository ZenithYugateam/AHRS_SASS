import React, { useEffect, useState } from 'react';
import { Download, BarChart2, PieChart, TrendingUp, Users, Calendar, Zap } from 'lucide-react';

interface User {
  tokensLeft: number;
  email: string;
  subscriptionType: string;
  tokensPurchased: number;
  transactionId?: string;
}

interface Interview {
  submittedAt: string;
  totalDuration: number; // in seconds
}

const AnalyticsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [usersRes, durationsRes] = await Promise.all([
          fetch('https://3a42g08nvb.execute-api.us-east-1.amazonaws.com/default/fetchusers'),
          fetch('https://7g9dqcxrn0.execute-api.us-east-1.amazonaws.com/default/durations')
        ]);
        const usersData = await usersRes.json();
        const durationsData = await durationsRes.json();

        // Filter to separate token data from the users endpoint
        const tokenUsers = usersData.filter((item: any) => item.tokensPurchased !== undefined);
        // The durations API returns the interview durations
        setUsers(tokenUsers);
        setInterviews(durationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // ----------------------------
  // Token Analytics Calculations
  // ----------------------------
  const totalUsers = users.length;
  const totalTokensPurchased = users.reduce((sum, user) => sum + user.tokensPurchased, 0);
  const totalTokensLeft = users.reduce((sum, user) => sum + user.tokensLeft, 0);
  const totalTokensUsed = totalTokensPurchased - totalTokensLeft;
  const tokenUsagePercentage = totalTokensPurchased > 0 ? Math.round((totalTokensUsed / totalTokensPurchased) * 100) : 0;

  const planTokens = users.reduce((acc, user) => {
    acc[user.subscriptionType] = (acc[user.subscriptionType] || 0) + user.tokensPurchased;
    return acc;
  }, {} as Record<string, number>);

  // ------------------------------
  // Interview Analytics Calculations
  // ------------------------------
  const totalInterviews = interviews.length;
  // Sum totalDuration (in seconds)
  const totalDurationSeconds = interviews.reduce((sum, interview) => sum + interview.totalDuration, 0);
  // Convert to minutes for average calculation
  const avgInterviewDuration = totalInterviews > 0 ? (totalDurationSeconds / 60) / totalInterviews : 0;

  // Bucket interviews based on duration in minutes
  const durationBuckets = {
    '<10': interviews.filter(i => (i.totalDuration / 60) < 10).length,
    '10-20': interviews.filter(i => (i.totalDuration / 60) >= 10 && (i.totalDuration / 60) < 20).length,
    '20-30': interviews.filter(i => (i.totalDuration / 60) >= 20 && (i.totalDuration / 60) < 30).length,
    '30+': interviews.filter(i => (i.totalDuration / 60) >= 30).length,
  };

  const durationPercent = (bucketCount: number) =>
    totalInterviews > 0 ? Math.round((bucketCount / totalInterviews) * 100) : 0;

  // Get the most recent interview timestamp
  const latestInterview = interviews.length
    ? new Date(Math.max(...interviews.map(i => new Date(i.submittedAt).getTime()))).toLocaleString()
    : 'N/A';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Token Analytics Dashboard</h2>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md flex items-center shadow-md">
          <Download className="h-5 w-5 mr-2" />
          Export Report
        </button>
      </div>

      {/* Token Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Total Tokens */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Total Tokens</h3>
            <Zap className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-white mb-2">{totalTokensPurchased}</div>
            <p className="text-gray-400">Tokens Purchased</p>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Used</span>
              <span className="text-white">{totalTokensUsed} tokens</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Remaining</span>
              <span className="text-white">{totalTokensLeft} tokens</span>
            </div>
          </div>
        </div>

        {/* Usage Rate */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Usage Rate</h3>
            <BarChart2 className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-white mb-2">{tokenUsagePercentage}%</div>
            <p className="text-gray-400">Token Utilization</p>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-4 rounded-full"
              style={{ width: `${tokenUsagePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Token Distribution */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Token Distribution</h3>
            <PieChart className="h-5 w-5 text-purple-400" />
          </div>
          <div className="space-y-4">
            {Object.entries(planTokens).map(([plan, tokens]) => (
              <div key={plan}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{plan}</span>
                  <span className="text-white">{tokens} tokens</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full"
                    style={{ width: `${(tokens / totalTokensPurchased) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Token Efficiency + Token Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Token Efficiency */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Token Efficiency</h3>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Avg. Tokens per User</p>
              <p className="text-2xl font-bold text-white">
                {totalUsers ? Math.round(totalTokensPurchased / totalUsers) : 0}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Avg. Usage per User</p>
              <p className="text-2xl font-bold text-white">
                {totalUsers ? Math.round(totalTokensUsed / totalUsers) : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Token Status */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Token Status</h3>
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Active Tokens</p>
              <p className="text-2xl font-bold text-white">{totalTokensLeft}</p>
              <p className="text-xs text-green-400">Available for use</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Used Tokens</p>
              <p className="text-2xl font-bold text-white">{totalTokensUsed}</p>
              <p className="text-xs text-blue-400">Consumed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Duration Card */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Interview Durations</h3>
          <Users className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="text-white mb-4">
          <p>Total Interviews: <span className="font-bold">{totalInterviews}</span></p>
          <p>Average Duration: <span className="font-bold">{avgInterviewDuration.toFixed(1)} min</span></p>
          <p>Last Interview At: <span className="font-bold">{latestInterview}</span></p>
        </div>
        <div className="space-y-3">
          {Object.entries(durationBuckets).map(([label, count]) => (
            <div key={label}>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>{label} min</span>
                <span>{durationPercent(count)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 h-3 rounded-full"
                  style={{ width: `${durationPercent(count)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
