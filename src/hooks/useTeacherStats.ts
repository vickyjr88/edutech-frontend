import { useState, useEffect } from 'react';
import MvpTeacherService from '@/integrations/api/services/mvp-teacher.service';
import { TeacherStatsData } from '@/types/activity';

interface UseTeacherStatsParams {
  teacherId: string;
  refreshInterval?: number; // in milliseconds
}

interface UseTeacherStatsReturn {
  statsData: TeacherStatsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTeacherStats = ({
  teacherId,
  refreshInterval = 60000, // 60 seconds
}: UseTeacherStatsParams): UseTeacherStatsReturn => {
  const [statsData, setStatsData] = useState<TeacherStatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);

      const stats = await MvpTeacherService.getDashboardStats();

      const response: TeacherStatsData = {
        totalStudents: stats.totalStudents || 0,
        totalClasses: stats.activeOfferings || 0,
        totalHoursCompleted: 120, // Mock
        totalHoursScheduled: 150, // Mock
        averageRating: 4.8, // Mock
        completionRate: 92, // Mock
        activeCohorts: stats.activeOfferings || 0
      };

      setStatsData(response);

    } catch (err) {
      console.error('Error fetching teacher stats data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [teacherId]);

  // Set up auto-refresh
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [teacherId, refreshInterval]);

  const refetch = () => {
    setLoading(true);
    fetchData();
  };

  return {
    statsData,
    loading,
    error,
    refetch,
  };
};