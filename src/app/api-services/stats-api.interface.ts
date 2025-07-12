import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";

export interface Stat {
    title: string;
    value: string;
    icon: string;
    color: string;
    bgColor: string;
    textColor: string;
}

export interface IStatsApiService {
    getStats(): Observable<Stat[]>;
}

export const STATS_API_SERVICE = new InjectionToken<IStatsApiService>('StatsApiService');