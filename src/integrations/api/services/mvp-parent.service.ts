import { mvpApiClient } from '../mvp-client';

export interface DashboardStats {
    activeBookings: number;
    totalChildren: number;
    upcomingSessions: number;
    totalSpent: number;
}

export interface Booking {
    _id: string;
    teacherName: string;
    offeringTitle: string;
    studentName: string;
    scheduledAt: string;
    duration: number;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    price: number;
}

export interface Child {
    _id: string;
    fullName: string;
    gradeLevel: string;
    activeBookings: number;
}

export const MvpParentService = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        return mvpApiClient.get<DashboardStats>('/parent/dashboard/stats');
    },

    getUpcomingBookings: async (): Promise<Booking[]> => {
        const bookings = await mvpApiClient.get<any[]>('/bookings/my-bookings?status=confirmed');
        return MvpParentService.mapBookings(bookings);
    },

    getChildren: async (): Promise<Child[]> => {
        return mvpApiClient.get<Child[]>('/parent/children');
    },

    getAllBookings: async (): Promise<Booking[]> => {
        const bookings = await mvpApiClient.get<any[]>('/bookings/my-bookings');
        return MvpParentService.mapBookings(bookings);
    },

    mapBookings: (rawBookings: any[]): Booking[] => {
        return rawBookings.map(b => ({
            _id: b._id,
            teacherName: b.teacherId?.fullName || "Your Teacher",
            offeringTitle: b.offeringId?.title || "Learning Session",
            studentName: b.studentName,
            scheduledAt: b.scheduledDate ? new Date(b.scheduledDate).toISOString().split('T')[0] + 'T' + (b.scheduledTime || '00:00') + ':00Z' : new Date().toISOString(),
            duration: b.duration || 60,
            status: b.status,
            price: b.price
        }));
    }
};
