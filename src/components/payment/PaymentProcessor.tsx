/**
 * Payment Processor Component
 *
 * Handles M-PESA payment flow via Paystack:
 * 1. Shows payment summary
 * 2. Collects phone number
 * 3. Initiates payment
 * 4. Redirects to Paystack
 * 5. Handles callback and verification
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Smartphone,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mpesaPaymentService } from '@/integrations/api/services/mvp-payment.service';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentProcessorProps {
  bookingId: string;
  amount: number;
  offeringTitle: string;
  teacherName: string;
  scheduledDate: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentProcessor({
  bookingId,
  amount,
  offeringTitle,
  teacherName,
  scheduledDate,
  onSuccess,
  onCancel,
}: PaymentProcessorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Validate phone number
      const formattedPhone = mpesaPaymentService.formatPhoneNumber(phoneNumber);
      if (!mpesaPaymentService.isValidKenyanPhone(formattedPhone)) {
        setError('Please enter a valid Kenyan phone number (e.g., 0712345678)');
        setIsProcessing(false);
        return;
      }

      // Initiate payment
      const response = await mpesaPaymentService.initiateMpesaPayment({
        bookingId,
        amount,
        phoneNumber: formattedPhone,
        email: user?.email || '',
        customerName: user?.fullName || '',
      });

      if (response.success) {
        toast({
          title: 'Redirecting to payment',
          description: 'You will be redirected to complete payment...',
        });

        // Store transaction ref for verification after callback
        sessionStorage.setItem('pendingPaymentRef', response.transactionRef);
        sessionStorage.setItem('pendingBookingId', bookingId);

        // Redirect to Paystack
        window.location.href = response.authorizationUrl;
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const message = error instanceof Error ? error.message : 'Failed to initiate payment';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Payment failed',
        description: message,
      });
      setIsProcessing(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Only allow digits, spaces, and + symbol
    value = value.replace(/[^\d\s+]/g, '');
    setPhoneNumber(value);
  };

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Summary
          </CardTitle>
          <CardDescription>Review your booking details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Offering</span>
              <span className="font-medium">{offeringTitle}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Teacher</span>
              <span className="font-medium">{teacherName}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">{scheduledDate}</span>
            </div>
            <div className="flex justify-between py-3 bg-blue-50 px-3 rounded-lg mt-4">
              <span className="font-semibold">Total Amount</span>
              <span className="text-2xl font-bold">
                {mpesaPaymentService.formatAmount(amount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            M-PESA Payment
          </CardTitle>
          <CardDescription>
            Enter your M-PESA phone number to complete payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Phone Number Input */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">M-PESA Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="0712345678"
              value={phoneNumber}
              onChange={handlePhoneChange}
              disabled={isProcessing}
              className="text-lg"
            />
            <p className="text-sm text-gray-500">
              You will receive an M-PESA prompt on this number
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Payment Instructions */}
          <Alert>
            <Smartphone className="h-4 w-4" />
            <AlertDescription>
              <strong>How it works:</strong>
              <ol className="mt-2 ml-4 text-sm space-y-1 list-decimal">
                <li>Click "Pay with M-PESA" below</li>
                <li>You'll be redirected to complete payment</li>
                <li>Enter your M-PESA PIN on your phone</li>
                <li>You'll receive a confirmation SMS</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1"
              size="lg"
              onClick={handlePayment}
              disabled={isProcessing || !phoneNumber}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Smartphone className="h-5 w-5 mr-2" />
                  Pay with M-PESA
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                variant="outline"
                size="lg"
                onClick={onCancel}
                disabled={isProcessing}
              >
                Cancel
              </Button>
            )}
          </div>

          {/* Security Note */}
          <p className="text-xs text-center text-gray-500 mt-4">
            🔒 Your payment is secure and processed by Paystack
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
