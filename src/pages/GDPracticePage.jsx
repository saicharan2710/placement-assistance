import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import { saveSession } from '../utils/progressTracker';

export default function GDPracticePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('practice');
  const [userName, setUserName] = useState('User');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stage management
  const [stage, setStage] = useState(0); // 0: lobby, 1: discussion, 2: end overlay, 3: feedback

  // Configuration
  const topics = [
    'Is Artificial Intelligence a threat to employment?',
    'Should social media be regulated by government?',
    'Is online education better than classroom learning?',
    'Should work from home be made permanent?',
    'Is technology making humans less social?',
    'Should college attendance be mandatory?',
    'Is cricket given too much importance in India?',
    'Should voting be made compulsory?'
  ];

  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);

  // Discussion state
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes  
  const [discussionActive, setDiscussionActive] = useState(false);
  const [messagesCount, setMessagesCount] = useState(0);
  const [totalWordsTyped, setTotalWordsTyped] = useState(0);
  const [showEndOverlay, setShowEndOverlay] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const chatEndRef = useRef(null);

  const participants = [
    { name: 'Priya', style: 'Strong communicator', color: 'green' },
    { name: 'Rahul', style: 'Analytical thinker', color: 'blue' },
    { name: 'Meera', style: 'Creative debater', color: 'purple' }
  ];

  const aiResponses = {
    Priya: [
      "That's an interesting perspective. However, we should also consider the impact on developing economies where manual labor is still dominant.",
      "I agree with your point. The government needs to invest heavily in retraining programs to bridge this gap.",
      "That's a valid argument, but we shouldn't overlook the social implications of such rapid change."
    ],
    Rahul: [
      "Could you elaborate more on that point? I think there are multiple dimensions to consider here.",
      "From an economic standpoint, automation increases productivity which ultimately benefits everyone in the long run.",
      "That's interesting, but historically we've seen technology create more jobs than it destroys."
    ],
    Meera: [
      "That's a strong argument. But what about the psychological impact on workers who lose their jobs to machines?",
      "We should also look at countries like Germany which successfully managed automation while maintaining employment levels.",
      "I see your point, but we need to think about how this affects emerging markets differently."
    ]
  };

  const initialMessages = [
    { id: 1, sender: 'Priya', text: "I believe AI will definitely disrupt employment in the short term, especially for repetitive jobs.", type: 'ai' },
    { id: 2, sender: 'Rahul', text: "That's a valid point Priya, but historically technology has always created more jobs than it destroys. The industrial revolution is a good example.", type: 'ai' },
    { id: 3, sender: 'Meera', text: "I think the key issue is the speed of change. Workers may not have enough time to reskill for new roles.", type: 'ai' }
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
    if (!discussionActive || showEndOverlay) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setDiscussionActive(false);
          setShowEndOverlay(true);
          setStage(2);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [discussionActive, showEndOverlay]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoinDiscussion = () => {
    setMessages([...initialMessages]);
    setDiscussionActive(true);
    setTimeLeft(600);
    setStage(1);
  };

  const handleChangeTopic = () => {
    const nextIndex = (selectedTopicIndex + 1) % topics.length;
    setSelectedTopicIndex(nextIndex);
    setSelectedTopic(topics[nextIndex]);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      sender: 'You',
      text: userMessage,
      type: 'user'
    };

    setMessages([...messages, newUserMessage]);
    setMessagesCount(messagesCount + 1);
    setTotalWordsTyped(totalWordsTyped + userMessage.split(' ').length);
    setUserMessage('');

    // Get random AI response
    const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
    const randomResponse = aiResponses[randomParticipant.name][
      Math.floor(Math.random() * aiResponses[randomParticipant.name].length)
    ];

    // Simulate typing delay
    setTimeout(() => {
      const newAIMessage = {
        id: messages.length + 2,
        sender: randomParticipant.name,
        text: randomResponse,
        type: 'ai'
      };
      setMessages((prev) => [...prev, newAIMessage]);
    }, 2000);
  };

  const handleEndDiscussion = async () => {
    setDiscussionActive(false);
    
    // Simulate feedback generation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const participation = Math.round((messagesCount / 15) * 100); // Max 15 expected messages
    
    const feedbackData = {
      participation: Math.min(participation, 100),
      grammar: 75 + Math.random() * 15,
      communication: 70 + Math.random() * 15,
      timing: 80 + Math.random() * 10
    };

    setFeedback(feedbackData);
    setShowEndOverlay(false);
    setStage(3);

    // Save to localStorage
    const resultData = {
      score: messagesCount,
      total: 15,
      correctAnswers: messagesCount,
      percentage: participation,
      timeTaken: '10m',
      difficulty: 'Medium',
      category: 'Group Discussion',
      topic: selectedTopic,
      messagesCount,
      wordsTyped: totalWordsTyped,
      feedback: feedbackData,
      messages: messages.filter((m) => m.type === 'user')
    };

    saveSession('gd', resultData);
  };

  const getParticipantBadge = (color) => {
    const colors = {
      green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    };
    return colors[color] || colors.blue;
  };

  const getPerformanceBadge = () => {
    if (messagesCount >= 5) return { emoji: '🌟', text: 'Active Participant' };
    if (messagesCount >= 3) return { emoji: '👍', text: 'Good Contributor' };
    if (messagesCount >= 1) return { emoji: '📚', text: 'Needs More Participation' };
    return { emoji: '⚠️', text: 'Did Not Participate' };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 120) return 'text-green-400';
    if (timeLeft > 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        <TopBar userName={userName} onHamburgerClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
            {/* STAGE 0: GD Lobby */}
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
                  <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">Group Discussion</h1>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-slate-400">Practice discussion skills with AI participants</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Topic Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 lg:p-8 border border-gray-200 dark:border-slate-700">
                    <p className="text-xs lg:text-sm font-semibold text-gray-600 dark:text-slate-400 mb-3">Today's Topic</p>
                    <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">{selectedTopic}</h2>
                    <div className="flex gap-3 mb-6">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                        Technology
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-semibold rounded-full">
                        Medium
                      </span>
                    </div>
                    <button
                      onClick={handleChangeTopic}
                      className="w-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-slate-100 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Change Topic
                    </button>
                  </div>

                  {/* Rules Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 lg:p-8 border border-gray-200 dark:border-slate-700">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">How It Works</h3>
                    <div className="space-y-4">
                      <RuleRow icon="🕐" text="Discussion lasts 10 minutes" />
                      <RuleRow icon="💬" text="Make at least 3 meaningful points" />
                      <RuleRow icon="👥" text="3 AI participants will also respond" />
                      <RuleRow icon="📊" text="You'll get feedback on grammar and communication" />
                    </div>
                  </div>
                </div>

                {/* Participants Panel */}
                <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">You will discuss with:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {participants.map((p) => (
                      <div key={p.name} className={`rounded-lg p-6 text-center ${getParticipantBadge(p.color)}`}>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">{p.name[0]}</span>
                        </div>
                        <p className="font-bold text-sm mb-1">{p.name}</p>
                        <p className="text-xs opacity-75">{p.style}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleJoinDiscussion}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg shadow-lg"
                  >
                    Join Discussion
                  </button>
                </div>
              </>
            )}

            {/* STAGE 1: Discussion in Progress */}
            {stage === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
                {/* Left Column: Stats */}
                <div className="lg:col-span-1 space-y-4">
                  {/* Topic Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-2">Topic</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{selectedTopic}</p>
                  </div>

                  {/* Timer */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 text-center">
                    <p className={`text-4xl font-mono font-bold ${getTimeColor()}`}>{formatTime(timeLeft)}</p>
                    <p className="text-xs text-gray-600 dark:text-slate-400 mt-2">Remaining</p>
                  </div>

                  {/* Your Stats */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-3">Your Stats</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-slate-400">Messages:</span>
                        <span className="font-bold text-gray-900 dark:text-slate-100">{messagesCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-slate-400">Words:</span>
                        <span className="font-bold text-gray-900 dark:text-slate-100">{totalWordsTyped}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-slate-400">Participation:</span>
                        <span className="font-bold text-gray-900 dark:text-slate-100">{Math.round((messagesCount / 15) * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-3">Participants</p>
                    <div className="space-y-2">
                      {participants.map((p) => (
                        <div key={p.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{p.name[0]}</span>
                            </div>
                            <span className="text-gray-900 dark:text-slate-100 text-xs font-semibold">{p.name}</span>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-slate-400">{Math.floor(Math.random() * 5) + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Chat */}
                <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-3 max-w-xs ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                          {msg.type === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">{msg.sender[0]}</span>
                            </div>
                          )}
                          <div>
                            {msg.type === 'ai' && (
                              <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">{msg.sender}</p>
                            )}
                            <p
                              className={`rounded-lg px-4 py-2 text-sm ${
                                msg.type === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100'
                              }`}
                            >
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Warning Banner */}
                  {timeLeft < 120 && timeLeft > 0 && (
                    <div className="px-6 py-3 bg-yellow-100 dark:bg-yellow-900/30 border-t border-yellow-300 dark:border-yellow-700">
                      <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                        ⏰ {timeLeft < 60 ? '1 minute remaining' : '2 minutes remaining'} — wrap up your points!
                      </p>
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="border-t border-gray-200 dark:border-slate-700 p-6">
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your point here..."
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none"
                        rows="3"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-slate-400">
                          {userMessage.length} / 300
                        </span>
                        <button
                          onClick={handleSendMessage}
                          disabled={!userMessage.trim()}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: End Overlay */}
            {stage === 2 && showEndOverlay && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center max-w-md">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                    Discussion Complete! 🎉
                  </h2>
                  <div className="space-y-3 mb-8">
                    <p className="text-gray-600 dark:text-slate-400">
                      Total messages: <span className="font-bold text-gray-900 dark:text-slate-100">{messagesCount}</span>
                    </p>
                    <p className="text-gray-600 dark:text-slate-400">
                      Total words: <span className="font-bold text-gray-900 dark:text-slate-100">{totalWordsTyped}</span>
                    </p>
                    <p className="text-gray-600 dark:text-slate-400">
                      Participation: <span className="font-bold text-gray-900 dark:text-slate-100">{Math.round((messagesCount / 15) * 100)}%</span>
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">Generating your feedback...</p>
                  <button
                    onClick={handleEndDiscussion}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    View Detailed Feedback
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: Feedback Screen */}
            {stage === 3 && feedback && (
              <>
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">Your GD Feedback Report</h1>
                  <div className="flex items-center gap-4">
                    <p className="text-gray-600 dark:text-slate-400">{selectedTopic}</p>
                    <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-semibold">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Performance Badge */}
                <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
                  <div className="text-5xl mb-3">{getPerformanceBadge().emoji}</div>
                  <h2 className="text-2xl font-bold">{getPerformanceBadge().text}</h2>
                </div>

                {/* Score Overview */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-8">Score Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <ScoreCircle label="Participation" score={feedback.participation} />
                    <ScoreCircle label="Grammar" score={Math.round(feedback.grammar)} />
                    <ScoreCircle label="Communication" score={Math.round(feedback.communication)} />
                    <ScoreCircle label="Timing" score={Math.round(feedback.timing)} />
                  </div>
                </div>

                {/* Grammar Feedback */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Grammar & Language</h3>
                  <div className="space-y-4">
                    <FeedbackItem color="green" text="✓ Sentence structure was mostly correct" />
                    <FeedbackItem color="green" text="✓ Good use of connecting words like 'however' and 'therefore'" />
                    <FeedbackItem color="yellow" text="⚠ Avoid starting sentences with 'And' or 'But'" />
                    <FeedbackItem color="yellow" text="⚠ Use more formal vocabulary in discussions" />
                  </div>
                </div>

                {/* Communication Feedback */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Communication Style</h3>
                  <div className="space-y-4">
                    <FeedbackItem color="green" text="✓ Made clear and structured points" />
                    <FeedbackItem color="green" text="✓ Responded to other participants' arguments" />
                    <FeedbackItem color="yellow" text="⚠ Try to elaborate more on each point" />
                    <FeedbackItem color="yellow" text="⚠ Use real world examples to support arguments" />
                  </div>
                </div>

                {/* What to Avoid */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-6">⚠️ What To Avoid in GDs</h3>
                  <div className="space-y-3">
                    <WarningItem text="Don't interrupt other speakers" />
                    <WarningItem text="Avoid using filler words like umm, basically, you know" />
                    <WarningItem text="Don't repeat the same point multiple times" />
                    <WarningItem text="Avoid going off topic" />
                    <WarningItem text="Don't stay silent for long periods" />
                  </div>
                </div>

                {/* What to Improve */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-6">💡 Focus On These Next Time</h3>
                  <div className="space-y-3">
                    <ImproveItem text="Open the discussion confidently in the first 2 minutes" />
                    <ImproveItem text="Use the structure: Point → Reason → Example" />
                    <ImproveItem text="Try to summarize the discussion at the end" />
                    <ImproveItem text="Reference other participants' points to show active listening" />
                  </div>
                </div>

                {/* Your Messages Review */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Your Discussion Points</h3>
                  <div className="space-y-4">
                    {messages
                      .filter((m) => m.type === 'user')
                      .map((m, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600">
                          <p className="text-sm text-gray-900 dark:text-slate-100 mb-2">{m.text}</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 italic">
                            💡 {['Good point — try adding a real world example', 'Consider elaborating this point further', 'Strong argument with clear reasoning'][idx % 3]}
                          </p>
                        </div>
                      ))}
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
                    onClick={() => navigate('/practice/gd/history')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    View GD History
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

function RuleRow({ icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <span className="text-sm text-gray-700 dark:text-slate-300">{text}</span>
    </div>
  );
}

function ScoreCircle({ label, score }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28 mb-2">
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
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(score)}%</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 text-center">{label}</p>
    </div>
  );
}

function FeedbackItem({ color, text }) {
  const colors = {
    green: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700'
  };

  return (
    <div className={`p-3 rounded-lg border ${colors[color]}`}>
      <p className="text-sm">{text}</p>
    </div>
  );
}

function WarningItem({ text }) {
  return (
    <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700">
      <p className="text-sm">✗ {text}</p>
    </div>
  );
}

function ImproveItem({ text }) {
  return (
    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
      <p className="text-sm">💡 {text}</p>
    </div>
  );
}
