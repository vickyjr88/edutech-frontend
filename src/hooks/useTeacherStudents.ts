import { useState, useEffect } from 'react';
import { teacherService } from '@/integrations/api/services/teacher.service';
import { TeacherStudentsData } from '@/types/activity';

interface UseTeacherStudentsParams {
  teacherId: string;
  refreshInterval?: number; // in milliseconds
}

interface UseTeacherStudentsReturn {
  studentsData: TeacherStudentsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTeacherStudents = ({
  teacherId,
  refreshInterval = 60000, // 60 seconds
}: UseTeacherStudentsParams): UseTeacherStudentsReturn => {
  const [studentsData, setStudentsData] = useState<TeacherStudentsData | null>(null);
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
      const response = await teacherService.getTeacherStudentsWithStats(teacherId);

      if (response.error) {
        setError(response.error.message || 'Failed to fetch students data');
        return;
      }

      if (response.data) {
        setStudentsData(response.data);
      }
    } catch (err) {
      console.error('Error fetching teacher students data:', err);
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
    studentsData,
    loading,
    error,
    refetch,
  };
};