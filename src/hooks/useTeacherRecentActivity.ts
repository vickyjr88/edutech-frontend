import { useState, useEffect } from 'react';
import { teacherService } from '@/integrations/api/services/teacher.service';
import { Activity, TeacherDashboardData } from '@/types/activity';

interface UseTeacherRecentActivityParams {
  teacherId: string;
  limit?: number;
  days?: number;
  refreshInterval?: number; // in milliseconds
}

interface UseTeacherRecentActivityReturn {
  activities: Activity[];
  dashboardData: TeacherDashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTeacherRecentActivity = ({
  teacherId,
  limit = 10,
  days = 7,
  refreshInterval = 30000, // 30 seconds
}: UseTeacherRecentActivityParams): UseTeacherRecentActivityReturn => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!teacherId) {
      setError('No teacher ID provided');
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      const response = await teacherService.getTeacherDashboard(teacherId, {
        limit,
        days,
      });

      if (response.error) {
        setError(response.error.message || 'Failed to fetch dashboard data');
        return;
      }

      if (response.data) {
        setDashboardData(response.data);
        // Transform the activity data to ensure proper Date objects
        const transformedActivities = response.data.recentActivity.map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp),
          details: activity.details ? {
            ...activity.details,
            startDate: activity.details.startDate ? new Date(activity.details.startDate) : undefined,
            endDate: activity.details.endDate ? new Date(activity.details.endDate) : undefined,
          } : undefined,
        }));
        setActivities(transformedActivities);
      }
    } catch (err) {
      console.error('Error fetching teacher dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchData();
    }
  }, [teacherId, limit, days]);

  // Set up auto-refresh
  useEffect(() => {
    if (!teacherId || !refreshInterval) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [teacherId, refreshInterval, limit, days]);

  const refetch = () => {
    setLoading(true);
    fetchData();
  };

  return {
    activities,
    dashboardData,
    loading,
    error,
    refetch,
  };
};