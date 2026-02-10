import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Calendar, 
  Settings,
  FlaskConical,
  PlayCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

interface SidebarProps {
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onOpenSettings }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t, isRTL } = useSettings();

  const navItems = [
    { name: t('dashboard'), icon: LayoutDashboard, path: '/' },
    { name: t('runs'), icon: PlayCircle, path: '/runs' },
    { name: t('inventory'), icon: Package, path: '/inventory' },
    { name: t('reports'), icon: FileText, path: '/reports' },
    { name: t('schedule'), icon: Calendar, path: '/schedule' },
  ];

  const isActivePath = (path: string) => 
    currentPath === path || (path !== '/' && currentPath.startsWith(path));

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Hidden on Mobile) --- */}
      {/* 
          fixed start-6: Positions 1.5rem from the 'start' edge.
          LTR: Left side. RTL: Right side.
      */}
      <aside className="hidden md:flex fixed start-6 top-6 bottom-6 w-20 bg-white dark:bg-[#1e293b] rounded-[2.5rem] flex-col items-center py-8 z-30 shadow-sm border border-gray-100/50 dark:border-slate-700 transition-all duration-300">
        {/* Logo */}
        <div className="mb-10 w-10 h-10 bg-gray-900 dark:bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-900/20 dark:shadow-indigo-500/20">
          <FlaskConical size={20} strokeWidth={2.5} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-6 w-full px-4">
          {navItems.map((item) => {
            const active = isActivePath(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center transition-all duration-300 group relative ${
                  active 
                    ? 'bg-black dark:bg-indigo-600 text-white shadow-lg shadow-black/20 dark:shadow-indigo-600/30 scale-105' 
                    : 'text-gray-400 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-600 dark:hover:text-slate-200'
                }`}
              >
                <item.icon size={22} strokeWidth={active ? 2.5 : 2} className={isRTL ? 'transform -scale-x-100' : ''} />
                
                {/* Tooltip: 'start-full' pushes it outside the sidebar, 'ms-4' adds margin start */}
                <span className="absolute start-full ms-4 bg-gray-900 dark:bg-slate-800 text-white text-xs font-medium px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl border dark:border-slate-700">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="mt-auto px-4">
          <button 
             onClick={onOpenSettings}
             className="w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-gray-400 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-200 transition-all duration-300"
          >
            <Settings size={22} strokeWidth={2} />
          </button>
        </div>
      </aside>

      {/* --- MOBILE BOTTOM NAVIGATION (Hidden on Desktop) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-[#1e293b] border-t border-gray-100 dark:border-slate-700 z-50 flex justify-around items-center px-4 pb-2 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
         {navItems.map((item) => {
            const active = isActivePath(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                    active ? 'text-gray-900 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-500'
                }`}
              >
                <item.icon size={24} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
         })}
         <button 
            onClick={onOpenSettings}
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-400 dark:text-slate-500"
         >
            <Settings size={24} />
            <span className="text-[10px] font-medium">{t('settings')}</span>
         </button>
      </nav>
    </>
  );
};

export default Sidebar;