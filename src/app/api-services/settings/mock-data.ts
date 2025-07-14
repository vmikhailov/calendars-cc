import { AppSettings } from '../../models/user.model';

export const MOCK_SETTINGS: AppSettings = {
    notifications: {
        email: true,
        push: true,
        syncErrors: true,
        weeklyReport: false
    },
    sync: {
        frequency: '15min',
        autoRetry: true,
        maxRetries: 3
    },
    privacy: {
        shareUsageData: false,
        allowAnalytics: true
    },
    appearance: {
        theme: 'light',
        compactMode: false
    }
};
