import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, FlaskConical } from 'lucide-react';
import { Project } from '../types';
import { MOCK_LAB_REPORTS } from '../constants';
import ProjectCard from '../components/ProjectCard';
import NewProjectModal from '../components/NewProjectModal';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import ProfileHeader from '../components/ProfileHeader';
import { ResponsiveContainer, BarChart, Bar, Cell, Tooltip } from 'recharts';
import { useSettings } from '../context/SettingsContext';

interface DashboardProps {
  projects: Project[];
  onAddProject: (project: Project) => void;
  onUpdateProject?: (project: Project) => void; 
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onAddProject, onUpdateProject }) => {
  const { t, isRTL } = useSettings();
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleOpenDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 200);
  };

  const handleProjectUpdate = (updated: Project) => {
      if (onUpdateProject) {
          onUpdateProject(updated);
      }
      if (selectedProject?.id === updated.id) {
          setSelectedProject(updated);
      }
  };

  const handleDuplicateProject = (project: Project) => {
      const copy: Project = {
          ...project,
          id: `proj-${Date.now()}`,
          name: `${project.name} (Copy)`,
          version: '1.0',
          updatedAt: 'Just now',
          status: 'Testing' as any
      };
      onAddProject(copy);
  };

  const handleDeleteProject = (projectId: string) => {
      console.log("Delete requested for", projectId);
  };

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'All' ? true : 
                          filter === 'Active' ? p.status !== 'Approved' :
                          filter === 'Completed' ? p.status === 'Approved' : true;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const capacityData = [
    { name: 'Mon', value: 65 },
    { name: 'Tue', value: 80 },
    { name: 'Wed', value: 45 },
    { name: 'Thu', value: 90 },
    { name: 'Fri', value: 55 },
    { name: 'Sat', value: 20 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* Left Panel: Stats & Profile */}
      {/* 
          Mobile: w-full, order-1 (Stacks on top)
          Desktop: lg:w-80, order-1 (Stays on 'Start' side)
      */}
      <div className="w-full lg:w-80 xl:w-96 space-y-6 order-1 lg:order-1 flex-shrink-0">
         
         {/* Dynamic Profile Header with Notifications */}
         <ProfileHeader />

         {/* Lab Capacity Chart */}
         <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100/50 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-slate-100">78%</h3>
                    <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">{t('labCapacity')}</p>
                </div>
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold">Optimal</div>
            </div>
            {/* Force LTR for charts to prevent rendering issues in RTL mode */}
            <div className="h-40" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={capacityData}>
                        <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                            {capacityData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={index === 3 ? '#1a1a1a' : '#E5E7EB'} 
                                    className={index === 3 ? 'dark:fill-indigo-500' : 'dark:fill-slate-700'}
                                />
                            ))}
                        </Bar>
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* Recent Reports */}
         <div className="bg-[#FFE4E1]/30 dark:bg-rose-900/10 rounded-[2.5rem] p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-slate-100">{t('recentReports')}</h3>
                <button className="w-8 h-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <MoreHorizontal size={16} />
                </button>
            </div>
            <div className="space-y-4">
                {MOCK_LAB_REPORTS.slice(0, 3).map((report, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-sm hover:scale-105 transition-transform cursor-pointer">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            i % 2 === 0 
                                ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300' 
                                : 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300'
                        }`}>
                            <FlaskConical size={20} />
                        </div>
                        <div className="flex-1 min-w-0 text-start">
                            <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm truncate">{report.projectName}</h4>
                            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{report.results[0]?.parameter} • {report.status}</p>
                        </div>
                        <span className="text-xs font-bold text-gray-400 dark:text-slate-500">4.8</span>
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* Main Content: Projects Grid */}
      <div className="flex-1 space-y-8 order-2 lg:order-2 min-w-0">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 ps-2">
           <div className="text-start">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 tracking-tight mb-4 md:mb-2 whitespace-pre-line">
                  {t('investInnovation')}
              </h1>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                 {[
                    { key: 'All', label: t('all') }, 
                    { key: 'Active', label: t('active') }, 
                    { key: 'Completed', label: t('completed') }
                 ].map(item => (
                    <button
                        key={item.key}
                        onClick={() => setFilter(item.key)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                            filter === item.key 
                                ? 'bg-gray-900 dark:bg-indigo-600 text-white' 
                                : 'bg-white dark:bg-[#1e293b] text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        {item.label}
                    </button>
                 ))}
              </div>
           </div>
           
           {/* Search & Actions */}
           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative group flex-1 md:flex-none">
                {/* Logical Properties: start-4 (positions left/right based on dir), ps-11 (padding start) */}
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-gray-900 dark:group-focus-within:text-white transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder={t('search')} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 ps-11 pe-6 py-3 bg-white dark:bg-[#1e293b] rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-indigo-500/50 shadow-sm text-gray-900 dark:text-slate-100 dark:placeholder-slate-500 border border-transparent dark:border-slate-700"
                />
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-12 h-12 bg-gray-900 dark:bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-gray-800 dark:hover:bg-indigo-500 transition-colors shadow-lg shadow-gray-900/20 dark:shadow-indigo-600/20 flex-shrink-0"
                title={t('newProject')}
              >
                <Plus size={24} />
              </button>
           </div>
        </div>

        {/* Projects Grid: Responsive columns with local stacking context */}
        {/* grid-cols-1 on mobile ensures full width cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 relative z-0">
            {filteredProjects.map(project => (
                <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onViewDetails={handleOpenDetails}
                    onDuplicate={handleDuplicateProject}
                    onDelete={handleDeleteProject}
                />
            ))}
            
            {/* Add New Project Placeholder Card */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-slate-500 hover:border-gray-300 dark:hover:border-slate-500 hover:text-gray-500 dark:hover:text-slate-300 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-all h-[280px] group"
            >
                <div className="w-16 h-16 rounded-full bg-white dark:bg-[#1e293b] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Plus size={32} />
                </div>
                <span className="font-bold text-sm">{t('newProject')}</span>
            </button>
        </div>
      </div>

      <NewProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={onAddProject} 
      />

      <ProjectDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        project={selectedProject}
        onUpdateProject={handleProjectUpdate}
      />
    </div>
  );
};

export default Dashboard;