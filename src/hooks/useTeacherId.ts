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
  const { user, isLoading: isAuthLoading } = useAuth();
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (user?.teacherId) {
      // Use teacherId directly from user context
      setTeacherId(user.teacherId);
      setLoading(false);
      setError(null);
    } else if (user?.id) {
      // Fallback to API call if teacherId not available in context
      fetchTeacherProfile();
    } else {
      setTeacherId(null);
      setLoading(false);
      setError('No authenticated user or user ID found.');
    }
  }, [user, isAuthLoading]);

  const fetchTeacherProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await teacherService.getProfileByUserId(user.id);
      if (response.data?.id) {
        setTeacherId(response.data.id);
      } else {
        setError('Teacher profile not found');
        setTeacherId(null);
      }
    } catch (err) {
      setError('Failed to fetch teacher profile');
      setTeacherId(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    if (user?.teacherId) {
      // Use teacherId directly from user context
      setTeacherId(user.teacherId);
      setLoading(false);
      setError(null);
    } else if (user?.id) {
      fetchTeacherProfile();
    } else {
      setTeacherId(null);
      setLoading(false);
      setError('No authenticated user or user ID found.');
    }
  };

  return {
    teacherId,
    loading,
    error,
    refetch,
  };
};