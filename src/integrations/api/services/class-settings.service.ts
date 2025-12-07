import { api, ApiResponse } from '../client';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
}

export interface ClassSettings {
  _id: string;
  teacher: string;
  schedule: {
    timeSlots: TimeSlot[];
    classDuration: number;
    syncWithCalendar: boolean;
  };
  platform: string;
  teachingTools: {
    interactiveWhiteboard: boolean;
    documentSharing: boolean;
    classRecordings: boolean;
    pollsAndQuizzes: boolean;
    customTools: string[];
  };
  automaticPlatformIntegration: boolean;
}

export interface CreateClassSettingsRequest {
  teacher: string;
  schedule: {
    timeSlots: TimeSlot[];
    classDuration: number;
    syncWithCalendar?: boolean;
  };
  platform: string;
  teachingTools: {
    interactiveWhiteboard?: boolean;
    documentSharing?: boolean;
    classRecordings?: boolean;
    pollsAndQuizzes?: boolean;
    customTools?: string[];
  };
  automaticPlatformIntegration?: boolean;
}

export const classSettingsService = {
  getByTeacher: (teacherId: string): Promise<ApiResponse<ClassSettings>> => {
    return api.get<ClassSettings>(`/class-settings/teacher/${teacherId}`);
  },

  create: (data: CreateClassSettingsRequest): Promise<ApiResponse<ClassSettings>> => {
    return api.post<ClassSettings>('/class-settings', data);
  },

  update: (id: string, data: Partial<CreateClassSettingsRequest>): Promise<ApiResponse<ClassSettings>> => {
    return api.patch<ClassSettings>(`/class-settings/${id}`, data);
  },

  updatePlatform: (teacherId: string, platform: string): Promise<ApiResponse<ClassSettings>> => {
    return api.patch<ClassSettings>(`/class-settings/platform/teacher/${teacherId}`, { platform });
  },

  updateTools: (teacherId: string, tools: any): Promise<ApiResponse<ClassSettings>> => {
    return api.patch<ClassSettings>(`/class-settings/tools/teacher/${teacherId}`, tools);
  },

  addTimeSlot: (teacherId: string, timeSlot: TimeSlot): Promise<ApiResponse<ClassSettings>> => {
    return api.post<ClassSettings>(`/class-settings/time-slots/teacher/${teacherId}`, timeSlot);
  },
};
