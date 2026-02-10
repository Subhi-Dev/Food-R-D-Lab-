import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Save, 
  Plus, 
  Trash2, 
  Clock, 
  Scale, 
  FileText, 
  GripVertical, 
  Play, 
  Pause, 
  RotateCcw,
  X,
  CheckCircle2
} from 'lucide-react';
import { Project, RecipePhase, RecipeStep, PhaseColor, StepType } from '../types';
import { STATUS_COLORS } from '../constants';

interface FormulationProps {
    projects: Project[];
    onUpdateProject: (project: Project) => void;
}

const COLORS: Record<PhaseColor, { bg: string, border: string, text: string, darkBg: string, darkBorder: string, darkText: string }> = {
    blue:   { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-900', darkBg: 'dark:bg-blue-900/10', darkBorder: 'dark:border-blue-800/30', darkText: 'dark:text-blue-100' },
    green:  { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-900', darkBg: 'dark:bg-green-900/10', darkBorder: 'dark:border-green-800/30', darkText: 'dark:text-green-100' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-900', darkBg: 'dark:bg-orange-900/10', darkBorder: 'dark:border-orange-800/30', darkText: 'dark:text-orange-100' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-900', darkBg: 'dark:bg-purple-900/10', darkBorder: 'dark:border-purple-800/30', darkText: 'dark:text-purple-100' },
    rose:   { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-900', darkBg: 'dark:bg-rose-900/10', darkBorder: 'dark:border-rose-800/30', darkText: 'dark:text-rose-100' },
    slate:  { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-900', darkBg: 'dark:bg-slate-800', darkBorder: 'dark:border-slate-700', darkText: 'dark:text-slate-100' },
};

const Formulation: React.FC<FormulationProps> = ({ projects, onUpdateProject }) => {
  const { id } = useParams<{ id: string }>();
  const foundProject = projects.find(p => p.id === id);
  const [project, setProject] = useState<Project | undefined>(foundProject);
  const [phases, setPhases] = useState<RecipePhase[]>([]);
  
  // Initialize Phases
  useEffect(() => {
    if (foundProject) {
      setProject(foundProject);
      if (foundProject.phases && foundProject.phases.length > 0) {
        setPhases(foundProject.phases);
      } else {
        // Initialize Default "Weighing Phase" from ingredients if no phases exist
        const initialSteps: RecipeStep[] = foundProject.ingredients.map(ing => ({
            id: `step-${ing.id}-${Date.now()}`,
            type: 'weighing',
            label: `Add ${ing.name}`,
            isCompleted: false,
            ingredientId: ing.id,
            expectedWeight: ing.weight,
            actualWeight: 0,
            notes: ''
        }));
        
        setPhases([
            { id: 'phase-1', name: 'Preparation & Weighing', color: 'blue', steps: initialSteps },
            { id: 'phase-2', name: 'Processing', color: 'orange', steps: [] }
        ]);
      }
    }
  }, [foundProject]);

  const handleSave = () => {
    if (project) {
        onUpdateProject({ ...project, phases });
    }
  };

  const addPhase = () => {
    const newPhase: RecipePhase = {
        id: `phase-${Date.now()}`,
        name: 'New Phase',
        color: 'slate',
        steps: []
    };
    setPhases([...phases, newPhase]);
  };

  const updatePhase = (phaseId: string, updates: Partial<RecipePhase>) => {
    setPhases(phases.map(p => p.id === phaseId ? { ...p, ...updates } : p));
  };

  const deletePhase = (phaseId: string) => {
    setPhases(phases.filter(p => p.id !== phaseId));
  };

  const addStep = (phaseId: string, type: StepType) => {
    const newStep: RecipeStep = {
        id: `step-${Date.now()}`,
        type,
        label: type === 'weighing' ? 'New Ingredient' : type === 'timer' ? 'Rest Period' : 'Process Step',
        isCompleted: false,
        durationSeconds: type === 'timer' ? 60 : undefined,
        expectedWeight: type === 'weighing' ? 0 : undefined,
        actualWeight: type === 'weighing' ? 0 : undefined,
    };
    setPhases(phases.map(p => 
        p.id === phaseId ? { ...p, steps: [...p.steps, newStep] } : p
    ));
  };

  const updateStep = (phaseId: string, stepId: string, updates: Partial<RecipeStep>) => {
    setPhases(phases.map(p => 
        p.id === phaseId ? { 
            ...p, 
            steps: p.steps.map(s => s.id === stepId ? { ...s, ...updates } : s) 
        } : p
    ));
  };

  const deleteStep = (phaseId: string, stepId: string) => {
    setPhases(phases.map(p => 
        p.id === phaseId ? { ...p, steps: p.steps.filter(s => s.id !== stepId) } : p
    ));
  };

  const reorderSteps = (phaseId: string, newSteps: RecipeStep[]) => {
      setPhases(phases.map(p => p.id === phaseId ? { ...p, steps: newSteps } : p));
  };

  if (!project) return <div>Project not found</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="p-3 hover:bg-white dark:hover:bg-[#1e293b] rounded-full transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-700">
            <ChevronLeft size={24} className="text-gray-500 dark:text-slate-400" />
          </Link>
          <div>
             <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">{project.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[project.status]}`}>
                    v{project.version}
                </span>
             </div>
             <p className="text-sm text-gray-500 dark:text-slate-400">Formulation Engine • Last edited by {project.lead}</p>
          </div>
        </div>
        <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-indigo-600 text-white rounded-[1.5rem] font-bold shadow-lg hover:scale-105 transition-transform"
        >
            <Save size={20} />
            <span>Save Formulation</span>
        </button>
      </div>

      {/* Phase List */}
      <div className="space-y-8">
        {phases.map((phase) => (
            <PhaseContainer 
                key={phase.id} 
                phase={phase} 
                onUpdate={(updates) => updatePhase(phase.id, updates)}
                onDelete={() => deletePhase(phase.id)}
                onAddStep={(type) => addStep(phase.id, type)}
                onUpdateStep={(stepId, updates) => updateStep(phase.id, stepId, updates)}
                onDeleteStep={(stepId) => deleteStep(phase.id, stepId)}
                onReorderSteps={(newSteps) => reorderSteps(phase.id, newSteps)}
            />
        ))}

        {/* Add Phase Button */}
        <button 
            onClick={addPhase}
            className="w-full py-8 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-[2.5rem] text-gray-400 dark:text-slate-500 font-bold flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors"
        >
            <Plus size={32} />
            Add New Phase
        </button>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const PhaseContainer: React.FC<{
    phase: RecipePhase;
    onUpdate: (u: Partial<RecipePhase>) => void;
    onDelete: () => void;
    onAddStep: (t: StepType) => void;
    onUpdateStep: (id: string, u: Partial<RecipeStep>) => void;
    onDeleteStep: (id: string) => void;
    onReorderSteps: (s: RecipeStep[]) => void;
}> = ({ phase, onUpdate, onDelete, onAddStep, onUpdateStep, onDeleteStep, onReorderSteps }) => {
    
    const theme = COLORS[phase.color] || COLORS.slate;

    return (
        <div className={`rounded-[2.5rem] p-6 md:p-8 ${theme.bg} ${theme.darkBg} border ${theme.border} ${theme.darkBorder} transition-colors`}>
            {/* Phase Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                    <input 
                        value={phase.name}
                        onChange={(e) => onUpdate({ name: e.target.value })}
                        className={`text-2xl font-bold bg-transparent border-none focus:ring-0 p-0 w-full ${theme.text} ${theme.darkText} placeholder-opacity-50 outline-none`}
                        placeholder="Phase Name"
                    />
                    <div className="flex gap-2 mt-2">
                        {(Object.keys(COLORS) as PhaseColor[]).map(c => (
                            <button 
                                key={c}
                                onClick={() => onUpdate({ color: c })}
                                className={`w-4 h-4 rounded-full border border-black/10 dark:border-white/10 ${COLORS[c].bg} ${phase.color === c ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-slate-900' : ''}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Steps List (Reorder Group) */}
            <Reorder.Group axis="y" values={phase.steps} onReorder={onReorderSteps} className="space-y-4">
                <AnimatePresence>
                    {phase.steps.map((step) => (
                        <StepCard 
                            key={step.id} 
                            step={step} 
                            onUpdate={(u) => onUpdateStep(step.id, u)}
                            onDelete={() => onDeleteStep(step.id)}
                        />
                    ))}
                </AnimatePresence>
            </Reorder.Group>

            {/* Empty State */}
            {phase.steps.length === 0 && (
                <div className="py-8 text-center text-gray-400 dark:text-slate-500 text-sm font-medium border-2 border-dashed border-gray-200/50 dark:border-slate-700/50 rounded-[2rem]">
                    No steps in this phase yet.
                </div>
            )}

            {/* Add Step Controls */}
            <div className="mt-6 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                <AddStepButton label="Weighing" icon={<Scale size={16}/>} onClick={() => onAddStep('weighing')} />
                <AddStepButton label="Timer" icon={<Clock size={16}/>} onClick={() => onAddStep('timer')} />
                <AddStepButton label="Process" icon={<FileText size={16}/>} onClick={() => onAddStep('process')} />
            </div>
        </div>
    );
};

const AddStepButton: React.FC<{ label: string, icon: React.ReactNode, onClick: () => void }> = ({ label, icon, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-600 dark:text-slate-300 shadow-sm hover:scale-105 transition-transform whitespace-nowrap"
    >
        <div className="text-blue-500">{icon}</div>
        <span>Add {label}</span>
    </button>
);

const StepCard: React.FC<{ 
    step: RecipeStep; 
    onUpdate: (u: Partial<RecipeStep>) => void;
    onDelete: () => void;
}> = ({ step, onUpdate, onDelete }) => {
    
    return (
        <Reorder.Item value={step} id={step.id} className="relative">
             <motion.div 
                layout 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group bg-white dark:bg-[#1e293b] rounded-[2rem] p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow relative overflow-hidden ${step.isCompleted ? 'opacity-60 grayscale-[0.5]' : ''}`}
             >
                <div className="flex gap-4">
                    {/* Drag Handle */}
                    <div className="cursor-grab active:cursor-grabbing text-gray-300 dark:text-slate-600 mt-1 flex-shrink-0">
                        <GripVertical size={20} />
                    </div>

                    <div className="flex-1 space-y-4">
                        {/* Header Row */}
                        <div className="flex justify-between items-start">
                             <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                        step.type === 'weighing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                        step.type === 'timer' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                    }`}>
                                        {step.type}
                                    </span>
                                </div>
                                <input 
                                    value={step.label}
                                    onChange={(e) => onUpdate({ label: e.target.value })}
                                    className="font-bold text-gray-900 dark:text-slate-100 bg-transparent border-none p-0 w-full focus:ring-0 text-lg outline-none"
                                    placeholder="Step Description"
                                />
                             </div>
                             <button onClick={onDelete} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <X size={18} />
                             </button>
                        </div>

                        {/* Step Content based on Type */}
                        <div className="bg-gray-50 dark:bg-[#0f172a] rounded-2xl p-4">
                            {step.type === 'weighing' && <WeighingControl step={step} onUpdate={onUpdate} />}
                            {step.type === 'timer' && <TimerControl step={step} onUpdate={onUpdate} />}
                            {step.type === 'process' && (
                                <textarea 
                                    value={step.notes || ''} 
                                    onChange={(e) => onUpdate({ notes: e.target.value })}
                                    placeholder="Enter process details, temperature settings, or observations..."
                                    className="w-full bg-transparent border-none resize-none focus:ring-0 text-sm text-gray-600 dark:text-slate-300 outline-none"
                                    rows={2}
                                />
                            )}
                        </div>
                    </div>
                    
                    {/* Completion Toggle */}
                    <div className="flex flex-col justify-center">
                         <button 
                            onClick={() => onUpdate({ isCompleted: !step.isCompleted })}
                            className={`p-2 rounded-full transition-all ${
                                step.isCompleted 
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                                : 'bg-gray-100 dark:bg-slate-700 text-gray-300 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-600'
                            }`}
                         >
                             <CheckCircle2 size={24} />
                         </button>
                    </div>
                </div>
             </motion.div>
        </Reorder.Item>
    );
};

const WeighingControl: React.FC<{ step: RecipeStep; onUpdate: (u: Partial<RecipeStep>) => void }> = ({ step, onUpdate }) => {
    return (
        <div className="flex flex-wrap items-center gap-4">
             <div className="flex-1 min-w-[140px]">
                 <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">Target</label>
                 <div className="flex items-center gap-2">
                     <input 
                        type="number"
                        value={step.expectedWeight || ''}
                        onChange={(e) => onUpdate({ expectedWeight: parseFloat(e.target.value) })}
                        className="w-24 bg-white dark:bg-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                     />
                     <span className="text-sm font-medium text-gray-500 dark:text-slate-400">g</span>
                 </div>
             </div>
             <div className="flex-1 min-w-[140px]">
                 <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">Actual</label>
                 <div className="flex items-center gap-2">
                     <input 
                        type="number"
                        value={step.actualWeight || ''}
                        onChange={(e) => onUpdate({ actualWeight: parseFloat(e.target.value) })}
                        className={`w-24 bg-white dark:bg-slate-700 rounded-lg px-3 py-2 text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            step.expectedWeight && step.actualWeight && Math.abs(step.actualWeight - step.expectedWeight) < 5 
                            ? 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                            : 'text-gray-900 dark:text-white border-gray-200 dark:border-slate-600'
                        }`}
                        placeholder="0"
                     />
                     <span className="text-sm font-medium text-gray-500 dark:text-slate-400">g</span>
                 </div>
             </div>
        </div>
    );
};

const TimerControl: React.FC<{ step: RecipeStep; onUpdate: (u: Partial<RecipeStep>) => void }> = ({ step, onUpdate }) => {
    const [timeLeft, setTimeLeft] = useState(step.durationSeconds || 0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        setTimeLeft(step.durationSeconds || 0);
    }, [step.durationSeconds]);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="flex items-center gap-6">
             <div className="font-mono text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                 {formatTime(timeLeft)}
             </div>
             <div className="flex items-center gap-2">
                 <button 
                    onClick={() => setIsRunning(!isRunning)}
                    className={`p-3 rounded-xl transition-colors ${
                        isRunning 
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' 
                        : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    }`}
                 >
                     {isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                 </button>
                 <button 
                    onClick={() => { setIsRunning(false); setTimeLeft(step.durationSeconds || 0); }}
                    className="p-3 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                 >
                     <RotateCcw size={20} />
                 </button>
             </div>
             <div className="ml-auto flex items-center gap-2">
                 <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">Set Duration (s)</label>
                 <input 
                    type="number"
                    value={step.durationSeconds || ''}
                    onChange={(e) => onUpdate({ durationSeconds: parseInt(e.target.value) || 0 })}
                    className="w-16 bg-white dark:bg-slate-700 rounded-lg px-2 py-1 text-sm text-center font-bold border border-gray-200 dark:border-slate-600"
                 />
             </div>
        </div>
    );
};

export default Formulation;