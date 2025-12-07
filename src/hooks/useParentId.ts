import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { parentService } from '@/services/parent.service';

interface UseParentIdReturn {
  parentId: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useParentId = (): UseParentIdReturn => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [parentId, setParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (user?.parentId) {
      // Use parentId directly from user context
      setParentId(user.parentId);
      setLoading(false);
      setError(null);
    } else if (user?.id) {
      // Fallback to API call if parentId not available in context
      fetchParentProfile();
    } else {
      setParentId(null);
      setLoading(false);
      setError('No authenticated user or user ID found.');
    }
  }, [user, isAuthLoading]);

  const fetchParentProfile = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const profile = await parentService.getProfile();
      setParentId(profile._id);
      setError(null);
    } catch (err) {
      setError('Failed to fetch parent profile');
      setParentId(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    if (user?.parentId) {
      // Use parentId directly from user context
      setParentId(user.parentId);
      setLoading(false);
      setError(null);
    } else if (user?.id) {
      fetchParentProfile();
    } else {
      setParentId(null);
      setLoading(false);
      setError('No authenticated user or user ID found.');
    }
  };

  return {
    parentId,
    loading,
    error,
    refetch,
  };
};