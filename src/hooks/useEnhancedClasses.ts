import { useState, useEffect, useMemo } from 'react';
import { Class } from '@/integrations/api/services/class.service';
import { 
  EnhancedClass, 
  TeachingAnalytics, 
  CrossClassSynergy,
  DashboardSettings 
} from '@/types/enhanced-classes';
import { 
  enhanceClassesData, 
  generateTeachingAnalytics,
  generateCrossClassSynergies,
  saveEnhancedData,
  loadEnhancedData
} from '@/utils/mockEnhancements';

interface UseEnhancedClassesOptions {
  enablePersistence?: boolean;
  refreshInterval?: number; // in milliseconds
}

export const useEnhancedClasses = (
  classes: Class[], 
  options: UseEnhancedClassesOptions = {}
) => {
  const { enablePersistence = true, refreshInterval = 60000 } = options;
  
  const [enhancedClasses, setEnhancedClasses] = useState<EnhancedClass[]>([]);
  const [analytics, setAnalytics] = useState<TeachingAnalytics | null>(null);
  const [synergies, setSynergies] = useState<CrossClassSynergy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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

  // Enhance classes data when base classes change
  useEffect(() => {
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
  }, [classes, enablePersistence]);

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
    isLoading,
    lastUpdated,
    
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