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
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-6 z-50 transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close Button (Mobile only) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full lg:hidden"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-slate-400" />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2 mb-8 mt-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-slate-100">Placement Prep</h1>
            <p className="text-xs text-gray-600 dark:text-slate-400">ACADEMIC GALLERY</p>
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
            className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 border-2 border-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Daily Drive
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold py-3 px-4 rounded-lg transition-colors border border-red-200 dark:border-red-800"
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
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-l-4 border-blue-600'
          : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}
