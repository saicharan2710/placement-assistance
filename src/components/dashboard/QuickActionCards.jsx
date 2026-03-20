import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Users, Mic2, FileText, ArrowRight } from 'lucide-react';
import { getSessionHistory } from '../../utils/progressTracker';

function ActionCard({ icon: Icon, title, description, badge, score, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      {/* Icon */}
      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">{description}</p>

      {/* Badge */}
      <div className="flex items-center justify-between">
        {score ? (
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">{score}</span>
        ) : (
          <span className="text-xs font-medium text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
            {badge}
          </span>
        )}
        <ArrowRight className="w-4 h-4 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
      </div>
    </div>
  );
}

export default function QuickActionCards() {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState([
    {
      id: 1,
      icon: Calculator,
      title: 'Aptitude Practice',
      description: 'Master quantitative and logical reasoning skills.',
      score: null,
      badge: 'Not started yet',
      navigate: '/aptitude',
    },
    {
      id: 2,
      icon: Users,
      title: 'Group Discussion',
      description: 'Learn to lead and collaborate in professional debates.',
      score: null,
      badge: 'Not started yet',
      navigate: '/gd',
    },
    {
      id: 3,
      icon: Mic2,
      title: 'Mock Interview',
      description: 'AI-powered technical and HR interview simulation.',
      score: null,
      badge: 'Not started yet',
      navigate: '/interview',
    },
    {
      id: 4,
      icon: FileText,
      title: 'Resume Review',
      description: 'Optimize your CV for ATS systems and recruiters.',
      score: null,
      badge: 'In progress',
      navigate: '/resume-review',
    },
  ]);

  useEffect(() => {
    // Load real data from localStorage
    const aptitudeSessions = getSessionHistory('aptitude');
    const gdSessions = getSessionHistory('gd');
    const interviewSessions = getSessionHistory('interview');

    setCardData(prevCards => 
      prevCards.map(card => {
        if (card.id === 1 && aptitudeSessions.length > 0) {
          const lastScore = aptitudeSessions[aptitudeSessions.length - 1].percentage;
          return { ...card, score: `Last score: ${lastScore}%`, badge: null };
        }
        if (card.id === 2 && gdSessions.length > 0) {
          const lastScore = gdSessions[gdSessions.length - 1].percentage;
          return { ...card, score: `Last score: ${lastScore}%`, badge: null };
        }
        if (card.id === 3 && interviewSessions.length > 0) {
          const lastScore = interviewSessions[interviewSessions.length - 1].percentage;
          return { ...card, score: `Last score: ${lastScore}%`, badge: null };
        }
        return card;
      })
    );
  }, []);

  return (
    <div className="px-4 md:px-6 py-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">Focus Areas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cardData.map((card) => (
          <ActionCard
            key={card.id}
            icon={card.icon}
            title={card.title}
            description={card.description}
            badge={card.badge}
            score={card.score}
            onClick={() => navigate(card.navigate)}
          />
        ))}
      </div>
    </div>
  );
}
