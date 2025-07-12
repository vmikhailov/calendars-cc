export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  company?: string;
  role?: string;
  timezone: string;
  language: string;
  joinedDate: string;
  lastLogin: string;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  current?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl?: string;
}

export interface AppSettings {
  notifications: {
    email: boolean;
    push: boolean;
    syncErrors: boolean;
    weeklyReport: boolean;
  };
  sync: {
    frequency: string;
    autoRetry: boolean;
    maxRetries: number;
  };
  privacy: {
    shareUsageData: boolean;
    allowAnalytics: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    compactMode: boolean;
  };
}