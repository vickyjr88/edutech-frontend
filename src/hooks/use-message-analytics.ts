import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  messageAnalyticsService,
  CreateCampaignDto,
  UpdateCampaignDto,
  AnalyticsQuery,
} from '../integrations/api/services/message-analytics.service';

/**
 * Get all campaigns for current teacher
 */
export const useGetCampaigns = (query?: AnalyticsQuery) => {
  const { user } = useAuth();
  const teacherId = user?.teacherId;

  return useQuery({
    queryKey: ['message-campaigns', teacherId, query],
    queryFn: () => messageAnalyticsService.getCampaigns(teacherId!, query),
    enabled: !!teacherId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get a single campaign by ID
 */
export const useGetCampaign = (campaignId: string) => {
  const { user } = useAuth();
  const teacherId = user?.teacherId;

  return useQuery({
    queryKey: ['message-campaigns', teacherId, campaignId],
    queryFn: () => messageAnalyticsService.getCampaignById(teacherId!, campaignId),
    enabled: !!teacherId && !!campaignId,
  });
};

/**
 * Create a new campaign
 */
export const useCreateCampaign = () => {
  const { user } = useAuth();
  const teacherId = user?.teacherId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCampaignDto) =>
      messageAnalyticsService.createCampaign(teacherId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-campaigns', teacherId] });
      queryClient.invalidateQueries({ queryKey: ['message-analytics', teacherId] });
    },
  });
};

/**
 * Update a campaign
 */
export const useUpdateCampaign = () => {
  const { user } = useAuth();
  const teacherId = user?.teacherId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ campaignId, data }: { campaignId: string; data: UpdateCampaignDto }) =>
      messageAnalyticsService.updateCampaign(teacherId!, campaignId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['message-campaigns', teacherId] });
      queryClient.invalidateQueries({ queryKey: ['message-campaigns', teacherId, variables.campaignId] });
    },
  });
};

/**
 * Delete a campaign
 */
export const useDeleteCampaign = () => {
  const { user } = useAuth();
  const teacherId = user?.teacherId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId: string) =>
      messageAnalyticsService.deleteCampaign(teacherId!, campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-campaigns', teacherId] });
    },
  });
};

/**
 * Send a campaign
 */
export const useSendCampaign = () => {
  const { user } = useAuth();
  const teacherId = user?.teacherId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId: string) =>
      messageAnalyticsService.sendCampaign(teacherId!, campaignId),
    onSuccess: (_, campaignId) => {
      queryClient.invalidateQueries({ queryKey: ['message-campaigns', teacherId] });
      queryClient.invalidateQueries({ queryKey: ['message-campaigns', teacherId, campaignId] });
      queryClient.invalidateQueries({ queryKey: ['message-analytics', teacherId] });
    },
  });
};

/**
 * Get overall analytics
 */
export const useGetOverallAnalytics = (query?: AnalyticsQuery) => {
  const { user } = useAuth();
  const teacherId = user?.teacherId;

  return useQuery({
    queryKey: ['message-analytics', 'overview', teacherId, query],
    queryFn: () => messageAnalyticsService.getOverallAnalytics(teacherId!, query),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get student engagement data
 */
export const useGetStudentEngagement = (query?: AnalyticsQuery) => {
  const { user } = useAuth();
  const teacherId = user?.teacherId;

  return useQuery({
    queryKey: ['message-analytics', 'engagement', teacherId, query],
    queryFn: () => messageAnalyticsService.getStudentEngagement(teacherId!, query),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get best performing templates
 */
export const useGetBestTemplates = (limit?: number) => {
  const { user } = useAuth();
  const teacherId = user?.teacherId;

  return useQuery({
    queryKey: ['message-analytics', 'best-templates', teacherId, limit],
    queryFn: () => messageAnalyticsService.getBestTemplates(teacherId!, limit),
    enabled: !!teacherId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Get recent activity
 */
export const useGetRecentActivity = (limit?: number) => {
  const { user } = useAuth();
  const teacherId = user?.teacherId;

  return useQuery({
    queryKey: ['message-analytics', 'recent-activity', teacherId, limit],
    queryFn: () => messageAnalyticsService.getRecentActivity(teacherId!, limit),
    enabled: !!teacherId,
    staleTime: 1 * 60 * 1000, // 1 minute (fresher data for activity)
  });
};
