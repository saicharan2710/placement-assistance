import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';

export default function GDOverviewPage() {
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

  const participationTrendData = [
    { label: 'GD1', score: 55 },
    { label: 'GD2', score: 62 },
    { label: 'GD3', score: 70 },
    { label: 'GD4', score: 68 },
    { label: 'GD5', score: 78 },
  ];

  const skillBreakdown = [
    { name: 'Speaking Confidence', score: 72, tag: 'Good', color: 'bg-green-100 dark:bg-green-900/30' },
    { name: 'Clarity of Points', score: 68, tag: 'Needs Work', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { name: 'Listening & Response', score: 75, tag: 'Strong', color: 'bg-green-100 dark:bg-green-900/30' },
    { name: 'Leadership', score: 55, tag: 'Needs Work', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
  ];

  const recentSessions = [
    {
      id: 1,
      date: '20 Mar',
      topic: 'AI vs Jobs',
      duration: '15 mins',
      participation: '78%',
      speakingTime: '3m 20s',
      badge: 'Active',
      badgeColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      points: ['Technology is creating new job opportunities', 'AI will replace routine jobs', 'We need upskilling programs'],
      feedback: 'Excellent opening point and strong participation throughout the discussion.',
    },
    {
      id: 2,
      date: '17 Mar',
      topic: 'Climate Change',
      duration: '15 mins',
      participation: '68%',
      speakingTime: '2m 45s',
      badge: 'Good',
      badgeColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      points: ['Governments should enforce strict policies', 'Individual responsibility matters', 'Green energy is the future'],
      feedback: 'Good engagement but try to connect more with other participants points.',
    },
    {
      id: 3,
      date: '14 Mar',
      topic: 'Online Education',
      duration: '10 mins',
      participation: '70%',
      speakingTime: '2m 10s',
      badge: 'Good',
      badgeColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      points: ['Online learning provides flexibility', 'Personal interaction is still important', 'Hybrid model is ideal'],
      feedback: 'Good points raised but speak louder and be more assertive.',
    },
    {
      id: 4,
      date: '11 Mar',
      topic: 'Social Media',
      duration: '15 mins',
      participation: '62%',
      speakingTime: '1m 55s',
      badge: 'Average',
      badgeColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      points: ['Social media connects people globally', 'Mental health concerns need addressing', 'Regulation is necessary'],
      feedback: 'You could participate more early in the discussion.',
    },
    {
      id: 5,
      date: '08 Mar',
      topic: 'Women Empowerment',
      duration: '10 mins',
      participation: '55%',
      speakingTime: '1m 30s',
      badge: 'Needs Work',
      badgeColor: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      points: ['Education is key to empowerment', 'Workplace equality matters'],
      feedback: 'Try to participate from the beginning. Early speakers often influence the discussion.',
    },
  ];

  const recommendations = [
    { icon: '🎤', text: 'Speak in the first 2 minutes — early participation scores higher' },
    { icon: '👂', text: 'Practice active listening — respond to others points' },
    { icon: '💡', text: 'Try to summarize the discussion at the end to show leadership' },
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
              <h1 className="text-4xl font-bold text-slate-100 mb-2">Group Discussion</h1>
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Track your GD performance and communication skills</p>
                <button
                  onClick={() => navigate('/practice/gd')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Enter GD Room
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Best Participation</p>
                <p className="text-3xl font-bold text-blue-400">78%</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Avg Speaking Time</p>
                <p className="text-3xl font-bold text-blue-400">2m 45s</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Total Sessions</p>
                <p className="text-3xl font-bold text-blue-400">5</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Topics Covered</p>
                <p className="text-3xl font-bold text-blue-400">12</p>
              </div>
            </div>

            {/* Next Target */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Next Target</h2>
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg font-semibold mb-2">Contributor</span>
                    <p className="text-sm text-slate-400">Current Level</p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-2xl text-blue-400">→</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="px-4 py-2 bg-blue-900/30 text-blue-300 rounded-lg font-semibold mb-2">Leader</span>
                    <p className="text-sm text-slate-400">Next Level</p>
                  </div>
                </div>
                <p className="text-sm text-blue-300 font-semibold">60%</p>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: '60%' }} />
              </div>
              <p className="text-slate-300 mb-6">
                Participate in <span className="font-bold text-yellow-300">3 more GD sessions</span> and maintain above 70% participation to reach Leader level
              </p>
              <button
                onClick={() => navigate('/practice/gd')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Join GD Room
              </button>
            </div>

            {/* Participation Trend */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Participation Trend</h2>
              <div className="flex items-end justify-center gap-6 h-48">
                {participationTrendData.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-sm font-semibold text-blue-400">{item.score}%</span>
                    <div
                      className={`w-12 rounded-t-lg transition-all ${
                        idx === participationTrendData.length - 1 ? 'bg-blue-500' : 'bg-blue-600'
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
                              {session.topic}
                            </span>
                            <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs font-semibold rounded-full">
                              {session.duration}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-slate-400" />
                            <p className="text-slate-400 text-sm">{session.speakingTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`px-4 py-2 rounded-lg font-semibold text-sm ${session.badgeColor} inline-block`}>
                              {session.participation} - {session.badge}
                            </p>
                          </div>
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
                          <div className="mb-6">
                            <h4 className="font-bold text-slate-100 mb-3">Key Points Made</h4>
                            <ul className="space-y-2">
                              {session.points.map((point, idx) => (
                                <li key={idx} className="flex gap-3 text-slate-300 text-sm">
                                  <span className="text-blue-400 font-bold">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                            <h4 className="font-bold text-slate-100 mb-2">AI Feedback</h4>
                            <p className="text-slate-300 text-sm">{session.feedback}</p>
                          </div>

                          <button
                            onClick={() => navigate('/practice/gd')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                          >
                            Practice this topic again
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
