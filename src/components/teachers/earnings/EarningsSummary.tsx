import { useState, useEffect, useMemo } from "react";
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
import { useTeacherBalance } from '@/hooks/useTeacherBalance';
import { useTeacherSummary } from '@/hooks/useTeacherSummary';
import { useTeacherRevenueSummary } from '@/hooks/useTeacherRevenueSummary';
import { useTeacherPayoutPreferences } from '@/hooks/useTeacherPayoutPreferences';
import { useTeacherPrimaryBankAccount } from '@/hooks/useTeacherPrimaryBankAccount';
import { teacherService } from '@/integrations/api';
import { useAuth } from '@/contexts/AuthContext';
import type { RevenueSummaryRequestParams } from '@/integrations/api';

const EarningsSummary = () => {
  const [timeframe, setTimeframe] = useState("6m");
  const { user } = useAuth();
  const { balance, isLoading: balanceLoading } = useTeacherBalance();
  const { summaryData, loading: summaryLoading } = useTeacherSummary({
    teacherId: user?.teacherId || '',
  });
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  // Calculate API parameters based on selected timeframe
  const revenueParams = useMemo((): RevenueSummaryRequestParams => {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0]; // Today in YYYY-MM-DD format
    
    let startDate: string;
    let limit: number;
    let groupBy: 'month' | 'quarter' | 'year';

    switch (timeframe) {
      case '1m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().split('T')[0];
        limit = 4; // 4 weeks
        groupBy = 'month';
        break;
      case '3m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()).toISOString().split('T')[0];
        limit = 3;
        groupBy = 'month';
        break;
      case '6m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()).toISOString().split('T')[0];
        limit = 6;
        groupBy = 'month';
        break;
      case '1y':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split('T')[0];
        limit = 4; // 4 quarters
        groupBy = 'quarter';
        break;
      case 'all':
        // For "all time", don't set startDate to get all available data
        limit = 10; // Reasonable limit for performance
        groupBy = 'year';
        return { limit, groupBy, endDate };
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()).toISOString().split('T')[0];
        limit = 6;
        groupBy = 'month';
    }

    return { startDate, endDate, limit, groupBy };
  }, [timeframe]);

  const { data: revenueSummary, isLoading: revenueLoading } = useTeacherRevenueSummary(revenueParams);
  
  // Payout preferences and primary bank account
  const { preferences: payoutPreferences, isLoading: payoutLoading } = useTeacherPayoutPreferences();
  const { data: primaryBankAccount, isLoading: bankAccountLoading, error: bankAccountError } = useTeacherPrimaryBankAccount();

  // Fetch transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await teacherService.getAllTransactions({ limit: 4 });
        if (response.data) {
          setTransactions(response.data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setTransactionsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Calculate earnings from summary data
  const calculateEarningsFromSummary = () => {
    if (!summaryData) return { totalStudents: 0, activeClasses: 0 };
    
    const totalStudents = summaryData.classes.reduce((total, classItem) => {
      return total + (classItem.enrolledStudents || 0);
    }, 0);
    
    const activeClasses = summaryData.classes.filter(classItem => 
      classItem.enrolledStudents > 0
    ).length;
    
    return { totalStudents, activeClasses };
  };

  const { totalStudents, activeClasses } = calculateEarningsFromSummary();
  const isLoading = balanceLoading || summaryLoading || transactionsLoading;
  
  // Helper functions for payout settings
  const getPaymentScheduleInfo = () => {
    if (payoutLoading || !payoutPreferences) {
      return { frequency: 'Loading...', description: 'Loading payment schedule...', nextPayout: null };
    }
    
    // Handle case where no payout preferences are set up
    if (!payoutPreferences.period) {
      return { 
        frequency: 'Not configured', 
        description: 'Set up your payout schedule',
        nextPayout: null
      };
    }
    
    const period = payoutPreferences.period;
    const frequencyName = period.charAt(0).toUpperCase() + period.slice(1);
    const payoutDay = payoutPreferences.payoutDay;
    const isAutoEnabled = payoutPreferences.autoPayoutEnabled;
    const isSuspended = payoutPreferences.suspendPayouts;
    
    let description: string;


    // Build description based on period and payout day
    switch (period) {
      case 'monthly':
        if (payoutDay) {
          const suffix = payoutDay === 1 ? 'st' : payoutDay === 2 ? 'nd' : payoutDay === 3 ? 'rd' : 'th';
          description = `Payments processed on the ${payoutDay}${suffix} of each month`;
        } else {
          description = 'Monthly payouts';
        }
        break;
        
      case 'weekly':
      case 'biweekly':
        if (payoutDay && payoutDay >= 1 && payoutDay <= 7) {
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const dayName = days[payoutDay - 1];
          const frequency = period === 'biweekly' ? 'every other' : 'every';
          description = `Payments processed ${frequency} ${dayName}`;
        } else {
          description = period === 'biweekly' ? 'Bi-weekly payouts' : 'Weekly payouts';
        }
        break;
        
      case 'daily':
        description = 'Daily payouts (business days)';
        break;
        
      case 'instant':
        description = 'Instant payouts available';
        break;
        
      default:
        description = 'Custom payout schedule';
        break;
    }
    
    // Add status indicators
    if (isSuspended) {
      description += ' (Currently suspended)';
    } else if (!isAutoEnabled) {
      description += ' (Manual payouts only)';
    }
    
    // Format next payout date
    let nextPayout = null;
    if (payoutPreferences.nextScheduledPayout && !isSuspended && isAutoEnabled) {
      const nextDate = new Date(payoutPreferences.nextScheduledPayout);
      nextPayout = nextDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    return {
      frequency: frequencyName,
      description,
      nextPayout,
      minimumAmount: payoutPreferences.minimumPayoutAmount,
      currency: payoutPreferences.currency || 'USD'
    };
  };
  
  const getPrimaryBankAccount = () => {
    if (bankAccountLoading) {
      return { loading: true };
    }
    
    if (bankAccountError || !primaryBankAccount) {
      return { 
        empty: true, 
        bankName: 'No Bank Account', 
        accountNumber: 'Not set up',
        verificationStatus: null
      };
    }
    
    return {
      bankName: primaryBankAccount.bank.bankName,
      accountNumber: primaryBankAccount.maskedAccountNumber,
      accountHolderName: primaryBankAccount.accountHolderName,
      verificationStatus: primaryBankAccount.verificationStatus,
      loading: false,
      empty: false
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Main metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <h3 className="text-2xl font-bold mt-1">${balance?.totalEarnings?.toFixed(2) || '0.00'}</h3>
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
                <h3 className="text-2xl font-bold mt-1">${balance?.currentBalance?.toFixed(2) || '0.00'}</h3>
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
                <h3 className="text-2xl font-bold mt-1">{totalStudents}</h3>
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
                <h3 className="text-2xl font-bold mt-1">{activeClasses}</h3>
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
            {/* Revenue chart with real data */}
            <div className="w-full h-64 bg-white rounded-md">
              {revenueLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-pulse text-gray-500">Loading revenue data...</div>
                </div>
              ) : revenueSummary && revenueSummary.periods.length > 0 ? (
                <div className="w-full h-full flex items-end justify-between px-2">
                  {revenueSummary.periods.map((period, index) => (
                    <div key={period.period} className="flex flex-col items-center">
                      <div 
                        className="w-12 bg-blue-500 rounded-t-sm" 
                        style={{ 
                          height: `${Math.max((period.earnings / revenueSummary.summary.peakEarnings) * 200, 8)}px`,
                          backgroundColor: `hsl(${210 + index * 10}, 80%, 60%)`
                        }}
                      ></div>
                      <span className="text-xs mt-2 text-gray-600">{period.label.slice(0, 3)}</span>
                      <span className="text-xs font-medium">${period.earnings.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-gray-500">No revenue data available</div>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center">
                <div className={`rounded-full p-1.5 mr-2 ${
                  revenueSummary && revenueSummary.summary.growthRate >= 0 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {revenueSummary && revenueSummary.summary.growthRate >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {revenueSummary ? (
                      `${revenueSummary.summary.growthRate >= 0 ? '+' : ''}${revenueSummary.summary.growthRate.toFixed(1)}% growth`
                    ) : (
                      'Growth data unavailable'
                    )}
                  </p>
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
                  {transactions.length > 0 ? transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td className="py-3">
                        {new Date(transaction.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3">{transaction.description}</td>
                      <td className={`py-3 text-right font-medium ${
                        transaction.transactionType === 'earning' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {transaction.transactionType === 'earning' ? '+' : ''}${transaction.amount.toFixed(2)}
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
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  )}
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
                  {payoutLoading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium">{getPaymentScheduleInfo().frequency}</p>
                      <p className="text-xs text-gray-500">{getPaymentScheduleInfo().description}</p>
                      {getPaymentScheduleInfo().nextPayout && (
                        <p className="text-xs text-blue-600 mt-1">
                          Next payout: {getPaymentScheduleInfo().nextPayout}
                        </p>
                      )}
                      {getPaymentScheduleInfo().minimumAmount && (
                        <p className="text-xs text-gray-400 mt-1">
                          Min: {getPaymentScheduleInfo().currency}{getPaymentScheduleInfo().minimumAmount}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <Button size="sm" variant="outline">Update Schedule</Button>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Primary Payment Method</h4>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`rounded-full p-2 ${
                  getPrimaryBankAccount().empty ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={
                    getPrimaryBankAccount().empty ? 'text-yellow-600' : 'text-gray-600'
                  }>
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <div>
                  {bankAccountLoading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          {getPrimaryBankAccount().empty ? 'No Payment Method' : 'Bank Account'}
                        </p>
                        {!getPrimaryBankAccount().empty && getPrimaryBankAccount().verificationStatus && (
                          <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                            getPrimaryBankAccount().verificationStatus === 'verified' ? 'bg-green-100 text-green-700' :
                            getPrimaryBankAccount().verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {getPrimaryBankAccount().verificationStatus}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${
                        getPrimaryBankAccount().empty ? 'text-yellow-600' : 'text-gray-500'
                      }`}>
                        {getPrimaryBankAccount().empty 
                          ? 'Set up your bank account' 
                          : `${getPrimaryBankAccount().bankName} ${getPrimaryBankAccount().accountNumber}`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Button size="sm" variant="outline">
                {getPrimaryBankAccount().empty ? 'Add Payment Method' : 'Manage Payment Methods'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsSummary;