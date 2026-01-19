import { mvpApiClient } from '../mvp-client';

export interface CreateTicketDto {
    subject: string;
    message: string;
    category: 'account_access' | 'payment' | 'technical' | 'content' | 'general' | 'feature_request' | 'bug_report' | 'other';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    attachments?: string[];
}

export interface Ticket {
    _id: string;
    ticketNumber: string;
    subject: string;
    message: string;
    category: string;
    priority: string;
    status: 'open' | 'in_progress' | 'pending_user' | 'resolved' | 'closed';
    createdAt: string;
    updatedAt: string;
    messages: {
        senderId: string;
        senderType: string;
        message: string;
        createdAt: string;
    }[];
}

export const MvpSupportService = {
    /**
     * Create a new support ticket
     */
    createTicket: async (data: CreateTicketDto): Promise<Ticket> => {
        return mvpApiClient.post<Ticket>('/support/tickets', data);
    },

    /**
     * Get current user's tickets
     */
    getMyTickets: async (): Promise<Ticket[]> => {
        return mvpApiClient.get<Ticket[]>('/support/tickets');
    }
};
