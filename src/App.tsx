import React from 'react';
import { Navigation } from './components/Navigation';
import { KanbanBoard } from './components/KanbanBoard';
import { SprintPlanning } from './components/SprintPlanning';
import { SprintList } from './components/SprintList';
import { Login } from './components/Login';
import { HomePage } from './components/HomePage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeamManagement } from './components/admin/TeamManagement';
import { useStore } from './store/useStore';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  const { currentUser } = useStore();
  const [activeView, setActiveView] = React.useState('dashboard');
 
  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fadeIn">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<KanbanBoard />} />
            <Route path="/sprints" element={<SprintList />} />
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/settings" element={currentUser.role === 'admin' ? <AdminDashboard /> : null} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;