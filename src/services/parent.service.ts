import { api } from '@/integrations/api/client';

export interface ParentProfile {
    _id: string;
    user: string | { _id: string;[key: string]: any };
    children: string[];
    contactNumber?: string;
    preferredContactMethod?: string;
    receiveProgressReports?: boolean;
    receiveNotifications?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateParentDto {
    user: string;
    children?: string[];
    contactNumber?: string;
    preferredContactMethod?: string;
}

export interface UpdateParentDto {
    children?: string[];
    contactNumber?: string;
    preferredContactMethod?: string;
    receiveProgressReports?: boolean;
    receiveNotifications?: boolean;
}

export const parentService = {
    async getProfile(): Promise<ParentProfile> {
        const response = await api.get<ParentProfile>('/parents/profile');
        if (response.error) {
            throw new Error(response.error.message);
        }
        if (!response.data) {
            throw new Error('Parent profile not found');
        }
        return response.data;
    },

    async getParentById(parentId: string): Promise<ParentProfile> {
        const response = await api.get<ParentProfile>(`/parents/${parentId}`);
        if (response.error) {
            throw new Error(response.error.message);
        }
        if (!response.data) {
            throw new Error('Parent profile not found');
        }
        return response.data;
    },

    async createProfile(data: CreateParentDto): Promise<ParentProfile> {
        // According to backend controller, we call POST /parents
        const response = await api.post<ParentProfile>('/parents', data);
        if (response.error) {
            throw new Error(response.error.message);
        }
        return response.data as ParentProfile;
    },

    async updateProfile(parentId: string, data: UpdateParentDto): Promise<ParentProfile> {
        const response = await api.patch<ParentProfile>(`/parents/${parentId}`, data);
        if (response.error) {
            throw new Error(response.error.message);
        }
        return response.data as ParentProfile;
    }
};
