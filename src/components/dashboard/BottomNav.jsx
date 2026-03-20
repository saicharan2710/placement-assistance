import React from 'react';
import { Home, BookOpen, TrendingUp, User } from 'lucide-react';

export default function BottomNav({ activeTab = 'home' }) {
  const navItems = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'practice', label: 'PRACTICE', icon: BookOpen },
    { id: 'progress', label: 'PROGRESS', icon: TrendingUp },
    { id: 'profile', label: 'PROFILE', icon: User },
  ];

  return (
    <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-4 py-3">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
