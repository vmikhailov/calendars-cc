import { InjectionToken } from '@angular/core';
import { Rule } from '../models/rule.model';
import { Observable } from 'rxjs';

export interface IRulesApiService {
    getRules(): Observable<Rule[]>;
}

export const RULES_API_SERVICE = new InjectionToken<IRulesApiService>('RulesApiService');