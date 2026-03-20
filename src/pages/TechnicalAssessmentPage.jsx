import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';

export default function TechnicalAssessmentPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('practice');
  const [userName, setUserName] = useState('User');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stage, setStage] = useState('landing'); // landing, question, result
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('Medium');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [technicalData, setTechnicalData] = useState(null);
  const [expandedAttempt, setExpandedAttempt] = useState(null);

  const allQuestions = [
    // DSA
    {
      id: 1,
      type: 'DSA',
      question: 'What is the time complexity of binary search?',
      options: ['A) O(n)', 'B) O(log n)', 'C) O(n²)', 'D) O(1)'],
      correct: 1,
      explanation: 'Binary search halves the search space each time giving O(log n) complexity',
    },
    {
      id: 2,
      type: 'DSA',
      question: 'Which data structure uses FIFO principle?',
      options: ['A) Stack', 'B) Tree', 'C) Queue', 'D) Graph'],
      correct: 2,
      explanation: 'Queue follows First In First Out — like a line at a ticket counter',
    },
    {
      id: 3,
      type: 'DSA',
      question: 'What is the worst case time complexity of bubble sort?',
      options: ['A) O(n)', 'B) O(log n)', 'C) O(n log n)', 'D) O(n²)'],
      correct: 3,
      explanation: 'Bubble sort compares each element with every other giving O(n²) in worst case',
    },
    {
      id: 4,
      type: 'DSA',
      question: 'Which traversal visits root node first?',
      options: ['A) Inorder', 'B) Postorder', 'C) Preorder', 'D) Level order'],
      correct: 2,
      explanation: 'Preorder visits Root → Left → Right',
    },
    {
      id: 5,
      type: 'DSA',
      question: 'What is the space complexity of merge sort?',
      options: ['A) O(1)', 'B) O(log n)', 'C) O(n)', 'D) O(n²)'],
      correct: 2,
      explanation: 'Merge sort requires O(n) extra space for the temporary arrays',
    },
    // Programming
    {
      id: 6,
      type: 'PROGRAMMING',
      question: 'What does OOP stand for?',
      options: ['A) Object Oriented Programming', 'B) Open Oriented Process', 'C) Object Operated Program', 'D) Oriented Object Processing'],
      correct: 0,
      explanation: 'OOP is a programming paradigm based on objects containing data and methods',
    },
    {
      id: 7,
      type: 'PROGRAMMING',
      question: 'In Python, how is class inheritance implemented?',
      options: ['A) extends', 'B) inherits', 'C) implements', 'D) class Child(Parent):'],
      correct: 3,
      explanation: 'In Python inheritance is done using parentheses: class Child(Parent):',
    },
    {
      id: 8,
      type: 'PROGRAMMING',
      question: 'What is the output of: print(type([]))',
      options: ['A) list', 'B) array', 'C) <class \'list\'>', 'D) []'],
      correct: 2,
      explanation: 'type() returns the class type — for a list it returns <class \'list\'>',
    },
    // CS Theory
    {
      id: 9,
      type: 'CS THEORY',
      question: 'What does DBMS stand for?',
      options: ['A) Data Backup Management System', 'B) Database Management System', 'C) Data Based Memory Storage', 'D) Digital Base Management System'],
      correct: 1,
      explanation: 'DBMS is software for creating, managing and accessing databases',
    },
    {
      id: 10,
      type: 'CS THEORY',
      question: 'Which layer of OSI model handles routing?',
      options: ['A) Data Link', 'B) Transport', 'C) Network', 'D) Session'],
      correct: 2,
      explanation: 'The Network layer handles logical addressing and routing between networks',
    },
    {
      id: 11,
      type: 'CS THEORY',
      question: 'What is a deadlock in OS?',
      options: ['A) System crash', 'B) Two processes waiting for each other indefinitely', 'C) Memory overflow error', 'D) CPU overheating'],
      correct: 1,
      explanation: 'Deadlock occurs when two or more processes are stuck waiting for resources held by each other',
    },
    {
      id: 12,
      type: 'CS THEORY',
      question: 'What does SQL stand for?',
      options: ['A) Structured Query Language', 'B) Simple Query Logic', 'C) System Query Language', 'D) Standard Queue List'],
      correct: 0,
      explanation: 'SQL is used to manage and query relational databases',
    },
    // System Design
    {
      id: 13,
      type: 'SYSTEM DESIGN',
      question: 'What is a load balancer?',
      options: ['A) A tool that compresses files', 'B) A system that distributes traffic across servers', 'C) A database optimization technique', 'D) A network firewall'],
      correct: 1,
      explanation: 'Load balancers distribute incoming requests across multiple servers to prevent overload',
    },
    {
      id: 14,
      type: 'SYSTEM DESIGN',
      question: 'What does API stand for?',
      options: ['A) Application Programming Interface', 'B) Automated Process Integration', 'C) Applied Program Input', 'D) Assigned Protocol Interface'],
      correct: 0,
      explanation: 'APIs allow different software systems to communicate with each other',
    },
    {
      id: 15,
      type: 'SYSTEM DESIGN',
      question: 'What is caching used for?',
      options: ['A) Deleting old data', 'B) Encrypting sensitive information', 'C) Storing frequently accessed data for faster retrieval', 'D) Compressing large files'],
      correct: 2,
      explanation: 'Caching stores data temporarily so future requests can be served faster',
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

    // Load technical assessment data
    const data = JSON.parse(localStorage.getItem('prepway_technical')) || {
      attempts: [],
      bestScore: 0,
      averageScore: 0,
      totalAttempts: 0,
    };
    setTechnicalData(data);
  }, [navigate]);

  useEffect(() => {
    if (stage === 'question' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && stage === 'question') {
      handleFinish();
    }
  }, [timeLeft, stage]);

  const startAssessment = () => {
    // Shuffle and pick questions
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, numQuestions);
    setAssessmentQuestions(shuffled);
    setStage('question');
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers({});
    setSelectedAnswer(null);
    setIsAnswered(false);
    
    // Set timer based on number of questions
    const timeLimitMinutes = numQuestions;
    setTimeLeft(timeLimitMinutes * 60);
  };

  const handleAnswer = (optionIndex) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);

    const question = assessmentQuestions[currentQuestionIndex];
    const isCorrect = optionIndex === question.correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers({
      ...answers,
      [currentQuestionIndex]: {
        selected: optionIndex,
        correct: isCorrect,
      },
    });

    setTimeout(() => {
      if (currentQuestionIndex < assessmentQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        handleFinish();
      }
    }, 2000);
  };

  const handleFinish = () => {
    // Calculate topic breakdown
    const topicBreakdown = {
      dsa: { correct: 0, total: 0 },
      programming: { correct: 0, total: 0 },
      csTheory: { correct: 0, total: 0 },
      systemDesign: { correct: 0, total: 0 },
    };

    assessmentQuestions.forEach((q, idx) => {
      const typeKey = q.type.toLowerCase().replace(' ', '');
      const key = typeKey === 'dsa' ? 'dsa' : typeKey === 'programming' ? 'programming' : typeKey === 'cstheory' ? 'csTheory' : 'systemDesign';
      
      topicBreakdown[key].total += 1;
      if (answers[idx]?.correct) {
        topicBreakdown[key].correct += 1;
      }
    });

    // Save to localStorage
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const percentage = Math.round((score / assessmentQuestions.length) * 100);
    const timeTaken = numQuestions * 60 - timeLeft;
    const mins = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;
    const timeTakenStr = `${mins}m ${secs}s`;

    const newData = { ...technicalData };
    newData.attempts = [
      {
        date: today,
        score: score,
        total: assessmentQuestions.length,
        percentage: percentage,
        difficulty: difficulty,
        timeTaken: timeTakenStr,
        topicBreakdown: topicBreakdown,
      },
      ...(newData.attempts || []),
    ];

    newData.bestScore = Math.max(newData.bestScore || 0, percentage);
    const totalAttempts = (newData.attempts || []).length;
    newData.averageScore = Math.round(
      newData.attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts
    );
    newData.totalAttempts = totalAttempts;

    localStorage.setItem('prepway_technical', JSON.stringify(newData));
    setTechnicalData(newData);
    setStage('result');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceBadge = () => {
    const percentage = Math.round((score / assessmentQuestions.length) * 100);
    if (percentage >= 90) return { emoji: '🏆', text: 'Expert Level!' };
    if (percentage >= 75) return { emoji: '🌟', text: 'Strong Performance!' };
    if (percentage >= 60) return { emoji: '👍', text: 'Good Effort!' };
    if (percentage >= 40) return { emoji: '📚', text: 'Keep Practicing!' };
    return { emoji: '💪', text: 'Needs More Work!' };
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 75) return 'text-green-400';
    if (percentage >= 60) return 'text-blue-400';
    if (percentage >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        <TopBar userName={userName} onHamburgerClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto bg-slate-900">
          {stage === 'landing' && (
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
                <h1 className="text-2xl lg:text-4xl font-bold text-slate-100 mb-2">Technical Assessment</h1>
                <p className="text-sm lg:text-base text-slate-400">Test your core technical knowledge across DSA, Programming, CS Theory and System Design</p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
                  <p className="text-slate-400 text-xs lg:text-sm mb-2">Best Score</p>
                  <p className="text-2xl lg:text-3xl font-bold text-blue-400">{technicalData?.bestScore || 0}%</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
                  <p className="text-slate-400 text-xs lg:text-sm mb-2">Average Score</p>
                  <p className="text-2xl lg:text-3xl font-bold text-blue-400">{technicalData?.averageScore || 0}%</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
                  <p className="text-slate-400 text-xs lg:text-sm mb-2">Total Attempts</p>
                  <p className="text-2xl lg:text-3xl font-bold text-blue-400">{technicalData?.totalAttempts || 0}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
                  <p className="text-slate-400 text-xs lg:text-sm mb-2">Last Attempted</p>
                  <p className="text-xs lg:text-sm font-semibold text-blue-400">{technicalData?.attempts?.[0]?.date || 'Never'}</p>
                </div>
              </div>

              {/* Configuration Card */}
              <div className="bg-slate-800 rounded-xl p-4 lg:p-8 border border-slate-700 mb-8">
                <h2 className="text-xl lg:text-2xl font-bold text-slate-100 mb-6">Configure Your Assessment</h2>

                {/* Number of Questions */}
                <div className="mb-8">
                  <p className="text-slate-300 font-semibold mb-3">Number of Questions</p>
                  <div className="flex gap-3 mb-6">
                    {[10, 15, 20].map((num) => (
                      <button
                        key={num}
                        onClick={() => setNumQuestions(num)}
                        className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                          numQuestions === num
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div className="mb-8">
                  <p className="text-slate-300 font-semibold mb-3">Difficulty</p>
                  <div className="flex gap-3 mb-6">
                    {['Easy', 'Medium', 'Hard'].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                          difficulty === diff
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic Mix */}
                <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 mb-8">
                  <p className="text-slate-300 text-sm font-semibold mb-3">Questions will be randomly picked from:</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-900/30 text-blue-300 text-sm rounded-full">🧮 DSA</span>
                    <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full">💻 Programming</span>
                    <span className="px-3 py-1 bg-green-900/30 text-green-300 text-sm rounded-full">📚 CS Theory</span>
                    <span className="px-3 py-1 bg-orange-900/30 text-orange-300 text-sm rounded-full">🏗 System Design</span>
                  </div>
                  <p className="text-xs text-slate-400">Branch specific questions coming soon</p>
                </div>

                <button
                  onClick={startAssessment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
                >
                  Start Assessment
                </button>
              </div>

              {/* Previous Attempts */}
              {technicalData?.attempts && technicalData.attempts.length > 0 && (
                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                  <h2 className="text-2xl font-bold text-slate-100 mb-6">Previous Attempts</h2>
                  <div className="space-y-3">
                    {technicalData.attempts.slice(0, 3).map((attempt, idx) => (
                      <div key={idx}>
                        <div
                          onClick={() => setExpandedAttempt(expandedAttempt === idx ? null : idx)}
                          className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <span className="text-sm text-slate-400">{attempt.date}</span>
                              <span className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded">{attempt.difficulty}</span>
                              <span className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded">{attempt.total} Qs</span>
                            </div>
                            <p className="text-slate-300 font-semibold">{attempt.score} / {attempt.total} — {attempt.percentage}%</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded text-sm font-semibold ${
                              attempt.percentage >= 75
                                ? 'bg-green-900/30 text-green-300'
                                : attempt.percentage >= 60
                                ? 'bg-blue-900/30 text-blue-300'
                                : 'bg-yellow-900/30 text-yellow-300'
                            }`}>
                              {attempt.percentage >= 75 ? 'Great' : attempt.percentage >= 60 ? 'Good' : 'Average'}
                            </span>
                            {expandedAttempt === idx ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                          </div>
                        </div>

                        {expandedAttempt === idx && (
                          <div className="p-4 bg-slate-700/25 border-l-2 border-blue-600 ml-4 mt-2 rounded text-sm text-slate-300">
                            <p className="mb-2">Time: {attempt.timeTaken}</p>
                            <p className="mb-3 font-semibold">Topic Breakdown:</p>
                            {Object.entries(attempt.topicBreakdown).map(([topic, data]) => (
                              <p key={topic} className="text-xs">
                                {topic.toUpperCase()}: {data.correct}/{data.total}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {stage === 'question' && (
            <div className="flex flex-col min-h-[calc(100vh-80px)]">
              {/* Top Bar */}
              <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-100">Technical Assessment</h2>
                  <p className="text-sm text-slate-300">Q {currentQuestionIndex + 1} / {assessmentQuestions.length}</p>
                  <div className={`text-lg font-bold font-mono ${timeLeft < 60 ? 'text-red-400' : timeLeft < 180 ? 'text-yellow-400' : 'text-blue-400'}`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="h-1 bg-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / assessmentQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full">
                  <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                    {/* Topic Tag */}
                    <div className="mb-6">
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                          assessmentQuestions[currentQuestionIndex].type === 'DSA'
                            ? 'bg-blue-900/30 text-blue-300 border border-blue-800'
                            : assessmentQuestions[currentQuestionIndex].type === 'PROGRAMMING'
                            ? 'bg-purple-900/30 text-purple-300 border border-purple-800'
                            : assessmentQuestions[currentQuestionIndex].type === 'CS THEORY'
                            ? 'bg-green-900/30 text-green-300 border border-green-800'
                            : 'bg-orange-900/30 text-orange-300 border border-orange-800'
                        }`}
                      >
                        {assessmentQuestions[currentQuestionIndex].type}
                      </span>
                    </div>

                    {/* Question Text */}
                    <h3 className="text-2xl font-bold text-slate-100 mb-8">{assessmentQuestions[currentQuestionIndex].question}</h3>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                      {assessmentQuestions[currentQuestionIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          disabled={isAnswered}
                          className={`w-full p-4 rounded-lg text-left font-medium transition-all ${
                            isAnswered
                              ? idx === assessmentQuestions[currentQuestionIndex].correct
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
                            {isAnswered && idx === assessmentQuestions[currentQuestionIndex].correct && (
                              <CheckCircle className="w-5 h-5" />
                            )}
                            {isAnswered && selectedAnswer === idx && idx !== assessmentQuestions[currentQuestionIndex].correct && (
                              <XCircle className="w-5 h-5" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Explanation */}
                    {isAnswered && (
                      <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                        <p className="text-slate-100 font-semibold mb-1">Explanation:</p>
                        <p className="text-slate-300 text-sm">{assessmentQuestions[currentQuestionIndex].explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {stage === 'result' && (
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
              {/* Result Card */}
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8 text-center">
                <div className="text-5xl mb-4">{getPerformanceBadge().emoji}</div>
                <h2 className={`text-3xl font-bold mb-8 ${getPerformanceColor(Math.round((score / assessmentQuestions.length) * 100))}`}>
                  {getPerformanceBadge().text}
                </h2>

                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div>
                    <p className="text-5xl font-bold text-blue-400 mb-2">{score}</p>
                    <p className="text-slate-400">out of {assessmentQuestions.length}</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-green-400 mb-2">{Math.round((score / assessmentQuestions.length) * 100)}%</p>
                    <p className="text-slate-400">accuracy</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-200 mb-2">{difficulty}</p>
                    <p className="text-slate-400">difficulty</p>
                  </div>
                </div>
              </div>

              {/* Topic Breakdown */}
              {technicalData?.attempts?.[0]?.topicBreakdown && (
                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
                  <h3 className="text-xl font-bold text-slate-100 mb-6">Topic Breakdown</h3>
                  <div className="space-y-4">
                    {Object.entries(technicalData.attempts[0].topicBreakdown).map(([topic, data]) => {
                      const topicName = topic === 'dsa' ? 'DSA' : topic === 'programming' ? 'Programming' : topic === 'csTheory' ? 'CS Theory' : 'System Design';
                      const percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                      return (
                        <div key={topic}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-300 font-medium">{topicName}</span>
                            <span className="text-blue-400 font-semibold">{data.correct}/{data.total}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question Breakdown */}
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
                <h3 className="text-xl font-bold text-slate-100 mb-6">Question Breakdown</h3>
                <div className="space-y-3">
                  {assessmentQuestions.map((q, idx) => (
                    <div key={idx} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded text-xs font-semibold ${
                              q.type === 'DSA'
                                ? 'bg-blue-900/30 text-blue-300'
                                : q.type === 'PROGRAMMING'
                                ? 'bg-purple-900/30 text-purple-300'
                                : q.type === 'CS THEORY'
                                ? 'bg-green-900/30 text-green-300'
                                : 'bg-orange-900/30 text-orange-300'
                            }`}
                          >
                            {q.type}
                          </span>
                          <p className="text-slate-300 text-sm flex-1 line-clamp-1">{q.question}</p>
                        </div>
                        {answers[idx]?.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="mt-2 p-3 bg-slate-600/50 rounded text-xs text-slate-300">
                        <p className="mb-1"><span className="font-semibold">Correct answer:</span> {q.options[q.correct]}</p>
                        <p><span className="font-semibold">Explanation:</span> {q.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <button
                  onClick={() => startAssessment()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Retake Assessment
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Back to Dashboard
                </button>
                <button className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold py-3 px-4 rounded-lg transition-colors">
                  View All Attempts
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
        isActive
          ? 'bg-blue-900/30 text-blue-400'
          : 'text-slate-300 hover:bg-slate-700'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}
