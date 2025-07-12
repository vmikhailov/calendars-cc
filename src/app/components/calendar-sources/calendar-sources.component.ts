import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CalendarSource } from '../../models/rule.model';

@Component({
  selector: 'app-calendar-sources',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Calendar Sources</h2>
          <lucide-icon name="calendar" class="w-6 h-6 text-blue-600"></lucide-icon>
          (click)="showAddModal = true"
          class="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <lucide-icon name="plus" class="h-4 w-4"></lucide-icon>
          <span>Add Calendar</span>
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          *ngFor="let source of calendarSources"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all card-hover"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div [class]="'w-4 h-4 rounded-full ' + source.color"></div>
              <div>
                <h3 class="font-medium text-gray-900">{{ source.name }}</h3>
                <p class="text-sm text-gray-500">{{ source.email }}</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <div [class]="'status-dot ' + getStatusColor(source.status)"></div>
              <span [class]="'text-xs px-2 py-1 rounded-full ' + getStatusBadgeClass(source.status)">
                {{ getStatusText(source.status) }}
              </span>
            </div>
          </div>
          
          <div class="flex items-center justify-between text-sm text-gray-600">
            <div class="flex items-center space-x-1">
              <lucide-icon [name]="getProviderIcon(source.type)" class="h-4 w-4"></lucide-icon>
              <span class="capitalize">{{ source.type }}</span>
            </div>
            <span>{{ source.eventsCount }} events</span>
          </div>
          
          <div class="text-xs text-gray-500 mt-2">
            Last sync: {{ source.lastSync }}
          </div>
        </div>
      </div>
      
      <!-- Add Calendar Modal -->
      <div *ngIf="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Calendar Source</h3>
              <lucide-icon name="calendar" class="w-5 h-5 text-blue-600"></lucide-icon>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Calendar Provider</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  *ngFor="let provider of providers"
                  class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <lucide-icon [name]="provider.icon" class="h-5 w-5 text-gray-600"></lucide-icon>
                  <span class="font-medium text-gray-900">{{ provider.name }}</span>
                </button>
              <lucide-icon *ngIf="source.status === 'connected'" name="check-circle" class="w-5 h-5 text-green-500"></lucide-icon>
              <lucide-icon *ngIf="source.status === 'error'" name="alert-circle" class="w-5 h-5 text-red-500"></lucide-icon>
              <lucide-icon *ngIf="source.status === 'syncing'" name="clock" class="w-5 h-5 text-blue-500"></lucide-icon>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              <lucide-icon name="clock" class="w-4 h-4 text-gray-400"></lucide-icon>
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `
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