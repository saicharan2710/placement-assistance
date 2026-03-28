import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import PracticePage from './pages/PracticePage';
import AptitudeOverviewPage from './pages/AptitudeOverviewPage';
import GDOverviewPage from './pages/GDOverviewPage';
import InterviewOverviewPage from './pages/InterviewOverviewPage';
import ResumeReviewPage from './pages/ResumeReviewPage';
import DailyDrivePage from './pages/DailyDrivePage';
import TechnicalAssessmentPage from './pages/TechnicalAssessmentPage';
import AptitudeHistoryPage from './pages/AptitudeHistoryPage';
import GDHistoryPage from './pages/GDHistoryPage';
import InterviewHistoryPage from './pages/InterviewHistoryPage';
import AptitudePracticePage from './pages/AptitudePracticePage';
import GDPracticePage from './pages/GDPracticePage';
import MockInterviewPage from './pages/MockInterviewPage';
import ResumeReviewPracticePage from './pages/ResumeReviewPracticePage';
import CompaniesPage from './pages/hiring/CompaniesPage';
import JobsPage from './pages/hiring/JobsPage';
import TrackerPage from './pages/hiring/TrackerPage';
import HiringResumesPage from './pages/hiring/HiringResumesPage';
import NoticePage from './pages/hiring/NoticePage';
import HiringCalendarPage from './pages/hiring/HiringCalendarPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/practice/aptitude" element={<AptitudePracticePage />} />
        <Route path="/practice/gd" element={<GDPracticePage />} />
        <Route path="/practice/interview" element={<MockInterviewPage />} />
        <Route path="/practice/resume-review" element={<ResumeReviewPracticePage />} />
        <Route path="/aptitude" element={<AptitudeOverviewPage />} />
        <Route path="/gd" element={<GDOverviewPage />} />
        <Route path="/interview" element={<InterviewOverviewPage />} />
        <Route path="/resume-review" element={<ResumeReviewPage />} />
        <Route path="/daily-drive" element={<DailyDrivePage />} />
        <Route path="/technical-assessment" element={<TechnicalAssessmentPage />} />
        <Route path="/practice/aptitude/history" element={<AptitudeHistoryPage />} />
        <Route path="/practice/gd/history" element={<GDHistoryPage />} />
        <Route path="/practice/interview/history" element={<InterviewHistoryPage />} />

        <Route path="/hiring" element={<ProtectedRoute><Navigate to="/hiring/companies" replace /></ProtectedRoute>} />
        <Route path="/hiring/companies" element={<ProtectedRoute><CompaniesPage /></ProtectedRoute>} />
        <Route path="/hiring/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
        <Route path="/hiring/tracker" element={<ProtectedRoute><TrackerPage /></ProtectedRoute>} />
        <Route path="/hiring/resumes" element={<ProtectedRoute><HiringResumesPage /></ProtectedRoute>} />
        <Route path="/hiring/notice" element={<ProtectedRoute><NoticePage /></ProtectedRoute>} />
        <Route path="/hiring/calendar" element={<ProtectedRoute><HiringCalendarPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
