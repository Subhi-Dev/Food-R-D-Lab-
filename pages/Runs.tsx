import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  ChevronLeft, 
  Scale, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FlaskConical,
  RotateCcw,
  Pause,
  ArrowRight,
  Check,
  X,
  ChevronDown,
  History,
  Calendar,
  FileText
} from 'lucide-react';
import { Project, RecipePhase, RecipeStep } from '../types';
import { STATUS_COLORS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import { useSettings } from '../context/SettingsContext';

interface RunsProps {
  projects: Project[];
}

// Data Structure for a Completed Run Log
interface RunRecord {
  id: string;
  projectId: string;
  projectName: string;
  batchCode: string;
  startTime: Date;
  endTime: Date;
  durationString: string; // e.g., "14m 30s"
  data: Record<string, number>; // Mapping Step ID -> Actual Value
}

// Helper to ensure all projects have a playable phase structure
const normalizeProjectPhases = (project: Project): RecipePhase[] => {
  if (project.phases && project.phases.length > 0) return project.phases;
  
  // Auto-generate a default weighing phase from ingredients if detailed phases are missing
  const steps: RecipeStep[] = project.ingredients.map((ing, idx) => ({
    id: `auto-step-${ing.id}-${idx}`,
    type: 'weighing',
    label: `Add ${ing.name}`,
    isCompleted: false,
    ingredientId: ing.id,
    expectedWeight: ing.weight,
    actualWeight: 0,
    notes: 'Standard ingredient addition'
  }));
  
  return [{
    id: 'auto-phase-1',
    name: 'Weighing & Preparation',
    color: 'blue',
    steps
  }];
};

// Helper: Generate Unique Batch Code
const generateBatchCode = (projectName: string) => {
    const prefix = projectName.split(' ')[0].toUpperCase().slice(0, 4);
    const digits = Math.floor(Math.random() * 900 + 100); // 100-999
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    return `${prefix}-${digits}${letter}`;
};

const Runs: React.FC<RunsProps> = ({ projects }) => {
  const { addNotification } = useNotifications();
  const { t, isRTL } = useSettings();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [runStatus, setRunStatus] = useState<'selection' | 'running' | 'completed'>('selection');
  
  // -- Session State --
  const [batchCode, setBatchCode] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [runValues, setRunValues] = useState<Record<string, number>>({}); // Log of actual weights
  const [runHistory, setRunHistory] = useState<RunRecord[]>([]); // Persistent history (mocked locally)

  // -- Execution State --
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // -- Step Interaction State --
  const [actualWeightInput, setActualWeightInput] = useState<string>('');
  const [isStepConfirmed, setIsStepConfirmed] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);

  // Computed Properties
  const phases = useMemo(() => 
    selectedProject ? normalizeProjectPhases(selectedProject) : [], 
    [selectedProject]
  );
  
  const activePhase = phases[currentPhaseIndex];
  const activeStep = activePhase?.steps?.[currentStepIndex];

  // --- Reset Step State on Transition ---
  useEffect(() => {
    if (activeStep) {
        setActualWeightInput('');
        setIsStepConfirmed(false);
        setTimerCompleted(false);
    }
  }, [activeStep?.id]); 

  // --- Start Logic ---
  const handleStartRun = (project: Project) => {
    const code = generateBatchCode(project.name);
    setBatchCode(code);
    setStartTime(new Date());
    setRunValues({});
    
    setSelectedProject(project);
    setRunStatus('running');
    setCurrentPhaseIndex(0);
    setCurrentStepIndex(0);
    
    addNotification('Run Started', `Initialized batch ${code} for ${project.name}`, 'info');
  };

  // --- Finish Run Logic ---
  const finishRun = () => {
      if (!selectedProject || !startTime) return;

      const endTime = new Date();
      const durationMs = endTime.getTime() - startTime.getTime();
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000);

      const newRecord: RunRecord = {
          id: `run-${Date.now()}`,
          projectId: selectedProject.id,
          projectName: selectedProject.name,
          batchCode,
          startTime,
          endTime,
          durationString: `${minutes}m ${seconds}s`,
          data: { ...runValues }
      };

      setRunHistory(prev => [newRecord, ...prev]);
      setRunStatus('completed');
      
      addNotification('Batch Completed', `Successfully logged run ${batchCode}.`, 'success');
  };

  // --- Navigation Logic ---
  const handleNext = () => {
    if (!activePhase || !activeStep) return;

    // Log data if it's a weighing step
    if (activeStep.type === 'weighing' && actualWeightInput) {
        setRunValues(prev => ({
            ...prev,
            [activeStep.id]: parseFloat(actualWeightInput)
        }));
    }

    // Determine Next Step
    if (currentStepIndex < activePhase.steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
    } 
    else if (currentPhaseIndex < phases.length - 1) {
        setCurrentPhaseIndex(prev => prev + 1);
        setCurrentStepIndex(0);
    } 
    else {
        finishRun();
    }
  };

  const handlePrev = () => {
    if (!activePhase) return;

    if (currentStepIndex > 0) {
        setCurrentStepIndex(prev => prev - 1);
    } else if (currentPhaseIndex > 0) {
        const prevPhaseIndex = currentPhaseIndex - 1;
        setCurrentPhaseIndex(prevPhaseIndex);
        setCurrentStepIndex(phases[prevPhaseIndex].steps.length - 1);
    } else {
        setRunStatus('selection');
        setSelectedProject(null);
    }
  };

  // --- Validation Logic ---
  const getValidationState = () => {
    if (!activeStep) return { isValid: false, message: '', color: '', bgColor: '', range: '' };

    // 1. Weighing Steps
    if (activeStep.type === 'weighing') {
        const target = activeStep.expectedWeight || 0;
        const tolerance = target * 0.05; // 5%
        const min = target - tolerance;
        const max = target + tolerance;

        if (!actualWeightInput || isNaN(parseFloat(actualWeightInput))) {
            return { 
                isValid: false, 
                message: 'Awaiting input...', 
                color: 'text-gray-500 dark:text-slate-400',
                bgColor: 'bg-gray-100 dark:bg-slate-800',
                range: `${min.toFixed(2)}g - ${max.toFixed(2)}g`
            };
        }
        
        const actual = parseFloat(actualWeightInput);
        const diff = Math.abs(actual - target);
        // Using slight epsilon for float safety
        const isValid = diff <= (tolerance + 0.001);

        if (isValid) {
            return {
                isValid: true,
                message: "✅ Weight Accepted",
                color: "text-emerald-700 dark:text-emerald-300",
                bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
                range: `${min.toFixed(2)}g - ${max.toFixed(2)}g`
            };
        } else {
            return {
                isValid: false,
                message: `❌ Outside 5% tolerance`,
                color: "text-rose-700 dark:text-rose-300",
                bgColor: "bg-rose-100 dark:bg-rose-900/30",
                range: `${min.toFixed(2)}g - ${max.toFixed(2)}g`
            };
        }
    }

    // 2. Timer Steps
    if (activeStep.type === 'timer') {
        const ready = timerCompleted || isStepConfirmed;
        return { 
            isValid: ready, 
            message: ready ? "Timer Complete" : "Timer Running...",
            color: ready ? "text-emerald-700 dark:text-emerald-300" : "text-orange-700 dark:text-orange-300",
            bgColor: ready ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-orange-100 dark:bg-orange-900/30",
            range: ''
        };
    }

    // 3. Process Steps
    if (activeStep.type === 'process') {
        return { 
            isValid: isStepConfirmed, 
            message: isStepConfirmed ? "Step Confirmed" : "Pending Confirmation",
            color: isStepConfirmed ? "text-emerald-700 dark:text-emerald-300" : "text-gray-600 dark:text-slate-400",
            bgColor: isStepConfirmed ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-gray-100 dark:bg-slate-800",
            range: ''
        };
    }

    return { isValid: true, message: '', color: '', bgColor: '', range: '' };
  };

  const validation = getValidationState();

  // --- Views ---

  if (runStatus === 'selection') {
    return (
        <div className="space-y-12 max-w-6xl mx-auto pb-12">
            <div className="px-4 md:px-0">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{t('startRun')}</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">Initialize a new production run or view session history.</p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: New Run Selection */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Dropdown */}
                    <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 shadow-lg border border-gray-100 dark:border-slate-800">
                        <label className="block text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">
                            Start New Batch
                        </label>
                        <div className="relative group">
                            <select 
                                className="w-full appearance-none bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl px-6 py-5 text-xl font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all cursor-pointer"
                                onChange={(e) => {
                                    const p = projects.find(proj => proj.id === e.target.value);
                                    if(p) handleStartRun(p);
                                }}
                                defaultValue=""
                            >
                                <option value="" disabled>Choose a recipe...</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} (v{p.version})
                                    </option>
                                ))}
                            </select>
                            <div className={`absolute ${isRTL ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors`}>
                                <ChevronDown size={28} />
                            </div>
                        </div>
                    </div>

                    {/* Quick Select Grid */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-6 px-1">Quick Select</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0">
                            {projects.slice(0, 4).map(project => (
                                <div 
                                    key={project.id} 
                                    className="group bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden"
                                    onClick={() => handleStartRun(project)}
                                >
                                     <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_COLORS[project.status]}`}>
                                                {project.status}
                                            </span>
                                            <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full text-gray-400 dark:text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <Play size={20} fill="currentColor" className={isRTL ? 'transform -scale-x-100' : ''} />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{project.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">v{project.version} • {project.category}</p>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Run History */}
                <div className="xl:col-span-1">
                     <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 h-full min-h-[500px]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-xl">
                                <History size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('recentBatches')}</h2>
                        </div>

                        {runHistory.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-3xl">
                                <FileText size={48} className="text-gray-300 dark:text-slate-700 mb-4" />
                                <p className="text-gray-400 dark:text-slate-500 font-medium">No completed runs yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {runHistory.map(run => (
                                    <div key={run.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-transparent dark:border-slate-800/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold bg-white dark:bg-slate-800 px-2 py-1 rounded-md text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 font-mono">
                                                {run.batchCode}
                                            </span>
                                            <span className="text-xs font-medium text-gray-400 dark:text-slate-500">
                                                {run.endTime.toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-slate-200 text-sm mb-1">{run.projectName}</h4>
                                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-slate-400">
                                            <div className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {run.durationString}
                                            </div>
                                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                                                <CheckCircle2 size={12} /> Complete
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
  }

  if (runStatus === 'completed') {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in-95 duration-500 px-4">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4 shadow-lg shadow-green-500/20">
                <Check size={48} strokeWidth={4} />
            </div>
            <div className="space-y-2">
                <span className="inline-block px-4 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-sm font-mono font-bold text-gray-500 dark:text-slate-400 mb-2">
                    Batch: {batchCode}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Run Completed!</h1>
            </div>
            <p className="text-xl text-gray-500 dark:text-slate-400 max-w-lg">
                The formulation run for <span className="font-bold text-gray-900 dark:text-white">{selectedProject?.name}</span> has been logged to history.
            </p>
            <div className="flex gap-4 mt-8">
                <button 
                    onClick={() => setRunStatus('selection')}
                    className="px-8 py-4 bg-gray-900 dark:bg-indigo-600 text-white rounded-[2rem] font-bold hover:scale-105 transition-transform shadow-lg"
                >
                    Back to Selection
                </button>
            </div>
        </div>
    );
  }

  // --- Active Run View ---

  const totalSteps = phases.reduce((acc, phase) => acc + phase.steps.length, 0) || 0;
  let stepsBeforeCurrentPhase = 0;
  for (let i = 0; i < currentPhaseIndex; i++) {
      stepsBeforeCurrentPhase += phases[i].steps.length;
  }
  const currentGlobalStep = stepsBeforeCurrentPhase + currentStepIndex + 1;
  const progressPercent = totalSteps > 0 ? (currentGlobalStep / totalSteps) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
            <button 
                onClick={() => setRunStatus('selection')} 
                className="text-sm font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
                <X size={18} /> {t('cancelRun')}
            </button>
            
            <div className="text-left md:text-center flex-1">
                {/* Batch Code Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold mb-1">
                    BATCH: {batchCode}
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{selectedProject?.name}</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">{activePhase?.name}</p>
            </div>
            
            <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl">
                <span>{t('step')} {currentGlobalStep}</span>
                <span className="opacity-50">/</span>
                <span>{totalSteps}</span>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div 
                className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
            />
        </div>

        {/* Main Execution Card */}
        <div className="relative px-2 md:px-0">
        <AnimatePresence mode="wait">
            <motion.div
                key={`${currentPhaseIndex}-${currentStepIndex}`}
                initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl shadow-blue-900/5 border border-gray-100 dark:border-slate-800 min-h-[550px] flex flex-col justify-between"
            >
                {/* Step Header */}
                <div className="flex items-start justify-between mb-8">
                    <div className="flex-1">
                        <span className={`inline-block px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider mb-4 ${
                            activeStep?.type === 'weighing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            activeStep?.type === 'timer' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        }`}>
                            {activeStep?.type}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                            {activeStep?.label}
                        </h2>
                        {activeStep?.notes && (
                            <p className="mt-4 text-lg md:text-xl text-gray-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                                {activeStep.notes}
                            </p>
                        )}
                    </div>
                    {/* Icon Stamp */}
                    <div className="hidden md:flex w-24 h-24 rounded-full bg-gray-50 dark:bg-slate-800 items-center justify-center text-gray-300 dark:text-slate-600 flex-shrink-0 ml-4 rtl:mr-4 rtl:ml-0">
                        {activeStep?.type === 'weighing' && <Scale size={48} />}
                        {activeStep?.type === 'timer' && <Clock size={48} />}
                        {activeStep?.type === 'process' && <FlaskConical size={48} />}
                    </div>
                </div>

                {/* DYNAMIC CONTENT AREA */}
                <div className="flex-1 flex flex-col justify-center py-8">
                    
                    {/* WEIGHING INTERFACE */}
                    {activeStep?.type === 'weighing' && (
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            {/* Target Display */}
                            <div className="flex-1 space-y-2 text-center lg:text-left rtl:lg:text-right w-full">
                                <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">{t('targetWeight')}</label>
                                <div className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">
                                    {activeStep.expectedWeight}<span className="text-3xl md:text-4xl text-gray-400 ml-2">g</span>
                                </div>
                                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-xl">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-sm font-bold text-gray-600 dark:text-slate-300">
                                        Range: {validation.range} (±5%)
                                    </span>
                                </div>
                            </div>
                            
                            <div className="hidden lg:block w-px h-32 bg-gray-200 dark:bg-slate-700"></div>

                            {/* Actual Input */}
                            <div className="flex-1 w-full space-y-4">
                                <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">{t('actualWeight')}</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        autoFocus
                                        step="0.01"
                                        value={actualWeightInput}
                                        onChange={(e) => setActualWeightInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && validation.isValid) handleNext();
                                        }}
                                        placeholder="0.00"
                                        className={`w-full bg-gray-50 dark:bg-slate-900 border-2 rounded-[2rem] py-4 px-6 md:py-6 md:px-8 text-4xl md:text-6xl font-bold font-mono focus:outline-none transition-colors ${
                                            !actualWeightInput ? 'border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100' :
                                            validation.isValid 
                                            ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' 
                                            : 'border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-900/10'
                                        }`}
                                    />
                                    <div className={`absolute ${isRTL ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 pointer-events-none`}>
                                        {actualWeightInput && (
                                            validation.isValid 
                                            ? <CheckCircle2 size={32} className="text-emerald-500 md:w-10 md:h-10" />
                                            : <AlertCircle size={32} className="text-rose-500 md:w-10 md:h-10" />
                                        )}
                                    </div>
                                </div>
                                
                                <div className={`p-4 rounded-2xl flex items-center gap-3 transition-all duration-300 ${validation.bgColor}`}>
                                    <div className={`p-2 rounded-full bg-white/50 dark:bg-black/20 ${validation.color}`}>
                                        {validation.isValid ? <Check size={16} strokeWidth={3}/> : <AlertCircle size={16} strokeWidth={3}/>}
                                    </div>
                                    <div>
                                        <p className={`font-bold ${validation.color}`}>{validation.message}</p>
                                        {!validation.isValid && actualWeightInput && (
                                             <p className="text-xs font-medium opacity-80 mt-0.5 text-gray-600 dark:text-slate-300">
                                                Target: {activeStep.expectedWeight}g • Range: {validation.range}
                                             </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TIMER INTERFACE */}
                    {activeStep?.type === 'timer' && (
                        <div className="space-y-8">
                            <TimerDisplay 
                                initialTime={activeStep.durationSeconds || 60} 
                                onComplete={() => setTimerCompleted(true)} 
                            />
                            
                            <div 
                                className={`flex items-center justify-center gap-3 p-4 rounded-xl cursor-pointer transition-colors w-max mx-auto ${isStepConfirmed ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                                onClick={() => setIsStepConfirmed(!isStepConfirmed)}
                            >
                                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${isStepConfirmed ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-slate-500'}`}>
                                    {isStepConfirmed && <Check size={16} className="text-white" />}
                                </div>
                                <span className="font-bold text-gray-600 dark:text-slate-300 text-sm md:text-base">Manual Acknowledgement</span>
                            </div>
                        </div>
                    )}

                    {/* PROCESS INTERFACE */}
                    {activeStep?.type === 'process' && (
                         <div 
                            className={`flex items-center gap-6 p-6 md:p-8 rounded-[2rem] cursor-pointer transition-all border-2 w-full md:w-2/3 mx-auto group ${
                                isStepConfirmed 
                                ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/30 scale-[1.02]' 
                                : 'bg-gray-50 dark:bg-slate-800 border-transparent hover:border-gray-200 dark:hover:border-slate-600'
                            }`}
                            onClick={() => setIsStepConfirmed(!isStepConfirmed)}
                         >
                            <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                isStepConfirmed 
                                ? 'bg-white border-white text-blue-600' 
                                : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-500 text-transparent group-hover:border-blue-400'
                            }`}>
                                <Check size={28} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className={`text-xl md:text-2xl font-bold ${isStepConfirmed ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                    Mark as Done
                                </h3>
                                <p className={`text-sm md:text-base mt-1 ${isStepConfirmed ? 'text-blue-100' : 'text-gray-500 dark:text-slate-400'}`}>
                                    Confirm this step to proceed.
                                </p>
                            </div>
                         </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-slate-800 mt-auto">
                    <button 
                        onClick={handlePrev}
                        className="px-6 py-4 rounded-[1.5rem] font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <ChevronLeft size={20} className={isRTL ? 'transform -scale-x-100' : ''} />
                        <span className="hidden md:inline">{t('previous')}</span>
                    </button>

                    <button 
                        onClick={handleNext}
                        disabled={!validation.isValid}
                        className={`px-8 md:px-12 py-5 rounded-[1.5rem] font-bold text-lg md:text-xl flex items-center gap-3 shadow-xl transition-all ${
                            validation.isValid 
                            ? 'bg-gray-900 dark:bg-indigo-600 text-white hover:scale-105 hover:bg-gray-800 dark:hover:bg-indigo-500 shadow-blue-900/10' 
                            : 'bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                        {currentStepIndex === activePhase.steps.length - 1 && currentPhaseIndex === phases.length - 1 ? t('finishRun') : t('nextStep')}
                        <ArrowRight size={24} className={isRTL ? 'transform -scale-x-100' : ''} />
                    </button>
                </div>

            </motion.div>
        </AnimatePresence>
        </div>

    </div>
  );
};

// --- Sub-Component for Timer ---
const TimerDisplay: React.FC<{ initialTime: number, onComplete: () => void }> = ({ initialTime, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    
    // Reset timer if step changes
    useEffect(() => {
        setTimeLeft(initialTime);
        setIsRunning(false);
    }, [initialTime]);

    // Timer Tick Logic
    useEffect(() => {
        let interval: number | undefined;
        if (isRunning && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        onComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => window.clearInterval(interval);
    }, [isRunning, onComplete]); 

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto">
             <div className="relative mb-8">
                 <div className="text-[5rem] md:text-[8rem] font-bold text-gray-900 dark:text-white font-mono leading-none tracking-tighter relative z-10">
                    {formatTime(timeLeft)}
                 </div>
                 <div className="absolute -inset-4 bg-gray-100 dark:bg-slate-800 rounded-full blur-2xl -z-10"></div>
             </div>

             <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full mb-8 overflow-hidden">
                 <div className="h-full bg-orange-500 transition-all duration-1000 linear" style={{ width: `${progress}%` }}></div>
             </div>

             <div className="flex gap-4">
                 <button 
                    onClick={() => setIsRunning(!isRunning)}
                    className={`h-20 w-24 rounded-[2rem] flex items-center justify-center transition-all shadow-lg hover:scale-105 ${
                        isRunning 
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 border-2 border-orange-200 dark:border-orange-800' 
                        : 'bg-green-100 dark:bg-green-900/30 text-green-600 border-2 border-green-200 dark:border-green-800'
                    }`}
                 >
                     {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                 </button>
                 <button 
                    onClick={() => { setIsRunning(false); setTimeLeft(initialTime); }}
                    className="h-20 w-24 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-[2rem] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <RotateCcw size={28} />
                </button>
             </div>
        </div>
    );
};

export default Runs;