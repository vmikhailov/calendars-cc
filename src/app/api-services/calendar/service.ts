import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../models/rule.model';
import { ICalendarApiService } from './interface';

@Injectable({ providedIn: 'root' })
export class CalendarApiService implements ICalendarApiService {
    private apiUrl = '/api/events';

    constructor(private http: HttpClient) { }

    getEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(this.apiUrl);
    }
}
