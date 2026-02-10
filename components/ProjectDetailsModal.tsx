import React, { useState } from 'react';
import { X, Thermometer, Clock, ArrowRight, Beaker, FileText, CheckCircle, AlertCircle, Edit3, Activity, Target, Zap, Droplet, FlaskConical } from 'lucide-react';
import { Project } from '../types';
import { STATUS_COLORS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import EditProjectModal from './EditProjectModal';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onUpdateProject?: (project: Project) => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ isOpen, onClose, project, onUpdateProject }) => {
  const navigate = useNavigate();
  const { formatTemp } = useSettings();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isOpen || !project) return null;

  const handleEditIngredients = () => {
    navigate(`/project/${project.id}`);
  };

  const handleSaveEdit = (updated: Project) => {
    if (onUpdateProject) {
        onUpdateProject(updated);
    }
    // The parent Dashboard handles the state update, which flows back down to 'project' prop here
    setIsEditModalOpen(false);
  };

  // Status Badge Logic to match Soft UI
  const getStatusStyle = (status: string) => {
    switch(status) {
        case 'Approved': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300';
        case 'Testing': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300';
        case 'Prototype': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300';
        case 'Review': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300';
        default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/20 dark:bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content - Bento Grid Container - Responsive Width */}
      <div className="relative bg-[#FDFCF6] dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl w-full md:w-[95%] lg:w-[70%] max-h-[90vh] overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/50 dark:border-slate-800 scrollbar-hide">
        
        {/* Floating Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-[#1e293b]/50 backdrop-blur-sm hover:bg-white dark:hover:bg-[#1e293b] rounded-full text-gray-500 dark:text-slate-400 transition-colors z-50"
        >
            <X size={24} />
        </button>

        <div className="p-6 md:p-8 space-y-6">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(project.status)}`}>
                            {project.status}
                        </span>
                        <span className="text-sm font-medium text-gray-400 dark:text-slate-500">v{project.version}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">{project.name}</h2>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-[#1e293b] text-gray-900 dark:text-slate-100 rounded-[1.5rem] font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Edit3 size={18} />
                        Edit Meta
                    </button>
                    <button 
                        onClick={handleEditIngredients}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-indigo-600 text-white rounded-[1.5rem] font-bold shadow-lg hover:scale-105 transition-transform"
                    >
                        <FlaskConical size={18} />
                        Formulation
                    </button>
                </div>
            </div>

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Description & Core Info (Col Span 2) */}
                <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">Project Overview</h3>
                        <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-lg mb-6">
                            {project.description || "No description provided for this project."}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <div className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 rounded-2xl flex items-center gap-2">
                                <span className="text-xs font-bold uppercase text-gray-400 dark:text-slate-500">Category</span>
                                <span className="font-semibold text-gray-900 dark:text-slate-100">{project.category || 'General'}</span>
                            </div>
                            <div className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 rounded-2xl flex items-center gap-2">
                                <span className="text-xs font-bold uppercase text-gray-400 dark:text-slate-500">Lead</span>
                                <span className="font-semibold text-gray-900 dark:text-slate-100">{project.lead}</span>
                            </div>
                        </div>
                    </div>
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 dark:bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-gray-100 dark:group-hover:bg-white/10 transition-colors"></div>
                </div>

                {/* 2. Processing Parameters (Col Span 1) */}
                <div className="bg-[#E0F2FE] dark:bg-sky-900/20 rounded-[2.5rem] p-8 flex flex-col justify-between border border-sky-100 dark:border-sky-800/30">
                    <div>
                        <div className="w-12 h-12 bg-white/60 dark:bg-sky-500/20 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-300 mb-4 shadow-sm">
                            <Thermometer size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-sky-900 dark:text-sky-100 mb-1">Processing</h3>
                        <p className="text-sky-700/70 dark:text-sky-200/60 text-sm">{project.processingMethod || 'Standard'}</p>
                    </div>
                    <div className="space-y-3 mt-6">
                        <div className="flex justify-between items-center bg-white/40 dark:bg-sky-950/40 p-3 rounded-2xl">
                            <span className="text-xs font-bold text-sky-800 dark:text-sky-200 uppercase">Temp</span>
                            <span className="text-xl font-bold text-sky-900 dark:text-slate-100">{project.processingTemp ? formatTemp(project.processingTemp) : '--'}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/40 dark:bg-sky-950/40 p-3 rounded-2xl">
                            <span className="text-xs font-bold text-sky-800 dark:text-sky-200 uppercase">Time</span>
                            <span className="text-xl font-bold text-sky-900 dark:text-slate-100">{project.processingTime || '--'}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Nutrition & Targets (Col Span 1) */}
                <div className="bg-[#FEF3C7] dark:bg-amber-900/20 rounded-[2.5rem] p-8 border border-amber-100 dark:border-amber-800/30">
                    <div className="w-12 h-12 bg-white/60 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-300 mb-4 shadow-sm">
                        <Activity size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-4">Nutritional Goals</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold text-amber-800 dark:text-amber-200 mb-1">
                                <span>Protein Target</span>
                                <span>85%</span>
                            </div>
                            <div className="w-full bg-white/40 dark:bg-amber-950/40 rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full w-[85%]"></div>
                            </div>
                        </div>
                        <div>
                             <div className="flex justify-between text-xs font-bold text-amber-800 dark:text-amber-200 mb-1">
                                <span>Fat Reduction</span>
                                <span>60%</span>
                            </div>
                             <div className="w-full bg-white/40 dark:bg-amber-950/40 rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full w-[60%]"></div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-white/40 dark:bg-amber-950/40 rounded-2xl">
                            <p className="text-xs text-amber-800 dark:text-amber-200 font-medium leading-tight">
                                Goal: {project.nutritionalGoal || 'Balanced Profile'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4. Target Outcome / Texture (Col Span 1) */}
                <div className="bg-[#F3E8FF] dark:bg-purple-900/20 rounded-[2.5rem] p-8 border border-purple-100 dark:border-purple-800/30 flex flex-col">
                    <div className="w-12 h-12 bg-white/60 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-300 mb-4 shadow-sm">
                        <Target size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-2">Target Outcome</h3>
                    <div className="flex-1 flex flex-col justify-end">
                        <p className="text-purple-800 dark:text-purple-200 font-medium text-lg leading-snug">
                            {project.targetOutcome || 'Specific texture and viscosity targets.'}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white/50 dark:bg-purple-950/40 rounded-lg text-xs font-bold text-purple-700 dark:text-purple-300">
                                {project.targetTexture || 'Standard Texture'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 5. Ingredients List (Col Span 1) */}
                 <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                            <Droplet size={20} className="text-blue-500"/>
                            Ingredients
                        </h3>
                        <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-2 py-1 rounded-lg text-xs font-bold">
                            {project.ingredients.length} Items
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[200px] scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
                        {project.ingredients.map((ing, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-900/50 rounded-2xl">
                                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{ing.name}</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-slate-100">{ing.weight}g</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. Recent Lab Results (Col Span 3, responsive) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                            <Beaker size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">Recent Lab Observations</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {project.recentLabResults && project.recentLabResults.length > 0 ? (
                            project.recentLabResults.map((res, idx) => (
                                <div key={idx} className="group bg-gray-50 dark:bg-slate-900/50 p-5 rounded-[2rem] hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg dark:hover:shadow-black/20 hover:border-transparent border border-gray-100 dark:border-slate-700 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold uppercase text-gray-400 dark:text-slate-500 tracking-wider">Parameter</span>
                                        {res.status === 'pass' && <CheckCircle size={18} className="text-green-500" />}
                                        {res.status === 'fail' && <AlertCircle size={18} className="text-red-500" />}
                                        {res.status === 'pending' && <Activity size={18} className="text-orange-500" />}
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">{res.parameter}</h4>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{res.value}</p>
                                    <div className={`mt-3 inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                                        res.status === 'pass' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                        res.status === 'fail' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                    }`}>
                                        {res.status}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="md:col-span-3 py-8 text-center bg-gray-50 dark:bg-slate-800 rounded-[2rem] border border-dashed border-gray-200 dark:border-slate-700">
                                <p className="text-gray-400 dark:text-slate-500 font-medium">No lab results logged yet.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
    
    <EditProjectModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onSave={handleSaveEdit}
    />
    </>
  );
};

export default ProjectDetailsModal;