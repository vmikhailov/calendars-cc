import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, BillingPlan, PaymentMethod, Invoice, AppSettings } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private userSubject = new BehaviorSubject<User | null>(null);

    private billingPlansSubject = new BehaviorSubject<BillingPlan[]>([
        {
            id: 'free',
            name: 'Free',
            price: 0,
            interval: 'monthly',
            features: ['Up to 2 calendars', 'Basic sync rules', 'Email support'],
            current: false
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 9.99,
            interval: 'monthly',
            features: ['Unlimited calendars', 'Advanced rules', 'Priority support', 'Custom integrations'],
            popular: true,
            current: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 29.99,
            interval: 'monthly',
            features: ['Everything in Pro', 'Team management', 'SSO integration', 'Dedicated support', 'SLA guarantee']
        }
    ]);

    private paymentMethodsSubject = new BehaviorSubject<PaymentMethod[]>([
        {
            id: '1',
            type: 'card',
            brand: 'Visa',
            last4: '4242',
            expiryMonth: 12,
            expiryYear: 2026,
            isDefault: true
        }
    ]);

    private invoicesSubject = new BehaviorSubject<Invoice[]>([
        {
            id: 'inv_001',
            date: '2025-01-01',
            amount: 9.99,
            status: 'paid'
        },
        {
            id: 'inv_002',
            date: '2024-12-01',
            amount: 9.99,
            status: 'paid'
        },
        {
            id: 'inv_003',
            date: '2024-11-01',
            amount: 9.99,
            status: 'paid'
        }
    ]);

    private settingsSubject = new BehaviorSubject<AppSettings>({
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
    });

    public user$ = this.userSubject.asObservable();
    public billingPlans$ = this.billingPlansSubject.asObservable();
    public paymentMethods$ = this.paymentMethodsSubject.asObservable();
    public invoices$ = this.invoicesSubject.asObservable();
    public settings$ = this.settingsSubject.asObservable();

    constructor(private authService: AuthService) {
        // Initialize user data from auth service
        this.authService.authState$.subscribe(state => {
            if (state.user) {
                const user: User = {
                    id: state.user.id,
                    name: state.user.name,
                    email: state.user.email,
                    avatar: state.user.avatar,
                    company: 'Acme Corp',
                    role: 'Product Manager',
                    timezone: 'America/New_York',
                    language: 'en',
                    joinedDate: '2023-06-15',
                    lastLogin: '2025-01-15 09:30'
                };
                this.userSubject.next(user);
            } else {
                this.userSubject.next(null);
            }
        });
    }

    updateUser(user: Partial<User>): void {
        const currentUser = this.userSubject.value;
        if (currentUser) {
            this.userSubject.next({ ...currentUser, ...user });
        }
    }

    changePlan(planId: string): void {
        const plans = this.billingPlansSubject.value.map(plan => ({
            ...plan,
            current: plan.id === planId
        }));
        this.billingPlansSubject.next(plans);
    }

    updateSettings(settings: Partial<AppSettings>): void {
        const currentSettings = this.settingsSubject.value;
        this.settingsSubject.next({...currentSettings, ...settings});
    }

    addPaymentMethod(method: Omit<PaymentMethod, 'id'>): void {
        const methods = this.paymentMethodsSubject.value;
        const newMethod: PaymentMethod = {
            ...method,
            id: Date.now().toString()
        };
        this.paymentMethodsSubject.next([...methods, newMethod]);
    }

    removePaymentMethod(methodId: string): void {
        const methods = this.paymentMethodsSubject.value.filter(m => m.id !== methodId);
        this.paymentMethodsSubject.next(methods);
    }

    setDefaultPaymentMethod(methodId: string): void {
        const methods = this.paymentMethodsSubject.value.map(method => ({
            ...method,
            isDefault: method.id === methodId
        }));
        this.paymentMethodsSubject.next(methods);
    }
}