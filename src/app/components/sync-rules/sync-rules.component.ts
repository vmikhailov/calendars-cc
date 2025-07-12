import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { SyncRule } from '../../models/rule.model';

@Component({
  selector: 'app-sync-rules',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sync-rules.component.html'
})
export class SyncRulesComponent {
  showAddModal = false;

  syncRules: SyncRule[] = [
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'paused': return 'Paused';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  }
}