import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Rule } from '../models/rule.model';

@Injectable({
  providedIn: 'root'
})
export class RulesService {
  private rulesSubject = new BehaviorSubject<Rule[]>([
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
    }
  ]);

  private selectedRuleSubject = new BehaviorSubject<Rule | null>(null);

  public rules$ = this.rulesSubject.asObservable();
  public selectedRule$ = this.selectedRuleSubject.asObservable();

  constructor() {
    // Set first rule as selected by default
    const rules = this.rulesSubject.value;
    if (rules.length > 0) {
      this.selectedRuleSubject.next(rules[0]);
    }
  }

  getRules(): Observable<Rule[]> {
    return this.rules$;
  }

  getSelectedRule(): Observable<Rule | null> {
    return this.selectedRule$;
  }

  selectRule(rule: Rule): void {
    this.selectedRuleSubject.next(rule);
  }

  updateRule(updatedRule: Rule): void {
    const rules = this.rulesSubject.value;
    const index = rules.findIndex(rule => rule.id === updatedRule.id);
    if (index !== -1) {
      rules[index] = { ...updatedRule, lastModified: new Date().toLocaleString() };
      this.rulesSubject.next([...rules]);
      this.selectedRuleSubject.next(rules[index]);
    }
  }

  deleteRule(ruleId: string): void {
    const rules = this.rulesSubject.value.filter(rule => rule.id !== ruleId);
    this.rulesSubject.next(rules);
    
    const selectedRule = this.selectedRuleSubject.value;
    if (selectedRule?.id === ruleId) {
      this.selectedRuleSubject.next(rules.length > 0 ? rules[0] : null);
    }
  }

  duplicateRule(rule: Rule): void {
    const newRule: Rule = {
      ...rule,
      id: Date.now().toString(),
      name: `${rule.name} (Copy)`,
      status: 'draft',
      lastModified: new Date().toLocaleString()
    };
    
    const rules = this.rulesSubject.value;
    this.rulesSubject.next([...rules, newRule]);
  }

  toggleRuleStatus(ruleId: string): void {
    const rules = this.rulesSubject.value;
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      rule.status = rule.status === 'active' ? 'paused' : 'active';
      this.rulesSubject.next([...rules]);
      
      const selectedRule = this.selectedRuleSubject.value;
      if (selectedRule?.id === ruleId) {
        this.selectedRuleSubject.next(rule);
      }
    }
  }
}