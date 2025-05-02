// src/api/services/teacher.service.ts
import { api, ApiResponse } from '../client';
import {
    AcademicSubjectItem,
    AfterSchoolSubjectItem,
    CertificationItem,
    EducationItem,
    ExperienceItem, LanguageItem, MethodologyItem, StrategyItem, TechnicalSkillItem
} from "@/components/teacher/professional-profile";
import {formatDateForDatabase} from "@/components/teacher/professional-profile/utils/educationUtils.ts";

// Certification interface for API calls
export interface TeacherCertification {
    _id?: string;
    teacherProfile?: string;
    name: string;
    issuer: string;
    issueDate: Date | string;
    expiryDate?: Date | string;
    credentialId?: string;
    credentialUrl?: string;
    description?: string;
}

export interface TeacherProfile {
    id: string;
    userId: string;
    education: Education[];
    experience: Experience[];
    strategies: string[];
    methodologies: string[];
    subjects: object[];
    skills: object[];
    languages: object[];
    certifications: object[];
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

//Define certification endpoints
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
        // Delete properties that shouldn't be sent to the API
        delete normalizedData['_id'];
        delete normalizedData['details'];
        delete normalizedData['createdAt'];
        delete normalizedData['updatedAt'];
        delete normalizedData['__v'];
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
        // Delete properties that shouldn't be sent to the API
        delete normalizedData.teacherProfile;
        delete normalizedData.id;
        delete normalizedData._id;
        delete normalizedData.createdAt;
        delete normalizedData.updatedAt;
        delete normalizedData.__v;

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
        return api.get<any[]>(`/teachers/${teacherId}/subjects?isAcademic=true`);
    },
    getTeacherAfterSchoolSubjects: (teacherId: string): Promise<ApiResponse<any[]>> => {
        return api.get<any[]>(`/teachers/${teacherId}/subjects?isAcademic=false`);
    },
    addAcademicSubject: (teacherProfileId: string,data: Partial<AcademicSubjectItem>): Promise<ApiResponse<any>> => {
        return api.post<any[]>(`/teachers/${teacherProfileId}/subjects`,
            {teacherProfile:teacherProfileId,...data});
    },
    updateAcademicSubject: (teacherProfileId: string,data: Partial<AcademicSubjectItem>): Promise<ApiResponse<any>> => {
        return api.patch<any[]>(`/teachers/${teacherProfileId}/subjects/${data._id}`,
            {teacherProfile:teacherProfileId,...data});
    },
    deleteAcademicSubject: (teacherId,id: string): Promise<ApiResponse<any>> => {
        return api.delete<any[]>(`/teachers/${teacherId}/subjects/${id}`);
    },
    addOutOfSchoolSubject: (teacherProfileId: string,data: Partial<AfterSchoolSubjectItem>): Promise<ApiResponse<any>> => {
        return api.post<any[]>(`/teachers/${teacherProfileId}/subjects`,
            {teacherProfile:teacherProfileId,...data,isAcademic:false});
    },
    updateOutOfSchoolSubject: (teacherProfileId: string,data: Partial<AfterSchoolSubjectItem>): Promise<ApiResponse<any>> => {
        // Create a copy of data without the _id field
        const dataToSend = {...data, isAcademic: false};
        delete dataToSend._id;
        
        console.log(`API call to update subject ${data._id} for teacher ${teacherProfileId}`);
        console.log("Data being sent to API:", dataToSend);
        
        return api.patch<any[]>(`/teachers/${teacherProfileId}/subjects/${data._id}/`,
            dataToSend);
    },
    deleteOutOfSchoolSubject: (teacherId:string,_id: string): Promise<ApiResponse<any>> => {
        return api.delete<any[]>(`/teachers/${teacherId}/subjects/${_id}/?isAcademic=false`);
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
        delete language._id;
        return api.post<any>(`/teachers/${teacherId}/languages`,
            {
                ...language,
                teacherProfile: teacherId,
            });
    },
    updateLanguageExpertise: (teacherId: string, language: LanguageItem): Promise<ApiResponse<LanguageItem>> => {
        const updatedLanguage = {
            ...language
        }
        delete updatedLanguage._id;
        return api.patch<LanguageItem>(`/teachers/${teacherId}/languages/${language._id}`,
            updatedLanguage);
    },
    deleteLanguageExpertise: (teacherId: string, id: string): Promise<ApiResponse<LanguageItem>> => {
        return api.delete<LanguageItem>(`/teachers/${teacherId}/languages/${id}`);
    },
    getTechnicalSkills:  (teacherId: string): Promise<ApiResponse<any[]>> => {
        return api.get<string[]>(`/teachers/${teacherId}/skills`);
    },
    addTechnicalSkills: (teacherId: string, skill: TechnicalSkillItem): Promise<ApiResponse<any>> => {
        delete skill._id;
        return api.post<string[]>(`/teachers/${teacherId}/skills`,
            {
                teacherProfile: teacherId,
                ...skill,
            });
    },
    updateTechnicalSkill: (teacherId: string, skill: TechnicalSkillItem): Promise<ApiResponse<any>> => {
        const updatedSkill = {
            ...skill
        }
        delete updatedSkill._id;
        return api.patch<string[]>(`/teachers/${teacherId}/skills/${skill._id}`,
            updatedSkill);
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
        const _id = methodology._id;
        const updatedMethodology = {
            ...methodology
        }
        delete updatedMethodology._id;
        return api.patch<string[]>(`/teachers/${teacherId}/methodologies/${methodology._id}`, updatedMethodology);
    },
    deleteTeachingMethodology: (teacherId: string, methodologyId: string): Promise<ApiResponse<any>> => {
        return api.delete<string[]>(`/teachers/${teacherId}/methodologies/${methodologyId}`);
    },
    
    // Certification Management
    getCertifications: (teacherId: string): Promise<ApiResponse<CertificationItem[]>> => {
        return api.get<CertificationItem[]>(`/teachers/${teacherId}/certifications`, {
            params: {
                sort: '-issueDate'
            }
        });
    },

    getCertification: (teacherId: string, id: string): Promise<ApiResponse<CertificationItem>> => {
        return api.get<CertificationItem>(`/teachers/${teacherId}/certifications/${id}`);
    },

    addCertification: (teacherId: string, certification: Partial<CertificationItem>): Promise<ApiResponse<CertificationItem>> => {
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
            ...certification,
            teacherProfile: teacherId,
            issueDate: certification.issueDate ? normalizeDate(certification.issueDate as string) : "",
            expiryDate: certification.expiryDate ? normalizeDate(certification.expiryDate as string) : null
        };
        
        delete normalizedData._id;
        
        return api.post<CertificationItem>(`/teachers/${teacherId}/certifications`, normalizedData);
    },

    updateCertification: (teacherId: string, certification: CertificationItem): Promise<ApiResponse<CertificationItem>> => {
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
        
        const updateData = {
            ...certification,
            issueDate: certification.issueDate ? normalizeDate(certification.issueDate as string) : "",
            expiryDate: certification.expiryDate ? normalizeDate(certification.expiryDate as string) : null
        };
        
        delete updateData._id;
        
        return api.patch<CertificationItem>(`/teachers/${teacherId}/certifications/${certification._id}`, updateData);
    },

    deleteCertification: (teacherId: string, certificationId: string): Promise<ApiResponse<{ success: boolean }>> => {
        return api.delete<{ success: boolean }>(`/teachers/${teacherId}/certifications/${certificationId}`);
    },
};