import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { BillingPlan, PaymentMethod, Invoice } from '../../models/user.model';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Billing</h1>
        <p class="text-gray-600">Manage your subscription and billing information</p>
      </div>

      <!-- Current Plan -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Current Plan</h2>
        
        <div *ngIf="currentPlan" class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-3">
              <h3 class="text-xl font-bold text-gray-900">{{ currentPlan.name }}</h3>
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">Current</span>
            </div>
            <p class="text-gray-600 mt-1">
              &#36;{{ currentPlan.price }}/{{ currentPlan.interval }}
            </p>
          </div>
          
          <button 
            (click)="showPlans = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Change Plan
          </button>
        </div>
      </div>

      <!-- Plans Modal -->
      <div *ngIf="showPlans" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-900">Choose Your Plan</h3>
              <button 
                (click)="showPlans = false"
                class="text-gray-400 hover:text-gray-600"
              >
                <lucide-icon name="x" class="h-6 w-6"></lucide-icon>
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                *ngFor="let plan of billingPlans"
                [class]="getPlanCardClass(plan)"
              >
                <div *ngIf="plan.popular" class="bg-blue-600 text-white text-center py-2 px-4 rounded-t-lg text-sm font-medium">
                  Most Popular
                </div>
                
                <div class="p-6">
                  <h4 class="text-xl font-bold text-gray-900 mb-2">{{ plan.name }}</h4>
                  <div class="mb-4">
                    <span class="text-3xl font-bold text-gray-900">&#36;{{ plan.price }}</span>
                    <span class="text-gray-600">/{{ plan.interval }}</span>
                  </div>
                  
                  <ul class="space-y-3 mb-6">
                    <li *ngFor="let feature of plan.features" class="flex items-center space-x-2">
                      <lucide-icon name="check" class="h-4 w-4 text-green-500"></lucide-icon>
                      <span class="text-gray-700">{{ feature }}</span>
                    </li>
                  </ul>
                  
                  <button
                    (click)="changePlan(plan.id)"
                    [disabled]="plan.current"
                    [class]="getPlanButtonClass(plan)"
                  >
                    {{ plan.current ? 'Current Plan' : 'Select Plan' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Payment Methods -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Payment Methods</h2>
            <button 
              (click)="showAddPayment = true"
              class="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <lucide-icon name="plus" class="h-4 w-4"></lucide-icon>
              <span>Add Method</span>
            </button>
          </div>
          
          <div class="space-y-4">
            <div
              *ngFor="let method of paymentMethods"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                  <lucide-icon name="credit-card" class="h-4 w-4 text-gray-600"></lucide-icon>
                </div>
                <div>
                  <div class="font-medium text-gray-900">
                    {{ method.brand }} •••• {{ method.last4 }}
                  </div>
                  <div class="text-sm text-gray-500">
                    Expires {{ method.expiryMonth }}/{{ method.expiryYear }}
                    <span *ngIf="method.isDefault" class="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">Default</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <button
                  *ngIf="!method.isDefault"
                  (click)="setDefaultPayment(method.id)"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  Set Default
                </button>
                <button
                  (click)="removePaymentMethod(method.id)"
                  class="text-red-600 hover:text-red-700"
                >
                  <lucide-icon name="trash-2" class="h-4 w-4"></lucide-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Billing History -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Billing History</h2>
          
          <div class="space-y-4">
            <div
              *ngFor="let invoice of invoices"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <div class="font-medium text-gray-900">{{ formatInvoiceDate(invoice.date) }}</div>
                <div class="text-sm text-gray-500">&#36;{{ invoice.amount.toFixed(2) }}</div>
              </div>
              
              <div class="flex items-center space-x-3">
                <span [class]="getStatusBadgeClass(invoice.status)">
                  {{ invoice.status | titlecase }}
                </span>
                <button class="text-blue-600 hover:text-blue-700">
                  <lucide-icon name="download" class="h-4 w-4"></lucide-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Payment Method Modal -->
      <div *ngIf="showAddPayment" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Payment Method</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input 
                type="text" 
                placeholder="1234 5678 9012 3456"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                <input 
                  type="text" 
                  placeholder="123"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              (click)="showAddPayment = false"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              (click)="addPaymentMethod()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Method
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BillingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  billingPlans: BillingPlan[] = [];
  paymentMethods: PaymentMethod[] = [];
  invoices: Invoice[] = [];
  currentPlan: BillingPlan | null = null;
  showPlans = false;
  showAddPayment = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.billingPlans$
      .pipe(takeUntil(this.destroy$))
      .subscribe(plans => {
        this.billingPlans = plans;
        this.currentPlan = plans.find(p => p.current) || null;
      });

    this.userService.paymentMethods$
      .pipe(takeUntil(this.destroy$))
      .subscribe(methods => {
        this.paymentMethods = methods;
      });

    this.userService.invoices$
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
    this.userService.changePlan(planId);
    this.showPlans = false;
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
    
    this.userService.addPaymentMethod(newMethod);
    this.showAddPayment = false;
  }

  removePaymentMethod(methodId: string): void {
    this.userService.removePaymentMethod(methodId);
  }

  setDefaultPayment(methodId: string): void {
    this.userService.setDefaultPaymentMethod(methodId);
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