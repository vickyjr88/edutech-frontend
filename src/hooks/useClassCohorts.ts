import { useState, useEffect, useCallback } from 'react';
import { classService } from '@/integrations/api/services/class.service';

interface Cohort {
  _id: string;
  name: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  currentStudents: number;
  maximumStudents: number;
  minimumStudents: number;
  price: number;
  discount: number;
  daysOfWeek: string[];
  enrollmentDeadline: string;
}

interface UseClassCohortsParams {
  classId: string | null;
  enabled?: boolean;
}

interface UseClassCohortsReturn {
  cohorts: Cohort[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  activeCohortsCount: number;
  availableCohorts: Cohort[];
  suggestedCohort: Cohort | null;
}

export const useClassCohorts = ({
  classId,
  enabled = true,
}: UseClassCohortsParams): UseClassCohortsReturn => {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCohorts = useCallback(async () => {
    if (!classId || !enabled) {
      setCohorts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await classService.getById(classId);
      
      if (response.error) {
        setError(response.error.message || 'Failed to fetch class cohorts');
        return;
      }

      if (response.data && response.data.cohorts) {
        // Transform cohorts data to ensure consistent format
        const transformedCohorts = response.data.cohorts.map((cohort: any) => ({
          _id: cohort._id || cohort.id,
          name: cohort.name || cohort.title || `Cohort ${cohort._id?.slice(-4) || 'Unknown'}`,
          isActive: cohort.isActive ?? true,
          startDate: cohort.startDate || '',
          endDate: cohort.endDate || '',
          startTime: cohort.startTime || '09:00',
          endTime: cohort.endTime || '10:00',
          currentStudents: cohort.currentStudents || 0,
          maximumStudents: cohort.maximumStudents || cohort.maxStudents || 30,
          minimumStudents: cohort.minimumStudents || cohort.minStudents || 1,
          price: cohort.price || 0,
          discount: cohort.discount || 0,
          daysOfWeek: cohort.daysOfWeek || [],
          enrollmentDeadline: cohort.enrollmentDeadline || '',
        }));

        setCohorts(transformedCohorts);
      } else {
        setCohorts([]);
      }
    } catch (err) {
      console.error('Error fetching class cohorts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setCohorts([]);
    } finally {
      setLoading(false);
    }
  }, [classId, enabled]);

  useEffect(() => {
    fetchCohorts();
  }, [fetchCohorts]);

  const refetch = useCallback(() => {
    fetchCohorts();
  }, [fetchCohorts]);

  // Computed values for enhanced UX
  const activeCohortsCount = cohorts.filter(cohort => cohort.isActive).length;
  
  const availableCohorts = cohorts.filter(cohort => 
    cohort.isActive && 
    cohort.currentStudents < cohort.maximumStudents &&
    (!cohort.enrollmentDeadline || new Date(cohort.enrollmentDeadline) > new Date())
  );

  // Smart cohort suggestion based on availability and capacity
  const suggestedCohort = availableCohorts.length > 0 
    ? availableCohorts.reduce((best, current) => {
        const currentCapacityRatio = current.currentStudents / current.maximumStudents;
        const bestCapacityRatio = best.currentStudents / best.maximumStudents;
        
        // Prefer cohorts with lower capacity utilization
        return currentCapacityRatio < bestCapacityRatio ? current : best;
      })
    : null;

  return {
    cohorts,
    loading,
    error,
    refetch,
    activeCohortsCount,
    availableCohorts,
    suggestedCohort,
  };
};