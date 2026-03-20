import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import { saveSession } from '../utils/progressTracker';

export default function AptitudePracticePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('practice');
  const [userName, setUserName] = useState('User');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stage management
  const [stage, setStage] = useState(0); // 0: config, 1: test, 2: results

  // Configuration
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(10);

  // Test state
  const [questionsToShow, setQuestionsToShow] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  // Results
  const [results, setResults] = useState(null);

  const questionBank = [
    // LOGICAL REASONING (5 questions)
    {
      id: 1,
      category: 'Logical',
      difficulty: 'Medium',
      question: 'If all roses are flowers and some flowers fade quickly, which conclusion is definitely true?',
      options: [
        'All roses fade quickly',
        'Some roses may fade quickly',
        'No roses fade quickly',
        'All flowers are roses'
      ],
      correct: 1,
      explanation: 'From the given statements we can only conclude that some roses may fade quickly'
    },
    {
      id: 2,
      category: 'Logical',
      difficulty: 'Medium',
      question: 'A is B\'s sister. C is B\'s mother. D is C\'s father. E is D\'s mother. How is A related to D?',
      options: [
        'Grandfather',
        'Granddaughter',
        'Daughter',
        'Sister'
      ],
      correct: 1,
      explanation: 'A is B\'s sister → B\'s mother is C → C\'s father is D → so A is D\'s granddaughter'
    },
    {
      id: 3,
      category: 'Logical',
      difficulty: 'Hard',
      question: 'Pointing to a photograph, a man says "This man\'s son is my son\'s father". Who is the man in the photo?',
      options: [
        'Uncle',
        'Father',
        'Grandfather',
        'Brother'
      ],
      correct: 1,
      explanation: 'My son\'s father = me. The man\'s son = me. So the man in photo is my father'
    },
    {
      id: 4,
      category: 'Logical',
      difficulty: 'Easy',
      question: 'Find the odd one out: 121, 144, 169, 196, 225, 288',
      options: [
        '121',
        '196',
        '288',
        '225'
      ],
      correct: 2,
      explanation: 'All others are perfect squares. 288 is not a perfect square'
    },
    {
      id: 5,
      category: 'Logical',
      difficulty: 'Easy',
      question: 'In a row of 40 students, Rita is 11th from the left. What is her position from the right?',
      options: [
        '28',
        '29',
        '30',
        '31'
      ],
      correct: 2,
      explanation: 'Position from right = 40 - 11 + 1 = 30'
    },
    // QUANTITATIVE APTITUDE (7 questions)
    {
      id: 6,
      category: 'Quantitative',
      difficulty: 'Easy',
      question: 'A train 150m long passes a pole in 15 seconds. What is the speed of the train in km/h?',
      options: [
        '32',
        '36',
        '40',
        '45'
      ],
      correct: 1,
      explanation: 'Speed = 150/15 = 10 m/s = 10 × 18/5 = 36 km/h'
    },
    {
      id: 7,
      category: 'Quantitative',
      difficulty: 'Easy',
      question: 'If the cost price is Rs.400 and selling price is Rs.500, what is the profit percentage?',
      options: [
        '20%',
        '25%',
        '30%',
        '15%'
      ],
      correct: 1,
      explanation: 'Profit% = (100/400) × 100 = 25%'
    },
    {
      id: 8,
      category: 'Quantitative',
      difficulty: 'Medium',
      question: 'A tank can be filled in 20 minutes and emptied in 30 minutes. If both pipes are open, how long to fill the tank?',
      options: [
        '50 mins',
        '60 mins',
        '45 mins',
        '55 mins'
      ],
      correct: 1,
      explanation: 'Net fill rate = 1/20 - 1/30 = 1/60. So tank fills in 60 minutes'
    },
    {
      id: 9,
      category: 'Quantitative',
      difficulty: 'Medium',
      question: 'The average of 5 numbers is 27. If one number is excluded the average becomes 25. What is the excluded number?',
      options: [
        '35',
        '37',
        '38',
        '40'
      ],
      correct: 0,
      explanation: 'Sum of 5 numbers = 135. Sum of 4 = 100. Excluded = 135 - 100 = 35'
    },
    {
      id: 10,
      category: 'Quantitative',
      difficulty: 'Easy',
      question: 'Simple interest on Rs.2000 at 5% per annum for 3 years is?',
      options: [
        'Rs.200',
        'Rs.250',
        'Rs.300',
        'Rs.350'
      ],
      correct: 2,
      explanation: 'SI = (2000 × 5 × 3)/100 = Rs.300'
    },
    {
      id: 11,
      category: 'Quantitative',
      difficulty: 'Medium',
      question: 'Two numbers are in ratio 3:5. If their sum is 48, what are the numbers?',
      options: [
        '18 and 30',
        '15 and 25',
        '12 and 20',
        '21 and 35'
      ],
      correct: 0,
      explanation: '3x + 5x = 48 → x = 6. Numbers = 18 and 30'
    },
    {
      id: 12,
      category: 'Quantitative',
      difficulty: 'Easy',
      question: 'What is 15% of 25% of 400?',
      options: [
        '12',
        '15',
        '18',
        '20'
      ],
      correct: 1,
      explanation: '25% of 400 = 100. 15% of 100 = 15'
    },
    // VERBAL ABILITY (8 questions)
    {
      id: 13,
      category: 'Verbal',
      difficulty: 'Easy',
      question: 'Choose the correct synonym of ELOQUENT',
      options: [
        'Silent',
        'Fluent',
        'Angry',
        'Confused'
      ],
      correct: 1,
      explanation: 'Eloquent means fluent and persuasive in speaking or writing'
    },
    {
      id: 14,
      category: 'Verbal',
      difficulty: 'Medium',
      question: 'Choose the antonym of BENEVOLENT',
      options: [
        'Kind',
        'Generous',
        'Malevolent',
        'Caring'
      ],
      correct: 2,
      explanation: 'Benevolent means kind and generous. Malevolent means having evil intentions — its antonym'
    },
    {
      id: 15,
      category: 'Verbal',
      difficulty: 'Easy',
      question: 'Fill in the blank: She _____ to the market yesterday',
      options: [
        'go',
        'goes',
        'went',
        'gone'
      ],
      correct: 2,
      explanation: 'Yesterday indicates past tense. Correct form is "went"'
    },
    {
      id: 16,
      category: 'Verbal',
      difficulty: 'Easy',
      question: 'Identify the error: "He don\'t know the answer"',
      options: [
        'He',
        'don\'t',
        'know',
        'answer'
      ],
      correct: 1,
      explanation: 'With singular subject "He" use "doesn\'t" not "don\'t"'
    },
    {
      id: 17,
      category: 'Verbal',
      difficulty: 'Medium',
      question: 'Choose the word closest in meaning to PENSIVE',
      options: [
        'Happy',
        'Thoughtful',
        'Angry',
        'Tired'
      ],
      correct: 1,
      explanation: 'Pensive means engaged in deep or serious thought'
    },
    {
      id: 18,
      category: 'Verbal',
      difficulty: 'Medium',
      question: 'Rearrange to make a sentence: quickly / the / fox / brown / jumped',
      options: [
        'The fox brown quickly jumped',
        'The brown fox jumped quickly',
        'Quickly the fox brown jumped',
        'Brown the fox quickly jumped'
      ],
      correct: 1,
      explanation: 'Correct sentence structure: The brown fox jumped quickly'
    },
    {
      id: 19,
      category: 'Verbal',
      difficulty: 'Easy',
      question: 'Choose the correct spelling:',
      options: [
        'Accomodate',
        'Acommodate',
        'Accommodate',
        'Acomodate'
      ],
      correct: 2,
      explanation: 'Accommodate has double "c" and double "m"'
    },
    {
      id: 20,
      category: 'Verbal',
      difficulty: 'Hard',
      question: 'Choose the pair with similar relationship as DOCTOR : HOSPITAL',
      options: [
        'Teacher : Student',
        'Chef : Restaurant',
        'Book : Library',
        'Actor : Movie'
      ],
      correct: 1,
      explanation: 'Doctor works in Hospital. Chef works in Restaurant — same relationship'
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
    if (stage !== 1 || isAnswered) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, isAnswered]);

  // Auto-advance timer
  useEffect(() => {
    if (!isAnswered || stage !== 1) return;

    const timer = setTimeout(() => {
      if (currentQuestionIndex < questionsToShow.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnswered(false);
      } else {
        handleTestComplete();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAnswered, currentQuestionIndex, stage, questionsToShow.length]);

  const filteredQuestions = questionBank.filter(
    (q) => (selectedCategory === 'All' || q.category === selectedCategory) &&
           (selectedDifficulty === 'All' || q.difficulty === selectedDifficulty)
  );

  const handleStartTest = () => {
    if (filteredQuestions.length === 0) {
      alert('No questions available for selected filters');
      return;
    }

    const selectedCount = Math.min(selectedQuestionCount, filteredQuestions.length);
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, selectedCount);

    setQuestionsToShow(selected);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(selectedCount * 60); // 1 min per question
    setIsAnswered(false);
    setStage(1);
  };

  const handleAnswerSelect = (optionIndex) => {
    if (isAnswered) return;

    setAnswers({
      ...answers,
      [currentQuestionIndex]: optionIndex
    });
    setIsAnswered(true);
  };

  const handleTimeUp = () => {
    if (currentQuestionIndex < questionsToShow.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
    } else {
      handleTestComplete();
    }
  };

  const handleTestComplete = () => {
    const categoryBreakdown = {
      Logical: { correct: 0, total: 0 },
      Quantitative: { correct: 0, total: 0 },
      Verbal: { correct: 0, total: 0 }
    };

    let totalCorrect = 0;
    questionsToShow.forEach((q, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === q.correct;

      categoryBreakdown[q.category].total += 1;
      if (isCorrect) {
        categoryBreakdown[q.category].correct += 1;
        totalCorrect += 1;
      }
    });

    const percentage = Math.round((totalCorrect / questionsToShow.length) * 100);
    const minutes = Math.floor(selectedQuestionCount * 60 - timeLeft) / 60;

    const resultData = {
      score: totalCorrect,
      total: questionsToShow.length,
      correctAnswers: totalCorrect,
      percentage,
      timeTaken: `${Math.floor(minutes)}m`,
      difficulty: selectedDifficulty,
      category: selectedCategory === 'All' ? 'Mixed' : selectedCategory,
      categoryBreakdown,
      questions: questionsToShow.map((q, index) => ({
        ...q,
        userAnswer: answers[index],
        isCorrect: answers[index] === q.correct,
        selected: String.fromCharCode(65 + answers[index]),
        correct: String.fromCharCode(65 + q.correct)
      }))
    };

    // Save to localStorage using progressTracker
    saveSession('aptitude', resultData);

    setResults(resultData);
    setStage(2);
  };

  const getPerformanceBadge = (percentage) => {
    if (percentage >= 90) return { emoji: '🏆', text: 'Excellent! Company Ready!' };
    if (percentage >= 75) return { emoji: '🌟', text: 'Strong Performance!' };
    if (percentage >= 60) return { emoji: '👍', text: 'Good Effort!' };
    if (percentage >= 40) return { emoji: '📚', text: 'Keep Practicing!' };
    return { emoji: '💪', text: 'Needs More Work!' };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questionsToShow[currentQuestionIndex];
  const timeColor = timeLeft > 180 ? 'text-green-400' : timeLeft > 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        <TopBar userName={userName} onHamburgerClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
            {/* STAGE 0: Configuration */}
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
                  <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">Aptitude Practice</h1>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-slate-400">Real aptitude questions from company hiring drives</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 lg:p-8 border border-gray-200 dark:border-slate-700">
                  {/* Category Selector */}
                  <div className="mb-8">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">Category</h3>
                    <div className="flex flex-wrap gap-3">
                      {['All', 'Logical', 'Quantitative', 'Verbal'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-6 py-2 rounded-lg font-semibold transition-all text-sm ${
                            selectedCategory === cat
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {cat === 'Logical' ? 'Logical Reasoning' : cat === 'Quantitative' ? 'Quantitative' : cat === 'Verbal' ? 'Verbal Ability' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Selector */}
                  <div className="mb-8">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">Difficulty</h3>
                    <div className="flex flex-wrap gap-3">
                      {['Easy', 'Medium', 'Hard'].map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`px-6 py-2 rounded-lg font-semibold transition-all text-sm ${
                            selectedDifficulty === diff
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question Count Selector */}
                  <div className="mb-8">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">Number of Questions</h3>
                    <div className="flex flex-wrap gap-3">
                      {[10, 20, 30].map((count) => (
                        <button
                          key={count}
                          onClick={() => setSelectedQuestionCount(count)}
                          className={`px-6 py-2 rounded-lg font-semibold transition-all text-sm ${
                            selectedQuestionCount === count
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Company Style Info */}
                  <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-blue-900 dark:text-blue-200 text-sm font-semibold">
                      Based on: <span className="font-normal">TCS • Infosys • Wipro • Accenture patterns</span>
                    </p>
                  </div>

                  {/* Start Test Button */}
                  <button
                    onClick={handleStartTest}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg shadow-lg"
                  >
                    Start Test
                  </button>
                </div>
              </>
            )}

            {/* STAGE 1: Test in Progress */}
            {stage === 1 && currentQuestion && (
              <>
                {/* Top Bar */}
                <div className="sticky top-0 bg-gradient-to-b from-gray-50 dark:from-slate-900 to-transparent pb-4 mb-6 -mx-4 md:-mx-6 px-4 md:px-6 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xl font-bold text-gray-900 dark:text-slate-100">
                      Aptitude Practice
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-slate-400">Question</p>
                        <p className="text-2xl font-bold text-blue-600">Q {currentQuestionIndex + 1} / {questionsToShow.length}</p>
                      </div>
                      <div className={`text-center ${timeColor}`}>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Time</p>
                        <p className="text-2xl font-bold font-mono">{formatTime(timeLeft)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / questionsToShow.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 lg:p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  {/* Category Tag */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs lg:text-sm font-semibold ${
                      currentQuestion.category === 'Logical'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : currentQuestion.category === 'Quantitative'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    }`}>
                      {currentQuestion.category === 'Logical' ? 'LOGICAL REASONING' : currentQuestion.category === 'Quantitative' ? 'QUANTITATIVE' : 'VERBAL ABILITY'}
                    </span>
                  </div>

                  {/* Question Text */}
                  <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-8">
                    {currentQuestion.question}
                  </h2>

                  {/* Options */}
                  <div className="space-y-3 mb-6">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = answers[currentQuestionIndex] === index;
                      const isCorrect = index === currentQuestion.correct;
                      const showResult = isAnswered;

                      let bgColor = 'bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700';
                      let borderColor = 'border-gray-200 dark:border-slate-600';

                      if (showResult) {
                        if (isCorrect) {
                          bgColor = 'bg-green-100 dark:bg-green-900/30';
                          borderColor = 'border-green-500';
                        } else if (isSelected && !isCorrect) {
                          bgColor = 'bg-red-100 dark:bg-red-900/30';
                          borderColor = 'border-red-500';
                        }
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={isAnswered}
                          className={`w-full p-4 rounded-lg border-2 text-left font-semibold transition-all ${bgColor} ${borderColor} text-gray-900 dark:text-slate-100 ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{String.fromCharCode(65 + index)}. {option}</span>
                            {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                            {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {isAnswered && (
                    <div className="bg-gray-100 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-300 dark:border-slate-600">
                      <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Explanation</p>
                      <p className="text-gray-600 dark:text-slate-400 text-sm">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* STAGE 2: Results */}
            {stage === 2 && results && (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">Test Complete!</h1>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-slate-400">Here's how you performed</p>
                </div>

                {/* Performance Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 lg:p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <div className="text-center mb-8">
                    <div className="inline-block">
                      <div className="text-4xl lg:text-6xl font-bold text-blue-600 mb-2">{results.correctAnswers}/{results.totalQuestions}</div>
                      <div className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">{results.percentage}%</div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl lg:text-3xl">{getPerformanceBadge(results.percentage).emoji}</span>
                        <span className="text-base lg:text-lg font-semibold text-gray-900 dark:text-slate-100">{getPerformanceBadge(results.percentage).text}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8 pt-8 border-t border-gray-200 dark:border-slate-700">
                    <div className="text-center">
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-slate-400">Time Taken</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-slate-100">{results.timeTaken}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-slate-400">Difficulty</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-slate-100">{results.difficulty}</p>
                    </div>
                    <div className="text-center col-span-2 lg:col-span-1">
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-slate-400">Date</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-slate-100">{results.date}</p>
                    </div>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6">Category Breakdown</h3>
                  <div className="space-y-6">
                    {Object.entries(results.categoryBreakdown).map(([category, data]) => (
                      data.total > 0 && (
                        <div key={category}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-gray-900 dark:text-slate-100">{category}</span>
                            <span className="font-bold text-blue-600">{data.correct}/{data.total}</span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all duration-500"
                              style={{ width: `${(data.correct / data.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                {/* Question Breakdown */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6">Question Breakdown</h3>
                  <div className="space-y-3">
                    {results.questions.map((q, index) => (
                      <QuestionBreakdownItem key={index} question={q} index={index} />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={() => {
                      setStage(0);
                      setAnswers({});
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Retry Test
                  </button>
                  <button
                    onClick={() => navigate('/practice')}
                    className="flex-1 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-slate-100 font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Back to Practice
                  </button>
                  <button
                    onClick={() => navigate('/practice/aptitude/history')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    View Full History
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

function NavItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-l-4 border-blue-600'
          : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

function QuestionBreakdownItem({ question, index }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-1">
          {question.isCorrect ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-slate-100 truncate">Q{index + 1}. {question.question}</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {question.isCorrect ? '✓ Correct' : '✗ Incorrect'} • {question.category}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-slate-400 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="bg-gray-50 dark:bg-slate-700/30 p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Your Answer:</p>
            <p className={`text-sm ${question.isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {String.fromCharCode(65 + question.userAnswer)}. {question.options[question.userAnswer]}
            </p>
          </div>

          {!question.isCorrect && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Correct Answer:</p>
              <p className="text-sm text-green-700 dark:text-green-300">
                {String.fromCharCode(65 + question.correct)}. {question.options[question.correct]}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Explanation:</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
