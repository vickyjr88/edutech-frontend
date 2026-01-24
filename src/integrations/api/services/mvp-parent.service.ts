import { api } from '../client';

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
        const response = await api.get<DashboardStats>('/mvp/parent/dashboard/stats');
        return response.data || { activeBookings: 0, totalChildren: 0, upcomingSessions: 0, totalSpent: 0 };
    },

    getUpcomingBookings: async (): Promise<Booking[]> => {
        const response = await api.get<any[]>('/mvp/bookings/my-bookings?status=confirmed');
        console.log("Upcoming bookings raw response:", response);
        if (response.error || !response.data) {
            console.warn("Failed to fetch upcoming bookings:", response.error);
            return [];
        }
        const mapped = MvpParentService.mapBookings(response.data);
        console.log("Mapped upcoming bookings:", mapped);
        return mapped;
    },

    getChildren: async (): Promise<Child[]> => {
        try {
            // 1. Fetch parent profile to get children from MVP endpoint
            const profileResponse = await api.get<Child[]>('/mvp/parent/children');
            const children = profileResponse.data || [];
            console.log("Children fetched:", children);

            // 2. Fetch active bookings to calculate counts from MVP endpoint
            const bookingsResponse = await api.get<any[]>('/mvp/bookings/my-bookings?status=confirmed');
            const bookings = bookingsResponse.data || [];
            console.log("Active bookings fetched:", bookings);

            // 3. Map and merge
            return children.map((child: any) => {
                const childId = String(child._id);

                // Count bookings for this child
                const childBookingsCount = bookings.filter((b: any) => {
                    // Check studentId (handle both string ID and populated object)
                    if (b.studentId) {
                        // Handle populated studentId object
                        const bookingStudentId = (typeof b.studentId === 'object' && b.studentId._id)
                            ? String(b.studentId._id)
                            : String(b.studentId);

                        if (bookingStudentId === childId) {
                            return true;
                        }
                    }

                    // Check studentName as fallback (case-insensitive)
                    if (b.studentName && child.fullName &&
                        b.studentName.trim().toLowerCase() === child.fullName.trim().toLowerCase()) {
                        return true;
                    }

                    return false;
                }).length;

                return {
                    _id: child._id,
                    fullName: child.fullName,
                    // Try multiple possible field names for grade
                    gradeLevel: child.grade || child.gradeLevel || child.class || "Grade not set",
                    activeBookings: childBookingsCount,
                    // Pass through other fields that might be useful for editing
                    ...child
                };
            });
        } catch (error) {
            console.error("Error fetching children with stats:", error);
            return [];
        }
    },

    getAllBookings: async (): Promise<Booking[]> => {
        const response = await api.get<any[]>('/mvp/bookings/my-bookings');
        if (response.error || !response.data) {
            console.warn("Failed to fetch all bookings:", response.error);
            return [];
        }
        return MvpParentService.mapBookings(response.data);
    },

    mapBookings: (rawBookings: any[]): Booking[] => {
        if (!Array.isArray(rawBookings)) return [];
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
