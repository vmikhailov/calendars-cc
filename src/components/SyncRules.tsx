import React, { useState } from 'react';
import { Plus, ArrowRight, Settings, Trash2, Play, Pause } from 'lucide-react';

interface SyncRule {
  id: string;
  name: string;
  source: string;
  target: string;
  status: 'active' | 'paused' | 'error';
  lastSync: string;
  frequency: string;
}

const syncRules: SyncRule[] = [
  {
    id: '1',
    name: 'Work → Main',
    source: 'Google Calendar (Work)',
    target: 'Outlook (Main)',
    status: 'active',
    lastSync: '5 min ago',
    frequency: 'Every 15 min'
  },
  {
    id: '2',
    name: 'Personal → Main',
    source: 'Apple Calendar (Personal)',
    target: 'Outlook (Main)',
    status: 'active',
    lastSync: '2 min ago',
    frequency: 'Every 30 min'
  },
  {
    id: '3',
    name: 'Family → Shared',
    source: 'Google Calendar (Family)',
    target: 'Google Calendar (Shared)',
    status: 'paused',
    lastSync: '2 hours ago',
    frequency: 'Every hour'
  }
];

const SyncRules: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'paused': return 'Paused';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Sync Rules</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Rule</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {syncRules.map((rule) => (
          <div
            key={rule.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all card-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`status-dot ${getStatusColor(rule.status)} ${rule.status === 'active' ? 'pulse-success' : ''}`}></div>
                <h3 className="font-medium text-gray-900">{rule.name}</h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                  {rule.status === 'active' ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{rule.source}</span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded">{rule.target}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Status: <span className="font-medium">{getStatusText(rule.status)}</span></span>
                <span>Frequency: {rule.frequency}</span>
              </div>
              <span>Last sync: {rule.lastSync}</span>
            </div>
          </div>
        ))}
      </div>
      
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">New Sync Rule</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Work → Personal"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Calendar</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Google Calendar (Work)</option>
                  <option>Outlook (Personal)</option>
                  <option>Apple Calendar</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Calendar</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Outlook (Main)</option>
                  <option>Google Calendar (Shared)</option>
                  <option>Apple Calendar</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sync Frequency</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Every 15 minutes</option>
                  <option>Every 30 minutes</option>
                  <option>Every hour</option>
                  <option>Every 6 hours</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncRules;