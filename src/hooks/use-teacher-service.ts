import { useQuery, useMutation } from '@tanstack/react-query';
import { teacherService } from '../integrations/api/services/teacher.service';
import { QueryClient } from '@tanstack/react-query';
import { useTeacherId } from './useTeacherId';

const queryClient = new QueryClient();

// Profile Management Hooks
export const useCreateTeacherProfile = () => {
  return useMutation({
    mutationFn: (data: any) => teacherService.createProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfiles'] });
    },
  });
};

export const useGetAllTeacherProfiles = () => {
  return useQuery({
    queryKey: ['teacherProfiles'],
    queryFn: () => teacherService.getAllProfiles(),
  });
};

export const useGetCurrentTeacherProfile = () => {
  const { teacherId } = useTeacherId(); // Get the teacherId from the custom hook
  return useQuery({
    queryKey: ['currentTeacherProfile', teacherId], // Make query key dependent on teacherId
    queryFn: () => teacherService.getCurrentProfile(),
    enabled: !!teacherId, // Only enable the query if teacherId is available
  });
};

export const useGetTeacherProfileById = (id: string) => {
  return useQuery({
    queryKey: ['teacherProfile', id],
    queryFn: () => teacherService.getProfileById(id),
  });
};

export const useUpdateTeacherProfile = (id: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.updateProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfile', id] });
    },
  });
};

export const useDeleteTeacherProfile = (id: string) => {
  return useMutation({
    mutationFn: () => teacherService.deleteProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfiles'] });
    },
  });
};

export const useGetTeacherProfileByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['teacherProfileByUser', userId],
    queryFn: () => teacherService.getProfileByUserId(userId),
  });
};

// Education Management Hooks
export const useAddEducation = (teacherProfileId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.addEducation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfile', teacherProfileId] });
    },
  });
};

export const useGetEducation = (id: string) => {
  return useQuery({
    queryKey: ['education', id],
    queryFn: () => teacherService.getEducation(id),
  });
};

export const useUpdateEducation = (id: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education', id] });
    },
  });
};

export const useDeleteEducation = (id: string) => {
  return useMutation({
    mutationFn: () => teacherService.deleteEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education', id] });
    },
  });
};

// Experience Management Hooks
export const useAddExperience = (teacherProfileId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.addExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfile', teacherProfileId] });
    },
  });
};

export const useGetExperience = (id: string) => {
  return useQuery({
    queryKey: ['experience', id],
    queryFn: () => teacherService.getExperience(id),
  });
};

export const useGetTeacherExperiences = (teacherId: string) => {
  return useQuery({
    queryKey: ['teacherExperiences', teacherId],
    queryFn: () => teacherService.getTeacherExperiences(teacherId),
  });
};

export const useUpdateExperience = (id: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.updateExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience', id] });
    },
  });
};

export const useDeleteExperience = (id: string, teacherId: string) => {
  return useMutation({
    mutationFn: () => teacherService.deleteExperience(id, teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience', id] });
    },
  });
};

// Subject Management Hooks
export const useAddAcademicSubject = (teacherProfileId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.addAcademicSubject(teacherProfileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfile', teacherProfileId] });
    },
  });
};

export const useUpdateAcademicSubject = (teacherProfileId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.updateAcademicSubject(teacherProfileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfile', teacherProfileId] });
    },
  });
};

export const useDeleteAcademicSubject = (teacherId: string, id: string) => {
  return useMutation({
    mutationFn: () => teacherService.deleteAcademicSubject(teacherId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfile', teacherId] });
    },
  });
};

export const useAddOutOfSchoolSubject = (teacherProfileId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.addOutOfSchoolSubject(teacherProfileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfile', teacherProfileId] });
    },
  });
};

export const useUpdateOutOfSchoolSubject = (teacherProfileId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.updateOutOfSchoolSubject(teacherProfileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfile', teacherProfileId] });
    },
  });
};

export const useDeleteOutOfSchoolSubject = (teacherId: string, id: string) => {
  return useMutation({
    mutationFn: () => teacherService.deleteOutOfSchoolSubject(teacherId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfile', teacherId] });
    },
  });
};

// Teaching Strategy Hooks
export const useGetTeachingStrategies = (teacherId: string) => {
  return useQuery({
    queryKey: ['teachingStrategies', teacherId],
    queryFn: () => teacherService.getTeachingStrategies(teacherId),
  });
};

export const useGetTeachingStrategy = (teacherId: string, id: string) => {
  return useQuery({
    queryKey: ['teachingStrategy', teacherId, id],
    queryFn: () => teacherService.getTeachingStrategy(teacherId, id),
  });
};

export const useAddTeachingStrategy = (teacherId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.addTeachingStrategy(teacherId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachingStrategies', teacherId] });
    },
  });
};

export const useUpdateTeachingStrategy = (teacherId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.updateTeachingStrategy(teacherId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachingStrategies', teacherId] });
    },
  });
};

export const useDeleteTeachingStrategy = (teacherId: string, id: string) => {
  return useMutation({
    mutationFn: () => teacherService.deleteTeachingStrategy(teacherId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachingStrategies', teacherId] });
    },
  });
};

// Language Expertise Hooks
export const useGetLanguageExpertise = (teacherId: string) => {
  return useQuery({
    queryKey: ['languageExpertise', teacherId],
    queryFn: () => teacherService.getLanguageExpertise(teacherId),
  });
};

export const useAddLanguageExpertise = (teacherId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.addLanguageExpertise(teacherId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languageExpertise', teacherId] });
    },
  });
};

export const useUpdateLanguageExpertise = (teacherId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.updateLanguageExpertise(teacherId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languageExpertise', teacherId] });
    },
  });
};

export const useDeleteLanguageExpertise = (teacherId: string, id: string) => {
  return useMutation({
    mutationFn: () => teacherService.deleteLanguageExpertise(teacherId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languageExpertise', teacherId] });
    },
  });
};

// Technical Skills Hooks
export const useGetTechnicalSkills = (teacherId: string) => {
  return useQuery({
    queryKey: ['technicalSkills', teacherId],
    queryFn: () => teacherService.getTechnicalSkills(teacherId),
  });
};

export const useAddTechnicalSkill = (teacherId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.addTechnicalSkills(teacherId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicalSkills', teacherId] });
    },
  });
};

export const useUpdateTechnicalSkill = (teacherId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.updateTechnicalSkill(teacherId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicalSkills', teacherId] });
    },
  });
};

export const useDeleteTechnicalSkill = (teacherId: string, skillId: string) => {
  return useMutation({
    mutationFn: () => teacherService.deleteTechnicalSkill(teacherId, skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicalSkills', teacherId] });
    },
  });
};

// Teaching Methodology Hooks
export const useGetTeachingMethodologies = (teacherId: string) => {
  return useQuery({
    queryKey: ['teachingMethodologies', teacherId],
    queryFn: () => teacherService.getTeachingMethology(teacherId),
  });
};

export const useAddTeachingMethodology = (teacherId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.addTeachingMethodology(teacherId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachingMethodologies', teacherId] });
    },
  });
};

export const useUpdateTeachingMethodology = (teacherId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.updateTeachingMethodology(teacherId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachingMethodologies', teacherId] });
    },
  });
};

export const useDeleteTeachingMethodology = (teacherId: string, methodologyId: string) => {
  return useMutation({
    mutationFn: () => teacherService.deleteTeachingMethodology(teacherId, methodologyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachingMethodologies', teacherId] });
    },
  });
};

// Certification Hooks
export const useGetCertifications = (teacherId: string) => {
  return useQuery({
    queryKey: ['certifications', teacherId],
    queryFn: () => teacherService.getCertifications(teacherId),
  });
};

export const useGetCertification = (teacherId: string, id: string) => {
  return useQuery({
    queryKey: ['certification', teacherId, id],
    queryFn: () => teacherService.getCertification(teacherId, id),
  });
};

export const useAddCertification = (teacherId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.addCertification(teacherId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications', teacherId] });
    },
  });
};

export const useUpdateCertification = (teacherId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.updateCertification(teacherId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications', teacherId] });
    },
  });
};

export const useDeleteCertification = (teacherId: string, certificationId: string) => {
  return useMutation({
    mutationFn: () => teacherService.deleteCertification(teacherId, certificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications', teacherId] });
    },
  });
};

// Document Management Hooks
export const useUploadVerificationFile = (teacherId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.uploadVerificationFile(teacherId, data.documentType, data.base64File),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfile', teacherId] });
    },
  });
};

export const useGetDocumentSignedUrl = (teacherId: string, documentType: string) => {
  return useQuery({
    queryKey: ['documentSignedUrl', teacherId, documentType],
    queryFn: () => teacherService.getDocumentSignedUrl(teacherId, documentType as any),
  });
};

export const useGetDocumentViewUrl = (teacherId: string, documentType: string) => {
  return useQuery({
    queryKey: ['documentViewUrl', teacherId, documentType],
    queryFn: () => teacherService.getDocumentViewUrl(teacherId, documentType as any),
  });
};

export const useUpdateVerificationStatus = (teacherId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.updateVerificationStatus(teacherId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfile', teacherId] });
    },
  });
};

// Profile Photo Management
export const useUploadProfilePhoto = (teacherId: string) => {
  return useMutation({
    mutationFn: (data: any) => teacherService.uploadProfilePhoto(teacherId, data.base64File, data.mimeType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfile', teacherId] });
    },
  });
};

// AI Class Recommendation Hooks
export const useGenerateRecommendations = () => {
  return useMutation({
    mutationFn: () => teacherService.generateRecommendations(),
  });
};

export const useGetPendingRecommendations = () => {
  return useQuery({
    queryKey: ['pendingRecommendations'],
    queryFn: () => teacherService.getPendingRecommendations(),
  });
};

export const useAdoptRecommendation = () => {
  return useMutation({
    mutationFn: (data: any) => teacherService.adoptRecommendation(data.recommendationId, data.classId),
  });
};

export const useDismissRecommendation = () => {
  return useMutation({
    mutationFn: (data: any) => teacherService.dismissRecommendation(data.recommendationId, data.reason),
  });
};

// Custom Class Generation
export const useGenerateCustomClass = () => {
  return useMutation({
    mutationFn: (data: any) => teacherService.generateCustomClass(data.prompt),
  });
};
