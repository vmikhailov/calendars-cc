import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CalendarSource } from '../../models/rule.model';

@Component({
  selector: 'app-calendar-sources',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './calendar-sources.component.html'
})
export class CalendarSourcesComponent {
  showAddModal = false;

  calendarSources: CalendarSource[] = [
    {
      id: '1',
      name: 'Work Calendar',
      type: 'google',
      email: 'john.doe@company.com',
      status: 'connected',
      lastSync: '2 min ago',
      eventsCount: 15,
      color: 'bg-blue-500',
      isDefault: true
    },
    {
      id: '2',
      name: 'Personal Calendar',
      type: 'outlook',
      email: 'john.doe@outlook.com',
      status: 'connected',
      lastSync: '5 min ago',
      eventsCount: 8,
      color: 'bg-green-500'
    },
    {
      id: '3',
      name: 'Family Calendar',
      type: 'apple',
      email: 'family@icloud.com',
      status: 'error',
      lastSync: '2 hours ago',
      eventsCount: 3,
      color: 'bg-purple-500'
    }
  ];

  providers = [
    { name: 'Google', icon: 'calendar' },
    { name: 'Outlook', icon: 'calendar' },
    { name: 'Apple', icon: 'calendar' },
    { name: 'Exchange', icon: 'calendar' }
  ];

  getStatusColor(status: string): string {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  }

  getProviderIcon(type: string): string {
    switch (type) {
      case 'google': return 'calendar';
      case 'outlook': return 'calendar';
      case 'apple': return 'calendar';
      case 'exchange': return 'calendar';
      default: return 'calendar';
    }
  }
}