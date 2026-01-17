// src/integrations/api/services/teaching-config.service.ts
import { api } from '../client';

export interface TeachingCurriculum {
  _id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeachingSubject {
  _id: string;
  code: string;
  name: string;
  description?: string;
  category: 'core' | 'elective' | 'optional';
  isActive: boolean;
  sortOrder: number;
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeachingGradeLevel {
  _id: string;
  code: string;
  name: string;
  description?: string;
  level: 'primary' | 'secondary' | 'advanced';
  ageRange?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCurriculumDto {
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CreateSubjectDto {
  code: string;
  name: string;
  description?: string;
  category?: 'core' | 'elective' | 'optional';
  isActive?: boolean;
  sortOrder?: number;
  keywords?: string[];
}

export interface CreateGradeLevelDto {
  code: string;
  name: string;
  description?: string;
  level?: 'primary' | 'secondary' | 'advanced';
  ageRange?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export const teachingConfigService = {
  // Curricula
  getAllCurricula: () => api.get<TeachingCurriculum[]>('/teaching-config/curricula'),

  getActiveCurricula: () => api.get<TeachingCurriculum[]>('/teaching-config/curricula/active'),

  getCurriculumByCode: (code: string) => api.get<TeachingCurriculum>(`/teaching-config/curricula/${code}`),

  createCurriculum: (data: CreateCurriculumDto) => api.post<TeachingCurriculum>('/teaching-config/curricula', data),

  updateCurriculum: (code: string, data: Partial<CreateCurriculumDto>) => api.put<TeachingCurriculum>(`/teaching-config/curricula/${code}`, data),

  deleteCurriculum: (code: string) => api.delete(`/teaching-config/curricula/${code}`),

  // Subjects
  getAllSubjects: () => api.get<TeachingSubject[]>('/teaching-config/subjects'),

  getActiveSubjects: () => api.get<TeachingSubject[]>('/teaching-config/subjects/active'),

  getSubjectByCode: (code: string) => api.get<TeachingSubject>(`/teaching-config/subjects/${code}`),

  createSubject: (data: CreateSubjectDto) => api.post<TeachingSubject>('/teaching-config/subjects', data),

  updateSubject: (code: string, data: Partial<CreateSubjectDto>) => api.put<TeachingSubject>(`/teaching-config/subjects/${code}`, data),

  deleteSubject: (code: string) => api.delete(`/teaching-config/subjects/${code}`),

  // Grade Levels
  getAllGradeLevels: () => api.get<TeachingGradeLevel[]>('/teaching-config/grade-levels'),

  getActiveGradeLevels: () => api.get<TeachingGradeLevel[]>('/teaching-config/grade-levels/active'),

  getGradeLevelByCode: (code: string) => api.get<TeachingGradeLevel>(`/teaching-config/grade-levels/${code}`),

  createGradeLevel: (data: CreateGradeLevelDto) => api.post<TeachingGradeLevel>('/teaching-config/grade-levels', data),

  updateGradeLevel: (code: string, data: Partial<CreateGradeLevelDto>) => api.put<TeachingGradeLevel>(`/teaching-config/grade-levels/${code}`, data),

  deleteGradeLevel: (code: string) => api.delete(`/teaching-config/grade-levels/${code}`),

  // Helpers (frontend processing)
  getSubjectsGroupedByCategory: async () => {
    const response = await teachingConfigService.getActiveSubjects();
    const subjects = response.data || [];
    const grouped: Record<string, TeachingOption[]> = {
      core: [],
      elective: [],
      optional: []
    };

    subjects.forEach(subject => {
      const option: TeachingOption = {
        value: subject.code,
        label: subject.name,
        description: subject.description
      };

      if (subject.category && grouped[subject.category]) {
        grouped[subject.category].push(option);
      } else {
        // Fallback for missing or unknown categories
        if (!grouped['other']) grouped['other'] = [];
        grouped['other'].push(option);
      }
    });

    return grouped;
  },

  getGradeLevelsGroupedByLevel: async () => {
    const response = await teachingConfigService.getActiveGradeLevels();
    const grades = response.data || [];
    const grouped: Record<string, TeachingOption[]> = {
      primary: [],
      secondary: [],
      advanced: []
    };

    grades.forEach(grade => {
      const option: TeachingOption = {
        value: grade.code,
        label: grade.name,
        description: grade.description
      };

      if (grade.level && grouped[grade.level]) {
        grouped[grade.level].push(option);
      } else {
        if (!grouped['other']) grouped['other'] = [];
        grouped['other'].push(option);
      }
    });

    return grouped;
  }
};

export interface TeachingOption {
  value: string;
  label: string;
  description?: string;
  group?: string;
}
