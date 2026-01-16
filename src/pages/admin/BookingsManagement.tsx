import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookingsList from '@/components/admin/bookings/BookingsList';
import BookingDetails from '@/components/admin/bookings/BookingDetails';

const BookingsManagement = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const bookingId = searchParams.get('id');

    const handleViewBooking = (id: string) => {
        setSearchParams({ id });
    };

    const handleBack = () => {
        setSearchParams({});
    };

    return (
        <div className="space-y-6">
            {bookingId ? (
                <BookingDetails bookingId={bookingId} onBack={handleBack} />
            ) : (
                <BookingsList onViewBooking={handleViewBooking} />
            )}
        </div>
    );
};

export default BookingsManagement;
