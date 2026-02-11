import React from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Formulation from './pages/Formulation'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'
import Schedule from './pages/Schedule'
import Runs from './pages/Runs'
import { SettingsProvider } from './context/SettingsContext'
import { NotificationProvider } from './context/NotificationContext'

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <NotificationProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/project/:id" element={<Formulation />} />
              <Route path="/runs" element={<Runs />} />
              {/* Legacy route redirection */}
              <Route
                path="/formulations"
                element={<Navigate to="/" replace />}
              />
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
  )
}

export default App
