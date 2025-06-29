import { useState, useEffect } from 'react';
import { teacherService } from '@/integrations/api';
import type { TeacherRevenueSummaryResponse, RevenueSummaryRequestParams } from '@/integrations/api';

export const useTeacherRevenueSummary = (params?: RevenueSummaryRequestParams) => {
  const [data, setData] = useState<TeacherRevenueSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenueSummary = async (queryParams?: RevenueSummaryRequestParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await teacherService.getRevenueSummary(queryParams || params);
      
      if (response && response.data) {
        setData(response.data);
      } else {
        setError('Failed to load revenue summary');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load revenue summary');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueSummary();
  }, [JSON.stringify(params)]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchRevenueSummary
  };
};