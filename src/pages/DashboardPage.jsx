import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';
import ReadinessBar from '../components/dashboard/ReadinessBar';
import QuickActionCards from '../components/dashboard/QuickActionCards';
import NextStepCard from '../components/dashboard/NextStepCard';
import { getReadinessScore, getSessionHistory } from '../utils/progressTracker';
import { Zap } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [userName, setUserName] = useState('User');
  const [readinessScore, setReadinessScore] = useState(42);
  const [dailyDriveData, setDailyDriveData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('prepway_user');
    if (!savedUser) {
      navigate('/');
    } else {
      const user = JSON.parse(savedUser);
      setUserName(user.name);
      
      const score = getReadinessScore();
      setReadinessScore(score);

      const driveData = JSON.parse(localStorage.getItem('prepway_daily_drive')) || {
        lastCompleted: null,
        streak: 0,
        bestStreak: 0,
        totalDrives: 0,
        history: [],
      };
      setDailyDriveData(driveData);
    }
  }, [navigate]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        {/* Top Bar */}
        <TopBar userName={userName} onHamburgerClick={() => setSidebarOpen(true)} />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Readiness Bar */}
          <ReadinessBar percentage={readinessScore} tierName="Silver Tier" />

          {/* Daily Drive Status Card */}
          {dailyDriveData && (
            <div className={`mx-4 lg:mx-6 my-6 p-4 lg:p-6 rounded-lg border-l-4 ${
              dailyDriveData.lastCompleted === new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                ? 'bg-green-50 dark:bg-green-900/20 border-l-green-500 border border-green-200 dark:border-green-800'
                : 'bg-orange-50 dark:bg-orange-900/20 border-l-orange-500 border border-orange-200 dark:border-orange-800'
            }`}>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-base lg:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
                    {dailyDriveData.lastCompleted === new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                      ? '✅ Daily Drive — Done!'
                      : '🔥 Daily Drive — Not done yet'}
                  </h3>
                  {dailyDriveData.lastCompleted === new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    ? (
                      <p className="text-sm lg:text-base text-slate-700 dark:text-slate-400 flex items-center gap-2">
                        Great work! 🔥 {dailyDriveData.streak} day streak
                      </p>
                    )
                    : (
                      <p className="text-sm lg:text-base text-slate-700 dark:text-slate-400">Complete today's 5 question challenge</p>
                    )}
                </div>
                {dailyDriveData.lastCompleted !== new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) && (
                  <button
                    onClick={() => navigate('/daily-drive')}
                    className="w-full lg:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 lg:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <Zap className="w-4 h-4" />
                    Start Now
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Action Cards */}
          <QuickActionCards />

          {/* Next Step Card */}
          <NextStepCard 
            title="Technical Assessment"
            description="Data Structures & Algorithms module is ready for your daily challenge."
            buttonText="Start Now"
          />

          {/* Padding for mobile bottom nav */}
          <div className="h-6 lg:h-12"></div>
        </div>
      </main>
    </div>
  );
}

