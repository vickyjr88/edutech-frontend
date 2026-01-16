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
import { Calendar, Search, Filter, Eye, TrendingUp, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface BookingsListProps {
    onViewBooking: (id: string) => void;
}

const BookingsList = ({ onViewBooking }: BookingsListProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [paymentFilter, setPaymentFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    // Fetch bookings statistics
    const { data: statsData } = useQuery({
        queryKey: ['bookingStats'],
        queryFn: async () => {
            const response = await adminService.getBookingStats();
            return response.data;
        },
    });

    // Fetch bookings list
    const { data: bookingsData, isLoading } = useQuery({
        queryKey: ['adminBookings', currentPage, searchTerm, statusFilter, paymentFilter],
        queryFn: async () => {
            const params: any = {
                page: currentPage,
                limit: pageSize,
            };

            if (searchTerm) params.search = searchTerm;
            if (statusFilter !== 'all') params.status = statusFilter;
            if (paymentFilter === 'paid') params.isPaid = true;
            if (paymentFilter === 'unpaid') params.isPaid = false;

            const response = await adminService.getBookings(params);
            return response.data;
        },
    });

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
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
                            <div className="text-2xl font-bold">{statsData.totalBookings}</div>
                            <p className="text-xs text-muted-foreground">
                                {statsData.recentBookings} in last 7 days
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
                                KES {(statsData.totalRevenue || 0).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Avg: KES {(statsData.averageBookingValue || 0).toFixed(0)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statsData.byPaymentStatus?.paid || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {statsData.byPaymentStatus?.unpaid || 0} unpaid
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statsData.disputedBookings}</div>
                            <p className="text-xs text-muted-foreground">
                                {statsData.manualBookings} manual bookings
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>
                        Filter and search through all system bookings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row md:items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-2 block">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by confirmation code or student name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-[180px]">
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full md:w-[180px]">
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
                                                    {booking.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {booking.isPaid ? (
                                                    <Badge variant="secondary">Paid</Badge>
                                                ) : (
                                                    <Badge variant="outline">Unpaid</Badge>
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
