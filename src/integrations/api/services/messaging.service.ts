
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

export interface MessageAttachment {
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: number;
    mimeType?: string;
}

export interface Message {
    id: string;
    conversationId: string;
    author: MessageAuthor;
    content: string;
    timestamp: string;
    createdAt: Date;
    reactions: Reaction[];
    attachments?: MessageAttachment[];
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
    conversationId?: string;
}

export interface ChannelMember {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    status: 'online' | 'offline' | 'away';
}

export interface PinnedMessage {
    id: string;
    content: string;
    author: string;
    pinnedAt: string;
    pinnedBy: string;
}

export interface CreateMessageDto {
    content: string;
    attachments?: string[];
}

export const messagingService = {
    // Get all channels available to the user
    getChannels: (): Promise<ApiResponse<Channel[]>> => {
        return api.get<Channel[]>('/messaging/channels');
    },

    // Get channel members
    getChannelMembers: (channelId: string): Promise<ApiResponse<ChannelMember[]>> => {
        return api.get<ChannelMember[]>(`/messaging/channels/${channelId}/members`);
    },

    // Get all DM users/conversations
    getDirectMessages: (): Promise<ApiResponse<DirectMessageUser[]>> => {
        return api.get<DirectMessageUser[]>('/messaging/dms');
    },

    // Get messages for a specific conversation
    getMessages: (conversationId: string, page = 1, limit = 50): Promise<ApiResponse<Message[]>> => {
        return api.get<Message[]>(`/messaging/channels/${conversationId}/messages?limit=${limit}`);
    },

    // Search messages in a conversation
    searchMessages: (conversationId: string, query: string, limit = 50): Promise<ApiResponse<Message[]>> => {
        return api.get<Message[]>(`/messaging/channels/${conversationId}/messages/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    },

    // Get pinned messages
    getPinnedMessages: (conversationId: string): Promise<ApiResponse<PinnedMessage[]>> => {
        return api.get<PinnedMessage[]>(`/messaging/channels/${conversationId}/pinned`);
    },

    // Pin a message
    pinMessage: (messageId: string): Promise<ApiResponse<Message>> => {
        return api.put<Message>(`/messaging/messages/${messageId}/pin`, {});
    },

    // Unpin a message
    unpinMessage: (messageId: string): Promise<ApiResponse<Message>> => {
        return api.delete<Message>(`/messaging/messages/${messageId}/pin`, {});
    },

    // Send a message to a conversation
    sendMessage: (conversationId: string, data: CreateMessageDto): Promise<ApiResponse<Message>> => {
        return api.post<Message>('/messaging/messages', { ...data, channelId: conversationId });
    },

    // Send a message with file attachments
    sendMessageWithAttachments: async (conversationId: string, content: string, files: File[]): Promise<ApiResponse<Message>> => {
        const formData = new FormData();
        formData.append('channelId', conversationId);
        formData.append('content', content);
        files.forEach((file) => {
            formData.append('files', file);
        });

        return api.post<Message>('/messaging/messages/with-attachments', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // Create a new DM conversation
    startDirectMessage: (userId: string): Promise<ApiResponse<{ conversationId: string }>> => {
        return api.post<{ conversationId: string }>('/messaging/direct-messages', { recipientId: userId });
    },

    // Mark conversation as read
    markAsRead: (conversationId: string): Promise<ApiResponse<void>> => {
        return api.post<void>(`/messaging/conversations/${conversationId}/read`);
    },

    // Create a new channel
    createChannel: (data: { name: string; description?: string; type: 'public' | 'private' }): Promise<ApiResponse<Channel>> => {
        return api.post<Channel>('/messaging/channels', data);
    },

    // Create a new group conversation
    createGroupConversation: (userIds: string[], name?: string): Promise<ApiResponse<{ conversationId: string }>> => {
        return api.post<{ conversationId: string }>('/messaging/conversations/group', { userIds, name });
    },

    // Search users for messaging
    searchUsers: (query: string): Promise<ApiResponse<DirectMessageUser[]>> => {
        return api.get<DirectMessageUser[]>(`/messaging/users/search?q=${encodeURIComponent(query)}`);
    },

    // Update notification settings for a channel
    updateNotificationSettings: (channelId: string, enabled: boolean): Promise<ApiResponse<{ channelId: string; notificationsEnabled: boolean }>> => {
        return api.put<{ channelId: string; notificationsEnabled: boolean }>(`/messaging/channels/${channelId}/notifications`, { enabled });
    },

    // Get notification settings for a channel
    getNotificationSettings: (channelId: string): Promise<ApiResponse<{ channelId: string; notificationsEnabled: boolean }>> => {
        return api.get<{ channelId: string; notificationsEnabled: boolean }>(`/messaging/channels/${channelId}/notifications`);
    }
};

