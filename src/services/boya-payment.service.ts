import axios from 'axios';

// Boya API configuration
const BOYA_API_BASE_URL = 'https://api.collection.withboya.com/api';
const BOYA_API_KEY = import.meta.env.VITE_BOYA_API_KEY || 'ak_78de99f15c201e7eb6821df7aaf24fed.b591e9b1c7d623354888b98d0cabc778ba41b7fa37a2f52c04a2ffbbd894108b';

// Payment interfaces
interface BoyaCustomer {
  name: string;
  email: string;
  phone: string;
}

interface BoyaDirectChargeRequest {
  payment_intent: string; // The fingerprint from Basis Theory
  customer_id?: string; // Existing customer ID
  customer?: BoyaCustomer; // New customer details (auto-created)
  amount: number; // Amount in cents
  currency: string;
  description?: string;
  saveForRecurringPayments?: boolean;
}

interface BoyaPaymentResponse {
  id: string;
  status: 'succeeded' | 'pending' | 'failed' | 'requires_action';
  amount: number;
  currency: string;
  customer_id: string;
  payment_method?: {
    id: string;
    type: string;
    card?: {
      last4: string;
      brand: string;
      exp_month: number;
      exp_year: number;
    };
  };
  error?: {
    code: string;
    message: string;
  };
  // For 3D Secure flows
  next_action?: {
    type: 'redirect_to_url';
    redirect_to_url: {
      url: string;
      return_url: string;
    };
  };
}

interface BoyaErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  errorCode?: string;
}

class BoyaPaymentService {
  private apiClient = axios.create({
    baseURL: BOYA_API_BASE_URL,
    headers: {
      'x-api-key': BOYA_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Add response interceptor for better error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.data) {
          const boyaError: BoyaErrorResponse = error.response.data;

          // Create a more user-friendly error message
          let userMessage = boyaError.message || 'Payment failed';

          // Handle specific error cases
          if (boyaError.message?.includes('insufficient funds')) {
            userMessage = 'Your card has insufficient funds. Please try a different card.';
          } else if (boyaError.message?.includes('card declined')) {
            userMessage = 'Your card was declined. Please contact your bank or try a different card.';
          } else if (boyaError.message?.includes('expired')) {
            userMessage = 'Your card has expired. Please use a valid card.';
          }

          error.userMessage = userMessage;
          error.boyaError = boyaError;
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Process a direct charge using a tokenized card fingerprint
   */
  async directCharge(request: BoyaDirectChargeRequest): Promise<BoyaPaymentResponse> {
    try {
      const response = await this.apiClient.post<BoyaPaymentResponse>(
        '/card-collections/direct-charge',
        request
      );

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Handle payment with customer details
   * @param fingerprint The card fingerprint from Basis Theory
   * @param amount Amount in cents
   * @param currency Currency code (USD, KES, etc.)
   * @param customer Customer details
   * @param description Payment description
   * @param customerId Existing customer ID (optional)
   */
  async processPayment({
    fingerprint,
    amount,
    currency,
    customer,
    description,
    customerId,
    saveForRecurringPayments = false
  }: {
    fingerprint: string;
    amount: number;
    currency: string;
    customer?: BoyaCustomer;
    description?: string;
    customerId?: string;
    saveForRecurringPayments?: boolean;
  }): Promise<BoyaPaymentResponse> {
    const request: BoyaDirectChargeRequest = {
      payment_intent: fingerprint,
      amount,
      currency,
      description,
      saveForRecurringPayments
    };

    // Use existing customer ID or provide new customer details
    if (customerId) {
      request.customer_id = customerId;
    } else if (customer) {
      request.customer = customer;
    } else {
      throw new Error('Either customerId or customer details must be provided');
    }

    return this.directCharge(request);
  }

  /**
   * Check if payment requires 3D Secure authentication
   */
  requires3DSecure(response: BoyaPaymentResponse): boolean {
    return response.status === 'requires_action' &&
      response.next_action?.type === 'redirect_to_url';
  }

  /**
   * Get 3D Secure redirect URL
   */
  get3DSecureUrl(response: BoyaPaymentResponse): string | null {
    if (this.requires3DSecure(response)) {
      return response.next_action?.redirect_to_url?.url || null;
    }
    return null;
  }

  /**
   * Convert amount to cents for API
   */
  static toCents(amount: number, currency: string = 'KES'): number {
    // Most currencies use 2 decimal places
    return Math.round(amount * 100);
  }

  /**
   * Convert amount from cents to decimal
   */
  static fromCents(amountInCents: number, currency: string = 'KES'): number {
    return amountInCents / 100;
  }
}

export default BoyaPaymentService;
export type { BoyaCustomer, BoyaDirectChargeRequest, BoyaPaymentResponse, BoyaErrorResponse };