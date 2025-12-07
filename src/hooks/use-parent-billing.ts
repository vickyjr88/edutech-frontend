import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parentService } from '../integrations/api/services/parent.service';

/**
 * Get billing dashboard data
 */
export const useGetBillingDashboard = () => {
  return useQuery({
    queryKey: ['billing', 'dashboard'],
    queryFn: () => parentService.getBillingDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get payment history (invoices)
 */
export const useGetPaymentHistory = () => {
  return useQuery({
    queryKey: ['billing', 'payment-history'],
    queryFn: () => parentService.getPaymentHistory(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get all payment methods
 */
export const useGetPaymentMethods = () => {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => parentService.getPaymentMethods(),
  });
};

/**
 * Get default payment method
 */
export const useGetDefaultPaymentMethod = () => {
  return useQuery({
    queryKey: ['payment-methods', 'default'],
    queryFn: () => parentService.getDefaultPaymentMethod(),
  });
};

/**
 * Create a new payment method
 */
export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => parentService.createPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      queryClient.invalidateQueries({ queryKey: ['billing'] });
    },
  });
};

/**
 * Update a payment method
 */
export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      parentService.updatePaymentMethod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

/**
 * Delete a payment method
 */
export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => parentService.deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

/**
 * Get unpaid enrollments
 */
export const useGetUnpaidEnrollments = () => {
  return useQuery({
    queryKey: ['billing', 'unpaid-enrollments'],
    queryFn: () => parentService.getUnpaidEnrollments(),
  });
};

/**
 * Pay for enrollment
 */
export const usePayForEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => parentService.payForEnrollment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
    },
  });
};
