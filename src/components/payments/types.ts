export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  name?: string;
  bankName?: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'cancelled';
  description: string;
  downloadUrl?: string;
  invoiceNumber?: string;
}

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: string;
  interval: 'month' | 'year';
  status: 'Active' | 'Inactive' | 'Cancelled';
  nextBilling: string;
  features: string[];
}

export interface BillingDashboardData {
  currentPlan: BillingPlan;
  paymentMethods: PaymentMethod[];
  recentInvoices: Invoice[];
  upcomingCharges?: {
    date: string;
    amount: number;
    description: string;
  }[];
  totalSpent?: number;
}