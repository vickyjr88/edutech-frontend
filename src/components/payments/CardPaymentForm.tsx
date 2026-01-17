import React, { useRef, useState, useEffect } from 'react';
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

interface CardPaymentFormProps {
  amount: number;
  currency?: string;
  onSuccess?: (paymentResult: any) => void;
  onError?: (error: string) => void;
  title?: string;
  description?: string;
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  amount,
  currency = 'KES',
  onSuccess,
  onError,
  title = 'Payment Information',
  description = 'Enter your card details to complete payment'
}) => {
  const { bt } = useBasisTheory();
  const cardNumberRef = useRef<any>();
  const cardExpiryRef = useRef<any>();
  const cardCvcRef = useRef<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [cardholder, setCardholder] = useState('');
  const [cardBrand, setCardBrand] = useState();

  // Debug logging
  useEffect(() => {
    console.log('BasisTheory instance from provider:', bt);
    console.log('BT available:', !!bt);
    if (bt) {
      console.log('BT methods:', Object.keys(bt));
    }
  }, [bt]);

  // Debug element refs
  useEffect(() => {
    console.log('Element refs:', {
      cardNumber: cardNumberRef.current,
      cardExpiry: cardExpiryRef.current,
      cardCvc: cardCvcRef.current
    });
  }, [cardNumberRef.current, cardExpiryRef.current, cardCvcRef.current]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!bt || !cardNumberRef.current || !cardExpiryRef.current || !cardCvcRef.current) {
        throw new Error('Payment system not initialized');
      }

      console.log('Attempting tokenization with BasisTheory...');

      // Create tokenize request according to Basis Theory documentation
      const tokenizeResponse = await bt.tokenize({
        number: cardNumberRef.current,
        expiration_month: cardExpiryRef.current,
        expiration_year: cardExpiryRef.current,
        cvc: cardCvcRef.current
      });

      if (!tokenizeResponse || !tokenizeResponse.fingerprint) {
        throw new Error('Failed to tokenize card - no fingerprint received');
      }

      console.log('Tokenization successful:', {
        fingerprint: tokenizeResponse.fingerprint,
        last4: tokenizeResponse.data?.last4
      });

      const paymentResult = {
        fingerprint: tokenizeResponse.fingerprint,
        token: tokenizeResponse.id,
        last4: tokenizeResponse.data?.last4,
        amount,
        currency,
        cardholder,
        timestamp: new Date().toISOString()
      };

      onSuccess?.(paymentResult);
    } catch (err) {
      console.error('Basis Theory tokenization error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="text-lg font-semibold text-primary">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
          }).format(amount)}
        </div>
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
              <CardNumberElement
                id="cardNumber"
                ref={cardNumberRef}
                onChange={({ cardBrand }) => setCardBrand(cardBrand)}
                style={{
                  base: {
                    fontSize: '16px',
                    color: '#374151',
                    fontFamily: 'system-ui, sans-serif',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    '::placeholder': {
                      color: '#9CA3AF',
                    },
                  },
                  invalid: {
                    color: '#EF4444',
                    borderColor: '#EF4444',
                  },
                  complete: {
                    color: '#059669',
                    borderColor: '#059669',
                  },
                }}
                placeholder="1234 5678 9012 3456"
              />
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
                <CardExpirationDateElement
                  id="cardExpiry"
                  ref={cardExpiryRef}
                  style={{
                    base: {
                      fontSize: '16px',
                      color: '#374151',
                      fontFamily: 'system-ui, sans-serif',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      '::placeholder': {
                        color: '#9CA3AF',
                      },
                    },
                    invalid: {
                      color: '#EF4444',
                      borderColor: '#EF4444',
                    },
                    complete: {
                      color: '#059669',
                      borderColor: '#059669',
                    },
                  }}
                  placeholder="MM/YY"
                />
              ) : (
                <div className="border border-gray-300 rounded-md p-3 bg-white min-h-[48px] flex items-center">
                  <span className="text-gray-400">Loading...</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>CVC</Label>
              {bt ? (
                <CardVerificationCodeElement
                  id="cardCvc"
                  ref={cardCvcRef}
                  cardBrand={cardBrand}
                  style={{
                    base: {
                      fontSize: '16px',
                      color: '#374151',
                      fontFamily: 'system-ui, sans-serif',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      '::placeholder': {
                        color: '#9CA3AF',
                      },
                    },
                    invalid: {
                      color: '#EF4444',
                      borderColor: '#EF4444',
                    },
                    complete: {
                      color: '#059669',
                      borderColor: '#059669',
                    },
                  }}
                  placeholder="123"
                />
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
                Processing...
              </>
            ) : (
              `Pay ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
              }).format(amount)}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Wrapper component with BasisTheoryProvider
interface CardPaymentWrapperProps extends CardPaymentFormProps {
  apiKey: string;
}

const CardPaymentWrapper: React.FC<CardPaymentWrapperProps> = ({
  apiKey,
  ...props
}) => {
  console.log('CardPaymentWrapper apiKey:', apiKey);
  const { bt } = useBasisTheory(apiKey);

  if (!apiKey) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-red-600">Error: No Basis Theory API key provided</p>
      </div>
    );
  }

  return (
    <BasisTheoryProvider bt={bt}>
      <CardPaymentForm {...props} />
    </BasisTheoryProvider>
  );
};

export default CardPaymentWrapper;
export { CardPaymentForm };