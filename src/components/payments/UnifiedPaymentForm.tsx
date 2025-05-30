import React, { useState } from 'react';
import CardPaymentWrapper from './CardPaymentForm';
import StripePaymentWrapper from './StripePaymentForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface UnifiedPaymentFormProps {
  amount: number;
  currency?: string;
  onSuccess?: (paymentResult: any) => void;
  onError?: (error: string) => void;
  title?: string;
  description?: string;
  basisTheoryApiKey?: string;
  stripePublishableKey?: string;
  preferredProvider?: 'stripe' | 'basis-theory';
}

const UnifiedPaymentForm: React.FC<UnifiedPaymentFormProps> = ({
  amount,
  currency = 'USD',
  onSuccess,
  onError,
  title = 'Payment Information',
  description = 'Enter your card details to complete payment',
  basisTheoryApiKey,
  stripePublishableKey,
  preferredProvider = 'stripe'
}) => {
  const [currentProvider, setCurrentProvider] = useState<'stripe' | 'basis-theory'>(preferredProvider);
  const [hasError, setHasError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const handlePaymentError = (error: string) => {
    console.error(`${currentProvider} payment error:`, error);
    setErrorCount(prev => prev + 1);
    
    // If we're using Stripe and it fails, try Basis Theory as fallback
    if (currentProvider === 'stripe' && basisTheoryApiKey && errorCount < 2) {
      console.log('Falling back to Basis Theory payment processing...');
      setCurrentProvider('basis-theory');
      setHasError(true);
      return;
    }
    
    // If we're using Basis Theory and it fails, try Stripe as fallback
    if (currentProvider === 'basis-theory' && stripePublishableKey && errorCount < 2) {
      console.log('Falling back to Stripe payment processing...');
      setCurrentProvider('stripe');
      setHasError(true);
      return;
    }
    
    // If both fail or only one provider is available, report the error
    onError?.(error);
  };

  const handlePaymentSuccess = (result: any) => {
    console.log(`${currentProvider} payment successful:`, result);
    const enhancedResult = {
      ...result,
      provider: currentProvider,
      fallbackUsed: hasError
    };
    onSuccess?.(enhancedResult);
  };

  const switchProvider = () => {
    if (currentProvider === 'stripe' && basisTheoryApiKey) {
      setCurrentProvider('basis-theory');
    } else if (currentProvider === 'basis-theory' && stripePublishableKey) {
      setCurrentProvider('stripe');
    }
    setHasError(false);
    setErrorCount(0);
  };

  // Show error if no payment providers are configured
  if (!basisTheoryApiKey && !stripePublishableKey) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-red-600">Error: No payment providers configured</p>
      </div>
    );
  }

  // Determine which providers are available
  const hasBothProviders = !!(basisTheoryApiKey && stripePublishableKey);
  const canSwitchProvider = hasBothProviders && (
    (currentProvider === 'stripe' && basisTheoryApiKey) ||
    (currentProvider === 'basis-theory' && stripePublishableKey)
  );

  return (
    <div className="space-y-4">
      {/* Fallback Notice */}
      {hasError && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Switched to {currentProvider === 'basis-theory' ? 'Basis Theory' : 'Stripe'} payment processing as a backup.
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Form */}
      {currentProvider === 'stripe' && stripePublishableKey ? (
        <StripePaymentWrapper
          publishableKey={stripePublishableKey}
          amount={amount}
          currency={currency}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          title={title}
          description={description}
        />
      ) : currentProvider === 'basis-theory' && basisTheoryApiKey ? (
        <CardPaymentWrapper
          apiKey={basisTheoryApiKey}
          amount={amount}
          currency={currency}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          title={title}
          description={description}
        />
      ) : (
        <div className="p-4 border border-red-200 rounded-md bg-red-50">
          <p className="text-red-600">Error: Selected payment provider not available</p>
        </div>
      )}

      {/* Provider Switch Button (only show if multiple providers available) */}
      {canSwitchProvider && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={switchProvider}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Switch to {currentProvider === 'stripe' ? 'Basis Theory' : 'Stripe'}
          </Button>
        </div>
      )}

      {/* Provider Info */}
      <div className="text-center text-xs text-muted-foreground">
        Powered by {currentProvider === 'stripe' ? 'Stripe' : 'Basis Theory'}
        {hasBothProviders && ' with automatic fallback'}
      </div>
    </div>
  );
};

export default UnifiedPaymentForm;