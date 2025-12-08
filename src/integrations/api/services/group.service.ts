// src/integrations/api/services/group.service.ts
import { api, ApiResponse } from '../client';

export interface GroupMember {
    _id: string;
    fullName: string;
    profileImage?: string;
}

export interface Group {
    _id: string;
    name: string;
    description?: string;
    class?: {
        _id: string;
        title: string;
        subject: string;
    };
    subject?: string;
    members: GroupMember[];
    createdBy?: GroupMember;
    isCompleted: boolean;
    progress: number;
    nextSession?: string;
    dueDate?: string;
    timeline?: string;
    createdAt: string;
    updatedAt: string;
}

export interface GroupInvitation {
    _id: string;
    group: Group;
    inviter: GroupMember;
    invitee: string;
    status: 'Pending' | 'Accepted' | 'Declined';
    createdAt: string;
}

export interface CreateGroupDto {
    name: string;
    description?: string;
    class?: string;
    subject?: string;
    members?: string[];
    dueDate?: string;
    nextSession?: string;
}

export interface UpdateGroupDto {
    name?: string;
    description?: string;
    subject?: string;
    progress?: number;
    isCompleted?: boolean;
    timeline?: string;
    dueDate?: string;
    nextSession?: string;
}

export const groupService = {
    // Create a new group
    create: (data: CreateGroupDto): Promise<ApiResponse<Group>> => {
        return api.post<Group>('/groups', data);
    },

    // Get all active groups for current user
    getAll: (): Promise<ApiResponse<Group[]>> => {
        return api.get<Group[]>('/groups');
    },

    // Get completed groups
    getCompleted: (): Promise<ApiResponse<Group[]>> => {
        return api.get<Group[]>('/groups/completed');
    },

    // Get pending invitations
    getInvitations: (): Promise<ApiResponse<GroupInvitation[]>> => {
        return api.get<GroupInvitation[]>('/groups/invitations');
    },

    // Get a specific group
    getById: (id: string): Promise<ApiResponse<Group>> => {
        return api.get<Group>(`/groups/${id}`);
    },

    // Update a group
    update: (id: string, data: UpdateGroupDto): Promise<ApiResponse<Group>> => {
        return api.patch<Group>(`/groups/${id}`, data);
    },

    // Update progress
    updateProgress: (id: string, progress: number): Promise<ApiResponse<Group>> => {
        return api.patch<Group>(`/groups/${id}/progress`, { progress });
    },

    // Delete a group
    delete: (id: string): Promise<ApiResponse<{ success: boolean }>> => {
        return api.delete<{ success: boolean }>(`/groups/${id}`);
    },

    // Leave a group
    leave: (id: string): Promise<ApiResponse<Group>> => {
        return api.post<Group>(`/groups/${id}/leave`, {});
    },

    // Invite a user
    invite: (groupId: string, userId: string): Promise<ApiResponse<GroupInvitation>> => {
        return api.post<GroupInvitation>(`/groups/${groupId}/invite`, { userId });
    },

    // Accept invitation
    acceptInvitation: (invitationId: string): Promise<ApiResponse<Group>> => {
        return api.post<Group>(`/groups/invitations/${invitationId}/accept`, {});
    },

    // Decline invitation
    declineInvitation: (invitationId: string): Promise<ApiResponse<{ success: boolean }>> => {
        return api.post<{ success: boolean }>(`/groups/invitations/${invitationId}/decline`, {});
    },
};
