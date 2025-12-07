// src/integrations/api/services/achievement.service.ts
import { api, ApiResponse } from '../client';

export enum AchievementCategory {
    ACADEMIC = 'Academic',
    PARTICIPATION = 'Participation',
    COMPLETION = 'Completion',
    STREAK = 'Streak',
    SKILL = 'Skill',
    SPECIAL = 'Special',
}

export interface Achievement {
    _id: string;
    name: string;
    description: string;
    category: AchievementCategory;
    icon: string;
    isNew: boolean;
    isFeatured: boolean;
    xpReward: number;
    requirementType?: string;
    requirementValue?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface StudentAchievement {
    _id: string;
    student: string;
    achievement: Achievement;
    earnedAt: string;
}

export interface AchievementSummary {
    totalAchievements: number;
    unlockedAchievements: number;
    totalXP: number;
    levelInfo: {
        current: number;
        xpForNext: number;
        currentXP: number;
        title: string;
    };
    streak: number;
}

export const achievementService = {
    // Get all available achievements
    getAllAchievements: (category?: AchievementCategory): Promise<ApiResponse<Achievement[]>> => {
        const query = category ? `?category=${category}` : '';
        return api.get<Achievement[]>(`/achievements${query}`);
    },

    // Get a single achievement by ID
    getAchievement: (achievementId: string): Promise<ApiResponse<Achievement>> => {
        return api.get<Achievement>(`/achievements/${achievementId}`);
    },

    // Get achievements earned by a student
    getStudentAchievements: (studentId: string): Promise<ApiResponse<StudentAchievement[]>> => {
        return api.get<StudentAchievement[]>(`/achievements/students/${studentId}`);
    },

    // Get recent achievements for a student
    getRecentAchievements: (studentId: string, limit?: number): Promise<ApiResponse<StudentAchievement[]>> => {
        const query = limit ? `?limit=${limit}` : '';
        return api.get<StudentAchievement[]>(`/achievements/students/${studentId}/recent${query}`);
    },

    // Award an achievement to a student
    awardAchievement: (studentId: string, achievementId: string): Promise<ApiResponse<StudentAchievement>> => {
        return api.post<StudentAchievement>('/achievements/award', {
            studentId,
            achievementId
        });
    },

    // Create a new achievement (admin only)
    createAchievement: (data: Partial<Achievement>): Promise<ApiResponse<Achievement>> => {
        return api.post<Achievement>('/achievements', data);
    },

    // Update an achievement (admin only)
    updateAchievement: (achievementId: string, data: Partial<Achievement>): Promise<ApiResponse<Achievement>> => {
        return api.put<Achievement>(`/achievements/${achievementId}`, data);
    },

    // Delete an achievement (admin only)
    deleteAchievement: (achievementId: string): Promise<ApiResponse<Achievement>> => {
        return api.delete<Achievement>(`/achievements/${achievementId}`);
    }
};
