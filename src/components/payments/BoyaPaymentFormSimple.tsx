import React, { useRef, useState } from 'react';
import { 
  BasisTheoryProvider, 
  CardNumberElement,
  CardExpirationDateElement,
  CardVerificationCodeElement,
  useBasisTheory 
} from '@basis-theory/react-elements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Shield } from 'lucide-react';
import BoyaPaymentService, { BoyaCustomer, BoyaPaymentResponse } from '@/services/boya-payment.service';

interface BoyaPaymentFormSimpleProps {
  amount: number;
  currency?: string;
  customer?: BoyaCustomer;
  customerId?: string;
  description?: string;
  saveForRecurringPayments?: boolean;
  onSuccess?: (paymentResult: BoyaPaymentResponse) => void;
  onError?: (error: string, boyaError?: any) => void;
  onRequires3DSecure?: (authUrl: string) => void;
  title?: string;
  formDescription?: string;
}

const BoyaPaymentFormSimple: React.FC<BoyaPaymentFormSimpleProps> = ({
  amount,
  currency = 'USD',
  customer,
  customerId,
  description = 'Payment',
  saveForRecurringPayments = false,
  onSuccess,
  onError,
  onRequires3DSecure,
  title = 'Payment Information',
  formDescription = 'Enter your card details to complete payment'
}) => {
  const { bt } = useBasisTheory();
  const cardNumberRef = useRef<any>();
  const cardExpiryRef = useRef<any>();
  const cardCvcRef = useRef<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [cardholder, setCardholder] = useState(customer?.name || '');
  const [cardBrand, setCardBrand] = useState();
  const [paymentService] = useState(() => new BoyaPaymentService());

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!bt || !cardNumberRef.current || !cardExpiryRef.current || !cardCvcRef.current) {
        throw new Error('Payment system not initialized');
      }

      // Validate customer information
      if (!customerId && !customer) {
        throw new Error('Customer information is required');
      }

      console.log('Step 1: Tokenizing card with Basis Theory...');

      // Step 1: Tokenize the card with Basis Theory using the documented approach
      const tokenizeResponse = await bt.tokenize({
        number: cardNumberRef.current,
        expiration_month: cardExpiryRef.current, 
        expiration_year: cardExpiryRef.current,
        cvc: cardCvcRef.current
      });

      console.log('Tokenization response:', tokenizeResponse);

      if (!tokenizeResponse || !tokenizeResponse.fingerprint) {
        throw new Error('Failed to tokenize card - no fingerprint received');
      }

      console.log('Step 1 Complete: Card tokenized successfully');
      console.log('Step 2: Processing payment with Boya...');

      // Step 2: Process payment with Boya using the fingerprint
      const paymentResponse = await paymentService.processPayment({
        fingerprint: tokenizeResponse.fingerprint,
        amount: BoyaPaymentService.toCents(amount, currency),
        currency,
        customer: customerId ? undefined : customer,
        customerId,
        description,
        saveForRecurringPayments
      });

      console.log('Step 2 Complete: Payment response received:', paymentResponse.status);

      // Step 3: Handle the payment response
      if (paymentResponse.status === 'succeeded') {
        console.log('Payment succeeded immediately');
        onSuccess?.(paymentResponse);
      } else if (paymentService.requires3DSecure(paymentResponse)) {
        console.log('Payment requires 3D Secure authentication');
        const authUrl = paymentService.get3DSecureUrl(paymentResponse);
        if (authUrl && onRequires3DSecure) {
          onRequires3DSecure(authUrl);
        } else {
          throw new Error('3D Secure authentication required but no handler provided');
        }
      } else if (paymentResponse.status === 'pending') {
        console.log('Payment is pending');
        onSuccess?.(paymentResponse);
      } else {
        throw new Error(paymentResponse.error?.message || `Payment ${paymentResponse.status}`);
      }

    } catch (err: any) {
      console.error('Payment processing error:', err);
      
      let errorMessage = 'Payment failed. Please try again.';
      
      // Handle Boya API errors
      if (err.userMessage) {
        errorMessage = err.userMessage;
      } else if (err.boyaError) {
        errorMessage = err.boyaError.message || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      onError?.(errorMessage, err.boyaError);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{formDescription}</p>
        <div className="text-lg font-semibold text-primary">
          {formatAmount(amount, currency)}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label htmlFor="cardholder">Cardholder Name</Label>
            <Input
              id="cardholder"
              type="text"
              value={cardholder}
              onChange={(e) => setCardholder(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <Label>Card Number</Label>
            {bt ? (
              <div className="border border-gray-300 rounded-md p-3 bg-white">
                <CardNumberElement
                  id="cardNumber"
                  ref={cardNumberRef}
                  onChange={({ cardBrand }) => setCardBrand(cardBrand)}
                  style={{
                    base: {
                      fontSize: '16px',
                      color: '#374151',
                      fontFamily: 'system-ui, sans-serif',
                      '::placeholder': {
                        color: '#9CA3AF',
                      },
                    },
                    invalid: { 
                      color: '#EF4444',
                    },
                    complete: { 
                      color: '#059669',
                    },
                  }}
                  placeholder="1234 5678 9012 3456"
                />
              </div>
            ) : (
              <div className="border border-gray-300 rounded-md p-3 bg-white min-h-[48px] flex items-center">
                <span className="text-gray-400">Loading card input...</span>
              </div>
            )}
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              {bt ? (
                <div className="border border-gray-300 rounded-md p-3 bg-white">
                  <CardExpirationDateElement
                    id="cardExpiry"
                    ref={cardExpiryRef}
                    style={{
                      base: {
                        fontSize: '16px',
                        color: '#374151',
                        fontFamily: 'system-ui, sans-serif',
                        '::placeholder': {
                          color: '#9CA3AF',
                        },
                      },
                      invalid: { 
                        color: '#EF4444',
                      },
                      complete: { 
                        color: '#059669',
                      },
                    }}
                    placeholder="MM/YY"
                  />
                </div>
              ) : (
                <div className="border border-gray-300 rounded-md p-3 bg-white min-h-[48px] flex items-center">
                  <span className="text-gray-400">Loading...</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>CVC</Label>
              {bt ? (
                <div className="border border-gray-300 rounded-md p-3 bg-white">
                  <CardVerificationCodeElement
                    id="cardCvc"
                    ref={cardCvcRef}
                    cardBrand={cardBrand}
                    style={{
                      base: {
                        fontSize: '16px',
                        color: '#374151',
                        fontFamily: 'system-ui, sans-serif',
                        '::placeholder': {
                          color: '#9CA3AF',
                        },
                      },
                      invalid: { 
                        color: '#EF4444',
                      },
                      complete: { 
                        color: '#059669',
                      },
                    }}
                    placeholder="123"
                  />
                </div>
              ) : (
                <div className="border border-gray-300 rounded-md p-3 bg-white min-h-[48px] flex items-center">
                  <span className="text-gray-400">Loading...</span>
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Your payment information is encrypted and secure</span>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !cardholder.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay ${formatAmount(amount, currency)}`
            )}
          </Button>

          {/* Powered by notice */}
          <div className="text-center text-xs text-muted-foreground">
            Secured by Basis Theory • Processed by Boya
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Wrapper component with BasisTheoryProvider
interface BoyaPaymentWrapperSimpleProps extends BoyaPaymentFormSimpleProps {
  apiKey: string;
}

const BoyaPaymentWrapperSimple: React.FC<BoyaPaymentWrapperSimpleProps> = ({
  apiKey,
  ...props
}) => {
  if (!apiKey) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-red-600">Error: No Basis Theory API key provided</p>
      </div>
    );
  }
  
  return (
    <BasisTheoryProvider apiKey={apiKey}>
      <BoyaPaymentFormSimple {...props} />
    </BasisTheoryProvider>
  );
};

export default BoyaPaymentWrapperSimple;
export { BoyaPaymentFormSimple };
export type { BoyaPaymentFormSimpleProps };