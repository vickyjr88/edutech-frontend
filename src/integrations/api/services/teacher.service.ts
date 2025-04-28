// src/api/services/teacher.service.ts
import { api, ApiResponse } from '../client';
import {
    AcademicSubjectItem,
    AfterSchoolSubjectItem,
    EducationItem,
    ExperienceItem, LanguageItem, MethodologyItem, StrategyItem, TechnicalSkillItem
} from "@/components/teacher/professional-profile";
import {formatDateForDatabase} from "@/components/teacher/professional-profile/utils/educationUtils.ts";

export interface TeacherProfile {
    id: string;
    userId: string;
    education: Education[];
    experience: Experience[];
    strategies: string[];
    methodologies: string[];
    subjects: string[];
    skills: string[];
    languages: string[];
    certifications: string[];
    introVideoUrl?: string;
    isProfileComplete: boolean;
    rating: number;
    totalReviews: number;
    totalStudents: number;
    totalClasses: number;
    totalHours: number;
    [key: string]: any; // For any additional properties
}

export interface Education {
    id?: string;
    teacherProfile?: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date | string;
    endDate?: Date | string;
    isCurrentlyEnrolled?: boolean;
    grade?: string;
    activities?: string;
    description?: string;
}

export interface Experience {
    id?: string;
    teacherProfile?: string;
    position: string;
    institution: string;
    institutionType?: string;
    startDate: Date | string;
    endDate?: Date | string;
    isCurrentlyWorking?: boolean;
    curriculums?: string[];
    grades?: string[];
    subjects?: string[];
    reportingManager?: {
        name: string;
        phoneNumber: string;
    };
    additionalDetails?: string;
}
export interface TeachingStrategy{
    id?: string;
    teacherProfile?: string;
    name: string;
    description: string;
    isCertified: boolean;
}

export const teacherService = {
    // Teacher Profile CRUD
    createProfile: (data: Partial<TeacherProfile>): Promise<ApiResponse<TeacherProfile>> => {
        return api.post<TeacherProfile>('/teachers', data);
    },

    getAllProfiles: (): Promise<ApiResponse<TeacherProfile[]>> => {
        return api.get<TeacherProfile[]>('/teachers');
    },

    getCurrentProfile: (): Promise<ApiResponse<TeacherProfile>> => {
        return api.get<TeacherProfile>('/teachers/profile');
    },

    getProfileById: (id: string): Promise<ApiResponse<TeacherProfile>> => {
        return api.get<TeacherProfile>(`/teachers/${id}`);
    },

    updateProfile: (id: string, data: Partial<TeacherProfile>): Promise<ApiResponse<TeacherProfile>> => {
        return api.patch<TeacherProfile>(`/teachers/${id}`, data);
    },

    deleteProfile: (id: string): Promise<ApiResponse<{ success: boolean }>> => {
        return api.delete<{ success: boolean }>(`/teachers/${id}`);
    },

    getProfileByUserId: (userId: string): Promise<ApiResponse<TeacherProfile>> => {
        return api.get<TeacherProfile>(`/teachers/user/${userId}`);
    },

    // Education Management
    addEducation: (data: Education): Promise<ApiResponse<Education>> => {
        // Manually normalize the date format to ensure we don't get duplicate -01 days
        const normalizeDate = (dateStr: string): string => {
            if (!dateStr) return "";
            // Remove any existing -01 day that might have been added incorrectly
            const cleaned = dateStr.replace(/-01-01$/, "-01");
            
            // Ensure we have a YYYY-MM format
            const dateMatch = cleaned.match(/^(\d{4}-\d{2})(?:-\d{2})?$/);
            if (dateMatch) {
                return `${dateMatch[1]}-01`;
            }
            
            // If it's in another format, use formatDateForDatabase
            return formatDateForDatabase(dateStr);
        };
        
        const normalizedData = {
            ...data,
            startDate: normalizeDate(data.startDate as string),
            endDate: data.endDate ? normalizeDate(data.endDate as string) : null
        };
        
        return api.post<Education>(`/teachers/${data.teacherProfile}/education`, normalizedData);
    },

    getEducation: (id: string): Promise<ApiResponse<Education>> => {
        return api.get<Education>(`/teachers/education/${id}`);
    },
    getTeacherEducation: (teacherId: string): Promise<ApiResponse<EducationItem[]>> => {
        return api.get<EducationItem[]>(`/teachers/${teacherId}/education`, {
            params: {
                sort: '-createdAt'
            }
        });
    },
    updateEducation: (id: string, educationData: any): Promise<ApiResponse<Education>> => {
        // Manually normalize the date format to ensure we don't get duplicate -01 days
        const normalizeDate = (dateStr: string): string => {
            if (!dateStr) return "";
            // Remove any existing -01 day that might have been added incorrectly
            const cleaned = dateStr.replace(/-01-01$/, "-01");
            
            // Ensure we have a YYYY-MM format
            const dateMatch = cleaned.match(/^(\d{4}-\d{2})(?:-\d{2})?$/);
            if (dateMatch) {
                return `${dateMatch[1]}-01`;
            }
            
            // If it's in another format, use formatDateForDatabase
            return formatDateForDatabase(dateStr);
        };
        
        return api.patch<Education>(`/teachers/${educationData.teacherProfile}/education/${id}`, {
            institutionType: educationData.institutionType,
            institutionName: educationData.institution,
            degree: educationData.degree || null,
            additionalDetails: educationData.additionalDetails || null,
            startDate: normalizeDate(educationData.startDate),
            endDate: educationData.currentlyStudying
                ? null
                : (educationData.endDate ? normalizeDate(educationData.endDate) : null),
            isCurrentlyStudying: educationData.currentlyStudying
        });
    },

    deleteEducation: (id: string): Promise<ApiResponse<{ success: boolean }>> => {
        return api.delete<{ success: boolean }>(`/teachers/education/${id}`);
    },

    // Experience Management
    addExperience: (data: Experience): Promise<ApiResponse<Experience>> => {
        // Manually normalize the date format to ensure we don't get duplicate -01 days
        const normalizeDate = (dateStr: string): string => {
            if (!dateStr) return "";
            // Remove any existing -01 day that might have been added incorrectly
            const cleaned = dateStr.replace(/-01-01$/, "-01");
            
            // Ensure we have a YYYY-MM format
            const dateMatch = cleaned.match(/^(\d{4}-\d{2})(?:-\d{2})?$/);
            if (dateMatch) {
                return `${dateMatch[1]}-01`;
            }
            
            // If it's in another format, use formatDateForDatabase
            return formatDateForDatabase(dateStr);
        };
        
        const normalizedData = {
            ...data,
            startDate: normalizeDate(data.startDate as string),
            endDate: data.endDate ? normalizeDate(data.endDate as string) : null,
            // Use isCurrentlyWorking which is consistent with our frontend
            isCurrentlyWorking: data.isCurrentlyWorking,
            teacherProfile: data.teacherProfile,
            additionalDetails: data.additionalDetails
        };
        delete normalizedData['_id'];
        delete normalizedData['details'];
        // Use the pattern consistent with other endpoints: /teachers/:teacherId/experience
        return api.post<Experience>(`/teachers/${data.teacherProfile}/experience`, normalizedData);
    },

    getExperience: (id: string): Promise<ApiResponse<Experience>> => {
        // Note: We can't use the standard path format here because we don't know the teacherId
        // The backend should handle this special case to find the experience by ID
        return api.get<Experience>(`/teachers/experience/${id}`);
    },
    getTeacherExperiences: (teacherId: string): Promise<ApiResponse<ExperienceItem[]>> => {
        return api.get<ExperienceItem[]>(`/teachers/${teacherId}/experience`, {
            params: {
                sort: '-createdAt'
            }
        });
    },

    updateExperience: (id: string, data: Partial<Experience>): Promise<ApiResponse<Experience>> => {
        // Manually normalize the date format to ensure we don't get duplicate -01 days
        const normalizeDate = (dateStr: string): string => {
            if (!dateStr) return "";
            // Remove any existing -01 day that might have been added incorrectly
            const cleaned = dateStr.replace(/-01-01$/, "-01");
            
            // Ensure we have a YYYY-MM format
            const dateMatch = cleaned.match(/^(\d{4}-\d{2})(?:-\d{2})?$/);
            if (dateMatch) {
                return `${dateMatch[1]}-01`;
            }
            
            // If it's in another format, use formatDateForDatabase
            return formatDateForDatabase(dateStr);
        };
        
        const normalizedData = {
            ...data,
            startDate: data.startDate ? normalizeDate(data.startDate as string) : undefined,
            endDate: data.endDate ? normalizeDate(data.endDate as string) : null,
            // Use isCurrentlyWorking which is consistent with our frontend
            isCurrentlyWorking: data.isCurrentlyWorking !== undefined ? data.isCurrentlyWorking : undefined
        };
        delete normalizedData.teacherProfile;
        delete normalizedData.id;

        // Use the pattern consistent with other endpoints: /teachers/:teacherId/experience/:id
        return api.patch<Experience>(`/teachers/${data.teacherProfile}/experience/${id}`, normalizedData);
    },

    deleteExperience: (id: string, teacherId: string): Promise<ApiResponse<{ success: boolean }>> => {
        // Use the pattern consistent with other endpoints: /teachers/:teacherId/experience/:id
        return api.delete<{ success: boolean }>(`/teachers/${teacherId}/experience/${id}`);
    },

    // Additional helper methods
    isProfileComplete: async (userId: string): Promise<boolean> => {
        const { data, error } = await teacherService.getProfileByUserId(userId);
        if (error || !data) return false;
        return data.isProfileComplete;
    },

    getTeacherClasses: async (teacherId: string): Promise<ApiResponse<any[]>> => {
        return api.get<any[]>(`/classes/teacher/${teacherId}`);
    },

    getTeacherStudents: async (teacherId: string): Promise<ApiResponse<any[]>> => {
        return api.get<any[]>(`/teachers/${teacherId}/students`);
    },

    getTeacherStats: async (teacherId: string): Promise<ApiResponse<{
        totalStudents: number;
        totalClasses: number;
        totalHours: number;
        averageRating: number;
    }>> => {
        return api.get<any>(`/teachers/${teacherId}/stats`);
    },
    getTeacherAcademicSubjects: (teacherId: string): Promise<ApiResponse<any[]>> => {
        return api.get<any[]>(`/teachers/${teacherId}/subjects?academic=true`);
    },
    getTeacherAfterSchoolSubjects: (teacherId: string): Promise<ApiResponse<any[]>> => {
        return api.get<any[]>(`/teachers/${teacherId}/subjects?academic=false`);
    },
    addAcademicSubject: (teacherProfileId: string,data: Partial<AcademicSubjectItem>): Promise<ApiResponse<any>> => {
        return api.post<any[]>(`/teachers/${teacherProfileId}/subject`,
            {teacherProfile:teacherProfileId,...data});
    },
    updateAcademicSubject: (teacherProfileId: string,data: Partial<AcademicSubjectItem>): Promise<ApiResponse<any>> => {
        return api.patch<any[]>(`/teachers/${teacherProfileId}/subject/${data.id}`,
            {teacherProfile:teacherProfileId,...data});
    },
    deleteAcademicSubject: (teacherId,id: string): Promise<ApiResponse<any>> => {
        return api.delete<any[]>(`/teachers/${teacherId}/subject/${id}`);
    },
    addOutOfSchoolSubject: (teacherProfileId: string,data: Partial<AfterSchoolSubjectItem>): Promise<ApiResponse<any>> => {
        return api.post<any[]>(`/teachers/${teacherProfileId}/subject`,
            {teacherProfile:teacherProfileId,...data,academic:false});
    },
    updateOutOfSchoolSubject: (teacherProfileId: string,data: Partial<AfterSchoolSubjectItem>): Promise<ApiResponse<any>> => {
        return api.patch<any[]>(`/teachers/${teacherProfileId}/subject/${data.id}/?academic=false`,
            {teacherProfile:teacherProfileId,...data,academic:false});
    },
    deleteOutOfSchoolSubject: (teacherId:string,id: string): Promise<ApiResponse<any>> => {
        return api.delete<any[]>(`/teachers/${teacherId}/subject/${id}/?academic=false`);
    },
    //teacher teaching strategies
    getTeachingStrategies: (teacherId: string): Promise<ApiResponse<any[]>> => {
        return api.get<any[]>(`/teachers/${teacherId}/strategy`);
    },
    getTeachingStrategy: (teacherId: string, id:string): Promise<ApiResponse<any[]>> => {
        return api.get<any[]>(`/teachers/${teacherId}/strategy/${id}`);
    },
    addTeachingStrategy: (teacherId: string, teachingStrategy: Partial<StrategyItem>): Promise<ApiResponse<any[]>> => {
        return api.post<any[]>(`/teachers/${teacherId}/strategy`,
            {
                ...teachingStrategy,
                teacherProfile: teacherId,
            });
    },
    updateTeachingStrategy: (teacherId: string, teachingStrategy: StrategyItem): Promise<ApiResponse<any[]>> => {
        console.log("API call - teachingStrategy:", teachingStrategy);
        console.log("API call - ID:", teachingStrategy._id);
        // Ensure ID exists and is a string before using in URL
        const strategyId = teachingStrategy._id || "";
        console.log("Using strategy ID in URL:", strategyId);
        const updatedStrategy = {
            ...teachingStrategy
        }
        delete updatedStrategy._id;
        return api.patch<any[]>(`/teachers/${teacherId}/strategy/${strategyId}`,
            updatedStrategy);
    },
    deleteTeachingStrategy: (teacherId: string, id: string): Promise<ApiResponse<any[]>> => {
        return api.delete<any[]>(`/teachers/${teacherId}/strategy/${id}`);
    },
    //teacher language expertise
    getLanguageExpertise: (teacherId: string): Promise<ApiResponse<LanguageItem[]>> => {
        return api.get<any[]>(`/teachers/${teacherId}/languages`);
    },
    addLanguageExpertise: (teacherId: string, language: LanguageItem)=> {
        return api.post<any>(`/teachers/${teacherId}/languages`,
            {
                ...language,
                teacherProfile: teacherId,
            });
    },
    updateLanguageExpertise: (teacherId: string, language: LanguageItem): Promise<ApiResponse<LanguageItem>> => {
        return api.patch<LanguageItem>(`/teachers/${teacherId}/languages`,
            {
                ...language,
                teacherProfile: teacherId,
            });
    },
    deleteLanguageExpertise: (teacherId: string, id: string): Promise<ApiResponse<LanguageItem>> => {
        return api.delete<LanguageItem>(`/teachers/${teacherId}/languages/${id}`);
    },
    getTechnicalSkills:  (teacherId: string): Promise<ApiResponse<any[]>> => {
        return api.get<string[]>(`/teachers/${teacherId}/skills`);
    },
    addTechnicalSkills: (teacherId: string, skill: TechnicalSkillItem): Promise<ApiResponse<any>> => {
        return api.post<string[]>(`/teachers/${teacherId}/skills`,
            skill);
    },
    updateTechnicalSkill: (teacherId: string, skill: TechnicalSkillItem): Promise<ApiResponse<any>> => {
        return api.patch<string[]>(`/teachers/${teacherId}/skills/${skill.id}`,
            skill);
    },
    deleteTechnicalSkill: (teacherId: string, skillId: string): Promise<ApiResponse<any>> => {
        return api.delete<string[]>(`/teachers/${teacherId}/skills/${skillId}`);
    },
    //methodology apis
    getTeachingMethology: (teacherId: string): Promise<ApiResponse<any[]>> => {
        return api.get<string[]>(`/teachers/${teacherId}/methodologies`);
    },

    addTeachingMethodology: (teacherId: string, methodology: MethodologyItem): Promise<ApiResponse<any>> => {
        return api.post<string[]>(`/teachers/${teacherId}/methodologies`, {
            ...methodology,
            teacherProfile: teacherId,
        });
    },
    updateTeachingMethodology: (teacherId: string, methodology: MethodologyItem): Promise<ApiResponse<any>> => {
        return api.patch<string[]>(`/teachers/${teacherId}/methodologies/${methodology.id}`, methodology);
    },
    deleteTeachingMethodology: (teacherId: string, methodologyId: string): Promise<ApiResponse<any>> => {
        return api.delete<string[]>(`/teachers/${teacherId}/methodologies/${methodologyId}`);
    },
    
};