import React from 'react';
import { useState } from 'react';
import Navigation from './components/Navigation';
import StatsCards from './components/StatsCards';
import Calendar from './components/Calendar';
import SyncRules from './components/SyncRules';
import SyncLogs from './components/SyncLogs';
import Profile from './components/Profile';
import Billing from './components/Billing';
import Settings from './components/Settings';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'logs':
        return <SyncLogs />;
      case 'profile':
        return <Profile />;
      case 'billing':
        return <Billing />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Manage your calendar synchronization</p>
            </div>
            
            <StatsCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <Calendar />
              </div>
              <div>
                <SyncRules />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;