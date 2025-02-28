import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add registration logic here
    navigate('/candidate-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0F0B1E] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create <span className="text-blue-500">Account</span></h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Start your career journey today</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {['fullName', 'email', 'mobile'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field === 'fullName' ? 'Full Name' : field === 'email' ? 'Email Address' : 'Mobile Number'}
              </label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                required
                placeholder={`Enter your ${field}`}
                className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
            </div>
          ))}

          {['password', 'confirmPassword'].map((field, index) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field === 'password' ? 'Password' : 'Confirm Password'}
              </label>
              <div className="relative">
                <input
                  type={(index === 0 ? showPassword : showConfirmPassword) ? 'text' : 'password'}
                  required
                  placeholder={field === 'password' ? 'Enter your password' : 'Confirm your password'}
                  className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400"
                  onClick={index === 0 ? togglePasswordVisibility : toggleConfirmPasswordVisibility}
                >
                  {index === 0 ? (showPassword ? <EyeOff size={20} /> : <Eye size={20} />) : (showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />)}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account? <Link to="/signin" className="font-medium text-blue-500 hover:text-blue-600">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
