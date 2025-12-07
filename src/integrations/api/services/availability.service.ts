import { api } from '../client';

export interface Availability {
  _id: string;
  teacherId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  specificDate?: string;
}

export interface CreateAvailabilityRequest {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
  specificDate?: string;
}

export const availabilityService = {
  create: (data: CreateAvailabilityRequest) =>
    api.post<Availability>('/availability', data),

  getByTeacher: (teacherId: string) =>
    api.get<Availability[]>(`/availability/teacher/${teacherId}`),

  getAvailableDates: (teacherId: string, startDate: string, endDate: string) =>
    api.get<string[]>(`/availability/teacher/${teacherId}/dates?startDate=${startDate}&endDate=${endDate}`),

  getAvailableTimes: (teacherId: string, date: string) =>
    api.get<string[]>(`/availability/teacher/${teacherId}/times?date=${date}`),

  delete: (id: string) =>
    api.delete(`/availability/${id}`),
};
