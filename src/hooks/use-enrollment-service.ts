import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { enrollmentService } from '../integrations/api/services/enrollment.service';
import { SelfEnrollmentRequest } from '../integrations/api/services/enrollment.service';
const queryClient = new QueryClient();
// Enrollment Query Keys
const enrollmentQueryKeys = {
  studentEnrollments: (studentId: string) => ['enrollments', 'student', studentId],
  studentCurrentEnrollments: (studentId: string) => ['enrollments', 'student', studentId, 'current'],
  studentPendingEnrollments: (studentId: string) => ['enrollments', 'student', studentId, 'pending'],
  classEnrollments: (classId: string) => ['enrollments', 'class', classId],
  enrollment: (enrollmentId: string) => ['enrollments', enrollmentId]
} as const;

// Get Student Enrollments
export const useGetStudentEnrollments = (studentId: string) => {
  return useQuery({
    queryKey: enrollmentQueryKeys.studentEnrollments(studentId),
    queryFn: () => enrollmentService.getStudentEnrollments(studentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};

// Get Student Current Enrollments
export const useGetStudentCurrentEnrollments = (studentId: string) => {
  return useQuery({
    queryKey: enrollmentQueryKeys.studentCurrentEnrollments(studentId),
    queryFn: () => enrollmentService.getStudentCurrentEnrollments(studentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};

// Get Student Pending Enrollments
export const useGetStudentPendingEnrollments = (studentId: string) => {
  return useQuery({
    queryKey: enrollmentQueryKeys.studentPendingEnrollments(studentId),
    queryFn: () => enrollmentService.getStudentPendingEnrollments(studentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};

// Get Class Enrollments
export const useGetClassEnrollments = (classId: string) => {
  return useQuery({
    queryKey: enrollmentQueryKeys.classEnrollments(classId),
    queryFn: () => enrollmentService.getClassEnrollments(classId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};

// Self Enroll Mutation
export const useSelfEnroll = () => {
  return useMutation({
    mutationFn: (data: SelfEnrollmentRequest) => enrollmentService.selfEnroll(data),
    onSuccess: (_, data) => {
      // Invalidate queries after successful enrollment
      const { classId } = data;
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'class', classId] });
    }
  });
};

// Update Enrollment Status Mutation
export const useUpdateEnrollmentStatus = () => {
  return useMutation({
    mutationFn: ({ enrollmentId, status }: { enrollmentId: string; status: string }) =>
      enrollmentService.updateEnrollmentStatus(enrollmentId, status),
    onSuccess: (_, { enrollmentId }) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', enrollmentId] });
    }
  });
};
