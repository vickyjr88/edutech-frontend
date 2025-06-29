import { useState, useEffect } from 'react';
import { teacherService } from '@/integrations/api';
import type { TeacherBalance } from '@/integrations/api';

export const useTeacherBalance = () => {
  const [balance, setBalance] = useState<TeacherBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await teacherService.getTeacherBalance();
        if (response.data) {
          setBalance(response.data);
        }
      } catch (err) {
        console.error('Error fetching teacher balance:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const refetch = async () => {
    await fetchBalance();
  };

  return {
    balance,
    isLoading,
    error,
    refetch
  };
};