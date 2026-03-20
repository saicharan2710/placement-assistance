import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function NextStepCard({
  title = 'Technical Assessment',
  description = 'Data Structures & Algorithms module is ready for your daily challenge.',
  buttonText = 'Start Now',
  onButtonClick = () => {},
  route = '/technical-assessment',
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    onButtonClick();
    navigate(route);
  };

  return (
    <div className="px-4 md:px-6 py-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">Your Next Step</h2>
      
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-2xl p-8 text-white">
        <h3 className="text-2xl md:text-3xl font-bold mb-3">{title}</h3>
        <p className="text-blue-100 dark:text-blue-200 text-base md:text-lg mb-8 max-w-2xl">
          {description}
        </p>

        <button 
          onClick={handleClick}
          className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {buttonText}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
