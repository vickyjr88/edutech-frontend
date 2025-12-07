// src/integrations/api/services/assignment.service.ts
import { api, ApiResponse } from '../client';

export enum AssignmentType {
  QUIZ = 'Quiz',
  PROJECT = 'Project',
  LAB_REPORT = 'Lab Report',
  HOMEWORK = 'Homework',
  TEST = 'Test',
  CODE_PROJECT = 'Code Project',
  ESSAY = 'Essay',
  PRESENTATION = 'Presentation',
  GROUP_PROJECT = 'Group Project',
  PEER_REVIEW = 'Peer Review',
}

export enum AssignmentStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  CLOSED = 'Closed',
  ARCHIVED = 'Archived',
}

export enum SubmissionStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  SUBMITTED = 'Submitted',
  GRADED = 'Graded',
  LATE = 'Late',
  MISSING = 'Missing',
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  detailedInstructions?: string;
  class: string;
  cohort: string;
  type: AssignmentType;
  status: AssignmentStatus;
  dueDate: string; // ISO date string
  publishDate?: string;
  closeDate?: string;
  totalPoints: number;
  passingGrade: number;
  estimatedTimeMinutes: number;
  attachments?: string[];
  learningObjectives?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentAssignment {
  _id: string;
  assignment: Assignment;
  student: string;
  submissionStatus: SubmissionStatus;
  content?: string;
  attachments?: string[];
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  gradedAt?: string;
  timeSpent?: number; // in minutes
  attempts: number;
  isLate: boolean;
}

export interface AssignmentSubmission {
  assignmentId: string;
  content: string;
  attachments?: string[];
}

export interface AssignmentFilters {
  classId?: string;
  studentId?: string;
  status?: SubmissionStatus;
  type?: AssignmentType;
  sortBy?: 'dueDate' | 'createdAt' | 'title' | 'grade';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const assignmentService = {
  // Get assignments for a specific class
  getAssignmentsByClass: (classId: string, filters?: Partial<AssignmentFilters>): Promise<ApiResponse<Assignment[]>> => {
    return api.get<Assignment[]>(`/assignments/class/${classId}`, { params: filters });
  },

  // Get upcoming assignments for a class
  getUpcomingAssignments: (classId: string, limit?: number): Promise<ApiResponse<Assignment[]>> => {
    return api.get<Assignment[]>(`/assignments/upcoming/${classId}`, { params: { limit } });
  },

  // Get assignments for the current student
  getStudentAssignments: (filters?: AssignmentFilters): Promise<ApiResponse<PaginatedResponse<StudentAssignment>>> => {
    return api.get<PaginatedResponse<StudentAssignment>>('/assignments/submissions/my-assignments', { params: filters });
  },

  // Get student assignments for a specific class
  getStudentAssignmentsByClass: (classId: string, filters?: Partial<AssignmentFilters>): Promise<ApiResponse<PaginatedResponse<StudentAssignment>>> => {
    return api.get<PaginatedResponse<StudentAssignment>>('/assignments/submissions/my-assignments', {
      params: { ...filters, classId }
    });
  },

  // Get a specific assignment by ID
  getAssignmentById: (assignmentId: string): Promise<ApiResponse<Assignment>> => {
    return api.get<Assignment>(`/assignments/${assignmentId}`);
  },

  // Get student progress on a specific assignment
  getAssignmentProgress: (assignmentId: string): Promise<ApiResponse<StudentAssignment>> => {
    return api.get<StudentAssignment>(`/assignments/progress/${assignmentId}`);
  },

  // Submit an assignment
  submitAssignment: (submission: AssignmentSubmission): Promise<ApiResponse<StudentAssignment>> => {
    return api.post<StudentAssignment>('/assignments/submit', submission);
  },

  // Update a submission (before final submission)
  updateSubmission: (studentAssignmentId: string, data: Partial<AssignmentSubmission>): Promise<ApiResponse<StudentAssignment>> => {
    return api.put<StudentAssignment>(`/assignments/submissions/${studentAssignmentId}`, data);
  },

  // Resubmit an assignment (if allowed)
  resubmitAssignment: (data: AssignmentSubmission & { resubmissionReason?: string }): Promise<ApiResponse<StudentAssignment>> => {
    return api.post<StudentAssignment>('/assignments/resubmit', data);
  },

  // Get assignment analytics for a class
  getClassAssignmentAnalytics: (classId: string): Promise<ApiResponse<any>> => {
    return api.get<any>(`/assignments/class/${classId}/analytics`);
  },

  // Get detailed analytics for a specific assignment
  getAssignmentAnalytics: (assignmentId: string): Promise<ApiResponse<any>> => {
    return api.get<any>(`/assignments/${assignmentId}/analytics`);
  },
};