import { InjectionToken } from '@angular/core';
import { Rule } from '../../models/rule.model';
import { Observable } from 'rxjs';

export interface IRulesApiService {
    getRules(): Observable<Rule[]>;

    saveRule(rule: Rule): Observable<Rule>;

    getRuleCode(ruleId: string): Observable<string | null>;

    saveRuleCode(ruleId: string, code: string): Observable<boolean>;

    deleteRule(ruleId: string): Observable<boolean>;

    enableRule(ruleId: string): Observable<boolean>;

    disableRule(ruleId: string): Observable<boolean>;

    pauseRule(ruleId: string): Observable<boolean>;
}

export const RULES_API_SERVICE = new InjectionToken<IRulesApiService>('RulesApiService');
