/**
 * Custom Class Request Service
 * 
 * Handles API calls for custom class requests
 */

import { api } from '../client';

export interface CreateCustomClassRequest {
    teacherId: string;
    subject: string;
    studentName: string;
    studentGrade: string;
    description: string;
    preferredSchedule?: string;
}

export interface CustomClassRequest {
    _id: string;
    requestedBy: {
        _id: string;
        fullName: string;
        email: string;
    };
    teacherId: {
        _id: string;
        fullName: string;
        email: string;
        profileImage?: string;
    };
    subject: string;
    studentName: string;
    studentGrade: string;
    description: string;
    preferredSchedule?: string;
    status: 'pending' | 'accepted' | 'declined' | 'completed';
    teacherResponse?: string;
    respondedAt?: string;
    createdOfferingId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateCustomClassRequest {
    status?: 'pending' | 'accepted' | 'declined' | 'completed';
    teacherResponse?: string;
}

export const customClassRequestService = {
    /**
     * Create a new custom class request
     */
    async createRequest(data: CreateCustomClassRequest) {
        try {
            const response = await api.post('/mvp/custom-class-requests', data);
            return { data: response.data.data, error: null };
        } catch (error: any) {
            return {
                data: null,
                error: error.response?.data || { message: 'Failed to create request' },
            };
        }
    },

    /**
     * Get my requests (as requester or teacher)
     */
    async getMyRequests(params?: { status?: string; as?: 'requester' | 'teacher' }) {
        try {
            const response = await api.get('/mvp/custom-class-requests/my-requests', { params });
            return { data: response.data.data, error: null };
        } catch (error: any) {
            return {
                data: null,
                error: error.response?.data || { message: 'Failed to fetch requests' },
            };
        }
    },

    /**
     * Get teacher's requests (teacher only)
     */
    async getTeacherRequests(status?: string) {
        try {
            const response = await api.get('/mvp/custom-class-requests/teacher', {
                params: { status },
            });
            return { data: response.data.data, error: null };
        } catch (error: any) {
            return {
                data: null,
                error: error.response?.data || { message: 'Failed to fetch teacher requests' },
            };
        }
    },

    /**
     * Get request statistics
     */
    async getStats(teacherId?: string) {
        try {
            const response = await api.get('/mvp/custom-class-requests/stats', {
                params: { teacherId },
            });
            return { data: response.data.data, error: null };
        } catch (error: any) {
            return {
                data: null,
                error: error.response?.data || { message: 'Failed to fetch stats' },
            };
        }
    },

    /**
     * Get all requests (admin only)
     */
    async getAllRequests(filters?: {
        status?: string;
        teacherId?: string;
        startDate?: string;
        endDate?: string;
    }) {
        try {
            const response = await api.get('/mvp/custom-class-requests', { params: filters });
            return { data: response.data.data, error: null };
        } catch (error: any) {
            return {
                data: null,
                error: error.response?.data || { message: 'Failed to fetch all requests' },
            };
        }
    },

    /**
     * Get a single request by ID
     */
    async getRequestById(id: string) {
        try {
            const response = await api.get(`/mvp/custom-class-requests/${id}`);
            return { data: response.data.data, error: null };
        } catch (error: any) {
            return {
                data: null,
                error: error.response?.data || { message: 'Failed to fetch request' },
            };
        }
    },

    /**
     * Update request (teacher responds)
     */
    async updateRequest(id: string, data: UpdateCustomClassRequest) {
        try {
            const response = await api.patch(`/mvp/custom-class-requests/${id}`, data);
            return { data: response.data.data, error: null };
        } catch (error: any) {
            return {
                data: null,
                error: error.response?.data || { message: 'Failed to update request' },
            };
        }
    },
};
