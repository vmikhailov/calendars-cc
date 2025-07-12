import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface Stat {
  title: string;
  value: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './stats-cards.component.html'
})
export class StatsCardsComponent {
  stats: Stat[] = [
    {
      title: 'Active Rules',
      value: '2',
      icon: 'refresh-cw',
      color: 'primary'
    },
    {
      title: 'Events Synced Today',
      value: '27',
      icon: 'calendar',
      color: 'success'
    },
    {
      title: 'Success Rate',
      value: '98%',
      icon: 'check-circle',
      color: 'info'
    },
    {
      title: 'Need Attention',
      value: '1',
      icon: 'alert-triangle',
      color: 'warning'
    }
  ];
}