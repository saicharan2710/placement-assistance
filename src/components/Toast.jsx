import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

export default function Toast({ message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg">
        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
        <p className="text-green-700 dark:text-green-300 font-semibold">{message}</p>
      </div>
    </div>
  );
}
