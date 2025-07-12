import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Filter, CheckCircle, XCircle, AlertTriangle, RefreshCw, Loader } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  rule: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

// Generate more sample logs for demonstration
const generateLogs = (page: number, pageSize: number): LogEntry[] => {
  const logs: LogEntry[] = [];
  const statuses: ('success' | 'error' | 'warning')[] = ['success', 'error', 'warning'];
  const rules = ['Work → Main', 'Personal → Main', 'Family → Shared', 'Team → Project', 'Client → Work'];
  const messages = {
    success: ['Sync completed successfully', 'All events synchronized', 'Sync finished without errors'],
    error: ['Authorization error', 'Network timeout', 'Calendar not found', 'Rate limit exceeded'],
    warning: ['Sync paused by user', 'Partial sync completed', 'Some events skipped']
  };

  for (let i = 0; i < pageSize; i++) {
    const index = page * pageSize + i;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const rule = rules[Math.floor(Math.random() * rules.length)];
    const message = messages[status][Math.floor(Math.random() * messages[status].length)];
    
    // Generate timestamp going backwards in time
    const now = new Date();
    const minutesAgo = index * 5 + Math.floor(Math.random() * 30);
    const timestamp = new Date(now.getTime() - minutesAgo * 60000);
    
    logs.push({
      id: `log-${index}`,
      timestamp: timestamp.toLocaleTimeString('en-US', { hour12: false }),
      rule,
      status,
      message,
      details: status === 'success' ? `Synchronized ${Math.floor(Math.random() * 10) + 1} events` : 
               status === 'error' ? 'Re-authorization required' : undefined
    });
  }
  
  return logs;
};

const SyncLogs: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'success' | 'error' | 'warning'>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const pageSize = 20;

  // Load initial logs
  useEffect(() => {
    const initialLogs = generateLogs(0, pageSize);
    setLogs(initialLogs);
    setPage(1);
  }, []);

  // Load more logs
  const loadMoreLogs = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newLogs = generateLogs(page, pageSize);
    
    if (newLogs.length < pageSize) {
      setHasMore(false);
    }
    
    setLogs(prevLogs => [...prevLogs, ...newLogs]);
    setPage(prevPage => prevPage + 1);
    setLoading(false);
  }, [loading, hasMore, page]);

  // Set up intersection observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreLogs();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreLogs, hasMore, loading]);

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

  const getFilterCount = (filterType: 'all' | 'success' | 'error' | 'warning') => {
    if (filterType === 'all') return logs.length;
    return logs.filter(log => log.status === filterType).length;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sync Logs</h1>
        <p className="text-gray-600">Monitor synchronization activity and troubleshoot issues</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm rounded transition-all ${
                    filter === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                  }`}
                >
                  All ({getFilterCount('all')})
                </button>
                <button
                  onClick={() => setFilter('success')}
                  className={`px-3 py-1 text-sm rounded transition-all ${
                    filter === 'success' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Success ({getFilterCount('success')})
                </button>
                <button
                  onClick={() => setFilter('error')}
                  className={`px-3 py-1 text-sm rounded transition-all ${
                    filter === 'error' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Errors ({getFilterCount('error')})
                </button>
                <button
                  onClick={() => setFilter('warning')}
                  className={`px-3 py-1 text-sm rounded transition-all ${
                    filter === 'warning' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Warnings ({getFilterCount('warning')})
                </button>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-h-[600px] overflow-y-auto">
          <div className="space-y-3 p-6">
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

          {/* Loading indicator and intersection observer target */}
          <div ref={loadingRef} className="p-6">
            {loading && (
              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading more logs...</span>
              </div>
            )}
            
            {!hasMore && logs.length > 0 && (
              <div className="text-center text-gray-500 text-sm">
                No more logs to load
              </div>
            )}
          </div>
        </div>
        
        {filteredLogs.length === 0 && !loading && (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No logs to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncLogs;