import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// Guard optional Performance APIs used by some animation/tooling internals.
if (typeof window !== 'undefined' && window.performance) {
  if (typeof window.performance.clearMarks !== 'function') {
    window.performance.clearMarks = () => {};
  }
  if (typeof window.performance.clearMeasures !== 'function') {
    window.performance.clearMeasures = () => {};
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
