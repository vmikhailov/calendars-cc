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
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        *ngFor="let stat of stats"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-hover"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">{{ stat.title }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
          </div>
          <div [class]="'p-3 rounded-lg ' + stat.bgColor">
            <lucide-icon [name]="stat.icon" [class]="'h-6 w-6 ' + stat.textColor"></lucide-icon>
          </div>
        </div>
      </div>
    </div>
  `
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