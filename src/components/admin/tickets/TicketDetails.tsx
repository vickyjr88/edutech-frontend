import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  MessageSquare,
  Send,
  User,
  Calendar,
  Tag,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
} from 'lucide-react';
import { adminService } from '@/integrations/api/services/admin.service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface TicketDetailsProps {
  ticketId: string;
  onBack: () => void;
}

const TicketDetails = ({ ticketId, onBack }: TicketDetailsProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch ticket details
  const { data: ticketResponse, isLoading } = useQuery({
    queryKey: ['adminTicket', ticketId],
    queryFn: () => adminService.getTicketById(ticketId),
  });

  const ticket = ticketResponse?.data;

  // Update ticket mutation
  const updateTicketMutation = useMutation({
    mutationFn: (data: any) => adminService.updateTicket(ticketId, data),
    onSuccess: () => {
      toast({
        title: 'Ticket Updated',
        description: 'Ticket has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['adminTicket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['adminTickets'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update ticket',
        variant: 'destructive',
      });
    },
  });

  // Add message mutation
  const addMessageMutation = useMutation({
    mutationFn: (data: any) => adminService.addTicketMessage(ticketId, data),
    onSuccess: () => {
      toast({
        title: 'Message Sent',
        description: 'Your message has been added to the ticket',
      });
      setNewMessage('');
      setIsInternal(false);
      queryClient.invalidateQueries({ queryKey: ['adminTicket', ticketId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send message',
        variant: 'destructive',
      });
    },
  });

  const handleStatusChange = (status: string) => {
    updateTicketMutation.mutate({ status });
  };

  const handlePriorityChange = (priority: string) => {
    updateTicketMutation.mutate({ priority });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast({
        title: 'Error',
        description: 'Message cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    addMessageMutation.mutate({
      message: newMessage,
      isInternal,
    });
  };

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
        return <AlertCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading ticket details...</div>;
  }

  if (!ticket) {
    return <div className="p-8 text-center text-gray-500">Ticket not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{ticket.subject}</h2>
            <p className="text-sm text-gray-500 font-mono">{ticket.ticketNumber}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Messages */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ticket Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-500">Initial Message</Label>
                <p className="text-gray-700 mt-1">{ticket.messages?.[0]?.message || 'No initial message'}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <Label className="text-gray-500">Category</Label>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {ticket.category.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-500">Created</Label>
                  <p className="text-sm text-gray-700 mt-1">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversation ({ticket.messages?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.messages && ticket.messages.length > 0 ? (
                <div className="space-y-4">
                  {ticket.messages.map((message: any, index: number) => (
                    <div
                      key={index}
                      className={cn(
                        'p-4 rounded-lg border',
                        message.isInternal
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-gray-50 border-gray-200'
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-sm">
                            {message.sender?.fullName || message.sender?.email || 'User'}
                          </span>
                          {message.isInternal && (
                            <Badge variant="outline" className="text-xs gap-1">
                              <Lock className="h-3 w-3" />
                              Internal
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{message.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No messages yet</p>
              )}

              {/* Add Message Form */}
              <div className="border-t pt-4 space-y-3">
                <Label htmlFor="message-textarea">Add Message</Label>
                <Textarea
                  id="message-textarea"
                  name="message"
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                  autoComplete="off"
                  data-form-type="other"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="internal"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="internal" className="flex items-center gap-1 cursor-pointer">
                      {isInternal ? (
                        <Lock className="h-3 w-3" />
                      ) : (
                        <Unlock className="h-3 w-3" />
                      )}
                      Internal Note (not visible to user)
                    </Label>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={addMessageMutation.isPending || !newMessage.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Ticket Management */}
        <div className="space-y-4">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label className="text-xs text-gray-500">Name</Label>
                <p className="text-sm font-medium">
                  {ticket.user?.fullName || 'N/A'}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Email</Label>
                <p className="text-sm">{ticket.user?.email || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Role</Label>
                <Badge variant="outline" className="text-xs capitalize">
                  {ticket.user?.role || 'N/A'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-gray-500 mb-2 block">Current Status</Label>
                <Badge
                  variant="outline"
                  className={cn('capitalize gap-1', getStatusColor(ticket.status))}
                >
                  {getStatusIcon(ticket.status)}
                  {ticket.status}
                </Badge>
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-2 block">Change Status</Label>
                <Select
                  value={ticket.status}
                  onValueChange={handleStatusChange}
                  disabled={updateTicketMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Priority Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-gray-500 mb-2 block">Current Priority</Label>
                <Badge
                  variant="outline"
                  className={cn('capitalize', getPriorityColor(ticket.priority))}
                >
                  {ticket.priority}
                </Badge>
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-2 block">Change Priority</Label>
                <Select
                  value={ticket.priority}
                  onValueChange={handlePriorityChange}
                  disabled={updateTicketMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assignment (if implemented) */}
          {ticket.assignedTo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Assigned To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {ticket.assignedTo?.fullName || ticket.assignedTo?.email || 'Unassigned'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">Created:</span>
                <span className="text-xs">{new Date(ticket.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">Updated:</span>
                <span className="text-xs">{new Date(ticket.updatedAt).toLocaleString()}</span>
              </div>
              {ticket.resolvedAt && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span className="text-xs">Resolved:</span>
                  <span className="text-xs">{new Date(ticket.resolvedAt).toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
