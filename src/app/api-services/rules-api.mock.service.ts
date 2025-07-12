import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Rule } from '../models/rule.model';
import { IRulesApiService } from './rules-api.interface';

const MOCK_RULES: Rule[] = [
    {
        id: '1',
        name: 'Work Hours Filter',
        description: 'Only sync events during work hours (9 AM - 6 PM)',
        status: 'active',
        lastModified: '2025-01-15 14:30',
        type: 'filter',
        code: `// Work Hours Filter Rule
function filterWorkHours(event) {
  const startHour = new Date(event.start).getHours();
  const endHour = new Date(event.end).getHours();
  
  // Only sync events between 9 AM and 6 PM
  return startHour >= 9 && endHour <= 18;
}

// Apply filter to event
return filterWorkHours(event);`
    },
    {
        id: '2',
        name: 'Meeting Title Transform',
        description: 'Add [WORK] prefix to all meeting titles',
        status: 'active',
        lastModified: '2025-01-14 16:45',
        type: 'transform',
        code: `// Meeting Title Transform Rule
function transformTitle(event) {
  // Add [WORK] prefix if not already present
  if (!event.title.startsWith('[WORK]')) {
    event.title = '[WORK] ' + event.title;
  }
  
  return event;
}

// Apply transformation
return transformTitle(event);`
    },
    {
        id: '3',
        name: 'Private Event Condition',
        description: 'Skip private events from synchronization',
        status: 'paused',
        lastModified: '2025-01-13 10:20',
        type: 'condition',
        code: `// Private Event Condition Rule
function isPrivateEvent(event) {
  // Check if event is marked as private
  return event.visibility === 'private' || 
         event.title.toLowerCase().includes('private') ||
         event.description?.toLowerCase().includes('confidential');
}

// Skip private events
return !isPrivateEvent(event);`
    },
    {
        id: '4',
        name: 'Weekend Filter',
        description: 'Exclude weekend events from sync',
        status: 'draft',
        lastModified: '2025-01-12 09:15',
        type: 'filter',
        code: `// Weekend Filter Rule
function isWeekend(event) {
  const eventDate = new Date(event.start);
  const dayOfWeek = eventDate.getDay();
  
  // Sunday = 0, Saturday = 6
  return dayOfWeek === 0 || dayOfWeek === 6;
}

// Exclude weekend events
return !isWeekend(event);`
    },
    {
        id: '5',
        name: 'Weekend Filter 2',
        description: 'Exclude weekend events from sync',
        status: 'draft',
        lastModified: '2025-01-12 09:15',
        type: 'filter',
        code: `// Weekend Filter Rule
function isWeekend(event) {
  const eventDate = new Date(event.start);
  const dayOfWeek = eventDate.getDay();
  
  // Sunday = 0, Saturday = 6
  return dayOfWeek === 0 || dayOfWeek === 6;
}

// Exclude weekend events
return !isWeekend(event);`
    },
    {
        id: '6',
        name: 'Weekend Filter 2',
        description: 'Exclude weekend events from sync',
        status: 'draft',
        lastModified: '2025-01-12 09:15',
        type: 'filter',
        code: `// Weekend Filter Rule
function isWeekend(event) {
  const eventDate = new Date(event.start);
  const dayOfWeek = eventDate.getDay();
  
  // Sunday = 0, Saturday = 6
  return dayOfWeek === 0 || dayOfWeek === 6;
}

// Exclude weekend events
return !isWeekend(event);`
    }
];

@Injectable({ providedIn: 'root' })
export class RulesApiMockService implements IRulesApiService {
    getRules(): Observable<Rule[]> {
        return of(MOCK_RULES);
    }
}