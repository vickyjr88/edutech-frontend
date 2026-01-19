/**
 * Admin Custom Class Requests Page
 * 
 * Allows admins to view all custom class requests across the platform
 */

import React, { useEffect, useState } from 'react';
import { Filter, RefreshCw, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { customClassRequestService, type CustomClassRequest } from '@/integrations/api/services/custom-class-request.service';

const AdminCustomClassRequests: React.FC = () => {
    const { toast } = useToast();
    const [requests, setRequests] = useState<CustomClassRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<CustomClassRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, declined: 0, completed: 0 });

    useEffect(() => {
        fetchRequests();
        fetchStats();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [statusFilter, searchQuery, requests]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const { data, error } = await customClassRequestService.getAllRequests();
            if (error) {
                throw new Error(error.message);
            }
            setRequests(data || []);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to fetch requests',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data, error } = await customClassRequestService.getStats();
            if (!error && data) {
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const applyFilters = () => {
        let filtered = requests;

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(req => req.status === statusFilter);
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(req =>
                req.subject.toLowerCase().includes(query) ||
                req.studentName.toLowerCase().includes(query) ||
                req.requestedBy?.fullName?.toLowerCase().includes(query) ||
                req.teacherId?.fullName?.toLowerCase().includes(query) ||
                req.description.toLowerCase().includes(query)
            );
        }

        setFilteredRequests(filtered);
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            accepted: 'bg-green-50 text-green-700 border-green-200',
            declined: 'bg-red-50 text-red-700 border-red-200',
            completed: 'bg-blue-50 text-blue-700 border-blue-200',
        };
        return (
            <Badge variant="outline" className={variants[status as keyof typeof variants] || ''}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const exportToCSV = () => {
        const headers = ['Date', 'Status', 'Subject', 'Student', 'Grade', 'Requester', 'Teacher', 'Description'];
        const rows = filteredRequests.map(req => [
            formatDate(req.createdAt),
            req.status,
            req.subject,
            req.studentName,
            req.studentGrade,
            req.requestedBy?.fullName || 'N/A',
            req.teacherId?.fullName || 'N/A',
            req.description.replace(/,/g, ';'), // Replace commas to avoid CSV issues
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `custom-class-requests-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
            title: 'Success',
            description: 'Requests exported to CSV successfully',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kidato-purple"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Custom Class Requests</h1>
                <p className="text-gray-600">Monitor and manage all custom class requests across the platform</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Accepted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Declined</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by subject, student, requester, teacher, or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="declined">Declined</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={() => { fetchRequests(); fetchStats(); }}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                        <Button variant="outline" onClick={exportToCSV} disabled={filteredRequests.length === 0}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="mb-4 text-sm text-gray-600">
                Showing {filteredRequests.length} of {requests.length} requests
            </div>

            {filteredRequests.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-gray-500">No requests found matching your criteria.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredRequests.map((request) => (
                        <Card key={request._id} className="overflow-hidden">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl mb-2">{request.subject}</CardTitle>
                                        <CardDescription className="space-y-1">
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                                <div>Student: <span className="font-medium">{request.studentName}</span></div>
                                                <div>Grade: <span className="font-medium">{request.studentGrade}</span></div>
                                                <div>Requester: <span className="font-medium">{request.requestedBy?.fullName || 'Unknown'}</span></div>
                                                <div>Teacher: <span className="font-medium">{request.teacherId?.fullName || 'Unknown'}</span></div>
                                                <div className="col-span-2">Email: <span className="font-medium">{request.requestedBy?.email || 'N/A'}</span></div>
                                            </div>
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {getStatusBadge(request.status)}
                                        <span className="text-sm text-gray-500">{formatDate(request.createdAt)}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-sm mb-1">Description:</h4>
                                        <p className="text-gray-700">{request.description}</p>
                                    </div>
                                    {request.preferredSchedule && (
                                        <div>
                                            <h4 className="font-semibold text-sm mb-1">Preferred Schedule:</h4>
                                            <p className="text-gray-700">{request.preferredSchedule}</p>
                                        </div>
                                    )}
                                    {request.teacherResponse && (
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <h4 className="font-semibold text-sm mb-1 text-blue-800">Teacher Response:</h4>
                                            <p className="text-blue-900">{request.teacherResponse}</p>
                                            {request.respondedAt && (
                                                <p className="text-xs text-blue-600 mt-1">Responded on {formatDate(request.respondedAt)}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminCustomClassRequests;
