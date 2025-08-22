import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { assignmentService, AssignmentFilters, AssignmentSubmission } from '../integrations/api/services/assignment.service';

const queryClient = new QueryClient();

// Assignment Query Keys
const assignmentQueryKeys = {
  all: ['assignments'] as const,
  byClass: (classId: string) => [...assignmentQueryKeys.all, 'class', classId] as const,
  upcoming: (classId: string) => [...assignmentQueryKeys.byClass(classId), 'upcoming'] as const,
  studentAssignments: (filters?: AssignmentFilters) => [...assignmentQueryKeys.all, 'student', filters] as const,
  studentByClass: (classId: string, filters?: Partial<AssignmentFilters>) => [...assignmentQueryKeys.all, 'student', classId, filters] as const,
  assignment: (assignmentId: string) => [...assignmentQueryKeys.all, assignmentId] as const,
  progress: (assignmentId: string) => [...assignmentQueryKeys.assignment(assignmentId), 'progress'] as const,
  analytics: (assignmentId: string) => [...assignmentQueryKeys.assignment(assignmentId), 'analytics'] as const,
  classAnalytics: (classId: string) => [...assignmentQueryKeys.byClass(classId), 'analytics'] as const,
} as const;

// Get assignments for a specific class
export const useGetAssignmentsByClass = (classId: string, filters?: Partial<AssignmentFilters>) => {
  return useQuery({
    queryKey: assignmentQueryKeys.byClass(classId),
    queryFn: () => assignmentService.getAssignmentsByClass(classId, filters),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};

// Get upcoming assignments for a class
export const useGetUpcomingAssignments = (classId: string, limit?: number) => {
  return useQuery({
    queryKey: assignmentQueryKeys.upcoming(classId),
    queryFn: () => assignmentService.getUpcomingAssignments(classId, limit),
    enabled: !!classId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2
  });
};

// Get assignments for the current student
export const useGetStudentAssignments = (filters?: AssignmentFilters) => {
  return useQuery({
    queryKey: assignmentQueryKeys.studentAssignments(filters),
    queryFn: () => assignmentService.getStudentAssignments(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};

// Get student assignments for a specific class
export const useGetStudentAssignmentsByClass = (classId: string, filters?: Partial<AssignmentFilters>) => {
  return useQuery({
    queryKey: assignmentQueryKeys.studentByClass(classId, filters),
    queryFn: () => assignmentService.getStudentAssignmentsByClass(classId, filters),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};

// Get a specific assignment by ID
export const useGetAssignmentById = (assignmentId: string) => {
  return useQuery({
    queryKey: assignmentQueryKeys.assignment(assignmentId),
    queryFn: () => assignmentService.getAssignmentById(assignmentId),
    enabled: !!assignmentId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2
  });
};

// Get student progress on a specific assignment
export const useGetAssignmentProgress = (assignmentId: string) => {
  return useQuery({
    queryKey: assignmentQueryKeys.progress(assignmentId),
    queryFn: () => assignmentService.getAssignmentProgress(assignmentId),
    enabled: !!assignmentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2
  });
};

// Submit assignment mutation
export const useSubmitAssignment = () => {
  return useMutation({
    mutationFn: (submission: AssignmentSubmission) => assignmentService.submitAssignment(submission),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: assignmentQueryKeys.progress(variables.assignmentId) });
      queryClient.invalidateQueries({ queryKey: assignmentQueryKeys.studentAssignments() });
    }
  });
};

// Update submission mutation
export const useUpdateSubmission = () => {
  return useMutation({
    mutationFn: ({ studentAssignmentId, data }: { studentAssignmentId: string; data: Partial<AssignmentSubmission> }) =>
      assignmentService.updateSubmission(studentAssignmentId, data),
    onSuccess: (result) => {
      // Invalidate relevant queries
      if (result.data?.assignment) {
        queryClient.invalidateQueries({ queryKey: assignmentQueryKeys.progress(result.data.assignment._id) });
      }
      queryClient.invalidateQueries({ queryKey: assignmentQueryKeys.studentAssignments() });
    }
  });
};

// Resubmit assignment mutation
export const useResubmitAssignment = () => {
  return useMutation({
    mutationFn: (data: AssignmentSubmission & { resubmissionReason?: string }) => 
      assignmentService.resubmitAssignment(data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: assignmentQueryKeys.progress(variables.assignmentId) });
      queryClient.invalidateQueries({ queryKey: assignmentQueryKeys.studentAssignments() });
    }
  });
};

// Get assignment analytics
export const useGetAssignmentAnalytics = (assignmentId: string) => {
  return useQuery({
    queryKey: assignmentQueryKeys.analytics(assignmentId),
    queryFn: () => assignmentService.getAssignmentAnalytics(assignmentId),
    enabled: !!assignmentId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2
  });
};

// Get class assignment analytics
export const useGetClassAssignmentAnalytics = (classId: string) => {
  return useQuery({
    queryKey: assignmentQueryKeys.classAnalytics(classId),
    queryFn: () => assignmentService.getClassAssignmentAnalytics(classId),
    enabled: !!classId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2
  });
};