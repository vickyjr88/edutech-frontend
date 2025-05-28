import React, { useRef, useState } from 'react';
import { 
  BasisTheoryProvider, 
  CardElement, 
  useBasisTheory 
} from '@basis-theory/basis-theory-react';
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
  currency = 'USD',
  onSuccess,
  onError,
  title = 'Payment Information',
  description = 'Enter your card details to complete payment'
}) => {
  const { bt } = useBasisTheory();
  const cardRef = useRef<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [cardholder, setCardholder] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!bt || !cardRef.current) {
        throw new Error('Payment system not initialized');
      }

      // Tokenize the card
      const token = await bt.tokenize({
        type: 'card',
        data: cardRef.current,
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

          {/* Card Element */}
          <div className="space-y-2">
            <Label>Card Details</Label>
            <div className="border rounded-md p-3 bg-background">
              <CardElement
                ref={cardRef}
                style={{
                  base: {
                    color: 'hsl(var(--foreground))',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '16px',
                    '::placeholder': {
                      color: 'hsl(var(--muted-foreground))',
                    },
                  },
                  invalid: {
                    color: 'hsl(var(--destructive))',
                  },
                }}
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
  return (
    <BasisTheoryProvider apiKey={apiKey}>
      <CardPaymentForm {...props} />
    </BasisTheoryProvider>
  );
};

export default CardPaymentWrapper;
export { CardPaymentForm };