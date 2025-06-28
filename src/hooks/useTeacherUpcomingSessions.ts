import { useState, useEffect } from 'react';
import { teacherService } from '@/integrations/api/services/teacher.service';
import { UpcomingSession } from '@/types/activity';

interface UseTeacherUpcomingSessionsParams {
  teacherId: string;
  refreshInterval?: number; // in milliseconds
}

interface UseTeacherUpcomingSessionsReturn {
  upcomingSessions: UpcomingSession[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTeacherUpcomingSessions = ({
  teacherId,
  refreshInterval = 60000, // 60 seconds
}: UseTeacherUpcomingSessionsParams): UseTeacherUpcomingSessionsReturn => {
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
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
      const response = await teacherService.getTeacherUpcomingSessions(teacherId);

      if (response.error) {
        setError(response.error.message || 'Failed to fetch upcoming sessions');
        return;
      }

      if (response.data) {
        // Sort sessions by start time (earliest first)
        const sortedSessions = response.data.sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        setUpcomingSessions(sortedSessions);
      }
    } catch (err) {
      console.error('Error fetching upcoming sessions:', err);
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
    upcomingSessions,
    loading,
    error,
    refetch,
  };
};