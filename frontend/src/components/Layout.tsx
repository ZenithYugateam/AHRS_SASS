import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0F0B1E]">
      {/* Header */}
      <header className="bg-[#1A1528] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-white">247Interview.com</Link>
            <div className="flex items-center gap-6">
              <nav className="flex gap-4">
                <Link 
                  to="/" 
                  className={`text-gray-300 hover:text-white transition-colors ${
                    location.pathname === '/' ? 'text-white' : ''
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/post-job" 
                  className={`text-gray-300 hover:text-white transition-colors ${
                    location.pathname === '/post-job' ? 'text-white' : ''
                  }`}
                >
                  Jobs
                </Link>
              </nav>
              <button className="w-8 h-8 rounded-full bg-gray-700">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <Outlet />
    </div>
  );
}

export default Layout;