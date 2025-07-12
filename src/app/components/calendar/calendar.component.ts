import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Event } from '../../models/rule.model';
import { CALENDAR_API_SERVICE, ICalendarApiService } from "../../api-services/calendar/interface";

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
        {id: 'yesterday', label: 'Yesterday'},
        {id: 'today', label: 'Today'},
        {id: 'tomorrow', label: 'Tomorrow'},
        {id: 'week', label: 'Week'}
    ];

    events: Event[] = [];

    setActiveView(view: 'yesterday' | 'today' | 'tomorrow' | 'week'): void {
        this.activeView = view;
        this.loadEvents();
    }

    constructor(@Inject(CALENDAR_API_SERVICE) private calendarApi: ICalendarApiService) {
        this.loadEvents();
    }

    loadEvents(): void {
        this.calendarApi.getEvents().subscribe(events => {
            this.events = events;
        });
    }

    getViewTitle(): string {
        switch (this.activeView) {
            case 'yesterday':
                return 'Yesterday';
            case 'today':
                return 'Today';
            case 'tomorrow':
                return 'Tomorrow';
            case 'week':
                return 'This Week';
            default:
                return 'Today';
        }
    }

    getViewDate(): string {
        const today = new Date();
        switch (this.activeView) {
            case 'yesterday':
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                return yesterday.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            case 'today':
                return today.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            case 'tomorrow':
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                return tomorrow.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            case 'week':
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                return `${startOfWeek.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                })} - ${endOfWeek.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}`;
            default:
                return today.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
        }
    }

    getEventsForView(): Event[] {
        // In a real app, filter events by view (date/week). Here, return all mock events.
        return this.events;
    }

    getViewButtonClass(viewId: string): string {
        const baseClass = 'px-3 py-1 text-sm rounded transition-all';
        return this.activeView === viewId
            ? `${baseClass} bg-white shadow text-gray-900`
            : `${baseClass} text-gray-600 hover:text-gray-900`;
    }
}