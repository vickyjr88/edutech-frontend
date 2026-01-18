import { useState, useEffect } from "react";
import { CreditCard, Loader2, AlertCircle, Download, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { mpesaPaymentService, PaymentHistoryItem } from "@/integrations/api/services/mvp-payment.service";
import PageWrapper from "@/components/PageWrapper";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const ParentsBilling = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, totalAmount: 0 });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await mpesaPaymentService.getPaymentHistory();
        setPayments(response.payments);
        setStats({
          total: response.total,
          totalAmount: response.totalAmount
        });
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
        toast({
          title: "Error",
          description: "Failed to load payment history.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 border-green-200"><CheckCircle2 className="h-3 w-3" /> Paid</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1 border-red-200"><XCircle className="h-3 w-3" /> Failed</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1 border-amber-200"><Clock className="h-3 w-3" /> {status}</Badge>;
    }
  };

  return (
    <PageWrapper>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <CreditCard className="h-6 w-6 text-kidato-purple" />
            <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-kidato-purple/5 to-white border-purple-100">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-gray-500 mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-kidato-purple">KES {stats.totalAmount.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-gray-500 mb-1">Total Transactions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-gray-500 mb-1">Payment Method</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center p-1">
                    <img src="/placeholder.svg" alt="MPESA" className="h-full" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">M-PESA</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your recent M-PESA transactions via Paystack</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-kidato-purple" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900">No payment history</h3>
                  <p className="text-sm text-gray-500">Your payments will appear here once you book and pay for classes.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-4 pt-0 font-semibold text-gray-600 text-sm">Date</th>
                        <th className="pb-4 pt-0 font-semibold text-gray-600 text-sm">Description</th>
                        <th className="pb-4 pt-0 font-semibold text-gray-600 text-sm">Reference</th>
                        <th className="pb-4 pt-0 font-semibold text-gray-600 text-sm">Amount</th>
                        <th className="pb-4 pt-0 font-semibold text-gray-600 text-sm">Status</th>
                        <th className="pb-4 pt-0 font-semibold text-gray-600 text-sm text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {payments.map((payment) => (
                        <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 text-sm text-gray-600">
                            {format(new Date(payment.createdAt), "MMM d, yyyy")}
                          </td>
                          <td className="py-4 text-sm font-medium text-gray-900">
                            {(payment.bookingId as any)?.studentName ? `Session for ${(payment.bookingId as any).studentName}` : "Learning Session"}
                          </td>
                          <td className="py-4 text-sm font-mono text-gray-400">
                            {payment.transactionRef}
                          </td>
                          <td className="py-4 text-sm font-bold text-gray-900">
                            KES {payment.amount.toLocaleString()}
                          </td>
                          <td className="py-4">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="py-4 text-right">
                            {payment.status.toLowerCase() === 'success' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={async () => {
                                  try {
                                    toast({
                                      title: "Generating Receipt",
                                      description: "Please wait while we generate your receipt...",
                                    });
                                    const response = await mpesaPaymentService.downloadReceipt(payment.transactionRef);
                                    if (response.receiptPdfUrl) {
                                      window.open(response.receiptPdfUrl, '_blank');
                                    } else {
                                      throw new Error("Receipt URL not found");
                                    }
                                  } catch (error) {
                                    console.error("Download failed:", error);
                                    toast({
                                      title: "Download Failed",
                                      description: "Could not download receipt. Please try again.",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                <Download className="h-4 w-4 text-gray-400 hover:text-kidato-purple" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ParentsBilling;
