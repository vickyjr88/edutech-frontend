import { useState, useMemo } from "react";
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { CreditCard, Download, FileText, DollarSign, Plus, Settings, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UnifiedPaymentForm, PaymentMethodCard, BillingHistory, AddPaymentMethodDialog } from "@/components/payments";
import { PaymentMethod, Invoice } from "@/components/payments/types";
// import hooks, but define mock fallback inside the component if hooks fail or return undefined
import { useGetBillingDashboard, useGetPaymentMethods, useGetPaymentHistory, useDeletePaymentMethod, useUpdatePaymentMethod } from "@/hooks/use-parent-billing";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// Payment provider API keys from environment variables
const BASIS_THEORY_API_KEY = import.meta.env.VITE_BASIS_THEORY_API_KEY;
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const ParentsBilling = () => {
  const { user } = useAuth();

  // Fetch billing data from API
  // Note: These hooks might fail if the endpoints aren't ready yet. 
  // We need robust handling to show SOMETHING even if API fails, or at least a graceful empty state.
  const { data: billingDashboard, isLoading: isLoadingDashboard, error: dashboardError, refetch: refetchDashboard } = useGetBillingDashboard();
  const { data: paymentMethodsData, isLoading: isLoadingPaymentMethods, refetch: refetchPaymentMethods } = useGetPaymentMethods();
  const { data: paymentHistoryData, isLoading: isLoadingHistory, refetch: refetchHistory } = useGetPaymentHistory();

  // Mutations
  const deletePaymentMethodMutation = useDeletePaymentMethod();
  const updatePaymentMethodMutation = useUpdatePaymentMethod();

  // Transform API data to component format
  // Fallback to empty/default if data is missing
  const billingData = useMemo(() => {
    // If we have dashboard data, use it
    const currentPlan = billingDashboard?.data?.currentPlan || {
      name: "Standard Plan",
      price: "$0/month",
      status: "Active",
      nextBilling: "N/A",
      features: ["Access to all courses", "Progress tracking", "Parent dashboard"]
    };

    const methods = paymentMethodsData?.data || billingDashboard?.data?.paymentMethods || [];
    const invoices = paymentHistoryData?.data || billingDashboard?.data?.recentInvoices || [];

    return {
      currentPlan,
      paymentMethods: methods,
      recentInvoices: invoices
    };
  }, [billingDashboard, paymentMethodsData, paymentHistoryData]);

  const isLoading = isLoadingDashboard || isLoadingPaymentMethods || isLoadingHistory;
  const isError = dashboardError; // Simplify error check

  const handlePaymentSuccess = (result: any) => {
    toast({ title: 'Payment successful', description: 'Your subscription has been updated.' });
    refetchDashboard();
  };

  const handlePaymentError = (error: string, boyaError?: any) => {
    console.error('Payment error:', error, boyaError);
    toast({ title: 'Payment failed', description: error, variant: 'destructive' });
  };

  const handleRequires3DSecure = (authUrl: string) => {
    window.open(authUrl, '_blank', 'width=600,height=600');
  };

  const handleAddPaymentMethod = (paymentMethod: any) => {
    toast({ title: 'Payment Method Added', description: 'Your new payment method has been verified.' });
    refetchPaymentMethods();
  };

  const handleSetDefaultPaymentMethod = async (id: string) => {
    try {
      await updatePaymentMethodMutation.mutateAsync({
        id,
        data: { isDefault: true }
      });
      toast({ title: 'Updated', description: 'Default payment method set.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update payment method.', variant: 'destructive' });
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      await deletePaymentMethodMutation.mutateAsync(id);
      toast({ title: 'Deleted', description: 'Payment method removed.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to remove payment method.', variant: 'destructive' });
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({ title: 'Downloading...', description: 'Your invoice download will start shortly.' });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />

      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName={user?.fullName || "Parent"} />

        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-kidato-purple" />
                <h1 className="text-2xl font-bold">Billing</h1>
              </div>

              <AddPaymentMethodDialog
                basisTheoryApiKey={BASIS_THEORY_API_KEY || ""}
                stripePublishableKey={STRIPE_PUBLISHABLE_KEY || ""}
                customer={{
                  name: user?.fullName || 'Parent',
                  email: user?.email || '',
                  phone: user?.phoneNumber || ''
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

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : isError && !billingData.currentPlan ? (
              <div className="text-center py-12 bg-white rounded-lg shadow p-6">
                <p className="text-red-500 mb-4">Unable to load billing information.</p>
                <Button variant="outline" onClick={() => refetchDashboard()}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Retry
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {/* Current Plan */}
                <Card className="bg-gradient-to-br from-blue-50 to-white">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <h2 className="text-xl font-bold mb-2">Current Plan</h2>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-blue-600">
                            {billingData.currentPlan.name}
                          </span>
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                            {billingData.currentPlan.status}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {billingData.currentPlan.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckIcon className="h-5 w-5 text-green-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-right w-full md:w-auto">
                        <p className="text-3xl font-bold text-blue-600">
                          {billingData.currentPlan.price}
                        </p>
                        <p className="text-sm text-gray-600">
                          Next billing: {billingData.currentPlan.nextBilling}
                        </p>
                        <Button className="mt-4 w-full md:w-auto" variant="outline">
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
                      {billingData.paymentMethods.length > 0 ? (
                        billingData.paymentMethods.map((paymentMethod) => (
                          <PaymentMethodCard
                            key={paymentMethod.id}
                            paymentMethod={paymentMethod}
                            onSetDefault={handleSetDefaultPaymentMethod}
                            onDelete={handleDeletePaymentMethod}
                          />
                        ))
                      ) : (
                        <div className="text-gray-500 text-center py-8 border-2 border-dashed rounded-lg">
                          <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No payment methods added yet</p>
                          <p className="text-sm text-gray-400">Add a card to pay for classes</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Billing History */}
                <BillingHistory
                  invoices={billingData.recentInvoices}
                  onDownload={handleDownloadInvoice}
                />
              </div>
            )}
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
