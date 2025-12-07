// src/integrations/api/services/goal.service.ts
import { api, ApiResponse } from '../client.ts';

export interface Goal {
  _id: string;
  studentId: string;
  name: string;
  description: string;
  subject: string;
  type: 'academic' | 'non-academic';
  progress: number;
  goalTarget: string;
  dueDate: string;
  setBy: 'self' | 'teacher' | 'parent' | 'coach';
  setById?: string;
  status: 'active' | 'completed' | 'cancelled';
  milestones?: Array<{
    name: string;
    completed: boolean;
    completedAt?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalRequest {
  name: string;
  description: string;
  subject: string;
  type: 'academic' | 'non-academic';
  goalTarget: string;
  dueDate: string;
  milestones?: Array<{ name: string }>;
}

export interface UpdateGoalRequest {
  name?: string;
  description?: string;
  subject?: string;
  type?: 'academic' | 'non-academic';
  progress?: number;
  goalTarget?: string;
  dueDate?: string;
  status?: 'active' | 'completed' | 'cancelled';
  milestones?: Array<{
    name: string;
    completed: boolean;
    completedAt?: string;
  }>;
}

export interface GoalStats {
  total: number;
  active: number;
  completed: number;
  averageProgress: number;
  academicGoals: number;
  nonAcademicGoals: number;
}

export const goalService = {
  // Get all goals for a student
  getStudentGoals: (studentId: string, filters?: {
    type?: 'academic' | 'non-academic' | 'all';
    status?: 'active' | 'completed' | 'cancelled';
  }): Promise<ApiResponse<{ goals: Goal[] }>> => {
    const params = new URLSearchParams();
    if (filters?.type && filters.type !== 'all') {
      params.append('type', filters.type);
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }
    const queryString = params.toString();
    return api.get<{ goals: Goal[] }>(
      `/students/${studentId}/goals${queryString ? `?${queryString}` : ''}`
    );
  },

  // Get a specific goal
  getGoalById: (studentId: string, goalId: string): Promise<ApiResponse<Goal>> => {
    return api.get<Goal>(`/students/${studentId}/goals/${goalId}`);
  },

  // Create a new goal
  createGoal: (studentId: string, goalData: CreateGoalRequest): Promise<ApiResponse<Goal>> => {
    return api.post<Goal>(`/students/${studentId}/goals`, goalData);
  },

  // Update a goal
  updateGoal: (
    studentId: string,
    goalId: string,
    updates: UpdateGoalRequest
  ): Promise<ApiResponse<Goal>> => {
    return api.patch<Goal>(`/students/${studentId}/goals/${goalId}`, updates);
  },

  // Delete a goal
  deleteGoal: (studentId: string, goalId: string): Promise<ApiResponse<{ success: boolean }>> => {
    return api.delete<{ success: boolean }>(`/students/${studentId}/goals/${goalId}`);
  },

  // Update goal progress
  updateProgress: (
    studentId: string,
    goalId: string,
    progress: number
  ): Promise<ApiResponse<Goal>> => {
    return api.patch<Goal>(`/students/${studentId}/goals/${goalId}/progress`, { progress });
  },

  // Complete a goal
  completeGoal: (studentId: string, goalId: string): Promise<ApiResponse<Goal>> => {
    return api.patch<Goal>(`/students/${studentId}/goals/${goalId}/complete`, {});
  },

  // Get goal statistics
  getGoalStats: (studentId: string): Promise<ApiResponse<GoalStats>> => {
    return api.get<GoalStats>(`/students/${studentId}/goals/stats`);
  },

  // Update milestone
  updateMilestone: (
    studentId: string,
    goalId: string,
    milestoneIndex: number,
    completed: boolean
  ): Promise<ApiResponse<Goal>> => {
    return api.patch<Goal>(`/students/${studentId}/goals/${goalId}/milestones/${milestoneIndex}`, {
      completed,
      completedAt: completed ? new Date().toISOString() : undefined
    });
  },
};
