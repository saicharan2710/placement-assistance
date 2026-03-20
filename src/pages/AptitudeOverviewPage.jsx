import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';

export default function AptitudeOverviewPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('practice');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [expandedSessionId, setExpandedSessionId] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('prepway_user');
    if (!savedUser) {
      navigate('/');
    } else {
      const user = JSON.parse(savedUser);
      setUserName(user.name || 'User');
    }
  }, [navigate]);

  const scoreTrendData = [
    { label: 'S1', score: 65 },
    { label: 'S2', score: 70 },
    { label: 'S3', score: 68 },
    { label: 'S4', score: 75 },
    { label: 'S5', score: 80 },
    { label: 'S6', score: 85 },
  ];

  const skillBreakdown = [
    { name: 'Logical Reasoning', score: 80, tag: 'Strong', color: 'bg-green-100 dark:bg-green-900/30' },
    { name: 'Quantitative Aptitude', score: 65, tag: 'Needs Work', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { name: 'Verbal Ability', score: 70, tag: 'Needs Work', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
  ];

  const recentSessions = [
    {
      id: 1,
      date: '20 Mar',
      category: 'Logical',
      difficulty: 'Medium',
      score: '8/10',
      percentage: 80,
      badge: 'Great',
      badgeColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      questions: [
        { q: 'If 2x + 3 = 11, what is x?', answer: 'B (4)', correct: true },
        { q: 'Next in series: 2, 4, 8, 16, ?', answer: 'A (32)', correct: true },
        { q: 'Synonym of Benevolent?', answer: 'C (Cruel)', correct: false, correctAnswer: 'A (Kind)' },
      ]
    },
    {
      id: 2,
      date: '18 Mar',
      category: 'Quantitative',
      difficulty: 'Hard',
      score: '7/10',
      percentage: 70,
      badge: 'Good',
      badgeColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      questions: [
        { q: 'Solve: 5x² + 3x - 2 = 0', answer: 'Both (2)', correct: true },
        { q: 'Integration of x²', answer: 'x³/3 + C', correct: true },
      ]
    },
    {
      id: 3,
      date: '15 Mar',
      category: 'Verbal',
      difficulty: 'Easy',
      score: '9/10',
      percentage: 90,
      badge: 'Excellent',
      badgeColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      questions: [
        { q: 'Antonym of "Ephemeral"?', answer: 'D (Permanent)', correct: true },
      ]
    },
    {
      id: 4,
      date: '12 Mar',
      category: 'Logical',
      difficulty: 'Medium',
      score: '6/10',
      percentage: 60,
      badge: 'Average',
      badgeColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      questions: [
        { q: 'If A > B and B > C...', answer: 'A (A > C)', correct: true },
      ]
    },
    {
      id: 5,
      date: '10 Mar',
      category: 'Quantitative',
      difficulty: 'Easy',
      score: '7/10',
      percentage: 70,
      badge: 'Good',
      badgeColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      questions: [
        { q: 'What is 15% of 200?', answer: 'B (30)', correct: true },
      ]
    },
  ];

  const recommendations = [
    { icon: '📘', text: 'Focus on Quantitative — your weakest area at 65%' },
    { icon: '⏱', text: 'Try timed practice to improve speed' },
    { icon: '🎯', text: 'Attempt Hard difficulty to push above 85%' },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        <TopBar userName={userName} onHamburgerClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto bg-slate-900">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              <h1 className="text-4xl font-bold text-slate-100 mb-2">Aptitude Practice</h1>
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Track your aptitude performance and history</p>
                <button
                  onClick={() => navigate('/practice/aptitude')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Start New Test
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">High Score</p>
                <p className="text-3xl font-bold text-blue-400">85%</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Average Score</p>
                <p className="text-3xl font-bold text-blue-400">71%</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Total Sessions</p>
                <p className="text-3xl font-bold text-blue-400">8</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Current Streak</p>
                <p className="text-3xl font-bold text-blue-400">3 days <span className="text-xl">🔥</span></p>
              </div>
            </div>

            {/* Next Target */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Next Target</h2>
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg font-semibold mb-2">Silver</span>
                    <p className="text-sm text-slate-400">Current Level</p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-2xl text-blue-400">→</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="px-4 py-2 bg-yellow-900/30 text-yellow-300 rounded-lg font-semibold mb-2">Gold</span>
                    <p className="text-sm text-slate-400">Next Level</p>
                  </div>
                </div>
                <p className="text-sm text-blue-300 font-semibold">71% / 80%</p>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: '71%' }} />
              </div>
              <p className="text-slate-300 mb-6">
                You need <span className="font-bold text-yellow-300">9% more</span> average score to reach Gold. Complete 2 more tests to unlock!
              </p>
              <button
                onClick={() => navigate('/practice/aptitude')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start Test Now
              </button>
            </div>

            {/* Score Trend */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Score Trend</h2>
              <div className="flex items-end justify-center gap-6 h-48">
                {scoreTrendData.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-sm font-semibold text-blue-400">{item.score}%</span>
                    <div
                      className={`w-12 rounded-t-lg transition-all ${
                        idx === scoreTrendData.length - 1 ? 'bg-blue-500' : 'bg-blue-600'
                      }`}
                      style={{ height: `${(item.score / 100) * 160}px` }}
                    />
                    <span className="text-xs text-slate-400 mt-2">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Skill Breakdown</h2>
              <div className="space-y-6">
                {skillBreakdown.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 font-medium">{skill.name}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${skill.color}`}>
                        {skill.tag}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${skill.score}%` }}
                        />
                      </div>
                      <span className="text-blue-400 font-semibold w-12 text-right">{skill.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden mb-8">
              <div className="p-8 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-slate-100">Recent Sessions</h2>
              </div>
              <div>
                {recentSessions.map((session) => (
                  <div key={session.id} className="border-b border-slate-700 last:border-0">
                    <div
                      onClick={() =>
                        setExpandedSessionId(expandedSessionId === session.id ? null : session.id)
                      }
                      className="p-6 hover:bg-slate-700/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <span className="text-sm text-slate-400">{session.date}</span>
                            <span className="px-3 py-1 bg-blue-900/30 text-blue-300 text-xs font-semibold rounded-full">
                              {session.category}
                            </span>
                            <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs font-semibold rounded-full">
                              {session.difficulty}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm">{session.score}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${session.badgeColor}`}>
                            {session.percentage}% - {session.badge}
                          </span>
                          {expandedSessionId === session.id ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedSessionId === session.id && (
                        <div className="mt-6 pt-6 border-t border-slate-700">
                          <h4 className="font-bold text-slate-100 mb-4">Question Breakdown</h4>
                          <div className="space-y-4 mb-6">
                            {session.questions.map((q, qIdx) => (
                              <div key={qIdx} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                                <div className="flex gap-2 items-center mb-2">
                                  {q.correct ? (
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-400" />
                                  )}
                                  <p className="font-semibold text-slate-100">Q{qIdx + 1}</p>
                                </div>
                                <p className="text-sm text-slate-300 mb-3">{q.q}</p>
                                <div className="flex gap-8 text-sm">
                                  <div>
                                    <p className="text-slate-400">Your answer:</p>
                                    <p className="font-semibold text-slate-200">{q.answer}</p>
                                  </div>
                                  {!q.correct && (
                                    <div>
                                      <p className="text-slate-400">Correct answer:</p>
                                      <p className="font-semibold text-green-400">{q.correctAnswer}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => navigate('/practice/aptitude')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                          >
                            Retry this test
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">AI Recommendations</h2>
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <span className="text-2xl">{rec.icon}</span>
                    <p className="text-slate-300">{rec.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-12"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
