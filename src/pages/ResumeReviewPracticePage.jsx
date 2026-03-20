import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CloudUpload, FileText, CheckCircle, AlertCircle, XCircle, ChevronDown } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';

export default function ResumeReviewPracticePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('practice');
  const [userName, setUserName] = useState('User');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stage, setStage] = useState(0); // 0: upload, 1: feedback
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('prepway_user');
    if (!savedUser) {
      navigate('/');
    } else {
      const user = JSON.parse(savedUser);
      setUserName(user.name || 'User');
    }
  }, [navigate]);

  const handleFileSelect = (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    simulateAnalysis();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setStage(1);
      
      // Save to localStorage
      localStorage.setItem('prepway_resume_review', JSON.stringify({
        lastReviewed: new Date().toLocaleDateString(),
        filename: fileName,
        atsScore: 72,
        sectionsAnalyzed: 7
      }));
    }, 2000);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const sections = [
    {
      id: 'contact',
      title: 'Contact Section',
      status: 'Good',
      statusColor: 'green',
      feedback: 'Your name, email and phone are present. Missing: LinkedIn URL and GitHub profile link. Add both — recruiters check these immediately.',
      suggestion: 'Add: linkedin.com/in/yourname | github.com/yourname'
    },
    {
      id: 'objective',
      title: 'Objective / Summary Section',
      status: 'Needs Work',
      statusColor: 'yellow',
      feedback: 'This is too generic — every candidate writes the same thing. Make it specific to the role.',
      currentText: '"To obtain a challenging position in a reputed organization where I can utilize my skills..."',
      betterExample: '"Final year CSE student at SRMIST with strong foundations in React and Python seeking a software development role to contribute to innovative products."'
    },
    {
      id: 'education',
      title: 'Education Section',
      status: 'Good',
      statusColor: 'green',
      feedback: 'Education section is well structured. CGPA is mentioned which is good for freshers. Consider adding relevant coursework if CGPA is above 8.'
    },
    {
      id: 'skills',
      title: 'Skills Section',
      status: 'Needs Work',
      statusColor: 'yellow',
      feedback: 'Skills are listed but not categorized. Group them by type for better readability.',
      suggestion: 'Languages: Python, Java, C++\nFrameworks: React, Node.js\nTools: Git, VS Code, MySQL'
    },
    {
      id: 'projects',
      title: 'Projects Section',
      status: 'Good',
      statusColor: 'green',
      feedback: 'Projects section is your strongest asset as a fresher. Good that you have included them.',
      improvementTip: 'Add impact metrics where possible:\nInstead of "Built a web app" write\n"Built a web app used by 50+ college students"'
    },
    {
      id: 'experience',
      title: 'Experience Section',
      status: 'Missing',
      statusColor: 'red',
      feedback: 'No internship or work experience mentioned. This is a significant gap for placement applications.',
      suggestions: [
        'Add any freelance projects as experience',
        'Include college club roles (tech lead, coordinator)',
        'Include open source contributions',
        'Even a 1 month internship makes a big difference'
      ]
    }
  ];

  const foundKeywords = ['Python', 'SQL', 'React', 'Git', 'Data Structures', 'HTML', 'CSS', 'JavaScript', 'OOP'];
  const missingKeywords = ['Docker', 'AWS', 'Machine Learning', 'REST API', 'Agile', 'System Design', 'Linux', 'Cloud Computing'];

  const priorities = [
    { priority: 1, level: 'HIGH', task: 'Add LinkedIn and GitHub URLs', time: '5 minutes' },
    { priority: 2, level: 'HIGH', task: 'Rewrite objective statement', time: '10 minutes' },
    { priority: 3, level: 'MEDIUM', task: 'Reduce resume to 1 page', time: '30 minutes' },
    { priority: 4, level: 'MEDIUM', task: 'Add missing keywords to skills', time: '15 minutes' },
    { priority: 5, level: 'MEDIUM', task: 'Quantify project descriptions', time: '20 minutes' },
    { priority: 6, level: 'LOW', task: 'Categorize skills section', time: '10 minutes' },
    { priority: 7, level: 'LOW', task: 'Add relevant coursework to education', time: '10 minutes' }
  ];

  const scoreBreakdown = [
    { label: 'Contact Info', score: 80 },
    { label: 'Objective/Summary', score: 40 },
    { label: 'Education', score: 90 },
    { label: 'Skills', score: 65 },
    { label: 'Projects', score: 75 },
    { label: 'Experience', score: 20 },
    { label: 'Keywords', score: 60 }
  ];

  const tips = [
    'Keep resume to exactly 1 page for fresher roles',
    'Use a clean ATS friendly template, no tables or graphics',
    'Always tailor objective to the specific company',
    'Quantify achievements with numbers wherever possible',
    'List skills in order of proficiency',
    'Add GitHub and LinkedIn — non negotiable for tech roles',
    'Use action verbs: built, developed, designed, led',
    'Proofread 3 times — zero spelling mistakes allowed',
    'Save as PDF not Word to preserve formatting',
    'Name your file: FirstName_LastName_Resume.pdf'
  ];

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'good':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700';
      case 'needs work':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700';
      case 'missing':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'good':
        return <CheckCircle className="w-4 h-4" />;
      case 'needs work':
        return <AlertCircle className="w-4 h-4" />;
      case 'missing':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'bg-green-600';
    if (score >= 50) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        <TopBar userName={userName} onHamburgerClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
            {/* STAGE 0: Upload Screen */}
            {stage === 0 && (
              <>
                <div className="mb-8">
                  <button
                    onClick={() => navigate('/practice')}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Practice
                  </button>
                  <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">Resume Review</h1>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-slate-400">Get detailed AI feedback on your resume</p>
                </div>

                {/* Upload Area */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 p-8 lg:p-12 text-center mb-8" onDragOver={handleDragOver} onDrop={handleDrop}>
                  <div className="mb-4 flex justify-center">
                    <CloudUpload className="w-12 lg:w-16 h-12 lg:h-16 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">Drop your PDF resume here</h3>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-slate-400 mb-4">or click to browse files</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">Supported format: PDF only, max 5MB</p>

                  <label className="inline-block">
                    <input type="file" accept=".pdf" onChange={handleFileInputChange} className="hidden" />
                    <button
                      onClick={(e) => {
                        e.currentTarget.parentElement?.querySelector('input[type="file"]')?.click();
                      }}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors border border-blue-600 dark:border-blue-600 cursor-pointer inline-block"
                    >
                      Browse Files
                    </button>
                  </label>
                </div>

                {isAnalyzing && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 lg:p-8 border border-gray-200 dark:border-slate-700">
                    <div className="text-center mb-4">
                      <FileText className="w-10 lg:w-12 h-10 lg:h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                      <p className="text-base lg:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">{fileName}</p>
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-slate-400 mb-4">Analyzing your resume...</p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full animate-pulse" style={{ width: '65%' }} />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* STAGE 1: Feedback Report */}
            {stage === 1 && (
              <>
                {/* Header */}
                <div className="mb-8">
                  <button
                    onClick={() => navigate('/practice')}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Practice
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <a className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        {fileName}
                      </a>
                      <p className="text-xs text-gray-600 dark:text-slate-400">
                        Resume analyzed on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ATS Score Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-8 text-center">ATS Compatibility Score</h3>
                  <div className="flex flex-col items-center mb-8">
                    <ScoreCircle score={72} />
                    <p className="text-center text-gray-600 dark:text-slate-400 mt-4">Your resume is moderately ATS friendly</p>
                  </div>

                  <div className="space-y-4">
                    <ProgressBar label="Keyword Match" score={68} color="yellow" />
                    <ProgressBar label="Formatting Score" score={85} color="green" />
                    <ProgressBar label="Readability" score={75} color="green" />
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-200 text-center">
                      <strong>ATS</strong> (Applicant Tracking System) scans resumes before a human ever reads them. A score above 80% is recommended.
                    </p>
                  </div>
                </div>

                {/* Quick Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* What's Good */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-green-700 dark:text-green-300 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      What's Good
                    </h3>
                    <div className="space-y-3">
                      {[
                        'Education section is clear and complete',
                        'Skills section is well organized',
                        'Projects section shows practical experience',
                        'Contact information is complete',
                        'Good use of action verbs in descriptions'
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700 dark:text-slate-300">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Critical Issues */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Critical Issues
                    </h3>
                    <div className="space-y-3">
                      {[
                        'Resume is longer than 1 page',
                        'No LinkedIn URL in contact section',
                        'Objective statement is too generic',
                        'Missing quantified achievements',
                        'No internship or work experience mentioned'
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700 dark:text-slate-300">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section by Section Analysis */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Line by Line Section Feedback</h3>
                  <div className="space-y-3">
                    {sections.map((section) => (
                      <SectionAccordion key={section.id} section={section} isExpanded={expandedSection === section.id} onToggle={(id) => setExpandedSection(expandedSection === id ? null : id)} statusBadgeColor={getStatusBadgeColor(section.status)} statusIcon={getStatusIcon(section.status)} />
                    ))}
                  </div>
                </div>

                {/* Keyword Analysis */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Keyword Analysis for CSE Placements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-slate-100 mb-3 text-sm">Found Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {foundKeywords.map((kw, idx) => (
                          <span key={idx} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full border border-green-300 dark:border-green-700">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-slate-100 mb-3 text-sm">Missing Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {missingKeywords.map((kw, idx) => (
                          <span key={idx} className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold px-3 py-1 rounded-full border border-red-300 dark:border-red-700">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-6">
                    Add missing keywords naturally in your projects and skills sections. Don't just list them — show how you used them.
                  </p>
                </div>

                {/* Priority List */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Fix These First — Priority Order</h3>
                  <div className="space-y-3">
                    {priorities.map((item) => (
                      <div key={item.priority} className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600">
                        <div className="flex-shrink-0 text-lg font-bold text-gray-600 dark:text-slate-400">{item.priority}.</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${item.level === 'HIGH' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : item.level === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'}`}>
                              {item.level === 'HIGH' ? '🔴' : item.level === 'MEDIUM' ? '🟡' : '🟢'} {item.level}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.task}</p>
                          <p className="text-xs text-gray-600 dark:text-slate-400">({item.time} to fix)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-sm p-8 border border-blue-200 dark:border-blue-800 mb-6">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-6">AI Recommendations</h3>
                  <div className="space-y-4">
                    {[
                      { emoji: '📝', text: 'Rewrite your objective as a professional summary — 3 sentences max, role specific' },
                      { emoji: '🔑', text: 'Add 5-7 missing technical keywords naturally in your project descriptions' },
                      { emoji: '📊', text: 'Add numbers to at least 3 project descriptions to show real impact' },
                      { emoji: '🔗', text: 'Add GitHub link — 80% of tech recruiters check GitHub before interviews' },
                      { emoji: '📄', text: 'Keep it to 1 page — for freshers, 1 page is the golden rule' }
                    ].map((rec, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <span className="text-xl">{rec.emoji}</span>
                        <p className="text-sm text-blue-900 dark:text-blue-200">{rec.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Your Resume Score Breakdown</h3>
                  <div className="space-y-4">
                    {scoreBreakdown.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.label}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.score}%</p>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${getScoreColor(item.score)}`} style={{ width: `${item.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={() => {
                      setStage(0);
                      setFileName('');
                      setFileSize(0);
                    }}
                    className="flex-1 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-slate-100 font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Re-upload Resume
                  </button>
                  <button
                    onClick={() => navigate('/practice')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Back to Practice
                  </button>
                  <button
                    onClick={() => setShowTipsModal(true)}
                    className="flex-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold py-3 px-4 rounded-lg transition-colors border border-blue-300 dark:border-blue-700"
                  >
                    View Resume Tips
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Tips Modal */}
      {showTipsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto border border-gray-200 dark:border-slate-700">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">Resume Tips for Campus Placements</h2>
              <div className="space-y-4">
                {tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{idx + 1}</div>
                    <p className="text-sm text-gray-700 dark:text-slate-300">{tip}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowTipsModal(false)}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreCircle({ score }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-slate-700" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-blue-600 transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{score}%</span>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, score, color }) {
  const colorClasses = {
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{label}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{score}%</p>
      </div>
      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${colorClasses[color]}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function SectionAccordion({ section, isExpanded, onToggle, statusBadgeColor, statusIcon }) {
  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => onToggle(section.id)}
        className="w-full p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left flex items-center justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-slate-100">{section.title}</h4>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1 ${statusBadgeColor}`}>
              {statusIcon}
              {section.status}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-400">{section.feedback.substring(0, 80)}...</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-600 dark:text-slate-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="bg-gray-50 dark:bg-slate-700/30 p-4 border-t border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-700 dark:text-slate-300 mb-3">{section.feedback}</p>

          {section.currentText && (
            <div className="mb-3 p-3 bg-gray-200 dark:bg-slate-600 rounded italic text-sm text-gray-700 dark:text-slate-300">
              {section.currentText}
            </div>
          )}

          {section.suggestion && (
            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1">Suggestion:</p>
              <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-line">{section.suggestion}</p>
            </div>
          )}

          {section.betterExample && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
              <p className="text-xs font-semibold text-green-900 dark:text-green-200 mb-1">Better Example:</p>
              <p className="text-sm text-green-800 dark:text-green-300">{section.betterExample}</p>
            </div>
          )}

          {section.improvementTip && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-200 mb-1">Improvement Tip:</p>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 whitespace-pre-line">{section.improvementTip}</p>
            </div>
          )}

          {section.suggestions && section.suggestions.length > 0 && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
              <p className="text-xs font-semibold text-purple-900 dark:text-purple-200 mb-2">Suggestions:</p>
              <ul className="space-y-1">
                {section.suggestions.map((sug, idx) => (
                  <li key={idx} className="text-sm text-purple-800 dark:text-purple-300">
                    • {sug}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
