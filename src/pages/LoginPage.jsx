import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import ToggleSwitch from '../components/ToggleSwitch';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Check localStorage for user
      const savedUser = localStorage.getItem('prepway_user');
      if (!savedUser) {
        setErrors({ general: 'No user account found. Please sign up first.' });
        return;
      }
      
      const user = JSON.parse(savedUser);
      if (user.email === email && user.password === password) {
        // Credentials match - redirect to dashboard
        navigate('/dashboard');
      } else {
        setErrors({ general: 'Invalid email or password' });
      }
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  return (
    <>
      <ToggleSwitch />
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left Section - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-start bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 lg:p-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            PrepWay
          </h1>
          <p className="text-blue-100 text-lg mb-12">
            Your placement journey starts here
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
            Master your interviews and land your dream job.
          </h2>
          <div className="flex gap-2 mt-8">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl lg:hidden font-bold text-gray-900 dark:text-slate-100 mb-2">
              PrepWay
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-slate-400">
              Please enter your details to sign in
            </p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="name@college.edu"
                  className={`w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-slate-800 dark:text-slate-100 border-2 rounded-lg transition-all focus:outline-none focus:bg-white dark:focus:bg-slate-700 ${
                    errors.email ? 'border-red-400' : 'border-gray-100 dark:border-slate-700 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-slate-200">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-slate-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-slate-800 dark:text-slate-100 border-2 rounded-lg transition-all focus:outline-none focus:bg-white dark:focus:bg-slate-700 ${
                    errors.password ? 'border-red-400' : 'border-gray-100 dark:border-slate-700 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Keep me signed in */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 border-2 border-gray-300 dark:border-slate-600 rounded cursor-pointer accent-blue-600"
              />
              <label htmlFor="remember" className="text-sm text-gray-700 dark:text-slate-300 cursor-pointer">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg mt-6"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700"></div>
            <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">Or continue with</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 border-2 border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-600 bg-white dark:bg-slate-800 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-800 dark:text-slate-200 font-medium">Sign in with Google</span>
          </button>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-gray-700 dark:text-slate-300">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Sign Up
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-600 dark:text-slate-400 mb-2">
              © 2024 PrepWay Learning Systems.
            </p>
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Trusted by 500+ Institutions.
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
