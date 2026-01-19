/**
 * Teacher Custom Class Requests Page
 * 
 * Allows teachers to view and respond to custom class requests
 */

import React, { useEffect, useState } from 'react';
import { Check, Clock, MessageSquare, X, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { customClassRequestService, type CustomClassRequest } from '@/integrations/api/services/custom-class-request.service';

const TeacherCustomClassRequests: React.FC = () => {
    const { toast } = useToast();
    const [requests, setRequests] = useState<CustomClassRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<CustomClassRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'declined' | 'all'>('pending');
    const [selectedRequest, setSelectedRequest] = useState<CustomClassRequest | null>(null);
    const [showResponseDialog, setShowResponseDialog] = useState(false);
    const [responseAction, setResponseAction] = useState<'accept' | 'decline'>('accept');
    const [teacherResponse, setTeacherResponse] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, declined: 0, completed: 0 });

    useEffect(() => {
        fetchRequests();
        fetchStats();
    }, []);

    useEffect(() => {
        filterRequests();
    }, [activeTab, requests]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const { data, error } = await customClassRequestService.getTeacherRequests();
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

    const filterRequests = () => {
        if (activeTab === 'all') {
            setFilteredRequests(requests);
        } else {
            setFilteredRequests(requests.filter(req => req.status === activeTab));
        }
    };

    const handleRespond = (request: CustomClassRequest, action: 'accept' | 'decline') => {
        setSelectedRequest(request);
        setResponseAction(action);
        setTeacherResponse('');
        setShowResponseDialog(true);
    };

    const submitResponse = async () => {
        if (!selectedRequest) return;

        setIsSubmitting(true);
        try {
            const { data, error } = await customClassRequestService.updateRequest(
                selectedRequest._id,
                {
                    status: responseAction === 'accept' ? 'accepted' : 'declined',
                    teacherResponse: teacherResponse || undefined,
                }
            );

            if (error) {
                throw new Error(error.message);
            }

            toast({
                title: 'Success',
                description: `Request ${responseAction === 'accept' ? 'accepted' : 'declined'} successfully.`,
            });

            setShowResponseDialog(false);
            setSelectedRequest(null);
            setTeacherResponse('');
            fetchRequests();
            fetchStats();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update request',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
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
                <p className="text-gray-600">Manage requests from parents and students for personalized classes</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
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
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                        <TabsTrigger value="accepted">Accepted ({stats.accepted})</TabsTrigger>
                        <TabsTrigger value="declined">Declined ({stats.declined})</TabsTrigger>
                        <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                    </TabsList>
                    <Button variant="outline" size="sm" onClick={() => { fetchRequests(); fetchStats(); }}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                <TabsContent value={activeTab} className="mt-0">
                    {filteredRequests.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-gray-500">No {activeTab !== 'all' ? activeTab : ''} requests found.</p>
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
                                                    <div>Student: <span className="font-medium">{request.studentName}</span></div>
                                                    <div>Grade: <span className="font-medium">{request.studentGrade}</span></div>
                                                    <div>Requested by: <span className="font-medium">{request.requestedBy?.fullName || 'Unknown'}</span></div>
                                                    <div>Email: <span className="font-medium">{request.requestedBy?.email || 'N/A'}</span></div>
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
                                                    <h4 className="font-semibold text-sm mb-1 text-blue-800">Your Response:</h4>
                                                    <p className="text-blue-900">{request.teacherResponse}</p>
                                                    {request.respondedAt && (
                                                        <p className="text-xs text-blue-600 mt-1">Responded on {formatDate(request.respondedAt)}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                    {request.status === 'pending' && (
                                        <CardFooter className="bg-gray-50 border-t flex gap-3">
                                            <Button
                                                variant="default"
                                                className="bg-green-600 hover:bg-green-700 flex-1"
                                                onClick={() => handleRespond(request, 'accept')}
                                            >
                                                <Check className="h-4 w-4 mr-2" />
                                                Accept Request
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="border-red-200 text-red-700 hover:bg-red-50 flex-1"
                                                onClick={() => handleRespond(request, 'decline')}
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Decline
                                            </Button>
                                        </CardFooter>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Response Dialog */}
            <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>
                            {responseAction === 'accept' ? 'Accept' : 'Decline'} Custom Class Request
                        </DialogTitle>
                        <DialogDescription>
                            {responseAction === 'accept'
                                ? `You're accepting the request from ${selectedRequest?.studentName}. Add an optional message.`
                                : `You're declining the request from ${selectedRequest?.studentName}. Please provide a reason.`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="response">
                                Message {responseAction === 'decline' ? '(Required)' : '(Optional)'}
                            </Label>
                            <Textarea
                                id="response"
                                placeholder={responseAction === 'accept'
                                    ? "e.g., I'd be happy to work with your student. Let's schedule a session..."
                                    : "e.g., I'm unable to accommodate this request at this time because..."
                                }
                                className="min-h-[120px]"
                                value={teacherResponse}
                                onChange={(e) => setTeacherResponse(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowResponseDialog(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={submitResponse}
                            disabled={isSubmitting || (responseAction === 'decline' && !teacherResponse.trim())}
                            className={responseAction === 'accept'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                            }
                        >
                            {isSubmitting ? 'Submitting...' : responseAction === 'accept' ? 'Accept Request' : 'Decline Request'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TeacherCustomClassRequests;
