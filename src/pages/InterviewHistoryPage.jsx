import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';
import { getSessionHistory, getHighScore, getAverageScore, getTotalSessions } from '../utils/progressTracker';

export default function InterviewHistoryPage() {
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
    const history = getSessionHistory('interview');
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
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-[#000000]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        <TopBar userName={userName} onHamburgerClick={() => setSidebarOpen(true)} />

        <motion.div
          className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#000000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
            {/* Back Button */}
            <button
              onClick={() => navigate('/practice/interview')}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Practice
            </button>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                Interview History
              </h1>
              <p className="text-gray-600 dark:text-slate-400">
                Track your interview practice performance
              </p>
            </div>

            {/* Stats Cards */}
            {sessions.length > 0 && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.7 }}
              >
                <motion.div className="bg-white dark:bg-[#111111] rounded-xl shadow-sm p-6 border border-gray-200 dark:border-[#222222] text-center hover:shadow-lg hover:shadow-blue-500/20" whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>
                  <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {getHighScore('interview')}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">High Score</p>
                </motion.div>
                <motion.div className="bg-white dark:bg-[#111111] rounded-xl shadow-sm p-6 border border-gray-200 dark:border-[#222222] text-center hover:shadow-lg hover:shadow-blue-500/20" whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>
                  <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {getAverageScore('interview')}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Average Score</p>
                </motion.div>
                <motion.div className="bg-white dark:bg-[#111111] rounded-xl shadow-sm p-6 border border-gray-200 dark:border-[#222222] text-center hover:shadow-lg hover:shadow-blue-500/20" whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>
                  <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {getTotalSessions('interview')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Total Sessions</p>
                </motion.div>
              </motion.div>
            )}

            {/* Session History */}
            <motion.div
              className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-200 dark:border-[#222222] overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7 }}
            >
              {sessions.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-lg text-gray-600 dark:text-slate-400 mb-4">
                    📋 No sessions yet — start your first interview practice!
                  </p>
                  <motion.button
                    onClick={() => navigate('/practice/interview')}
                    className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                  >
                    Start Practice
                  </motion.button>
                </div>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="border-b border-gray-200 dark:border-[#222222] last:border-0">
                    <motion.div
                      className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-[rgba(26,26,26,0.5)] hover:shadow-lg hover:shadow-blue-500/20 transition-colors"
                      whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                      onClick={() =>
                        setExpandedSessionId(expandedSessionId === session.id ? null : session.id)
                      }
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">{session.date}</p>
                          <div className="flex gap-2 mb-2">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                              {session.category || 'Interview'}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-[#1A1A1A] text-gray-700 dark:text-slate-300 text-xs font-semibold rounded-full">
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
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#222222]">
                          <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-4">
                            Interview Feedback
                          </h4>
                          <div className="space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-[rgba(26,26,26,0.7)] rounded-lg border border-gray-200 dark:border-[#2A2A2A]">
                              <p className="text-sm text-gray-700 dark:text-slate-300">
                                {session.feedback || 'Detailed feedback will be available after interview completion.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                ))
              )}
            </motion.div>

            <div className="h-12 md:h-0"></div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
