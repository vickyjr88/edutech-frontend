import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ThreeDSecureHandlerProps {
  authUrl: string;
  paymentId?: string;
  amount: number;
  currency: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

const ThreeDSecureHandler: React.FC<ThreeDSecureHandlerProps> = ({
  authUrl,
  paymentId,
  amount,
  currency,
  onSuccess,
  onError,
  onCancel
}) => {
  const [status, setStatus] = useState<'pending' | 'authenticating' | 'checking' | 'success' | 'failed'>('pending');
  const [authWindow, setAuthWindow] = useState<Window | null>(null);
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const openAuthWindow = () => {
    const width = 600;
    const height = 700;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    
    const authWin = window.open(
      authUrl,
      '3ds-auth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
    
    if (!authWin) {
      onError?.('Failed to open authentication window. Please allow popups and try again.');
      return;
    }
    
    setAuthWindow(authWin);
    setStatus('authenticating');
    
    // Check if window is closed periodically
    const interval = setInterval(() => {
      if (authWin.closed) {
        setStatus('checking');
        clearInterval(interval);
        checkPaymentStatus();
      }
    }, 1000);
    
    setCheckInterval(interval);
    
    // Also listen for focus events to detect when user comes back
    const handleFocus = () => {
      if (authWin.closed) {
        setStatus('checking');
        window.removeEventListener('focus', handleFocus);
        checkPaymentStatus();
      }
    };
    
    window.addEventListener('focus', handleFocus);
  };

  const checkPaymentStatus = async () => {
    // In a real implementation, you would call your backend to check payment status
    // For now, we'll simulate the check
    setStatus('checking');
    
    try {
      // Simulate API call to check payment status
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would be the actual status from your backend
      const paymentStatus = Math.random() > 0.2 ? 'succeeded' : 'failed';
      
      if (paymentStatus === 'succeeded') {
        setStatus('success');
        setTimeout(() => onSuccess?.(), 1500);
      } else {
        setStatus('failed');
        onError?.('Payment authentication failed. Please try again.');
      }
    } catch (error) {
      setStatus('failed');
      onError?.('Failed to verify payment status. Please contact support.');
    }
  };

  const handleCancel = () => {
    if (authWindow && !authWindow.closed) {
      authWindow.close();
    }
    if (checkInterval) {
      clearInterval(checkInterval);
    }
    setStatus('pending');
    onCancel?.();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (authWindow && !authWindow.closed) {
        authWindow.close();
      }
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [authWindow, checkInterval]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          3D Secure Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-lg font-semibold">
            {formatAmount(amount, currency)}
          </div>
          {paymentId && (
            <div className="text-sm text-muted-foreground">
              Payment ID: {paymentId}
            </div>
          )}
        </div>

        {status === 'pending' && (
          <>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your card requires additional authentication to complete this payment. Click below to verify your identity.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Button 
                onClick={openAuthWindow}
                className="w-full flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Verify Identity
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="w-full"
              >
                Cancel Payment
              </Button>
            </div>
          </>
        )}

        {status === 'authenticating' && (
          <>
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Authentication window is open. Please complete the verification in the popup window.
              </AlertDescription>
            </Alert>
            
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="w-full"
              >
                Cancel Authentication
              </Button>
            </div>
          </>
        )}

        {status === 'checking' && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Verifying payment status. Please wait...
            </AlertDescription>
          </Alert>
        )}

        {status === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Authentication successful! Your payment is being processed.
            </AlertDescription>
          </Alert>
        )}

        {status === 'failed' && (
          <>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Authentication failed. Please try again or use a different payment method.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button 
                onClick={() => setStatus('pending')}
                className="w-full"
              >
                Try Again
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="w-full"
              >
                Use Different Payment Method
              </Button>
            </div>
          </>
        )}

        <div className="text-xs text-muted-foreground text-center">
          This verification helps protect your card from unauthorized use.
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreeDSecureHandler;