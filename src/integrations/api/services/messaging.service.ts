
import { api, ApiResponse } from '../client';

export interface Reaction {
    emoji: string;
    count: number;
    userReacted?: boolean;
}

export interface MessageAuthor {
    id: string;
    name: string;
    role: string;
    avatar?: string;
}

export interface Message {
    id: string;
    conversationId: string;
    author: MessageAuthor;
    content: string;
    timestamp: string; // ISO string
    createdAt: Date;
    reactions: Reaction[];
    attachments?: {
        type: 'image' | 'file';
        url: string;
        name: string;
    }[];
}

export interface Channel {
    id: string;
    name: string;
    type: 'channel';
    unreadCount: number;
    lastMessage?: {
        content: string;
        timestamp: string;
    };
}

export interface DirectMessageUser {
    id: string;
    name: string;
    role: 'Teacher' | 'Student' | 'Parent' | 'Admin';
    status: 'online' | 'offline' | 'away' | 'busy';
    avatar?: string;
    unreadCount?: number;
    conversationId?: string; // ID of the conversation with this user
}

export interface CreateMessageDto {
    content: string;
    attachments?: string[]; // IDs of uploaded files
}

export const messagingService = {
    // Get all channels available to the user
    getChannels: (): Promise<ApiResponse<Channel[]>> => {
        return api.get<Channel[]>('/messaging/channels');
    },

    // Get all DM users/conversations
    getDirectMessages: (): Promise<ApiResponse<DirectMessageUser[]>> => {
        return api.get<DirectMessageUser[]>('/messaging/dms');
    },

    // Get messages for a specific conversation (channel or DM)
    getMessages: (conversationId: string, page = 1, limit = 50): Promise<ApiResponse<{ messages: Message[], total: number }>> => {
        return api.get<{ messages: Message[], total: number }>(`/messaging/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
    },

    // Send a message to a conversation
    sendMessage: (conversationId: string, data: CreateMessageDto): Promise<ApiResponse<Message>> => {
        return api.post<Message>(`/messaging/conversations/${conversationId}/messages`, data);
    },

    // Create a new DM conversation
    startDirectMessage: (userId: string): Promise<ApiResponse<{ conversationId: string }>> => {
        return api.post<{ conversationId: string }>('/messaging/dms', { userId });
    },

    // Mark conversation as read
    markAsRead: (conversationId: string): Promise<ApiResponse<void>> => {
        return api.post<void>(`/messaging/conversations/${conversationId}/read`);
    }
};
