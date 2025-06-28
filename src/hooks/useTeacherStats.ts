import { useState, useEffect } from 'react';
import { teacherService } from '@/integrations/api/services/teacher.service';
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
    if (!teacherId) {
      setError('No teacher ID provided');
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      const response = await teacherService.getTeacherStats(teacherId);

      if (response.error) {
        setError(response.error.message || 'Failed to fetch stats data');
        return;
      }

      if (response.data) {
        setStatsData(response.data);
      }
    } catch (err) {
      console.error('Error fetching teacher stats data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchData();
    }
  }, [teacherId]);

  // Set up auto-refresh
  useEffect(() => {
    if (!teacherId || !refreshInterval) return;

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