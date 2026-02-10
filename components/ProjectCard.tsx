import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, MoreHorizontal, Edit3, Copy, Play, Download, Archive, Trash2 } from 'lucide-react';
import { Project } from '../types';
import { useSettings } from '../context/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  onViewDetails?: (project: Project) => void;
  onDuplicate?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onArchive?: (projectId: string) => void;
}

// Pastel Palette
const PASTEL_THEMES = [
  { 
    bg: 'bg-rose-100 dark:bg-rose-900/20', 
    text: 'text-rose-950 dark:text-rose-100', 
    bar: 'bg-rose-500 dark:bg-rose-500', 
    sub: 'text-rose-800 dark:text-rose-200/70',
    border: 'dark:border-rose-800/30'
  },
  { 
    bg: 'bg-violet-100 dark:bg-violet-900/20', 
    text: 'text-violet-950 dark:text-violet-100', 
    bar: 'bg-violet-500 dark:bg-violet-500', 
    sub: 'text-violet-800 dark:text-violet-200/70',
    border: 'dark:border-violet-800/30'
  },
  { 
    bg: 'bg-blue-100 dark:bg-blue-900/20', 
    text: 'text-blue-950 dark:text-blue-100', 
    bar: 'bg-blue-600 dark:bg-blue-500', 
    sub: 'text-blue-800 dark:text-blue-200/70',
    border: 'dark:border-blue-800/30'
  },
  { 
    bg: 'bg-orange-100 dark:bg-orange-900/20', 
    text: 'text-orange-950 dark:text-orange-100', 
    bar: 'bg-orange-500 dark:bg-orange-500', 
    sub: 'text-orange-800 dark:text-orange-200/70',
    border: 'dark:border-orange-800/30'
  },
  { 
    bg: 'bg-emerald-100 dark:bg-emerald-900/20', 
    text: 'text-emerald-950 dark:text-emerald-100', 
    bar: 'bg-emerald-600 dark:bg-emerald-500', 
    sub: 'text-emerald-800 dark:text-emerald-200/70',
    border: 'dark:border-emerald-800/30'
  },
];

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails, onDuplicate, onDelete, onArchive }) => {
  const { t, isRTL } = useSettings();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Deterministic color assignment
  const colorIndex = project.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % PASTEL_THEMES.length;
  const theme = PASTEL_THEMES[colorIndex];

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartRun = () => {
    navigate('/runs');
    setIsMenuOpen(false);
  };

  const handleDuplicate = () => {
    if (onDuplicate) onDuplicate(project);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(project.id);
    setIsMenuOpen(false);
  };

  const handleArchive = () => {
      if(onArchive) onArchive(project.id);
      setIsMenuOpen(false);
  }

  return (
    <div className={`relative h-[280px] group transition-transform hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none`}>
      
      {/* Background & Decor - Lower z-index */}
      <div className={`absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none z-0 ${theme.bg} dark:border ${theme.border || 'dark:border-white/10'}`}>
          {/* Logical placement for blob: 'end-0' puts it on Right in LTR, Left in RTL (roughly) */}
          <div className={`absolute -bottom-10 ${isRTL ? '-left-10' : '-right-10'} w-40 h-40 bg-white/20 dark:bg-white/5 rounded-full blur-2xl`} />
      </div>

      {/* Main Content - z-10 */}
      <div className="relative h-full p-7 flex flex-col justify-between z-10">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className={`px-3 py-1 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wide ${theme.sub}`}>
            {project.category || 'R&D'}
          </div>
          
          {/* Context Menu Trigger */}
          <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors ${theme.text}`}
            >
                <MoreHorizontal size={20} />
            </button>

            {/* Dropdown Menu - Reduced z-index to 30 to stay above card but below Modals (z-50+) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        // 'end-0' ensures alignment with the trigger button correctly in both LTR and RTL
                        // 'origin-top-end' creates the expand effect from the correct corner
                        className="absolute top-10 end-0 origin-top-end w-56 bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-slate-700 p-2 z-30"
                    >
                        <div className="flex flex-col gap-1">
                            <button onClick={() => { onViewDetails && onViewDetails(project); setIsMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors text-start">
                                <Edit3 size={16} /> {t('editProject')}
                            </button>
                            <button onClick={handleDuplicate} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors text-start">
                                <Copy size={16} /> {t('duplicateFormulation')}
                            </button>
                            <button onClick={handleStartRun} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors text-start">
                                <Play size={16} /> {t('startNewRun')}
                            </button>
                            <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors text-start">
                                <Download size={16} /> {t('exportData')}
                            </button>
                            <div className="h-px bg-gray-200 dark:bg-slate-700 my-1 mx-2"></div>
                            <button onClick={handleArchive} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors text-start">
                                <Archive size={16} /> {t('archiveProject')}
                            </button>
                            <button onClick={handleDelete} className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-start">
                                <Trash2 size={16} /> {t('deleteProject')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>

        {/* Card Body */}
        <div className="mt-2">
          <h3 className={`text-2xl font-bold ${theme.text} mb-1 leading-tight line-clamp-2 text-start`}>{project.name}</h3>
          <p className={`text-sm font-medium ${theme.sub} opacity-80 text-start`}>v{project.version} • {project.updatedAt}</p>
        </div>

        {/* Footer */}
        <div className="mt-auto">
          <div className="flex justify-between text-xs font-bold mb-2 opacity-80">
              <span className={theme.text}>{t('progress')}</span>
              <span className={theme.text}>{project.progress}%</span>
          </div>
          <div className="w-full bg-white/40 dark:bg-black/20 rounded-full h-2.5 mb-6 overflow-hidden">
            <div 
              className={`h-full rounded-full ${theme.bar}`} 
              style={{ width: `${project.progress}%` }}
            />
          </div>

          <button 
            onClick={() => onViewDetails ? onViewDetails(project) : null}
            className="w-full py-3.5 bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20 rounded-2xl text-sm font-bold text-gray-900 shadow-sm flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-all active:scale-95"
          >
            {t('viewDetails')}
            <ArrowRight size={16} className={isRTL ? 'transform -scale-x-100' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;