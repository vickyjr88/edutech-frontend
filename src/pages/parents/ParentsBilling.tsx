
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { CreditCard, Download, FileText, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  recentInvoices: [
    {
      id: "INV-2025-001",
      date: "March 15, 2025",
      amount: "$199.00",
      status: "Paid",
      description: "Family Premium Plan - March 2025"
    },
    {
      id: "INV-2025-002",
      date: "February 15, 2025",
      amount: "$199.00",
      status: "Paid",
      description: "Family Premium Plan - February 2025"
    },
    {
      id: "INV-2025-003",
      date: "January 15, 2025",
      amount: "$199.00",
      status: "Paid",
      description: "Family Premium Plan - January 2025"
    }
  ]
};

const ParentsBilling = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />
      
      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName="Kate Johnson" />
        
        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="h-6 w-6 text-kidato-purple" />
              <h1 className="text-2xl font-bold">Billing</h1>
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
                      <Button className="mt-4">Manage Plan</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Invoices */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Recent Invoices</h2>
                  <div className="space-y-4">
                    {mockBilling.recentInvoices.map((invoice) => (
                      <div 
                        key={invoice.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{invoice.description}</p>
                            <p className="text-sm text-gray-600">{invoice.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{invoice.amount}</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {invoice.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
