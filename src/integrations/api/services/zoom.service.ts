// src/integrations/api/services/zoom.service.ts
import { api } from '../client';

export interface ZoomMeeting {
  id: string;
  topic: string;
  start_time: string;
  duration: number;
  join_url: string;
  password: string;
  status: string;
}

export interface ZoomParticipant {
  id: string;
  name: string;
  user_email: string;
  join_time: string;
  leave_time: string;
  duration: number;
}

export interface ZoomRecording {
  id: string;
  meeting_id: string;
  recording_start: string;
  recording_end: string;
  file_type: string;
  file_size: number;
  play_url: string;
  download_url: string;
}

export interface ZoomConnectionStatus {
  connected: boolean;
  account_email?: string;
  connected_at?: string;
}

export interface ZoomMeetingHistory {
  meetings: ZoomMeeting[];
  total_records: number;
}

class ZoomService {
  // OAuth and Account Connection
  public async getAuthUrl() {
    return api.get<{ auth_url: string }>('/zoom/auth-url');
  }

  public async handleOAuthCallback(code: string, state: string) {
    return api.post<{ success: boolean }>('/zoom/oauth-callback', { code, state });
  }

  public async getConnectionStatus(teacherId?: string) {
    const endpoint = teacherId 
      ? `/zoom/connection-status/${teacherId}` 
      : '/zoom/connection-status';
    return api.get<ZoomConnectionStatus>(endpoint);
  }

  public async disconnectAccount() {
    return api.delete<{ success: boolean }>('/zoom/disconnect');
  }

  // Meeting Management
  public async createMeeting(meetingData: {
    topic: string;
    start_time: string;
    duration: number;
    agenda?: string;
    settings?: any;
  }) {
    return api.post<ZoomMeeting>('/zoom/meetings', meetingData);
  }

  public async getMeeting(meetingId: string) {
    return api.get<ZoomMeeting>(`/zoom/meetings/${meetingId}`);
  }

  public async getMeetingParticipants(meetingId: string) {
    return api.get<ZoomParticipant[]>(`/zoom/meetings/${meetingId}/participants`);
  }

  public async getMeetingRecordings(meetingId: string) {
    return api.get<ZoomRecording[]>(`/zoom/meetings/${meetingId}/recordings`);
  }

  public async recordMeetingCompletion(meetingId: string, data: {
    completion_status: string;
    notes?: string;
  }) {
    return api.post<{ success: boolean }>(`/zoom/meetings/${meetingId}/record-history`, data);
  }

  // History
  public async getMeetingHistory() {
    return api.get<ZoomMeetingHistory>('/zoom/meeting-history');
  }
}

export const zoomService = new ZoomService();