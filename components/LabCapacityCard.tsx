import React from 'react';
import { Activity } from 'lucide-react';

interface Project {
  id: number | string;
  name: string;
}

interface LabCapacityCardProps {
  projects?: Project[];
}

const LabCapacityCard: React.FC<LabCapacityCardProps> = ({ projects }) => {
  // Use the same mock data set as ActiveProjectsCard to ensure synchronization (12 items)
  const defaultProjects = [
    { id: 1, name: 'Oat Milk' },
    { id: 2, name: 'Sriracha Alt-Meat' },
    { id: 3, name: 'Brioche' },
    { id: 4, name: 'Granola' },
    { id: 5, name: 'Yogurt' },
    { id: 6, name: 'Protein Shake' },
    { id: 7, name: 'Soy Isolate' },
    { id: 8, name: 'Keto Bar' },
    { id: 9, name: 'Almond Cheese' },
    { id: 10, name: 'Cashew Butter' },
    { id: 11, name: 'Hemp Milk' },
    { id: 12, name: 'Pea Protein' },
  ];

  const activeProjects = projects || defaultProjects;
  const count = activeProjects.length;
  const MAX_LAB_CAPACITY = 15;
  
  const percentage = Math.round((count / MAX_LAB_CAPACITY) * 100);

  // Color Logic based on capacity thresholds
  let colorClass = 'text-green-600';
  let barColorClass = 'bg-green-600';
  let iconBgClass = 'bg-gray-50 text-gray-400';

  if (percentage > 80) {
    // Overloaded (> 80%)
    colorClass = 'text-red-600';
    barColorClass = 'bg-red-600';
    iconBgClass = 'bg-red-50 text-red-600';
  } else if (percentage >= 50) {
    // Optimal/High (50% - 80%)
    colorClass = 'text-orange-500';
    barColorClass = 'bg-orange-500';
    iconBgClass = 'bg-orange-50 text-orange-600';
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-gray-500">Lab Capacity</span>
        <span className={`p-1.5 rounded-md ${iconBgClass}`}>
            <Activity size={20} />
        </span>
      </div>
      <div>
        <div className="flex items-baseline space-x-2">
          <span className={`text-3xl font-bold ${colorClass}`}>{percentage}%</span>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${barColorClass}`} 
                style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
        </div>
        
        <p className="text-xs text-gray-400 mt-2">
            {count} / {MAX_LAB_CAPACITY} active slots used
        </p>
      </div>
    </div>
  );
};

export default LabCapacityCard;