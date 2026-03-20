import React, { useState } from 'react';
import { Camera } from 'lucide-react';

export default function ProfileHeader({ userName, stream, yearOfStudy, onPhotoChange }) {
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        onPhotoChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center py-8 px-4 bg-white dark:bg-slate-800">
      {/* Profile Photo with Edit Icon */}
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center overflow-hidden">
          {photoPreview ? (
            <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl font-bold text-white">{getInitials(userName)}</span>
          )}
        </div>
        <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full cursor-pointer transition-colors shadow-lg">
          <Camera className="w-5 h-5" />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            aria-label="Upload profile photo"
          />
        </label>
      </div>

      {/* Name */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 text-center mb-3">
        {userName}
      </h1>

      {/* Stream and Year Tags */}
      <div className="flex flex-wrap gap-3 justify-center">
        {stream && (
          <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
            {stream}
          </span>
        )}
        {yearOfStudy && (
          <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
            {yearOfStudy}
          </span>
        )}
      </div>
    </div>
  );
}
