import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardsComponent } from '../stats-cards/stats-cards.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { SyncRulesComponent } from '../sync-rules/sync-rules.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCardsComponent, CalendarComponent, SyncRulesComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {}