import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { teacherService } from '@/integrations/api/services/teacher.service';

interface UseTeacherIdReturn {
  teacherId: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTeacherId = (): UseTeacherIdReturn => {
  const { user } = useAuth();
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeacherId = async () => {
    try {
      setError(null);
      setLoading(true);

      // First try to get teacherId from user object
      if (user?.teacherId) {
        setTeacherId(user.teacherId);
        setLoading(false);
        return;
      }

      // If not available in user object, get current teacher profile
      if (user?.id) {
        const response = await teacherService.getCurrentProfile();
        
        if (response.error) {
          setError(response.error.message || 'Failed to fetch teacher profile');
          return;
        }

        if (response.data) {
          setTeacherId(response.data.id);
        } else {
          setError('No teacher profile found');
        }
      } else {
        setError('No authenticated user found');
      }
    } catch (err) {
      console.error('Error fetching teacher ID:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTeacherId();
    } else {
      setTeacherId(null);
      setLoading(false);
    }
  }, [user]);

  const refetch = () => {
    fetchTeacherId();
  };

  return {
    teacherId,
    loading,
    error,
    refetch,
  };
};