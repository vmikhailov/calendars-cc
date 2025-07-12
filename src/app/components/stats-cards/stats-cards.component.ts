import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface Stat {
  title: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
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
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Events Synced Today',
      value: '27',
      icon: 'calendar',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Success Rate',
      value: '98%',
      icon: 'check-circle',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Need Attention',
      value: '1',
      icon: 'alert-triangle',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    }
  ];
}