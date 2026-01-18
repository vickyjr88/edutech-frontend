import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/integrations/api/services/admin.service';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    User,
    Calendar,
    RefreshCcw,
    Loader2,
    Trash2,
    Edit,
    UserPlus,
    Shield,
    Mail,
    Lock,
    AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const AuditLogsManagement = () => {
    const { toast } = useToast();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        action: 'all',
        performedBy: '',
        targetUser: '',
        startDate: '',
        endDate: '',
    });

    const [activeFilters, setActiveFilters] = useState(filters);

    const { data: logsResponse, isLoading, refetch } = useQuery({
        queryKey: ['adminAuditLogs', page, activeFilters],
        queryFn: () => adminService.getAuditLogs({
            page,
            limit: 20,
            action: activeFilters.action === 'all' ? undefined : activeFilters.action,
            performedBy: activeFilters.performedBy || undefined,
            targetUser: activeFilters.targetUser || undefined,
            startDate: activeFilters.startDate || undefined,
            endDate: activeFilters.endDate || undefined,
        }),
    });

    const logs = logsResponse?.data?.logs || [];
    const totalPages = logsResponse?.data?.totalPages || 0;
    const totalLogs = logsResponse?.data?.total || 0;

    const handleSearch = () => {
        setPage(1);
        setActiveFilters(filters);
    };

    const handleReset = () => {
        const initialFilters = {
            action: 'all',
            performedBy: '',
            targetUser: '',
            startDate: '',
            endDate: '',
        };
        setFilters(initialFilters);
        setActiveFilters(initialFilters);
        setPage(1);
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'USER_CREATED': return <UserPlus className="h-4 w-4" />;
            case 'USER_UPDATED': return <Edit className="h-4 w-4" />;
            case 'USER_DELETED': return <Trash2 className="h-4 w-4" />;
            case 'USER_SUSPENDED': return <Shield className="h-4 w-4" />;
            case 'USER_UNSUSPENDED': return <Shield className="h-4 w-4" />;
            case 'USER_ACTIVATED': return <User className="h-4 w-4" />;
            case 'USER_DEACTIVATED': return <User className="h-4 w-4" />;
            case 'PASSWORD_RESET': return <Lock className="h-4 w-4" />;
            case 'EMAIL_SENT': return <Mail className="h-4 w-4" />;
            default: return <AlertCircle className="h-4 w-4" />;
        }
    };

    const getActionColor = (action: string): string => {
        switch (action) {
            case 'USER_CREATED':
            case 'USER_ACTIVATED':
            case 'USER_UNSUSPENDED':
                return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200';
            case 'USER_SUSPENDED':
            case 'USER_DELETED':
                return 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200';
            case 'USER_UPDATED':
            case 'PASSWORD_RESET':
                return 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200';
            case 'USER_DEACTIVATED':
                return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200';
            default:
                return 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200';
        }
    };

    const formatActionName = (action: string): string => {
        if (!action) return 'Unknown';
        return action
            .split('_')
            .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ');
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                    <p className="text-muted-foreground">Monitor system activity</p>
                </div>
                <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
                    <RefreshCcw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <CardTitle className="text-lg">Filter Logs</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Action Type</label>
                            <Select
                                value={filters.action}
                                onValueChange={(value) => setFilters({ ...filters, action: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Actions</SelectItem>
                                    <SelectItem value="USER_CREATED">User Created</SelectItem>
                                    <SelectItem value="USER_UPDATED">User Updated</SelectItem>
                                    <SelectItem value="USER_DELETED">User Deleted</SelectItem>
                                    <SelectItem value="USER_SUSPENDED">User Suspended</SelectItem>
                                    <SelectItem value="USER_UNSUSPENDED">User Unsuspended</SelectItem>
                                    <SelectItem value="USER_ACTIVATED">User Activated</SelectItem>
                                    <SelectItem value="USER_DEACTIVATED">User Deactivated</SelectItem>
                                    <SelectItem value="PASSWORD_RESET">Password Reset</SelectItem>
                                    <SelectItem value="EMAIL_SENT">Email Sent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Performed By (ID)</label>
                            <Input
                                placeholder="Ex: 64a..."
                                value={filters.performedBy}
                                onChange={(e) => setFilters({ ...filters, performedBy: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Target User (ID)</label>
                            <Input
                                placeholder="Ex: 64a..."
                                value={filters.targetUser}
                                onChange={(e) => setFilters({ ...filters, targetUser: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Start Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="date"
                                    className="pl-9"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">End Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="date"
                                    className="pl-9"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={handleReset}>Reset</Button>
                        <Button onClick={handleSearch}><Search className="h-4 w-4 mr-2" />Search</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Performed By</TableHead>
                                <TableHead>Target User</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                            <span>Loading...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                        No logs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log: any) => (
                                    <TableRow key={log._id}>
                                        <TableCell className="whitespace-nowrap text-gray-600">
                                            {formatDate(log.timestamp)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("gap-1 font-normal", getActionColor(log.action))}>
                                                {getActionIcon(log.action)}
                                                {formatActionName(log.action)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {log.performedBy ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{log.performedBy.fullName || log.performedBy.email || 'Unknown'}</span>
                                                    <span className="text-xs text-gray-500">{log.performedBy.role}</span>
                                                </div>
                                            ) : <span className="text-gray-400 italic">System</span>}
                                        </TableCell>
                                        <TableCell>
                                            {log.targetUser ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{log.targetUser.fullName || log.targetUser.email || 'Unknown'}</span>
                                                    <span className="text-xs text-gray-500">{log.targetUser.role}</span>
                                                </div>
                                            ) : log.targetModel ? (
                                                <span className="text-xs text-gray-500">{log.targetModel} {log.targetId && `(${log.targetId})`}</span>
                                            ) : <span className="text-gray-400">-</span>}
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[300px] text-sm text-gray-600 truncate" title={log.description || JSON.stringify(log.metadata)}>
                                                {log.description || (log.metadata ? JSON.stringify(log.metadata) : '-')}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Page {page} of {totalPages} ({totalLogs} entries)
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                            Next <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AuditLogsManagement;
