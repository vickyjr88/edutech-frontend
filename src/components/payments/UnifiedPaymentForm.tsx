import React, { useState } from 'react';
import CardPaymentWrapper from './CardPaymentForm';
import StripePaymentWrapper from './StripePaymentForm';
import BoyaPaymentWrapper from './BoyaPaymentForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import type { BoyaCustomer, BoyaPaymentResponse } from '@/services/boya-payment.service';

interface UnifiedPaymentFormProps {
  amount: number;
  currency?: string;
  customer?: BoyaCustomer;
  customerId?: string;
  paymentDescription?: string;
  saveForRecurringPayments?: boolean;
  onSuccess?: (paymentResult: any) => void;
  onError?: (error: string, boyaError?: any) => void;
  onRequires3DSecure?: (authUrl: string) => void;
  title?: string;
  description?: string;
  basisTheoryApiKey?: string;
  stripePublishableKey?: string;
  preferredProvider?: 'stripe' | 'basis-theory' | 'boya';
  useBoyaFlow?: boolean; // New flag to use Boya payment flow
}

const UnifiedPaymentForm: React.FC<UnifiedPaymentFormProps> = ({
  amount,
  currency = 'KES',
  customer,
  customerId,
  paymentDescription,
  saveForRecurringPayments = false,
  onSuccess,
  onError,
  onRequires3DSecure,
  title = 'Payment Information',
  description = 'Enter your card details to complete payment',
  basisTheoryApiKey,
  stripePublishableKey,
  preferredProvider = 'boya', // Default to Boya for new implementation
  useBoyaFlow = true // Default to using Boya flow
}) => {
  const [currentProvider, setCurrentProvider] = useState<'stripe' | 'basis-theory' | 'boya'>(preferredProvider);
  const [requires3DS, setRequires3DS] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const handlePaymentError = (error: string, boyaError?: any) => {
    console.error(`${currentProvider} payment error:`, error);
    setErrorCount(prev => prev + 1);

    // If using Boya and it fails, try Stripe as fallback (but only for non-Boya specific errors)
    if (currentProvider === 'boya' && stripePublishableKey && errorCount < 2 && !boyaError) {
      console.log('Falling back to Stripe payment processing...');
      setCurrentProvider('stripe');
      setHasError(true);
      return;
    }

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

    // If all fail or only one provider is available, report the error
    onError?.(error, boyaError);
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

  const handle3DSecure = (url: string) => {
    setAuthUrl(url);
    setRequires3DS(true);
    onRequires3DSecure?.(url);
  };

  const switchProvider = () => {
    if (currentProvider === 'boya' && stripePublishableKey) {
      setCurrentProvider('stripe');
    } else if (currentProvider === 'stripe' && basisTheoryApiKey) {
      setCurrentProvider('basis-theory');
    } else if (currentProvider === 'basis-theory' && basisTheoryApiKey && useBoyaFlow) {
      setCurrentProvider('boya');
    } else if (currentProvider === 'basis-theory' && stripePublishableKey) {
      setCurrentProvider('stripe');
    }
    setHasError(false);
    setErrorCount(0);
    setRequires3DS(false);
    setAuthUrl(null);
  };

  // Show error if no payment providers are configured
  if (!basisTheoryApiKey && !stripePublishableKey) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-red-600">Error: No payment providers configured</p>
      </div>
    );
  }

  // If 3D Secure is required, show authentication interface
  if (requires3DS && authUrl) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your card requires additional authentication. Please complete the verification to continue.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button
            onClick={() => window.open(authUrl, '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Complete Authentication
          </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          After completing authentication, your payment will be processed automatically.
        </div>
      </div>
    );
  }

  // Determine which providers are available
  const hasBothProviders = !!(basisTheoryApiKey && stripePublishableKey);
  const hasMultipleProviders = (basisTheoryApiKey && stripePublishableKey) || (useBoyaFlow && basisTheoryApiKey && stripePublishableKey);
  const canSwitchProvider = hasMultipleProviders && (
    (currentProvider === 'boya' && stripePublishableKey) ||
    (currentProvider === 'stripe' && basisTheoryApiKey) ||
    (currentProvider === 'basis-theory' && (stripePublishableKey || (useBoyaFlow && basisTheoryApiKey)))
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
      {currentProvider === 'boya' && basisTheoryApiKey && useBoyaFlow ? (
        <BoyaPaymentWrapper
          apiKey={basisTheoryApiKey}
          amount={amount}
          currency={currency}
          customer={customer}
          customerId={customerId}
          description={paymentDescription}
          saveForRecurringPayments={saveForRecurringPayments}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onRequires3DSecure={handle3DSecure}
          title={title}
          formDescription={description}
        />
      ) : currentProvider === 'stripe' && stripePublishableKey ? (
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
            Switch to {currentProvider === 'boya' ? 'Stripe' : currentProvider === 'stripe' ? 'Basis Theory' : useBoyaFlow ? 'Boya' : 'Stripe'}
          </Button>
        </div>
      )}

      {/* Provider Info */}
      <div className="text-center text-xs text-muted-foreground">
        Powered by {currentProvider === 'boya' ? 'Boya + Basis Theory' : currentProvider === 'stripe' ? 'Stripe' : 'Basis Theory'}
        {hasMultipleProviders && ' with automatic fallback'}
      </div>
    </div>
  );
};

export default UnifiedPaymentForm;