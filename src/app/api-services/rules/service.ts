import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rule } from '../../models/rule.model';
import { IRulesApiService } from './interface';

@Injectable({ providedIn: 'root' })
export class RulesApiService implements IRulesApiService {
    private apiUrl = '/api/rules';

    constructor(private http: HttpClient) {
    }

    getRules(): Observable<Rule[]> {
        return this.http.get<Rule[]>(this.apiUrl);
    }
}
