import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../../models/user.model';
import { ISettingsApiService } from './interface';
import { API_CONFIG, ApiConfig } from '../api-config';

@Injectable({ providedIn: 'root' })
export class SettingsApiService implements ISettingsApiService {
    constructor(
        private http: HttpClient,
        @Inject(API_CONFIG) private config: ApiConfig
    ) { }

    getSettings(): Observable<AppSettings> {
        const url = this.config.getApiUrl('settings', 'get');
        return this.http.get<AppSettings>(url);
    }

    updateSettings(settings: AppSettings): Observable<AppSettings> {
        const url = this.config.getApiUrl('settings', 'update');
        return this.http.put<AppSettings>(url, settings);
    }
}
