import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import { saveSession } from '../utils/progressTracker';

export default function MockInterviewPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('practice');
  const [userName, setUserName] = useState('User');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stage management
  const [stage, setStage] = useState(0); // 0: setup, 1: technical, 2: hr, 3: report

  // Configuration
  const [interviewMode, setInterviewMode] = useState('full'); // 'full' or 'single'
  const [singleRoundType, setSingleRoundType] = useState('technical');
  const [difficulty, setDifficulty] = useState('Fresher');
  const [useResume, setUseResume] = useState(true);

  // Interview state
  const [currentRound, setCurrentRound] = useState('technical'); // 'technical' or 'hr'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [report, setReport] = useState(null);

  const technicalQuestions = [
    {
      question: 'Can you introduce yourself and tell me about your technical background?',
      feedback: 'Good start — always mention your branch, year, key projects and technical skills in your introduction. Keep it under 2 minutes.'
    },
    {
      question: 'Explain the difference between a stack and a queue with a real world example.',
      feedback: 'Good answer if you used a real world example. Remember: Stack = plates in a cafeteria (LIFO), Queue = people in a ticket line (FIFO)'
    },
    {
      question: 'What is object oriented programming? Explain any two OOP concepts.',
      feedback: 'The four pillars of OOP are Encapsulation, Inheritance, Polymorphism and Abstraction. Always explain with simple examples.'
    },
    {
      question: 'What is the difference between SQL and NoSQL databases? When would you use each?',
      feedback: 'SQL is structured, table based and uses schemas. NoSQL is flexible and document based. Use SQL for transactional data, NoSQL for unstructured or large scale data.'
    },
    {
      question: 'Explain what happens when you type a URL in a browser and press Enter.',
      feedback: 'Strong answer covers: DNS lookup, TCP connection, HTTP request, server response, browser rendering. Mentioning even 3-4 steps shows good understanding.'
    }
  ];

  const hrQuestions = [
    {
      question: 'Tell me about yourself.',
      feedback: 'Structure your answer as: Present (who you are) → Past (your background) → Future (why this role). Keep it to 90 seconds. Avoid just reading your resume.'
    },
    {
      question: 'What are your greatest strengths? Give an example for each.',
      feedback: 'Always back strengths with specific examples. Saying "I am a quick learner" is weak. Saying "I learned React in 2 weeks to complete my project" is strong.'
    },
    {
      question: 'Where do you see yourself in 5 years?',
      feedback: 'Show ambition but stay realistic. Mention skill growth, taking on responsibilities and contributing to the company. Avoid saying "in your position" or "running my own company".'
    },
    {
      question: 'Describe a challenge you faced and how you overcame it.',
      feedback: 'Use the STAR method: Situation → Task → Action → Result. This structures your answer and makes it memorable and clear to the interviewer.'
    },
    {
      question: 'Why should we hire you over other candidates?',
      feedback: 'This is your sales pitch. Talk about your unique combination of skills, your enthusiasm for the role and a specific value you will bring. Research the company before answering this.'
    }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('prepway_user');
    if (!savedUser) {
      navigate('/');
    } else {
      const user = JSON.parse(savedUser);
      setUserName(user.name || 'User');
    }
  }, [navigate]);

  // Timer effect
  useEffect(() => {
    if (stage < 1 || stage > 2) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [stage]);

  const handleStartInterview = () => {
    setStartTime(new Date());
    setStage(1);
    setCurrentRound('technical');
    setCurrentQuestionIndex(0);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      alert('Please type an answer before submitting');
      return;
    }

    setAnswers({
      ...answers,
      [`${currentRound}_${currentQuestionIndex}`]: userAnswer
    });

    setShowFeedback(true);
  };

  const handleSkipQuestion = () => {
    setAnswers({
      ...answers,
      [`${currentRound}_${currentQuestionIndex}`]: '[SKIPPED]'
    });
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    const questions = currentRound === 'technical' ? technicalQuestions : hrQuestions;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setShowFeedback(false);
    } else {
      // Round complete
      if (currentRound === 'technical' && (interviewMode === 'full' || singleRoundType === 'technical')) {
        if (interviewMode === 'full') {
          // Move to HR
          setTimeout(() => {
            setCurrentRound('hr');
            setCurrentQuestionIndex(0);
            setUserAnswer('');
            setShowFeedback(false);
          }, 2000);
        } else {
          // Single round - generate report
          generateReport();
        }
      } else if (currentRound === 'hr') {
        generateReport();
      }
    }
  };

  const generateReport = () => {
    const totalAnswered = Object.keys(answers).length;
    const techAnswers = Object.keys(answers).filter((k) => k.startsWith('technical')).length;
    const hrAnswers = Object.keys(answers).filter((k) => k.startsWith('hr')).length;

    const technicalScore = Math.min(70 + techAnswers * 2, 95);
    const hrScore = Math.min(75 + hrAnswers * 2, 95);
    const overallScore = Math.round((technicalScore + hrScore) / 2);

    const reportData = {
      technicalScore,
      hrScore,
      overallScore,
      techAnswered: techAnswers,
      hrAnswered: hrAnswers,
      totalTime: elapsedTime,
      date: new Date().toLocaleDateString(),
      answers
    };

    setReport(reportData);
    setStage(3);

    // Save to localStorage
    const resultData = {
      score: overallScore,
      total: 100,
      percentage: overallScore,
      timeTaken: formatTime(elapsedTime),
      difficulty,
      category: 'Mock Interview',
      techScore: technicalScore,
      hrScore: hrScore,
      overallScore,
      date: new Date().toLocaleDateString(),
      answers
    };

    saveSession('interview', resultData);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getQuestions = () => {
    return currentRound === 'technical' ? technicalQuestions : hrQuestions;
  };

  const currentQuestions = getQuestions();
  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        <TopBar userName={userName} onHamburgerClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
            {/* STAGE 0: Interview Setup */}
            {stage === 0 && (
              <>
                <div className="mb-8">
                  <button
                    onClick={() => navigate('/practice')}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Practice
                  </button>
                  <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">Mock Interview</h1>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-slate-400">Two rounds — Technical and HR</p>
                </div>

                {/* Interview Mode Selection */}
                <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 lg:p-8 border border-gray-200 dark:border-slate-700">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Interview Format</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Full Interview */}
                    <button
                      onClick={() => setInterviewMode('full')}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${
                        interviewMode === 'full'
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600'
                          : 'bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600'
                      }`}
                    >
                      <p className="text-base lg:text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">Full Interview</p>
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-slate-400 mb-3">Technical Round + HR Round</p>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">~20 minutes</p>
                    </button>

                    {/* Single Round */}
                    <button
                      onClick={() => setInterviewMode('single')}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${
                        interviewMode === 'single'
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600'
                          : 'bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600'
                      }`}
                    >
                      <p className="text-base lg:text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">Single Round</p>
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-slate-400 mb-3">Choose one round</p>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">~10 minutes</p>
                    </button>
                  </div>

                  {/* Single Round Type Selection */}
                  {interviewMode === 'single' && (
                    <div className="mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
                      <p className="text-xs lg:text-sm font-semibold text-gray-600 dark:text-slate-400 mb-3">Select Round</p>
                      <div className="flex gap-3">
                        {['Technical', 'HR'].map((type) => (
                          <button
                            key={type}
                            onClick={() => setSingleRoundType(type.toLowerCase())}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                              singleRoundType === type.toLowerCase()
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-slate-100'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Difficulty Selection */}
                  <div className="mb-8">
                    <h4 className="text-xs lg:text-sm font-semibold text-gray-600 dark:text-slate-400 mb-3">Difficulty Level</h4>
                    <div className="flex flex-wrap gap-3">
                      {['Fresher', '1 Year Exp', '2+ Years Exp'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setDifficulty(level)}
                          className={`px-6 py-2 rounded-lg font-semibold transition-all text-sm ${
                            difficulty === level
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-slate-100'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resume Toggle */}
                  <div className="p-4 lg:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-slate-100 text-xs lg:text-sm">Use resume for personalized questions</p>
                        <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                          {useResume ? '✓ Resume detected: Saicharan_Resume.pdf' : 'Generic questions will be used'}
                        </p>
                      </div>
                      <button
                        onClick={() => setUseResume(!useResume)}
                        className={`w-14 h-8 rounded-full transition-colors ${
                          useResume ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full bg-white transition-transform ${
                            useResume ? 'translate-x-7' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={handleStartInterview}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg shadow-lg mb-8"
                >
                  Start Interview
                </button>
              </>
            )}

            {/* STAGE 1-2: Interview in Progress */}
            {(stage === 1 || stage === 2) && currentQuestion && (
              <>
                {/* Round Header */}
                <div className="mb-8">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 gap-4">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-slate-100">
                      Round {currentRound === 'technical' ? '1 of 2' : '2 of 2'} — {currentRound === 'technical' ? 'Technical' : 'HR'} Interview
                    </h2>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 dark:text-slate-400">Time Elapsed</p>
                      <p className="text-base lg:text-lg font-mono font-bold text-blue-600">{formatTime(elapsedTime)}</p>
                    </div>
                  </div>

                  {/* Step Bar */}
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 flex-1 rounded ${currentRound === 'technical' ? 'bg-blue-600' : 'bg-green-600'}`} />
                    {interviewMode === 'full' && (
                      <>
                        <div className={`h-1.5 flex-1 rounded ${currentRound === 'hr' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-700'}`} />
                      </>
                    )}
                  </div>
                </div>

                {/* AI Interviewer Panel */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 lg:p-8 border border-gray-200 dark:border-slate-700 mb-8 text-center">
                  <div className="mb-6">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl font-bold text-white">AI</span>
                      </div>
                      <div className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-50 animate-pulse" />
                    </div>
                    <p className="text-xs lg:text-sm font-semibold text-gray-600 dark:text-slate-400">
                      {currentRound === 'technical' ? 'Technical' : 'HR'} Interviewer
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 lg:p-6 mb-4">
                    <p className="text-xs text-gray-600 dark:text-slate-400 mb-2">
                      Question {currentQuestionIndex + 1} of {currentQuestions.length}
                    </p>
                    <p className="text-base lg:text-lg font-semibold text-gray-900 dark:text-slate-100">{currentQuestion.question}</p>
                  </div>
                </div>

                {/* User Response Panel */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 lg:p-8 border border-gray-200 dark:border-slate-700">
                  <label className="block text-xs lg:text-sm font-semibold text-gray-900 dark:text-slate-100 mb-4">Your Answer</label>

                  {!showFeedback ? (
                    <>
                      <textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer here... Be as detailed as possible"
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none"
                        rows="6"
                      />
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-gray-600 dark:text-slate-400">{userAnswer.length} / 500</span>
                        <div className="flex gap-3">
                          <button
                            onClick={handleSkipQuestion}
                            className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-slate-100 font-semibold py-2 px-6 rounded-lg transition-colors"
                          >
                            Skip Question
                          </button>
                          <button
                            onClick={handleSubmitAnswer}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                          >
                            Submit Answer
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 mb-6 max-h-40 overflow-y-auto">
                        <p className="text-sm text-gray-700 dark:text-slate-300">{userAnswer}</p>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <p className="font-semibold text-green-900 dark:text-green-200">Answer Recorded</p>
                        </div>
                        <p className="text-xs font-semibold text-green-900 dark:text-green-200 mb-2">AI Feedback:</p>
                        <p className="text-sm text-green-800 dark:text-green-300">{currentQuestion.feedback}</p>
                      </div>

                      <button
                        onClick={handleNextQuestion}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        Next Question
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {/* STAGE 3: Full Report */}
            {stage === 3 && report && (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">Interview Complete! 🎉</h1>
                  <p className="text-xs lg:text-base text-gray-600 dark:text-slate-400">
                    {report.date} • Total Time: {formatTime(report.totalTime)}
                  </p>
                </div>

                {/* Overall Performance */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 lg:p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-slate-100 mb-8 text-center">Overall Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <ScoreCircle label="Interview Readiness" score={report.overallScore} />
                    <ScorePill label="Technical" score={Math.round(report.technicalScore)} />
                    <ScorePill label="HR" score={Math.round(report.hrScore)} />
                    <ScorePill label="Communication" score={Math.round((report.technicalScore + report.hrScore) / 2)} />
                  </div>
                </div>

                {/* Technical Round Summary */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Technical Round Feedback</h3>
                  <div className="space-y-3">
                    {technicalQuestions.map((q, idx) => (
                      <FeedbackRow key={idx} question={q.question} feedback={q.feedback} index={idx} round="technical" />
                    ))}
                  </div>
                </div>

                {/* HR Round Summary */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">HR Round Feedback</h3>
                  <div className="space-y-3">
                    {hrQuestions.map((q, idx) => (
                      <FeedbackRow key={idx} question={q.question} feedback={q.feedback} index={idx} round="hr" />
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Your Strengths</h3>
                  <div className="space-y-3">
                    <StrengthItem text="Showed good understanding of core concepts" />
                    <StrengthItem text="Structured HR answers clearly" />
                    <StrengthItem text="Good introduction and self presentation" />
                  </div>
                </div>

                {/* Areas to Improve */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    Areas to Improve
                  </h3>
                  <div className="space-y-3">
                    <ImprovementItem text="Add more real world examples in technical answers" />
                    <ImprovementItem text="Use STAR method consistently for HR answers" />
                    <ImprovementItem text="Work on explaining complex concepts simply" />
                    <ImprovementItem text="Practice keeping answers concise under 2 minutes" />
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-sm p-8 border border-blue-200 dark:border-blue-800 mb-8">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-6">💼 Tips For Next Interview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TipCard emoji="🔍" text="Research the company before every interview" />
                    <TipCard emoji="🗣" text="Practice speaking answers aloud, not just typing" />
                    <TipCard emoji="📄" text="Keep your resume updated with latest projects" />
                    <TipCard emoji="⏱" text="Time your answers — aim for 60-90 seconds each" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Practice Again
                  </button>
                  <button
                    onClick={() => navigate('/practice')}
                    className="flex-1 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-slate-100 font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Back to Practice
                  </button>
                  <button
                    onClick={() => navigate('/practice/interview/history')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    View Interview History
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ScoreCircle({ label, score }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-200 dark:text-slate-700" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-blue-600 transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{score}%</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 text-center">{label}</p>
    </div>
  );
}

function ScorePill({ label, score }) {
  return (
    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{score}%</p>
      <p className="text-xs font-semibold text-gray-600 dark:text-slate-400">{label}</p>
    </div>
  );
}

function FeedbackRow({ question, feedback, index, round }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left flex items-start justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-slate-100 text-sm">Q{index + 1}. {question.substring(0, 60)}...</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 italic">💡 {feedback.substring(0, 80)}...</p>
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-600 dark:text-slate-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="bg-gray-50 dark:bg-slate-700/30 p-4 border-t border-gray-200 dark:border-slate-700">
          <p className="font-semibold text-gray-900 dark:text-slate-100 text-sm mb-2">Question:</p>
          <p className="text-sm text-gray-700 dark:text-slate-300 mb-4">{question}</p>
          <p className="font-semibold text-gray-900 dark:text-slate-100 text-sm mb-2">AI Feedback:</p>
          <p className="text-sm text-gray-600 dark:text-slate-400">{feedback}</p>
        </div>
      )}
    </div>
  );
}

function StrengthItem({ text }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-green-900 dark:text-green-200">{text}</p>
    </div>
  );
}

function ImprovementItem({ text }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-yellow-900 dark:text-yellow-200">{text}</p>
    </div>
  );
}

function TipCard({ emoji, text }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
      <p className="text-lg mb-2">{emoji}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{text}</p>
    </div>
  );
}
