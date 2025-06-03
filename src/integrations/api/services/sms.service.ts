import { api } from '../client';

export interface WhatsAppInviteRequest {
  classId: string;
  cohortId?: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  customMessage?: string;
}

export interface WhatsAppInviteResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export const smsService = {
  sendWhatsAppInvite: async (request: WhatsAppInviteRequest): Promise<WhatsAppInviteResponse> => {
    try {
      const response = await api.post('/sms/whatsapp-invite', request);
      return response.data;
    } catch (error) {
      console.error('Failed to send WhatsApp invite:', error);
      throw error;
    }
  }
};