// src/integrations/api/services/platform.service.ts
import { api, ApiResponse } from '../client';
import { Curriculum, CurriculumLevel, Subject } from '@/components/teacher/class-setup/types';

export const platformService = {
    // Curriculum APIs
    getCurricula: (): Promise<ApiResponse<Curriculum[]>> => {
        return api.get<Curriculum[]>('/curriculum');
    },

    getCurriculumById: (id: string): Promise<ApiResponse<Curriculum>> => {
        return api.get<Curriculum>(`/curriculum/${id}`);
    },
    
    getCurriculumLevels: (curriculumId: string): Promise<ApiResponse<CurriculumLevel[]>> => {
        return api.get<CurriculumLevel[]>(`/curriculum/${curriculumId}/levels`);
    },
    
    getCurriculumLevelById: (curriculumId: string, levelId: string): Promise<ApiResponse<CurriculumLevel>> => {
        return api.get<CurriculumLevel>(`/curriculum/${curriculumId}/levels/${levelId}`);
    },
    
    // Subject APIs
    getLevelSubjects: (curriculumId: string, levelId: string): Promise<ApiResponse<Subject[]>> => {
        return api.get<Subject[]>(`/curriculum/${curriculumId}/levels/${levelId}/subjects`);
    }
};