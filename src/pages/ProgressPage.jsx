import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Code, User, Trophy, ArrowLeft } from 'lucide-react';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';
import { getReadinessScore, getSessionHistory, getAverageScoreOverall } from '../utils/progressTracker';

export default function ProgressPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('progress');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [readinessScore, setReadinessScore] = useState(42);
  const [aptitudeData, setAptitudeData] = useState({ score: 0, date: '', attempted: false });
  const [gdData, setGdData] = useState({ score: 0, date: '', attempted: false });
  const [interviewData, setInterviewData] = useState({ score: 0, date: '', attempted: false });
  const [sessionHistory, setSessionHistory] = useState([]);
  const [overallAverage, setOverallAverage] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('prepway_user');
    if (!savedUser) {
      navigate('/');
    } else {
      const user = JSON.parse(savedUser);
      setUserName(user.name || 'User');
    }

    // Load all progress data
    const score = getReadinessScore();
    setReadinessScore(score);

    const aptitudeSessions = getSessionHistory('aptitude');
    if (aptitudeSessions.length > 0) {
      const lastAptitude = aptitudeSessions[aptitudeSessions.length - 1];
      setAptitudeData({
        score: lastAptitude.percentage,
        date: lastAptitude.date,
        attempted: true,
      });
    }

    const gdSessions = getSessionHistory('gd');
    if (gdSessions.length > 0) {
      const lastGd = gdSessions[gdSessions.length - 1];
      setGdData({
        score: lastGd.percentage,
        date: lastGd.date,
        attempted: true,
      });
    }

    const interviewSessions = getSessionHistory('interview');
    if (interviewSessions.length > 0) {
      const lastInterview = interviewSessions[interviewSessions.length - 1];
      setInterviewData({
        score: lastInterview.percentage,
        date: lastInterview.date,
        attempted: true,
      });
    }

    // Load session history (last 4 sessions from all types)
    const allSessions = [];
    aptitudeSessions.forEach(session => {
      allSessions.push({ ...session, type: 'Aptitude Practice', icon: BarChart3 });
    });
    gdSessions.forEach(session => {
      allSessions.push({ ...session, type: 'Group Discussion', icon: Users });
    });
    interviewSessions.forEach(session => {
      allSessions.push({ ...session, type: 'Interview', icon: Code });
    });
    allSessions.sort((a, b) => new Date(b.date) - new Date(a.date));
    setSessionHistory(allSessions.slice(0, 4));

    setOverallAverage(getAverageScoreOverall());
  }, [navigate]);

  // Circular Progress Ring Component
  const CircularProgress = ({ percentage, label }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-4">
          <svg width="200" height="200" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-300 dark:text-slate-700"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-blue-600 dark:text-blue-500 transition-all duration-500"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
              {percentage}%
            </div>
            <div className="text-sm font-semibold text-gray-600 dark:text-slate-400 mt-1">
              {label}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-slate-400 text-center">
          Based on your latest sessions
        </p>
      </div>
    );
  };

  // Round Performance Card
  const RoundCard = ({ icon: Icon, title, score, lastAttempted, isAttempted }) => (
    <div
      className={`p-6 rounded-xl border-2 ${
        isAttempted
          ? 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
          : 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700/50 opacity-70'
      } transition-all`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
        </div>
        {isAttempted && (
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{score}%</span>
        )}
      </div>

      {isAttempted ? (
        <>
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-400">
            Last attempted: {lastAttempted}
          </p>
        </>
      ) : (
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-semibold rounded-full">
            Not attempted yet
          </span>
        </div>
      )}
    </div>
  );

  // Skill Bar Component
  const SkillBar = ({ name, current }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
          {name}
        </label>
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{current}%</span>
      </div>
      <div className="relative h-6 bg-gray-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
          style={{ width: `${current}%` }}
        />
      </div>
    </div>
  );

  // Session History Row
  const SessionRow = ({ type, date, score, icon: Icon }) => (
    <>
      <div className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-4 flex-1">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-slate-100">{type}</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full">
            {score}%
          </span>
        </div>
      </div>
      <div className="h-px bg-gray-200 dark:bg-slate-700" />
    </>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        {/* Top Bar */}
        <TopBar userName={userName} onHamburgerClick={() => setSidebarOpen(true)} />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
            {/* Page Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                Your Progress
              </h1>
              <p className="text-gray-600 dark:text-slate-400">
                Track your placement readiness over time
              </p>
            </div>

            {/* Card 1: Overall Readiness Ring */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 mb-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-8 text-center">
                Overall Placement Readiness
              </h2>
              <div className="flex justify-center">
                <CircularProgress percentage={readinessScore} label="Placement Ready" />
              </div>
            </div>

            {/* Card 2: Round wise Performance */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 mb-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                Performance by Round
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RoundCard
                  icon={BarChart3}
                  title="Aptitude"
                  score={aptitudeData.score}
                  lastAttempted={aptitudeData.date}
                  isAttempted={aptitudeData.attempted}
                />
                <RoundCard
                  icon={Users}
                  title="Group Discussion"
                  score={gdData.score}
                  lastAttempted={gdData.date}
                  isAttempted={gdData.attempted}
                />
                <RoundCard
                  icon={Code}
                  title="Interview"
                  score={interviewData.score}
                  lastAttempted={interviewData.date}
                  isAttempted={interviewData.attempted}
                />
                <RoundCard
                  icon={User}
                  title="Overall Average"
                  score={overallAverage}
                  lastAttempted=""
                  isAttempted={overallAverage > 0}
                />
              </div>
            </div>

            {/* Card 3: Skill Improvement */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 mb-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                Skill Assessment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <SkillBar name="Aptitude Mastery" current={aptitudeData.score} />
                  <SkillBar name="Communication" current={gdData.score} />
                </div>
                <div>
                  <SkillBar name="Technical Skills" current={interviewData.score} />
                  <SkillBar name="Overall Readiness" current={readinessScore} />
                </div>
              </div>
            </div>

            {/* Card 4: Session History */}
            {sessionHistory.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-6 border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="p-8 border-b border-gray-200 dark:border-slate-700">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-slate-100">
                    Recent Sessions
                  </h2>
                </div>
                <div>
                  {sessionHistory.map((session, idx) => (
                    <SessionRow
                      key={idx}
                      type={session.type}
                      date={session.date}
                      score={session.percentage}
                      icon={session.icon}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Card 5: Motivation Card */}
            {sessionHistory.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl shadow-sm p-8 mb-8 border border-blue-200 dark:border-blue-800/50">
                <div className="flex items-center gap-6">
                  <Trophy className="w-16 h-16 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-1">
                      You're Making Progress! 💪
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 dark:text-slate-300">
                      You've completed <span className="font-bold text-blue-600 dark:text-blue-400">{sessionHistory.length} sessions</span> recently. 
                      Keep practicing consistently to improve your placement readiness score!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {sessionHistory.length === 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-12 border border-gray-200 dark:border-slate-700 text-center">
                <p className="text-lg text-gray-600 dark:text-slate-400 mb-4">
                  📋 No sessions yet — start your first practice!
                </p>
                <button
                  onClick={() => navigate('/practice')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Start Practicing
                </button>
              </div>
            )}

            <div className="h-12 md:h-0"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
