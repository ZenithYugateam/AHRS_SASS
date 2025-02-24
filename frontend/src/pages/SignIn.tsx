import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignIn() {
  const [credentials, setCredentials] = useState({
    identifier: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add authentication logic here
    navigate('/candidate-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0F0B1E] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            <span className="text-white">Si</span>
            <span className="text-purple-500">gn</span>
            <span className="text-white"> in</span>
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="text-white">
                Email /Username /Mobile no.
              </label>
              <input
                id="identifier"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 mt-1 bg-[#1A1528] border border-gray-700 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={credentials.identifier}
                onChange={(e) => setCredentials({ ...credentials, identifier: e.target.value })}
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
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-purple-500 hover:text-purple-400">
              Forgot password ?
            </Link>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Sign In
          </button>

          <div className="text-center text-white">
            Doesn't have an account yet?{' '}
            <Link to="/signup" className="text-purple-500 hover:text-purple-400">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;