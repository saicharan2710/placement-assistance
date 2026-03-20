import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';
import { getSessionHistory, getHighScore, getAverageScore, getTotalSessions } from '../utils/progressTracker';

export default function AptitudeHistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('practice');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [sessions, setSessions] = useState([]);
  const [expandedSessionId, setExpandedSessionId] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('prepway_user');
    if (!savedUser) {
      navigate('/');
    } else {
      const user = JSON.parse(savedUser);
      setUserName(user.name || 'User');
    }

    // Load session history
    const history = getSessionHistory('aptitude');
    setSessions(history.reverse()); // Show newest first
  }, [navigate]);

  const getScoreBadgeColor = (percentage) => {
    if (percentage >= 75) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (percentage >= 50) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
  };

  const getScoreBadgeIcon = (isCorrect) => {
    return isCorrect ? (
      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-slate-100">Placement Prep</h1>
            <p className="text-xs text-gray-600 dark:text-slate-400">ACADEMIC GALLERY</p>
          </div>
        </div>

        <nav className="space-y-2">
          <NavItem
            icon={Home}
            label="Home"
            isActive={activeTab === 'home'}
            onClick={() => {
              setActiveTab('home');
              navigate('/dashboard');
            }}
          />
          <NavItem
            icon={BookOpen}
            label="Practice"
            isActive={activeTab === 'practice'}
            onClick={() => {
              setActiveTab('practice');
              navigate('/practice');
            }}
          />
          <NavItem
            icon={User}
            label="My Profile"
            isActive={activeTab === 'profile'}
            onClick={() => {
              setActiveTab('profile');
              navigate('/profile');
            }}
          />
          <NavItem
            icon={TrendingUp}
            label="Progress"
            isActive={activeTab === 'progress'}
            onClick={() => {
              setActiveTab('progress');
              navigate('/progress');
            }}
          />
          <NavItem
            icon={Settings}
            label="Settings"
            isActive={activeTab === 'settings'}
            onClick={() => {
              setActiveTab('settings');
              navigate('/settings');
            }}
          />
        </nav>

        <div className="mt-auto space-y-3">
          <button className="w-full bg-white dark:bg-slate-700 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600 font-semibold py-3 px-4 rounded-lg transition-colors">
            Start Mock Test
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('prepway_user');
              navigate('/');
            }}
            className="w-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold py-3 px-4 rounded-lg transition-colors border border-red-200 dark:border-red-800"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        <TopBar userName={userName} onHamburgerClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
            {/* Back Button */}
            <button
              onClick={() => navigate('/practice')}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Practice
            </button>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                Aptitude History
              </h1>
              <p className="text-gray-600 dark:text-slate-400">
                Track your aptitude practice performance
              </p>
            </div>

            {/* Stats Cards */}
            {sessions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 text-center">
                  <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {getHighScore('aptitude')}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">High Score</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 text-center">
                  <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {getAverageScore('aptitude')}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Average Score</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 text-center">
                  <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {getTotalSessions('aptitude')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Total Sessions</p>
                </div>
              </div>
            )}

            {/* Session History */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
              {sessions.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-lg text-gray-600 dark:text-slate-400 mb-4">
                    📋 No sessions yet — start your first aptitude test!
                  </p>
                  <button
                    onClick={() => navigate('/practice/aptitude')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    Start Practice
                  </button>
                </div>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="border-b border-gray-200 dark:border-slate-700 last:border-0">
                    <div
                      className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                      onClick={() =>
                        setExpandedSessionId(expandedSessionId === session.id ? null : session.id)
                      }
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">{session.date}</p>
                          <div className="flex gap-2 mb-2">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                              {session.category}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-semibold rounded-full">
                              {session.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            Time taken: {session.timeTaken}
                          </p>
                        </div>
                        <div className="md:text-right">
                          <div className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm ${getScoreBadgeColor(
                            session.percentage
                          )}`}>
                            {session.score}/{session.total} — {session.percentage}%
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedSessionId === session.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                          <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-4">
                            Question Breakdown
                          </h4>
                          <div className="space-y-4">
                            {session.questions && session.questions.map((q, idx) => (
                              <div
                                key={idx}
                                className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600"
                              >
                                <div className="flex gap-3 mb-3">
                                  {getScoreBadgeIcon(q.isCorrect)}
                                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                                    Question {idx + 1}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-slate-300 mb-3">
                                  {q.question}
                                </p>
                                <div className="flex gap-8 text-sm">
                                  <div>
                                    <p className="text-gray-600 dark:text-slate-400">Your answer:</p>
                                    <p className="font-semibold text-gray-900 dark:text-slate-100">
                                      {q.selected}
                                    </p>
                                  </div>
                                  {q.selected !== q.correct && (
                                    <div>
                                      <p className="text-gray-600 dark:text-slate-400">Correct answer:</p>
                                      <p className="font-semibold text-green-600 dark:text-green-400">
                                        {q.correct}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="h-12 md:h-0"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
