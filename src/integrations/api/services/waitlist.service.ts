import { api } from '../client';

export interface WaitlistStudent {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  status: string;
  date: string;
  interest: string;
}

export const waitlistService = {
  getWaitlist: (classId: string) =>
    api.get<WaitlistStudent[]>(`/enrollments/class/${classId}/waitlist`),
};
