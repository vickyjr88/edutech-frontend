export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  name: string;
}

export interface PaymentResult {
  token: string;
  amount: number;
  currency: string;
  cardholder: string;
  timestamp: string;
  paymentMethodId?: string;
}

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'cancelled';
  description: string;
  downloadUrl?: string;
}

export interface PaymentFormConfig {
  apiKey: string;
  currency: string;
  allowedCardBrands?: string[];
  collectBillingAddress?: boolean;
  theme?: 'light' | 'dark';
}