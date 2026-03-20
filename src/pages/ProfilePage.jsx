import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Lock, Upload, FileText, X, Mail, ArrowLeft } from 'lucide-react';
import TopBar from '../components/dashboard/TopBar';
import Toast from '../components/Toast';
import Sidebar from '../components/dashboard/Sidebar';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    collegeName: '',
    branch: '',
    yearOfStudy: '',
    linkedIn: '',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeDate, setResumeDate] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('prepway_user');
    if (!savedUser) {
      navigate('/');
    } else {
      const user = JSON.parse(savedUser);
      setUserName(user.name || 'User');
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        collegeName: user.collegeName || '',
        branch: user.branch || '',
        yearOfStudy: user.year || '',
        linkedIn: user.linkedIn || '',
      }));

      const profileData = localStorage.getItem('prepway_profile');
      if (profileData) {
        const profile = JSON.parse(profileData);
        if (profile.profilePhoto) setPhotoPreview(profile.profilePhoto);
        if (profile.resumeFile) setResumeFile(profile.resumeFile);
        if (profile.resumeDate) setResumeDate(profile.resumeDate);
        if (profile.skills) setSkills(profile.skills);
      }
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      setResumeFile(file);
      setResumeDate(today);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (trimmed && !skills.includes(trimmed)) {
        setSkills([...skills, trimmed]);
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setResumeDate('');
    resumeInputRef.current.value = '';
  };

  const handleSaveProfile = () => {
    const profileData = {
      profilePhoto: photoPreview,
      resumeFile: resumeFile?.name || null,
      resumeDate,
      skills,
      ...formData,
    };

    const savedUser = localStorage.getItem('prepway_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      const updatedUser = {
        ...user,
        name: formData.fullName,
        collegeName: formData.collegeName,
        branch: formData.branch,
        year: formData.yearOfStudy,
        linkedIn: formData.linkedIn,
      };
      localStorage.setItem('prepway_user', JSON.stringify(updatedUser));
    }

    localStorage.setItem('prepway_profile', JSON.stringify(profileData));
    setShowToast(true);
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        {/* Top Bar */}
        <TopBar userName={formData.fullName || userName} onHamburgerClick={() => setSidebarOpen(true)} />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
            {/* Page Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                My Profile
              </h1>
              <p className="text-gray-600 dark:text-slate-400">
                Manage your personal and academic information
              </p>
            </div>

            {/* Card 1: Profile Header */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 mb-6 border border-gray-200 dark:border-slate-700">
              <div className="flex flex-col items-center">
                {/* Profile Photo */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl font-bold text-white">{getInitials(formData.fullName || userName)}</span>
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

                {/* Name and Tags */}
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-slate-100 text-center mb-3">
                  {formData.fullName || userName}
                </h2>
                <div className="flex flex-wrap gap-2 justify-center">
                  {formData.branch && (
                    <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                      {formData.branch}
                    </span>
                  )}
                  {formData.yearOfStudy && (
                    <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                      {formData.yearOfStudy}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2: Academic Information */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 mb-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
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
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
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
                    value={formData.collegeName}
                    onChange={handleInputChange}
                    placeholder="Your college name"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Branch and Year Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                      Branch
                    </label>
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      placeholder="e.g., CSE"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                      Year of Study
                    </label>
                    <select
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      <option value="">Select year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                    Account Email
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 dark:text-slate-500" />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 bg-gray-200 dark:bg-slate-700/50 text-gray-600 dark:text-slate-400 border-2 border-gray-300 dark:border-slate-600 rounded-lg cursor-not-allowed opacity-60"
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-slate-400 mt-2">
                    Account email cannot be changed
                  </p>
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                    LinkedIn Profile (Optional)
                  </label>
                  <input
                    type="url"
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleInputChange}
                    placeholder="linkedin.com/in/yourprofile"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Resume Upload */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 mb-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                Your Resume
              </h2>

              {!resumeFile ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-3" />
                  <p className="text-gray-700 dark:text-slate-300 font-semibold mb-1">
                    Drop your PDF here or click to browse
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                    PDF format, max 5MB
                  </p>
                  <button
                    onClick={() => resumeInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Resume
                  </button>
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-4 mb-4">
                    <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                        {resumeFile.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Uploaded on {resumeDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-slate-700 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors">
                      View Resume
                    </button>
                    <button
                      onClick={() => resumeInputRef.current?.click()}
                      className="px-4 py-2 bg-white dark:bg-slate-700 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      Replace
                    </button>
                    <button
                      onClick={handleRemoveResume}
                      className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-600">
                <p className="text-sm text-gray-700 dark:text-slate-300">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">💡 Tip:</span> We
                  use your resume to generate personalized interview questions and practice scenarios
                  tailored to your experience.
                </p>
              </div>
            </div>

            {/* Card 4: Skills */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 mb-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                Your Skills
              </h2>

              <div>
                <div className="flex flex-wrap gap-2 mb-4 p-4 bg-white dark:bg-slate-700/50 rounded-lg min-h-12 items-center border-2 border-gray-300 dark:border-slate-600">
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

                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleAddSkill}
                    placeholder={skills.length === 0 ? 'Add a skill...' : ''}
                    className="flex-1 min-w-[120px] px-3 py-2 bg-transparent border-none focus:outline-none text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-600">
                <p className="text-sm text-gray-700 dark:text-slate-300">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">💡 Tip:</span> Skills
                  help us personalize your practice sessions and mock tests to focus on areas relevant
                  to your expertise.
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="mb-8">
              <button
                onClick={handleSaveProfile}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <Toast
        message="Profile updated successfully ✓"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

