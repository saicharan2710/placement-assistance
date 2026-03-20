import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Users, Mic, FileText, ArrowRight, Zap, ArrowLeft } from 'lucide-react';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';

export default function PracticePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('practice');
  const [userName, setUserName] = useState('User');
  const [gdLastScore, setGdLastScore] = useState(null);
  const [gdStarted, setGdStarted] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('prepway_user');
    if (!savedUser) {
      navigate('/');
    } else {
      const user = JSON.parse(savedUser);
      setUserName(user.name || 'User');
    }

    // Load GD history from localStorage
    const progressData = localStorage.getItem('prepway_progress');
    if (progressData) {
      try {
        const parsed = JSON.parse(progressData);
        
        // Check GD history
        if (parsed.gd && parsed.gd.length > 0) {
          setGdStarted(true);
          const lastGd = parsed.gd[parsed.gd.length - 1];
          setGdLastScore(Math.round(lastGd.percentage || 0));
        }

        // Calculate total sessions and average score
        let totalCount = 0;
        let totalScore = 0;
        let scoreCount = 0;

        if (parsed.aptitude) {
          totalCount += parsed.aptitude.length;
          parsed.aptitude.forEach((session) => {
            totalScore += session.percentage || 0;
            scoreCount++;
          });
        }
        if (parsed.gd) {
          totalCount += parsed.gd.length;
          parsed.gd.forEach((session) => {
            totalScore += session.percentage || 0;
            scoreCount++;
          });
        }
        if (parsed.interview) {
          totalCount += parsed.interview.length;
          parsed.interview.forEach((session) => {
            totalScore += session.percentage || 0;
            scoreCount++;
          });
        }

        setTotalSessions(totalCount);
        setAverageScore(scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0);
      } catch (error) {
        console.error('Error parsing progress data:', error);
      }
    }
  }, [navigate]);

  const RoundCard = ({ icon: Icon, title, description, badge, badgeColor, buttonText, onClick, historyPath, hasHistory }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">{description}</p>
      <button
        onClick={onClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mb-2"
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </button>
      {hasHistory && (
        <button
          onClick={() => navigate(historyPath)}
          className="w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold py-2 px-4 text-sm transition-colors"
        >
          View History
        </button>
      )}
    </div>
  );

  const StatCard = ({ label, value, icon: Icon }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 lg:p-6 border border-gray-200 dark:border-slate-700 text-center">
      <div className="flex items-center justify-center mb-3">
        {Icon ? <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" /> : null}
      </div>
      <p className="text-2xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{value}</p>
      <p className="text-xs lg:text-sm text-gray-600 dark:text-slate-400">{label}</p>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        {/* Top Bar */}
        <TopBar userName={userName} onHamburgerClick={() => setSidebarOpen(true)} />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
            {/* Page Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              <h1 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                Practice
              </h1>
              <p className="text-sm lg:text-base text-gray-600 dark:text-slate-400">
                Choose a round to practice and improve your skills
              </p>
            </div>

            {/* Section 1: Choose Your Round */}
            <div className="mb-8">
              <h2 className="text-base lg:text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Choose Your Round</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <RoundCard
                  icon={Brain}
                  title="Aptitude Practice"
                  description="Logical, quantitative and verbal questions"
                  badge="Last score: 85%"
                  badgeColor="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  buttonText="Start Practice"
                  onClick={() => navigate('/practice/aptitude')}
                  hasHistory={true}
                  historyPath="/practice/aptitude/history"
                />
                <RoundCard
                  icon={Users}
                  title="Group Discussion"
                  description="Practice speaking, leading and collaborating"
                  badge={gdStarted ? `Last score: ${gdLastScore}%` : 'Not started yet'}
                  badgeColor={gdStarted ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300'}
                  buttonText="Enter GD Room"
                  onClick={() => navigate('/practice/gd')}
                  hasHistory={true}
                  historyPath="/practice/gd/history"
                />
                <RoundCard
                  icon={Mic}
                  title="Mock Interview"
                  description="AI powered technical and HR interview simulation"
                  badge="Last score: 72%"
                  badgeColor="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  buttonText="Start Interview"
                  onClick={() => navigate('/practice/interview')}
                  hasHistory={true}
                  historyPath="/practice/interview/history"
                />
                <RoundCard
                  icon={FileText}
                  title="Resume Review"
                  description="Get AI feedback on your resume"
                  badge="In progress"
                  badgeColor="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                  buttonText="Continue Review"
                  onClick={() => navigate('/practice/resume-review')}
                  hasHistory={false}
                />
              </div>
            </div>

            {/* Section 2: Recommended For You */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Recommended Next Step</h2>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-sm p-8 text-white">
                {gdStarted ? (
                  <>
                    <p className="text-xl font-bold mb-2">Keep practicing GD sessions</p>
                    <p className="mb-6 opacity-90">
                      Great job completing {Math.floor(totalSessions / 3 || 0)} practice sessions! Continue to build confidence and improve your score.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold mb-2">Your Group Discussion score needs attention</p>
                    <p className="mb-6 opacity-90">
                      You haven't practiced GD yet. Start now to improve your overall readiness score.
                    </p>
                  </>
                )}
                <button
                  onClick={() => navigate('/practice/gd')}
                  className="bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  {gdStarted ? 'Continue Practice' : 'Start Now'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Section 3: Quick Stats */}
            <div className="mb-8">
              <h2 className="text-base lg:text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Your Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <StatCard label="Sessions Completed" value={totalSessions} />
                <StatCard label="Average Score" value={averageScore > 0 ? `${averageScore}%` : '--'} />
                <StatCard label="Current Streak" value="3 🔥" />
              </div>
            </div>

            <div className="h-6 lg:h-12"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
