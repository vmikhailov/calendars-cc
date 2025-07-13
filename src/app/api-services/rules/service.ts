import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rule } from '../../models/rule.model';
import { IRulesApiService } from './interface';
import { API_CONFIG, ApiConfig } from '../api-config';

@Injectable({ providedIn: 'root' })
export class RulesApiService implements IRulesApiService {
    constructor(
        private http: HttpClient,
        @Inject(API_CONFIG) private config: ApiConfig
    ) { }

    getRules(): Observable<Rule[]> {
        const url = this.config.getApiUrl('rules', 'getAll');
        return this.http.get<Rule[]>(url);
    }

    saveRule(rule: Rule): Observable<Rule> {
        const url = this.config.getApiUrl('rules', 'save');
        return this.http.post<Rule>(url, rule);
    }

    getRuleCode(ruleId: string): Observable<string | null> {
        const url = this.config.getApiUrl('rules', 'getCode', { id: ruleId });
        return this.http.get<string | null>(url);
    }

    saveRuleCode(ruleId: string, code: string): Observable<boolean> {
        const url = this.config.getApiUrl('rules', 'saveCode', { id: ruleId });
        return this.http.post<boolean>(url, { code });
    }

    deleteRule(ruleId: string): Observable<boolean> {
        const url = this.config.getApiUrl('rules', 'delete', { id: ruleId });
        return this.http.delete<boolean>(url);
    }

    enableRule(ruleId: string): Observable<boolean> {
        const url = this.config.getApiUrl('rules', 'enable', { id: ruleId });
        return this.http.post<boolean>(url, {});
    }

    disableRule(ruleId: string): Observable<boolean> {
        const url = this.config.getApiUrl('rules', 'disable', { id: ruleId });
        return this.http.post<boolean>(url, {});
    }

    pauseRule(ruleId: string): Observable<boolean> {
        const url = this.config.getApiUrl('rules', 'pause', { id: ruleId });
        return this.http.post<boolean>(url, {});
    }
}
