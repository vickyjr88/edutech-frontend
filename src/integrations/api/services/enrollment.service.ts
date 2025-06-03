import { api } from '../client';

export interface SingleEmailInviteRequest {
  classId: string;
  cohortId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  customMessage?: string;
}

export interface BulkEmailInviteRequest {
  classId: string;
  cohortId?: string;
  emails: string[];
  customMessage?: string;
}

export interface EmailInviteResponse {
  success: boolean;
  invitationId?: string;
  error?: string;
}

export interface BulkEmailInviteResponse {
  success: boolean;
  successful: number;
  failed: number;
  errors?: string[];
}

export const enrollmentService = {
  sendSingleEmailInvite: async (request: SingleEmailInviteRequest): Promise<EmailInviteResponse> => {
    try {
      const response = await api.post('/enrollments/invite/email/single', request);
      return response.data;
    } catch (error) {
      console.error('Failed to send single email invite:', error);
      throw error;
    }
  },

  sendBulkEmailInvites: async (request: BulkEmailInviteRequest): Promise<BulkEmailInviteResponse> => {
    try {
      const response = await api.post('/enrollments/invite/email', request);
      return response.data;
    } catch (error) {
      console.error('Failed to send bulk email invites:', error);
      throw error;
    }
  }
};