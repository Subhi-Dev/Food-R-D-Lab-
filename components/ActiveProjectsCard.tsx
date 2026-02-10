import React from 'react';
import { Beaker } from 'lucide-react';

const ActiveProjectsCard: React.FC = () => {
  // Data Logic: Mock array of projects
  const projects = [
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

  const currentCount = projects.length;
  const lastMonthCount = 10;
  
  // Calculate difference and percentage
  const difference = currentCount - lastMonthCount;
  const percentage = lastMonthCount > 0 ? ((difference / lastMonthCount) * 100).toFixed(1) : 0;
  const isPositive = difference >= 0;

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-gray-500">Active Projects</span>
        <span className="p-1.5 rounded-md bg-gray-50 text-gray-400">
            <Beaker size={20} />
        </span>
      </div>
      <div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{currentCount}</span>
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded flex items-center ${
            isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
          }`}>
            {isPositive ? '+' : ''}{difference}
          </span>
          <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            ({isPositive ? '+' : ''}{percentage}%)
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">vs {lastMonthCount} last month</p>
      </div>
    </div>
  );
};

export default ActiveProjectsCard;