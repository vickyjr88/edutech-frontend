import { api, ApiResponse } from '@/integrations/api/client';

export interface Notification {
    _id: string;
    recipient: string;
    title: string;
    content: string;
    type: string;
    category?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    isRead: boolean;
    readAt?: Date;
    link?: string;
    actionUrl?: string;
    actionText?: string;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    sender?: {
        _id: string;
        fullName: string;
        profileImage?: string;
    };
}

export interface NotificationStats {
    totalCount: number;
    unreadCount: number;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
}

export interface NotificationPreferences {
    emailNotificationsEnabled: boolean;
    smsNotificationsEnabled: boolean;
    inAppNotificationsEnabled: boolean;
    categories: CategoryPreference[];
    quietHoursEnabled: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    quietHoursDays?: string[];
    updatedAt: Date;
}

export interface CategoryPreference {
    category: string;
    enabled: boolean;
    channels: {
        email: boolean;
        sms: boolean;
        inApp: boolean;
    };
}

export interface NotificationQuery {
    page?: number;
    limit?: number;
    isRead?: boolean;
    type?: string;
    category?: string;
    priority?: string;
}

export interface PaginatedNotifications {
    notifications: Notification[];
    total: number;
    page: number;
    totalPages: number;
}

export const notificationService = {
    async getNotifications(
        query: NotificationQuery = {},
    ): Promise<PaginatedNotifications> {
        const response: any = await api.get<any>('/notifications/me', { params: query });
        if (response.error) throw new Error(response.error.message);

        // Map backend response { data, meta } to frontend interface
        return {
            notifications: response.data.data,
            total: response.data.meta.total,
            page: response.data.meta.page,
            totalPages: response.data.meta.totalPages
        };
    },

    async getStats(): Promise<NotificationStats> {
        const response = await api.get<NotificationStats>('/notifications/me/stats');
        if (response.error) throw new Error(response.error.message);
        return response.data as NotificationStats;
    },

    async markAsRead(notificationIds: string[]): Promise<{ modifiedCount: number }> {
        const response = await api.put<{ modifiedCount: number }>('/notifications/me/read', { notificationIds });
        if (response.error) throw new Error(response.error.message);
        return response.data as { modifiedCount: number };
    },

    async markAllAsRead(): Promise<{ modifiedCount: number }> {
        const response = await api.put<{ modifiedCount: number }>('/notifications/me/read-all', {});
        if (response.error) throw new Error(response.error.message);
        return response.data as { modifiedCount: number };
    },

    async deleteNotification(notificationId: string): Promise<Notification> {
        const response = await api.delete<Notification>(`/notifications/me/${notificationId}`);
        if (response.error) throw new Error(response.error.message);
        return response.data as Notification;
    },

    async deleteMultiple(notificationIds: string[]): Promise<{ modifiedCount: number }> {
        const response = await api.delete<{ modifiedCount: number }>('/notifications/me', {
            data: { notificationIds },
        });
        if (response.error) throw new Error(response.error.message);
        return response.data as { modifiedCount: number };
    },

    async getPreferences(): Promise<NotificationPreferences> {
        const response = await api.get<NotificationPreferences>('/notifications/preferences/me');
        if (response.error) throw new Error(response.error.message);
        return response.data as NotificationPreferences;
    },

    async updatePreferences(
        preferences: Partial<NotificationPreferences>,
    ): Promise<NotificationPreferences> {
        const response = await api.put<NotificationPreferences>('/notifications/preferences/me', preferences);
        if (response.error) throw new Error(response.error.message);
        return response.data as NotificationPreferences;
    },
};
