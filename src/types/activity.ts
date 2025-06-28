export type ActivityType = 
  | 'new_enrollment'
  | 'progress_update'
  | 'completion'
  | 'needs_attention'
  | 'upcoming_session';

export type ActivityPriority = 'high' | 'medium' | 'low';

export interface ActivityDetails {
  // Progress metrics
  progress?: number;
  lessonsCompleted?: number;
  totalLessons?: number;
  progressRatio?: number;

  // Attendance metrics  
  attendanceCount?: number;
  expectedSessions?: number;
  attendanceRatio?: number;
  actuallyDeliveredLessons?: number;

  // Engagement metrics
  engagement?: number;
  homeworkCompletionRate?: number;
  hasHomeworkDue?: boolean;

  // Session timing
  startDate?: Date;
  endDate?: Date;
}

export interface Activity {
  type: ActivityType;
  priority: ActivityPriority;
  description: string;
  studentName?: string;
  studentEmail?: string;
  classTitle?: string;
  timestamp: Date;
  actionRequired?: string;
  details?: ActivityDetails;
}

export interface TeacherDashboardStats {
  totalClasses: number;
  totalStudents: number;
  totalHoursCompleted: number;
  totalHoursScheduled: number;
  averageRating: number;
  completionRate: number;
  activeCohorts: number;
  nextUpcomingClassSession?: {
    classId: string;
    title: string;
    cohortName: string;
    startTime: string;
    timeLeft: number;
    enrolledStudents: number;
  };
}

export interface TeacherDashboardData {
  stats: TeacherDashboardStats;
  upcomingSessions: any[];
  recentActivity: Activity[];
  classPerformance: any[];
}

export interface StudentAttendance {
  percentage: number;
  level: string;
  attended: number;
  total: number;
}

export interface StudentAssignments {
  completed: number;
  total: number;
  completionRate: number;
}

export interface StudentAIInsights {
  insights: string[];
  strengths: string[];
  improvements: string[];
}

export interface StudentSubject {
  name: string;
  color: string;
}

export interface Student {
  studentId: string;
  name: string;
  subjects: StudentSubject[];
  attendance: StudentAttendance;
  assignments: StudentAssignments;
  status: string;
  lastActivity: string;
  lastActivityTimestamp: string;
  aiInsights: StudentAIInsights;
  enrolledClassIds: string[];
  enrollmentId: string;
}

export interface TeacherStudentsPerformanceSummary {
  highPerformers: number;
  active: number;
  needsAttention: number;
  inactive: number;
}

export interface TeacherStudentsData {
  teacherId: string;
  teacherName: string;
  totalStudents: number;
  totalClasses: number;
  students: Student[];
  performanceSummary: TeacherStudentsPerformanceSummary;
}

export interface ClassReadiness {
  lessonPlanReady: boolean;
  materialsReady: boolean;
  zoomSetup: boolean;
  studentsNotified: boolean;
  specialNeedsAccommodated: boolean;
  materialsOrganized: boolean;
  overallReadiness: number;
}

export interface UpcomingSession {
  classId: string;
  title: string;
  cohortName: string;
  startTime: string;
  duration: number;
  timeLeft: number;
  enrolledStudents: number;
  readiness: ClassReadiness;
}

export interface NextUpcomingClassSession {
  classId: string;
  title: string;
  cohortName: string;
  startTime: string;
  timeLeft: number;
  enrolledStudents: number;
  readiness?: ClassReadiness;
}

export interface TeacherStatsData {
  totalClasses: number;
  totalStudents: number;
  totalHoursCompleted: number;
  totalHoursScheduled: number;
  averageRating: number;
  completionRate: number;
  activeCohorts: number;
  nextUpcomingClassSession?: NextUpcomingClassSession;
}