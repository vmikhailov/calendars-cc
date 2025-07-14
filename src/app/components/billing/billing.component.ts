import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
import { BillingPlan, PaymentMethod, Invoice } from '../../models/user.model';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './billing.component.html'
})
export class BillingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  activeTab: 'overview' | 'plans' | 'history' = 'overview';
  billingPlans: BillingPlan[] = [];
  paymentMethods: PaymentMethod[] = [];
  invoices: Invoice[] = [];
  currentPlan: BillingPlan | null = null;
  showAddPayment = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.billingPlans$
      .pipe(takeUntil(this.destroy$))
      .subscribe(plans => {
        this.billingPlans = plans;
        this.currentPlan = plans.find(p => p.current) || null;
      });

    this.profileService.paymentMethods$
      .pipe(takeUntil(this.destroy$))
      .subscribe(methods => {
        this.paymentMethods = methods;
      });

    this.profileService.invoices$
      .pipe(takeUntil(this.destroy$))
      .subscribe(invoices => {
        this.invoices = invoices;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changePlan(planId: string): void {
    this.profileService.changePlan(planId);
    this.setActiveTab('overview');
  }

  addPaymentMethod(): void {
    // In a real app, this would integrate with Stripe or similar
    const newMethod: Omit<PaymentMethod, 'id'> = {
      type: 'card',
      brand: 'Visa',
      last4: '1234',
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: this.paymentMethods.length === 0
    };
    
    this.profileService.addPaymentMethod(newMethod);
    this.showAddPayment = false;
  }

  removePaymentMethod(methodId: string): void {
    this.profileService.removePaymentMethod(methodId);
  }

  setDefaultPayment(methodId: string): void {
    this.profileService.setDefaultPaymentMethod(methodId);
  }

  setActiveTab(tab: 'overview' | 'plans' | 'history'): void {
    this.activeTab = tab;
  }

  tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'plans' as const, label: 'Plans' },
    { id: 'history' as const, label: 'History' }
  ];

  getTabClass(tabId: string): string {
    const baseClass = 'px-3 py-1 text-sm rounded transition-all';
    return this.activeTab === tabId
      ? `${baseClass} bg-white shadow text-gray-900`
      : `${baseClass} text-gray-600 hover:text-gray-900`;
  }

  getPlanCardClass(plan: BillingPlan): string {
    const baseClass = 'border rounded-lg transition-all hover:shadow-md';
    if (plan.popular) {
      return `${baseClass} border-blue-500 relative`;
    }
    return `${baseClass} border-gray-200`;
  }

  getPlanButtonClass(plan: BillingPlan): string {
    const baseClass = 'w-full py-2 px-4 rounded-lg transition-colors';
    if (plan.current) {
      return `${baseClass} bg-gray-100 text-gray-500 cursor-not-allowed`;
    }
    if (plan.popular) {
      return `${baseClass} bg-blue-600 text-white hover:bg-blue-700`;
    }
    return `${baseClass} bg-gray-900 text-white hover:bg-gray-800`;
  }

  getStatusBadgeClass(status: string): string {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'paid':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  formatInvoiceDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}