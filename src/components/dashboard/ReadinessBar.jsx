import React from 'react';

export default function ReadinessBar({ percentage = 42, tierName = 'Silver Tier' }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 md:p-8 m-4 md:m-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
            Analytics
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
            Placement Readiness Score
          </h2>
        </div>
        <div className="text-4xl md:text-5xl font-bold text-blue-600 mt-4 md:mt-0">
          {percentage}%<span className="text-lg text-gray-600 dark:text-slate-400 font-normal ml-2">READY</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Motivational Text */}
      <p className="text-gray-700 dark:text-slate-300 text-base">
        You're making great progress! Complete 2 more mock interviews to reach the <span className="font-semibold">Silver Tier</span>.
      </p>
    </div>
  );
}
