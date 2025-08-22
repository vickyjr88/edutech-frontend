import { useQuery, useMutation } from '@tanstack/react-query';
import { classService } from '../integrations/api/services/class.service';
import { QueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient();

// Class Management Hooks
export const useCreateClass = () => {
  return useMutation({
    mutationFn: (classData: never) => classService.create(classData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

export const useGetAllClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: () => classService.getAll(),
  });
};

export const useClassById = (classId: string) => {
  return useQuery({
    queryKey: ['class', classId],
    queryFn: () => classService.getById(classId),
  });
};

export const useUpdateClass = (classId: string) => {
  return useMutation({
    mutationFn: (data: never) => classService.update(classId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class", classId] });
    },
  });
};

export const useDeleteClass = (classId: string) => {
  return useMutation({
    mutationFn: () => classService.delete(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

// Teacher-specific Hooks
export const useGetTeacherClasses = (teacherId: string) => {
  return useQuery({
    queryKey: ['teacherClasses', teacherId],
    queryFn: () => classService.getTeacherClasses(teacherId),
  });
};

export const usePublishClass = (classId: string) => {
  return useMutation({
    mutationFn: () => classService.publish(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class", classId] });
    },
  });
};

export const useUnpublishClass = (classId: string) => {
  return useMutation({
    mutationFn: () => classService.unpublish(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class", classId] });
    },
  });
};

// Lesson Plan Hooks
export const useGetLessonPlans = (classId: string) => {
  return useQuery({
    queryKey: ['lessonPlans', classId],
    queryFn: () => classService.getLessonPlans(classId),
  });
};

export const useAddLessonPlan = (classId: string) => {
  return useMutation({
    mutationFn: (lessonPlan: any) => classService.addLessonPlan(classId, lessonPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class", classId] });
    },
  });
};

export const useUpdateLessonPlan = (classId: string, lessonIndex: number) => {
  return useMutation({
    mutationFn: (lessonPlan: any) => classService.updateLessonPlan(classId, lessonIndex, lessonPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class", classId] });
    },
  });
};

// Class Discovery Hooks
export const useSearchClasses = (params: any) => {
  return useQuery({
    queryKey: ['searchClasses', params],
    queryFn: () => classService.search(params),
  });
};

export const useBrowseClasses = (params: any) => {
  return useQuery({
    queryKey: ['browseClasses', params],
    queryFn: () => classService.browse(params),
  });
};

export const useGetFeaturedClasses = () => {
  return useQuery({
    queryKey: ['featuredClasses'],
    queryFn: () => classService.getFeatured(),
  });
};

export const useGetPopularClasses = () => {
  return useQuery({
    queryKey: ['popularClasses'],
    queryFn: () => classService.getPopular(),
  });
};

export const useGetRecommendedClasses = (studentId: string) => {
  return useQuery({
    queryKey: ['recommendedClasses', studentId],
    queryFn: () => classService.getRecommended(studentId),
  });
};

// Student-specific Hooks
export const useGetCurrentClassesForStudent = (studentId: string) => {
  return useQuery({
    queryKey: ['studentClasses', studentId],
    queryFn: () => classService.getCurrentClassesForStudent(studentId),
  });
};

export const useGetCompletedClassesForStudent = (studentId: string) => {
  return useQuery({
    queryKey: ['completedClasses', studentId],
    queryFn: () => classService.getCompletedClassesForStudent(studentId),
  });
};

// Review Hooks
export const useAddReview = (classId: string) => {
  return useMutation({
    mutationFn: (reviewData: { rating: number; comment?: string }) => 
      classService.addReview(classId, reviewData.rating, reviewData.comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class", classId] });
    },
  });
};

export const useGetReviews = (classId: string) => {
  return useQuery({
    queryKey: ['classReviews', classId],
    queryFn: () => classService.getReviews(classId),
  });
};
