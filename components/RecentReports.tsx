import React, { useState } from 'react';
import { MoreHorizontal, FlaskConical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_LAB_REPORTS } from '../constants';
import { useSettings } from '../context/SettingsContext';
import { LabReport } from '../types';
import ReportsDropdown from './ReportsDropdown';

const RecentReports: React.FC = () => {
  const { t } = useSettings();
  const navigate = useNavigate();
  // Using local state to allow UI updates for the actions (e.g. Approve/Pending)
  const [reports, setReports] = useState<LabReport[]>(MOCK_LAB_REPORTS.slice(0, 3));

  const handleAction = (action: string, report: LabReport) => {
    switch (action) {
      case 'view':
        // Link to the full formulation page
        navigate(`/project/${report.projectId}`);
        break;
      case 'export':
        // Mock export functionality
        console.log(`Generating PDF summary for report: ${report.id}`);
        break;
      case 'toggle_status':
        // Toggle status logic for visual feedback
        setReports(prev => prev.map(r => 
          r.id === report.id 
          ? { ...r, status: r.status === 'Approved' ? 'Pending' : 'Approved' } 
          : r
        ));
        break;
      case 'archive':
        // Visual removal from the list
        setReports(prev => prev.filter(r => r.id !== report.id));
        break;
      default:
        break;
    }
  };

  return (
     <div className="bg-[#FFE4E1]/30 dark:bg-rose-900/10 rounded-[2.5rem] p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 dark:text-slate-100">{t('recentReports')}</h3>
            <button className="w-8 h-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <MoreHorizontal size={16} />
            </button>
        </div>
        <div className="space-y-4">
            {reports.map((report, i) => (
                <div 
                    key={report.id} 
                    className="relative group flex items-center gap-4 bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-sm hover:scale-[1.02] transition-all duration-300 hover:z-20 cursor-pointer"
                >
                    <div 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            i % 2 === 0 
                                ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300' 
                                : 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300'
                        }`}
                        onClick={() => navigate(`/project/${report.projectId}`)}
                    >
                        <FlaskConical size={20} />
                    </div>
                    
                    <div 
                        className="flex-1 min-w-0 text-start"
                        onClick={() => navigate(`/project/${report.projectId}`)}
                    >
                        <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {report.projectName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                             <span className={`w-1.5 h-1.5 rounded-full ${
                                 report.status === 'Approved' ? 'bg-green-500' :
                                 report.status === 'Failed' ? 'bg-red-500' : 'bg-orange-500'
                             }`} />
                             <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                                {report.status} • {report.results[0]?.parameter}
                             </p>
                        </div>
                    </div>
                    
                    {/* Z-index 30 ensures menu is above other content in the card */}
                    <div className="relative z-30">
                        <ReportsDropdown report={report} onAction={handleAction} />
                    </div>
                </div>
            ))}
        </div>
     </div>
  );
};

export default RecentReports;