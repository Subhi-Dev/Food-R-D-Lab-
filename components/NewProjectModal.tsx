import React, { useState } from 'react';
import { X, Beaker, CheckCircle2, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { Project, ProjectStatus } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const CATEGORIES = [
  'Medical Nutrition',
  'Dairy Alternatives',
  'Alternative Proteins',
  'General R&D',
  'Beverage Formulation',
  'Snack Innovation'
];

const PROCESSING_METHODS = [
  'Sous-vide',
  'Extrusion',
  'Fermentation',
  'Pasteurization',
  'High-Shear Mixing',
  'Baking',
  'Freeze Drying'
];

const TESTING_REQUIREMENTS = [
  'Microbial Stability',
  'Nutrient Retention',
  'Sensory Profile',
  'Viscosity Analysis',
  'Shelf-life Testing',
  'Allergen Screening'
];

const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'technical' | 'compliance'>('general');
  const [formData, setFormData] = useState({
    name: '',
    lead: '',
    category: CATEGORIES[0],
    description: '',
    processingMethod: '',
    targetOutcome: '',
    nutritionalGoal: '',
    testingRequirements: [] as string[]
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (req: string) => {
    setFormData(prev => {
      const exists = prev.testingRequirements.includes(req);
      if (exists) {
        return { ...prev, testingRequirements: prev.testingRequirements.filter(r => r !== req) };
      } else {
        return { ...prev, testingRequirements: [...prev.testingRequirements, req] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure the new project has all necessary properties
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: formData.name,
      version: '1.0',
      status: ProjectStatus.TESTING, // Default status to TESTING as required
      updatedAt: 'Just now',
      lead: formData.lead || 'Unknown',
      progress: 0, // Default progress to 0%
      description: formData.description,
      ingredients: [],
      category: formData.category,
      processingMethod: formData.processingMethod,
      targetOutcome: formData.targetOutcome,
      nutritionalGoal: formData.nutritionalGoal,
      testingRequirements: formData.testingRequirements
    };

    onSave(newProject);
    onClose();
    
    // Clear the form fields so they are empty for the next entry
    setFormData({
        name: '',
        lead: '',
        category: CATEGORIES[0],
        description: '',
        processingMethod: '',
        targetOutcome: '',
        nutritionalGoal: '',
        testingRequirements: []
    });
    setActiveTab('general');
  };

  const nextTab = () => {
    if (activeTab === 'general') setActiveTab('technical');
    else if (activeTab === 'technical') setActiveTab('compliance');
  };

  const prevTab = () => {
    if (activeTab === 'compliance') setActiveTab('technical');
    else if (activeTab === 'technical') setActiveTab('general');
  };

  // High contrast input classes
  const inputClasses = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Beaker size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">New R&D Project</h2>
                    <p className="text-xs text-gray-500">Initialize a new formulation workspace</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Tabs / Progress */}
        <div className="px-6 pt-6">
            <div className="flex items-center space-x-1 border-b border-gray-200">
                <button 
                    onClick={() => setActiveTab('general')}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    1. General Info
                </button>
                <button 
                    onClick={() => setActiveTab('technical')}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'technical' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    2. Technical Specs
                </button>
                <button 
                    onClick={() => setActiveTab('compliance')}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'compliance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    3. Compliance
                </button>
            </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
            <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* General Section */}
                {activeTab === 'general' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Project Title</label>
                                <input 
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Plant-Based Scrambled Egg"
                                    className={inputClasses}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Category</label>
                                <select 
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Lead Researcher</label>
                            <input 
                                required
                                name="lead"
                                value={formData.lead}
                                onChange={handleInputChange}
                                placeholder="e.g. Dr. Sarah Chen"
                                className={inputClasses}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Brief Description</label>
                            <textarea 
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Describe the goal of this formulation..."
                                className={`${inputClasses} resize-none`}
                            />
                        </div>
                    </div>
                )}

                {/* Technical Specs Section */}
                {activeTab === 'technical' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Processing Method</label>
                            <div className="relative">
                                <input 
                                    list="processing-methods"
                                    name="processingMethod"
                                    value={formData.processingMethod}
                                    onChange={handleInputChange}
                                    placeholder="Select or type method..."
                                    className={inputClasses}
                                />
                                <datalist id="processing-methods">
                                    {PROCESSING_METHODS.map(m => <option key={m} value={m} />)}
                                </datalist>
                            </div>
                            <p className="text-xs text-gray-500">e.g. High pressure processing, fermentation, etc.</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Target Texture / Outcome</label>
                            <input 
                                name="targetOutcome"
                                value={formData.targetOutcome}
                                onChange={handleInputChange}
                                placeholder="e.g. Viscosity > 2000 cP, IDDSI Level 4"
                                className={inputClasses}
                            />
                        </div>
                    </div>
                )}

                {/* Compliance Section */}
                {activeTab === 'compliance' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Key Nutritional Focus</label>
                            <input 
                                name="nutritionalGoal"
                                value={formData.nutritionalGoal}
                                onChange={handleInputChange}
                                placeholder="e.g. High Protein (20g/serving), Low Sugar"
                                className={inputClasses}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700">Testing Requirements</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {TESTING_REQUIREMENTS.map(req => (
                                    <label key={req} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors bg-white">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                            formData.testingRequirements.includes(req) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                                        }`}>
                                            {formData.testingRequirements.includes(req) && <CheckCircle2 size={14} className="text-white" />}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={formData.testingRequirements.includes(req)}
                                            onChange={() => handleCheckboxChange(req)}
                                        />
                                        <span className="text-sm text-gray-700">{req}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <button 
                type="button"
                onClick={prevTab}
                disabled={activeTab === 'general'}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:text-gray-900 transition-colors"
            >
                <ChevronLeft size={16} className="mr-1" />
                Back
            </button>
            
            {activeTab !== 'compliance' ? (
                <button 
                    type="button"
                    onClick={nextTab}
                    className="flex items-center px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Next Step
                    <ChevronRight size={16} className="ml-1" />
                </button>
            ) : (
                <button 
                    type="submit"
                    form="project-form"
                    className="flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                >
                    <Save size={16} className="mr-2" />
                    Create Project
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;