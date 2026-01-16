/**
 * MVP Payment Service
 *
 * Handles M-PESA payment integration via Paystack for the MVP
 * Uses /mvp namespace for simplified payment endpoints
 *
 * Paystack M-PESA Flow:
 * 1. Initialize transaction (backend creates Paystack transaction)
 * 2. Get authorization URL
 * 3. Redirect user or open popup
 * 4. User completes M-PESA payment on phone
 * 5. Paystack webhook notifies backend
 * 6. Frontend verifies payment
 */

import { mvpApiClient } from '../mvp-client';

// ===== Types =====

export interface InitiateMpesaPaymentRequest {
  bookingId: string;
  amount: number; // Amount in KES
  phoneNumber: string; // Format: "0712345678" or "+254712345678"
  email: string;
  customerName: string;
}

export interface InitiateMpesaPaymentResponse {
  success: boolean;
  transactionRef: string; // Paystack reference
  status: 'pending';
  message: string;
  authorizationUrl: string; // URL to redirect user for payment
  accessCode: string; // Paystack access code
}

export interface PaymentStatusResponse {
  status: 'pending' | 'success' | 'failed' | 'abandoned';
  amount?: number;
  transactionDate?: string;
  transactionRef?: string;
  bookingId?: string;
  paymentMethod?: string;
  gatewayResponse?: string;
}

export interface PaymentHistoryItem {
  _id: string;
  transactionRef: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  bookingId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentHistoryResponse {
  payments: PaymentHistoryItem[];
  total: number;
  totalAmount: number;
}

export interface ReceiptResponse {
  receiptPdfUrl: string;
}

// ===== Service =====

export class MVPPaymentService {
  /**
   * Initiate M-PESA payment via Paystack
   * Returns authorization URL to redirect user
   */
  async initiateMpesaPayment(
    data: InitiateMpesaPaymentRequest
  ): Promise<InitiateMpesaPaymentResponse> {
    try {
      // Format and validate phone number
      const formattedPhone = this.formatPhoneNumber(data.phoneNumber);
      if (!this.isValidKenyanPhone(formattedPhone)) {
        throw new Error('Invalid Kenyan phone number. Use format: 0712345678');
      }

      // Validate amount (minimum 100 KES for Paystack)
      if (data.amount < 100) {
        throw new Error('Minimum payment amount is KES 100');
      }

      // Call backend to initialize Paystack transaction
      const response = await mvpApiClient.post<InitiateMpesaPaymentResponse>(
        '/payments/mpesa/initialize',
        {
          ...data,
          phoneNumber: formattedPhone,
        }
      );

      return response;
    } catch (error) {
      console.error('Error initiating M-PESA payment:', error);
      throw error;
    }
  }

  /**
   * Verify payment after user returns from Paystack
   * Should be called with reference from URL query params
   */
  async verifyPayment(transactionRef: string): Promise<PaymentStatusResponse> {
    try {
      const response = await mvpApiClient.get<PaymentStatusResponse>(
        `/payments/mpesa/verify/${transactionRef}`
      );
      return response;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  /**
   * Check payment status by transaction reference
   * Used for polling while waiting for payment confirmation
   */
  async getPaymentStatus(transactionRef: string): Promise<PaymentStatusResponse> {
    try {
      const response = await mvpApiClient.get<PaymentStatusResponse>(
        `/payments/mpesa/status/${transactionRef}`
      );
      return response;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  /**
   * Get payment history for current user
   */
  async getPaymentHistory(params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<PaymentHistoryResponse> {
    return mvpApiClient.get('/payments/history', { params });
  }

  /**
   * Download payment receipt
   */
  async downloadReceipt(transactionRef: string): Promise<ReceiptResponse> {
    return mvpApiClient.post('/payments/receipt', { transactionRef });
  }

  /**
   * Poll payment status with timeout
   * Useful for waiting for M-PESA confirmation
   */
  async pollPaymentStatus(
    transactionRef: string,
    options: {
      interval?: number; // ms between polls (default: 3000)
      timeout?: number; // total timeout in ms (default: 120000 = 2 min)
      onStatusUpdate?: (status: PaymentStatusResponse) => void;
    } = {}
  ): Promise<PaymentStatusResponse> {
    const { interval = 3000, timeout = 120000, onStatusUpdate } = options;
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const status = await this.getPaymentStatus(transactionRef);

          // Notify callback of status update
          if (onStatusUpdate) {
            onStatusUpdate(status);
          }

          // Terminal states - resolve
          if (
            status.status === 'success' ||
            status.status === 'failed' ||
            status.status === 'abandoned'
          ) {
            resolve(status);
            return;
          }

          // Check timeout
          if (Date.now() - startTime > timeout) {
            reject(new Error('Payment verification timeout after 2 minutes'));
            return;
          }

          // Continue polling
          setTimeout(checkStatus, interval);
        } catch (error) {
          reject(error);
        }
      };

      checkStatus();
    });
  }

  /**
   * Format phone number to Kenyan format (+254XXXXXXXXX)
   */
  formatPhoneNumber(phone: string): string {
    // Remove spaces, dashes, and parentheses
    phone = phone.replace(/[\s\-()]/g, '');

    // Remove leading + if present
    phone = phone.replace(/^\+/, '');

    // Remove leading zeros
    if (phone.startsWith('0')) {
      phone = phone.substring(1);
    }

    // Add country code if not present
    if (!phone.startsWith('254')) {
      phone = '254' + phone;
    }

    // Add + prefix
    return '+' + phone;
  }

  /**
   * Validate Kenyan phone number format
   * Valid: +254712345678 (Safaricom) or +254112345678 (Airtel)
   */
  isValidKenyanPhone(phone: string): boolean {
    // Must be +254 followed by 7XX or 1XX (9 more digits)
    return /^\+254[17]\d{8}$/.test(phone);
  }

  /**
   * Format amount for display with currency
   */
  formatAmount(amount: number): string {
    return `KES ${amount.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  /**
   * Extract transaction reference from Paystack callback URL
   * URL format: /payment/callback?reference=xxx&trxref=xxx
   */
  extractReferenceFromUrl(url: string = window.location.href): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('reference') || urlObj.searchParams.get('trxref');
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const mpesaPaymentService = new MVPPaymentService();

// Export class for testing
export default MVPPaymentService;
