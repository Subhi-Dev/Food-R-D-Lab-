import React from 'react';
import { createPortal } from 'react-dom';
import { X, Moon, Sun } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { units, setUnits, notifications, toggleNotification, darkMode, toggleDarkMode } = useSettings();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/20 dark:bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative z-[1000] bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/50 dark:border-slate-700/50">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h2>
            <button 
              onClick={onClose} 
              className="p-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-full transition-colors text-gray-500 dark:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Theme Section */}
          <div className="mb-10">
             <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Appearance</h3>
             <div className="flex items-center justify-between group cursor-pointer" onClick={toggleDarkMode}>
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-full ${darkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-orange-100 text-orange-500'}`}>
                        {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                     </div>
                     <span className="text-gray-900 dark:text-gray-100 font-medium">Dark Mode</span>
                  </div>
                  <div 
                    className={`w-14 h-8 rounded-full transition-colors relative duration-300 ${
                      darkMode ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                       darkMode ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </div>
             </div>
          </div>

          {/* Units Section */}
          <div className="mb-10">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Measurement Units</h3>
            <div className="flex bg-gray-50 dark:bg-slate-700 p-1.5 rounded-[1.5rem]">
              <button
                onClick={() => setUnits('metric')}
                className={`flex-1 py-3 px-4 rounded-[1.2rem] text-sm font-semibold transition-all duration-200 ${
                  units === 'metric' 
                    ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-md shadow-gray-200/50 dark:shadow-slate-900/50' 
                    : 'text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                }`}
              >
                Metric (g, °C)
              </button>
              <button
                onClick={() => setUnits('imperial')}
                className={`flex-1 py-3 px-4 rounded-[1.2rem] text-sm font-semibold transition-all duration-200 ${
                  units === 'imperial' 
                     ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-md shadow-gray-200/50 dark:shadow-slate-900/50' 
                    : 'text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                }`}
              >
                Imperial (oz, °F)
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-5">Notifications</h3>
            <div className="space-y-6">
              {[
                { key: 'appAlerts', label: 'App Alerts' },
                { key: 'emailSummaries', label: 'Email Summaries' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between group cursor-pointer" 
                     onClick={() => toggleNotification(item.key as 'appAlerts' | 'emailSummaries')}>
                  <span className="text-gray-900 dark:text-gray-100 font-medium group-hover:text-black dark:group-hover:text-white transition-colors">{item.label}</span>
                  <div 
                    className={`w-14 h-8 rounded-full transition-colors relative duration-300 ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-black dark:bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                       notifications[item.key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SettingsModal;