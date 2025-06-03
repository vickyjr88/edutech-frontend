// src/integrations/api/services/google-calendar.service.ts
import { api } from '../client';

export interface GoogleCalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  timezone: string;
  attendees?: string[];
  htmlLink?: string;
  hangoutLink?: string;
  status: string;
}

export interface GoogleCalendarConnectionStatus {
  connected: boolean;
  email?: string;
  connected_at?: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  timezone: string;
  attendees?: string[];
  reminderMinutes?: number;
}

export interface CreateEventResponse {
  success: boolean;
  event: {
    id: string;
    htmlLink: string;
    hangoutLink?: string;
  };
  message: string;
}

class GoogleCalendarService {
  // OAuth and Account Connection
  public async getAuthUrl() {
    return api.get<{ authUrl: string }>('/teacher/google-calendar/auth-url');
  }

  public async handleOAuthCallback(code: string, state: string) {
    return api.post<{ success: boolean; message: string }>('/teacher/google-calendar/oauth-callback', { 
      code, 
      state 
    });
  }

  public async getConnectionStatus() {
    return api.get<GoogleCalendarConnectionStatus>('/teacher/google-calendar/connection-status');
  }

  public async disconnectAccount() {
    return api.delete<{ success: boolean; message: string }>('/teacher/google-calendar/disconnect');
  }

  // Event Management
  public async createEvent(eventData: CreateEventRequest) {
    return api.post<CreateEventResponse>('/teacher/google-calendar/create-event', eventData);
  }

  public async getEvents(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `/teacher/google-calendar/events?${queryString}`
      : '/teacher/google-calendar/events';
      
    return api.get<GoogleCalendarEvent[]>(endpoint);
  }

  public async updateEvent(eventId: string, eventData: Partial<CreateEventRequest>) {
    return api.put<CreateEventResponse>(`/teacher/google-calendar/events/${eventId}`, eventData);
  }

  public async deleteEvent(eventId: string) {
    return api.delete<{ success: boolean; message: string }>(`/teacher/google-calendar/events/${eventId}`);
  }
}

export const googleCalendarService = new GoogleCalendarService();