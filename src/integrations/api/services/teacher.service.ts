// src/api/services/teacher.service.ts
import { api, ApiResponse } from '../client';
import {
    AcademicSubjectItem,
    AfterSchoolSubjectItem,
    EducationItem,
    ExperienceItem, LanguageItem, MethodologyItem, StrategyItem, TechnicalSkillItem
} from "@/components/teacher/professional-profile";

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
        return api.post<Education>(`/teachers/${data.teacherProfile}/education`, data);
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
    updateEducation: (id: string, data: Partial<Education>): Promise<ApiResponse<Education>> => {
        return api.patch<Education>(`/teachers/education/${id}`, data);
    },

    deleteEducation: (id: string): Promise<ApiResponse<{ success: boolean }>> => {
        return api.delete<{ success: boolean }>(`/teachers/education/${id}`);
    },

    // Experience Management
    addExperience: (data: Experience): Promise<ApiResponse<Experience>> => {
        return api.post<Experience>('/teachers/experience', data);
    },

    getExperience: (id: string): Promise<ApiResponse<Experience>> => {
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
        return api.patch<Experience>(`/teachers/experience/${id}`, data);
    },

    deleteExperience: (id: string): Promise<ApiResponse<{ success: boolean }>> => {
        return api.delete<{ success: boolean }>(`/teachers/experience/${id}`);
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
        return api.get<any[]>(`/teachers/${teacherId}/strategies`);
    },
    getTeachingStrategy: (teacherId: string, id:string): Promise<ApiResponse<any[]>> => {
        return api.get<any[]>(`/teachers/${teacherId}/strategies/${id}`);
    },
    addTeachingStrategy: (teacherId: string, teachingStrategy: Partial<StrategyItem>): Promise<ApiResponse<any[]>> => {
        return api.post<any[]>(`/teachers/${teacherId}/strategies`,
            teachingStrategy);
    },
    updateTeachingStrategy: (teacherId: string, teachingStrategy: StrategyItem): Promise<ApiResponse<any[]>> => {
        return api.patch<any[]>(`/teachers/${teacherId}/strategies/${teachingStrategy.id}`,
            teachingStrategy);
    },
    deleteTeachingStrategy: (teacherId: string, id: string): Promise<ApiResponse<any[]>> => {
        return api.delete<any[]>(`/teachers/${teacherId}/strategies/${id}`);
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