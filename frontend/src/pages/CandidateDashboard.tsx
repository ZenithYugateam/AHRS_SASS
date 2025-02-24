import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

function CandidateDashboard() {
  const applications = [
    {
      company: "Dealermatix Technologies",
      position: "Trainee Analyst",
      status: "Scheduled",
      date: "2024-03-15",
      time: "10:00 AM",
      logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=100"
    },
    {
      company: "TechCorp Solutions",
      position: "Junior Developer",
      status: "Completed",
      date: "2024-03-10",
      time: "2:30 PM",
      logo: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100"
    }
  ];

  const stats = [
    {
      title: "Applied Jobs",
      count: 8,
      icon: BriefcaseIcon,
      color: "from-purple-600 to-blue-500"
    },
    {
      title: "Pending Interviews",
      count: 3,
      icon: ClockIcon,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Completed",
      count: 4,
      icon: CheckCircleIcon,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Rejected",
      count: 1,
      icon: XCircleIcon,
      color: "from-red-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F0B1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Welcome Back, John!</h2>
            <p className="text-gray-400 mt-1">
              Track your job applications and upcoming interviews
            </p>
          </div>
          <Link
            to="/browse-jobs"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{stat.title}</h3>
                <div className="bg-black/20 p-2 rounded-full">
                  <stat.icon size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold">{stat.count}</div>
            </div>
          ))}
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-[#1A1528] rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Upcoming Interviews</h3>
          <div className="space-y-4">
            {applications.map((application, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[#2A2538] rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={application.logo}
                    alt={application.company}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{application.position}</h4>
                    <p className="text-gray-400">{application.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white">{application.date}</div>
                  <div className="text-gray-400">{application.time}</div>
                </div>
                <div
                  className={`px-4 py-1 rounded-full text-sm ${
                    application.status === "Scheduled"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {application.status}
                </div>
                {application.status === "Scheduled" && (
                  <Link
                    to="/interview"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors ml-4"
                  >
                    Join Interview
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1A1528] rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <p>Application submitted for Senior Developer position at TechCorp</p>
              <span className="text-sm">2 hours ago</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p>Interview completed for Junior Developer position</p>
              <span className="text-sm">1 day ago</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <p>Profile updated with new skills</p>
              <span className="text-sm">2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateDashboard;