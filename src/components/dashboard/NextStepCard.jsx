import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function NextStepCard({
  title = 'Technical Assessment',
  description = 'Data Structures & Algorithms module is ready for your daily challenge.',
  buttonText = 'Start Now',
  onButtonClick = () => {},
  route = '/technical-assessment',
}) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  const handleClick = () => {
    onButtonClick();
    navigate(route);
  };

  return (
    <div className="px-4 md:px-6 py-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-[#FFFFFF] mb-6">Your Next Step</h2>
      
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.div 
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-[rgba(37,99,235,0.10)] to-[rgba(37,99,235,0.06)] border border-[rgba(37,99,235,0.15)] dark:from-[rgba(37,99,235,0.16)] dark:to-[rgba(37,99,235,0.08)] dark:border-[rgba(37,99,235,0.25)] rounded-2xl p-8 text-[#0F172A] dark:text-[#F4F4F5] hover:shadow-lg hover:shadow-blue-400/20 dark:hover:shadow-blue-400/10 transition-all duration-300"
        >
        <h3 className="text-2xl md:text-3xl font-bold mb-3">{title}</h3>
        <p className="text-[#334155] dark:text-[#93C5FD] text-base md:text-lg mb-8 max-w-2xl">
          {description}
        </p>

        <button 
          onClick={handleClick}
          className="inline-flex items-center gap-2 glass-btn-primary font-semibold px-6 py-3 rounded-lg transition-all duration-300 cursor-pointer"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="flex items-center gap-2 w-full"
          >
            {buttonText}
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
