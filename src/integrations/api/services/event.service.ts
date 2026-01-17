// src/integrations/api/services/event.service.ts
import { api, ApiResponse } from '../client';

export enum EventType {
  CLASS = 'class',
  HANGOUT = 'hangout',
  BIRTHDAY = 'birthday',
  ACHIEVEMENT = 'achievement',
  ASSIGNMENT = 'assignment',
  PERSONAL = 'personal',
  OTHER = 'other',
}

export interface StudentEvent {
  _id: string;
  student: string;
  title: string;
  description?: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  type: EventType;
  location?: string;
  duration?: number; // Duration in hours
  allDay?: boolean;
  reminders?: string[]; // Array of ISO date strings
  isRecurring?: boolean;
  recurrencePattern?: string;
  recurrenceEndDate?: string;
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  startDate: string | Date;
  endDate?: string | Date;
  type: EventType;
  location?: string;
  duration?: number;
  allDay?: boolean;
  reminders?: Array<string | Date>;
  isRecurring?: boolean;
  recurrencePattern?: string;
  recurrenceEndDate?: string | Date;
  metadata?: Record<string, any>;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {
  isActive?: boolean;
}

export interface EventFilters {
  type?: EventType;
  startDate?: string | Date;
  endDate?: string | Date;
  isActive?: boolean;
}

export const eventService = {
  /**
   * Create a new event for a student
   */
  create: (studentId: string, data: CreateEventDto): Promise<ApiResponse<StudentEvent>> => {
    return api.post<StudentEvent>(`/students/${studentId}/events`, data);
  },

  /**
   * Get all events for a student with optional filtering
   */
  getAll: (studentId: string, filters?: EventFilters): Promise<ApiResponse<StudentEvent[]>> => {
    const params = new URLSearchParams();

    if (filters?.type) params.append('type', filters.type);
    if (filters?.startDate) {
      const date = typeof filters.startDate === 'string' ? filters.startDate : filters.startDate.toISOString();
      params.append('startDate', date);
    }
    if (filters?.endDate) {
      const date = typeof filters.endDate === 'string' ? filters.endDate : filters.endDate.toISOString();
      params.append('endDate', date);
    }
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

    const queryString = params.toString();
    const endpoint = queryString ? `/students/${studentId}/events?${queryString}` : `/students/${studentId}/events`;

    return api.get<StudentEvent[]>(endpoint);
  },

  /**
   * Get events within a specific date range (for calendar views)
   */
  getByDateRange: (
    studentId: string,
    startDate: string | Date,
    endDate: string | Date,
  ): Promise<ApiResponse<StudentEvent[]>> => {
    const start = typeof startDate === 'string' ? startDate : startDate.toISOString();
    const end = typeof endDate === 'string' ? endDate : endDate.toISOString();

    return api.get<StudentEvent[]>(
      `/students/${studentId}/events/date-range?startDate=${start}&endDate=${end}`
    );
  },

  /**
   * Get upcoming events for a student
   */
  getUpcoming: (studentId: string, limit: number = 10): Promise<ApiResponse<StudentEvent[]>> => {
    return api.get<StudentEvent[]>(`/students/${studentId}/events/upcoming?limit=${limit}`);
  },

  /**
   * Get events for a user (parent/teacher) - aggregates events from all their students
   */
  getUserEvents: (userId: string, limit: number = 20): Promise<ApiResponse<StudentEvent[]>> => {
    return api.get<StudentEvent[]>(`/users/${userId}/events?limit=${limit}`);
  },

  /**
   * Get event counts grouped by type
   */
  getByType: (studentId: string): Promise<ApiResponse<Record<string, number>>> => {
    return api.get<Record<string, number>>(`/students/${studentId}/events/by-type`);
  },

  /**
   * Get a specific event by ID
   */
  getById: (studentId: string, eventId: string): Promise<ApiResponse<StudentEvent>> => {
    return api.get<StudentEvent>(`/students/${studentId}/events/${eventId}`);
  },

  /**
   * Update an event
   */
  update: (
    studentId: string,
    eventId: string,
    data: UpdateEventDto,
  ): Promise<ApiResponse<StudentEvent>> => {
    return api.put<StudentEvent>(`/students/${studentId}/events/${eventId}`, data);
  },

  /**
   * Delete an event (soft delete by default, permanent if specified)
   */
  delete: (
    studentId: string,
    eventId: string,
    permanent: boolean = false,
  ): Promise<ApiResponse<{ message: string }>> => {
    const endpoint = permanent
      ? `/students/${studentId}/events/${eventId}?permanent=true`
      : `/students/${studentId}/events/${eventId}`;

    return api.delete<{ message: string }>(endpoint);
  },
};
