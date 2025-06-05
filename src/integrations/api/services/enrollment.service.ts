import { api, ApiResponse } from '../client';

export interface Enrollment {
  id: string;
  userId: string;
  classId: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  enrolledDate: string;
  completedDate?: string;
  cancelledDate?: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  paymentMethod?: string;
  paymentId?: string;
  paymentAmount?: number;
  paymentCurrency?: string;
  paymentDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SelfEnrollmentRequest {
  cohortId: string;
  classId: string;
}

export interface EnrollmentUpdate {
  status?: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
  paymentMethod?: string;
  paymentId?: string;
  paymentAmount?: number;
  paymentCurrency?: string;
  notes?: string;
}

export const enrollmentService = {
  // Get enrollments by student
  getStudentEnrollments: (studentId: string): Promise<ApiResponse<Enrollment[]>> => {
    return api.get<Enrollment[]>(`/enrollments/class/${studentId}`);
  },

  // Get all enrollments for a class
  getClassEnrollments: (classId: string): Promise<ApiResponse<Enrollment[]>> => {
    return api.get<Enrollment[]>(`/enrollments/class/${classId}`);
  },

  // Self enroll to a class
  selfEnroll: (data: SelfEnrollmentRequest): Promise<ApiResponse<Enrollment>> => {
    return api.post<Enrollment>('/enrollments/self-enroll', data);
  },

  // Update an enrollment status
  updateEnrollmentStatus: (enrollmentId: string, status: string): Promise<ApiResponse<Enrollment>> => {
    return api.patch<Enrollment>(`/enrollments/${enrollmentId}/status`, { status });
  },

};
