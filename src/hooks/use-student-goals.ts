// src/hooks/use-student-goals.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalService, Goal, CreateGoalRequest, UpdateGoalRequest } from '@/integrations/api/services/goal.service';
import { useToast } from '@/hooks/use-toast';

export const useStudentGoals = (studentId: string, filters?: {
  type?: 'academic' | 'non-academic' | 'all';
  status?: 'active' | 'completed' | 'cancelled';
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch goals
  const {
    data: goalsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['student-goals', studentId, filters],
    queryFn: () => goalService.getStudentGoals(studentId, filters),
    enabled: !!studentId,
  });

  // Fetch goal statistics
  const { data: statsResponse } = useQuery({
    queryKey: ['goal-stats', studentId],
    queryFn: () => goalService.getGoalStats(studentId),
    enabled: !!studentId,
  });

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: (goalData: CreateGoalRequest) =>
      goalService.createGoal(studentId, goalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-goals', studentId] });
      queryClient.invalidateQueries({ queryKey: ['goal-stats', studentId] });
      toast({
        title: 'Goal Created',
        description: 'Your new goal has been created successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create goal',
        variant: 'destructive',
      });
    },
  });

  // Update goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: ({ goalId, updates }: { goalId: string; updates: UpdateGoalRequest }) =>
      goalService.updateGoal(studentId, goalId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-goals', studentId] });
      queryClient.invalidateQueries({ queryKey: ['goal-stats', studentId] });
      toast({
        title: 'Goal Updated',
        description: 'Your goal has been updated successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update goal',
        variant: 'destructive',
      });
    },
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: ({ goalId, progress }: { goalId: string; progress: number }) =>
      goalService.updateProgress(studentId, goalId, progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-goals', studentId] });
      queryClient.invalidateQueries({ queryKey: ['goal-stats', studentId] });
      toast({
        title: 'Progress Updated',
        description: 'Your progress has been updated!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update progress',
        variant: 'destructive',
      });
    },
  });

  // Complete goal mutation
  const completeGoalMutation = useMutation({
    mutationFn: (goalId: string) => goalService.completeGoal(studentId, goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-goals', studentId] });
      queryClient.invalidateQueries({ queryKey: ['goal-stats', studentId] });
      toast({
        title: 'Goal Completed! 🎉',
        description: 'Congratulations on completing your goal!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete goal',
        variant: 'destructive',
      });
    },
  });

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: (goalId: string) => goalService.deleteGoal(studentId, goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-goals', studentId] });
      queryClient.invalidateQueries({ queryKey: ['goal-stats', studentId] });
      toast({
        title: 'Goal Deleted',
        description: 'Your goal has been deleted.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete goal',
        variant: 'destructive',
      });
    },
  });

  return {
    goals: goalsResponse?.data?.goals || [],
    stats: statsResponse?.data,
    isLoading,
    error,
    refetch,
    createGoal: createGoalMutation.mutate,
    updateGoal: updateGoalMutation.mutate,
    updateProgress: updateProgressMutation.mutate,
    completeGoal: completeGoalMutation.mutate,
    deleteGoal: deleteGoalMutation.mutate,
    isCreating: createGoalMutation.isPending,
    isUpdating: updateGoalMutation.isPending,
    isDeleting: deleteGoalMutation.isPending,
  };
};
