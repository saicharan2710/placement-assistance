import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle, Upload, Eye, RefreshCw } from 'lucide-react';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';

export default function ResumeReviewPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('practice');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [hasResume, setHasResume] = useState(true);
  const [resumeName] = useState('Saicharan_Resume_2026.pdf');
  const [uploadDate] = useState('15 Mar 2026');

  useEffect(() => {
    const savedUser = localStorage.getItem('prepway_user');
    if (!savedUser) {
      navigate('/');
    } else {
      const user = JSON.parse(savedUser);
      setUserName(user.name || 'User');
    }
  }, [navigate]);

  const strengths = [
    'Clear education section with CGPA mentioned',
    'Projects section well structured',
    'Skills section clearly listed',
    'Contact information complete',
  ];

  const issues = [
    {
      title: 'No internship experience mentioned',
      suggestion: 'Add freelance or college projects as experience',
    },
    {
      title: 'Resume exceeds 1 page',
      suggestion: 'Keep resume to 1 page for fresher profiles',
    },
    {
      title: 'Missing LinkedIn profile URL',
      suggestion: 'Add LinkedIn URL in contact section',
    },
    {
      title: 'Objective statement is too generic',
      suggestion: 'Make objective specific to role applying for',
    },
  ];

  const keywordsFound = ['Python', 'SQL', 'React', 'Git', 'Data Structures'];
  const keywordsMissing = ['Docker', 'AWS', 'Machine Learning', 'REST API', 'Agile'];

  const recommendations = [
    { icon: '📝', text: 'Add a strong summary section at the top' },
    { icon: '🔑', text: 'Include more technical keywords for CSE placements' },
    { icon: '📊', text: 'Quantify achievements — add numbers and impact' },
    { icon: '🔗', text: 'Add GitHub profile link to showcase projects' },
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
              <h1 className="text-4xl font-bold text-slate-100 mb-2">Resume Review</h1>
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Get AI feedback on your resume</p>
                <button
                  onClick={() => setHasResume(!hasResume)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload New Resume
                </button>
              </div>
            </div>

            {/* Current Resume Status */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Current Resume Status</h2>
              {hasResume ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Resume File</p>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-red-400 font-bold text-sm">PDF</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-100">{resumeName}</p>
                        <p className="text-sm text-slate-400">Uploaded on {uploadDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Resume
                    </button>
                    <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Replace Resume
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-300 font-semibold mb-2">Upload your resume to get started</p>
                  <p className="text-slate-400 text-sm mb-6">Supported format: PDF</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Upload PDF
                  </button>
                </div>
              )}
            </div>

            {/* ATS Score */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-8">ATS Compatibility Score</h2>
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-40 h-40 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    {/* Background circle */}
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#334155" strokeWidth="8" />
                    {/* Progress circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="8"
                      strokeDasharray={`${(72 / 100) * 565.5} 565.5`}
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />
                    {/* Text */}
                    <text x="100" y="105" textAnchor="middle" className="text-4xl font-bold fill-blue-400" fontSize="40">
                      72%
                    </text>
                  </svg>
                </div>
                <p className="text-center text-slate-300 font-medium">Your resume is moderately ATS friendly</p>
              </div>

              {/* Score Pills */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <p className="text-slate-400 text-sm mb-2">Keywords</p>
                  <p className="text-2xl font-bold text-yellow-400">68%</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <p className="text-slate-400 text-sm mb-2">Formatting</p>
                  <p className="text-2xl font-bold text-green-400">85%</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <p className="text-slate-400 text-sm mb-2">Readability</p>
                  <p className="text-2xl font-bold text-green-400">75%</p>
                </div>
              </div>
            </div>

            {/* Resume Strengths */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">Resume Strengths</h2>
              </div>
              <div className="space-y-3">
                {strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-slate-700/50 rounded-lg border border-green-900/30">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues Found */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">Issues to Fix</h2>
              </div>
              <div className="space-y-4">
                {issues.map((issue, idx) => (
                  <div key={idx} className="p-4 bg-slate-700/50 rounded-lg border border-yellow-900/30">
                    <div className="flex items-start gap-3 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="font-semibold text-slate-100">{issue.title}</p>
                    </div>
                    <p className="text-sm text-slate-400 ml-8">💡 {issue.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Analysis */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Keyword Analysis for CSE Roles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {/* Keywords Found */}
                <div>
                  <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    Keywords Found
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {keywordsFound.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 bg-green-900/30 border border-green-800 text-green-300 text-sm font-medium rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Keywords Missing */}
                <div>
                  <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    Keywords Missing
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {keywordsMissing.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 bg-red-900/30 border border-red-800 text-red-300 text-sm font-medium rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                💡 Add missing keywords naturally in your projects and skills section
              </p>
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
