import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

export default function ReadinessBar({ percentage = 42, tierName = 'Silver Tier' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-white dark:bg-gradient-to-br dark:from-[#111111] dark:to-[#0D0D0D] rounded-xl shadow-sm dark:shadow-[0_0_0_1px_#222222,0_4px_24px_rgba(0,0,0,0.8)] p-6 md:p-8 m-4 md:m-6 border dark:border-[#222222]"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-[#60A5FA] uppercase tracking-wide mb-2">
            Analytics
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-[#FFFFFF]">
            Placement Readiness Score
          </h2>
        </div>
        <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-[#2563EB] mt-4 md:mt-0">
          {percentage}%<span className="text-lg text-gray-600 dark:text-[#A1A1AA] font-normal ml-2">READY</span>
        </div>
      </div>

      {/* Progress Bar with Shimmer */}
      <div className="relative w-full h-3 bg-gray-200 dark:bg-[#1A1A1A] rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#2563EB] rounded-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite'
          }}
        ></div>
      </div>

      {/* Motivational Text */}
      <p className="text-gray-700 dark:text-[#A1A1AA] text-base">
        You're making great progress! Complete 2 more mock interviews to reach the <span className="font-semibold dark:text-[#FFFFFF]">Silver Tier</span>.
      </p>
    </motion.div>
  );
}
