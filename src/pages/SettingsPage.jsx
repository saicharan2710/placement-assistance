import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Globe, Lock, ChevronRight, Trash2, X, ArrowLeft } from 'lucide-react';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('settings');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');

  // Notification states
  const [notificationSettings, setNotificationSettings] = useState({
    practiceReminders: true,
    sessionFeedback: true,
    placementTips: false,
  });

  // Privacy states
  const [privacySettings, setPrivacySettings] = useState({
    resumeData: true,
    usageAnalytics: true,
  });

  // UI states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('prepway_user');
    if (!savedUser) {
      navigate('/');
    } else {
      const user = JSON.parse(savedUser);
      setUserName(user.name || 'User');
      setUserEmail(user.email || '');
    }

    // Load saved settings
    const savedSettings = localStorage.getItem('prepway_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.notifications) setNotificationSettings(settings.notifications);
      if (settings.privacy) setPrivacySettings(settings.privacy);
    }
  }, [navigate]);

  const saveSettings = () => {
    const settings = {
      notifications: notificationSettings,
      privacy: privacySettings,
    };
    localStorage.setItem('prepway_settings', JSON.stringify(settings));
  };

  const handleNotificationToggle = (key) => {
    const updated = {
      ...notificationSettings,
      [key]: !notificationSettings[key],
    };
    setNotificationSettings(updated);
    localStorage.setItem('prepway_settings', JSON.stringify({
      notifications: updated,
      privacy: privacySettings,
    }));
  };

  const handlePrivacyToggle = (key) => {
    const updated = {
      ...privacySettings,
      [key]: !privacySettings[key],
    };
    setPrivacySettings(updated);
    localStorage.setItem('prepway_settings', JSON.stringify({
      notifications: notificationSettings,
      privacy: updated,
    }));
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('prepway_user');
    localStorage.removeItem('prepway_settings');
    localStorage.removeItem('prepway_profile');
    localStorage.removeItem('prepway_theme');
    navigate('/');
  };

  const SettingsRow = ({ icon: Icon, label, description, children }) => (
    <div className="py-4 flex items-start justify-between border-b border-gray-200 dark:border-slate-700 last:border-0">
      <div className="flex items-start gap-3 flex-1">
        {Icon && <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />}
        <div>
          <p className="font-semibold text-gray-900 dark:text-slate-100">{label}</p>
          {description && <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
        checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'
      }`}
    >
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
          checked ? 'translate-x-6' : ''
        }`}
      />
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        <TopBar userName={userName} onHamburgerClick={() => setSidebarOpen(true)} />

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
                Settings
              </h1>
              <p className="text-gray-600 dark:text-slate-400">
                Manage your account and preferences
              </p>
            </div>

            {/* Card 1: Appearance */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Appearance</h2>
              
              <SettingsRow 
                icon={isDark ? Moon : Sun}
                label="Dark Mode"
                description="Switch between light and dark theme"
              >
                <Toggle checked={isDark} onChange={toggleTheme} />
              </SettingsRow>

              <SettingsRow 
                icon={Globe}
                label="Language"
                description="Choose your preferred language"
              >
                <select className="px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-slate-100 text-sm">
                  <option>English</option>
                </select>
              </SettingsRow>
            </div>

            {/* Card 2: Notifications */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Notifications</h2>
              
              <SettingsRow 
                label="Practice Reminders"
                description="Get reminded to practice daily"
              >
                <Toggle 
                  checked={notificationSettings.practiceReminders}
                  onChange={() => handleNotificationToggle('practiceReminders')}
                />
              </SettingsRow>

              <SettingsRow 
                label="Session Feedback"
                description="Notify when AI feedback is ready"
              >
                <Toggle 
                  checked={notificationSettings.sessionFeedback}
                  onChange={() => handleNotificationToggle('sessionFeedback')}
                />
              </SettingsRow>

              <SettingsRow 
                label="Placement Tips"
                description="Weekly tips and preparation advice"
              >
                <Toggle 
                  checked={notificationSettings.placementTips}
                  onChange={() => handleNotificationToggle('placementTips')}
                />
              </SettingsRow>
            </div>

            {/* Card 3: Account */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Account</h2>
              
              <SettingsRow 
                icon={Lock}
                label="Email Address"
                description={userEmail}
              />

              <SettingsRow 
                label="Change Password"
              >
                <button 
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </SettingsRow>

              {showPasswordForm && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg space-y-4">
                  <input
                    type="password"
                    placeholder="Current password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400"
                  />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400"
                  />
                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                      Save
                    </button>
                    <button 
                      onClick={() => setShowPasswordForm(false)}
                      className="flex-1 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 text-gray-900 dark:text-slate-100 font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <SettingsRow 
                label="Connected Accounts"
                description="Not connected"
              />
            </div>

            {/* Card 4: Privacy & Data */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Privacy & Data</h2>
              
              <SettingsRow 
                label="Resume Data"
                description="Your resume is used only for generating interview questions"
              >
                <Toggle 
                  checked={privacySettings.resumeData}
                  onChange={() => handlePrivacyToggle('resumeData')}
                />
              </SettingsRow>

              <SettingsRow 
                label="Usage Analytics"
                description="Help us improve by sharing anonymous usage data"
              >
                <Toggle 
                  checked={privacySettings.usageAnalytics}
                  onChange={() => handlePrivacyToggle('usageAnalytics')}
                />
              </SettingsRow>

              <SettingsRow 
                label="Delete Account"
                description="Permanently delete all your data"
              >
                <button 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold"
                >
                  Delete
                </button>
              </SettingsRow>
            </div>

            {/* Card 5: About */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">About</h2>
              
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">PrepWay</p>
                <p className="text-gray-600 dark:text-slate-400">Version 1.0.0</p>
              </div>

              <SettingsRow label="Terms of Service">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </SettingsRow>

              <SettingsRow label="Privacy Policy">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </SettingsRow>

              <SettingsRow label="Contact Support">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </SettingsRow>
            </div>

            <div className="h-12 md:h-0"></div>
          </div>
        </div>
      </main>

      {/* Delete Account Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 max-w-sm w-full border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">Delete Account</h3>
              <button 
                onClick={() => setShowDeleteDialog(false)}
                className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              Are you sure? This will delete all your data permanently.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-slate-100 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
