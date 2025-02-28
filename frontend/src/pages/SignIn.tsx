import React, { useState } from 'react';
import { Sun, Moon, Eye, EyeOff } from 'lucide-react';

function SignIn() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-blue-100 text-gray-900'
    }`}>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-opacity-10 hover:bg-white transition-colors"
      >
        {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${
          isDarkMode 
            ? 'bg-gray-800 bg-opacity-50 backdrop-blur-lg' 
            : 'bg-white'
        }`}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>back</span>
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your next career opportunity awaits
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email /Username /Mobile no.
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } border focus:ring-2 focus:ring-blue-500 transition-colors`}
                placeholder="Enter your email or username"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } border focus:ring-2 focus:ring-blue-500 transition-colors`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <a
                  href="#"
                  className={`text-sm ${
                    isDarkMode 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Sign In
            </button>

            <p className="text-center text-sm">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Don't have an account yet?{' '}
              </span>
              <a
                href="#"
                className={`font-medium ${
                  isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
