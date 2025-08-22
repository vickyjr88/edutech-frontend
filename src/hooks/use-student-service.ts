import { useQuery, useMutation } from '@tanstack/react-query';
import { studentService } from '../integrations/api/services/student.service';
import { QueryClient } from '@tanstack/react-query';
import { useStudentId } from './useStudentId';

const queryClient = new QueryClient();

export const useGetCurrentStudentProfile = () => {
  const { studentId } = useStudentId(); // Get the studentId from the custom hook
  return useQuery({
    queryKey: ['currentStudentProfile', studentId], // Make query key dependent on studentId
    queryFn: () => studentService.getProfile(studentId!),
    enabled: !!studentId, // Only enable the query if studentId is available
  });
};

export const useGetProfileById = (studentId: string) => {
  return useQuery({
    queryKey: ['studentProfile', studentId],
    queryFn: () => studentService.getProfile(studentId),
    enabled: !!studentId,
  });
};

export const useCurrentDashboardStats = (studentId: string) => {
  return useQuery({
    queryKey: ['currentDashboardStats', studentId],
    queryFn: () => studentService.getDashboardStats(studentId!),
    enabled: !!studentId,
  });
};

export const useDashboardStats = (studentId: string) => {
  return useQuery({
    queryKey: ['dashboardStats', studentId],
    queryFn: () => studentService.getDashboardStats(studentId),
    enabled: !!studentId,
  });
};

export const useCurrentTodaysLessons = () => {
  const { studentId } = useStudentId();
  return useQuery({
    queryKey: ['currentTodaysLessons', studentId],
    queryFn: () => studentService.getTodaysLessons(studentId!),
    enabled: !!studentId,
  });
};

export const useTodaysLessons = (studentId: string) => {
  return useQuery({
    queryKey: ['todaysLessons', studentId],
    queryFn: () => studentService.getTodaysLessons(studentId),
    enabled: !!studentId, // This will prevent the query from running if studentId is falsy
  });
};

export const useJoinClass = (studentId: string) => {
  return useMutation({
    mutationFn: (classId: string) => studentService.joinClass(studentId, classId),
  });
};

export const useCurrentUpcomingSessions = () => {
  const { studentId } = useStudentId();
  return useQuery({
    queryKey: ['currentUpcomingSessions', studentId],
    queryFn: () => studentService.getUpcomingSessions(studentId!),
    enabled: !!studentId,
  });
};

export const useUpcomingSessions = (studentId: string) => {
  return useQuery({
    queryKey: ['upcomingSessions', studentId],
    queryFn: () => studentService.getUpcomingSessions(studentId),
    enabled: !!studentId,
  });
};

export const useUpdateStudentProfile = (studentId: string) => {
  return useMutation({
    mutationFn: (data: any) => studentService.updateProfile(studentId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["studentProfile", studentId] });
    },
  });
};

export const useRecentActivities = (userId: string) => {
  return useQuery({
    queryKey: ['recentActivities', userId],
    queryFn: () => studentService.getRecentActivities(userId!),
    enabled: !!userId, // Only enable the query if userId is available
  });
};
