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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-[#FFFFFF] mb-6">Your Next Step</h2>
      
      <div className="bg-gradient-to-br from-[rgba(37,99,235,0.10)] to-[rgba(37,99,235,0.06)] border border-[rgba(37,99,235,0.15)] dark:from-[rgba(37,99,235,0.16)] dark:to-[rgba(37,99,235,0.08)] dark:border-[rgba(37,99,235,0.25)] rounded-2xl p-8 text-[#0F172A] dark:text-[#F4F4F5]">
        <h3 className="text-2xl md:text-3xl font-bold mb-3">{title}</h3>
        <p className="text-[#334155] dark:text-[#93C5FD] text-base md:text-lg mb-8 max-w-2xl">
          {description}
        </p>

        <button 
          onClick={handleClick}
          className="inline-flex items-center gap-2 glass-btn-primary font-semibold px-6 py-3 rounded-lg transition-all duration-300 cursor-pointer"
        >
          {buttonText}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
