import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/integrations/api/services/admin.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Mail,
    Phone,
    Book,
    DollarSign,
    AlertTriangle,
    CheckCircle,
    Edit,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface BookingDetailsProps {
    bookingId: string;
    onBack: () => void;
}

const BookingDetails = ({ bookingId, onBack }: BookingDetailsProps) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [showDisputeDialog, setShowDisputeDialog] = useState(false);
    const [updateData, setUpdateData] = useState({
        status: '',
        isPaid: false,
        adminNotes: '',
    });
    const [disputeData, setDisputeData] = useState({
        resolution: 'NO_ACTION',
        resolutionNotes: '',
        refundAmount: 0,
    });

    // Fetch booking details
    const { data: bookingData, isLoading } = useQuery({
        queryKey: ['bookingDetails', bookingId],
        queryFn: async () => {
            const response = await adminService.getBookingDetails(bookingId);
            return response.data;
        },
    });

    // Update booking mutation
    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            return adminService.updateBooking(bookingId, data);
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Booking updated successfully',
            });
            queryClient.invalidateQueries({ queryKey: ['bookingDetails', bookingId] });
            queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
            setShowUpdateDialog(false);
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update booking',
            });
        },
    });

    // Resolve dispute mutation
    const resolveMutation = useMutation({
        mutationFn: async (data: any) => {
            return adminService.resolveDispute(bookingId, data);
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Dispute resolved successfully',
            });
            queryClient.invalidateQueries({ queryKey: ['bookingDetails', bookingId] });
            queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
            setShowDisputeDialog(false);
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to resolve dispute',
            });
        },
    });

    const handleUpdate = () => {
        const payload: any = {};
        if (updateData.status) payload.status = updateData.status;
        if (updateData.isPaid !== bookingData?.isPaid) payload.isPaid = updateData.isPaid;
        if (updateData.adminNotes) payload.adminNotes = updateData.adminNotes;

        updateMutation.mutate(payload);
    };

    const handleResolveDispute = () => {
        resolveMutation.mutate(disputeData);
    };

    const openUpdateDialog = () => {
        setUpdateData({
            status: bookingData?.status || '',
            isPaid: bookingData?.isPaid || false,
            adminNotes: bookingData?.adminNotes || '',
        });
        setShowUpdateDialog(true);
    };

    const openDisputeDialog = () => {
        setDisputeData({
            resolution: 'NO_ACTION',
            resolutionNotes: '',
            refundAmount: 0,
        });
        setShowDisputeDialog(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading booking details...</div>
            </div>
        );
    }

    if (!bookingData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Booking not found</div>
            </div>
        );
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'confirmed': return 'default';
            case 'completed': return 'secondary';
            case 'pending': return 'outline';
            case 'cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to List
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>
                        <p className="text-muted-foreground font-mono">{bookingData.confirmationCode}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={openUpdateDialog}>
                        <Edit className="h-4 w-4 mr-2" />
                        Update
                    </Button>
                    {bookingData.hasDispute && (
                        <Button variant="default" onClick={openDisputeDialog}>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Resolve Dispute
                        </Button>
                    )}
                </div>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2">
                <Badge variant={getStatusBadgeVariant(bookingData.status)} className="text-sm">
                    {bookingData.status}
                </Badge>
                {bookingData.isPaid ? (
                    <Badge variant="secondary" className="text-sm">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Paid
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-sm">Unpaid</Badge>
                )}
                {bookingData.isManualBooking && (
                    <Badge variant="outline" className="text-sm">Manual Booking</Badge>
                )}
                {bookingData.hasDispute && (
                    <Badge variant="destructive" className="text-sm">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Has Dispute
                    </Badge>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Student Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Student Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label className="text-muted-foreground">Student Name</Label>
                            <p className="font-medium">{bookingData.studentName}</p>
                        </div>
                        {bookingData.studentAge && (
                            <div>
                                <Label className="text-muted-foreground">Age</Label>
                                <p className="font-medium">{bookingData.studentAge} years</p>
                            </div>
                        )}
                        {bookingData.studentGrade && (
                            <div>
                                <Label className="text-muted-foreground">Grade Level</Label>
                                <p className="font-medium">Grade {bookingData.studentGrade}</p>
                            </div>
                        )}
                        {bookingData.notes && (
                            <div>
                                <Label className="text-muted-foreground">Notes from Parent</Label>
                                <p className="text-sm">{bookingData.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Session Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Session Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label className="text-muted-foreground">Date</Label>
                            <p className="font-medium">
                                {bookingData.scheduledDate ? format(new Date(bookingData.scheduledDate), 'EEEE, MMMM dd, yyyy') : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Time</Label>
                            <p className="font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {bookingData.scheduledTime} ({bookingData.duration} minutes)
                            </p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Delivery Mode</Label>
                            <p className="font-medium">{bookingData.offeringId?.deliveryMode || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Parent Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Parent Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label className="text-muted-foreground">Name</Label>
                            <p className="font-medium">{bookingData.parentId?.fullName || 'N/A'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                Email
                            </Label>
                            <p className="text-sm">{bookingData.parentId?.email || 'N/A'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                Phone
                            </Label>
                            <p className="text-sm">{bookingData.parentId?.phoneNumber || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Teacher Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Teacher Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label className="text-muted-foreground">Name</Label>
                            <p className="font-medium">{bookingData.teacherId?.fullName || 'N/A'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                Email
                            </Label>
                            <p className="text-sm">{bookingData.teacherId?.email || 'N/A'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                Phone
                            </Label>
                            <p className="text-sm">{bookingData.teacherId?.phoneNumber || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Offering & Payment Information */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Book className="h-5 w-5" />
                            Offering Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label className="text-muted-foreground">Title</Label>
                            <p className="font-medium">{bookingData.offeringId?.title || 'N/A'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Subject</Label>
                            <p className="font-medium">{bookingData.offeringId?.subject || 'N/A'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Curriculum</Label>
                            <p className="font-medium">{bookingData.offeringId?.curriculum || 'N/A'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Grade Level</Label>
                            <p className="font-medium">{bookingData.offeringId?.gradeLevel || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Payment Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label className="text-muted-foreground">Amount</Label>
                            <p className="text-2xl font-bold">
                                {bookingData.currency} {bookingData.price?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Payment Status</Label>
                            <p className="font-medium">
                                {bookingData.isPaid ? 'Paid' : 'Unpaid'}
                                {bookingData.paidAt && (
                                    <span className="text-sm text-muted-foreground ml-2">
                                        on {format(new Date(bookingData.paidAt), 'MMM dd, yyyy')}
                                    </span>
                                )}
                            </p>
                        </div>
                        {bookingData.paymentRef && (
                            <div>
                                <Label className="text-muted-foreground">Payment Reference</Label>
                                <p className="text-sm font-mono">{bookingData.paymentRef}</p>
                            </div>
                        )}
                        {bookingData.payment && (
                            <>
                                <div>
                                    <Label className="text-muted-foreground">Payment Method</Label>
                                    <p className="font-medium">{bookingData.payment.paymentMethod}</p>
                                </div>
                                {bookingData.payment.paystackReference && (
                                    <div>
                                        <Label className="text-muted-foreground">Gateway Reference</Label>
                                        <p className="text-sm font-mono">{bookingData.payment.paystackReference}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Admin Notes */}
            {bookingData.adminNotes && (
                <Card>
                    <CardHeader>
                        <CardTitle>Admin Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm whitespace-pre-wrap">{bookingData.adminNotes}</p>
                    </CardContent>
                </Card>
            )}

            {/* Timestamps */}
            <Card>
                <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Created</span>
                        <span className="font-medium">
                            {bookingData.createdAt ? format(new Date(bookingData.createdAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                        </span>
                    </div>
                    {bookingData.completedAt && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Completed</span>
                            <span className="font-medium">
                                {format(new Date(bookingData.completedAt), 'MMM dd, yyyy HH:mm')}
                            </span>
                        </div>
                    )}
                    {bookingData.cancelledAt && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Cancelled</span>
                            <span className="font-medium">
                                {format(new Date(bookingData.cancelledAt), 'MMM dd, yyyy HH:mm')}
                            </span>
                        </div>
                    )}
                    {bookingData.cancellationReason && (
                        <div>
                            <span className="text-muted-foreground">Cancellation Reason: </span>
                            <span>{bookingData.cancellationReason}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Update Dialog */}
            <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Booking</DialogTitle>
                        <DialogDescription>
                            Make changes to the booking status and payment information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={updateData.status} onValueChange={(value) => setUpdateData(prev => ({ ...prev, status: value }))}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isPaid"
                                checked={updateData.isPaid}
                                onChange={(e) => setUpdateData(prev => ({ ...prev, isPaid: e.target.checked }))}
                                className="h-4 w-4"
                            />
                            <Label htmlFor="isPaid">Mark as Paid</Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adminNotes">Admin Notes</Label>
                            <Textarea
                                id="adminNotes"
                                value={updateData.adminNotes}
                                onChange={(e) => setUpdateData(prev => ({ ...prev, adminNotes: e.target.value }))}
                                rows={4}
                                placeholder="Add notes about this booking..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Updating...' : 'Update Booking'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Resolve Dispute Dialog */}
            <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Resolve Dispute</DialogTitle>
                        <DialogDescription>
                            Choose a resolution for this booking dispute
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="resolution">Resolution Type</Label>
                            <Select value={disputeData.resolution} onValueChange={(value) => setDisputeData(prev => ({ ...prev, resolution: value }))}>
                                <SelectTrigger id="resolution">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="REFUND">Issue Refund</SelectItem>
                                    <SelectItem value="RESCHEDULE">Reschedule Session</SelectItem>
                                    <SelectItem value="CREDIT">Provide Credit</SelectItem>
                                    <SelectItem value="NO_ACTION">No Action Required</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {disputeData.resolution === 'REFUND' && (
                            <div className="space-y-2">
                                <Label htmlFor="refundAmount">Refund Amount ({bookingData.currency})</Label>
                                <Input
                                    id="refundAmount"
                                    type="number"
                                    value={disputeData.refundAmount}
                                    onChange={(e) => setDisputeData(prev => ({ ...prev, refundAmount: parseFloat(e.target.value) }))}
                                    placeholder={`Max: ${bookingData.price}`}
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="resolutionNotes">Resolution Notes</Label>
                            <Textarea
                                id="resolutionNotes"
                                value={disputeData.resolutionNotes}
                                onChange={(e) => setDisputeData(prev => ({ ...prev, resolutionNotes: e.target.value }))}
                                rows={4}
                                placeholder="Explain the resolution..."
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDisputeDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleResolveDispute} disabled={resolveMutation.isPending || !disputeData.resolutionNotes}>
                            {resolveMutation.isPending ? 'Resolving...' : 'Resolve Dispute'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BookingDetails;
