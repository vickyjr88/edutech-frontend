// src/client/services/student.service.ts
import {api ,ApiResponse } from '../client.ts';
export interface Student {
    id: string;
    user: string;
    grade: string;
    school: string;
    interests: string[];
    aboutMe: string;
    learningStreak: number;
    level: string;
    rank: string;
    xpPoints: number;
    nextLevelXp: number;
    totalLearningHours: number;
    completionRate: number;
    achievementsCount: number;
    earnedAchievements: string[]; // or a more specific type if you know the structure
    enrollments: string[];        // or a more specific type if you know the structure
    activeQuests: string[];       // or a more specific type if you know the structure
    createdAt: string;            // or Date, depending on how it's used in code
    updatedAt: string; 
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

export interface UpcomingSession {
    classId: string;
    title: string;
    subject: string;
    teacherName: string;
    profileImage: string;
    cohortName: string;
    startTime: string;
    duration: number;
    timeLeft: number;
    progress: number;
    sessionType: string;
    nextLesson: string;
    lessonsRemaining: number;
    studentsEnrolled: number;
}

export const studentService = {
    getProfile: (studentId: string): Promise<ApiResponse<Student>> => {
        return api.get<Student>(`/students/profiles/${studentId}`);
    },

    getProfileByUserId: (userId: string): Promise<ApiResponse<Student>> => {
        return api.get<Student>(`/students/users/${userId}/profile`);
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

    getUpcomingSessions: (studentId: string): Promise<ApiResponse<UpcomingSession[]>> => {
        return api.get<UpcomingSession[]>(`/students/${studentId}/upcoming-sessions`);
    },

    updateProfile: (studentId: string, data: Partial<Student>): Promise<ApiResponse<Student>> => {
        return api.put<Student>(`/students/profiles/${studentId}`, data);
    }
};