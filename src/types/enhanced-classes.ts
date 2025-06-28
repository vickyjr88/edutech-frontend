// Enhanced Class Types for Command Center
import { Class, ClassDetail } from '@/integrations/api/services/class.service';

// Teacher Summary API Response Types
export interface TeacherSummaryResponse {
  teacherId: string;
  classes: TeacherClassSummary[];
  totalClasses: number;
  totalStudents: number;
  analytics: TeacherAnalytics;
}

export interface TeacherClassSummary {
  classId: string;
  title: string;
  subject: string;
  type: string;
  enrolledStudents: number;
  maxCapacity: number;
  activeCohorts: number;
  progressPercentage: number;
  averageEngagement: number;
  rating: number;
  isPublished: boolean;
  nextSession?: NextSessionInfo;
  classState: 'prep' | 'ready' | 'in-progress' | 'completed';
}

export interface NextSessionInfo {
  classId: string;
  title: string;
  description: string;
  lessonNumber: number;
  cohortName: string;
  startTime: string;
  duration: number;
  timeLeft: number;
  enrolledStudents: number;
  readiness: {
    overallReadiness: number;
  };
}

export interface TeacherAnalytics {
  overallPerformance: OverallPerformance;
  trends: PerformanceTrends;
  insights: string[];
  recentActivity: RecentActivity;
  classHealthScore: number;
}

export interface OverallPerformance {
  averageEngagement: number;
  averageProgress: number;
  averageAttendance: number;
  studentDistribution: StudentDistribution;
}

export interface StudentDistribution {
  highPerformers: number;
  active: number;
  needsAttention: number;
  inactive: number;
}

export interface PerformanceTrends {
  engagementTrend: 'improving' | 'declining' | 'stable';
  attendanceTrend: 'improving' | 'declining' | 'stable';
  completionTrend: 'improving' | 'declining' | 'stable';
}

export interface RecentActivity {
  newEnrollments: number;
  completedAssignments: number;
  upcomingSessions: number;
  activeStudentsThisWeek: number;
}

// Enhanced class interface that extends the existing API class
export interface EnhancedClass extends Class {
  // Computed enhancements
  nextLesson?: NextLessonPreview;
  momentum: ClassMomentum;
  preparationStatus: PreparationStatus;
  studentInsights: StudentInsights;
  performanceMetrics: PerformanceMetrics;
  objectives: LearningObjective[];
  alerts: SmartAlert[];
}

export interface NextLessonPreview {
  lessonNumber: number;
  topic: string;
  scheduledDate: Date;
  duration: number; // in minutes
  preparationStatus: 'ready' | 'needs-prep' | 'critical';
  studentsNeedingHelp: number;
  materialsReady: boolean;
  description: string;
  objectives: string[];
}

export interface ClassMomentum {
  engagementTrend: 'up' | 'down' | 'stable';
  streakDays: number;
  overallScore: number; // 0-100
  attendanceRate: number; // percentage
  participationRate: number; // percentage
  completionRate: number; // percentage
}

export type PreparationStatus = 'ready' | 'needs-prep' | 'critical';

export interface StudentInsights {
  totalStudents: number;
  activeStudents: number;
  strugglingStudents: number;
  excellingStudents: number;
  engagementLevel: 'high' | 'medium' | 'low';
  averagePerformance: number; // 0-100
  recentActivity: StudentActivity[];
}

export interface StudentActivity {
  studentId: string;
  studentName: string;
  action: string;
  timestamp: Date;
  type: 'assignment' | 'participation' | 'question' | 'achievement';
}

export interface PerformanceMetrics {
  lessonCompletionRate: number;
  averageAttendance: number;
  studentSatisfaction: number;
  teachingEffectiveness: number;
  improvementTrend: 'improving' | 'declining' | 'stable';
  weeklyProgress: WeeklyProgress[];
}

export interface WeeklyProgress {
  week: string;
  attendance: number;
  engagement: number;
  performance: number;
}

export interface LearningObjective {
  id: string;
  title: string;
  description: string;
  targetWeek: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'behind';
  progress: number; // 0-100
  studentsAchieved: number;
  priority: 'high' | 'medium' | 'low';
  prerequisites: string[];
  resources: ObjectiveResource[];
}

export interface ObjectiveResource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment' | 'link';
  url: string;
  description?: string;
}

export interface SmartAlert {
  id: string;
  type: 'urgent' | 'important' | 'info' | 'success';
  category: 'preparation' | 'student' | 'performance' | 'schedule' | 'engagement';
  title: string;
  message: string;
  actionRequired: boolean;
  timestamp: Date;
  relatedStudents?: string[];
  suggestedActions?: AlertAction[];
}

export interface AlertAction {
  id: string;
  label: string;
  action: () => void;
  primary?: boolean;
}

// Lesson Planning Types
export interface LessonPlan {
  id: string;
  classId: string;
  lessonNumber: number;
  title: string;
  description: string;
  objectives: string[];
  activities: LessonActivity[];
  materials: string[];
  assessment: string;
  homework: string;
  duration: number;
  scheduledDate?: Date;
  status: 'planned' | 'in-progress' | 'completed';
  notes: string;
}

export interface LessonActivity {
  id: string;
  title: string;
  type: 'lecture' | 'discussion' | 'exercise' | 'quiz' | 'group-work' | 'presentation';
  duration: number;
  description: string;
  materials: string[];
}

// Calendar and Scheduling Types
export interface ClassEvent {
  id: string;
  classId: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'lesson' | 'assignment-due' | 'exam' | 'meeting' | 'break';
  location?: string;
  attendees: string[];
  resources: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

// Analytics and Insights Types
export interface TeachingInsight {
  id: string;
  type: 'performance' | 'engagement' | 'prediction' | 'optimization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  recommendedActions: string[];
  dataPoints: InsightDataPoint[];
}

export interface InsightDataPoint {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  context: string;
}

// Cross-Class Optimization Types
export interface CrossClassSynergy {
  id: string;
  type: 'content-reuse' | 'batch-prep' | 'resource-sharing' | 'scheduling';
  title: string;
  description: string;
  involvedClasses: string[];
  potentialTimeSaved: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  suggestedActions: string[];
}

// Dashboard Configuration Types
export interface DashboardSettings {
  layout: 'grid' | 'list' | 'kanban';
  sortBy: 'name' | 'next-lesson' | 'performance' | 'engagement' | 'momentum';
  sortDirection: 'asc' | 'desc';
  filters: {
    status: string[];
    performance: string[];
    needsAttention: boolean;
  };
  cardSize: 'compact' | 'normal' | 'detailed';
  showPreview: boolean;
}

// Quick Action Types
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  category: 'class' | 'student' | 'lesson' | 'communication';
  action: (classId: string) => void;
  shortcut?: string;
  contextual?: boolean; // Shows only when relevant
}

// Teaching Analytics Dashboard Types
export interface TeachingAnalytics {
  overview: {
    totalClasses: number;
    totalStudents: number;
    averagePerformance: number;
    totalLessonsDelivered: number;
    upcomingDeadlines: number;
  };
  trends: {
    engagementTrend: TrendData[];
    performanceTrend: TrendData[];
    attendanceTrend: TrendData[];
  };
  insights: TeachingInsight[];
  recommendations: TeachingRecommendation[];
}

export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

export interface TeachingRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'engagement' | 'performance' | 'efficiency' | 'content';
  estimatedImpact: string;
  implementationTime: string;
  actions: string[];
}