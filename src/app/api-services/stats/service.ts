import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stat, IStatsApiService } from './interface';

@Injectable({ providedIn: 'root' })
export class StatsApiService implements IStatsApiService {
    constructor(private http: HttpClient) { }

    getStats(): Observable<Stat[]> {
        return this.http.get<Stat[]>('/api/stats');
    }
}
