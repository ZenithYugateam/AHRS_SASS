import React from 'react';
import { PlusCircle, Building2, Users, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const StatCard = ({ title, count, applications, icon: Icon }) => (
    <div className="bg-gradient-to-br from-[#FF00FF] to-[#4169E1] rounded-xl p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <div className="bg-black/20 p-2 rounded-full">
          <Icon size={24} />
        </div>
      </div>
      <div className="text-4xl font-bold mb-4">{count}</div>
      <div className="flex justify-between">
        <span className="text-white/80">{applications} Applications</span>
        <button className="text-white/80 hover:text-white transition-colors">View Details</button>
      </div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Welcome Zenithyuga,</h2>
          <p className="text-gray-400 mt-1">
            We are delighted to have you here. This platform is designed to streamline your job posting process and help you find the best talent for your organization.
          </p>
        </div>
        <button
          onClick={() => navigate('/post-job')}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A1528] text-white border border-gray-700 rounded-lg hover:bg-[#2A2538] transition-colors"
        >
          <PlusCircle size={20} />
          Post New Interview
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Interviews" 
          count="10" 
          applications="10" 
          icon={Building2}
        />
        <StatCard 
          title="Total Participants" 
          count="10" 
          applications="10" 
          icon={Users}
        />
        <StatCard 
          title="Total Qualified" 
          count="4" 
          applications="10" 
          icon={UserCheck}
        />
      </div>
    </main>
  );
}

export default Dashboard;