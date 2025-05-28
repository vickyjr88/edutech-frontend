import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import { 
  BasisTheoryProvider, 
  CardNumberElement,
  CardExpirationDateElement,
  CardVerificationCodeElement,
  useBasisTheory 
} from '@basis-theory/basis-theory-react';
import { BasisTheory } from '@basis-theory/basis-theory-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Shield } from 'lucide-react';

// Custom BasisTheory Context
const CustomBasisTheoryContext = createContext<{ bt: any }>({ bt: null });

const CustomBasisTheoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bt, setBt] = useState<any>(null);

  useEffect(() => {
    const initBasisTheory = async () => {
      try {
        const basisTheory = await new BasisTheory().init(import.meta.env.VITE_BASIS_THEORY_API_KEY, {
          elements: true
        });
        setBt(basisTheory);
        console.log('Custom BasisTheory initialized successfully');
      } catch (error) {
        console.error('Failed to initialize BasisTheory:', error);
      }
    };
    
    initBasisTheory();
  }, []);

  return (
    <CustomBasisTheoryContext.Provider value={{ bt }}>
      {children}
    </CustomBasisTheoryContext.Provider>
  );
};

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
  currency = 'USD',
  onSuccess,
  onError,
  title = 'Payment Information',
  description = 'Enter your card details to complete payment'
}) => {
  const { bt } = useContext(CustomBasisTheoryContext);
  const cardNumberRef = useRef<any>();
  const cardExpiryRef = useRef<any>();
  const cardCvcRef = useRef<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [cardholder, setCardholder] = useState('');

  useEffect(() => {
    console.log('BasisTheory instance available:', !!bt);
    
    if (bt) {
      // Create elements after BasisTheory is initialized
      setTimeout(() => {
        const elementStyle = {
          base: {
            color: '#000000',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            lineHeight: '24px',
            padding: '12px 16px',
            '::placeholder': {
              color: '#9CA3AF',
            },
          },
          invalid: { color: '#EF4444' },
          complete: { color: '#059669' },
        };

        try {
          // Card Number
          const cardNumberEl = document.getElementById('cardNumber');
          if (cardNumberEl && cardNumberEl.innerHTML === '') {
            const cardNumber = bt.createElement('cardNumber', {
              targetId: 'cardNumber',
              style: elementStyle,
              placeholder: '1234 5678 9012 3456',
              disabled: false,
              readOnly: false
            });
            
            // Add event listeners to test
            cardNumber.on('ready', () => {
              console.log('Card number ready - now accepting input');
              // Try to focus after ready
              setTimeout(() => cardNumber.focus(), 100);
            });
            cardNumber.on('change', (e) => console.log('Card number change:', e));
            cardNumber.on('focus', () => console.log('Card number focused'));
            cardNumber.on('blur', () => console.log('Card number blurred'));
            
            cardNumberRef.current = cardNumber;
            console.log('Card number element created');
          }

          // Card Expiry  
          const cardExpiryEl = document.getElementById('cardExpiry');
          if (cardExpiryEl && cardExpiryEl.innerHTML === '') {
            const cardExpiry = bt.createElement('cardExpirationDate', {
              targetId: 'cardExpiry',
              style: elementStyle,
              placeholder: 'MM/YY',
              disabled: false,
              readOnly: false
            });
            
            cardExpiry.on('ready', () => console.log('Card expiry ready - now accepting input'));
            cardExpiry.on('change', (e) => console.log('Card expiry change:', e));
            
            cardExpiryRef.current = cardExpiry;
            console.log('Card expiry element created');
          }

          // Card CVC
          const cardCvcEl = document.getElementById('cardCvc');
          if (cardCvcEl && cardCvcEl.innerHTML === '') {
            const cardCvc = bt.createElement('cardVerificationCode', {
              targetId: 'cardCvc',
              style: elementStyle,
              placeholder: '123',
              disabled: false,
              readOnly: false
            });
            
            cardCvc.on('ready', () => console.log('Card CVC ready - now accepting input'));
            cardCvc.on('change', (e) => console.log('Card CVC change:', e));
            
            cardCvcRef.current = cardCvc;
            console.log('Card CVC element created');
          }
        } catch (elementError) {
          console.error('Error creating elements:', elementError);
          setError('Failed to create payment elements: ' + elementError.message);
        }
      }, 100);
    }
  }, [bt]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!bt || !cardNumberRef.current || !cardExpiryRef.current || !cardCvcRef.current) {
        throw new Error('Payment system not initialized');
      }

      // Tokenize the card using separate elements
      const token = await bt.tokenize({
        type: 'card',
        data: {
          number: cardNumberRef.current,
          expiration_month: cardExpiryRef.current,
          expiration_year: cardExpiryRef.current,
          cvc: cardCvcRef.current
        },
        metadata: {
          cardholder_name: cardholder
        }
      });

      if (!token) {
        throw new Error('Failed to tokenize card');
      }

      // Here you would typically send the token to your backend
      // to process the payment with your payment processor
      const paymentResult = {
        token: token.id,
        amount,
        currency,
        cardholder,
        timestamp: new Date().toISOString()
      };

      onSuccess?.(paymentResult);
    } catch (err) {
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
            <div 
              id="cardNumber"
              className="border rounded-md bg-background" 
              style={{ minHeight: '48px' }}
            />
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <div 
                id="cardExpiry"
                className="border rounded-md bg-background" 
                style={{ minHeight: '48px' }}
              />
            </div>

            <div className="space-y-2">
              <Label>CVC</Label>
              <div 
                id="cardCvc"
                className="border rounded-md bg-background" 
                style={{ minHeight: '48px' }}
              />
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
  if (!apiKey) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-red-600">Error: No Basis Theory API key provided</p>
      </div>
    );
  }
  
  return (
    <CustomBasisTheoryProvider>
      <CardPaymentForm {...props} />
    </CustomBasisTheoryProvider>
  );
};

export default CardPaymentWrapper;
export { CardPaymentForm };