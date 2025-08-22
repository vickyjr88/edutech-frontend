import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { studentService } from '@/integrations/api/services/student.service';

interface UseStudentIdReturn {
  studentId: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useStudentId = (): UseStudentIdReturn => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (user?.studentId) {
      setStudentId(user.studentId);
      setLoading(false);
      setError(null);
    } else if (user?.id) {
      fetchStudentProfile();
    } else {
      setStudentId(null);
      setLoading(false);
      setError('No authenticated user or user ID found.');
    }
  }, [user, isAuthLoading]);

  const fetchStudentProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await studentService.getProfileByUserId(user.id);
      if (response.data?.id) {
        setStudentId(response.data.id);
      } else {
        setError('Student profile not found');
        setStudentId(null);
      }
    } catch (err) {
      setError('Failed to fetch student profile');
      setStudentId(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    if (user?.studentId) {
      setStudentId(user.studentId);
      setLoading(false);
      setError(null);
    } else if (user?.id) {
      fetchStudentProfile();
    } else {
      setStudentId(null);
      setLoading(false);
      setError('No authenticated user or user ID found.');
    }
  };

  return {
    studentId,
    loading,
    error,
    refetch,
  };
};