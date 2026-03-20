import React from 'react';

export default function ProfileForm({ formData, onFormChange }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 md:p-8 m-4 md:m-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
        Academic Profile
      </h2>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleInputChange}
            placeholder="Your full name"
            className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 border-2 border-transparent dark:text-slate-100 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* College Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
            College Name
          </label>
          <input
            type="text"
            name="collegeName"
            value={formData.collegeName || ''}
            onChange={handleInputChange}
            placeholder="Your college name"
            className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 border-2 border-transparent dark:text-slate-100 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Branch and Year Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Branch */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
              Branch
            </label>
            <input
              type="text"
              name="branch"
              value={formData.branch || ''}
              onChange={handleInputChange}
              placeholder="e.g., CSE"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 border-2 border-transparent dark:text-slate-100 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Year of Study */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
              Year
            </label>
            <select
              name="yearOfStudy"
              value={formData.yearOfStudy || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 border-2 border-transparent dark:text-slate-100 rounded-lg focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="">Select year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>

        {/* Email Address (Read-only) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
            Email Address (Locked)
          </label>
          <input
            type="email"
            value={formData.email || ''}
            disabled
            className="w-full px-4 py-3 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400 border-2 border-transparent rounded-lg cursor-not-allowed opacity-60"
          />
        </div>

        {/* LinkedIn Profile */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
            LinkedIn Profile
          </label>
          <input
            type="url"
            name="linkedIn"
            value={formData.linkedIn || ''}
            onChange={handleInputChange}
            placeholder="linkedin.com/in/yourprofile"
            className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 border-2 border-transparent dark:text-slate-100 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
