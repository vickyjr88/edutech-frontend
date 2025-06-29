import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  ChevronDown, 
  Download, 
  Filter, 
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useTeacherTransactions } from "@/hooks/useTeacherTransactions";
import type { TeacherTransactionsQuery } from "@/integrations/api";


const EarningsHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Build API query parameters
  const queryParams: TeacherTransactionsQuery = useMemo(() => {
    const params: TeacherTransactionsQuery = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (statusFilter !== "all") {
      params.status = statusFilter as any;
    }

    if (typeFilter !== "all") {
      // Map UI filter values to API values
      const typeMapping: Record<string, string> = {
        'earnings': 'earning',
        'payout': 'payout', 
        'refund': 'refund',
        'fee': 'payout' // Fees might be categorized as payouts in API
      };
      params.transactionType = typeMapping[typeFilter] as any;
    }

    // Date filtering - implement based on dateFilter selection
    if (dateFilter !== "all") {
      const now = new Date();
      let startDate: Date | null = null;

      switch (dateFilter) {
        case "last30":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "last90":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "last365":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }

      if (startDate) {
        params.startDate = startDate.toISOString().split('T')[0];
        params.endDate = now.toISOString().split('T')[0];
      }
    }

    return params;
  }, [currentPage, statusFilter, typeFilter, dateFilter]);

  // Fetch transactions using the hook
  const { transactions, isLoading, error, refetch } = useTeacherTransactions(queryParams);

  // Client-side search filtering (since API might not support search)
  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return transactions;
    
    return transactions.filter(transaction => {
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.enrollments.some(enrollment => 
          enrollment.student.user.fullName.toLowerCase().includes(searchLower) ||
          enrollment.class.title.toLowerCase().includes(searchLower)
        )
      );
    });
  }, [transactions, searchTerm]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentItems = filteredTransactions;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
      case "processing":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "failed":
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
      case "processing":
        return "bg-amber-100 text-amber-800";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "earning":
        return "bg-blue-100 text-blue-800";
      case "payout":
        return "bg-purple-100 text-purple-800";
      case "refund":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            A record of all your earnings, payouts, and refunds
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={typeFilter} 
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="earnings">Earnings</SelectItem>
                <SelectItem value="payout">Payouts</SelectItem>
                <SelectItem value="refund">Refunds</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={dateFilter} 
              onValueChange={setDateFilter}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Date: All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last30">Last 30 Days</SelectItem>
                <SelectItem value="last90">Last 90 Days</SelectItem>
                <SelectItem value="last365">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10"
              onClick={refetch}
              disabled={isLoading}
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button variant="outline" size="sm" className="ml-auto">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
          
          {/* Transactions table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium text-gray-500 pb-3 px-4">Date</th>
                  <th className="text-left font-medium text-gray-500 pb-3 px-4">Description</th>
                  <th className="text-left font-medium text-gray-500 pb-3 px-4">Type</th>
                  <th className="text-left font-medium text-gray-500 pb-3 px-4">Status</th>
                  <th className="text-right font-medium text-gray-500 pb-3 px-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="py-3 px-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-4 bg-gray-200 rounded w-40 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : currentItems.length > 0 ? (
                  currentItems.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {new Date(transaction.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{transaction.description}</div>
                        {transaction.enrollments.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Student: {transaction.enrollments[0].student.user.fullName}
                            {transaction.enrollments.length > 1 && ` (+${transaction.enrollments.length - 1} more)`}
                          </div>
                        )}
                        {transaction.enrollments.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Class: {transaction.enrollments[0].class.title}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className={getTypeColor(transaction.transactionType)}>
                          {transaction.transactionType.charAt(0).toUpperCase() + transaction.transactionType.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {getStatusIcon(transaction.status)}
                          <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${
                        transaction.transactionType === 'earning' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {transaction.transactionType === 'earning' ? '+' : ''}${transaction.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>
          </div>
          
          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <XCircle className="h-12 w-12 text-red-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Error Loading Transactions</h3>
              <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                {error}
              </p>
              <Button variant="outline" onClick={refetch}>
                Try Again
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && currentItems.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Transactions Found</h3>
              <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all'
                  ? "We couldn't find any transactions matching your current filters. Try changing your search or filters to see more results."
                  : "You haven't made any transactions yet. Start teaching to see your earnings here!"
                }
              </p>
              {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                    setDateFilter("all");
                    setCurrentPage(1);
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
          
          {/* Pagination */}
          {!isLoading && !error && filteredTransactions.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {filteredTransactions.length} transactions
                {searchTerm && ` matching "${searchTerm}"`}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => setCurrentPage(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Explanation & Help Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            Understanding your earnings and payouts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Transaction Types</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 mt-0.5">
                    Earnings
                  </Badge>
                  <div>
                    Payments received from students enrolled in your classes
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 mt-0.5">
                    Payout
                  </Badge>
                  <div>
                    Transfers from your balance to your linked bank account
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="bg-red-100 text-red-800 mt-0.5">
                    Refund
                  </Badge>
                  <div>
                    Money returned to students for canceled classes or refund requests
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800 mt-0.5">
                    Fee
                  </Badge>
                  <div>
                    Platform service fees and payment processing charges
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Transaction Status</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <span className="font-medium">Completed</span> - Transaction has been fully processed
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="font-medium">Pending</span> - Transaction is being processed
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <XCircle className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <span className="font-medium">Failed</span> - Transaction could not be completed
                  </div>
                </li>
              </ul>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Need help?</h4>
                <p className="text-sm text-gray-600 mb-2">
                  If you have questions about a specific transaction or need assistance with your earnings, our support team is here to help.
                </p>
                <Button variant="outline" size="sm">Contact Support</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsHistory;