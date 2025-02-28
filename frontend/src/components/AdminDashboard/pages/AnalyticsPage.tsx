import React from 'react';
import { Download, BarChart2, PieChart, TrendingUp, Users, Calendar, Zap } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  // Generate random data for charts
  const dailyUsage = Array.from({ length: 7 }).map(() => 30 + Math.random() * 70);
  const monthlyUsage = Array.from({ length: 6 }).map((_, i) => 50 - i * 5 + Math.random() * 10);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md flex items-center shadow-md">
          <Download className="h-5 w-5 mr-2" />
          Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Usage Metrics</h3>
            <BarChart2 className="h-5 w-5 text-blue-400" />
          </div>
          <div className="h-64 flex items-end space-x-2">
            {dailyUsage.map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t relative group shadow-lg shadow-blue-900/20"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {Math.round(height * 100)} tokens
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400">Daily token consumption across all plans</p>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Plan Distribution</h3>
            <PieChart className="h-5 w-5 text-purple-400" />
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Actual pie chart with hover effects */}
              <div className="absolute inset-0 rounded-full border-8 border-purple-600 group" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded">
                    Basic: 49%
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-8 border-indigo-600 group" style={{clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 60%)'}}>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded">
                    Standard: 33%
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-8 border-blue-500 group" style={{clipPath: 'polygon(0 0, 60% 0, 60% 60%, 0 60%)'}}>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded">
                    Premium: 18%
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">86</p>
                  <p className="text-sm text-gray-400">Total Users</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
              <span className="text-xs">Basic (49%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
              <span className="text-xs">Standard (33%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-xs">Premium (18%)</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Token Usage Trends</h3>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div className="h-64 relative">
            {/* Line chart with grid lines and data points */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-5">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="border-b border-l border-gray-700 opacity-30"></div>
              ))}
            </div>
            
            <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
              {/* Line path */}
              <path 
                d="M0,50 L10,45 L20,48 L30,40 L40,42 L50,35 L60,30 L70,25 L80,20 L90,15 L100,10" 
                fill="none" 
                stroke="url(#gradient)" 
                strokeWidth="3"
                filter="drop-shadow(0 2px 4px rgba(139, 92, 246, 0.5))"
              />
              
              {/* Data points */}
              <circle cx="0" cy="50" r="2" fill="#8B5CF6" />
              <circle cx="10" cy="45" r="2" fill="#8B5CF6" />
              <circle cx="20" cy="48" r="2" fill="#8B5CF6" />
              <circle cx="30" cy="40" r="2" fill="#8B5CF6" />
              <circle cx="40" cy="42" r="2" fill="#8B5CF6" />
              <circle cx="50" cy="35" r="2" fill="#8B5CF6" />
              <circle cx="60" cy="30" r="2" fill="#8B5CF6" />
              <circle cx="70" cy="25" r="2" fill="#8B5CF6" />
              <circle cx="80" cy="20" r="2" fill="#8B5CF6" />
              <circle cx="90" cy="15" r="2" fill="#8B5CF6" />
              <circle cx="100" cy="10" r="2" fill="#8B5CF6" />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
            
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between items-start text-xs text-gray-400">
              <span>10K</span>
              <span>8K</span>
              <span>6K</span>
              <span>4K</span>
              <span>2K</span>
              <span>0</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400">Monthly token usage showing 28% increase over 6 months</p>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">User Engagement</h3>
            <Users className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700 p-4 rounded-lg relative group">
              <p className="text-sm text-gray-400 mb-1">Avg. Session Duration</p>
              <p className="text-2xl font-bold">18.5 min</p>
              <p className="text-xs text-green-400">↑ 12% from last month</p>
              
              {/* Mini sparkline */}
              <div className="absolute right-4 top-4 w-16 h-8">
                <svg className="w-full h-full" viewBox="0 0 32 16" preserveAspectRatio="none">
                  <path 
                    d="M0,12 L4,10 L8,11 L12,8 L16,9 L20,7 L24,5 L28,4 L32,3" 
                    fill="none" 
                    stroke="#8B5CF6" 
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg relative group">
              <p className="text-sm text-gray-400 mb-1">Interviews Completed</p>
              <p className="text-2xl font-bold">1,248</p>
              <p className="text-xs text-green-400">↑ 8% from last month</p>
              
              {/* Mini sparkline */}
              <div className="absolute right-4 top-4 w-16 h-8">
                <svg className="w-full h-full" viewBox="0 0 32 16" preserveAspectRatio="none">
                  <path 
                    d="M0,10 L4,11 L8,9 L12,8 L16,7 L20,6 L24,5 L28,4 L32,3" 
                    fill="none" 
                    stroke="#8B5CF6" 
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg relative group">
              <p className="text-sm text-gray-400 mb-1">Retention Rate</p>
              <p className="text-2xl font-bold">92.4%</p>
              <p className="text-xs text-green-400">↑ 3.2% from last month</p>
              
              {/* Mini sparkline */}
              <div className="absolute right-4 top-4 w-16 h-8">
                <svg className="w-full h-full" viewBox="0 0 32 16" preserveAspectRatio="none">
                  <path 
                    d="M0,8 L4,7 L8,8 L12,6 L16,5 L20,4 L24,3 L28,3 L32,2" 
                    fill="none" 
                    stroke="#8B5CF6" 
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg relative group">
              <p className="text-sm text-gray-400 mb-1">New Users</p>
              <p className="text-2xl font-bold">86</p>
              <p className="text-xs text-green-400">↑ 15% from last month</p>
              
              {/* Mini sparkline */}
              <div className="absolute right-4 top-4 w-16 h-8">
                <svg className="w-full h-full" viewBox="0 0 32 16" preserveAspectRatio="none">
                  <path 
                    d="M0,12 L4,10 L8,9 L12,7 L16,6 L20,4 L24,3 L28,2 L32,1" 
                    fill="none" 
                    stroke="#8B5CF6" 
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-400">User engagement metrics across all plans</p>
          </div>
        </div>
      </div>
      
      {/* Additional analytics section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Token Consumption</h3>
            <Zap className="h-5 w-5 text-yellow-400" />
          </div>
          
          {/* Radial progress chart */}
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#374151" strokeWidth="2"></circle>
                <circle 
                  cx="18" 
                  cy="18" 
                  r="16" 
                  fill="none" 
                  stroke="#8B5CF6" 
                  strokeWidth="3" 
                  strokeDasharray="100" 
                  strokeDashoffset="28"
                  transform="rotate(-90 18 18)"
                  filter="drop-shadow(0 1px 3px rgba(139, 92, 246, 0.5))"
                ></circle>
                <text x="18" y="18" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="6">72%</text>
                <text x="18" y="24" textAnchor="middle" dominantBaseline="middle" fill="#9CA3AF" fontSize="2">of limit</text>
              </svg>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Basic Plan</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-700 to-purple-500 h-3 rounded-full shadow-sm shadow-purple-900/20" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Standard Plan</span>
                <span>78%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 h-3 rounded-full shadow-sm shadow-indigo-900/20" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Premium Plan</span>
                <span>42%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 h-3 rounded-full shadow-sm shadow-blue-900/20" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Interview Duration</h3>
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>
          
          {/* Horizontal bar chart */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">&lt; 10 minutes</span>
                <span>18%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-500 h-3 rounded-full shadow-sm shadow-blue-900/20" style={{ width: '18%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">10-20 minutes</span>
                <span>42%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-500 h-3 rounded-full shadow-sm shadow-blue-900/20" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">20-30 minutes</span>
                <span>27%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-500 h-3 rounded-full shadow-sm shadow-blue-900/20" style={{ width: '27%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">30+ minutes</span>
                <span>13%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-500 h-3 rounded-full shadow-sm shadow-blue-900/20" style={{ width: '13%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">Average: 22.5 minutes</p>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">User Activity</h3>
            <Users className="h-5 w-5 text-green-400" />
          </div>
          
          {/* Heat map calendar */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {Array.from({ length: 28 }).map((_, i) => {
              const intensity = Math.random();
              let bgColor = 'bg-gray-700';
              
              if (intensity > 0.8) bgColor = 'bg-green-700';
              else if (intensity > 0.6) bgColor = 'bg-green-600';
              else if (intensity > 0.4) bgColor = 'bg-green-500 bg-opacity-60';
              else if (intensity > 0.2) bgColor = 'bg-green-500 bg-opacity-40';
              
              return (
                <div 
                  key={i} 
                  className={`w-full aspect-square rounded-sm ${bgColor} hover:ring-1 hover:ring-white shadow-sm`}
                  title={`${Math.round(intensity * 100)} users`}
                ></div>
              );
            })}
          </div>
          
          <div className="flex justify-between text-xs text-gray-400 mb-4">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 bg-opacity-40 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 bg-opacity-60 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Peak activity:</span>
              <span>Tuesdays, 2-4 PM</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Lowest activity:</span>
              <span>Weekends</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Growth trend:</span>
              <span className="text-green-400">↑ 18% weekly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;