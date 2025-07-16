import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { BillingPlan, PaymentMethod, Invoice } from '../../models/user.model';
import { IBillingApiService } from './interface';

/**
 * BillingApiService (real API implementation)
 *
 * Replace stubs with real HTTP calls using Angular HttpClient.
 */
@Injectable({ providedIn: 'root' })
export class BillingApiService implements IBillingApiService {
    getPlans(): Observable<BillingPlan[]> {
        return throwError(() => new Error('Not implemented: connect to real API'));
    }
    getPaymentMethods(): Observable<PaymentMethod[]> {
        return throwError(() => new Error('Not implemented: connect to real API'));
    }
    getInvoices(): Observable<Invoice[]> {
        return throwError(() => new Error('Not implemented: connect to real API'));
    }
    changePlan(planId: string): Observable<BillingPlan[]> {
        return throwError(() => new Error('Not implemented: connect to real API'));
    }
    addPaymentMethod(method: Omit<PaymentMethod, 'id'>): Observable<PaymentMethod[]> {
        return throwError(() => new Error('Not implemented: connect to real API'));
    }
    removePaymentMethod(methodId: string): Observable<PaymentMethod[]> {
        return throwError(() => new Error('Not implemented: connect to real API'));
    }
    setDefaultPaymentMethod(methodId: string): Observable<PaymentMethod[]> {
        return throwError(() => new Error('Not implemented: connect to real API'));
    }
}
