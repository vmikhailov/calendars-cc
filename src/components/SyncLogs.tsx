import React, { useState } from 'react';
import { Filter, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  rule: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

const logs: LogEntry[] = [
  {
    id: '1',
    timestamp: '15:23:45',
    rule: 'Work → Main',
    status: 'success',
    message: 'Sync completed successfully',
    details: 'Synchronized 3 events'
  },
  {
    id: '2',
    timestamp: '15:08:30',
    rule: 'Personal → Main',
    status: 'success',
    message: 'Sync completed successfully',
    details: 'Synchronized 1 event'
  },
  {
    id: '3',
    timestamp: '14:45:12',
    rule: 'Family → Shared',
    status: 'warning',
    message: 'Sync paused by user'
  },
  {
    id: '4',
    timestamp: '14:30:08',
    rule: 'Work → Main',
    status: 'error',
    message: 'Authorization error',
    details: 'Google Calendar re-authorization required'
  },
  {
    id: '5',
    timestamp: '14:08:45',
    rule: 'Personal → Main',
    status: 'success',
    message: 'Sync completed successfully',
    details: 'Synchronized 2 events'
  }
];

const SyncLogs: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'success' | 'error' | 'warning'>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <RefreshCw className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Sync Logs</h2>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded ${filter === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('success')}
              className={`px-3 py-1 text-sm rounded ${filter === 'success' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
            >
              Success
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-3 py-1 text-sm rounded ${filter === 'error' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
            >
              Errors
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-3 py-1 text-sm rounded ${filter === 'warning' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
            >
              Warnings
            </button>
          </div>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-sm ${getStatusColor(log.status)}`}
            onClick={() => setShowDetails(showDetails === log.id ? null : log.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(log.status)}
                <div>
                  <div className="text-sm font-medium text-gray-900">{log.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {log.timestamp} • {log.rule}
                  </div>
                </div>
              </div>
              
              {log.details && (
                <div className="text-xs text-gray-400">
                  {showDetails === log.id ? '▼' : '▶'}
                </div>
              )}
            </div>
            
            {showDetails === log.id && log.details && (
              <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                {log.details}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {filteredLogs.length === 0 && (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No logs to display</p>
        </div>
      )}
    </div>
  );
};

export default SyncLogs;