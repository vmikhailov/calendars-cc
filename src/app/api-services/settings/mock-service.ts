import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppSettings } from '../../models/user.model';
import { ISettingsApiService } from './interface';
import { MOCK_SETTINGS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class SettingsApiMockService implements ISettingsApiService {
    private settings = { ...MOCK_SETTINGS };

    getSettings(): Observable<AppSettings> {
        return of({ ...this.settings });
    }

    updateSettings(settings: AppSettings): Observable<AppSettings> {
        this.settings = { ...settings };
        return of({ ...this.settings });
    }
}
