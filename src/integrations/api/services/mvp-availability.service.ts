/**
 * MVP Availability Service
 *
 * Frontend service for managing teacher availability
 */

import { mvpApiClient } from '@/integrations/api/mvp-client';

export interface TimeSlot {
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
}

export interface DaySchedule {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    isActive: boolean;
    slots: TimeSlot[];
}

export interface BlockedDate {
    date: string; // ISO date string
    reason?: string;
}

export interface TeacherAvailability {
    teacherId: string;
    weeklySchedule: DaySchedule[];
    blockedDates: BlockedDate[];
    timezone: string;
}

export interface SetWeeklyScheduleRequest {
    weeklySchedule: DaySchedule[];
    timezone?: string;
}

export interface BlockDatesRequest {
    blockedDates: {
        date: string; // ISO date string YYYY-MM-DD
        reason?: string;
    }[];
}

const MvpAvailabilityService = {
    /**
     * Get current teacher's availability
     */
    getMyAvailability: async (): Promise<TeacherAvailability> => {
        return mvpApiClient.get<TeacherAvailability>('/availability');
    },

    /**
     * Set weekly schedule
     */
    setWeeklySchedule: async (data: SetWeeklyScheduleRequest): Promise<TeacherAvailability> => {
        return mvpApiClient.post<TeacherAvailability>('/availability/schedule', data);
    },

    /**
     * Block specific dates
     */
    blockDates: async (data: BlockDatesRequest): Promise<TeacherAvailability> => {
        return mvpApiClient.post<TeacherAvailability>('/availability/blocked', data);
    },

    /**
     * Unblock a date
     */
    unblockDate: async (date: string): Promise<TeacherAvailability> => {
        return mvpApiClient.delete<TeacherAvailability>(`/availability/blocked/${date}`);
    },

    /**
     * Get availability for a specific teacher (public)
     */
    getTeacherAvailability: async (teacherId: string): Promise<TeacherAvailability> => {
        return mvpApiClient.get<TeacherAvailability>(`/availability/${teacherId}`);
    },

    /**
     * Get available slots for a specific date
     */
    getAvailableSlots: async (teacherId: string, date: string): Promise<string[]> => {
        const response = await mvpApiClient.get<{ slots: { startTime: string; endTime: string }[]; isBlocked: boolean }>(`/availability/${teacherId}/${date}`);
        return response.slots.map(s => s.startTime);
    },
};

export default MvpAvailabilityService;
