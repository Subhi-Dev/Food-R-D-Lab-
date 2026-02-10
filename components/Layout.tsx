import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SettingsModal from './SettingsModal';
import { useSettings } from '../context/SettingsContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isRTL } = useSettings();

  return (
    <div className={`min-h-screen bg-[#FDFCF6] dark:bg-[#0f172a] font-sans transition-colors duration-300 ${isRTL ? 'font-tajawal' : 'font-inter'}`}>
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      
      {/* Main Content Wrapper */}
      {/* 
          md:ms-32: Adds margin-start (7rem) to clear the sidebar (w-20 + start-6). 
          Mirroring handles RTL automatically.
          pb-28: Adds bottom padding for mobile nav.
          md:pb-6: Reduces padding on desktop.
      */}
      <main className="flex-1 p-4 pb-28 md:p-6 md:pb-6 md:ms-32 min-h-screen text-gray-900 dark:text-slate-100 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default Layout;