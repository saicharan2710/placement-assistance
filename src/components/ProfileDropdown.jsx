import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BarChart3, Settings, LogOut } from 'lucide-react';

export default function ProfileDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@example.com');
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('prepway_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserName(user.name || 'User');
      setUserEmail(user.email || 'user@example.com');
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem('prepway_user');
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        ref={avatarRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center hover:shadow-lg hover:from-orange-500 hover:to-orange-600 transition-all cursor-pointer"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
      >
        <User className="w-6 h-6 md:w-7 md:h-7 text-white" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 z-50"
        >
          {/* User Info Section */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-slate-700">
            <p className="text-lg font-bold text-gray-900 dark:text-slate-100 truncate">
              {userName}
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-400 truncate mt-1">
              {userEmail}
            </p>
          </div>

          {/* Menu Items - Section 1 */}
          <div className="py-2">
            {/* My Profile */}
            <button
              onClick={() => handleNavigate('/profile')}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="font-medium">My Profile</span>
            </button>

            {/* Progress */}
            <button
              onClick={() => handleNavigate('/progress')}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">Progress</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => handleNavigate('/settings')}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="font-medium">Settings</span>
            </button>
          </div>

          {/* Divider */}
          <div className="my-2 h-px bg-gray-200 dark:bg-slate-700"></div>

          {/* Menu Items - Section 2 */}
          <div className="py-2">
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay when dropdown is open (optional, for mobile-like experience) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
