import { mvpApiClient } from '../mvp-client';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
    _id: string;
    parentId: string;
    teacherId: string;
    offeringId: string;
    studentName: string;
    studentAge?: number;
    studentGrade?: string;
    scheduledDate: string;
    scheduledTime: string;
    duration: number;
    price: number;
    status: BookingStatus;
    meetingLink?: string;
    notes?: string;
    isPaid: boolean;
    paymentRef?: string;
    confirmationCode?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateBookingRequest {
    offeringId: string;
    teacherId: string;
    studentName: string;
    studentAge?: number;
    studentGrade?: string;
    scheduledDate: string; // YYYY-MM-DD
    scheduledTime: string; // HH:mm
    notes?: string;
}

export interface CancelBookingRequest {
    reason: string;
}

const MvpBookingService = {
    /**
     * Create a new booking
     */
    createBooking: async (data: CreateBookingRequest): Promise<Booking> => {
        return mvpApiClient.post<Booking>('/bookings', data);
    },

    /**
     * Get parent's bookings
     */
    getMyBookings: async (status?: BookingStatus): Promise<Booking[]> => {
        const query = status ? `?status=${status}` : '';
        return mvpApiClient.get<Booking[]>(`/bookings/my-bookings${query}`);
    },

    /**
     * Get booking by ID
     */
    getBooking: async (id: string): Promise<Booking> => {
        return mvpApiClient.get<Booking>(`/bookings/${id}`);
    },

    /**
     * Cancel a booking
     */
    cancelBooking: async (id: string, reason: string): Promise<Booking> => {
        return mvpApiClient.post<Booking>(`/bookings/${id}/cancel`, { reason });
    },

    /**
     * Mark booking as completed
     */
    completeBooking: async (id: string): Promise<Booking> => {
        return mvpApiClient.post<Booking>(`/bookings/${id}/complete`, {});
    },
};

export default MvpBookingService;
