import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';
import ReadinessBar from '../components/dashboard/ReadinessBar';
import QuickActionCards from '../components/dashboard/QuickActionCards';
import NextStepCard from '../components/dashboard/NextStepCard';
import { getReadinessScore, getSessionHistory } from '../utils/progressTracker';
import { Zap } from 'lucide-react';

const DEFAULT_DAILY_DRIVE_DATA = {
  lastCompleted: null,
  streak: 0,
  bestStreak: 0,
  totalDrives: 0,
  history: [],
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const dailyDriveRef = useRef(null);
  const isDailyDriveInView = useInView(dailyDriveRef, { once: false, amount: 0.2 });
  const [activeTab, setActiveTab] = useState('home');
  const [userName, setUserName] = useState('User');
  const [readinessScore, setReadinessScore] = useState(42);
  const [dailyDriveData, setDailyDriveData] = useState(DEFAULT_DAILY_DRIVE_DATA);
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

      // Keep the card visible even if persisted data is absent or malformed.
      let driveData = DEFAULT_DAILY_DRIVE_DATA;
      try {
        const rawDriveData = localStorage.getItem('prepway_daily_drive');
        if (rawDriveData) {
          const parsed = JSON.parse(rawDriveData);
          driveData = { ...DEFAULT_DAILY_DRIVE_DATA, ...parsed };
        }
      } catch {
        driveData = DEFAULT_DAILY_DRIVE_DATA;
      }
      setDailyDriveData(driveData);
    }
  }, [navigate]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-[#000000] overflow-x-hidden">
      
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
        <motion.div 
          className="flex-1 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Readiness Bar */}
          <ReadinessBar percentage={readinessScore} tierName="Silver Tier" />

          {/* Daily Drive Status Card */}
          <motion.div
              ref={dailyDriveRef}
              initial={{ opacity: 0, y: 40 }}
              animate={isDailyDriveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className={`mx-4 lg:mx-6 my-6 p-4 lg:p-6 rounded-lg border-l-4 ${
                dailyDriveData.lastCompleted === new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  ? 'bg-green-50 dark:bg-[linear-gradient(135deg,rgba(9,17,12,0.95),rgba(12,26,18,0.9))] border-l-green-500 border border-green-200 dark:border-[rgba(34,197,94,0.35)] dark:shadow-[0_8px_28px_rgba(16,185,129,0.16)]'
                  : 'bg-orange-50 dark:bg-[linear-gradient(135deg,rgba(22,12,6,0.96),rgba(38,15,8,0.9))] border-l-orange-500 border border-orange-200 dark:border-[rgba(249,115,22,0.38)] dark:shadow-[0_8px_28px_rgba(249,115,22,0.18)]'
              }`}>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-base lg:text-lg font-bold text-slate-900 dark:text-[#FFFFFF] flex items-center gap-2 mb-1">
                    {dailyDriveData.lastCompleted === new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                      ? '✅ Daily Drive — Done!'
                      : '🔥 Daily Drive — Not done yet'}
                  </h3>
                  {dailyDriveData.lastCompleted === new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    ? (
                      <p className="text-sm lg:text-base text-slate-700 dark:text-[#4ADE80] flex items-center gap-2">
                        Great work! 🔥 {dailyDriveData.streak} day streak
                      </p>
                    )
                    : (
                      <p className="text-sm lg:text-base text-slate-700 dark:text-[#FB923C]">Complete today's 5 question challenge</p>
                    )}
                </div>
                {dailyDriveData.lastCompleted !== new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    onClick={() => navigate('/daily-drive')}
                    className="w-full lg:w-auto bg-orange-600 hover:bg-orange-700 dark:bg-[linear-gradient(90deg,#F97316,#EA580C)] dark:hover:bg-[linear-gradient(90deg,#FB923C,#F97316)] text-white font-semibold py-2 px-4 lg:px-6 rounded-lg transition-all duration-200 dark:shadow-[0_6px_20px_rgba(249,115,22,0.35)] dark:border dark:border-[rgba(255,255,255,0.18)] flex items-center justify-center gap-2 min-h-[44px] hover:shadow-lg hover:shadow-orange-400/20 dark:hover:shadow-orange-400/10"
                  >
                    <Zap className="w-4 h-4" />
                    Start Now
                  </motion.button>
                )}
              </div>
            </motion.div>


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
        </motion.div>
      </main>
    </div>
  );
}

