import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreHorizontal, 
  Eye, 
  Download, 
  CheckCircle, 
  Clock, 
  Archive
} from 'lucide-react';
import { LabReport } from '../types';
import { useSettings } from '../context/SettingsContext';

interface ReportsDropdownProps {
  report: LabReport;
  onAction?: (action: string, report: LabReport) => void;
}

const ReportsDropdown: React.FC<ReportsDropdownProps> = ({ report, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isRTL } = useSettings();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleAction = (action: string) => {
    setIsOpen(false);
    if (onAction) {
        onAction(action, report);
    }
  };

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
        }}
        className={`p-2 rounded-full transition-colors ${
            isOpen 
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
            : 'text-gray-400 hover:text-gray-900 dark:text-slate-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800'
        }`}
      >
        <MoreHorizontal size={20} />
      </button>

      {isOpen && (
        <div 
            className={`absolute top-full mt-2 w-60 p-2 rounded-2xl bg-white/90 dark:bg-[#1e293b]/95 backdrop-blur-xl border border-gray-100 dark:border-slate-700 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-black/50 z-[100] ${isRTL ? 'left-0 origin-top-left' : 'right-0 origin-top-right'} animate-in fade-in zoom-in-95 duration-200`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex flex-col gap-1">
                <button 
                    onClick={() => handleAction('view')}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 rounded-xl transition-colors text-start group"
                >
                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                        <Eye size={16} />
                    </div>
                    <span>View Full Report</span>
                </button>
                
                <button 
                    onClick={() => handleAction('export')}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-start group"
                >
                    <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-700 transition-colors">
                        <Download size={16} />
                    </div>
                    <span>Export PDF</span>
                </button>
                
                <div className="h-px bg-gray-100 dark:bg-slate-700/50 my-1 mx-2" />

                <button 
                    onClick={() => handleAction('toggle_status')}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-start group"
                >
                    {report.status === 'Approved' ? (
                        <>
                             <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-500 dark:text-orange-400 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 transition-colors">
                                <Clock size={16} />
                            </div>
                            <span>Mark Pending</span>
                        </>
                    ) : (
                        <>
                            <div className="p-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-500 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-500/20 transition-colors">
                                <CheckCircle size={16} />
                            </div>
                            <span>Approve Report</span>
                        </>
                    )}
                </button>
                
                <button 
                    onClick={() => handleAction('archive')}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-start group"
                >
                    <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors">
                        <Archive size={16} />
                    </div>
                    <span>Archive</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ReportsDropdown;