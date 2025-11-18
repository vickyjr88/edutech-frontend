import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  Search,
  Filter,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { adminService } from '@/integrations/api/services/admin.service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface TicketsListProps {
  onViewTicket: (ticketId: string) => void;
  onCreateTicket?: () => void;
}

const TicketsList = ({ onViewTicket, onCreateTicket }: TicketsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const { toast } = useToast();

  // Fetch tickets with filters
  const { data: ticketsData, isLoading, error } = useQuery({
    queryKey: ['adminTickets', currentPage, searchTerm, statusFilter, priorityFilter, categoryFilter],
    queryFn: async () => {
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };

      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;

      return adminService.getTickets(params);
    },
  });

  const tickets = ticketsData?.data?.tickets || [];
  const totalTickets = ticketsData?.data?.total || 0;
  const totalPages = Math.ceil(totalTickets / pageSize);

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'resolved':
        return <CheckCircle className="h-3 w-3" />;
      case 'closed':
        return <XCircle className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  // Calculate stats
  const stats = {
    total: totalTickets,
    open: tickets.filter((t: any) => t.status === 'open').length,
    pending: tickets.filter((t: any) => t.status === 'pending').length,
    resolved: tickets.filter((t: any) => t.status === 'resolved').length,
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3 flex-1 max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by ticket number, subject, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="account_access">Account Access</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="feature_request">Feature Request</SelectItem>
              <SelectItem value="bug_report">Bug Report</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onCreateTicket}>
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Open
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading tickets...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Error loading tickets. Please try again.
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No tickets found matching your criteria.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket #</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket: any) => (
                  <TableRow key={ticket._id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">
                      {ticket.ticketNumber}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="font-medium truncate">{ticket.subject}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {ticket.messages?.[0]?.message || 'No description'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {ticket.user?.fullName || ticket.user?.email || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {ticket.category.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('capitalize', getPriorityColor(ticket.priority))}
                      >
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('capitalize gap-1', getStatusColor(ticket.status))}
                      >
                        {getStatusIcon(ticket.status)}
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MessageSquare className="h-3 w-3" />
                        {ticket.messages?.length || 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewTicket(ticket._id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalTickets > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalTickets)} to{' '}
            {Math.min(currentPage * pageSize, totalTickets)} of {totalTickets} tickets
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsList;
