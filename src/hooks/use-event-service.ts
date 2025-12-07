import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService, CreateEventDto, UpdateEventDto, EventFilters, EventType } from '../integrations/api/services/event.service';
import { useStudentId } from './useStudentId';

/**
 * Get all events for current student with optional filtering
 */
export const useGetEvents = (filters?: EventFilters) => {
  const { studentId } = useStudentId();

  return useQuery({
    queryKey: ['events', studentId, filters],
    queryFn: () => eventService.getAll(studentId!, filters),
    enabled: !!studentId,
  });
};

/**
 * Get events within a date range (for calendar views)
 */
export const useGetEventsByDateRange = (startDate: Date, endDate: Date) => {
  const { studentId } = useStudentId();

  return useQuery({
    queryKey: ['events', 'date-range', studentId, startDate.toISOString(), endDate.toISOString()],
    queryFn: () => eventService.getByDateRange(studentId!, startDate, endDate),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get upcoming events
 */
export const useGetUpcomingEvents = (limit: number = 10) => {
  const { studentId } = useStudentId();

  return useQuery({
    queryKey: ['events', 'upcoming', studentId, limit],
    queryFn: () => eventService.getUpcoming(studentId!, limit),
    enabled: !!studentId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Get event counts by type
 */
export const useGetEventsByType = () => {
  const { studentId } = useStudentId();

  return useQuery({
    queryKey: ['events', 'by-type', studentId],
    queryFn: () => eventService.getByType(studentId!),
    enabled: !!studentId,
  });
};

/**
 * Get a specific event by ID
 */
export const useGetEvent = (eventId: string) => {
  const { studentId } = useStudentId();

  return useQuery({
    queryKey: ['events', studentId, eventId],
    queryFn: () => eventService.getById(studentId!, eventId),
    enabled: !!studentId && !!eventId,
  });
};

/**
 * Create a new event
 */
export const useCreateEvent = () => {
  const { studentId } = useStudentId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventDto) => eventService.create(studentId!, data),
    onSuccess: () => {
      // Invalidate all event queries to refetch
      queryClient.invalidateQueries({ queryKey: ['events', studentId] });
    },
  });
};

/**
 * Update an event
 */
export const useUpdateEvent = () => {
  const { studentId } = useStudentId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: UpdateEventDto }) =>
      eventService.update(studentId!, eventId, data),
    onSuccess: (_, variables) => {
      // Invalidate all event queries
      queryClient.invalidateQueries({ queryKey: ['events', studentId] });
      // Also invalidate the specific event query
      queryClient.invalidateQueries({ queryKey: ['events', studentId, variables.eventId] });
    },
  });
};

/**
 * Delete an event
 */
export const useDeleteEvent = () => {
  const { studentId } = useStudentId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, permanent = false }: { eventId: string; permanent?: boolean }) =>
      eventService.delete(studentId!, eventId, permanent),
    onSuccess: () => {
      // Invalidate all event queries to refetch
      queryClient.invalidateQueries({ queryKey: ['events', studentId] });
    },
  });
};
