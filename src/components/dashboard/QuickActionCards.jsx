import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Calculator, Users, Mic2, FileText, ArrowRight } from 'lucide-react';
import { getSessionHistory } from '../../utils/progressTracker';

function ActionCard({ icon: Icon, title, description, badge, score, onClick }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <motion.div 
        onClick={onClick}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        className="bg-white dark:bg-gradient-to-br dark:from-[#111111] dark:to-[#0D0D0D] rounded-xl shadow-sm dark:shadow-[0_0_0_1px_#222222,0_4px_24px_rgba(0,0,0,0.8)] p-6 border-2 border-transparent dark:border-[#222222] hover:border-blue-400 dark:hover:border-[#333333] hover:shadow-lg hover:shadow-blue-400/20 dark:hover:shadow-blue-400/10 transition-all duration-300 cursor-pointer group dark:hover:shadow-[0_0_0_1px_#333333,0_0_20px_rgba(37,99,235,0.15)]"
      >
      {/* Icon */}
      <div className="w-12 h-12 bg-blue-50 dark:bg-[rgba(37,99,235,0.08)] rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-[rgba(37,99,235,0.12)] transition-colors">
        <Icon className="w-6 h-6 text-blue-600 dark:text-[#2563EB]" />
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FFFFFF] mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-[#A1A1AA] mb-4">{description}</p>

      {/* Badge */}
      <div className="flex items-center justify-between">
        {score ? (
          <span className="text-sm font-semibold text-green-600 dark:text-[#4ADE80]">{score}</span>
        ) : (
          <span className="text-xs font-medium text-gray-500 dark:text-[#71717A] bg-gray-100 dark:bg-[#111111] dark:border dark:border-[#222222] px-2 py-1 rounded">
            {badge}
          </span>
        )}
        <ArrowRight className="w-4 h-4 text-gray-400 dark:text-[#52525B] group-hover:text-blue-600 dark:group-hover:text-[#2563EB] transition-colors" />
      </div>
      </motion.div>
    </motion.div>
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-[#FFFFFF] mb-6">Focus Areas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cardData.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.1 }}
          >
            <ActionCard
              icon={card.icon}
              title={card.title}
              description={card.description}
              badge={card.badge}
              score={card.score}
              onClick={() => navigate(card.navigate)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
