import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BoyaPaymentForm, ThreeDSecureHandler } from '@/components/payments';
import BoyaPaymentFormSimple from '@/components/payments/BoyaPaymentFormSimple';
import type { BoyaCustomer, BoyaPaymentResponse } from '@/services/boya-payment.service';

const BASIS_THEORY_API_KEY = import.meta.env.VITE_BASIS_THEORY_API_KEY;

const BoyaPaymentDemo: React.FC = () => {
  const [amount, setAmount] = useState(10);
  const [currency, setCurrency] = useState('USD');
  const [customer, setCustomer] = useState<BoyaCustomer>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890'
  });
  const [paymentResult, setPaymentResult] = useState<BoyaPaymentResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [requires3DS, setRequires3DS] = useState(false);
  const [authUrl, setAuthUrl] = useState<string>('');

  const handlePaymentSuccess = (result: BoyaPaymentResponse) => {
    console.log('Payment successful:', result);
    setPaymentResult(result);
    setError('');
    setRequires3DS(false);
  };

  const handlePaymentError = (error: string, boyaError?: any) => {
    console.error('Payment error:', error, boyaError);
    setError(error);
    setPaymentResult(null);
    setRequires3DS(false);
  };

  const handleRequires3DSecure = (url: string) => {
    console.log('3D Secure required:', url);
    setAuthUrl(url);
    setRequires3DS(true);
    setError('');
  };

  const handle3DSecureSuccess = () => {
    console.log('3D Secure completed successfully');
    setRequires3DS(false);
    setAuthUrl('');
    // In a real app, you would check the payment status from your backend
    setPaymentResult({
      id: 'payment_' + Date.now(),
      status: 'succeeded',
      amount: amount * 100, // Amount in cents
      currency,
      customer_id: 'customer_123'
    } as BoyaPaymentResponse);
  };

  const handle3DSecureError = (error: string) => {
    console.error('3D Secure error:', error);
    setRequires3DS(false);
    setAuthUrl('');
    setError(error);
  };

  const handle3DSecureCancel = () => {
    console.log('3D Secure cancelled');
    setRequires3DS(false);
    setAuthUrl('');
  };

  const resetDemo = () => {
    setPaymentResult(null);
    setError('');
    setRequires3DS(false);
    setAuthUrl('');
  };

  if (!BASIS_THEORY_API_KEY) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertDescription>
            Basis Theory API key not configured. Please set VITE_BASIS_THEORY_API_KEY in your environment.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Boya Payment Flow Demo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    placeholder="USD"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={customer.name}
                  onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="customerPhone">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  value={customer.phone}
                  onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              
              {(paymentResult || error) && (
                <Button onClick={resetDemo} variant="outline" className="w-full">
                  Reset Demo
                </Button>
              )}
            </CardContent>
          </Card>
          
          {/* Payment Form or Results */}
          <div>
            {requires3DS && authUrl ? (
              <ThreeDSecureHandler
                authUrl={authUrl}
                amount={amount}
                currency={currency}
                onSuccess={handle3DSecureSuccess}
                onError={handle3DSecureError}
                onCancel={handle3DSecureCancel}
              />
            ) : paymentResult ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Payment Successful!</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Payment ID:</strong> {paymentResult.id}</p>
                    <p><strong>Status:</strong> {paymentResult.status}</p>
                    <p><strong>Amount:</strong> {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: paymentResult.currency
                    }).format(paymentResult.amount / 100)}</p>
                    <p><strong>Customer ID:</strong> {paymentResult.customer_id}</p>
                    {paymentResult.payment_method && (
                      <>
                        <p><strong>Card Last 4:</strong> {paymentResult.payment_method.card?.last4}</p>
                        <p><strong>Card Brand:</strong> {paymentResult.payment_method.card?.brand}</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Payment Failed</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            ) : (
              <BoyaPaymentFormSimple
                apiKey={BASIS_THEORY_API_KEY}
                amount={amount}
                currency={currency}
                customer={customer}
                description={`Demo payment for ${amount} ${currency}`}
                saveForRecurringPayments={true}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onRequires3DSecure={handleRequires3DSecure}
                title="Complete Payment"
                formDescription="This is a demo of the Boya payment flow"
              />
            )}
          </div>
        </div>
        
        {/* Flow Explanation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Card details are collected securely using Basis Theory's iframe elements</li>
              <li>Card data is tokenized by Basis Theory, generating a fingerprint</li>
              <li>The fingerprint is sent to Boya's API for payment processing</li>
              <li>If 3D Secure is required, the user is redirected to authenticate</li>
              <li>Payment status is returned and handled appropriately</li>
            </ol>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Test Cards (for testing purposes):</h4>
              <ul className="text-sm space-y-1">
                <li><strong>Success:</strong> 4242 4242 4242 4242</li>
                <li><strong>Requires 3DS:</strong> 4000 0025 0000 3155</li>
                <li><strong>Insufficient Funds:</strong> 4000 0000 0000 9995</li>
                <li><strong>Generic Decline:</strong> 4000 0000 0000 0002</li>
              </ul>
              <p className="text-xs text-gray-600 mt-2">
                Use any future expiry date and any 3-digit CVC
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BoyaPaymentDemo;