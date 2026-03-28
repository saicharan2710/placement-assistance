import React from 'react';
import { X, Home, BookOpen, User, TrendingUp, Settings, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose, activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleNavClick = (tab, path) => {
    setActiveTab(tab);
    if (path) navigate(path);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('prepway_user');
    navigate('/');
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`glass-sidebar fixed lg:static top-0 left-0 min-h-screen w-64 p-6 z-50 transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close Button (Mobile only) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-[#0D0D0D] rounded-full lg:hidden"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-[#A1A1AA]" />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2 mb-8 mt-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-[#FFFFFF]">Placement Prep</h1>
            <p className="text-xs text-gray-600 dark:text-[#52525B]">ACADEMIC GALLERY</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <NavItem
            icon={Home}
            label="Home"
            isActive={activeTab === 'home'}
            onClick={() => handleNavClick('home', '/dashboard')}
          />
          <NavItem
            icon={BookOpen}
            label="Practice"
            isActive={activeTab === 'practice'}
            onClick={() => handleNavClick('practice', '/practice')}
          />
          <NavItem
            icon={User}
            label="My Profile"
            isActive={activeTab === 'profile'}
            onClick={() => handleNavClick('profile', '/profile')}
          />
          <NavItem
            icon={TrendingUp}
            label="Progress"
            isActive={activeTab === 'progress'}
            onClick={() => handleNavClick('progress', '/progress')}
          />
          <NavItem
            icon={Settings}
            label="Settings"
            isActive={activeTab === 'settings'}
            onClick={() => handleNavClick('settings', '/settings')}
          />
        </nav>

        {/* CTA Buttons */}
        <div className="mt-auto space-y-3">
          <button
            onClick={() => handleNavClick('daily-drive', '/daily-drive')}
            className="w-full glass-button-primary text-white font-semibold py-3 px-4 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Daily Drive
          </button>
          <button
            onClick={handleLogout}
            className="w-full glass-button-outline text-red-600 dark:text-[#EF4444] font-semibold py-3 px-4 border border-red-200 dark:border-[#3F1515]"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function NavItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
        isActive
          ? 'bg-[rgba(37,99,235,0.08)] text-[#1E3A8A] border-l-2 border-[#2563EB] rounded-r-lg dark:bg-[rgba(37,99,235,0.16)] dark:text-[#60A5FA] dark:border-[#2563EB]'
          : 'text-gray-700 dark:text-[#71717A] hover:bg-gray-50 dark:hover:bg-[#0D0D0D]'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}
