export interface Rule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  lastModified: string;
  code: string;
  type: 'filter' | 'transform' | 'condition';
}

export interface SyncRule {
  id: string;
  name: string;
  source: string;
  target: string;
  status: 'active' | 'paused' | 'error';
  lastSync: string;
  frequency: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  rule: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export interface Event {
  id: string;
  title: string;
  time: string;
  location?: string;
  attendees?: number;
  calendar: string;
  color: string;
}

export interface CalendarSource {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'apple' | 'exchange';
  email: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  eventsCount: number;
  color: string;
  isDefault?: boolean;
}