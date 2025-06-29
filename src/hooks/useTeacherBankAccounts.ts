import { useState, useEffect, useCallback } from 'react';
import { teacherService } from '@/integrations/api';
import type { TeacherBankAccount, AddBankAccountRequest, UpdateBankAccountRequest } from '@/integrations/api';

interface UseTeacherBankAccountsReturn {
  bankAccounts: TeacherBankAccount[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  addBankAccount: (data: AddBankAccountRequest) => Promise<TeacherBankAccount | null>;
  updateBankAccount: (accountId: string, data: UpdateBankAccountRequest) => Promise<TeacherBankAccount | null>;
  deleteBankAccount: (accountId: string) => Promise<boolean>;
  setPrimaryAccount: (accountId: string) => Promise<TeacherBankAccount | null>;
  isSubmitting: boolean;
}

export const useTeacherBankAccounts = (): UseTeacherBankAccountsReturn => {
  const [bankAccounts, setBankAccounts] = useState<TeacherBankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBankAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await teacherService.getTeacherBankAccounts();
      if (response.data) {
        setBankAccounts(response.data);
      }
    } catch (err) {
      console.error('Error fetching teacher bank accounts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bank accounts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBankAccounts();
  }, [fetchBankAccounts]);

  const addBankAccount = async (data: AddBankAccountRequest): Promise<TeacherBankAccount | null> => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await teacherService.addBankAccount(data);
      if (response.data) {
        // Refresh the list to get updated data
        await fetchBankAccounts();
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Error adding bank account:', err);
      setError(err instanceof Error ? err.message : 'Failed to add bank account');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateBankAccount = async (accountId: string, data: UpdateBankAccountRequest): Promise<TeacherBankAccount | null> => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await teacherService.updateBankAccount(accountId, data);
      if (response.data) {
        // Update local state
        setBankAccounts(prev => 
          prev.map(account => 
            account._id === accountId ? response.data! : account
          )
        );
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Error updating bank account:', err);
      setError(err instanceof Error ? err.message : 'Failed to update bank account');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBankAccount = async (accountId: string): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await teacherService.deleteBankAccount(accountId);
      
      // Debug: Log the actual response to understand the structure
      console.log('Delete bank account response:', response);
      
      // Check for successful response - either success field or successful HTTP status
      if (response.data?.success || (response.data !== null && response.error === null)) {
        // Optimistic update: Remove from local state immediately
        setBankAccounts(prev => prev.filter(account => account._id !== accountId));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting bank account:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete bank account');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const setPrimaryAccount = async (accountId: string): Promise<TeacherBankAccount | null> => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await teacherService.setPrimaryBankAccount(accountId);
      if (response.data) {
        // Update local state - set all accounts to non-primary, then set the selected one to primary
        setBankAccounts(prev => 
          prev.map(account => ({
            ...account,
            isPrimary: account._id === accountId
          }))
        );
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Error setting primary bank account:', err);
      setError(err instanceof Error ? err.message : 'Failed to set primary account');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const refetch = () => {
    fetchBankAccounts();
  };

  return {
    bankAccounts,
    isLoading,
    error,
    refetch,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setPrimaryAccount,
    isSubmitting
  };
};