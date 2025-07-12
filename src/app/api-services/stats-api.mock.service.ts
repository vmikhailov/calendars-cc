import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Stat, IStatsApiService } from './stats-api.interface';

const MOCK_STATS: Stat[] = [
  {
    title: 'Active Rules',
    value: '20',
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

@Injectable({ providedIn: 'root' })
export class StatsApiMockService implements IStatsApiService {
  getStats(): Observable<Stat[]> {
    return of(MOCK_STATS);
  }
}