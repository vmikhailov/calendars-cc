import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Event } from '../../models/rule.model';

interface CalendarView {
  id: 'yesterday' | 'today' | 'tomorrow' | 'week';
  label: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './calendar.component.html'
})
export class CalendarComponent {
  activeView: 'yesterday' | 'today' | 'tomorrow' | 'week' = 'today';

  views: CalendarView[] = [
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'week', label: 'Week' }
  ];

  events: Event[] = [
    {
      id: '1',
      title: 'Team Meeting',
      time: '09:00 - 10:30',
      location: 'Conference Room A',
      attendees: 5,
      calendar: 'Work',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Project Presentation',
      time: '14:00 - 15:00',
      location: 'Main Conference Hall',
      attendees: 12,
      calendar: 'Work',
      color: 'bg-green-500'
    },
    {
      id: '3',
      title: 'Gym Workout',
      time: '18:00 - 19:30',
      location: 'Fitness Center',
      calendar: 'Personal',
      color: 'bg-purple-500'
    }
  ];

  setActiveView(view: 'yesterday' | 'today' | 'tomorrow' | 'week'): void {
    this.activeView = view;
  }

  getViewTitle(): string {
    switch (this.activeView) {
      case 'yesterday': return 'Yesterday';
      case 'today': return 'Today';
      case 'tomorrow': return 'Tomorrow';
      case 'week': return 'This Week';
      default: return 'Today';
    }
  }

  getViewDate(): string {
    const today = new Date();
    switch (this.activeView) {
      case 'yesterday': 
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return yesterday.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      case 'today': 
        return today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      case 'week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      default: 
        return today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
  }

  getEventsForView(): Event[] {
    if (this.activeView === 'week') {
      return [
        ...this.events,
        {
          id: '4',
          title: 'Client Call',
          time: '10:00 - 11:00',
          location: 'Video Conference',
          attendees: 3,
          calendar: 'Work',
          color: 'bg-orange-500'
        },
        {
          id: '5',
          title: 'Lunch Meeting',
          time: '12:30 - 13:30',
          location: 'Downtown Restaurant',
          attendees: 2,
          calendar: 'Work',
          color: 'bg-green-500'
        }
      ];
    }
    return this.events;
  }

  getViewButtonClass(viewId: string): string {
    const baseClass = 'px-3 py-1 text-sm rounded transition-all';
    return this.activeView === viewId 
      ? `${baseClass} bg-white shadow text-gray-900`
      : `${baseClass} text-gray-600 hover:text-gray-900`;
  }
}