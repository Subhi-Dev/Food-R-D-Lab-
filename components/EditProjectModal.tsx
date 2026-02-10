import React, { useState, useEffect } from 'react';
import { X, Save, Thermometer, Clock, Activity, Target } from 'lucide-react';
import { Project } from '../types';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSave: (updatedProject: Project) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, project, onSave }) => {
  const [formData, setFormData] = useState<Project>(project);

  // Sync with project prop when it changes or modal opens
  useEffect(() => {
    setFormData(project);
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof Project, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  // Styles for Dark Mode Input Fields (Slate 700 bg, Slate 100 text, Slate 600 border)
  const inputClass = "w-full px-4 py-3 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 dark:bg-[#0f172a]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#FDFCF6] dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300 border border-white/50 dark:border-slate-700">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#FDFCF6]/80 dark:bg-[#0f172a]/80 backdrop-blur-md px-8 py-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
             <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Edit Project</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">Update formulation parameters and targets</p>
             </div>
             <button 
                onClick={onClose} 
                className="p-2 bg-gray-100 dark:bg-[#1e293b] rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
                <X size={20} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Tile 1: Basic Info (Span 2) */}
                <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#1e293b] rounded-[2rem] p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        Project Identity
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Project Name</label>
                            <input 
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Version</label>
                            <input 
                                value={formData.version}
                                onChange={(e) => handleInputChange('version', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Description</label>
                            <textarea 
                                rows={2}
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                    </div>
                </div>

                {/* Tile 2: Processing Parameters */}
                <div className="bg-sky-50 dark:bg-sky-900/10 rounded-[2rem] p-6 border border-sky-100 dark:border-sky-800/30 shadow-sm">
                    <h3 className="text-lg font-bold text-sky-900 dark:text-sky-100 mb-4 flex items-center gap-2">
                        <Thermometer size={18} className="text-sky-500"/> Processing
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 mb-2">Method</label>
                            <input 
                                value={formData.processingMethod || ''}
                                onChange={(e) => handleInputChange('processingMethod', e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-xl text-sky-900 dark:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 mb-2">Temp (°C)</label>
                                <input 
                                    type="number"
                                    value={formData.processingTemp || ''}
                                    onChange={(e) => handleInputChange('processingTemp', parseFloat(e.target.value))}
                                    className="w-full px-3 py-3 bg-white dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-xl text-sky-900 dark:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 mb-2">Time</label>
                                <input 
                                    value={formData.processingTime || ''}
                                    onChange={(e) => handleInputChange('processingTime', e.target.value)}
                                    className="w-full px-3 py-3 bg-white dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-xl text-sky-900 dark:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tile 3: Nutrition & Targets */}
                <div className="bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] p-6 border border-amber-100 dark:border-amber-800/30 shadow-sm">
                     <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-amber-500"/> Nutrition Goals
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-2">Nutritional Goal</label>
                            <input 
                                value={formData.nutritionalGoal || ''}
                                onChange={(e) => handleInputChange('nutritionalGoal', e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-2">Category</label>
                            <select
                                value={formData.category || ''}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                <option>Dairy Alternatives</option>
                                <option>Alternative Proteins</option>
                                <option>Beverage</option>
                                <option>Snack</option>
                                <option>Bakery</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tile 4: Target Outcome (Span 2) */}
                <div className="md:col-span-2 bg-purple-50 dark:bg-purple-900/10 rounded-[2rem] p-6 border border-purple-100 dark:border-purple-800/30 shadow-sm">
                    <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                        <Target size={18} className="text-purple-500"/> Outcome Targets
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-2">Target Outcome Description</label>
                            <textarea
                                rows={3}
                                value={formData.targetOutcome || ''}
                                onChange={(e) => handleInputChange('targetOutcome', e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl text-purple-900 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-2">Target Texture</label>
                             <input 
                                value={formData.targetTexture || ''}
                                onChange={(e) => handleInputChange('targetTexture', e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl text-purple-900 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                            />
                            <p className="text-xs text-purple-600 dark:text-purple-300 opacity-70">
                                Specific viscosity or organoleptic properties required.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-700 gap-3">
                <button 
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    className="px-8 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                >
                    <Save size={18} />
                    Save Changes
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;