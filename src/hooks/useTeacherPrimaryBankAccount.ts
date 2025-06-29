import { useState, useEffect } from 'react';
import { teacherService } from '@/integrations/api';
import type { PrimaryBankAccount } from '@/integrations/api';

export const useTeacherPrimaryBankAccount = () => {
  const [data, setData] = useState<PrimaryBankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrimaryBankAccount = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await teacherService.getPrimaryBankAccount();
      
      if (response && response.data) {
        setData(response.data);
      } else {
        setError('No primary bank account found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load primary bank account');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrimaryBankAccount();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchPrimaryBankAccount
  };
};