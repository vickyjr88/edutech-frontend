import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  History,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Shield,
  Mail,
  Lock,
  Trash2,
  Edit,
  UserPlus,
  AlertCircle,
} from 'lucide-react';
import { adminService } from '@/integrations/api/services/admin.service';
import { cn } from '@/lib/utils';

interface AuditLogViewerProps {
  userId: string;
  limit?: number;
}

const AuditLogViewer = ({ userId, limit = 50 }: AuditLogViewerProps) => {
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  // Fetch audit logs
  const { data: logsResponse, isLoading, error } = useQuery({
    queryKey: ['userAuditLogs', userId, limit],
    queryFn: () => adminService.getUserAuditLogs(userId, limit),
  });

  const logs = logsResponse?.data || [];

  // Filter logs by action type
  const filteredLogs = logs.filter((log: any) => {
    if (actionFilter === 'all') return true;
    return log.action === actionFilter;
  });

  // Toggle expanded state for a log
  const toggleExpanded = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  // Get icon for action type
  const getActionIcon = (action: string) => {
    const upperAction = action.toUpperCase();

    // User Management
    if (upperAction.includes('CREATED') || upperAction.includes('REGISTERED')) return <UserPlus className="h-4 w-4" />;
    if (upperAction.includes('UPDATED')) return <Edit className="h-4 w-4" />;
    if (upperAction.includes('DELETED')) return <Trash2 className="h-4 w-4" />;
    if (upperAction.includes('SUSPENDED')) return <Shield className="h-4 w-4" />;
    if (upperAction.includes('ACTIVATED') || upperAction.includes('DEACTIVATED')) return <User className="h-4 w-4" />;

    // Authentication
    if (upperAction.includes('LOGIN') || upperAction.includes('LOGOUT')) return <User className="h-4 w-4" />;
    if (upperAction.includes('PASSWORD')) return <Lock className="h-4 w-4" />;
    if (upperAction.includes('EMAIL') || upperAction.includes('VERIFIED')) return <Mail className="h-4 w-4" />;

    // Default
    return <AlertCircle className="h-4 w-4" />;
  };

  // Get color for action type
  const getActionColor = (action: string): string => {
    const upperAction = action.toUpperCase();

    // Positive actions - green
    if (upperAction.includes('CREATED') || upperAction.includes('REGISTERED') ||
        upperAction.includes('ACTIVATED') || upperAction.includes('UNSUSPENDED') ||
        upperAction.includes('LOGIN') && !upperAction.includes('FAILED') ||
        upperAction.includes('VERIFIED') || upperAction.includes('COMPLETED') ||
        upperAction.includes('CONFIRMED')) {
      return 'bg-green-100 text-green-700 border-green-200';
    }

    // Negative actions - red
    if (upperAction.includes('DELETED') || upperAction.includes('SUSPENDED') ||
        upperAction.includes('FAILED') || upperAction.includes('CANCELLED')) {
      return 'bg-red-100 text-red-700 border-red-200';
    }

    // Update actions - blue
    if (upperAction.includes('UPDATED') || upperAction.includes('PASSWORD') ||
        upperAction.includes('CHANGED')) {
      return 'bg-blue-100 text-blue-700 border-blue-200';
    }

    // Deactivated actions - gray
    if (upperAction.includes('DEACTIVATED')) {
      return 'bg-gray-100 text-gray-700 border-gray-200';
    }

    // Payment actions - yellow/amber
    if (upperAction.includes('PAYMENT') || upperAction.includes('BOOKING')) {
      return 'bg-amber-100 text-amber-700 border-amber-200';
    }

    // Default - purple
    return 'bg-purple-100 text-purple-700 border-purple-200';
  };

  // Format action name for display
  const formatActionName = (action: string): string => {
    return action
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-gray-500">Loading audit logs...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-red-500">
            Error loading audit logs. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Activity History
          </CardTitle>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent className="max-h-[400px]">
              <SelectItem value="all">All Actions</SelectItem>

              {/* User Management */}
              <SelectItem value="user_created">User Created</SelectItem>
              <SelectItem value="user_registered">User Registered</SelectItem>
              <SelectItem value="user_updated">User Updated</SelectItem>
              <SelectItem value="user_deleted">User Deleted</SelectItem>
              <SelectItem value="user_activated">User Activated</SelectItem>
              <SelectItem value="user_deactivated">User Deactivated</SelectItem>
              <SelectItem value="user_suspended">User Suspended</SelectItem>
              <SelectItem value="user_unsuspended">User Unsuspended</SelectItem>

              {/* Authentication */}
              <SelectItem value="user_login">User Login</SelectItem>
              <SelectItem value="user_login_failed">Login Failed</SelectItem>
              <SelectItem value="user_logout">User Logout</SelectItem>
              <SelectItem value="password_reset">Password Reset</SelectItem>
              <SelectItem value="password_changed">Password Changed</SelectItem>

              {/* Profile */}
              <SelectItem value="profile_created">Profile Created</SelectItem>
              <SelectItem value="profile_updated">Profile Updated</SelectItem>
              <SelectItem value="teacher_profile_updated">Teacher Profile Updated</SelectItem>
              <SelectItem value="student_profile_updated">Student Profile Updated</SelectItem>
              <SelectItem value="parent_profile_updated">Parent Profile Updated</SelectItem>

              {/* Offerings */}
              <SelectItem value="offering_created">Offering Created</SelectItem>
              <SelectItem value="offering_updated">Offering Updated</SelectItem>
              <SelectItem value="offering_deleted">Offering Deleted</SelectItem>

              {/* Bookings */}
              <SelectItem value="booking_created">Booking Created</SelectItem>
              <SelectItem value="booking_updated">Booking Updated</SelectItem>
              <SelectItem value="booking_cancelled">Booking Cancelled</SelectItem>
              <SelectItem value="booking_confirmed">Booking Confirmed</SelectItem>
              <SelectItem value="booking_completed">Booking Completed</SelectItem>

              {/* Parent-Child */}
              <SelectItem value="child_added">Child Added</SelectItem>
              <SelectItem value="parent_student_associated">Parent-Student Associated</SelectItem>

              {/* Payments */}
              <SelectItem value="payment_initiated">Payment Initiated</SelectItem>
              <SelectItem value="payment_completed">Payment Completed</SelectItem>
              <SelectItem value="payment_failed">Payment Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredLogs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No activity logs found for this user.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log: any) => {
              const isExpanded = expandedLogs.has(log._id);
              const hasMetadata = log.metadata && Object.keys(log.metadata).length > 0;

              return (
                <div
                  key={log._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left side - Action info */}
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={cn(
                          'p-2 rounded-lg border',
                          getActionColor(log.action)
                        )}
                      >
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">
                            {formatActionName(log.action)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {log.action}
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>
                              by{' '}
                              {log.performedBy?.fullName || log.performedBy?.email || 'Admin'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(log.timestamp).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Metadata preview */}
                        {hasMetadata && isExpanded && (
                          <div className="mt-3 p-3 bg-gray-50 rounded border text-xs">
                            <div className="font-medium mb-2 text-gray-700">
                              Additional Details:
                            </div>
                            <div className="space-y-1 text-gray-600">
                              {Object.entries(log.metadata).map(([key, value]) => (
                                <div key={key} className="flex gap-2">
                                  <span className="font-medium min-w-[100px]">
                                    {key}:
                                  </span>
                                  <span className="break-all">
                                    {typeof value === 'object'
                                      ? JSON.stringify(value, null, 2)
                                      : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side - Expand button */}
                    {hasMetadata && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(log._id)}
                        className="shrink-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredLogs.length > 0 && filteredLogs.length >= limit && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing last {limit} activities. More may exist.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogViewer;
