/**
 * MVP Teacher Service
 * 
 * Handles teacher-related API calls using the MVP namespace endpoints
 */

import { mvpApiClient } from '../mvp-client';

export interface MvpLocation {
    estate: string;
    road?: string;
    city: string;
}

export interface MvpPayoutDetails {
    mpesaNumber: string;
    bankAccountName?: string;
    bankAccountNumber?: string;
    bankName?: string;
    branchCode?: string;
}

export interface MvpEducation {
    degree: string;
    institution: string;
    year: number;
}

export interface CreateMvpTeacherProfileRequest {
    fullName: string;
    phoneNumber: string;
    location: MvpLocation;
    bio: string;
    introVideoUrl?: string;
    curriculums: string[];
    subjects: string[];
    gradeLevels: string[];
    yearsOfExperience: number;
    payoutDetails: MvpPayoutDetails;
    education?: MvpEducation[];
}

export interface UpdateMvpTeacherProfileRequest {
    fullName?: string;
    phoneNumber?: string;
    location?: MvpLocation;
    bio?: string;
    introVideoUrl?: string;
    curriculums?: string[];
    subjects?: string[];
    gradeLevels?: string[];
    yearsOfExperience?: number;
    payoutDetails?: MvpPayoutDetails;
    education?: MvpEducation[];
}

export interface MvpTeacherProfileResponse {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    bio: string;
    profileImage?: string;
    location: MvpLocation;
    introVideoUrl?: string;
    curriculums: string[];
    subjects: string[];
    gradeLevels: string[];
    yearsOfExperience: number;
    payoutDetails: MvpPayoutDetails;
    education: MvpEducation[];
    isProfileComplete: boolean;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

/**
 * MVP Teacher Profile Service
 * Uses /mvp/teacher-profiles endpoints
 */
export const MvpTeacherService = {
    /**
     * Create a new teacher profile
     */
    createProfile: async (data: CreateMvpTeacherProfileRequest): Promise<MvpTeacherProfileResponse> => {
        return mvpApiClient.post<MvpTeacherProfileResponse>('/teacher-profiles', data);
    },

    /**
     * Get current user's teacher profile
     */
    getCurrentProfile: async (): Promise<MvpTeacherProfileResponse | null> => {
        try {
            return await mvpApiClient.get<MvpTeacherProfileResponse>('/teacher-profiles/me');
        } catch (error: any) {
            // Return null if profile not found
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    /**
     * Get teacher profile by user ID
     */
    getProfileByUserId: async (userId: string): Promise<MvpTeacherProfileResponse | null> => {
        try {
            return await mvpApiClient.get<MvpTeacherProfileResponse>(`/teacher-profiles/${userId}`);
        } catch (error: any) {
            // Return null if profile not found
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    /**
     * Update current user's teacher profile
     */
    updateProfile: async (data: UpdateMvpTeacherProfileRequest): Promise<MvpTeacherProfileResponse> => {
        return mvpApiClient.patch<MvpTeacherProfileResponse>('/teacher-profiles', data);
    },

    /**
     * Update teacher profile by user ID (for admin or self-update with ID)
     */
    updateProfileById: async (userId: string, data: UpdateMvpTeacherProfileRequest): Promise<MvpTeacherProfileResponse> => {
        return mvpApiClient.patch<MvpTeacherProfileResponse>(`/teacher-profiles/${userId}`, data);
    },

    /**
     * Upload profile photo
     */
    uploadProfilePhoto: async (base64Image: string, mimeType: string): Promise<{ profileImage: string }> => {
        // Remove data URI prefix if present
        let cleanBase64 = base64Image;
        if (base64Image.includes(';base64,')) {
            cleanBase64 = base64Image.split(';base64,')[1];
        }

        return mvpApiClient.post<{ profileImage: string }>('/teacher-profiles/upload-photo', {
            mimeType,
        });
    },

    /**
     * Get teacher dashboard statistics
     */
    getDashboardStats: async (): Promise<any> => {
        return mvpApiClient.get<any>('/dashboard/stats');
    },

    /**
     * Get teacher's offerings/classes
     */
    getMyClasses: async (): Promise<any[]> => {
        return mvpApiClient.get<any[]>('/dashboard/my-classes');
    },

    /**
     * Get teacher's schedule
     */
    getSchedule: async (startDate?: string, endDate?: string): Promise<any[]> => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const queryString = params.toString() ? `?${params.toString()}` : '';
        return mvpApiClient.get<any[]>(`/dashboard/schedule${queryString}`);
    },

    /**
     * Get upcoming bookings (next 7 days)
     */
    getUpcomingBookings: async (): Promise<any[]> => {
        return mvpApiClient.get<any[]>('/dashboard/upcoming-bookings');
    },

    /**
     * Get teacher's students
     */
    getStudents: async (): Promise<any[]> => {
        return mvpApiClient.get<any[]>('/dashboard/students');
    },

    /**
     * Get teacher's earnings
     */
    getEarnings: async (period: string = 'month'): Promise<any> => {
        return mvpApiClient.get<any>(`/dashboard/earnings?period=${period}`);
    },

    /**
     * Get teacher's resources
     */
    getResources: async (): Promise<any[]> => {
        return mvpApiClient.get<any[]>('/dashboard/resources');
    },

    /**
     * Get teacher details with offerings and availability
     */
    getTeacherDetails: async (teacherId: string): Promise<any> => {
        return mvpApiClient.get<any>(`/teachers/${teacherId}`);
    },
};

export default MvpTeacherService;
