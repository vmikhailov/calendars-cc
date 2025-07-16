import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IBillingApiService } from './interface';
import { BillingPlan, PaymentMethod, Invoice } from '../../models/user.model';
import { MOCK_BILLING_PLANS, MOCK_PAYMENT_METHODS, MOCK_INVOICES } from './mock-data';

@Injectable({ providedIn: 'root' })
export class BillingMockApiService implements IBillingApiService {
    private plans = [...MOCK_BILLING_PLANS];
    private methods = [...MOCK_PAYMENT_METHODS];
    private invoices = [...MOCK_INVOICES];

    getPlans(): Observable<BillingPlan[]> {
        return of(this.plans).pipe(delay(200));
    }
    getPaymentMethods(): Observable<PaymentMethod[]> {
        return of(this.methods).pipe(delay(200));
    }
    getInvoices(): Observable<Invoice[]> {
        return of(this.invoices).pipe(delay(200));
    }
    changePlan(planId: string): Observable<BillingPlan[]> {
        this.plans = this.plans.map(plan => ({ ...plan, current: plan.id === planId }));
        return of(this.plans).pipe(delay(200));
    }
    addPaymentMethod(method: Omit<PaymentMethod, 'id'>): Observable<PaymentMethod[]> {
        const newMethod = { ...method, id: Date.now().toString() };
        this.methods.push(newMethod);
        return of(this.methods).pipe(delay(200));
    }
    removePaymentMethod(methodId: string): Observable<PaymentMethod[]> {
        this.methods = this.methods.filter(m => m.id !== methodId);
        return of(this.methods).pipe(delay(200));
    }
    setDefaultPaymentMethod(methodId: string): Observable<PaymentMethod[]> {
        this.methods = this.methods.map(m => ({ ...m, isDefault: m.id === methodId }));
        return of(this.methods).pipe(delay(200));
    }
}
