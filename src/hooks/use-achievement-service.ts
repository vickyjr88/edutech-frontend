import { useQuery, useMutation } from '@tanstack/react-query';
import { achievementService, AchievementCategory } from '../integrations/api/services/achievement.service';
import { QueryClient } from '@tanstack/react-query';
import { useStudentId } from './useStudentId';

const queryClient = new QueryClient();

// Get all achievements (optionally filtered by category)
export const useGetAllAchievements = (category?: AchievementCategory) => {
    return useQuery({
        queryKey: ['achievements', category],
        queryFn: () => achievementService.getAllAchievements(category),
    });
};

// Get a single achievement by ID
export const useGetAchievement = (achievementId: string) => {
    return useQuery({
        queryKey: ['achievement', achievementId],
        queryFn: () => achievementService.getAchievement(achievementId),
        enabled: !!achievementId,
    });
};

// Get achievements for the current student
export const useCurrentStudentAchievements = () => {
    const { studentId } = useStudentId();
    return useQuery({
        queryKey: ['studentAchievements', studentId],
        queryFn: () => achievementService.getStudentAchievements(studentId!),
        enabled: !!studentId,
    });
};

// Get achievements for a specific student
export const useStudentAchievements = (studentId: string) => {
    return useQuery({
        queryKey: ['studentAchievements', studentId],
        queryFn: () => achievementService.getStudentAchievements(studentId),
        enabled: !!studentId,
    });
};

// Get recent achievements for the current student
export const useCurrentRecentAchievements = (limit?: number) => {
    const { studentId } = useStudentId();
    return useQuery({
        queryKey: ['recentAchievements', studentId, limit],
        queryFn: () => achievementService.getRecentAchievements(studentId!, limit),
        enabled: !!studentId,
    });
};

// Get recent achievements for a specific student
export const useRecentAchievements = (studentId: string, limit?: number) => {
    return useQuery({
        queryKey: ['recentAchievements', studentId, limit],
        queryFn: () => achievementService.getRecentAchievements(studentId, limit),
        enabled: !!studentId,
    });
};

// Award an achievement to a student (mutation)
export const useAwardAchievement = () => {
    return useMutation({
        mutationFn: ({ studentId, achievementId }: { studentId: string; achievementId: string }) =>
            achievementService.awardAchievement(studentId, achievementId),
        onSuccess: (data, variables) => {
            // Invalidate relevant queries to refetch data
            queryClient.invalidateQueries({ queryKey: ['studentAchievements', variables.studentId] });
            queryClient.invalidateQueries({ queryKey: ['recentAchievements', variables.studentId] });
        },
    });
};

// Create a new achievement (admin only)
export const useCreateAchievement = () => {
    return useMutation({
        mutationFn: (data: any) => achievementService.createAchievement(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['achievements'] });
        },
    });
};

// Update an achievement (admin only)
export const useUpdateAchievement = () => {
    return useMutation({
        mutationFn: ({ achievementId, data }: { achievementId: string; data: any }) =>
            achievementService.updateAchievement(achievementId, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['achievements'] });
            queryClient.invalidateQueries({ queryKey: ['achievement', variables.achievementId] });
        },
    });
};

// Delete an achievement (admin only)
export const useDeleteAchievement = () => {
    return useMutation({
        mutationFn: (achievementId: string) => achievementService.deleteAchievement(achievementId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['achievements'] });
        },
    });
};
