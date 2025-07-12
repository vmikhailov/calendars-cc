import React, { useState } from 'react';
import { CreditCard, Download, Calendar, CheckCircle, AlertCircle, Zap, Crown, Star } from 'lucide-react';

const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'methods' | 'plans'>('overview');
  const [hasActivePlan] = useState(true); // This would come from user context/API

  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: '2',
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ];

  const invoices = [
    {
      id: 'INV-2025-001',
      date: '2025-01-15',
      amount: 15,
      status: 'paid',
      plan: 'Professional',
      period: 'January 2025'
    },
    {
      id: 'INV-2024-012',
      date: '2024-12-15',
      amount: 15,
      status: 'paid',
      plan: 'Professional',
      period: 'December 2024'
    },
    {
      id: 'INV-2024-011',
      date: '2024-11-15',
      amount: 15,
      status: 'paid',
      plan: 'Professional',
      period: 'November 2024'
    },
    {
      id: 'INV-2024-010',
      date: '2024-10-15',
      amount: 15,
      status: 'failed',
      plan: 'Professional',
      period: 'October 2024'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'failed': return 'Failed';
      default: return 'Pending';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-50 text-green-700 border-green-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Billing</h1>
        <p className="text-gray-600">Manage your payments and billing methods</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8 w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm rounded ${activeTab === 'overview' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-sm rounded ${activeTab === 'history' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
        >
          Payment History
        </button>
        <button
          onClick={() => setActiveTab('methods')}
          className={`px-4 py-2 text-sm rounded ${activeTab === 'methods' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
        >
          Payment Methods
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 text-sm rounded ${activeTab === 'plans' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
        >
          {hasActivePlan ? 'Change Plan' : 'Choose Plan'}
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && hasActivePlan && (
        <div className="space-y-6">
          {/* Current Subscription */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Subscription</h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Professional Plan</h3>
                    <p className="text-sm text-gray-500">Monthly subscription</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">$15 <span className="text-sm font-normal text-gray-500">/month</span></div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Next payment</div>
                <div className="font-medium text-gray-900">February 15, 2025</div>
                <button className="text-blue-600 hover:text-blue-700 text-sm mt-2">
                  Change plan
                </button>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">Calendars</h3>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">4 <span className="text-sm font-normal text-gray-500">из 10</span></div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-gray-900">Syncs</h3>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">1,247</div>
              <div className="text-sm text-gray-500">this month</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <h3 className="font-medium text-gray-900">API Requests</h3>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">8,432</div>
              <div className="text-sm text-gray-500">unlimited</div>
            </div>
          </div>
        </div>
      )}

      {/* No Plan State */}
      {activeTab === 'overview' && !hasActivePlan && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-6">Choose a plan to start syncing your calendars</p>
          <button 
            onClick={() => setActiveTab('plans')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Plans
          </button>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && hasActivePlan && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.plan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        <span>{getStatusText(invoice.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Plan History State */}
      {activeTab === 'history' && !hasActivePlan && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment History</h3>
            <p className="text-gray-600">Payment history will appear here once you subscribe to a plan</p>
          </div>
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'methods' && hasActivePlan && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {method.brand} •••• {method.last4}
                      </div>
                      <div className="text-sm text-gray-500">
                        Истекает {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                      </div>
                    </div>
                  </div>
                  {method.isDefault && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      Default
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  {!method.isDefault && (
                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                      Make Default
                    </button>
                  )}
                  <button className="text-gray-600 hover:text-gray-700 text-sm">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-700 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Plan Payment Methods State */}
      {activeTab === 'methods' && !hasActivePlan && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Methods</h3>
            <p className="text-gray-600">Add a payment method when you subscribe to a plan</p>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <PlansSection hasActivePlan={hasActivePlan} />
      )}
    </div>
  );
};

// Plans Section Component
const PlansSection: React.FC<{ hasActivePlan: boolean }> = ({ hasActivePlan }) => {
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Zap,
      price: { monthly: 0, yearly: 0 },
      description: 'For personal use',
      features: [
        'Up to 2 calendars',
        'Sync every 30 minutes',
        'Basic sync rules',
        'Email support'
      ],
      limitations: [
        'Limited log history',
        'No priority support'
      ],
      color: 'gray',
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      icon: Crown,
      price: { monthly: 15, yearly: 150 },
      description: 'For professionals and teams',
      features: [
        'Up to 10 calendars',
        'Sync every 5 minutes',
        'Advanced sync rules',
        'Filters and conditions',
        'Priority support',
        'Full log history',
        'API access'
      ],
      limitations: [],
      color: 'blue',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Star,
      price: { monthly: 49, yearly: 490 },
      description: 'For large organizations',
      features: [
        'Unlimited calendars',
        'Real-time synchronization',
        'All Pro features',
        'Personal account manager',
        'SLA 99.9%',
        'Enterprise security',
        'Active Directory integration',
        'White label'
      ],
      limitations: [],
      color: 'purple',
      popular: false
    }
  ];

  const getColorClasses = (color: string, variant: 'border' | 'bg' | 'text' | 'button') => {
    const colors = {
      gray: {
        border: 'border-gray-200',
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        button: 'bg-gray-600 hover:bg-gray-700'
      },
      blue: {
        border: 'border-blue-200',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      purple: {
        border: 'border-purple-200',
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700'
      }
    };
    return colors[color as keyof typeof colors][variant];
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {hasActivePlan ? 'Change Your Plan' : 'Choose the Right Plan'}
        </h2>
        <p className="text-gray-600 mb-6">
          {hasActivePlan 
            ? 'Upgrade or downgrade your subscription at any time' 
            : 'Scale calendar synchronization to fit your needs'
          }
        </p>
        
        <div className="flex items-center justify-center space-x-1 bg-gray-100 rounded-lg p-1 w-fit mx-auto">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 text-sm rounded ${billingCycle === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 text-sm rounded ${billingCycle === 'yearly' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
          >
            Yearly
            <span className="ml-1 text-xs bg-green-100 text-green-600 px-1 rounded">-17%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-xl shadow-sm border-2 p-6 transition-all hover:shadow-lg ${
              plan.popular ? 'border-blue-500 ring-2 ring-blue-100' : getColorClasses(plan.color, 'border')
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <div className={`inline-flex p-3 rounded-lg mb-4 ${getColorClasses(plan.color, 'bg')}`}>
                <plan.icon className={`h-6 w-6 ${getColorClasses(plan.color, 'text')}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {plan.price[billingCycle] === 0 ? 'Free' : `$${plan.price[billingCycle]}`}
                </span>
                {plan.price[billingCycle] > 0 && (
                  <span className="text-gray-500 text-sm">
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                hasActivePlan && currentPlan === plan.id
                  ? 'bg-gray-400 cursor-not-allowed'
                  : `${getColorClasses(plan.color, 'button')}`
              }`}
              disabled={hasActivePlan && currentPlan === plan.id}
            >
              {hasActivePlan && currentPlan === plan.id 
                ? 'Current Plan' 
                : hasActivePlan 
                  ? 'Switch to This Plan' 
                  : 'Choose Plan'
              }
            </button>
          </div>
        ))}
      </div>

      {hasActivePlan && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">Plan Change Information</h3>
              <p className="text-sm text-yellow-700">
                Plan changes will take effect at the next billing cycle. You'll continue to have access to your current plan features until then.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Can I change my plan?</h4>
            <p className="text-sm text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the next billing cycle.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Is there a trial period?</h4>
            <p className="text-sm text-gray-600">Yes, all paid plans include a 14-day free trial with no credit card required.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">What payment methods are accepted?</h4>
            <p className="text-sm text-gray-600">We accept all major credit cards, PayPal, and bank transfers for enterprise customers.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Can I cancel my subscription?</h4>
            <p className="text-sm text-gray-600">Yes, you can cancel your subscription at any time. Access to features will continue until the end of your paid period.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;