import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { BillingPlan, PaymentMethod, Invoice } from '../../models/user.model';

export interface IBillingApiService {
    getPlans(): Observable<BillingPlan[]>;
    getPaymentMethods(): Observable<PaymentMethod[]>;
    getInvoices(): Observable<Invoice[]>;
    changePlan(planId: string): Observable<BillingPlan[]>;
    addPaymentMethod(method: Omit<PaymentMethod, 'id'>): Observable<PaymentMethod[]>;
    removePaymentMethod(methodId: string): Observable<PaymentMethod[]>;
    setDefaultPaymentMethod(methodId: string): Observable<PaymentMethod[]>;
}

export const BILLING_API_SERVICE = new InjectionToken<IBillingApiService>('BILLING_API_SERVICE');
