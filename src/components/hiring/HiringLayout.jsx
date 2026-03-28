import React, { useEffect, useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import TopBar from '../dashboard/TopBar';
import HiringSubNav from './HiringSubNav';

export default function HiringLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const savedUser = localStorage.getItem('prepway_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserName(user.name || 'User');
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-[#000000] overflow-x-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab="hiring"
        setActiveTab={() => {}}
      />

      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        <TopBar userName={userName} onHamburgerClick={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto">
          <HiringSubNav />
          <div className="px-4 lg:px-6 py-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
