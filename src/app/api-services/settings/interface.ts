import { Observable } from 'rxjs';
import { AppSettings } from '../../models/user.model';

export interface ISettingsApiService {
    getSettings(): Observable<AppSettings>;
    updateSettings(settings: AppSettings): Observable<AppSettings>;
}

export const SETTINGS_API_SERVICE = 'SETTINGS_API_SERVICE';
