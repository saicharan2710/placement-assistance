import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, BookOpen, Users } from 'lucide-react';
import ToggleSwitch from '../components/ToggleSwitch';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    stream: '',
    yearOfStudy: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const streams = ['Select stream', 'Engineering', 'Arts', 'Science', 'Commerce', 'Other'];
  const years = ['Select year', '1st Year', '2nd Year', '3rd Year', '4th Year'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.stream === '' || formData.stream === 'Select stream') {
      newErrors.stream = 'Please select a stream';
    }

    if (formData.yearOfStudy === '' || formData.yearOfStudy === 'Select year') {
      newErrors.yearOfStudy = 'Please select your year of study';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Save user data to localStorage
      localStorage.setItem('prepway_user', JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        stream: formData.stream,
        year: formData.yearOfStudy,
      }));
      
      // Redirect to dashboard
      navigate('/dashboard');
    }
  };

  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
  };

  return (
    <>
      <ToggleSwitch />
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left Section - Benefits */}
        <div className="hidden lg:flex flex-col justify-center items-start">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6">
            Elevate your <span className="text-blue-600">career path.</span>
          </h1>
          <p className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed mb-10">
            Join 10,000+ students preparing for their dream careers with curated mock tests, mentor sessions, and personalized study plans.
          </p>

          {/* Features */}
          <div className="space-y-6 mb-10">
            {/* Mock Tests */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">Mock Tests</h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm">Real-world simulation</p>
              </div>
            </div>

            {/* Mentors */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">Mentors</h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm">Expert guidance</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div>
            <div className="flex -space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-slate-900">
                A
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-slate-900">
                J
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-slate-900">
                S
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-slate-900 flex items-center justify-center">
                +10k
              </div>
            </div>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Trusted by the next generation of engineers and leaders.
            </p>
          </div>
        </div>

        {/* Right Section - Signup Form */}
        <div className="flex flex-col justify-center">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">PrepWay</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              Create your PrepWay account
            </h2>
            <p className="text-gray-600 dark:text-slate-400">
              Join 10,000+ students preparing for their dream careers.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-2">
                Fullname
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-slate-500" />
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g., Jane Doe"
                  className={`w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-slate-800 dark:text-slate-100 border-2 rounded-lg transition-all focus:outline-none focus:bg-white dark:focus:bg-slate-700 ${
                    errors.fullName ? 'border-red-400' : 'border-gray-100 dark:border-slate-700 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-slate-500" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@university.edu"
                  className={`w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-slate-800 dark:text-slate-100 border-2 rounded-lg transition-all focus:outline-none focus:bg-white dark:focus:bg-slate-700 ${
                    errors.email ? 'border-red-400' : 'border-gray-100 dark:border-slate-700 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-slate-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min. 8 characters"
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

            {/* Stream Dropdown */}
            <div>
              <label htmlFor="stream" className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-2">
                What's your stream?
              </label>
              <select
                id="stream"
                name="stream"
                value={formData.stream}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 dark:text-slate-100 border-2 rounded-lg transition-all focus:outline-none focus:bg-white dark:focus:bg-slate-700 appearance-none cursor-pointer ${
                  errors.stream ? 'border-red-400' : 'border-gray-100 dark:border-slate-700 focus:border-blue-500'
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem',
                }}
              >
                {streams.map((stream) => (
                  <option key={stream} value={stream}>
                    {stream}
                  </option>
                ))}
              </select>
              {errors.stream && (
                <p className="text-red-500 text-xs mt-1">{errors.stream}</p>
              )}
              <p className="text-gray-600 dark:text-slate-400 text-xs italic mt-2">
                * We use this to customize your preparation path.
              </p>
            </div>

            {/* Year of Study Dropdown */}
            <div>
              <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-2">
                Current year of study?
              </label>
              <select
                id="yearOfStudy"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 dark:text-slate-100 border-2 rounded-lg transition-all focus:outline-none focus:bg-white dark:focus:bg-slate-700 appearance-none cursor-pointer ${
                  errors.yearOfStudy ? 'border-red-400' : 'border-gray-100 dark:border-slate-700 focus:border-blue-500'
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem',
                }}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.yearOfStudy && (
                <p className="text-red-500 text-xs mt-1">{errors.yearOfStudy}</p>
              )}
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg mt-6"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700"></div>
            <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-slate-700"></div>
          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
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
            <span className="text-gray-800 dark:text-slate-200 font-medium">Continue with Google</span>
          </button>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-gray-700 dark:text-slate-300">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Login
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-600 dark:text-slate-400 mb-2">
              © 2024 PrepWay Learning Systems. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
