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
import type { TeacherSummaryResponse } from '@/types/enhanced-classes';
import type { TeacherStudentsData } from '@/types/activity';
import type { TeacherBalance, TeacherTransaction, TeacherTransactionsQuery } from '../types/teacher-transactions.types';
import type { Bank, TeacherBankAccount, AddBankAccountRequest, UpdateBankAccountRequest } from '../types/bank-accounts.types';
import type { TeacherPayoutPreferences, PayoutRecommendation, PayoutAnalytics, UpdatePayoutPreferencesRequest, TeacherTier } from '../types/teacher-payout-preferences.types';
import { mapToBackendFormat, mapFromBackendFormat } from '../types/teacher-payout-preferences.types';
import type { TeacherRevenueSummaryResponse, RevenueSummaryRequestParams } from '../types/teacher-revenue-summary.types';
import type { PrimaryBankAccount } from '../types/primary-bank-account.types';
import type { ApiPayoutPreferencesResponse, ApiUpdatePayoutPreferencesRequest } from '../types/api-payout-preferences.types';

export interface BaseEntity {
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
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

export interface Subject extends BaseEntity {
    teacherProfile: string;
    curriculum?: string;
    subject: string;
    gradeLevel?: string;
    proficiencyLevel?: string;
    ageRange?: string;
    gender?: string;
    religion?: string;
    description: string;
    isCertified: boolean;
    isAcademic: boolean;
    resources: string[];
  }

export interface TeacherProfile {
    id: string;
    userId: string;
    user?: {
        _id: string;
        fullName: string;
        email: string;
        phoneNumber?: string;
        alternativePhoneNumber?: string;
        bio?: string;
        profileImage?: string;
    legal_id:{id_type:string,id:string,country:string};
        _signedProfileImage?: string;
        [key: string]: any;
    };
    education: Education[];
    experience: Experience[];
    strategies: string[];
    methodologies: string[];
    subjects: Subject[];
    skills: object[];
    languages: object[];
    certifications: object[];
    introVideoUrl?: string;
    backgroundCheckFile?: string;
    governmentIdFile?: string;
    isProfileComplete: boolean;
    rating: number;
    totalReviews: number;
    totalStudents: number;
    totalClasses: number;
    totalHours: number;
    profileImage?: string;
    _signedProfileImage?: string;
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

export interface LessonPlan {
    title: string;
    duration: number;
    objectives: string[];
    activities: string[];
    materials: string[];
    assessment: string;
}

export interface ClassRecommendation {
    _id: string;
    teacher: string;
    title: string;
    subject: string;
    curriculum?: string;
    gradeLevel?: string;
    ageRange?: string;
    summary?: string;
    description?: string;
    commitment?: string;
    numberOfLessons: number;
    suggestedPrice: number;
    tags?: string[];
    lessonPlans: LessonPlan[];
    resources?: Array<{
        title: string;
        type: string;
        url?: string;
        description?: string;
        cost?: string;
        _id: string;
    }>;
    technicalRequirements?: string[];
    materials?: string[];
    confidence: number;
    status: 'pending' | 'adopted' | 'dismissed';
    createdAt: string;
    updatedAt: string;
}

export interface StudentInviteRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    customMessage: string;
    cohortId: string;
}

export interface StudentInviteResponse {
    class: string;
    cohort: string;
    inviteeEmail: string;
    inviteeFirstName: string;
    inviteeLastName: string;
    status: string;
    invitationMethod: string;
    invitationMessage: string;
    invitationCode: string;
    isPaid: boolean;
    attendanceCount: number;
    progress: number;
    lessonsCompleted: number;
    totalLessons: number;
    friendsCount: number;
    totalLearningHours: number;
    homeworkCompletionRate: number;
    hasHomeworkDue: boolean;
    overallEngagement: number;
    engagementLevel: string;
    cameraShy: boolean;
    cameraUsage: number;
    connectionQuality: string;
    typicalConnection: string;
    micUsage: number;
    chatActivity: number;
    breakoutRoomBehavior: string;
    bestLearningTime: string;
    learningStyle: string;
    attentionSpan: number;
    retentionRate: number;
    masteredTopics: string[];
    strugglingTopics: string[];
    teachingRecommendations: string[];
    _id: string;
    lessonProgress: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

//Define certification endpoints
export const teacherService = {
    // Teacher Profile CRUD
    createProfile: (data: Partial<TeacherProfile>): Promise<ApiResponse<TeacherProfile>> => {
        return api.post<TeacherProfile>('/teachers', data);
    },

    getAllProfiles: (studentId?: string): Promise<ApiResponse<TeacherProfile[]>> => {
        const params = studentId ? { studentId } : {};
        return api.get<TeacherProfile[]>('/teachers', { params });
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

    // Bulk update education - send all education items as an array
    updateTeacherEducation: (teacherId: string, educationItems: Education[]): Promise<ApiResponse<Education[]>> => {
        // Normalize dates for all education items
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

        const normalizedEducationItems = educationItems.map(item => ({
            ...item,
            teacherProfile: teacherId,
            startDate: item.startDate ? normalizeDate(item.startDate as string) : "",
            endDate: item.endDate ? normalizeDate(item.endDate as string) : null
        }));

        return api.put<Education[]>(`/teachers/${teacherId}/education`, {
            educationItems: normalizedEducationItems
        });
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

    // Bulk update experience - send all experience items as an array
    updateTeacherExperience: (teacherId: string, experienceItems: Experience[]): Promise<ApiResponse<Experience[]>> => {
        // Normalize dates for all experience items
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

        const normalizedExperienceItems = experienceItems.map(item => ({
            ...item,
            teacherProfile: teacherId,
            startDate: item.startDate ? normalizeDate(item.startDate as string) : "",
            endDate: item.endDate ? normalizeDate(item.endDate as string) : null
        }));

        return api.put<Experience[]>(`/teachers/${teacherId}/experience`, {
            experienceItems: normalizedExperienceItems
        });
    },

    // Bulk update subjects - send all subject items as an array
    updateTeacherSubjects: (teacherId: string, subjectItems: any[]): Promise<ApiResponse<any[]>> => {
        const normalizedSubjectItems = subjectItems.map(item => ({
            ...item,
            teacherProfile: teacherId
        }));

        return api.put<any[]>(`/teachers/${teacherId}/subjects`, {
            subjectItems: normalizedSubjectItems
        });
    },

    // Bulk update languages - send all language items as an array
    updateTeacherLanguages: (teacherId: string, languageItems: LanguageItem[]): Promise<ApiResponse<LanguageItem[]>> => {
        const normalizedLanguageItems = languageItems.map(item => ({
            ...item,
            teacherProfile: teacherId
        }));

        return api.put<LanguageItem[]>(`/teachers/${teacherId}/languages`, {
            languageItems: normalizedLanguageItems
        });
    },

    // Bulk update technical skills - send all skill items as an array
    updateTeacherTechnicalSkills: (teacherId: string, skillItems: TechnicalSkillItem[]): Promise<ApiResponse<TechnicalSkillItem[]>> => {
        const normalizedSkillItems = skillItems.map(item => ({
            ...item,
            teacherProfile: teacherId
        }));

        return api.put<TechnicalSkillItem[]>(`/teachers/${teacherId}/skills`, {
            skillItems: normalizedSkillItems
        });
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

    getTeacherStudentsWithStats: async (teacherId: string): Promise<ApiResponse<TeacherStudentsData>> => {
        return api.get<TeacherStudentsData>(`/classes/teachers/${teacherId}/students`);
    },

    getTeacherStats: async (teacherId: string): Promise<ApiResponse<any>> => {
        return api.get<any>(`/classes/teachers/${teacherId}/stats`);
    },

    getTeacherUpcomingSessions: async (teacherId: string): Promise<ApiResponse<any[]>> => {
        return api.get<any[]>(`/teachers/${teacherId}/upcoming-sessions`);
    },

    getTeacherDashboard: async (teacherId: string, params?: {
        limit?: number;
        days?: number;
    }): Promise<ApiResponse<{
        stats: any;
        upcomingSessions: any[];
        recentActivity: any[];
        classPerformance: any[];
    }>> => {
        return api.get<any>(`/teachers/${teacherId}/dashboard`, { params });
    },

    getTeacherSummary: async (teacherId: string): Promise<ApiResponse<TeacherSummaryResponse>> => {
        return api.get<TeacherSummaryResponse>(`/classes/teachers/${teacherId}/summary`);
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
            ...(certification.issueDate && { issueDate: normalizeDate(certification.issueDate as string) }),
            ...(certification.expiryDate && { expiryDate: normalizeDate(certification.expiryDate as string) })
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
    
    // File uploads for verification documents
    uploadVerificationFile: (teacherId: string, documentType: 'background_check' | 'government_id', base64File: string): Promise<ApiResponse<{ fileUrl: string }>> => {
        // The API requires a base64 encoded string of the file
        return api.post<{ fileUrl: string }>(`/teachers/${teacherId}/documents`, {
            documentType,
            base64File
        });
    },
    
    // Get signed URL for temporary document access
    getDocumentSignedUrl: (teacherId: string, documentType: 'background_check' | 'government_id'): Promise<ApiResponse<{ signedUrl: string }>> => {
        return api.get<{ signedUrl: string }>(`/teachers/${teacherId}/documents/${documentType}/signed-url`);
    },
    
    // Get signed URL for document viewing
    getDocumentViewUrl: (teacherId: string, documentType: 'background_check' | 'government_id'): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await api.get<{ signedUrl: string }>(`/teachers/${teacherId}/documents/${documentType}/signed-url`);
                if (response.data && response.data.signedUrl) {
                    resolve(response.data.signedUrl);
                } else {
                    reject(new Error('No signed URL returned'));
                }
            } catch (error) {
                console.error('Error getting document signed URL:', error);
                reject(error);
            }
        });
    },
    
    updateVerificationStatus: (teacherId: string, updates: { backgroundCheckFile?: string, governmentIdFile?: string }): Promise<ApiResponse<TeacherProfile>> => {
        return api.patch<TeacherProfile>(`/teachers/${teacherId}`, updates);
    },
    
    // Upload profile photo
    uploadProfilePhoto: (teacherId: string, base64File: string, mimeType: string): Promise<ApiResponse<{ 
        fileUrl: string;
        signedUrl: string;
    }>> => {
        return api.post<{ 
            fileUrl: string;
            signedUrl: string;
        }>(`/teachers/${teacherId}/profile-photo`, {
            base64File,
            mimeType
        });
    },

    // Document Upload Methods
    uploadDocument: (teacherId: string, base64File: string, documentType: 'background_check' | 'government_id'): Promise<ApiResponse<{ 
        fileUrl: string;
        signedUrl: string;
    }>> => {
        return api.post<{ 
            fileUrl: string;
            signedUrl: string;
        }>(`/teachers/${teacherId}/documents`, {
            base64File,
            documentType
        });
    },

    // AI Class Recommendations
    generateRecommendations: (): Promise<ApiResponse<ClassRecommendation[]>> => {
        return api.post<ClassRecommendation[]>('/teacher/recommendations/generate');
    },

    getPendingRecommendations: (): Promise<ApiResponse<ClassRecommendation[]>> => {
        return api.get<ClassRecommendation[]>('/teacher/recommendations/pending');
    },

    adoptRecommendation: (recommendationId: string, classId: string): Promise<ApiResponse<ClassRecommendation>> => {
        return api.patch<ClassRecommendation>(`/teacher/recommendations/${recommendationId}/adopt`, {
            classId
        });
    },

    dismissRecommendation: (recommendationId: string, reason?: string): Promise<ApiResponse<ClassRecommendation>> => {
        return api.patch<ClassRecommendation>(`/teacher/recommendations/${recommendationId}/dismiss`, {
            reason
        });
    },
    generateCustomClassDescription: (prompt: string): Promise<ApiResponse<{
        "success": boolean,
        "message": string,
        "data": {
            "description": string
        }
    }>> => {
        return api.post<any>('/teacher/custom-class/generate-description', {
            prompt
        });
    },
    // Custom Class Generation
    generateCustomClass: (prompt: string): Promise<ApiResponse<{
        generatedClass: {
            title: string;
            confidence: number;
        };
        createdClass: {
            _id: string;
            status: string;
        };
        costs: {
            generationCostCents: number;
        };
    }>> => {
        return api.post<any>('/teacher/custom-class/generate', {
            prompt
        });
    },

    // Invite student to class
    inviteStudentToClass: (teacherId: string, inviteData: StudentInviteRequest): Promise<ApiResponse<StudentInviteResponse[]>> => {
        return api.post<StudentInviteResponse[]>(`/classes/teachers/${teacherId}/students`, inviteData);
    },

    // Teacher Transactions
    getTeacherBalance: (): Promise<ApiResponse<TeacherBalance>> => {
        return api.get<TeacherBalance>('/teacher-transactions/teacher-balance');
    },

    getAllTransactions: (params?: TeacherTransactionsQuery): Promise<ApiResponse<TeacherTransaction[]>> => {
        return api.get<TeacherTransaction[]>('/teacher-transactions/all-transactions', { params });
    },

    // Bank Account Management
    getSupportedBanks: (): Promise<ApiResponse<Bank[]>> => {
        return api.get<Bank[]>('/banks');
    },

    getTeacherBankAccounts: (): Promise<ApiResponse<TeacherBankAccount[]>> => {
        return api.get<TeacherBankAccount[]>('/teacher/bank-accounts/active');
    },

    addBankAccount: (data: AddBankAccountRequest): Promise<ApiResponse<TeacherBankAccount>> => {
        return api.post<TeacherBankAccount>('/teacher/bank-accounts', data);
    },

    updateBankAccount: (accountId: string, data: UpdateBankAccountRequest): Promise<ApiResponse<TeacherBankAccount>> => {
        return api.patch<TeacherBankAccount>(`/teacher/bank-accounts/${accountId}`, data);
    },

    deleteBankAccount: (accountId: string): Promise<ApiResponse<{ success: boolean }>> => {
        return api.delete<{ success: boolean }>(`/teacher/bank-accounts/${accountId}`);
    },

    setPrimaryBankAccount: (accountId: string): Promise<ApiResponse<TeacherBankAccount>> => {
        return api.post<TeacherBankAccount>('/teacher/bank-accounts/set-primary', {
            bankAccountId: accountId
        });
    },

    // Payout Preferences Management
    getPayoutPreferences: (teacherId): Promise<ApiResponse<ApiPayoutPreferencesResponse>> => {
        return api.get<ApiPayoutPreferencesResponse>(`/teachers/${teacherId}/payout-preferences`);
    },

    updatePayoutPreferences: (teacherId, data: ApiUpdatePayoutPreferencesRequest): Promise<ApiResponse<ApiPayoutPreferencesResponse>> => {
        return api.patch<ApiPayoutPreferencesResponse>(`/teachers/${teacherId}/payout-preferences`, data);
    },

    getPayoutRecommendations: (): Promise<ApiResponse<PayoutRecommendation[]>> => {
        return api.get<PayoutRecommendation[]>('/teacher/payout-recommendations');
    },

    getPayoutAnalytics: (params?: { timeframe?: string }): Promise<ApiResponse<PayoutAnalytics>> => {
        return api.get<PayoutAnalytics>('/teacher/payout-analytics', { params });
    },

    getTeacherTier: (): Promise<ApiResponse<TeacherTier>> => {
        return api.get<TeacherTier>('/teacher/tier');
    },

    requestInstantPayout: (amount?: number): Promise<ApiResponse<{ success: boolean; transactionId: string; processingTime: string }>> => {
        return api.post<{ success: boolean; transactionId: string; processingTime: string }>('/teacher/instant-payout', {
            amount
        });
    },

    // Revenue Summary
    getRevenueSummary: (params?: RevenueSummaryRequestParams): Promise<ApiResponse<TeacherRevenueSummaryResponse>> => {
        return api.get<TeacherRevenueSummaryResponse>('/teacher-transactions/revenue-summary', { params });
    },

    // Primary Bank Account
    getPrimaryBankAccount: (): Promise<ApiResponse<PrimaryBankAccount>> => {
        return api.get<PrimaryBankAccount>('/teacher/bank-accounts/primary');
    },


    getTeacherCertifications: (teacherId: string): Promise<ApiResponse<any[]>> => {
        return api.get<any[]>(`/teachers/${teacherId}/certifications`);
    },

    updateCertification: (teacherId: string, certificationId: string, data: Partial<CertificationItem>): Promise<ApiResponse<any>> => {
        return api.patch<any>(`/teachers/${teacherId}/certifications/${certificationId}`, {
            certificateType: data.certificateType,
            name: data.name,
            issuer: data.issuer,
            issueDate: data.issueDate || data.year ? `${data.year}-01-01` : undefined,
            description: data.description,
            isVerifiable: data.isVerifiable,
            credentialUrl: data.credentialUrl,
            cert_docs: data.cert_docs
        });
    },

    deleteCertification: (teacherId: string, certificationId: string): Promise<ApiResponse<any>> => {
        return api.delete<any>(`/teachers/${teacherId}/certifications/${certificationId}`);
    },
};