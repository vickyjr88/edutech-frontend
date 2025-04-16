// src/api/services/class.service.ts
import { api, ApiResponse } from '../client';

export interface Class {
    id: string;
    title: string;
    subject: string;
    type: string;
    gradeLevel: string;
    teacher: {
        id: string;
        name: string;
    };
    rating: number;
    totalReviews: number;
    enrollment: {
        current: number;
        maximum: number;
    };
    schedule?: {
        daysOfWeek: string[];
        startTime: string;
        endTime: string;
    };
    price: number;
    discount: number;
    featured: boolean;
    thumbnailUrl?: string;
}

export interface ClassDetail extends Class {
    description: string;
    curriculum: string;
    summary: string;
    technicalRequirements: never[];
    materials: never[];
    lessonPlans: never[];
    teachingTeam?: {
        id: string;
        name: string;
    }[];
    cohorts?: never[];
    isPublished: boolean;
    isPublic: boolean;
}

export interface Review {
    id: string;
    student: {
        id?: string;
        name: string;
    };
    rating: number;
    comment?: string;
    createdAt: Date;
}

export interface LessonPlan {
    title: string;
    description?: string;
    duration: number;
    resourceFiles?: string[];
    resourceLinks?: { title: string; url: string }[];
}

export interface ResourceLink {
    title: string;
    url: string;
}

export interface ClassProgress {
    classId: string;
    studentId?: string;
    progress: number;
    completedLessons: number;
    totalLessons: number;
    nextLesson?: {
        index: number;
        title: string;
        description?: string;
    };
}

export const classService = {
    // Basic class operations
    create: (classData: never): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>('/classes', classData);
    },

    getAll: (): Promise<ApiResponse<Class[]>> => {
        return api.get<Class[]>('/classes');
    },

    getById: (classId: string): Promise<ApiResponse<ClassDetail>> => {
        return api.get<ClassDetail>(`/classes/${classId}`);
    },

    update: (classId: string, data: never): Promise<ApiResponse<ClassDetail>> => {
        return api.patch<ClassDetail>(`/classes/${classId}`, data);
    },

    delete: (classId: string): Promise<ApiResponse<never>> => {
        return api.delete(`/classes/${classId}`);
    },

    // Teacher specific operations
    getTeacherClasses: (teacherId: string): Promise<ApiResponse<Class[]>> => {
        return api.get<Class[]>(`/classes/teacher/${teacherId}`);
    },

    publish: (classId: string): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/publish`, {});
    },

    unpublish: (classId: string): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/unpublish`, {});
    },

    addTeachingTeamMember: (classId: string, teacherId: string): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/teaching-team/${teacherId}`, {});
    },

    removeTeachingTeamMember: (classId: string, teacherId: string): Promise<ApiResponse<never>> => {
        return api.delete<never>(`/classes/${classId}/teaching-team/${teacherId}`);
    },

    // Lesson plan operations
    addLessonPlan: (classId: string, lessonPlan: LessonPlan): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/lesson-plans`, lessonPlan);
    },

    updateLessonPlan: (classId: string, lessonIndex: number, lessonPlan: LessonPlan): Promise<ApiResponse<ClassDetail>> => {
        return api.patch<ClassDetail>(`/classes/${classId}/lesson-plans/${lessonIndex}`, lessonPlan);
    },

    removeLessonPlan: (classId: string, lessonIndex: number): Promise<ApiResponse<never>> => {
        return api.delete<never>(`/classes/${classId}/lesson-plans/${lessonIndex}`);
    },

    markLessonComplete: (classId: string, lessonIndex: number): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/lesson-plans/${lessonIndex}/complete`, {});
    },

    addResourceLink: (classId: string, lessonIndex: number, resourceLink: ResourceLink): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/lesson-plans/${lessonIndex}/resource-links`, resourceLink);
    },

    removeResourceLink: (classId: string, lessonIndex: number, linkIndex: number): Promise<ApiResponse<never>> => {
        return api.delete<never>(`/classes/${classId}/lesson-plans/${lessonIndex}/resource-links/${linkIndex}`);
    },

    // Class discovery and browsing
    search: (params: {
        subject?: string;
        type?: string;
        gradeLevel?: string;
        keyword?: string;
    }): Promise<ApiResponse<Class[]>> => {
        return api.get<Class[]>('/classes/search', { params });
    },

    browse: (params: {
        subject?: string;
        type?: string;
        gradeLevel?: string;
        minRating?: number;
        maxPrice?: number;
        hasAvailableSpots?: boolean;
        teacherId?: string;
        keyword?: string;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<Class[]>> => {
        return api.get<Class[]>('/classes/browse', { params });
    },

    getFeatured: (): Promise<ApiResponse<Class[]>> => {
        return api.get<Class[]>('/classes/featured');
    },

    getNew: (): Promise<ApiResponse<Class[]>> => {
        return api.get<Class[]>('/classes/new');
    },

    getPopular: (): Promise<ApiResponse<Class[]>> => {
        return api.get<Class[]>('/classes/popular');
    },

    getRecommended: (userId: string): Promise<ApiResponse<Class[]>> => {
        return api.get<Class[]>(`/classes/recommended/${userId}`);
    },

    // Student-focused operations
    getCurrentClassesForStudent: (studentId: string): Promise<ApiResponse<never[]>> => {
        return api.get<never[]>(`/classes/student/${studentId}/current`);
    },

    getCompletedClassesForStudent: (studentId: string): Promise<ApiResponse<never[]>> => {
        return api.get<never[]>(`/classes/student/${studentId}/completed`);
    },

    getMaterials: (classId: string): Promise<ApiResponse<never>> => {
        return api.get<never>(`/classes/${classId}/materials`);
    },

    getProgress: (classId: string): Promise<ApiResponse<ClassProgress>> => {
        return api.get<ClassProgress>(`/classes/${classId}/progress`);
    },

    // Review operations
    addReview: (classId: string, rating: number, comment?: string): Promise<ApiResponse<never>> => {
        return api.post<never>(`/classes/${classId}/reviews`, { rating, comment });
    },

    getReviews: (classId: string): Promise<ApiResponse<Review[]>> => {
        return api.get<Review[]>(`/classes/${classId}/reviews`);
    },

    // Administrative operations
    setFeatured: (classId: string, featured: boolean): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/feature`, { featured });
    },

    updateTags: (classId: string, tags: string[]): Promise<ApiResponse<ClassDetail>> => {
        return api.patch<ClassDetail>(`/classes/${classId}/tags`, { tags });
    },

    updateMedia: (classId: string, media: { thumbnailUrl?: string; introVideoUrl?: string }): Promise<ApiResponse<ClassDetail>> => {
        return api.patch<ClassDetail>(`/classes/${classId}/media`, media);
    },

    recalculateSchedules: (): Promise<ApiResponse<never>> => {
        return api.post<never>('/classes/recalculate-schedules', {});
    }
};