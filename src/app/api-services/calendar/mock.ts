import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from '../../models/rule.model';
import { ICalendarApiService } from './interface';
import { MOCK_EVENTS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class CalendarApiMockService implements ICalendarApiService {
    getEvents(): Observable<Event[]> {
        return of(MOCK_EVENTS);
    }
}
