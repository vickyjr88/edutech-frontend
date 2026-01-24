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

export interface Child {
  _id: string;
  fullName: string;
  email?: string;
  dateOfBirth?: string;
  grade?: string;
  school?: string;
  curriculum?: string;
  age?: number;
  role: 'student';
}

export interface ParentProfile {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    bio?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  children: Child[];
  contactNumber?: string;
  preferredContactMethod?: string;
  receiveProgressReports: boolean;
  receiveNotifications: boolean;
}

export interface UpdateParentProfileDto {
  contactNumber?: string;
  preferredContactMethod?: string;
  receiveProgressReports?: boolean;
  receiveNotifications?: boolean;
}

export interface CreateChildDto {
  fullName: string;
  email?: string;
  dateOfBirth?: string;
  grade?: string;
  school?: string;
  curriculum?: string;
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

  /**
   * Create current parent profile
   */
  createProfile: (data: any): Promise<ApiResponse<ParentProfile>> => {
    return api.post<ParentProfile>('/parents', data);
  },

  /**
   * Get current parent profile
   */
  getProfile: (): Promise<ApiResponse<ParentProfile>> => {
    return api.get<ParentProfile>('/parents/profile');
  },

  /**
   * Update parent profile
   */
  updateProfile: (parentId: string, data: UpdateParentProfileDto): Promise<ApiResponse<ParentProfile>> => {
    return api.patch<ParentProfile>(`/parents/${parentId}`, data);
  },

  /**
   * Get children
   */
  getChildren: (): Promise<ApiResponse<Child[]>> => {
    return api.get<ParentProfile>('/parents/profile').then(response => {
      return {
        ...response,
        data: response.data?.children || []
      };
    });
  },

  /**
   * Create a child user and add to parent profile
   */
  createChild: (data: CreateChildDto): Promise<ApiResponse<Child>> => {
    return api.post<Child>('/mvp/parent/children', data);
  },

  /**
   * Add existing child to parent profile
   */
  addChild: (parentId: string, childId: string): Promise<ApiResponse<ParentProfile>> => {
    return api.post<ParentProfile>(`/parents/${parentId}/children/${childId}`, {});
  },

  /**
   * Remove child from parent profile
   */
  removeChild: (parentId: string, childId: string): Promise<ApiResponse<ParentProfile>> => {
    return api.delete<ParentProfile>(`/mvp/parent/children/${childId}`);
  },

  /**
   * Update child details
   */
  updateChild: (childId: string, data: any): Promise<ApiResponse<any>> => {
    return api.patch<any>(`/mvp/parent/children/${childId}`, data);
  },
};
