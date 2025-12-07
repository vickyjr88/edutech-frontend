// src/integrations/api/services/message-analytics.service.ts
import { api, ApiResponse } from '../client';

export enum CampaignType {
  CHECK_IN = 'check-in',
  CELEBRATION = 'celebration',
  SUPPORT = 'support',
  REMINDER = 'reminder',
  ANNOUNCEMENT = 'announcement',
  FEEDBACK = 'feedback',
  CUSTOM = 'custom',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum MessagePlatform {
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  SMS = 'sms',
  APP = 'app',
}

export enum EngagementStatus {
  HIGHLY_ENGAGED = 'highly-engaged',
  MODERATE = 'moderate',
  LOW_ENGAGEMENT = 'low-engagement',
  NON_RESPONSIVE = 'non-responsive',
}

export interface PlatformMetrics {
  sent: number;
  delivered: number;
  read: number;
  responded: number;
}

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  read: number;
  responded: number;
  failed: number;
  responseRate: number;
  deliveryRate: number;
  readRate: number;
  avgResponseTime: number;
  platformBreakdown: {
    whatsapp: PlatformMetrics;
    email: PlatformMetrics;
    sms: PlatformMetrics;
    app: PlatformMetrics;
  };
}

export interface MessageCampaign {
  _id: string;
  teacher: string;
  title: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  platforms: MessagePlatform[];
  messageContent: string;
  subject?: string;
  recipients: string[];
  recipientCount: number;
  scheduledAt?: string;
  sentAt?: string;
  completedAt?: string;
  metrics: CampaignMetrics;
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentEngagement {
  _id: string;
  teacher: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: string;
  };
  totalMessagesSent: number;
  totalMessagesDelivered: number;
  totalMessagesRead: number;
  totalMessagesResponded: number;
  responseRate: number;
  avgResponseTime: number;
  preferredPlatform: MessagePlatform;
  status: EngagementStatus;
  lastMessageSent?: string;
  lastMessageRead?: string;
  lastResponse?: string;
  daysSinceLastEngagement?: number;
}

export interface OverallAnalytics {
  totalMessagesSent: number;
  totalDelivered: number;
  totalRead: number;
  totalResponded: number;
  totalFailed: number;
  responseRate: number;
  deliveryRate: number;
  readRate: number;
  avgResponseTime: number;
  avgResponseTimeFormatted: string;
  totalCampaigns: number;
  activeStudents: number;
  platformBreakdown: {
    whatsapp: PlatformMetrics & { responseRate: number; deliveryRate: number };
    email: PlatformMetrics & { responseRate: number; deliveryRate: number };
    sms: PlatformMetrics & { responseRate: number; deliveryRate: number };
    app: PlatformMetrics & { responseRate: number; deliveryRate: number };
  };
}

export interface BestTemplate {
  template: string;
  type: CampaignType;
  responseRate: number;
  messagesSent: number;
  responses: number;
}

export interface RecentActivity {
  type: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  campaign: string;
  platform: MessagePlatform;
  eventTime: string;
  responseContent?: string;
}

export interface CreateCampaignDto {
  title: string;
  description?: string;
  type: CampaignType;
  platforms: MessagePlatform[];
  messageContent: string;
  subject?: string;
  recipients: string[];
  scheduledAt?: Date;
  metadata?: Record<string, any>;
}

export interface UpdateCampaignDto extends Partial<CreateCampaignDto> {
  status?: CampaignStatus;
  isActive?: boolean;
}

export interface AnalyticsQuery {
  startDate?: Date;
  endDate?: Date;
  campaignType?: CampaignType;
  status?: CampaignStatus;
  platform?: MessagePlatform;
  engagementStatus?: EngagementStatus;
  page?: number;
  limit?: number;
}

export const messageAnalyticsService = {
  /**
   * Create a new message campaign
   */
  createCampaign: (teacherId: string, data: CreateCampaignDto): Promise<ApiResponse<MessageCampaign>> => {
    return api.post<MessageCampaign>(`/teachers/${teacherId}/message-analytics/campaigns`, data);
  },

  /**
   * Get all campaigns for a teacher
   */
  getCampaigns: (
    teacherId: string,
    query?: AnalyticsQuery
  ): Promise<ApiResponse<{ campaigns: MessageCampaign[]; total: number }>> => {
    const params = new URLSearchParams();
    if (query?.startDate) params.append('startDate', query.startDate.toISOString());
    if (query?.endDate) params.append('endDate', query.endDate.toISOString());
    if (query?.campaignType) params.append('campaignType', query.campaignType);
    if (query?.status) params.append('status', query.status);
    if (query?.platform) params.append('platform', query.platform);
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());

    const queryString = params.toString();
    const endpoint = queryString
      ? `/teachers/${teacherId}/message-analytics/campaigns?${queryString}`
      : `/teachers/${teacherId}/message-analytics/campaigns`;

    return api.get(endpoint);
  },

  /**
   * Get a specific campaign
   */
  getCampaignById: (teacherId: string, campaignId: string): Promise<ApiResponse<MessageCampaign>> => {
    return api.get<MessageCampaign>(`/teachers/${teacherId}/message-analytics/campaigns/${campaignId}`);
  },

  /**
   * Update a campaign
   */
  updateCampaign: (
    teacherId: string,
    campaignId: string,
    data: UpdateCampaignDto
  ): Promise<ApiResponse<MessageCampaign>> => {
    return api.put<MessageCampaign>(`/teachers/${teacherId}/message-analytics/campaigns/${campaignId}`, data);
  },

  /**
   * Delete a campaign
   */
  deleteCampaign: (teacherId: string, campaignId: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/teachers/${teacherId}/message-analytics/campaigns/${campaignId}`);
  },

  /**
   * Send a campaign
   */
  sendCampaign: (teacherId: string, campaignId: string): Promise<ApiResponse<MessageCampaign>> => {
    return api.post<MessageCampaign>(`/teachers/${teacherId}/message-analytics/campaigns/${campaignId}/send`, {});
  },

  /**
   * Get overall analytics
   */
  getOverallAnalytics: (teacherId: string, query?: AnalyticsQuery): Promise<ApiResponse<OverallAnalytics>> => {
    const params = new URLSearchParams();
    if (query?.startDate) params.append('startDate', query.startDate.toISOString());
    if (query?.endDate) params.append('endDate', query.endDate.toISOString());

    const queryString = params.toString();
    const endpoint = queryString
      ? `/teachers/${teacherId}/message-analytics/analytics/overview?${queryString}`
      : `/teachers/${teacherId}/message-analytics/analytics/overview`;

    return api.get<OverallAnalytics>(endpoint);
  },

  /**
   * Get student engagement data
   */
  getStudentEngagement: (
    teacherId: string,
    query?: AnalyticsQuery
  ): Promise<ApiResponse<{ students: StudentEngagement[]; total: number }>> => {
    const params = new URLSearchParams();
    if (query?.engagementStatus) params.append('engagementStatus', query.engagementStatus);
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());

    const queryString = params.toString();
    const endpoint = queryString
      ? `/teachers/${teacherId}/message-analytics/analytics/student-engagement?${queryString}`
      : `/teachers/${teacherId}/message-analytics/analytics/student-engagement`;

    return api.get(endpoint);
  },

  /**
   * Get best performing templates
   */
  getBestTemplates: (teacherId: string, limit?: number): Promise<ApiResponse<BestTemplate[]>> => {
    const endpoint = limit
      ? `/teachers/${teacherId}/message-analytics/analytics/best-templates?limit=${limit}`
      : `/teachers/${teacherId}/message-analytics/analytics/best-templates`;

    return api.get<BestTemplate[]>(endpoint);
  },

  /**
   * Get recent activity
   */
  getRecentActivity: (teacherId: string, limit?: number): Promise<ApiResponse<RecentActivity[]>> => {
    const endpoint = limit
      ? `/teachers/${teacherId}/message-analytics/analytics/recent-activity?limit=${limit}`
      : `/teachers/${teacherId}/message-analytics/analytics/recent-activity`;

    return api.get<RecentActivity[]>(endpoint);
  },
};
