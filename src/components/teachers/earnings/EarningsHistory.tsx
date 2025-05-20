import { useState } from "react";
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

// This would typically come from your API
const mockTransactions = [
  { 
    id: 1, 
    date: "2023-06-28", 
    type: "earnings", 
    description: "Math Fundamentals - June 2023", 
    amount: 450.00, 
    status: "completed",
    student: "Sarah Johnson",
    class: "Math Fundamentals"
  },
  { 
    id: 2, 
    date: "2023-06-25", 
    type: "payout", 
    description: "Monthly payout to Chase Bank •••• 4231", 
    amount: -950.75, 
    status: "completed",
    student: null,
    class: null
  },
  { 
    id: 3, 
    date: "2023-06-15", 
    type: "earnings", 
    description: "Science Explorer - June 2023", 
    amount: 375.50, 
    status: "completed",
    student: "James Wilson",
    class: "Science Explorer"
  },
  { 
    id: 4, 
    date: "2023-06-12", 
    type: "earnings", 
    description: "English Literature - June 2023", 
    amount: 325.25, 
    status: "completed",
    student: "Emily Martinez",
    class: "English Literature"
  },
  { 
    id: 5, 
    date: "2023-06-10", 
    type: "refund", 
    description: "Refund for canceled class - History 101", 
    amount: -125.00, 
    status: "completed",
    student: "Daniel Brown",
    class: "History 101"
  },
  { 
    id: 6, 
    date: "2023-06-05", 
    type: "earnings", 
    description: "Computer Science Basics - June 2023", 
    amount: 400.00, 
    status: "completed",
    student: "Sophia Lee",
    class: "Computer Science Basics"
  },
  { 
    id: 7, 
    date: "2023-06-02", 
    type: "earnings", 
    description: "Advanced Math - June 2023", 
    amount: 500.00, 
    status: "pending",
    student: "Noah Garcia",
    class: "Advanced Math"
  },
  { 
    id: 8, 
    date: "2023-05-30", 
    type: "fee", 
    description: "Platform service fee", 
    amount: -85.00, 
    status: "completed",
    student: null,
    class: null
  },
  { 
    id: 9, 
    date: "2023-05-28", 
    type: "earnings", 
    description: "Physics 101 - May 2023", 
    amount: 425.00, 
    status: "completed",
    student: "Olivia Smith",
    class: "Physics 101"
  },
  { 
    id: 10, 
    date: "2023-05-25", 
    type: "payout", 
    description: "Monthly payout to Chase Bank •••• 4231", 
    amount: -1250.50, 
    status: "completed",
    student: null,
    class: null
  }
];

const EarningsHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Filter transactions based on search term and filters
  const filteredTransactions = mockTransactions.filter(transaction => {
    // Search filter
    const searchMatch = 
      searchTerm === "" || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.student && transaction.student.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.class && transaction.class.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter
    const statusMatch = 
      statusFilter === "all" || 
      transaction.status === statusFilter;
    
    // Type filter
    const typeMatch = 
      typeFilter === "all" || 
      transaction.type === typeFilter;
    
    // Date filter - simplified for demo
    const dateMatch = true; // In a real app, you'd implement proper date filtering
    
    return searchMatch && statusMatch && typeMatch && dateMatch;
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "failed":
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
        return "bg-amber-100 text-amber-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "earnings":
        return "bg-blue-100 text-blue-800";
      case "payout":
        return "bg-purple-100 text-purple-800";
      case "refund":
        return "bg-red-100 text-red-800";
      case "fee":
        return "bg-gray-100 text-gray-800";
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
                <SelectItem value="failed">Failed</SelectItem>
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
                <SelectItem value="fee">Fees</SelectItem>
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
            
            <Button variant="outline" size="icon" className="h-10 w-10">
              <RefreshCcw className="h-4 w-4" />
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
                {currentItems.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {new Date(transaction.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{transaction.description}</div>
                      {transaction.student && (
                        <div className="text-xs text-gray-500">Student: {transaction.student}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className={getTypeColor(transaction.type)}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
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
                      transaction.amount > 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty state */}
          {currentItems.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Transactions Found</h3>
              <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                We couldn't find any transactions matching your current filters. Try changing your search or filters to see more results.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setDateFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
          
          {/* Pagination */}
          {filteredTransactions.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} transactions
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