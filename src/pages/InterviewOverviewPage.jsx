import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';

export default function InterviewOverviewPage() {
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
    { label: 'I1', score: 65 },
    { label: 'I2', score: 68 },
    { label: 'I3', score: 72 },
    { label: 'I4', score: 75 },
    { label: 'I5', score: 78 },
    { label: 'I6', score: 82 },
  ];

  const skillBreakdown = [
    { name: 'Communication', score: 80, tag: 'Strong', color: 'bg-green-100 dark:bg-green-900/30' },
    { name: 'Confidence', score: 72, tag: 'Good', color: 'bg-green-100 dark:bg-green-900/30' },
    { name: 'Technical Knowledge', score: 65, tag: 'Needs Work', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { name: 'HR & Behavioral', score: 78, tag: 'Strong', color: 'bg-green-100 dark:bg-green-900/30' },
  ];

  const recentSessions = [
    {
      id: 1,
      date: '20 Mar',
      type: 'HR Interview',
      difficulty: 'Fresher',
      score: '8/10',
      percentage: 82,
      badge: 'Great',
      badgeColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      questions: [
        {
          q: 'Tell me about yourself',
          answer: 'I am a 3rd year CSE student at SRMIST with a passion for full-stack development.',
          feedback: 'Good structure but add more about your skills and achievements.',
          questionScore: '8/10',
        },
      ]
    },
    {
      id: 2,
      date: '17 Mar',
      type: 'Technical',
      difficulty: 'Fresher',
      score: '7/10',
      percentage: 72,
      badge: 'Good',
      badgeColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      questions: [
        {
          q: 'Explain the difference between class and instance variables in Java',
          answer: 'Class variables are shared among all instances while instance variables are unique to each object.',
          feedback: 'Correct answer but could provide code examples.',
          questionScore: '7/10',
        },
      ]
    },
    {
      id: 3,
      date: '14 Mar',
      type: 'HR Interview',
      difficulty: 'Fresher',
      score: '7/10',
      percentage: 75,
      badge: 'Good',
      badgeColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      questions: [
        {
          q: 'Why do you want to join our company?',
          answer: 'I am impressed by your innovation in tech and want to contribute to your mission.',
          feedback: 'Good but be more specific about the company and role.',
          questionScore: '7/10',
        },
      ]
    },
    {
      id: 4,
      date: '11 Mar',
      type: 'Technical',
      difficulty: 'Fresher',
      score: '6/10',
      percentage: 65,
      badge: 'Average',
      badgeColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      questions: [
        {
          q: 'What is polymorphism in OOP?',
          answer: 'It means having multiple forms or shapes.',
          feedback: 'Rather vague. Explain with method overloading and method overriding examples.',
          questionScore: '6/10',
        },
      ]
    },
    {
      id: 5,
      date: '08 Mar',
      type: 'HR Interview',
      difficulty: 'Fresher',
      score: '7/10',
      percentage: 78,
      badge: 'Good',
      badgeColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      questions: [
        {
          q: 'What is your biggest strength?',
          answer: 'I am a quick learner and can adapt to new technologies and environments.',
          feedback: 'Good but provide a specific example of how you used this strength.',
          questionScore: '7/10',
        },
      ]
    },
  ];

  const recommendations = [
    { icon: '💼', text: 'Prepare more technical questions for CSE branch' },
    { icon: '🗣', text: 'Use the STAR method for behavioral questions' },
    { icon: '📄', text: 'Upload your resume to get resume based questions' },
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
              <h1 className="text-4xl font-bold text-slate-100 mb-2">Mock Interview</h1>
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Track your interview performance and readiness</p>
                <button
                  onClick={() => navigate('/practice/interview')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Start New Interview
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Best Score</p>
                <p className="text-3xl font-bold text-blue-400">82%</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Average Score</p>
                <p className="text-3xl font-bold text-blue-400">74%</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Total Sessions</p>
                <p className="text-3xl font-bold text-blue-400">6</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Questions Answered</p>
                <p className="text-3xl font-bold text-blue-400">48</p>
              </div>
            </div>

            {/* Next Target */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Next Target</h2>
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg font-semibold mb-2">Promising</span>
                    <p className="text-sm text-slate-400">Current Level</p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-2xl text-blue-400">→</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="px-4 py-2 bg-green-900/30 text-green-300 rounded-lg font-semibold mb-2">Interview Ready</span>
                    <p className="text-sm text-slate-400">Next Level</p>
                  </div>
                </div>
                <p className="text-sm text-blue-300 font-semibold">74% / 85%</p>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: '74%' }} />
              </div>
              <p className="text-slate-300 mb-6">
                Improve your average score by <span className="font-bold text-yellow-300">11%</span> to become Interview Ready. Focus on HR questions!
              </p>
              <button
                onClick={() => navigate('/practice/interview')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start Interview
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
                            <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-xs font-semibold rounded-full">
                              {session.type}
                            </span>
                            <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs font-semibold rounded-full">
                              {session.difficulty}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm">Questions: {session.score}</p>
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
                          <div className="space-y-6">
                            {session.questions.map((q, qIdx) => (
                              <div key={qIdx} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                                <div className="mb-3">
                                  <p className="font-semibold text-slate-100 mb-2">Q{qIdx + 1}: {q.q}</p>
                                  <div className="mt-2">
                                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Your Answer:</p>
                                    <p className="text-sm text-slate-300">"{q.answer}"</p>
                                  </div>
                                </div>
                                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">AI Feedback:</p>
                                  <p className="text-sm text-slate-300">{q.feedback}</p>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                  <span className="text-xs text-slate-400">Score: <span className="text-blue-400 font-semibold">{q.questionScore}</span></span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => navigate('/practice/interview')}
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                          >
                            Retry this interview
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
