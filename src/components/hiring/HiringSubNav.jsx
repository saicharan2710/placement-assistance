import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, BriefcaseBusiness, BarChart3, FileText, Megaphone, CalendarDays } from 'lucide-react';

const tabs = [
  { label: 'Companies', path: '/hiring/companies', icon: Building2 },
  { label: 'Jobs', path: '/hiring/jobs', icon: BriefcaseBusiness },
  { label: 'Tracker', path: '/hiring/tracker', icon: BarChart3 },
  { label: 'Resumes', path: '/hiring/resumes', icon: FileText },
  { label: 'Notice', path: '/hiring/notice', icon: Megaphone },
  { label: 'Calendar', path: '/hiring/calendar', icon: CalendarDays },
];

export default function HiringSubNav() {
  return (
    <div className="sticky top-0 z-20 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px]">
      <div className="px-4 lg:px-6 overflow-x-auto">
        <div className="flex items-center min-w-max">
          {tabs.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'text-blue-600 dark:text-[#60A5FA] border-blue-600 dark:border-[#2563EB]'
                    : 'text-gray-500 dark:text-[#A1A1AA] border-transparent hover:text-gray-700 dark:hover:text-[#F4F4F5]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
