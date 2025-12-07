// src/integrations/api/services/parent.service.ts
import { api, ApiResponse } from '../client';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  name?: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl?: string;
}

export interface BillingPlan {
  name: string;
  price: string;
  status: string;
  nextBilling: string;
  features: string[];
}

export interface BillingDashboard {
  currentPlan: BillingPlan;
  paymentMethods: PaymentMethod[];
  recentInvoices: Invoice[];
  upcomingCharges?: any[];
  totalSpent?: number;
}

export const parentService = {
  /**
   * Get billing dashboard data
   */
  getBillingDashboard: (): Promise<ApiResponse<BillingDashboard>> => {
    return api.get<BillingDashboard>('/billing/dashboard');
  },

  /**
   * Get payment history (invoices)
   */
  getPaymentHistory: (): Promise<ApiResponse<Invoice[]>> => {
    return api.get<Invoice[]>('/billing/payment-history');
  },

  /**
   * Get all payment methods
   */
  getPaymentMethods: (): Promise<ApiResponse<PaymentMethod[]>> => {
    return api.get<PaymentMethod[]>('/payment-methods');
  },

  /**
   * Get default payment method
   */
  getDefaultPaymentMethod: (): Promise<ApiResponse<PaymentMethod>> => {
    return api.get<PaymentMethod>('/payment-methods/default');
  },

  /**
   * Create a new payment method
   */
  createPaymentMethod: (data: any): Promise<ApiResponse<PaymentMethod>> => {
    return api.post<PaymentMethod>('/payment-methods', data);
  },

  /**
   * Update a payment method
   */
  updatePaymentMethod: (id: string, data: any): Promise<ApiResponse<PaymentMethod>> => {
    return api.put<PaymentMethod>(`/payment-methods/${id}`, data);
  },

  /**
   * Delete a payment method
   */
  deletePaymentMethod: (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/payment-methods/${id}`);
  },

  /**
   * Get unpaid enrollments
   */
  getUnpaidEnrollments: (): Promise<ApiResponse<any[]>> => {
    return api.get<any[]>('/billing/unpaid-enrollments');
  },

  /**
   * Pay for enrollment
   */
  payForEnrollment: (data: any): Promise<ApiResponse<any>> => {
    return api.post<any>('/billing/pay-enrollment', data);
  },
};
