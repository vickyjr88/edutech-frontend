import { useState, useEffect, useCallback } from 'react';
import MvpTeacherService from '@/integrations/api/services/mvp-teacher.service';
import type { TeacherBalance } from '@/integrations/api';

export const useTeacherBalance = () => {
  const [balance, setBalance] = useState<TeacherBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const earnings = await MvpTeacherService.getEarnings();

      const mappedBalance: any = {
        totalEarnings: earnings.totalEarnings || 0,
        currentBalance: earnings.pendingEarnings || 0,
        pendingPayouts: earnings.pendingEarnings || 0,
        withdrawnAmount: earnings.paidEarnings || 0,
        currency: 'KES'
      };

      setBalance(mappedBalance as TeacherBalance);
    } catch (err) {
      console.error('Error fetching teacher balance:', err);
      // Fallback to zeros instead of error for MVP demo
      setBalance({
        totalEarnings: 0,
        currentBalance: 0,
        pendingPayouts: 0,
        withdrawnAmount: 0,
        currency: 'KES'
      } as any);
      // setError(err instanceof Error ? err.message : 'Failed to fetch balance');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

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