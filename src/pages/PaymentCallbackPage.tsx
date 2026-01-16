/**
 * Payment Callback Page
 *
 * Handles return from Paystack after payment attempt
 * Verifies payment and redirects to appropriate page
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Home,
  Receipt,
} from 'lucide-react';
import { mpesaPaymentService } from '@/integrations/api/services/mvp-payment.service';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type PaymentResult = 'verifying' | 'success' | 'failed' | 'error';

export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [result, setResult] = useState<PaymentResult>('verifying');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [bookingId, setBookingId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Get transaction reference from URL
      const reference = searchParams.get('reference') || searchParams.get('trxref');

      if (!reference) {
        setResult('error');
        setErrorMessage('Payment reference not found');
        return;
      }

      setTransactionRef(reference);

      // Get booking ID from session storage
      const pendingBookingId = sessionStorage.getItem('pendingBookingId');
      if (pendingBookingId) {
        setBookingId(pendingBookingId);
      }

      // Verify payment with backend
      const status = await mpesaPaymentService.verifyPayment(reference);

      if (status.status === 'success') {
        setResult('success');
        setAmount(status.amount || 0);

        // Clear session storage
        sessionStorage.removeItem('pendingPaymentRef');
        sessionStorage.removeItem('pendingBookingId');

        toast({
          title: 'Payment successful!',
          description: 'Your booking has been confirmed.',
        });
      } else if (status.status === 'failed') {
        setResult('failed');
        setErrorMessage(status.gatewayResponse || 'Payment was not completed');
      } else {
        // Still pending - poll for status
        await pollPaymentStatus(reference);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setResult('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to verify payment'
      );
    }
  };

  const pollPaymentStatus = async (reference: string) => {
    try {
      const status = await mpesaPaymentService.pollPaymentStatus(reference, {
        interval: 3000,
        timeout: 60000, // 1 minute
        onStatusUpdate: (status) => {
          console.log('Payment status:', status.status);
        },
      });

      if (status.status === 'success') {
        setResult('success');
        setAmount(status.amount || 0);

        // Clear session storage
        sessionStorage.removeItem('pendingPaymentRef');
        sessionStorage.removeItem('pendingBookingId');

        toast({
          title: 'Payment successful!',
          description: 'Your booking has been confirmed.',
        });
      } else {
        setResult('failed');
        setErrorMessage(status.gatewayResponse || 'Payment was not completed');
      }
    } catch (error) {
      setResult('error');
      setErrorMessage('Payment verification timeout. Please check your bookings.');
    }
  };

  const handleGoHome = () => {
    navigate('/parents-dashboard');
  };

  const handleViewBookings = () => {
    navigate('/parents-dashboard/courses');
  };

  const handleRetry = () => {
    // Clear session and go back to booking
    sessionStorage.removeItem('pendingPaymentRef');
    sessionStorage.removeItem('pendingBookingId');
    navigate(-2); // Go back to booking page
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Verifying */}
          {result === 'verifying' && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
                <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
                <p className="text-gray-600 text-center">
                  Please wait while we confirm your payment...
                </p>
              </CardContent>
            </Card>
          )}

          {/* Success */}
          {result === 'success' && (
            <Card className="border-green-200">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-green-900">
                  Payment Successful!
                </CardTitle>
                <CardDescription>
                  Your booking has been confirmed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                  {amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Amount Paid:</span>
                      <span className="font-bold text-green-900">
                        {mpesaPaymentService.formatAmount(amount)}
                      </span>
                    </div>
                  )}
                  {transactionRef && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Reference:</span>
                      <span className="font-mono text-sm">{transactionRef}</span>
                    </div>
                  )}
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    You will receive a confirmation SMS shortly. The teacher has been notified of your booking.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3">
                  <Button className="flex-1" onClick={handleViewBookings}>
                    <Receipt className="h-4 w-4 mr-2" />
                    View My Bookings
                  </Button>
                  <Button variant="outline" onClick={handleGoHome}>
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Failed */}
          {result === 'failed' && (
            <Card className="border-red-200">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-10 w-10 text-red-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-red-900">
                  Payment Failed
                </CardTitle>
                <CardDescription>
                  Your payment could not be completed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Common reasons for failure:</strong>
                  </p>
                  <ul className="mt-2 ml-4 text-sm text-gray-600 space-y-1 list-disc">
                    <li>Insufficient M-PESA balance</li>
                    <li>Incorrect M-PESA PIN</li>
                    <li>Transaction cancelled</li>
                    <li>Network timeout</li>
                  </ul>
                </div>

                {transactionRef && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600">Reference: {transactionRef}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button className="flex-1" onClick={handleRetry}>
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={handleGoHome}>
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {result === 'error' && (
            <Card className="border-yellow-200">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-10 w-10 text-yellow-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-yellow-900">
                  Verification Error
                </CardTitle>
                <CardDescription>
                  We couldn't verify your payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {errorMessage ||
                      'There was an issue verifying your payment. If money was deducted from your account, please contact support.'}
                  </AlertDescription>
                </Alert>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>What to do:</strong>
                  </p>
                  <ul className="mt-2 ml-4 text-sm text-gray-600 space-y-1 list-decimal">
                    <li>Check your M-PESA messages for confirmation</li>
                    <li>Check "My Bookings" to see if booking was created</li>
                    <li>If payment was deducted, contact support with reference below</li>
                  </ul>
                </div>

                {transactionRef && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600">
                      <strong>Reference:</strong> {transactionRef}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button className="flex-1" onClick={handleViewBookings}>
                    Check My Bookings
                  </Button>
                  <Button variant="outline" onClick={handleGoHome}>
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
