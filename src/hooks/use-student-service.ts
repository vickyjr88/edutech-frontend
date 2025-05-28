import { useQuery, useMutation } from '@tanstack/react-query';
import { studentService } from '../integrations/api/services/student.service';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const useGetProfileById = (studentId: string) => {
  return useQuery({
    queryKey: ['studentProfile', studentId],
    queryFn: () => studentService.getProfile(studentId),
  });
};

export const useDashboardStats = (studentId: string) => {
  return useQuery({
    queryKey: ['dashboardStats', studentId],
    queryFn: () => studentService.getDashboardStats(studentId),
  });
};

export const useTodaysLessons = (studentId: string) => {
  return useQuery({
    queryKey: ['todaysLessons', studentId],
    queryFn: () => studentService.getTodaysLessons(studentId),
  });
};

export const useJoinClass = (studentId: string) => {
  return useMutation({
    mutationFn: (classId: string) => studentService.joinClass(studentId, classId),
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
