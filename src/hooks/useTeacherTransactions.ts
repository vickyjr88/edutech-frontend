import { useState, useEffect, useCallback } from 'react';
import { teacherService } from '@/integrations/api';
import type { TeacherTransaction, TeacherTransactionsQuery } from '@/integrations/api';

interface UseTeacherTransactionsReturn {
  transactions: TeacherTransaction[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  hasMore: boolean;
  totalCount: number;
}

export const useTeacherTransactions = (
  params: TeacherTransactionsQuery = {}
): UseTeacherTransactionsReturn => {
  const [transactions, setTransactions] = useState<TeacherTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await teacherService.getAllTransactions(params);
      if (response.data) {
        setTransactions(response.data);
        // Note: If the API returns pagination info, we'd extract totalCount from response
        // For now, we'll estimate based on the returned data
        setTotalCount(response.data.length);
      }
    } catch (err) {
      console.error('Error fetching teacher transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const refetch = useCallback(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const hasMore = params.limit ? transactions.length >= params.limit : false;

  return {
    transactions,
    isLoading,
    error,
    refetch,
    hasMore,
    totalCount
  };
};