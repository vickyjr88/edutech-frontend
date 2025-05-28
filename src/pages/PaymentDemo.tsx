import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, CreditCard, Users, GraduationCap } from 'lucide-react';
import { CardPaymentForm } from '@/components/payments';

// Demo API key for testing - replace with your actual API key
const DEMO_API_KEY = "key_N88g6TOnupigOITmBhAVBe";

const PaymentDemo = () => {
  const [paymentResults, setPaymentResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('student');

  const handlePaymentSuccess = (result: any, context: string) => {
    const newResult = {
      ...result,
      context,
      id: Date.now(),
      status: 'success'
    };
    setPaymentResults(prev => [newResult, ...prev]);
  };

  const handlePaymentError = (error: string, context: string) => {
    const newResult = {
      error,
      context,
      id: Date.now(),
      status: 'error',
      timestamp: new Date().toISOString()
    };
    setPaymentResults(prev => [newResult, ...prev]);
  };

  const demoScenarios = {
    student: {
      title: 'Student Course Payment',
      description: 'Pay for individual courses or class packages',
      amount: 149.99,
      icon: GraduationCap,
      color: 'text-blue-600'
    },
    parent: {
      title: 'Parent Subscription',
      description: 'Monthly family subscription for multiple children',
      amount: 199.00,
      icon: Users,
      color: 'text-green-600'
    },
    teacher: {
      title: 'Teacher Platform Fee',
      description: 'Platform commission and service fees',
      amount: 49.99,
      icon: CreditCard,
      color: 'text-purple-600'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment Integration Demo</h1>
          <p className="text-muted-foreground">
            Secure card payment processing with Basis Theory iframe integration
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Forms */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Demo Payment Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="student">Student</TabsTrigger>
                    <TabsTrigger value="parent">Parent</TabsTrigger>
                    <TabsTrigger value="teacher">Teacher</TabsTrigger>
                  </TabsList>

                  {Object.entries(demoScenarios).map(([key, scenario]) => (
                    <TabsContent key={key} value={key}>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-accent/50 rounded-lg">
                          <scenario.icon className={`h-6 w-6 ${scenario.color}`} />
                          <div>
                            <h3 className="font-medium">{scenario.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {scenario.description}
                            </p>
                          </div>
                        </div>

                        <CardPaymentForm
                          apiKey={DEMO_API_KEY}
                          amount={scenario.amount}
                          currency="USD"
                          title={scenario.title}
                          description={scenario.description}
                          onSuccess={(result) => handlePaymentSuccess(result, key)}
                          onError={(error) => handlePaymentError(error, key)}
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {paymentResults.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No payment attempts yet</p>
                      <p className="text-sm">Try making a payment to see results here</p>
                    </div>
                  ) : (
                    paymentResults.map((result) => (
                      <Alert
                        key={result.id}
                        variant={result.status === 'success' ? 'default' : 'destructive'}
                      >
                        {result.status === 'success' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="font-medium">
                              {result.status === 'success' ? 'Payment Successful' : 'Payment Failed'}
                            </div>
                            <div className="text-xs space-y-1">
                              <div>Context: {result.context}</div>
                              {result.status === 'success' ? (
                                <>
                                  <div>Amount: ${result.amount}</div>
                                  <div>Token: {result.token}</div>
                                  <div>Cardholder: {result.cardholder}</div>
                                </>
                              ) : (
                                <div>Error: {result.error}</div>
                              )}
                              <div>Time: {new Date(result.timestamp).toLocaleTimeString()}</div>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))
                  )}
                </div>

                {paymentResults.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setPaymentResults([])}
                  >
                    Clear Results
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Integration Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Integration Details</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <div>
                  <strong>SDK:</strong> @basis-theory/basis-theory-react
                </div>
                <div>
                  <strong>Security:</strong> PCI-compliant iframe tokenization
                </div>
                <div>
                  <strong>Test Cards:</strong>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• 4242 4242 4242 4242 (Visa)</li>
                    <li>• 5555 5555 5555 4444 (Mastercard)</li>
                    <li>• Use any future expiry date</li>
                    <li>• Use any 3-digit CVC</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDemo;