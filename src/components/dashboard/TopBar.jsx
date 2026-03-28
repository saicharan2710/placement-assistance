import React from 'react';
import { Bell, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ProfileDropdown from '../ProfileDropdown';

export default function TopBar({ userName = 'Rahul', onHamburgerClick }) {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div className="bg-white dark:bg-[rgba(0,0,0,0.8)] dark:backdrop-blur-[12px] px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-[#1A1A1A]">
      <div className="flex items-center justify-between">
        {/* Hamburger - Mobile only */}
        <button
          onClick={onHamburgerClick}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-[#0D0D0D] rounded-full transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-gray-600 dark:text-[#A1A1AA]" />
        </button>

        {/* Left Section - Greeting */}
        <div className="flex-1 lg:flex-none">
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-[#FFFFFF]">
            Hi, {userName} 👋
          </h1>
          <p className="text-xs lg:text-sm text-gray-600 dark:text-[#A1A1AA] mt-1">Continue your placement journey</p>
        </div>

        {/* Right Section - Icons */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#0D0D0D] rounded-full transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Moon className="w-5 h-5 text-yellow-300" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500" />
            )}
          </button>

          {/* Notification Bell */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#0D0D0D] rounded-full transition-colors">
            <Bell className="w-5 h-5 text-gray-600 dark:text-[#A1A1AA]" />
          </button>

          {/* Profile Dropdown */}
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
}
