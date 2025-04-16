// src/client/services/student.service.ts
import {api ,ApiResponse } from '../client.ts';
export interface Student {
    id: string;
    // Add other student properties based on your NestJS model
}

export interface DashboardStats {
    enrolledClasses: {
        total: number;
        inProgress: number;
        startingSoon: number;
        isNewClassAvailable: boolean;
    };
    learningHours: {
        total: number;
        thisWeek: number;
        isPersonalBest: boolean;
    };
    completionRate: {
        percentage: number;
        isAboveAverage: boolean;
    };
    achievementsAndStreak: {
        achievements: number;
        totalPossible: number;
        streak: number;
        streakDays: string;
        level: number;
        isOnFire: boolean;
    };
}

export interface TodaysLesson {
    id: string;
    classType: string;
    grade: string;
    subject: string;
    curriculum: string;
    title: string;
    teacher: {
        title: string;
        firstName: string;
        lastName: string;
        fullName: string;
    };
    nextTopic: string;
    friendsCount: number;
    isLiveNow: boolean;
    homeworkDue: string;
    progress: {
        lessonsCompleted: number;
        totalLessons: number;
        percentage: number;
    };
    sessionInfo: {
        when: string;
        formatted: string;
        isInProgress: boolean;
    };
}

export const studentService = {
    getProfile: (studentId: string): Promise<ApiResponse<Student>> => {
        return api.get<Student>(`/students/users/${studentId}/profile`);
    },

    getDashboardStats: (studentId: string): Promise<ApiResponse<DashboardStats>> => {
        return api.get<DashboardStats>(`/students/${studentId}/dashboard-stats`);
    },

    getTodaysLessons: (studentId: string): Promise<ApiResponse<{ lessons: TodaysLesson[] }>> => {
        return api.get<{ lessons: TodaysLesson[] }>(`/students/${studentId}/todays-lessons`);
    },

    joinClass: (studentId: string, classId: string): Promise<ApiResponse<{ success: boolean; sessionUrl: string }>> => {
        return api.post<{ success: boolean; sessionUrl: string }>(`/students/${studentId}/join-class/${classId}`, {});
    },

    updateProfile: (studentId: string, data: Partial<Student>): Promise<ApiResponse<Student>> => {
        return api.put<Student>(`/students/profiles/${studentId}`, data);
    }
};