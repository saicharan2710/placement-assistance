import React from 'react';
import { Bell, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ProfileDropdown from '../ProfileDropdown';

export default function TopBar({ userName = 'Rahul', onHamburgerClick }) {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div className="bg-white dark:bg-slate-800 px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        {/* Hamburger - Mobile only */}
        <button
          onClick={onHamburgerClick}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-gray-600 dark:text-slate-400" />
        </button>

        {/* Left Section - Greeting */}
        <div className="flex-1 lg:flex-none">
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-slate-100">
            Hi, {userName} 👋
          </h1>
          <p className="text-xs lg:text-sm text-gray-600 dark:text-slate-400 mt-1">Continue your placement journey</p>
        </div>

        {/* Right Section - Icons */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Moon className="w-5 h-5 text-yellow-300" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500" />
            )}
          </button>

          {/* Notification Bell */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <Bell className="w-5 h-5 text-gray-600 dark:text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
}
