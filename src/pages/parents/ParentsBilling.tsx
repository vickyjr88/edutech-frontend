
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { CreditCard, Download, FileText, DollarSign, Plus, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UnifiedPaymentForm, PaymentMethodCard, BillingHistory, AddPaymentMethodDialog } from "@/components/payments";
import { PaymentMethod, Invoice } from "@/components/payments/types";

const mockBilling = {
  currentPlan: {
    name: "Family Premium",
    price: "$199/month",
    status: "Active",
    nextBilling: "April 15, 2025",
    features: [
      "Unlimited classes for 3 children",
      "24/7 tutor support",
      "Personalized learning paths",
      "Progress tracking"
    ]
  },
  paymentMethods: [
    {
      id: "pm_1",
      type: "card" as const,
      last4: "4242",
      brand: "visa",
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
      name: "Kate's Visa"
    },
    {
      id: "pm_2",
      type: "card" as const,
      last4: "0005",
      brand: "mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
      name: "Backup Card"
    }
  ] as PaymentMethod[],
  recentInvoices: [
    {
      id: "INV-2025-001",
      date: "March 15, 2025",
      amount: 199.00,
      status: "paid" as const,
      description: "Family Premium Plan - March 2025"
    },
    {
      id: "INV-2025-002",
      date: "February 15, 2025",
      amount: 199.00,
      status: "paid" as const,
      description: "Family Premium Plan - February 2025"
    },
    {
      id: "INV-2025-003",
      date: "January 15, 2025",
      amount: 199.00,
      status: "paid" as const,
      description: "Family Premium Plan - January 2025"
    }
  ] as Invoice[]
};

// Payment provider API keys from environment variables
const BASIS_THEORY_API_KEY = import.meta.env.VITE_BASIS_THEORY_API_KEY;
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const ParentsBilling = () => {
  const handlePaymentSuccess = (result: any) => {
    console.log('Payment successful:', result);
    // Handle successful payment
    if (result.status === 'succeeded') {
      alert('Payment successful! Your subscription has been updated.');
    } else if (result.status === 'pending') {
      alert('Payment is being processed. You will receive a confirmation shortly.');
    }
  };

  const handlePaymentError = (error: string, boyaError?: any) => {
    console.error('Payment error:', error, boyaError);
    // Handle payment error with user-friendly message
    alert(`Payment failed: ${error}`);
  };

  const handleRequires3DSecure = (authUrl: string) => {
    console.log('3D Secure authentication required:', authUrl);
    // Open 3D Secure authentication in a new window
    window.open(authUrl, '_blank', 'width=600,height=600');
  };

  const handleAddPaymentMethod = (paymentMethod: any) => {
    console.log('New payment method added:', paymentMethod);
    // Handle new payment method
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    console.log('Set default payment method:', id);
    // Handle setting default payment method
  };

  const handleDeletePaymentMethod = (id: string) => {
    console.log('Delete payment method:', id);
    // Handle deleting payment method
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('Download invoice:', invoiceId);
    // Handle invoice download
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />
      
      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName="Kate Johnson" />
        
        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-kidato-purple" />
                <h1 className="text-2xl font-bold">Billing</h1>
              </div>
              
              <AddPaymentMethodDialog
                basisTheoryApiKey={BASIS_THEORY_API_KEY}
                stripePublishableKey={STRIPE_PUBLISHABLE_KEY}
                customer={{
                  name: 'Kate Johnson',
                  email: 'kate@example.com',
                  phone: '+1234567890'
                }}
                useBoyaFlow={true}
                onSuccess={handleAddPaymentMethod}
                onError={handlePaymentError}
                onRequires3DSecure={handleRequires3DSecure}
              >
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </AddPaymentMethodDialog>
            </div>
            
            <div className="grid gap-6">
              {/* Current Plan */}
              <Card className="bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold mb-2">Current Plan</h2>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                          {mockBilling.currentPlan.name}
                        </span>
                        <Badge variant="default">
                          {mockBilling.currentPlan.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {mockBilling.currentPlan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckIcon className="h-5 w-5 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">
                        {mockBilling.currentPlan.price}
                      </p>
                      <p className="text-sm text-gray-600">
                        Next billing: {mockBilling.currentPlan.nextBilling}
                      </p>
                      <Button className="mt-4">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Payment Methods</h2>
                  </div>
                  <div className="grid gap-4">
                    {mockBilling.paymentMethods.map((paymentMethod) => (
                      <PaymentMethodCard
                        key={paymentMethod.id}
                        paymentMethod={paymentMethod}
                        onSetDefault={handleSetDefaultPaymentMethod}
                        onDelete={handleDeletePaymentMethod}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Billing History */}
              <BillingHistory
                invoices={mockBilling.recentInvoices}
                onDownload={handleDownloadInvoice}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
};

export default ParentsBilling;
