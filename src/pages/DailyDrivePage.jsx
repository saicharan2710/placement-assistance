import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Share2, RotateCcw } from 'lucide-react';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';

export default function DailyDrivePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('practice');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [stage, setStage] = useState('landing'); // landing, question, result
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [dailyDriveData, setDailyDriveData] = useState(null);

  const questions = [
    {
      id: 1,
      type: 'APTITUDE',
      question: 'If a train travels 120km in 2 hours, what is its speed in km/h?',
      options: ['A) 50', 'B) 60', 'C) 70', 'D) 80'],
      correct: 1,
      tip: 'Speed = Distance ÷ Time',
    },
    {
      id: 2,
      type: 'APTITUDE',
      question: 'What comes next in the series: 3, 6, 12, 24, ?',
      options: ['A) 36', 'B) 42', 'C) 48', 'D) 72'],
      correct: 2,
      tip: 'Each number is multiplied by 2',
    },
    {
      id: 3,
      type: 'TECHNICAL',
      question: 'What does CSS stand for?',
      options: ['A) Computer Style Sheets', 'B) Cascading Style Sheets', 'C) Creative Style Syntax', 'D) Coded Style System'],
      correct: 1,
      tip: 'CSS controls the visual presentation of HTML',
    },
    {
      id: 4,
      type: 'TECHNICAL',
      question: 'Which data structure works on LIFO principle?',
      options: ['A) Queue', 'B) Array', 'C) Stack', 'D) LinkedList'],
      correct: 2,
      tip: 'LIFO = Last In First Out, like a stack of plates',
    },
    {
      id: 5,
      type: 'HR',
      question: 'Tell me one thing you would like to improve about yourself',
      isTextInput: true,
      tip: 'Be honest but show self awareness and growth mindset. Avoid saying you have no weaknesses.',
    },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('prepway_user');
    if (!savedUser) {
      navigate('/');
    } else {
      const user = JSON.parse(savedUser);
      setUserName(user.name || 'User');
    }

    // Load daily drive data
    const driveData = JSON.parse(localStorage.getItem('prepway_daily_drive')) || {
      lastCompleted: null,
      streak: 0,
      bestStreak: 0,
      totalDrives: 0,
      history: [],
    };
    setDailyDriveData(driveData);
  }, [navigate]);

  useEffect(() => {
    if (stage === 'question' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setTimeTaken(300 - timeLeft + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && stage === 'question') {
      handleFinish();
    }
  }, [timeLeft, stage]);

  const handleAnswer = (optionIndex) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);

    const question = questions[currentQuestionIndex];
    if (optionIndex === question.correct) {
      setScore(score + 1);
    }

    setAnswers({
      ...answers,
      [currentQuestionIndex]: {
        selected: optionIndex,
        correct: optionIndex === question.correct,
      },
    });

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        handleFinish();
      }
    }, 1500);
  };

  const handleTextAnswer = (text) => {
    if (text.trim().length === 0) return;
    
    setIsAnswered(true);
    setAnswers({
      ...answers,
      [currentQuestionIndex]: {
        text: text,
        correct: true, // HR answers are always marked correct
      },
    });
    setScore(score + 1);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        handleFinish();
      }
    }, 2000);
  };

  const handleFinish = () => {
    // Save to localStorage
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newData = { ...dailyDriveData };
    
    // Check if completed today already
    const lastCompleted = newData.lastCompleted;
    const todayStr = today;
    
    if (lastCompleted !== todayStr) {
      newData.streak = (newData.streak || 0) + 1;
      newData.bestStreak = Math.max(newData.streak, newData.bestStreak || 0);
    }
    
    newData.lastCompleted = todayStr;
    newData.totalDrives = (newData.totalDrives || 0) + 1;
    
    const percentage = Math.round((score / questions.length) * 100);
    newData.history = [
      ...newData.history,
      {
        date: todayStr,
        score: score,
        total: questions.length,
        percentage: percentage,
        timeTaken: formatTime(300 - timeLeft),
        xpEarned: score * 10,
      },
    ];

    localStorage.setItem('prepway_daily_drive', JSON.stringify(newData));
    setDailyDriveData(newData);
    setStage('result');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getScoreMessage = () => {
    if (score === 5) return '🏆 Perfect Drive! Unstoppable!';
    if (score === 4) return '🌟 Excellent! Almost perfect!';
    if (score === 3) return '👍 Good effort! Keep going!';
    if (score === 2) return '📚 Keep practicing! You\'ll get there!';
    return '💪 Don\'t give up! Try again tomorrow!';
  };

  const isCompletedToday = dailyDriveData?.lastCompleted && dailyDriveData.lastCompleted === getTodayDate();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        <TopBar userName={userName} onHamburgerClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto bg-slate-900">
          {stage === 'landing' && (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
              <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                  <div className="text-6xl mb-4">🔥</div>
                  <h1 className="text-5xl font-bold text-slate-100 mb-2">Daily Drive</h1>
                  <p className="text-xl text-slate-400">5 questions. 5 minutes. Every day.</p>
                </div>

                {/* Streak */}
                <div className="flex justify-center gap-4 mb-12">
                  <div className="px-6 py-3 bg-orange-900/30 border border-orange-800 rounded-full text-center">
                    <p className="text-orange-400 font-bold text-lg">🔥 {dailyDriveData?.streak || 0} Day Streak</p>
                  </div>
                  <div className="px-6 py-3 bg-slate-700 border border-slate-600 rounded-full text-center">
                    <p className="text-slate-300 font-semibold">Best: {dailyDriveData?.bestStreak || 0} days</p>
                  </div>
                </div>

                {/* Challenge Card */}
                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
                  <div className="mb-6">
                    <p className="text-slate-400 text-sm font-semibold uppercase mb-2">Today's Challenge</p>
                    <p className="text-2xl font-bold text-slate-100">{getTodayDate()}</p>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-2 bg-blue-900/30 border border-blue-800 text-blue-300 text-sm font-semibold rounded-full">
                      2x Aptitude
                    </span>
                    <span className="px-4 py-2 bg-purple-900/30 border border-purple-800 text-purple-300 text-sm font-semibold rounded-full">
                      2x Technical
                    </span>
                    <span className="px-4 py-2 bg-green-900/30 border border-green-800 text-green-300 text-sm font-semibold rounded-full">
                      1x HR
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300 text-sm mb-6">
                    <span>Estimated time: ~4 minutes</span>
                    <span className="px-3 py-1 bg-yellow-900/30 border border-yellow-800 text-yellow-300 rounded-full font-semibold">
                      Medium
                    </span>
                  </div>

                  <div className="h-px bg-slate-700 mb-6" />

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-1">Today's Status</p>
                      <p className={`text-lg font-bold ${isCompletedToday ? 'text-green-400' : 'text-red-400'}`}>
                        {isCompletedToday ? '✓ Completed' : 'Not Done'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-1">This Week</p>
                      <p className="text-lg font-bold text-blue-400">4/7 days</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-1">Total Drives</p>
                      <p className="text-lg font-bold text-blue-400">{dailyDriveData?.totalDrives || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={() => {
                    if (!isCompletedToday) {
                      setStage('question');
                      setTimeLeft(300);
                      setCurrentQuestionIndex(0);
                      setScore(0);
                      setAnswers({});
                    }
                  }}
                  disabled={isCompletedToday}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-colors ${
                    isCompletedToday
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isCompletedToday ? 'Come back tomorrow for your next drive 🌟' : "Start Today's Drive"}
                </button>
              </div>
            </div>
          )}

          {stage === 'question' && (
            <div className="flex flex-col min-h-[calc(100vh-80px)]">
              {/* Top Bar */}
              <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-100">Daily Drive</h2>
                  <p className="text-sm text-slate-300">{currentQuestionIndex + 1} / {questions.length}</p>
                  <div className={`text-lg font-bold font-mono ${timeLeft < 60 ? 'text-red-400' : timeLeft < 120 ? 'text-yellow-400' : 'text-blue-400'}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="h-1 bg-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full">
                  <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                    {/* Type Tag */}
                    <div className="mb-6">
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                          questions[currentQuestionIndex].type === 'APTITUDE'
                            ? 'bg-blue-900/30 text-blue-300 border border-blue-800'
                            : questions[currentQuestionIndex].type === 'TECHNICAL'
                            ? 'bg-purple-900/30 text-purple-300 border border-purple-800'
                            : 'bg-green-900/30 text-green-300 border border-green-800'
                        }`}
                      >
                        {questions[currentQuestionIndex].type}
                      </span>
                    </div>

                    {/* Question Text */}
                    <h3 className="text-2xl font-bold text-slate-100 mb-8">{questions[currentQuestionIndex].question}</h3>

                    {/* Options or Input */}
                    {!questions[currentQuestionIndex].isTextInput ? (
                      <div className="space-y-3">
                        {questions[currentQuestionIndex].options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={isAnswered}
                            className={`w-full p-4 rounded-lg text-left font-medium transition-all ${
                              isAnswered
                                ? idx === questions[currentQuestionIndex].correct
                                  ? 'bg-green-600 border border-green-500 text-white'
                                  : selectedAnswer === idx
                                  ? 'bg-red-600 border border-red-500 text-white'
                                  : 'bg-slate-700 border border-slate-600 text-slate-300'
                                : selectedAnswer === idx
                                ? 'bg-blue-600 border-2 border-blue-500 text-white'
                                : 'bg-slate-700 border border-slate-600 text-slate-300 hover:border-blue-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {isAnswered && idx === questions[currentQuestionIndex].correct && (
                                <CheckCircle className="w-5 h-5" />
                              )}
                              {isAnswered && selectedAnswer === idx && idx !== questions[currentQuestionIndex].correct && (
                                <XCircle className="w-5 h-5" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <textarea
                          id="hr-input"
                          placeholder="Type your answer here..."
                          className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          rows="4"
                          disabled={isAnswered}
                        />
                        <button
                          onClick={() => {
                            const text = document.getElementById('hr-input')?.value || '';
                            handleTextAnswer(text);
                          }}
                          disabled={isAnswered}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Submit
                        </button>
                        {isAnswered && (
                          <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
                            <p className="text-green-300 text-sm font-semibold">✓ Tip: {questions[currentQuestionIndex].tip}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tip for MCQ */}
                    {!questions[currentQuestionIndex].isTextInput && isAnswered && (
                      <div className="mt-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                        <p className="text-green-300 text-sm font-semibold">💡 {questions[currentQuestionIndex].tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {stage === 'result' && (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
              <div className="max-w-2xl w-full">
                {/* Result Header */}
                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center mb-8">
                  <p className="text-4xl font-bold text-slate-100 mb-4">{getScoreMessage()}</p>
                  <div className="flex justify-around mb-6">
                    <div>
                      <p className="text-5xl font-bold text-blue-400 mb-2">{score}</p>
                      <p className="text-slate-400">out of {questions.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-green-400 mb-2">{Math.round((score / questions.length) * 100)}%</p>
                      <p className="text-slate-400">accuracy</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-400 mb-2">{formatTime(300 - timeLeft)}</p>
                      <p className="text-slate-400">time taken</p>
                    </div>
                  </div>
                </div>

                {/* Streak Update */}
                {!isCompletedToday && (
                  <div className="bg-orange-900/30 border border-orange-800 rounded-xl p-6 mb-8 text-center">
                    <p className="text-3xl mb-3">🔥</p>
                    <p className="text-orange-300 font-bold text-lg">Streak updated! You're on a {dailyDriveData?.streak || 1} day streak!</p>
                  </div>
                )}

                {/* Question Breakdown */}
                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
                  <h3 className="text-xl font-bold text-slate-100 mb-4">Question Breakdown</h3>
                  <div className="space-y-3">
                    {questions.map((q, idx) => (
                      <div key={idx} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3 flex-1">
                            <span
                              className={`px-3 py-1 rounded text-xs font-semibold ${
                                q.type === 'APTITUDE'
                                  ? 'bg-blue-900/30 text-blue-300'
                                  : q.type === 'TECHNICAL'
                                  ? 'bg-purple-900/30 text-purple-300'
                                  : 'bg-green-900/30 text-green-300'
                              }`}
                            >
                              {q.type}
                            </span>
                            <p className="text-slate-300 text-sm flex-1 line-clamp-1">{q.question}</p>
                          </div>
                          {answers[idx]?.correct || q.type === 'HR' ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* XP Section */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8 text-center">
                  <p className="text-2xl font-bold text-blue-400 mb-2">🎯 You earned {score * 10} XP today!</p>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-blue-600" style={{ width: '45%' }} />
                  </div>
                  <p className="text-slate-300 font-semibold">Level 3 — Placement Warrior</p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/progress')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    View Progress
                  </button>
                  <button className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
