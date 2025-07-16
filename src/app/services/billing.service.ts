import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BillingPlan, PaymentMethod, Invoice } from '../models/user.model';
import { IBillingApiService, BILLING_API_SERVICE } from '../api-services/billing/interface';
import { Inject } from '@angular/core';

/**
 * BillingService
 *
 * Provides billing data and actions to components via observables.
 * All data is sourced from BillingApiService (mock or real API).
 *
 * - billingPlans$: Observable of all billing plans
 * - paymentMethods$: Observable of all payment methods
 * - invoices$: Observable of all invoices
 *
 * Methods update state by calling the API service and updating the BehaviorSubjects.
 */

@Injectable({ providedIn: 'root' })
export class BillingService {
    private billingPlansSubject = new BehaviorSubject<BillingPlan[]>([]);
    private paymentMethodsSubject = new BehaviorSubject<PaymentMethod[]>([]);
    private invoicesSubject = new BehaviorSubject<Invoice[]>([]);

    /**
     * Observable of all billing plans
     */
    public billingPlans$ = this.billingPlansSubject.asObservable();

    /**
     * Observable of all payment methods
     */
    public paymentMethods$ = this.paymentMethodsSubject.asObservable();

    /**
     * Observable of all invoices
     */
    public invoices$ = this.invoicesSubject.asObservable();

    constructor(@Inject(BILLING_API_SERVICE) private api: IBillingApiService) {
        this.refreshAll();
    }

    /**
     * Refresh all billing data from the API service
     */
    refreshAll(): void {
        this.api.getPlans().subscribe(plans => this.billingPlansSubject.next(plans));
        this.api.getPaymentMethods().subscribe(methods => this.paymentMethodsSubject.next(methods));
        this.api.getInvoices().subscribe(invoices => this.invoicesSubject.next(invoices));
    }

    /**
     * Change the current billing plan
     * @param planId The plan to activate
     */
    changePlan(planId: string): void {
        this.api.changePlan(planId).subscribe(plans => this.billingPlansSubject.next(plans));
    }

    /**
     * Add a new payment method
     * @param method The payment method (without id)
     */
    addPaymentMethod(method: Omit<PaymentMethod, 'id'>): void {
        this.api.addPaymentMethod(method).subscribe(methods => this.paymentMethodsSubject.next(methods));
    }

    /**
     * Remove a payment method
     * @param methodId The id of the method to remove
     */
    removePaymentMethod(methodId: string): void {
        this.api.removePaymentMethod(methodId).subscribe(methods => this.paymentMethodsSubject.next(methods));
    }

    /**
     * Set a payment method as default
     * @param methodId The id of the method to set as default
     */
    setDefaultPaymentMethod(methodId: string): void {
        this.api.setDefaultPaymentMethod(methodId).subscribe(methods => this.paymentMethodsSubject.next(methods));
    }
}
