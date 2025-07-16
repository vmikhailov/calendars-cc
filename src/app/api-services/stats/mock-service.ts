
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Stat, IStatsApiService } from './interface';
import { MOCK_STATS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class StatsApiMockService implements IStatsApiService {
    getStats(): Observable<Stat[]> {
        return of(MOCK_STATS);
    }
}
