/**
 * MVP Offering Service
 *
 * Frontend service for managing teacher offerings
 */

import { mvpApiClient } from '@/integrations/api/mvp-client';

export interface Offering {
    _id: string;
    type: 'one-time' | 'monthly-package' | 'course';
    title: string;
    description: string;
    subject: string;
    curriculum?: string;
    gradeLevel?: string;
    price: number;
    sessionDuration: number;
    numberOfSessions?: number;
    sessionsPerMonth?: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateOfferingRequest {
    type: 'one-time' | 'monthly-package' | 'course';
    title: string;
    description: string;
    subject: string;
    curriculum?: string;
    gradeLevel?: string;
    price: number;
    sessionDuration: number;
    numberOfSessions?: number;
    sessionsPerMonth?: number;
    isActive?: boolean;
}

export interface UpdateOfferingRequest extends Partial<CreateOfferingRequest> { }

const MvpOfferingService = {
    /**
     * Get current teacher's offerings
     */
    getMyOfferings: async (): Promise<Offering[]> => {
        return mvpApiClient.get<Offering[]>('/my-offerings');
    },

    /**
     * Get offering by ID
     */
    getOffering: async (id: string): Promise<Offering> => {
        return mvpApiClient.get<Offering>(`/offerings/${id}`);
    },

    /**
     * Create a new offering
     */
    createOffering: async (data: CreateOfferingRequest): Promise<Offering> => {
        return mvpApiClient.post<Offering>('/offerings', data);
    },

    /**
     * Update an offering
     */
    updateOffering: async (id: string, data: UpdateOfferingRequest): Promise<Offering> => {
        return mvpApiClient.put<Offering>(`/offerings/${id}`, data);
    },

    /**
     * Delete an offering
     */
    deleteOffering: async (id: string): Promise<void> => {
        return mvpApiClient.delete(`/offerings/${id}`);
    },

    /**
     * Toggle offering active status
     */
    toggleActive: async (id: string, isActive: boolean): Promise<Offering> => {
        return mvpApiClient.patch<Offering>(`/offerings/${id}/toggle`, { isActive });
    },
};

export default MvpOfferingService;
