import { useState, useEffect } from 'react';
import { teacherService } from '@/integrations/api/services/teacher.service';
import { TeacherSummaryResponse } from '@/types/enhanced-classes';

interface UseTeacherSummaryParams {
  teacherId: string;
  refreshInterval?: number; // in milliseconds
}

interface UseTeacherSummaryReturn {
  summaryData: TeacherSummaryResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTeacherSummary = ({
  teacherId,
  refreshInterval = 60000, // 60 seconds
}: UseTeacherSummaryParams): UseTeacherSummaryReturn => {
  const [summaryData, setSummaryData] = useState<TeacherSummaryResponse | null>(null);
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
      const response = await teacherService.getTeacherSummary(teacherId);

      if (response.error) {
        setError(response.error.message || 'Failed to fetch teacher summary data');
        return;
      }

      if (response.data) {
        setSummaryData(response.data);
      }
    } catch (err) {
      console.error('Error fetching teacher summary data:', err);
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
    summaryData,
    loading,
    error,
    refetch,
  };
};