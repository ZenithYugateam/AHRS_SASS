import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add registration logic here
    navigate('/candidate-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0F0B1E] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            <span className="text-white">Si</span>
            <span className="text-purple-500">gn</span>
            <span className="text-white"> up</span>
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="text-white">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 mt-1 bg-[#1A1528] border border-gray-700 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="text-white">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 mt-1 bg-[#1A1528] border border-gray-700 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="mobile" className="text-white">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                required
                className="appearance-none relative block w-full px-3 py-3 mt-1 bg-[#1A1528] border border-gray-700 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-white">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 mt-1 bg-[#1A1528] border border-gray-700 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 mt-1 bg-[#1A1528] border border-gray-700 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Sign Up
          </button>

          <div className="text-center text-white">
            Already have an account?{' '}
            <Link to="/signin" className="text-purple-500 hover:text-purple-400">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;