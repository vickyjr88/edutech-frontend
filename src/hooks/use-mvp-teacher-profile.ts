import { useQuery } from '@tanstack/react-query';
import MvpTeacherService, { MvpTeacherProfileResponse } from '../integrations/api/services/mvp-teacher.service';
import { useAuth } from '../contexts/AuthContext';

export const useGetMvpTeacherProfile = (userId?: string) => {
    const { user } = useAuth();
    const targetUserId = userId || user?.id;

    return useQuery({
        queryKey: ['mvpTeacherProfile', targetUserId],
        queryFn: async () => {
            if (userId) {
                return MvpTeacherService.getProfileByUserId(userId);
            }
            return MvpTeacherService.getCurrentProfile();
        },
        enabled: !!targetUserId,
    });
};
