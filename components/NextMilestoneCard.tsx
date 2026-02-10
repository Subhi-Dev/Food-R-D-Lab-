import React from 'react';
import { Flag, Clock } from 'lucide-react';

interface MilestoneTask {
  id: number;
  project: string;
  version: string;
  task: string;
  dueDate: Date;
}

const NextMilestoneCard: React.FC = () => {
  // Dynamic Date Generation for Demo Purposes
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);

  // Mock Milestones
  const milestones: MilestoneTask[] = [
    { 
      id: 1, 
      project: 'Vegan Cheese', 
      version: '4.2', 
      task: 'Microbial Stability Test', 
      dueDate: tomorrow // Sets it to "Tomorrow" for the demo
    },
    { 
      id: 2, 
      project: 'Oat Milk', 
      version: '3.1', 
      task: 'Shelf Life Analysis', 
      dueDate: threeDaysLater 
    }
  ];

  // Logic: Find the nearest future milestone
  const nearestMilestone = milestones.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];

  // Logic: Calculate Human Readable Time
  const diffTime = nearestMilestone.dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  let dueText = '';
  let urgencyStyles = '';

  if (diffDays <= 0) {
    dueText = 'Due Today';
    urgencyStyles = 'bg-red-50 text-red-700 border-red-100';
  } else if (diffDays === 1) {
    dueText = 'Due Tomorrow';
    urgencyStyles = 'bg-amber-50 text-amber-700 border-amber-100';
  } else {
    dueText = `Due in ${diffDays} days`;
    urgencyStyles = 'bg-blue-50 text-blue-700 border-blue-100';
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-gray-500">Next Milestone</span>
        <span className="p-1.5 rounded-md bg-gray-50 text-gray-400">
            <Flag size={20} />
        </span>
      </div>
      
      <div className="flex flex-col h-full justify-end">
         <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {nearestMilestone.project} <span className="text-gray-400 font-normal text-base">v{nearestMilestone.version}</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">{nearestMilestone.task}</p>
         </div>
         
         <div className={`inline-flex items-center self-start px-2.5 py-1 rounded-md text-xs font-semibold border ${urgencyStyles}`}>
            <Clock size={14} className="mr-1.5" />
            {dueText}
         </div>
      </div>
    </div>
  );
};

export default NextMilestoneCard;