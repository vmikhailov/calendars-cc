import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardsComponent } from '../stats-cards/stats-cards.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { SyncRulesComponent } from '../sync-rules/sync-rules.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCardsComponent, CalendarComponent, SyncRulesComponent],
  template: `
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600">Manage your calendar synchronization</p>
    </div>
    
    <app-stats-cards></app-stats-cards>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <div class="lg:col-span-2">
        <app-calendar></app-calendar>
      </div>
      <div>
        <app-sync-rules></app-sync-rules>
      </div>
    </div>
  `
})
export class DashboardComponent {}