import { BillingPlan, PaymentMethod, Invoice } from '../../models/user.model';

export const MOCK_BILLING_PLANS: BillingPlan[] = [
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
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: '1',
        type: 'card',
        brand: 'Visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2026,
        isDefault: true
    }
];

export const MOCK_INVOICES: Invoice[] = [
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
];
