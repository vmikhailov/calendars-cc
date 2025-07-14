import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Stat, IStatsApiService } from './interface';
import { API_CONFIG, ApiConfig } from "../api-config";

const PLACE_HOLDERS: StatDto[] = [
    {
        title: 'Active Rules',
        value: null,
        kind: 'Value',
        icon: 'Refresh',
    },
    {
        title: 'Events Synced Today',
        value: null,
        kind: 'Value',
        icon: 'Calendar'
    },
    {
        title: 'Success Rate',
        value: null,
        kind: 'Value',
        icon: 'Check',
    },
    {
        title: 'Need Attention',
        value: null,
        kind: 'Value',
        icon: 'Alert',
    }
];

interface StatDto {
    title: string;
    value: number | null;
    kind: string;
    icon: string;
}

const ICON_MAP: { [key: string]: { icon: string; color: string; bgColor: string; textColor: string } } = {
    Calendar: {
        icon: 'calendar',
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700'
    },
    Refresh: {
        icon: 'refresh-cw',
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700'
    },
    Check: {
        icon: 'check-circle',
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700'
    },
    Alert: {
        icon: 'alert-triangle',
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700'
    }
};

@Injectable({ providedIn: 'root' })
export class StatsApiService implements IStatsApiService {
    constructor(
        private http: HttpClient,
        @Inject(API_CONFIG) private config: ApiConfig) {
        this.mapAllStats = this.mapAllStats.bind(this);
        this.mapStatDto = this.mapStatDto.bind(this);
    }

    getStats(): Observable<Stat[]> {
        console.log('Getting stats...');
        const url = this.config.getApiUrl('stats', 'getAll');
        return this.http.get<StatDto[]>(url).pipe(
            map(this.mapAllStats),
            catchError((e: any) => {
                console.error('Error fetching stats:', e);
                return of(this.mapAllStats(PLACE_HOLDERS));
            })
        );
    }

    private mapAllStats(stats: StatDto[]): Stat[] {
        return stats.map(this.mapStatDto);
    }

    private mapStatDto(dto: StatDto): Stat {
        const iconInfo = ICON_MAP[dto.icon] || { icon: '', color: '', bgColor: '', textColor: '' };
        return {
            title: dto.title,
            value: dto.value === null ? '-' : dto.value.toString(),
            icon: iconInfo.icon,
            color: iconInfo.color,
            bgColor: iconInfo.bgColor,
            textColor: iconInfo.textColor
        };
    }
}

