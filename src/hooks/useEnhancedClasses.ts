import { useState, useEffect, useMemo } from 'react';
import { Class } from '@/integrations/api/services/class.service';
import { 
  EnhancedClass, 
  TeachingAnalytics, 
  CrossClassSynergy,
  DashboardSettings,
  TeacherClassSummary,
  TeacherSummaryResponse,
  TrendData,
  TeachingInsight
} from '@/types/enhanced-classes';
import { 
  enhanceClassesData, 
  generateTeachingAnalytics,
  generateCrossClassSynergies,
  saveEnhancedData,
  loadEnhancedData
} from '@/utils/mockEnhancements';
import { useTeacherSummary } from './useTeacherSummary';

interface UseEnhancedClassesOptions {
  enablePersistence?: boolean;
  refreshInterval?: number; // in milliseconds
  useRealData?: boolean; // Toggle between real API data and mock data
  teacherId?: string; // Required when useRealData is true
}

export const useEnhancedClasses = (
  classes: Class[], 
  options: UseEnhancedClassesOptions = {}
) => {
  const { enablePersistence = true, refreshInterval = 60000, useRealData = false, teacherId } = options;
  
  // Fetch real teacher summary data when enabled
  const { 
    summaryData, 
    loading: summaryLoading, 
    error: summaryError 
  } = useTeacherSummary({
    teacherId: teacherId || '',
    refreshInterval: useRealData ? refreshInterval : 0 // Only refresh if using real data
  });
  
  const [enhancedClasses, setEnhancedClasses] = useState<EnhancedClass[]>([]);
  const [analytics, setAnalytics] = useState<TeachingAnalytics | null>(null);
  const [synergies, setSynergies] = useState<CrossClassSynergy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Helper function to convert TeacherClassSummary to EnhancedClass format
  // Convert teacher summary analytics to TeachingAnalytics format
  const convertSummaryToTeachingAnalytics = (teacherSummary: any): TeachingAnalytics => {
    const analytics = teacherSummary?.analytics;
    const classes = teacherSummary?.classes || [];
    
    // Calculate totals from real data
    const totalStudents = classes.reduce((sum: number, cls: any) => sum + (cls.enrolledStudents || 0), 0);
    const averagePerformance = analytics?.overallPerformance?.averageProgress || 0;
    const totalClasses = teacherSummary?.totalClasses || classes.length;
    
    // Generate trend data from analytics if available
    const generateTrendData = (metric: string, baseValue: number): TrendData[] => {
      const trends = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        trends.push({
          date: date.toISOString().split('T')[0],
          value: Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * 10)),
          label: metric
        });
      }
      return trends;
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
        recommendedActions: ['Monitor progress', 'Apply recommended strategies'],
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
        engagementTrend: generateTrendData('Engagement', analytics?.overallPerformance?.averageEngagement || 75),
        performanceTrend: generateTrendData('Performance', analytics?.overallPerformance?.averageProgress || 75),
        attendanceTrend: generateTrendData('Attendance', analytics?.overallPerformance?.averageAttendance || 80)
      },
      insights: convertInsights(analytics?.insights || []),
      recommendations: [] // Would need to map these from API or generate
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
    // Handle the case when using real data
    if (useRealData && teacherId) {
      if (summaryData && summaryData.classes.length > 0) {
        setIsLoading(true);
        try {
          const enhanced = convertSummaryToEnhanced(summaryData.classes);
          setEnhancedClasses(enhanced);
          setAnalytics(convertSummaryToTeachingAnalytics(summaryData));
          setSynergies(generateCrossClassSynergies(enhanced));
          setLastUpdated(new Date());
        } catch (error) {
          console.error('Failed to process teacher summary data:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (!summaryLoading) {
        // No summary data available
        setEnhancedClasses([]);
        setAnalytics(null);
        setSynergies([]);
        setIsLoading(false);
      }
      return;
    }

    // Fallback to mock data enhancement
    if (classes.length === 0) {
      setEnhancedClasses([]);
      setAnalytics(null);
      setSynergies([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Load any persisted enhancements
      const enhanced = classes.map(cls => {
        const baseEnhanced = enhanceClassesData([cls])[0];
        
        if (enablePersistence) {
          const persistedData = loadEnhancedData(cls.id);
          if (persistedData) {
            // Merge persisted data with fresh generated data
            return { ...baseEnhanced, ...persistedData };
          }
        }
        
        return baseEnhanced;
      });

      setEnhancedClasses(enhanced);
      setAnalytics(generateTeachingAnalytics(enhanced));
      setSynergies(generateCrossClassSynergies(enhanced));
      setLastUpdated(new Date());
      
      // Persist the enhanced data
      if (enablePersistence) {
        enhanced.forEach(cls => {
          saveEnhancedData(cls.id, {
            momentum: cls.momentum,
            preparationStatus: cls.preparationStatus,
            studentInsights: cls.studentInsights,
            performanceMetrics: cls.performanceMetrics
          });
        });
      }
    } catch (error) {
      console.error('Failed to enhance classes data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [classes, enablePersistence, useRealData, teacherId, summaryData, summaryLoading]);

  // Periodic refresh of dynamic data
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(() => {
      if (enhancedClasses.length > 0) {
        // Refresh only dynamic parts of the data
        const refreshed = enhancedClasses.map(cls => {
          const freshData = enhanceClassesData([cls])[0];
          return {
            ...cls,
            momentum: freshData.momentum,
            alerts: freshData.alerts,
            studentInsights: {
              ...cls.studentInsights,
              recentActivity: freshData.studentInsights.recentActivity
            }
          };
        });
        
        setEnhancedClasses(refreshed);
        setLastUpdated(new Date());
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [enhancedClasses, refreshInterval]);

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
      enhancedClasses.length
    );

    const urgentAlerts = enhancedClasses.reduce((sum, cls) => 
      sum + cls.alerts.filter(alert => alert.type === 'urgent').length, 0
    );

    const classesNeedingAttention = enhancedClasses.filter(cls => 
      cls.preparationStatus === 'critical' || 
      cls.studentInsights.strugglingStudents > 2 ||
      cls.alerts.some(alert => alert.type === 'urgent')
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
        cls.alerts.some(alert => alert.type === 'urgent')
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

  // Action handlers
  const updateClassData = (classId: string, updates: Partial<EnhancedClass>) => {
    setEnhancedClasses(prev => prev.map(cls => 
      cls.id === classId ? { ...cls, ...updates } : cls
    ));

    if (enablePersistence) {
      saveEnhancedData(classId, updates);
    }
  };

  const dismissAlert = (classId: string, alertId: string) => {
    setEnhancedClasses(prev => prev.map(cls => 
      cls.id === classId 
        ? { ...cls, alerts: cls.alerts.filter(alert => alert.id !== alertId) }
        : cls
    ));
  };

  const markLessonAsPrepared = (classId: string) => {
    updateClassData(classId, { preparationStatus: 'ready' });
  };

  const updateDashboardSettings = (newSettings: Partial<DashboardSettings>) => {
    setDashboardSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Refresh data manually
  const refreshData = () => {
    if (classes.length > 0) {
      setIsLoading(true);
      const enhanced = enhanceClassesData(classes);
      setEnhancedClasses(enhanced);
      setAnalytics(generateTeachingAnalytics(enhanced));
      setSynergies(generateCrossClassSynergies(enhanced));
      setLastUpdated(new Date());
      setIsLoading(false);
    }
  };

  return {
    // Data
    enhancedClasses,
    analytics,
    synergies,
    dashboardMetrics,
    dashboardSettings,
    
    // State
    isLoading: isLoading || (useRealData && summaryLoading),
    lastUpdated,
    error: useRealData ? summaryError : null,
    
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