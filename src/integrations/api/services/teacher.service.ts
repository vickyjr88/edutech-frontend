// src/api/services/teacher.service.ts
import { api, ApiResponse } from '../client';

export interface TeacherProfile {
    id: string;
    userId: string;
    education: Education[];
    experience: Experience[];
    strategies: string[];
    methodologies: string[];
    subjects: string[];
    skills: string[];
    languages: string[];
    certifications: string[];
    introVideoUrl?: string;
    isProfileComplete: boolean;
    rating: number;
    totalReviews: number;
    totalStudents: number;
    totalClasses: number;
    totalHours: number;
    [key: string]: any; // For any additional properties
}

export interface Education {
    id?: string;
    teacherProfile?: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date | string;
    endDate?: Date | string;
    isCurrentlyEnrolled?: boolean;
    grade?: string;
    activities?: string;
    description?: string;
}

export interface Experience {
    id?: string;
    teacherProfile?: string;
    position: string;
    institution: string;
    institutionType?: string;
    startDate: Date | string;
    endDate?: Date | string;
    isCurrentlyWorking?: boolean;
    curriculums?: string[];
    grades?: string[];
    subjects?: string[];
    reportingManager?: {
        name: string;
        phoneNumber: string;
    };
    additionalDetails?: string;
}

export const teacherService = {
    // Teacher Profile CRUD
    createProfile: (data: Partial<TeacherProfile>): Promise<ApiResponse<TeacherProfile>> => {
        return api.post<TeacherProfile>('/teachers', data);
    },

    getAllProfiles: (): Promise<ApiResponse<TeacherProfile[]>> => {
        return api.get<TeacherProfile[]>('/teachers');
    },

    getCurrentProfile: (): Promise<ApiResponse<TeacherProfile>> => {
        return api.get<TeacherProfile>('/teachers/profile');
    },

    getProfileById: (id: string): Promise<ApiResponse<TeacherProfile>> => {
        return api.get<TeacherProfile>(`/teachers/${id}`);
    },

    updateProfile: (id: string, data: Partial<TeacherProfile>): Promise<ApiResponse<TeacherProfile>> => {
        return api.patch<TeacherProfile>(`/teachers/${id}`, data);
    },

    deleteProfile: (id: string): Promise<ApiResponse<{ success: boolean }>> => {
        return api.delete<{ success: boolean }>(`/teachers/${id}`);
    },

    getProfileByUserId: (userId: string): Promise<ApiResponse<TeacherProfile>> => {
        return api.get<TeacherProfile>(`/teachers/user/${userId}`);
    },

    // Education Management
    addEducation: (data: Education): Promise<ApiResponse<Education>> => {
        return api.post<Education>('/teachers/education', data);
    },

    getEducation: (id: string): Promise<ApiResponse<Education>> => {
        return api.get<Education>(`/teachers/education/${id}`);
    },

    updateEducation: (id: string, data: Partial<Education>): Promise<ApiResponse<Education>> => {
        return api.patch<Education>(`/teachers/education/${id}`, data);
    },

    deleteEducation: (id: string): Promise<ApiResponse<{ success: boolean }>> => {
        return api.delete<{ success: boolean }>(`/teachers/education/${id}`);
    },

    // Experience Management
    addExperience: (data: Experience): Promise<ApiResponse<Experience>> => {
        return api.post<Experience>('/teachers/experience', data);
    },

    getExperience: (id: string): Promise<ApiResponse<Experience>> => {
        return api.get<Experience>(`/teachers/experience/${id}`);
    },

    updateExperience: (id: string, data: Partial<Experience>): Promise<ApiResponse<Experience>> => {
        return api.patch<Experience>(`/teachers/experience/${id}`, data);
    },

    deleteExperience: (id: string): Promise<ApiResponse<{ success: boolean }>> => {
        return api.delete<{ success: boolean }>(`/teachers/experience/${id}`);
    },

    // Additional helper methods
    isProfileComplete: async (userId: string): Promise<boolean> => {
        const { data, error } = await teacherService.getProfileByUserId(userId);
        if (error || !data) return false;
        return data.isProfileComplete;
    },

    getTeacherClasses: async (teacherId: string): Promise<ApiResponse<any[]>> => {
        return api.get<any[]>(`/classes/teacher/${teacherId}`);
    },

    getTeacherStudents: async (teacherId: string): Promise<ApiResponse<any[]>> => {
        return api.get<any[]>(`/teachers/${teacherId}/students`);
    },

    getTeacherStats: async (teacherId: string): Promise<ApiResponse<{
        totalStudents: number;
        totalClasses: number;
        totalHours: number;
        averageRating: number;
    }>> => {
        return api.get<any>(`/teachers/${teacherId}/stats`);
    }
};