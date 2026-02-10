import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Languages, FileSignature, Save, Upload, ShieldCheck } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, language, setLanguage, t, isRTL } = useSettings();
  const [activeTab, setActiveTab] = useState<'identity' | 'signature' | 'app'>('identity');
  
  // Local state for form handling before save
  const [localProfile, setLocalProfile] = useState(profile);
  const [localLanguage, setLocalLanguage] = useState(language);

  // Sync local state when modal opens
  useEffect(() => {
    if (isOpen) {
        setLocalProfile(profile);
        setLocalLanguage(language);
    }
  }, [isOpen, profile, language]);

  if (!isOpen) return null;

  const handleSave = () => {
    updateProfile(localProfile);
    setLanguage(localLanguage);
    onClose();
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full ${
        activeTab === id
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'
          : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
      }`}
    >
      <Icon size={18} className={isRTL ? 'ml-0' : ''} />
      {label}
    </button>
  );

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/30 dark:bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative z-[1000] bg-[#FDFCF6] dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/50 dark:border-slate-700">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 dark:border-slate-800">
          <div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings')}</h2>
             <p className="text-sm text-gray-500 dark:text-slate-400">Manage your lab credentials and preferences</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-[500px]">
          {/* Sidebar */}
          <div className="w-full md:w-64 border-r border-gray-100 dark:border-slate-800 p-6 bg-white dark:bg-[#0f172a]">
             <div className="space-y-2">
                <TabButton id="identity" label="Identity" icon={User} />
                <TabButton id="signature" label="Digital Signature" icon={FileSignature} />
                <TabButton id="app" label="Localization" icon={Languages} />
             </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8 overflow-y-auto bg-gray-50/50 dark:bg-[#1e293b]/50">
            
            {/* Identity Tab */}
            {activeTab === 'identity' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                     <img src={localProfile.avatarUrl} className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-700 shadow-md" alt="Profile" />
                     <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white shadow-lg hover:scale-110 transition-transform">
                        <Upload size={14} />
                     </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{localProfile.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{localProfile.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-slate-400 mb-2">Full Name</label>
                    <input 
                      value={localProfile.name}
                      onChange={(e) => setLocalProfile({...localProfile, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-slate-400 mb-2">Job Title</label>
                    <input 
                      value={localProfile.title}
                      onChange={(e) => setLocalProfile({...localProfile, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-slate-400 mb-2">Email Address</label>
                    <input 
                      value={localProfile.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-900 border border-transparent text-gray-500 dark:text-slate-500 cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Signature Tab */}
            {activeTab === 'signature' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-4 flex gap-3">
                   <ShieldCheck className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={24} />
                   <div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">Legally Binding</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">This digital signature will be used to sign off on Lab Reports and QC Audits.</p>
                   </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl h-40 flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                   <FileSignature size={32} className="mb-2" />
                   <span className="font-medium text-sm">Click to upload signature image</span>
                   <span className="text-xs opacity-70">PNG or SVG with transparent background</span>
                </div>
                
                <div className="flex justify-between items-center">
                   <span className="text-sm font-bold text-gray-500 dark:text-slate-400">Current Signature:</span>
                   <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 font-cursive text-xl text-gray-800 dark:text-white italic">
                      {localProfile.name}
                   </div>
                </div>
              </div>
            )}

            {/* App/Localization Tab */}
            {activeTab === 'app' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-slate-400 mb-2">Interface Language</label>
                    <select 
                      value={localLanguage}
                      onChange={(e) => setLocalLanguage(e.target.value as 'en' | 'ar')}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer" 
                    >
                      <option value="en">English (US)</option>
                      <option value="ar">Arabic (العربية)</option>
                    </select>
                 </div>
                 
                 <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Regional Formats</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                        {localLanguage === 'ar' 
                         ? 'تم ضبط التنسيق تلقائيًا (يمين إلى يسار).' 
                         : 'Date and time formats are automatically synced with your browser settings.'}
                    </p>
                 </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="bg-white dark:bg-[#0f172a] p-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
             <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
                Cancel
             </button>
             <button onClick={handleSave} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gray-900 dark:bg-blue-600 text-white shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                <Save size={16} />
                Save Changes
             </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default ProfileSettingsModal;