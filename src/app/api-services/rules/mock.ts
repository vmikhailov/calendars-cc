import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Rule } from '../../models/rule.model';
import { IRulesApiService } from './interface';
import { MOCK_RULES } from "./mock.data";
import { rule } from "postcss";

@Injectable({ providedIn: 'root' })
export class RulesApiMockService implements IRulesApiService {
  private rules: Rule[] = MOCK_RULES;

  getRules(): Observable<Rule[]> {
    return of(this.rules);
  }

  saveRule(rule: Rule): Observable<Rule> {
    const index = this.rules.findIndex(r => r.id === rule.id);
    if (index !== -1) {
      this.rules[index] = rule;
    } else {
      this.rules.push(rule);
    }
    return of(rule);
  }

  getRuleCode(ruleId: string): Observable<string | null> {
    const rule = this.rules.find(r => r.id === ruleId);
    return of(rule ? rule.code : null);
  }

  saveRuleCode(ruleId: string, code: string): Observable<boolean> {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.code = code;
      return of(true);
    }
    return of(false);
  }

  deleteRule(ruleId: string): Observable<boolean> {
    const index = this.rules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      this.rules.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  enableRule(ruleId: string): Observable<boolean> {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      (rule as any).status = 'active';
      return of(true);
    }
    return of(false);
  }

  disableRule(ruleId: string): Observable<boolean> {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      (rule as any).status = 'disabled';
      return of(true);
    }
    return of(false);
  }

  pauseRule(ruleId: string): Observable<boolean> {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      (rule as any).status = 'paused';
      return of(true);
    }
    return of(false);
  }
}
