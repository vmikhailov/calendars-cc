import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { Event } from '../../models/rule.model';

export interface ICalendarApiService {
    getEvents(): Observable<Event[]>;
}

export const CALENDAR_API_SERVICE = new InjectionToken<ICalendarApiService>('CalendarApiService');
