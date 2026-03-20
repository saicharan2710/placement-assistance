// Progress Tracker Utility Functions

const PROGRESS_KEY = 'prepway_progress';

const defaultProgress = {
  aptitude: {
    sessions: [],
    highScore: 0,
    averageScore: 0,
    totalSessions: 0,
    lastAttempted: null,
  },
  gd: {
    sessions: [],
    highScore: 0,
    averageScore: 0,
    totalSessions: 0,
    lastAttempted: null,
  },
  interview: {
    sessions: [],
    highScore: 0,
    averageScore: 0,
    totalSessions: 0,
    lastAttempted: null,
  },
  overall: {
    readinessScore: 0,
    streak: 0,
    totalSessions: 0,
  },
};

export const initializeProgress = () => {
  const existing = localStorage.getItem(PROGRESS_KEY);
  if (!existing) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(defaultProgress));
  }
};

export const getAllProgress = () => {
  const data = localStorage.getItem(PROGRESS_KEY);
  return data ? JSON.parse(data) : defaultProgress;
};

export const getProgress = (type) => {
  const progress = getAllProgress();
  return progress[type] || defaultProgress[type];
};

export const saveSession = (type, sessionData) => {
  const progress = getAllProgress();
  
  if (!progress[type]) {
    progress[type] = defaultProgress[type];
  }

  // Add unique ID and date to session
  const newSession = {
    ...sessionData,
    id: `${type}_${Date.now()}`,
    date: new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  };

  progress[type].sessions.push(newSession);
  progress[type].totalSessions = progress[type].sessions.length;
  progress[type].lastAttempted = newSession.date;

  // Update high score
  if (sessionData.percentage > progress[type].highScore) {
    progress[type].highScore = sessionData.percentage;
  }

  // Calculate average score
  const sum = progress[type].sessions.reduce((acc, session) => acc + session.percentage, 0);
  progress[type].averageScore = Math.round(sum / progress[type].sessions.length);

  // Update overall progress
  updateReadinessScore(progress);

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  return newSession;
};

export const getHighScore = (type) => {
  const progress = getProgress(type);
  return progress.highScore || 0;
};

export const getAverageScore = (type) => {
  const progress = getProgress(type);
  return progress.averageScore || 0;
};

export const getTotalSessions = (type) => {
  const progress = getProgress(type);
  return progress.totalSessions || 0;
};

export const getSessionHistory = (type) => {
  const progress = getProgress(type);
  return progress.sessions || [];
};

export const updateReadinessScore = (progressData = null) => {
  const progress = progressData || getAllProgress();

  // Calculate readiness score based on all available scores
  const scores = [];
  
  if (progress.aptitude.averageScore > 0) scores.push(progress.aptitude.averageScore);
  if (progress.gd.averageScore > 0) scores.push(progress.gd.averageScore);
  if (progress.interview.averageScore > 0) scores.push(progress.interview.averageScore);

  if (scores.length === 0) {
    progress.overall.readinessScore = 42; // Default starter score
  } else {
    // Weight the scores (default each equally 1/3)
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    progress.overall.readinessScore = Math.min(100, Math.max(42, avgScore));
  }

  progress.overall.totalSessions = 
    progress.aptitude.totalSessions + 
    progress.gd.totalSessions + 
    progress.interview.totalSessions;

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  return progress.overall;
};

export const getReadinessScore = () => {
  const progress = getAllProgress();
  return progress.overall.readinessScore || 42;
};

export const getTotalSessionsOverall = () => {
  const progress = getAllProgress();
  return progress.overall.totalSessions || 0;
};

export const getAverageScoreOverall = () => {
  const progress = getAllProgress();
  const averages = [
    progress.aptitude.averageScore,
    progress.gd.averageScore,
    progress.interview.averageScore,
  ].filter(score => score > 0);

  if (averages.length === 0) return 0;
  return Math.round(averages.reduce((a, b) => a + b, 0) / averages.length);
};

export const getSession = (type, sessionId) => {
  const sessions = getSessionHistory(type);
  return sessions.find(session => session.id === sessionId);
};

export const clearAllProgress = () => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(defaultProgress));
};
