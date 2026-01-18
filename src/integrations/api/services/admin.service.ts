// src/integrations/api/services/admin.service.ts
import { api } from '../client';

export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  alternativePhoneNumber?: string;
  bio?: string;
  country?: string;
  role: 'teacher' | 'student' | 'parent' | 'admin';
  isActive: boolean;
  isSuspended?: boolean;
  suspendedAt?: string;
  suspendedUntil?: string;
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
  profileId?: string;
  bio?: string;
  classes: any[];
  students: any[];
  history?: any[];
  earnings: {
    total: number;
    pending: number;
    paid: number;
  };
  totalClasses: number;
  totalStudents: number;
  totalEarnings: number;
  user?: AdminUser;
  teacherProfile?: any;
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

  /**
   * Permanently delete user (WARNING: Irreversible!)
   */
  async permanentDeleteUser(userId: string) {
    return api.delete<{
      message: string;
      deletedRecords: {
        user: boolean;
        profile: boolean;
        suspensions: number;
        auditLogs: number;
      };
    }>(`/admin/users/${userId}/permanent`);
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

  // ==================== NEW ENHANCED FEATURES ====================

  /**
   * Create a new user
   */
  async createUser(data: {
    fullName: string;
    email: string;
    password: string;
    role: 'teacher' | 'student' | 'parent';
    phoneNumber?: string;
    alternativePhoneNumber?: string;
    bio?: string;
    country?: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    sendWelcomeEmail?: boolean;
  }) {
    return api.post<{ success: boolean; data: AdminUser }>('/admin/users', data);
  },

  /**
   * Advanced user query with more filters
   */
  async advancedQueryUsers(params: {
    search?: string;
    role?: string;
    roles?: string[];
    country?: string;
    status?: 'active' | 'inactive' | 'suspended';
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    createdAfter?: string;
    createdBefore?: string;
    lastLoginAfter?: string;
    lastLoginBefore?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    fields?: string[];
  } = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    return api.get<{
      users: AdminUser[];
      total: number;
      page: number;
      totalPages: number;
      stats: {
        activeCount: number;
        inactiveCount: number;
        suspendedCount: number;
      };
    }>(`/admin/users/advanced?${queryParams.toString()}`);
  },

  /**
   * Suspend a user
   */
  async suspendUser(userId: string, data: {
    reason: 'policy_violation' | 'payment_issue' | 'fraudulent_activity' | 'inappropriate_behavior' | 'security_concern' | 'user_request' | 'other';
    notes?: string;
    suspendedUntil?: string;
    internalNotes?: string;
  }) {
    return api.post<{ success: boolean; message: string; suspension: any }>(`/admin/users/${userId}/suspend`, data);
  },

  /**
   * Unsuspend a user
   */
  async unsuspendUser(userId: string, notes?: string) {
    return api.post<{ success: boolean; message: string }>(`/admin/users/${userId}/unsuspend`, { notes });
  },

  /**
   * Get user suspension history
   */
  async getUserSuspensions(userId: string) {
    return api.get<any[]>(`/admin/users/${userId}/suspensions`);
  },

  /**
   * Perform bulk action on users
   */
  async bulkAction(data: {
    userIds: string[];
    action: 'activate' | 'deactivate' | 'suspend' | 'delete' | 'send_email';
    reason?: string;
    emailTemplate?: string;
    emailSubject?: string;
    emailContent?: string;
  }) {
    return api.post<{
      success: number;
      failed: number;
      errors: Array<{ userId: string; error: string }>;
    }>('/admin/users/bulk-action', data);
  },

  /**
   * Get user audit logs
   */
  async getUserAuditLogs(userId: string, limit = 50) {
    return api.get<any[]>(`/admin/users/${userId}/audit-logs?limit=${limit}`);
  },

  /**
   * Get all audit logs with filters
   */
  async getAuditLogs(params: {
    action?: string;
    performedBy?: string;
    targetUser?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return api.get<{
      logs: any[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/admin/audit-logs?${queryParams.toString()}`);
  },



  // ==================== SUPPORT TICKETS ====================

  /**
   * Create a support ticket
   */
  async createTicket(data: {
    userId: string;
    subject: string;
    message: string;
    category: 'account_access' | 'payment' | 'technical' | 'content' | 'general' | 'feature_request' | 'bug_report' | 'other';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    attachments?: string[];
    tags?: string[];
  }) {
    return api.post<any>('/admin/tickets', data);
  },

  /**
   * Get all tickets with filters
   */
  async getTickets(params: {
    search?: string;
    status?: 'open' | 'in_progress' | 'pending_user' | 'resolved' | 'closed';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category?: string;
    userId?: string;
    assignedTo?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return api.get<{
      tickets: any[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/admin/tickets?${queryParams.toString()}`);
  },

  /**
   * Get a single ticket by ID
   */
  async getTicketById(ticketId: string) {
    return api.get<any>(`/admin/tickets/${ticketId}`);
  },

  /**
   * Update a ticket
   */
  async updateTicket(ticketId: string, data: {
    status?: 'open' | 'in_progress' | 'pending_user' | 'resolved' | 'closed';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category?: string;
    assignedTo?: string;
    resolution?: string;
    tags?: string[];
  }) {
    return api.patch<any>(`/admin/tickets/${ticketId}`, data);
  },

  /**
   * Add a message to a ticket
   */
  async addTicketMessage(ticketId: string, data: {
    message: string;
    isInternal?: boolean;
    attachments?: string[];
  }) {
    return api.post<any>(`/admin/tickets/${ticketId}/messages`, data);
  },

  /**
   * Get user's tickets
   */
  async getUserTickets(userId: string) {
    return api.get<any[]>(`/admin/users/${userId}/tickets`);
  },

  // ==================== DASHBOARD ====================

  /**
   * Get comprehensive dashboard statistics
   */
  async getDashboardStats() {
    return api.get<{
      users: {
        total: number;
        active: number;
        inactive: number;
        suspended: number;
        newThisMonth: number;
        newThisWeek: number;
        verifiedEmails: number;
        verifiedPhones: number;
        verificationRate: string;
        byRole: Record<string, number>;
        growthTrend: Array<{ _id: string; count: number }>;
      };
      tickets: {
        total: number;
        open: number;
        inProgress: number;
        pending: number;
        resolved: number;
        closed: number;
        newThisWeek: number;
        urgent: number;
        highPriority: number;
        needsAttention: number;
        resolutionRate: string;
        byCategory: Record<string, number>;
        trend: Array<{ _id: string; count: number }>;
      };
      classes: {
        total: number;
        active: number;
        inactive: number;
      };
      enrollments: {
        total: number;
        enrolled: number;
        completed: number;
        pending: number;
      };
      activity: {
        recentActions: number;
        activeSuspensions: number;
      };
      overview: {
        totalUsers: number;
        totalTeachers: number;
        totalStudents: number;
        totalParents: number;
        totalClasses: number;
        totalEnrollments: number;
        totalTickets: number;
        activeTickets: number;
      };
    }>(`/admin/dashboard/stats`);
  },

  // ==================== BOOKING MANAGEMENT ====================

  // Get all bookings with filters
  getBookings: async (params?: {
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    teacherId?: string;
    parentId?: string;
    isPaid?: boolean;
    fromDate?: string;
    toDate?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    return api.get<{
      bookings: Array<{
        _id: string;
        parentId: {
          _id: string;
          fullName: string;
          email: string;
          phoneNumber: string;
        };
        teacherId: {
          _id: string;
          fullName: string;
          email: string;
          phoneNumber: string;
        };
        offeringId: {
          _id: string;
          title: string;
          subject: string;
          deliveryMode: string;
        };
        studentName: string;
        studentAge?: number;
        studentGrade?: string;
        notes?: string;
        scheduledDate: string;
        scheduledTime: string;
        duration: number;
        price: number;
        currency: string;
        status: string;
        isPaid: boolean;
        paidAt?: string;
        paymentRef?: string;
        confirmationCode: string;
        isManualBooking?: boolean;
        hasDispute?: boolean;
        adminNotes?: string;
        createdAt: string;
        updatedAt: string;
        payment?: {
          _id: string;
          amount: number;
          status: string;
          paymentMethod: string;
          paystackReference?: string;
        };
      }>;
      total: number;
      page: number;
      totalPages: number;
      limit: number;
    }>(`/admin/bookings`, { params });
  },

  // Get booking statistics
  getBookingStats: async () => {
    return api.get<{
      totalBookings: number;
      totalRevenue: number;
      byStatus: {
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
      };
      byPaymentStatus: {
        paid: number;
        unpaid: number;
      };
      recentBookings: number;
      averageBookingValue: number;
      disputedBookings: number;
      manualBookings: number;
    }>(`/admin/bookings/stats`);
  },

  // Get booking details
  getBookingDetails: async (bookingId: string) => {
    return api.get<{
      _id: string;
      parentId: {
        _id: string;
        fullName: string;
        email: string;
        phoneNumber: string;
      };
      teacherId: {
        _id: string;
        fullName: string;
        email: string;
        phoneNumber: string;
      };
      offeringId: {
        _id: string;
        title: string;
        description: string;
        subject: string;
        curriculum: string;
        gradeLevel: string;
        price: number;
        sessionDuration: number;
        deliveryMode: string;
      };
      studentName: string;
      studentAge?: number;
      studentGrade?: string;
      notes?: string;
      scheduledDate: string;
      scheduledTime: string;
      duration: number;
      price: number;
      currency: string;
      status: string;
      isPaid: boolean;
      paidAt?: string;
      paymentRef?: string;
      confirmationCode: string;
      isManualBooking?: boolean;
      hasDispute?: boolean;
      disputeTicketId?: string;
      adminNotes?: string;
      createdByAdmin?: string;
      cancelledBy?: string;
      cancellationReason?: string;
      cancelledAt?: string;
      completedAt?: string;
      createdAt: string;
      updatedAt: string;
      payment?: {
        _id: string;
        amount: number;
        status: string;
        paymentMethod: string;
        paystackReference?: string;
        gatewayResponse?: any;
      };
    }>(`/admin/bookings/${bookingId}`);
  },

  // Create manual booking
  createManualBooking: async (data: {
    parentId: string;
    teacherId: string;
    offeringId: string;
    studentName: string;
    studentAge?: number;
    studentGrade?: string;
    notes?: string;
    scheduledDate: string;
    scheduledTime: string;
    markAsPaid?: boolean;
    adminNotes?: string;
  }) => {
    return api.post<{
      _id: string;
      confirmationCode: string;
      status: string;
      isPaid: boolean;
    }>(`/admin/bookings`, data);
  },

  // Update booking
  updateBooking: async (bookingId: string, data: {
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    scheduledDate?: string;
    scheduledTime?: string;
    isPaid?: boolean;
    adminNotes?: string;
  }) => {
    return api.patch(`/admin/bookings/${bookingId}`, data);
  },

  // Resolve dispute
  resolveDispute: async (bookingId: string, data: {
    resolution: 'REFUND' | 'RESCHEDULE' | 'CREDIT' | 'NO_ACTION';
    resolutionNotes: string;
    refundAmount?: number;
  }) => {
    return api.post(`/admin/bookings/${bookingId}/resolve-dispute`, data);
  },

  // ==================== OFFERINGS ====================

  /**
   * Get all teacher offerings
   */
  async getOfferings() {
    return api.get<any[]>('/admin/offerings');
  },

  /**
   * Get offering by ID
   */
  async getOffering(id: string) {
    return api.get<any>(`/admin/offerings/${id}`);
  },

  // ==================== EXPORTS ====================

  /**
   * Export Bookings CSV
   */
  async exportBookings() {
    return api.get<Blob>('/admin/export/bookings', { responseType: 'blob' });
  },

  /**
   * Export Teachers CSV
   */
  async exportTeachers() {
    return api.get<Blob>('/admin/export/teachers', { responseType: 'blob' });
  },

  /**
   * Export Revenue CSV
   */
  async exportRevenue() {
    return api.get<Blob>('/admin/export/revenue', { responseType: 'blob' });
  },

  // ==================== PARENT-STUDENT ASSOCIATIONS ====================

  /**
   * Get all parent-student associations
   */
  async getAllAssociations() {
    return api.get<{
      parents: Array<{
        parentId: string;
        parentUser: any;
        children: any[];
        childrenCount: number;
      }>;
      students: Array<{
        studentId: string;
        studentUser: any;
        parents: any[];
        parentsCount: number;
      }>;
      totalParents: number;
      totalStudents: number;
    }>('/admin/associations');
  },

  /**
   * Get students for a specific parent
   */
  async getStudentsForParent(parentUserId: string) {
    return api.get<{
      parentUserId: string;
      students: any[];
      count: number;
    }>(`/admin/associations/parent/${parentUserId}/students`);
  },

  /**
   * Get parents for a specific student
   */
  async getParentsForStudent(studentUserId: string) {
    return api.get<{
      studentUserId: string;
      parents: any[];
      count: number;
    }>(`/admin/associations/student/${studentUserId}/parents`);
  },

  /**
   * Associate a parent with a student
   */
  async associateParentWithStudent(parentUserId: string, studentUserId: string) {
    return api.post<{
      message: string;
      parentUserId: string;
      studentUserId: string;
    }>('/admin/associations', { parentUserId, studentUserId });
  },

  /**
   * Remove association between a parent and a student
   */
  async disassociateParentFromStudent(parentUserId: string, studentUserId: string) {
    return api.delete<{
      message: string;
      parentUserId: string;
      studentUserId: string;
    }>('/admin/associations', { data: { parentUserId, studentUserId } });
  },

  /**
   * Get available students for a parent (not yet associated)
   */
  async getAvailableStudentsForParent(parentUserId: string) {
    return api.get<{
      parentUserId: string;
      availableStudents: any[];
      count: number;
    }>(`/admin/associations/available-students/${parentUserId}`);
  },

  /**
   * Get available parents for a student (not yet associated)
   */
  async getAvailableParentsForStudent(studentUserId: string) {
    return api.get<{
      studentUserId: string;
      availableParents: any[];
      count: number;
    }>(`/admin/associations/available-parents/${studentUserId}`);
  },
};


