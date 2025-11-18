// src/integrations/api/services/admin.service.ts
import { api } from '../client';

export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  alternativePhoneNumber?: string;
  country?: string;
  role: 'teacher' | 'student' | 'parent' | 'admin';
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  passwordChangedAt?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  teacherProfile?: any;
  studentProfile?: any;
  parentProfile?: {
    profileId: string;
    numberOfChildren: number;
    children: any[];
  };
}

export interface AdminUsersListResponse {
  teachers?: AdminUser[];
  students?: AdminUser[];
  parents?: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminUsersResponse {
  success: boolean;
  data: {
    users: AdminUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface TeacherResources {
  user: AdminUser;
  teacherProfile: any;
  classes: any[];
  students: any[];
  earnings: {
    total: number;
    pending: number;
    paid: number;
  };
}

export interface StudentResources {
  user: AdminUser;
  studentProfile: any;
  enrollments: any[];
  achievements: any[];
  progress: any;
}

export interface ParentResources {
  user: AdminUser;
  parentProfile: any;
  children: any[];
  paymentMethods: any[];
}

export const adminService = {
  // ==================== USERS ====================
  
  /**
   * Get all users with filters
   */
  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'teacher' | 'student' | 'parent';
    country?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.country) queryParams.append('country', params.country);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    return api.get<AdminUsersResponse>(`/admin/users?${queryParams.toString()}`);
  },

  /**
   * Get specific user by ID
   */
  async getUserById(userId: string) {
    return api.get<{ success: boolean; data: AdminUser }>(`/admin/users/${userId}`);
  },

  /**
   * Update user details
   */
  async updateUser(userId: string, data: Partial<AdminUser>) {
    return api.patch<{ success: boolean; data: AdminUser }>(`/admin/users/${userId}`, data);
  },

  /**
   * Reset user password (admin action)
   */
  async resetUserPassword(data: { userId: string; newPassword: string }) {
    return api.post<{ success: boolean; message: string }>('/admin/users/reset-password', data);
  },

  /**
   * Get user resources (profile + associated data)
   */
  async getUserResources(userId: string) {
    return api.get<{ success: boolean; data: any }>(`/admin/users/${userId}/resources`);
  },

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string) {
    return api.delete<{ success: boolean; message: string }>(`/admin/users/${userId}`);
  },

  /**
   * Reactivate user
   */
  async reactivateUser(userId: string) {
    return api.post<{ success: boolean; message: string }>(`/admin/users/${userId}/reactivate`);
  },

  // ==================== TEACHERS ====================

  /**
   * Get all teachers with filters
   */
  async getTeachers(params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    return api.get<AdminUsersListResponse>(`/admin/teachers?${queryParams.toString()}`);
  },

  /**
   * Get specific teacher by ID
   */
  async getTeacherById(teacherId: string) {
    return api.get<{ success: boolean; data: AdminUser }>(`/admin/users/${teacherId}`);
  },

  /**
   * Get teacher resources (classes, students, earnings)
   */
  async getTeacherResources(teacherId: string) {
    return api.get<{ success: boolean; data: TeacherResources }>(`/admin/teachers/${teacherId}/resources`);
  },

  /**
   * Update teacher details
   */
  async updateTeacher(teacherId: string, data: Partial<AdminUser>) {
    return api.patch<{ success: boolean; data: AdminUser }>(`/admin/teachers/${teacherId}`, data);
  },

  // ==================== STUDENTS ====================

  /**
   * Get all students with filters
   */
  async getStudents(params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    return api.get<AdminUsersListResponse>(`/admin/students?${queryParams.toString()}`);
  },

  /**
   * Get specific student by ID
   */
  async getStudentById(studentId: string) {
    return api.get<{ success: boolean; data: AdminUser }>(`/admin/users/${studentId}`);
  },

  /**
   * Get student resources (enrollments, achievements, progress)
   */
  async getStudentResources(studentId: string) {
    return api.get<{ success: boolean; data: StudentResources }>(`/admin/students/${studentId}/resources`);
  },

  /**
   * Update student details
   */
  async updateStudent(studentId: string, data: Partial<AdminUser>) {
    return api.patch<{ success: boolean; data: AdminUser }>(`/admin/students/${studentId}`, data);
  },

  // ==================== PARENTS ====================

  /**
   * Get all parents with filters
   */
  async getParents(params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    return api.get<AdminUsersListResponse>(`/admin/parents?${queryParams.toString()}`);
  },

  /**
   * Get specific parent by ID
   */
  async getParentById(parentId: string) {
    return api.get<{ success: boolean; data: AdminUser }>(`/admin/users/${parentId}`);
  },

  /**
   * Get parent resources (children, payment methods)
   */
  async getParentResources(parentId: string) {
    return api.get<{ success: boolean; data: ParentResources }>(`/admin/parents/${parentId}/resources`);
  },

  /**
   * Update parent details
   */
  async updateParent(parentId: string, data: Partial<AdminUser>) {
    return api.patch<{ success: boolean; data: AdminUser }>(`/admin/parents/${parentId}`, data);
  },
};
