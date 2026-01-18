import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/integrations/api/services/admin.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Calendar, Search, Filter, Eye, TrendingUp, DollarSign, Download } from 'lucide-react';
import { format } from 'date-fns';

interface BookingsListProps {
    onViewBooking: (id: string) => void;
}

const BookingsList = ({ onViewBooking }: BookingsListProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [paymentFilter, setPaymentFilter] = useState<string>('all');
    const [teacherFilter, setTeacherFilter] = useState<string>('all');
    const [parentFilter, setParentFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingExport, setIsLoadingExport] = useState(false);
    const pageSize = 20;

    // Fetch bookings statistics
    const { data: statsData } = useQuery({
        queryKey: ['bookingStats'],
        queryFn: async () => {
            const response = await adminService.getBookingStats();
            const data = response.data as any;
            // Handle potential nested data structure
            return data?.data || data || {};
        },
    });

    // Fetch teachers for filter
    const { data: teachersData } = useQuery({
        queryKey: ['adminTeachersList'],
        queryFn: async () => {
            const response = await adminService.getTeachers({ limit: 100 });
            return response.data;
        }
    });

    // Fetch parents for filter
    const { data: parentsData } = useQuery({
        queryKey: ['adminParentsList'],
        queryFn: async () => {
            const response = await adminService.getParents({ limit: 100 });
            return response.data;
        }
    });

    // Fetch bookings list
    const { data: bookingsData, isLoading } = useQuery({
        queryKey: ['adminBookings', currentPage, searchTerm, statusFilter, paymentFilter, teacherFilter, parentFilter],
        queryFn: async () => {
            const params: any = {
                page: currentPage,
                limit: pageSize,
            };

            if (searchTerm) params.search = searchTerm;
            if (statusFilter !== 'all') params.status = statusFilter;
            if (paymentFilter === 'paid') params.isPaid = true;
            if (paymentFilter === 'unpaid') params.isPaid = false;
            if (teacherFilter !== 'all') params.teacherId = teacherFilter;
            if (parentFilter !== 'all') params.parentId = parentFilter;

            const response = await adminService.getBookings(params);
            const data = response.data;

            // Client-side fallback filtering for status if backend ignores it
            if (data?.bookings && statusFilter !== 'all') {
                const filtered = data.bookings.filter((b: any) =>
                    b.status?.toLowerCase() === statusFilter.toLowerCase()
                );

                // Only override if the filtered set is smaller than original 
                // (meaning backend returned some non-matching items)
                if (filtered.length < data.bookings.length) {
                    data.bookings = filtered;
                    data.total = filtered.length;
                }
            }

            return data;
        },
    });

    const handleExport = async () => {
        setIsLoadingExport(true);
        try {
            const params: any = { limit: 1000 };

            if (searchTerm) params.search = searchTerm;
            if (statusFilter !== 'all') params.status = statusFilter;
            if (paymentFilter === 'paid') params.isPaid = true;
            if (paymentFilter === 'unpaid') params.isPaid = false;
            if (teacherFilter !== 'all') params.teacherId = teacherFilter;
            if (parentFilter !== 'all') params.parentId = parentFilter;

            const response = await adminService.getBookings(params);
            const bookings = response.data.bookings;

            // Define CSV headers
            const headers = [
                'Booking ID',
                'Confirmation Code',
                'Status',
                'Date',
                'Time',
                'Duration (mins)',
                'Teacher',
                'Parent',
                'Student',
                'Offering',
                'Amount',
                'Currency',
                'Payment Status',
                'Payment Ref'
            ];

            // Convert data to CSV format
            const csvData = bookings.map(b => [
                b._id,
                b.confirmationCode,
                b.status,
                b.scheduledDate ? format(new Date(b.scheduledDate), 'yyyy-MM-dd') : '',
                b.scheduledTime,
                b.duration,
                b.teacherId?.fullName || '',
                b.parentId?.fullName || '',
                b.studentName || '',
                b.offeringId?.title || '',
                b.price,
                b.currency,
                b.isPaid ? 'Paid' : 'Unpaid',
                b.paymentRef || ''
            ]);

            // Create CSV content
            const csvContent = [
                headers.join(','),
                ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            ].join('\n');

            // Trigger download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `bookings_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsLoadingExport(false);
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return 'default';
            case 'completed':
                return 'secondary';
            case 'pending':
                return 'outline';
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const totalPages = bookingsData?.totalPages || 1;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Bookings Management</h1>
                <p className="text-muted-foreground">
                    Manage all bookings, payments, and disputes
                </p>
            </div>

            {/* Statistics Cards */}
            {statsData && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{bookingsData?.total || statsData.total || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {statsData.byStatus?.confirmed || 0} confirmed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                KES {(statsData.revenue?.total || 0).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {(statsData.revenue?.currency || 'KES')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statsData.byPayment?.paid || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {statsData.byPayment?.unpaid || 0} unpaid
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statsData.disputes?.active || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {statsData.manual || 0} manual bookings
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Bookings</CardTitle>
                            <CardDescription>
                                Filter and search through all system bookings
                            </CardDescription>
                        </div>
                        <Button variant="outline" onClick={handleExport} disabled={isLoadingExport}>
                            <Download className="mr-2 h-4 w-4" />
                            {isLoadingExport ? 'Exporting...' : 'Export to CSV'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
                        <div className="col-span-1 lg:col-span-1">
                            <label className="text-sm font-medium mb-2 block">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="w-full">
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full">
                            <label className="text-sm font-medium mb-2 block">Teacher</label>
                            <Select value={teacherFilter} onValueChange={setTeacherFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Teachers" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Teachers</SelectItem>
                                    {teachersData?.teachers?.map((teacher) => (
                                        <SelectItem key={teacher._id} value={teacher._id}>
                                            {teacher.fullName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full">
                            <label className="text-sm font-medium mb-2 block">Parent</label>
                            <Select value={parentFilter} onValueChange={setParentFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Parents" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Parents</SelectItem>
                                    {parentsData?.parents?.map((parent) => (
                                        <SelectItem key={parent._id} value={parent._id}>
                                            {parent.fullName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-4 items-end border-t pt-4">
                        <div className="w-full">
                            <label className="text-sm font-medium mb-2 block">Payment</label>
                            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Payments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Payments</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="unpaid">Unpaid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bookings Table */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading bookings...</div>
                    ) : bookingsData?.bookings?.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No bookings found matching your filters.
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Confirmation</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookingsData?.bookings?.map((booking) => (
                                        <TableRow key={booking._id}>
                                            <TableCell className="font-mono text-sm">
                                                {booking.confirmationCode}
                                                {booking.isManualBooking && (
                                                    <Badge variant="outline" className="ml-2 text-xs">
                                                        Manual
                                                    </Badge>
                                                )}
                                                {booking.hasDispute && (
                                                    <Badge variant="destructive" className="ml-2 text-xs">
                                                        Dispute
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{booking.studentName}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {booking.studentGrade && `Grade ${booking.studentGrade}`}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{booking.teacherId?.fullName}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {booking.offeringId?.subject}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {booking.scheduledDate ? format(new Date(booking.scheduledDate), 'MMM dd, yyyy') : 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {booking.scheduledTime} ({booking.duration} min)
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {booking.currency} {(booking.price || 0).toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(booking.status)}>
                                                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1).toLowerCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {booking.isPaid ? (
                                                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Paid</Badge>
                                                ) : booking.payment?.status === 'failed' ? (
                                                    <Badge variant="destructive">Failed</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Pending</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onViewBooking(booking._id)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between border-t px-6 py-4">
                                    <div className="text-sm text-muted-foreground">
                                        Page {currentPage} of {totalPages} • {bookingsData?.total} total bookings
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default BookingsList;
