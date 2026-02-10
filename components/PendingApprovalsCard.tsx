import React from 'react';
import { AlertTriangle } from 'lucide-react';

const PendingApprovalsCard: React.FC = () => {
  // Mock Data: Includes status to demonstrate filtering logic
  const projects = [
    { id: 1, name: 'Oat Milk', status: 'Testing' },
    { id: 2, name: 'Sriracha Alt-Meat', status: 'Prototype' },
    { id: 3, name: 'Brioche', status: 'Approved' },
    { id: 4, name: 'Granola', status: 'Testing' },
    { id: 5, name: 'Yogurt', status: 'Review' },
    { id: 6, name: 'Protein Shake', status: 'Review' },
    { id: 7, name: 'Soy Isolate', status: 'Review' },
    { id: 8, name: 'Keto Bar', status: 'Testing' },
    { id: 9, name: 'Almond Cheese', status: 'Review' },
    { id: 10, name: 'Cashew Butter', status: 'Approved' },
  ];

  // Logic: Filter projects where status is 'Review'
  const pendingCount = projects.filter(p => p.status === 'Review').length;
  const hasPending = pendingCount > 0;

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-gray-500">Pending Approvals</span>
        <span className={`p-1.5 rounded-md ${hasPending ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'}`}>
            <AlertTriangle size={20} />
        </span>
      </div>
      <div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{pendingCount}</span>
          {hasPending && (
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
            {hasPending ? 'Needs review' : 'All caught up'}
        </p>
      </div>
    </div>
  );
};

export default PendingApprovalsCard;