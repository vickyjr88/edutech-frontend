import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  Clock,
  DownloadCloud
} from "lucide-react";

// This would typically come from your API
const mockEarningsData = {
  totalEarnings: 4250.75,
  pendingPayouts: 850.25,
  availableBalance: 425.50,
  studentsCount: 45,
  classesCount: 7,
  monthlyRevenue: [
    { month: "Jan", amount: 420.50 },
    { month: "Feb", amount: 580.75 },
    { month: "Mar", amount: 690.25 },
    { month: "Apr", amount: 750.00 },
    { month: "May", amount: 820.50 },
    { month: "Jun", amount: 988.75 }
  ],
  recentTransactions: [
    { id: 1, date: "2023-06-15", description: "Class payment - Math Fundamentals", amount: 125.00, status: "completed" },
    { id: 2, date: "2023-06-12", description: "Class payment - Science Explorer", amount: 150.00, status: "completed" },
    { id: 3, date: "2023-06-10", description: "Class payment - English Composition", amount: 125.00, status: "completed" },
    { id: 4, date: "2023-06-05", description: "Payout to bank account", amount: -375.50, status: "completed" }
  ],
  paymentSchedule: "Monthly"
};

const EarningsSummary = () => {
  const [timeframe, setTimeframe] = useState("6m");
  
  return (
    <div className="space-y-6">
      {/* Main metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <h3 className="text-2xl font-bold mt-1">${mockEarningsData.totalEarnings.toFixed(2)}</h3>
                <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Available for Payout</p>
                <h3 className="text-2xl font-bold mt-1">${mockEarningsData.availableBalance.toFixed(2)}</h3>
                <p className="text-xs text-green-600 mt-1">Ready to withdraw</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Students</p>
                <h3 className="text-2xl font-bold mt-1">{mockEarningsData.studentsCount}</h3>
                <p className="text-xs text-gray-500 mt-1">Total enrolled students</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Classes</p>
                <h3 className="text-2xl font-bold mt-1">{mockEarningsData.classesCount}</h3>
                <p className="text-xs text-gray-500 mt-1">Revenue-generating classes</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Revenue Chart Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Your earnings over time</CardDescription>
            </div>
            <Select 
              value={timeframe} 
              onValueChange={setTimeframe}
            >
              <SelectTrigger className="w-28 h-8">
                <SelectValue placeholder="Last 6 months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="pt-2 pb-6">
            {/* Revenue chart - in a real app, you'd use a real chart library */}
            <div className="w-full h-64 bg-white rounded-md">
              <div className="w-full h-full flex items-end justify-between px-2">
                {mockEarningsData.monthlyRevenue.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-12 bg-blue-500 rounded-t-sm" 
                      style={{ 
                        height: `${(item.amount / 1000) * 200}px`,
                        // Give a gradient effect from blue to purple
                        backgroundColor: `hsl(${210 + index * 10}, 80%, 60%)`
                      }}
                    ></div>
                    <span className="text-xs mt-2 text-gray-600">{item.month}</span>
                    <span className="text-xs font-medium">${item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-1.5 mr-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">18% growth</p>
                  <p className="text-xs text-gray-500">compared to previous period</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <DownloadCloud className="h-3.5 w-3.5" />
                Download Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Pending Transactions Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest earnings and payouts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium text-gray-500 pb-2">Date</th>
                    <th className="text-left font-medium text-gray-500 pb-2">Description</th>
                    <th className="text-right font-medium text-gray-500 pb-2">Amount</th>
                    <th className="text-right font-medium text-gray-500 pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockEarningsData.recentTransactions.slice(0, 4).map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="py-3">
                        {new Date(transaction.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3">{transaction.description}</td>
                      <td className={`py-3 text-right font-medium ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center">
              <Button variant="outline" size="sm">View All Transactions</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payout Settings Summary */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Payout Settings</CardTitle>
          <CardDescription>Your current payout configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Payment Schedule</h4>
              <div className="flex items-center space-x-4 mb-4">
                <div className="rounded-full bg-blue-100 p-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{mockEarningsData.paymentSchedule} Payouts</p>
                  <p className="text-xs text-gray-500">Payments processed on the 1st of each month</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Update Schedule</Button>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Primary Payment Method</h4>
              <div className="flex items-center space-x-4 mb-4">
                <div className="rounded-full bg-gray-100 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Bank Account</p>
                  <p className="text-xs text-gray-500">Chase Bank •••• 4231</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Manage Payment Methods</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsSummary;