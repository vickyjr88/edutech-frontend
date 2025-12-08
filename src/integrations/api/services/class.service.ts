// src/api/services/class.service.ts
import { api, ApiResponse } from '../client';

export interface Class {
    _id: string;
    title: string;
    subject: string;
    type: string;
    gradeLevel: string;
    teacher: {
        _id: string;
        name?: string;
        user?: {
            _id: string;
            fullName: string;
            profileImage?: string;
            bio?: string;
        };
        subjects?: {
            subject: string;
            gradeLevel?: string;
            proficiencyLevel?: string;
        }[];
        rating?: number;
        availability?: any;
    };
    rating: number;
    totalReviews: number;
    discount: number;
    isFeatured: boolean;
    thumbnailUrl?: string;
    status?: 'draft' | 'pending_review' | 'archived' | 'published';
    createdAt: string;
    updatedAt: string;
    enrollment?: {
        current: number;
        capacity: number;
    };
}

export interface Cohort {
    name: string;
    isActive: boolean;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    startTime: string;
    endTime: string;
    repeatPattern: string;
    daysOfWeek: string[];
    customLessonTimes: boolean;
    minimumStudents: number;
    maximumStudents: number;
    currentStudents: number;
    enrollmentDeadline: string; // ISO date string
    price: number;
    discount: number;
    classDates: string[]; // Probably ISO date strings
    _id: string;
};

export interface ClassDetail extends Class {
    description: string;
    curriculum: string;
    curriculumLevel: string;
    numberOfLessons: number;
    summary: string;
    technicalRequirements: never[];
    materials: never[];
    lessonPlans: never[];
    teachingTeam?: {
        id: string;
        name: string;
    }[];
    cohorts?: Cohort[];
    isPublished: boolean;
    enrolledStudents?: number;
    enableMultipleCohorts: boolean;
    enableTeamTeaching: boolean;
    isPublic: boolean;
    ageRange: string;
    subject: string;
    type: string;
    gradeLevel: string;
    tags: string[];
    media: {
        thumbnailUrl?: string;
        introVideoUrl?: string;
    };
    reviews: Review[];
    status?: 'draft' | 'pending_review' | 'archived' | 'published';
    studentsList?: {
        _id: string;
        fullName: string;
        profileImage?: string;
        numberOfSharedClasses?: number;
        shared?: number;
    }[];
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
    create: (classData: any): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>('/classes', classData);
    },

    getAll: (): Promise<ApiResponse<Class[]>> => {
        return api.get<Class[]>('/classes');
    },

    getById: (classId: string): Promise<ApiResponse<ClassDetail>> => {
        return api.get<ClassDetail>(`/classes/${classId}`);
    },

    update: (classId: string, data: any): Promise<ApiResponse<ClassDetail>> => {
        return api.patch<ClassDetail>(`/classes/${classId}`, data);
    },

    delete: (classId: string): Promise<ApiResponse<any>> => {
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

    updateStatus: (classId: string, status: 'draft' | 'pending_review' | 'archived' | 'published'): Promise<ApiResponse<ClassDetail>> => {
        return api.patch<ClassDetail>(`/classes/${classId}/status`, { status });
    },

    submitForReview: (classId: string): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/submit-review`, {});
    },

    archive: (classId: string): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/archive`, {});
    },

    addTeachingTeamMember: (classId: string, teacherId: string): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/teaching-team/${teacherId}`, {});
    },

    removeTeachingTeamMember: (classId: string, teacherId: string): Promise<ApiResponse<any>> => {
        return api.delete<any>(`/classes/${classId}/teaching-team/${teacherId}`);
    },

    // Lesson plan operations
    getLessonPlans: (classId: string): Promise<ApiResponse<LessonPlan[]>> => {
        return api.get<LessonPlan[]>(`/classes/${classId}/lesson-plans`);
    },

    addLessonPlan: (classId: string, lessonPlan: LessonPlan): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/lesson-plans`, lessonPlan);
    },

    bulkAddLessonPlan: (classId: string, lessonPlans: LessonPlan[]): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/lesson-plans/bulk`, { lessonPlans });
    },

    updateLessonPlan: (classId: string, lessonIndex: number, lessonPlan: LessonPlan): Promise<ApiResponse<ClassDetail>> => {

        return api.patch<ClassDetail>(`/classes/${classId}/lesson-plans/${lessonIndex}`, lessonPlan);
    },

    updateLessonPlanById: (classId: string, lessonPlanId: string, lessonPlan: any): Promise<ApiResponse<ClassDetail>> => {
        return api.patch<ClassDetail>(`/classes/${classId}/lesson-plans/${lessonPlanId}`, lessonPlan);
    },

    removeLessonPlan: (classId: string, lessonIndex: number): Promise<ApiResponse<any>> => {
        return api.delete<any>(`/classes/${classId}/lesson-plans/${lessonIndex}`);
    },

    markLessonComplete: (classId: string, lessonIndex: number): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/lesson-plans/${lessonIndex}/complete`, {});
    },

    addResourceLink: (classId: string, lessonIndex: number, resourceLink: ResourceLink): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/lesson-plans/${lessonIndex}/resource-links`, resourceLink);
    },

    removeResourceLink: (classId: string, lessonIndex: number, linkIndex: number): Promise<ApiResponse<any>> => {
        return api.delete<any>(`/classes/${classId}/lesson-plans/${lessonIndex}/resource-links/${linkIndex}`);
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

    getRecommended: (studentId: string): Promise<ApiResponse<ClassDetail[]>> => {
        return api.get<ClassDetail[]>(`/classes/recommended/${studentId}`);
    },

    // Student-focused operations
    getCurrentClassesForStudent: (studentId: string): Promise<ApiResponse<any[]>> => {
        return api.get<any[]>(`/classes/student/${studentId}/current`);
    },

    getCompletedClassesForStudent: (studentId: string): Promise<ApiResponse<any[]>> => {
        return api.get<any[]>(`/classes/student/${studentId}/completed`);
    },

    getMaterials: (classId: string): Promise<ApiResponse<any>> => {
        return api.get<any>(`/classes/${classId}/materials`);
    },

    getProgress: (classId: string): Promise<ApiResponse<ClassProgress>> => {
        return api.get<ClassProgress>(`/classes/${classId}/progress`);
    },

    // Review operations
    addReview: (classId: string, rating: number, comment?: string): Promise<ApiResponse<any>> => {
        return api.post<any>(`/classes/${classId}/reviews`, { rating, comment });
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
    },

    addCohort: (classId: string, cohortData: any): Promise<ApiResponse<ClassDetail>> => {
        return api.post<ClassDetail>(`/classes/${classId}/cohorts`, cohortData);
    },

    updateCohort: (classId: string, cohortId: string, cohortData: any): Promise<ApiResponse<ClassDetail>> => {
        return api.patch<ClassDetail>(`/classes/${classId}/cohorts/${cohortId}`, cohortData);
    }
};