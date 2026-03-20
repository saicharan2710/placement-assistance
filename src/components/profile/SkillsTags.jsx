import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function SkillsTags({ skills, onSkillsChange }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddSkill = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !skills.includes(trimmedValue)) {
      onSkillsChange([...skills, trimmedValue]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onSkillsChange(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 md:p-8 m-4 md:m-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
        Practice Settings
      </h2>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3 uppercase tracking-wide">
          Current Skills
        </h3>

        {/* Skill Tags and Input */}
        <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg min-h-12 items-center">
          {/* Existing Skills */}
          {skills.map((skill) => (
            <div
              key={skill}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-medium text-sm"
            >
              <span>{skill}</span>
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                aria-label={`Remove ${skill}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Input Field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={skills.length === 0 ? 'Add a skill...' : ''}
            className="flex-1 min-w-[120px] px-3 py-2 bg-transparent border-none focus:outline-none text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400"
          />
        </div>

        {/* Add Button */}
        {inputValue && (
          <button
            onClick={handleAddSkill}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Add Skill
          </button>
        )}
      </div>

      {/* Helper Text */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-600">
        <p className="text-sm text-gray-700 dark:text-slate-300">
          <span className="font-semibold text-blue-600 dark:text-blue-400">💡 Tip:</span> Your
          skills help us customize your practice sessions and mock tests to focus on areas
          relevant to your expertise.
        </p>
      </div>
    </div>
  );
}
