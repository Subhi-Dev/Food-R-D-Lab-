import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Formulation from './pages/Formulation';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Schedule from './pages/Schedule';
import Runs from './pages/Runs';
import { MOCK_PROJECTS } from './constants';
import { Project } from './types';
import { SettingsProvider } from './context/SettingsContext';
import { NotificationProvider } from './context/NotificationContext';

const App: React.FC = () => {
  // State Lifting: Manage projects at the App level to ensure persistence
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  // Handler to add a new project (passed to Dashboard)
  const handleAddProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
  };

  // Handler to update an existing project (passed to Formulation)
  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  return (
    <SettingsProvider>
      <NotificationProvider>
        <Router>
          <Layout>
            <Routes>
              <Route 
                path="/" 
                element={
                  <Dashboard 
                    projects={projects} 
                    onAddProject={handleAddProject} 
                  />
                } 
              />
              <Route 
                path="/project/:id" 
                element={
                  <Formulation 
                    projects={projects} 
                    onUpdateProject={handleUpdateProject} 
                  />
                } 
              />
              <Route 
                path="/runs" 
                element={
                  <Runs projects={projects} />
                } 
              />
              {/* Legacy route redirection */}
              <Route path="/formulations" element={<Navigate to="/" replace />} />
              
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/schedule" element={<Schedule />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </NotificationProvider>
    </SettingsProvider>
  );
};

export default App;