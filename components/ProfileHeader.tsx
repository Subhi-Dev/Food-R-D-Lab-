import React, { useState, useRef, useEffect } from 'react';
import { Bell, Settings, CheckCircle, AlertTriangle, Info, XCircle, Trash2, Check } from 'lucide-react';
import { useNotifications, Notification } from '../context/NotificationContext';
import { useSettings } from '../context/SettingsContext';
import ProfileSettingsModal from './ProfileSettingsModal';

const ProfileHeader: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const { profile, t } = useSettings();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
      switch(type) {
          case 'success': return <CheckCircle size={16} className="text-green-500" />;
          case 'error': return <XCircle size={16} className="text-red-500" />;
          case 'warning': return <AlertTriangle size={16} className="text-orange-500" />;
          default: return <Info size={16} className="text-blue-500" />;
      }
  };

  const getTimeAgo = (date: Date) => {
      const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / 60000);
      if (diff < 1) return 'Just now';
      if (diff < 60) return `${diff}m ago`;
      const hours = Math.floor(diff / 60);
      if (hours < 24) return `${hours}h ago`;
      return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <>
    <div className="bg-[#FAF5F0] dark:bg-[#1e293b] rounded-[2.5rem] p-8 flex flex-col items-center text-center relative overflow-visible transition-colors isolate">
        
        {/* Header Actions */}
        <div className="flex justify-between w-full mb-6 relative z-20">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
                <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className={`p-2 bg-white dark:bg-slate-700 rounded-full transition-all shadow-sm relative ${
                        isNotifOpen ? 'text-blue-600 ring-2 ring-blue-100' : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 end-0 w-3 h-3 bg-red-500 border-2 border-[#FAF5F0] dark:border-[#1e293b] rounded-full animate-pulse"></span>
                    )}
                </button>

                {/* Notification Dropdown - Logical Positioning (start-0 ensures correct side based on direction) */}
                {isNotifOpen && (
                    <div className="absolute start-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-start text-start">
                        <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-slate-800">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{t('activityFeed')}</h4>
                            <div className="flex gap-2">
                                <button onClick={markAllAsRead} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline" title={t('markAllRead')}>
                                    <Check size={16} />
                                </button>
                                <button onClick={clearNotifications} className="text-xs font-bold text-gray-400 hover:text-red-500" title={t('clearAll')}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 dark:text-slate-500 text-sm">
                                    {t('noNotifications')}
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div 
                                        key={notif.id} 
                                        onClick={() => markAsRead(notif.id)}
                                        className={`p-4 border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                    >
                                        <div className="mt-1 flex-shrink-0">{getIcon(notif.type)}</div>
                                        <div className="text-start">
                                            <p className={`text-sm ${!notif.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-600 dark:text-slate-400'}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5 leading-relaxed">
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 dark:text-slate-600 mt-2 font-mono">
                                                {getTimeAgo(notif.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Profile Settings Gear */}
            <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="p-2 bg-white dark:bg-slate-700 rounded-full text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white shadow-sm transition-transform hover:rotate-90"
            >
                <Settings size={20} />
            </button>
        </div>
        
        {/* Profile Identity */}
        <div className="w-24 h-24 rounded-full p-1 bg-white dark:bg-slate-600 shadow-md mb-4 relative z-10 group cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
            <img 
                src={profile.avatarUrl} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                Edit
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 relative z-10">{profile.name}</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mb-6 relative z-10">{profile.title}</p>
        
        <ProfileSettingsModal 
            isOpen={isProfileModalOpen} 
            onClose={() => setIsProfileModalOpen(false)} 
        />
    </div>
    </>
  );
};

export default ProfileHeader;