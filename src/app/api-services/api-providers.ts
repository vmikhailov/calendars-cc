import { environment } from '../../environments/environment';
import { Provider } from '@angular/core';
import { API_CONFIG } from './api-config';
import { DEFAULT_API_CONFIG } from './api-config';

import { RULES_API_SERVICE } from './rules/interface';
import { RulesApiService } from './rules/service';
import { RulesApiMockService } from './rules/mock-service';

import { STATS_API_SERVICE } from './stats/interface';
import { StatsApiService } from './stats/service';
import { StatsApiMockService } from './stats/mock-service';

import { CALENDAR_API_SERVICE } from './calendar/interface';
import { CalendarApiService } from './calendar/service';
import { CalendarApiMockService } from './calendar/mock-service';

import { BILLING_API_SERVICE } from './billing/interface';
import { BillingApiService } from './billing/service';
import { BillingMockApiService } from './billing/mock-service';

import { SETTINGS_API_SERVICE } from './settings/interface';
import { SettingsApiService } from './settings/service';
import { SettingsApiMockService } from './settings/mock-service';

const realProviders: Provider[] = [
    { provide: API_CONFIG, useValue: DEFAULT_API_CONFIG },
    { provide: RULES_API_SERVICE, useClass: RulesApiService },
    { provide: STATS_API_SERVICE, useClass: StatsApiService },
    { provide: CALENDAR_API_SERVICE, useClass: CalendarApiService },
    { provide: BILLING_API_SERVICE, useClass: BillingApiService },
    { provide: SETTINGS_API_SERVICE, useClass: SettingsApiService },
];

const mockProviders: Provider[] = [
    { provide: API_CONFIG, useValue: DEFAULT_API_CONFIG },
    { provide: RULES_API_SERVICE, useClass: RulesApiMockService },
    { provide: STATS_API_SERVICE, useClass: StatsApiMockService },
    { provide: CALENDAR_API_SERVICE, useClass: CalendarApiMockService },
    { provide: BILLING_API_SERVICE, useClass: BillingMockApiService },
    { provide: SETTINGS_API_SERVICE, useClass: SettingsApiMockService },
];

// Export the correct providers based on environments
export const apiProviders: Provider[] = (environment.apiRoot === null) ? mockProviders : realProviders;