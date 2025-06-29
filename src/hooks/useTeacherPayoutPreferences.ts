import { useState, useEffect, useCallback } from 'react';
import { teacherService } from '@/integrations/api';
import type { 
  TeacherPayoutPreferences, 
  PayoutRecommendation, 
  PayoutAnalytics, 
  UpdatePayoutPreferencesRequest,
  TeacherTier 
} from '@/integrations/api';
import {useAuth} from "@/contexts/AuthContext.tsx";

interface UseTeacherPayoutPreferencesReturn {
  // Core data
  preferences: TeacherPayoutPreferences | null;
  recommendations: PayoutRecommendation[];
  analytics: PayoutAnalytics | null;
  teacherTier: TeacherTier | null;
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  isLoadingRecommendations: boolean;
  isLoadingAnalytics: boolean;
  isRequestingPayout: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  updatePreferences: (data: UpdatePayoutPreferencesRequest) => Promise<TeacherPayoutPreferences | null>;
  refreshPreferences: () => void;
  refreshRecommendations: () => void;
  refreshAnalytics: () => void;
  requestInstantPayout: (amount?: number) => Promise<{ success: boolean; transactionId: string; processingTime: string } | null>;
}

export const useTeacherPayoutPreferences = (): UseTeacherPayoutPreferencesReturn => {
  // State
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<TeacherPayoutPreferences | null>(null);
  const [recommendations, setRecommendations] = useState<PayoutRecommendation[]>([]);
  const [analytics, setAnalytics] = useState<PayoutAnalytics | null>(null);
  const [teacherTier, setTeacherTier] = useState<TeacherTier | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Fetch payout preferences
  const fetchPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [preferencesResponse, tierResponse] = await Promise.all([
        teacherService.getPayoutPreferences(user.teacherId),
        teacherService.getTeacherTier()
      ]);
      
      if (preferencesResponse.data) {
        setPreferences(preferencesResponse.data);
      }
      
      if (tierResponse.data) {
        setTeacherTier(tierResponse.data);
      }
    } catch (err) {
      console.error('Error fetching payout preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch payout preferences');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch recommendations
  const fetchRecommendations = useCallback(async () => {
    try {
      setIsLoadingRecommendations(true);
      setError(null);
      
      const response = await teacherService.getPayoutRecommendations();
      if (response.data) {
        setRecommendations(response.data);
      }
    } catch (err) {
      console.error('Error fetching payout recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, []);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoadingAnalytics(true);
      setError(null);
      
      const response = await teacherService.getPayoutAnalytics();
      if (response.data) {
        setAnalytics(response.data);
      }
    } catch (err) {
      console.error('Error fetching payout analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  // Update preferences
  const updatePreferences = async (data: UpdatePayoutPreferencesRequest): Promise<TeacherPayoutPreferences | null> => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const response = await teacherService.updatePayoutPreferences(user.teacherId,data);
      if (response.data) {
        setPreferences(response.data);
        
        // Refresh recommendations and analytics after update
        fetchRecommendations();
        fetchAnalytics();
        
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Error updating payout preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  // Request instant payout
  const requestInstantPayout = async (amount?: number) => {
    try {
      setIsRequestingPayout(true);
      setError(null);
      
      const response = await teacherService.requestInstantPayout(amount);
      if (response.data) {
        // Refresh analytics to reflect the new payout
        setTimeout(() => {
          fetchAnalytics();
        }, 1000);
        
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Error requesting instant payout:', err);
      setError(err instanceof Error ? err.message : 'Failed to request instant payout');
      return null;
    } finally {
      setIsRequestingPayout(false);
    }
  };

  // Refresh functions
  const refreshPreferences = () => {
    fetchPreferences();
  };

  const refreshRecommendations = () => {
    fetchRecommendations();
  };

  const refreshAnalytics = () => {
    fetchAnalytics();
  };

  // Initial load
  useEffect(() => {
    fetchPreferences();
    fetchRecommendations();
    fetchAnalytics();
  }, [fetchPreferences, fetchRecommendations, fetchAnalytics]);

  return {
    // Core data
    preferences,
    recommendations,
    analytics,
    teacherTier,
    
    // Loading states
    isLoading,
    isUpdating,
    isLoadingRecommendations,
    isLoadingAnalytics,
    isRequestingPayout,
    
    // Error state
    error,
    
    // Actions
    updatePreferences,
    refreshPreferences,
    refreshRecommendations,
    refreshAnalytics,
    requestInstantPayout
  };
};