import * as environment from '../../environments/environment';
import { Provider } from '@angular/core';
import { RULES_API_SERVICE } from './rules-api.interface';
import { RulesApiService } from './rules-api.service';
import { RulesApiMockService } from './rules-api.mock.service';
import { STATS_API_SERVICE } from "./stats-api.interface";
import { StatsApiService } from "./stats-api.service";
import { StatsApiMockService } from "./stats-api.mock.service";

const realProviders: Provider[] = [
    { provide: RULES_API_SERVICE, useClass: RulesApiService },
    { provide: STATS_API_SERVICE, useClass: StatsApiService }
];

const mockProviders: Provider[] = [
    { provide: RULES_API_SERVICE, useClass: RulesApiMockService },
    { provide: STATS_API_SERVICE, useClass: StatsApiMockService }
];

// Export the correct providers based on environments
export const apiProviders: Provider[] = environment.useMocks ? mockProviders : realProviders;