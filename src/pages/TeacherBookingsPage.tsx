
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar, Search, Filter, Eye, Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import MvpBookingService, { Booking, BookingStatus } from '@/integrations/api/services/mvp-booking.service';
import { useAuth } from '@/contexts/AuthContext';

const TeacherBookingsPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBookings();
    }, [statusFilter]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const filters: any = {};
            if (statusFilter !== 'all') {
                filters.status = statusFilter;
            }

            // We could add date range filters later

            const data = await MvpBookingService.getTeacherBookings(filters);
            setBookings(data || []);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
            toast({
                title: "Error",
                description: "Failed to load bookings. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptBooking = async (bookingId: string) => {
        try {
            await MvpBookingService.acceptBooking(bookingId);
            toast({
                title: "Success",
                description: "Booking accepted successfully!",
            });
            fetchBookings(); // Refresh list
        } catch (error) {
            console.error('Failed to accept booking', error);
            toast({
                title: "Error",
                description: "Failed to accept booking.",
                variant: "destructive"
            });
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        // In a real app, we'd show a modal to get the cancellation reason
        if (!confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await MvpBookingService.cancelBooking(bookingId, "Teacher cancelled via dashboard");
            toast({
                title: "Success",
                description: "Booking cancelled successfully.",
            });
            fetchBookings();
        } catch (error) {
            console.error('Failed to cancel booking', error);
            toast({
                title: "Error",
                description: "Failed to cancel booking.",
                variant: "destructive"
            });
        }
    };

    // Filter by search term locally for now
    const filteredBookings = bookings.filter(booking => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            booking.studentName.toLowerCase().includes(searchLower) ||
            (booking.offeringId as any)?.title?.toLowerCase().includes(searchLower)
        );
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Confirmed</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
            case 'completed':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completed</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
                        <p className="text-gray-500 mt-1">Manage your class schedule and requests</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search student or class..."
                                className="pl-9 w-full sm:w-[250px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={(value: any) => setStatusFilter(value)}
                        >
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card>
                    <CardHeader className="px-6 py-4 border-b">
                        <CardTitle className="text-lg">All Bookings</CardTitle>
                        <CardDescription>
                            View and manage all your past and upcoming bookings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-12 flex justify-center items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kidato-purple"></div>
                            </div>
                        ) : filteredBookings.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                <p className="text-lg font-medium">No bookings found</p>
                                <p className="text-sm mt-1">
                                    {statusFilter !== 'all' || searchTerm
                                        ? "Try adjusting your filters"
                                        : "You don't have any bookings yet"}
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Class</TableHead>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBookings.map((booking) => (
                                        <TableRow key={booking._id}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{booking.studentName}</span>
                                                    {booking.studentGrade && (
                                                        <span className="text-xs text-gray-500">{booking.studentGrade}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {(booking.offeringId as any)?.title || 'Unknown Class'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {format(new Date(booking.scheduledDate), 'MMM d, yyyy')}
                                                    </span>
                                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {booking.scheduledTime}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{booking.duration} mins</TableCell>
                                            <TableCell>KES {booking.price.toLocaleString()}</TableCell>
                                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {booking.status === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 h-8"
                                                            onClick={() => handleAcceptBooking(booking._id)}
                                                        >
                                                            <Check className="w-4 h-4 mr-1" />
                                                            Accept
                                                        </Button>
                                                    )}
                                                    {/* View Details Button - for MVP just a placeholder or could link to details page if it exists */}
                                                    {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <Eye className="w-4 h-4" />
                                                            </Button> */}

                                                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
                                                            onClick={() => handleCancelBooking(booking._id)}
                                                        >
                                                            <X className="w-4 h-4 mr-1" />
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TeacherBookingsPage;
