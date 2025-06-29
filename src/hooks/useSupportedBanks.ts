import { useState, useEffect } from 'react';
import { teacherService } from '@/integrations/api';
import type { Bank } from '@/integrations/api';

interface UseSupportedBanksReturn {
  banks: Bank[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useSupportedBanks = (): UseSupportedBanksReturn => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await teacherService.getSupportedBanks();
      if (response.data) {
        setBanks(response.data);
      }
    } catch (err) {
      console.error('Error fetching supported banks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch supported banks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const refetch = () => {
    fetchBanks();
  };

  return {
    banks,
    isLoading,
    error,
    refetch
  };
};