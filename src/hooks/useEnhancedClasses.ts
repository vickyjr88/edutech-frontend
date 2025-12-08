import { useState, useEffect, useMemo } from 'react';
import { Class } from '@/integrations/api/services/class.service';
import {
  EnhancedClass,
  TeachingAnalytics,
  CrossClassSynergy,
  DashboardSettings,
  TeacherClassSummary,
  TrendData,
  TeachingInsight
} from '@/types/enhanced-classes';
import { useTeacherSummary } from './useTeacherSummary';

interface UseEnhancedClassesOptions {
  enablePersistence?: boolean;
  refreshInterval?: number; // in milliseconds
  teacherId?: string;
}

export const useEnhancedClasses = (
  classes: Class[],
  options: UseEnhancedClassesOptions = {}
) => {
  const { enablePersistence = true, refreshInterval = 60000, teacherId } = options;

  // Fetch real teacher summary data
  const {
    summaryData,
    loading: summaryLoading,
    error: summaryError
  } = useTeacherSummary({
    teacherId: teacherId || '',
    refreshInterval: refreshInterval
  });

  const [enhancedClasses, setEnhancedClasses] = useState<EnhancedClass[]>([]);
  const [analytics, setAnalytics] = useState<TeachingAnalytics | null>(null);
  const [synergies, setSynergies] = useState<CrossClassSynergy[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Helper function to convert TeacherClassSummary to EnhancedClass format
  const convertSummaryToTeachingAnalytics = (teacherSummary: any): TeachingAnalytics => {
    const analytics = teacherSummary?.analytics;
    const classes = teacherSummary?.classes || [];

    // Calculate totals from real data
    const totalStudents = classes.reduce((sum: number, cls: any) => sum + (cls.enrolledStudents || 0), 0);
    const averagePerformance = analytics?.overallPerformance?.averageProgress || 0;
    const totalClasses = teacherSummary?.totalClasses || classes.length;

    // Generate trend data from analytics if available, or return empty array
    const generateTrendData = (metric: string, baseValue: number): TrendData[] => {
      // Ideally this comes from API history, for now returning minimal data to avoid errors
      // without using random numbers.
      const now = new Date();
      return [{
        date: now.toISOString().split('T')[0],
        value: baseValue,
        label: metric
      }];
    };

    // Convert string insights to TeachingInsight objects
    const convertInsights = (stringInsights: string[]): TeachingInsight[] => {
      return (stringInsights || []).map((insight: string, index: number) => ({
        id: `insight-${index}`,
        type: 'performance' as const,
        title: `Insight ${index + 1}`,
        description: insight,
        impact: 'medium' as const,
        confidence: 80,
        recommendedActions: [],
        dataPoints: []
      }));
    };

    return {
      overview: {
        totalClasses,
        totalStudents,
        averagePerformance,
        totalLessonsDelivered: analytics?.recentActivity?.upcomingSessions || 0,
        upcomingDeadlines: analytics?.recentActivity?.upcomingSessions || 0
      },
      trends: {
        engagementTrend: generateTrendData('Engagement', analytics?.overallPerformance?.averageEngagement || 0),
        performanceTrend: generateTrendData('Performance', analytics?.overallPerformance?.averageProgress || 0),
        attendanceTrend: generateTrendData('Attendance', analytics?.overallPerformance?.averageAttendance || 0)
      },
      insights: convertInsights(analytics?.insights || []),
      recommendations: []
    };
  };

  const convertSummaryToEnhanced = (summaryClasses: TeacherClassSummary[]): EnhancedClass[] => {
    return summaryClasses.map(summary => ({
      // Base class properties
      _id: summary.classId,
      id: summary.classId,
      title: summary.title,
      subject: summary.subject,
      type: summary.type,
      gradeLevel: '',
      teacher: { _id: teacherId || '', name: '' },
      rating: summary.rating,
      totalReviews: 0,
      discount: 0,
      isFeatured: false,
      status: summary.isPublished ? 'published' : 'draft',
      createdAt: '',
      updatedAt: '',

      // Enhanced properties mapped from summary
      nextLesson: summary.nextSession ? {
        lessonNumber: summary.nextSession.lessonNumber,
        topic: summary.nextSession.title,
        scheduledDate: new Date(summary.nextSession.startTime),
        duration: summary.nextSession.duration,
        preparationStatus: summary.nextSession.readiness.overallReadiness >= 80 ? 'ready' :
          summary.nextSession.readiness.overallReadiness >= 50 ? 'needs-prep' : 'critical',
        studentsNeedingHelp: 0,
        materialsReady: summary.nextSession.readiness.overallReadiness >= 80,
        description: summary.nextSession.description,
        objectives: []
      } : undefined,

      momentum: {
        engagementTrend: 'stable' as const,
        streakDays: 0,
        overallScore: Math.round(summary.averageEngagement || 0),
        attendanceRate: 0,
        participationRate: Math.round(summary.averageEngagement || 0),
        completionRate: Math.round(summary.progressPercentage || 0)
      },

      preparationStatus: summary.classState === 'ready' ? 'ready' :
        summary.classState === 'prep' ? 'needs-prep' : 'critical',

      studentInsights: {
        totalStudents: summary.enrolledStudents,
        activeStudents: summary.enrolledStudents,
        strugglingStudents: 0,
        excellingStudents: 0,
        engagementLevel: summary.averageEngagement >= 80 ? 'high' :
          summary.averageEngagement >= 60 ? 'medium' : 'low',
        averagePerformance: Math.round(summary.averageEngagement || 0),
        recentActivity: []
      },

      performanceMetrics: {
        lessonCompletionRate: Math.round(summary.progressPercentage || 0),
        averageAttendance: 0,
        studentSatisfaction: summary.rating,
        teachingEffectiveness: Math.round(summary.averageEngagement || 0),
        improvementTrend: 'stable' as const,
        weeklyProgress: []
      },

      objectives: [],
      alerts: [],

      // Enrollment data
      enrollment: {
        current: summary.enrolledStudents,
        capacity: summary.maxCapacity
      }
    }));
  };

  // Enhance basic Class objects if summary is not available or matching
  const enhanceBasicClass = (cls: Class): EnhancedClass => {

    return {
      ...cls,
      id: cls._id, // Map _id to id
      nextLesson: undefined,
      momentum: {
        engagementTrend: 'stable',
        streakDays: 0,
        overallScore: 0,
        attendanceRate: 0,
        participationRate: 0,
        completionRate: 0
      },
      preparationStatus: 'ready', // Default
      studentInsights: {
        totalStudents: cls.enrollment?.current || 0,
        activeStudents: cls.enrollment?.current || 0,
        strugglingStudents: 0,
        excellingStudents: 0,
        engagementLevel: 'medium',
        averagePerformance: 0,
        recentActivity: []
      },
      performanceMetrics: {
        lessonCompletionRate: 0,
        averageAttendance: 0,
        studentSatisfaction: cls.rating || 0,
        teachingEffectiveness: 0,
        improvementTrend: 'stable',
        weeklyProgress: []
      },
      objectives: [],
      alerts: [],
      enrollment: {
        current: cls.enrollment?.current || 0,
        capacity: cls.enrollment?.capacity || 20
      }
    };
  };

  // Settings for dashboard customization
  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettings>({
    layout: 'grid',
    sortBy: 'momentum',
    sortDirection: 'desc',
    filters: {
      status: [],
      performance: [],
      needsAttention: false
    },
    cardSize: 'normal',
    showPreview: true
  });

  // Load persisted settings
  useEffect(() => {
    if (enablePersistence) {
      const savedSettings = localStorage.getItem('dashboard_settings');
      if (savedSettings) {
        try {
          setDashboardSettings(JSON.parse(savedSettings));
        } catch (error) {
          console.warn('Failed to load dashboard settings:', error);
        }
      }
    }
  }, [enablePersistence]);

  // Save settings when they change
  useEffect(() => {
    if (enablePersistence) {
      localStorage.setItem('dashboard_settings', JSON.stringify(dashboardSettings));
    }
  }, [dashboardSettings, enablePersistence]);

  // Enhance classes data when base classes change or summary data is available
  useEffect(() => {
    if (summaryData && summaryData.classes.length > 0) {
      try {
        const enhanced = convertSummaryToEnhanced(summaryData.classes);
        setEnhancedClasses(enhanced);
        setAnalytics(convertSummaryToTeachingAnalytics(summaryData));
        setSynergies([]); // No logic for synergies yet without mock
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to process teacher summary data:', error);
      }
    } else {
      // Fallback: just wrap base classes with defaults
      const enhanced = classes.map(enhanceBasicClass);
      setEnhancedClasses(enhanced);
      setAnalytics({
        overview: {
          totalClasses: classes.length,
          totalStudents: classes.reduce((acc, c) => acc + (c.enrollment?.current || 0), 0),
          averagePerformance: 0,
          totalLessonsDelivered: 0,
          upcomingDeadlines: 0
        },
        trends: {
          engagementTrend: [],
          performanceTrend: [],
          attendanceTrend: []
        },
        insights: [],
        recommendations: []
      });
      setSynergies([]);
      setLastUpdated(new Date());
    }
  }, [classes, teacherId, summaryData]); // summaryLoading removed to prevent flicker

  // Periodic refresh (just date update if we rely on props for data stability)
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Computed values for dashboard
  const dashboardMetrics = useMemo(() => {
    if (!enhancedClasses.length) {
      return {
        totalClasses: 0,
        totalStudents: 0,
        averagePerformance: 0,
        urgentAlerts: 0,
        classesNeedingAttention: 0,
        upcomingLessons: 0
      };
    }

    const totalStudents = enhancedClasses.reduce((sum, cls) =>
      sum + (cls.enrollment?.current || 0), 0
    );

    const averagePerformance = Math.round(
      enhancedClasses.reduce((sum, cls) => sum + cls.momentum.overallScore, 0) /
      enhancedClasses.length || 1 // Avoid divide by zero
    );

    const urgentAlerts = enhancedClasses.reduce((sum, cls) =>
      sum + (cls.alerts || []).filter(alert => alert.type === 'urgent').length, 0
    );

    const classesNeedingAttention = enhancedClasses.filter(cls =>
      cls.preparationStatus === 'critical' ||
      cls.studentInsights.strugglingStudents > 2 ||
      (cls.alerts || []).some(alert => alert.type === 'urgent')
    ).length;

    const upcomingLessons = enhancedClasses.filter(cls => {
      if (!cls.nextLesson) return false;
      const lessonDate = new Date(cls.nextLesson.scheduledDate);
      const now = new Date();
      const diffHours = (lessonDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      return diffHours >= 0 && diffHours <= 48; // Next 48 hours
    }).length;

    return {
      totalClasses: enhancedClasses.length,
      totalStudents,
      averagePerformance,
      urgentAlerts,
      classesNeedingAttention,
      upcomingLessons
    };
  }, [enhancedClasses]);

  // Filter and sort utilities
  const getFilteredClasses = (
    status?: string,
    searchTerm?: string,
    needsAttention?: boolean
  ) => {
    let filtered = enhancedClasses;

    if (status && status !== 'all') {
      filtered = filtered.filter(cls => cls.status === status);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(cls =>
        cls.title.toLowerCase().includes(term) ||
        cls.subject.toLowerCase().includes(term)
      );
    }

    if (needsAttention) {
      filtered = filtered.filter(cls =>
        cls.preparationStatus === 'critical' ||
        cls.studentInsights.strugglingStudents > 0 ||
        (cls.alerts || []).some(alert => alert.type === 'urgent')
      );
    }

    return filtered;
  };

  const getSortedClasses = (classes: EnhancedClass[], sortBy: string, direction: 'asc' | 'desc') => {
    return [...classes].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'momentum':
          aValue = a.momentum.overallScore;
          bValue = b.momentum.overallScore;
          break;
        case 'performance':
          aValue = a.performanceMetrics.teachingEffectiveness;
          bValue = b.performanceMetrics.teachingEffectiveness;
          break;
        case 'engagement':
          aValue = a.studentInsights.engagementLevel === 'high' ? 3 :
            a.studentInsights.engagementLevel === 'medium' ? 2 : 1;
          bValue = b.studentInsights.engagementLevel === 'high' ? 3 :
            b.studentInsights.engagementLevel === 'medium' ? 2 : 1;
          break;
        case 'next-lesson':
          aValue = a.nextLesson ? new Date(a.nextLesson.scheduledDate).getTime() : 0;
          bValue = b.nextLesson ? new Date(b.nextLesson.scheduledDate).getTime() : 0;
          break;
        case 'students':
          aValue = a.enrollment?.current || 0;
          bValue = b.enrollment?.current || 0;
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Action handlers - simplified for now as persistence of complex logic is removed
  const updateClassData = (classId: string, updates: Partial<EnhancedClass>) => {
    setEnhancedClasses(prev => prev.map(cls =>
      cls.id === classId ? { ...cls, ...updates } : cls
    ));
  };

  const dismissAlert = (classId: string, alertId: string) => {
    setEnhancedClasses(prev => prev.map(cls =>
      cls.id === classId
        ? { ...cls, alerts: (cls.alerts || []).filter(alert => alert.id !== alertId) }
        : cls
    ));
  };

  const markLessonAsPrepared = (classId: string) => {
    updateClassData(classId, { preparationStatus: 'ready' });
  };

  const updateDashboardSettings = (newSettings: Partial<DashboardSettings>) => {
    setDashboardSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Refresh data manually - effectively just re-triggers effect
  const refreshData = () => {
    // Logic is handled by dependency on summaryData
  };

  return {
    // Data
    enhancedClasses,
    analytics,
    synergies,
    dashboardMetrics,
    dashboardSettings,

    // State
    isLoading: summaryLoading,
    lastUpdated,
    error: summaryError,

    // Utilities
    getFilteredClasses,
    getSortedClasses,

    // Actions
    updateClassData,
    dismissAlert,
    markLessonAsPrepared,
    updateDashboardSettings,
    refreshData
  };
};