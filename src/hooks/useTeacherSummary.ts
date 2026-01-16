import { useState, useEffect } from 'react';
import MvpTeacherService from '@/integrations/api/services/mvp-teacher.service';
import { TeacherSummaryResponse, TeacherClassSummary } from '@/types/enhanced-classes';

interface UseTeacherSummaryParams {
  teacherId: string;
  refreshInterval?: number; // in milliseconds
}

interface UseTeacherSummaryReturn {
  summaryData: TeacherSummaryResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTeacherSummary = ({
  teacherId,
  refreshInterval = 60000, // 60 seconds
}: UseTeacherSummaryParams): UseTeacherSummaryReturn => {
  const [summaryData, setSummaryData] = useState<TeacherSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    // For MVP, we don't strictly require teacherId if we use "me" endpoints,
    // but the hook interface asks for it. We'll proceed even if it's "current".

    try {
      setError(null);
      // Fetch stats and classes from MVP service
      const [stats, classes] = await Promise.all([
        MvpTeacherService.getDashboardStats(),
        MvpTeacherService.getMyClasses()
      ]);

      // Map MVP classes to TeacherClassSummary
      const mappedClasses: TeacherClassSummary[] = classes.map((cls: any) => ({
        classId: cls._id || cls.id,
        title: cls.title,
        subject: cls.subject,
        type: 'Standard', // Default
        enrolledStudents: cls.enrolledStudents || 0,
        maxCapacity: cls.maxStudents || 20,
        activeCohorts: 1,
        progressPercentage: 0,
        averageEngagement: 85, // Mock
        rating: 5.0, // Mock
        isPublished: cls.status === 'published',
        classState: 'ready',
        nextSession: { // Mock next session
          classId: cls._id || cls.id,
          title: cls.title,
          description: cls.description,
          lessonNumber: 1,
          cohortName: 'Cohort A',
          startTime: new Date().toISOString(),
          duration: 60,
          timeLeft: 0,
          enrolledStudents: cls.enrolledStudents || 0,
          readiness: { overallReadiness: 100 }
        }
      }));

      const response: TeacherSummaryResponse = {
        teacherId: teacherId,
        classes: mappedClasses,
        totalClasses: stats.activeOfferings || classes.length,
        totalStudents: stats.totalStudents || 0,
        analytics: { // Mock analytics for MVP
          overallPerformance: {
            averageEngagement: 85,
            averageProgress: 70,
            averageAttendance: 90,
            studentDistribution: {
              highPerformers: 0,
              active: stats.totalStudents || 0,
              needsAttention: 0,
              inactive: 0
            }
          },
          trends: {
            engagementTrend: 'stable',
            attendanceTrend: 'stable',
            completionTrend: 'stable'
          },
          insights: ['Great job keeping students 1gaged!'],
          recentActivity: {
            newEnrollments: 0,
            completedAssignments: 0,
            upcomingSessions: stats.upcomingSessions || 0,
            activeStudentsThisWeek: stats.totalStudents || 0
          },
          classHealthScore: 90
        }
      };

      setSummaryData(response);

    } catch (err) {
      console.error('Error fetching teacher summary data:', err);
      // Don't set error string to avoid UI error states, just log it.
      // But passing empty data might be better?
      // For now, let's keep error handling minimal.
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [teacherId]);

  // Set up auto-refresh
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [teacherId, refreshInterval]);

  const refetch = () => {
    setLoading(true);
    fetchData();
  };

  return {
    summaryData,
    loading,
    error,
    refetch,
  };
};
