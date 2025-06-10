// Mock Data Enhancement Utilities for Enhanced Classes
import { Class } from '@/integrations/api/services/class.service';
import { 
  EnhancedClass, 
  NextLessonPreview, 
  ClassMomentum, 
  StudentInsights, 
  PerformanceMetrics, 
  LearningObjective, 
  SmartAlert,
  WeeklyProgress,
  StudentActivity,
  TeachingAnalytics,
  CrossClassSynergy,
  TeachingInsight
} from '@/types/enhanced-classes';

// Sample topics and objectives for different subjects
const subjectTopics: Record<string, string[]> = {
  'mathematics': [
    'Algebra Fundamentals', 'Quadratic Equations', 'Calculus Introduction', 
    'Statistics and Probability', 'Geometry Proofs', 'Trigonometry'
  ],
  'science': [
    'Chemical Reactions', 'Photosynthesis', 'Newton\'s Laws', 
    'DNA Structure', 'Solar System', 'Atomic Theory'
  ],
  'english': [
    'Creative Writing', 'Shakespeare Analysis', 'Grammar Essentials', 
    'Poetry Interpretation', 'Essay Structure', 'Reading Comprehension'
  ],
  'history': [
    'World War II', 'Ancient Civilizations', 'Renaissance Period', 
    'Industrial Revolution', 'Colonial History', 'Modern Democracy'
  ],
  'default': [
    'Introduction to Topic', 'Core Concepts', 'Practical Applications', 
    'Advanced Techniques', 'Review and Assessment', 'Project Work'
  ]
};

// Generate mock next lesson
export function generateNextLesson(classData: Class): NextLessonPreview {
  const subjectKey = classData.subject.toLowerCase();
  const topics = subjectTopics[subjectKey] || subjectTopics.default;
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  
  const now = new Date();
  const nextLesson = new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000); // Within next week
  
  const statuses: ('ready' | 'needs-prep' | 'critical')[] = ['ready', 'needs-prep', 'critical'];
  const prepStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    lessonNumber: Math.floor(Math.random() * 20) + 1,
    topic: randomTopic,
    scheduledDate: nextLesson,
    duration: [45, 60, 90][Math.floor(Math.random() * 3)],
    preparationStatus: prepStatus,
    studentsNeedingHelp: Math.floor(Math.random() * 5),
    materialsReady: Math.random() > 0.3,
    description: `Comprehensive lesson covering ${randomTopic} with hands-on activities and practical examples.`,
    objectives: [
      `Understand key concepts of ${randomTopic}`,
      `Apply principles in practical scenarios`,
      `Demonstrate mastery through exercises`
    ]
  };
}

// Generate mock class momentum
export function generateClassMomentum(): ClassMomentum {
  const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
  const trend = trends[Math.floor(Math.random() * trends.length)];
  
  return {
    engagementTrend: trend,
    streakDays: Math.floor(Math.random() * 30),
    overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
    attendanceRate: Math.floor(Math.random() * 30) + 70, // 70-100
    participationRate: Math.floor(Math.random() * 40) + 60, // 60-100
    completionRate: Math.floor(Math.random() * 35) + 65 // 65-100
  };
}

// Generate mock student insights
export function generateStudentInsights(totalStudents: number): StudentInsights {
  const strugglingCount = Math.floor(totalStudents * 0.15); // 15% struggling
  const excellingCount = Math.floor(totalStudents * 0.25); // 25% excelling
  const activeStudents = Math.floor(totalStudents * 0.85); // 85% active
  
  const engagementLevels: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
  
  // Generate recent activities
  const activities: StudentActivity[] = [];
  const activityTypes: ('assignment' | 'participation' | 'question' | 'achievement')[] = 
    ['assignment', 'participation', 'question', 'achievement'];
  
  for (let i = 0; i < Math.min(5, totalStudents); i++) {
    activities.push({
      studentId: `student_${i + 1}`,
      studentName: `Student ${i + 1}`,
      action: getRandomActivity(),
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      type: activityTypes[Math.floor(Math.random() * activityTypes.length)]
    });
  }
  
  return {
    totalStudents,
    activeStudents,
    strugglingStudents: strugglingCount,
    excellingStudents: excellingCount,
    engagementLevel: engagementLevels[Math.floor(Math.random() * engagementLevels.length)],
    averagePerformance: Math.floor(Math.random() * 40) + 60,
    recentActivity: activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  };
}

function getRandomActivity(): string {
  const activities = [
    'Submitted assignment early',
    'Asked an insightful question',
    'Helped another student',
    'Achieved perfect quiz score',
    'Participated actively in discussion',
    'Completed bonus exercise',
    'Requested additional help',
    'Shared creative solution'
  ];
  return activities[Math.floor(Math.random() * activities.length)];
}

// Generate performance metrics
export function generatePerformanceMetrics(): PerformanceMetrics {
  const trends: ('improving' | 'declining' | 'stable')[] = ['improving', 'declining', 'stable'];
  
  // Generate weekly progress data
  const weeklyProgress: WeeklyProgress[] = [];
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  
  weeks.forEach(week => {
    weeklyProgress.push({
      week,
      attendance: Math.floor(Math.random() * 30) + 70,
      engagement: Math.floor(Math.random() * 40) + 60,
      performance: Math.floor(Math.random() * 35) + 65
    });
  });
  
  return {
    lessonCompletionRate: Math.floor(Math.random() * 30) + 70,
    averageAttendance: Math.floor(Math.random() * 25) + 75,
    studentSatisfaction: Math.floor(Math.random() * 20) + 80,
    teachingEffectiveness: Math.floor(Math.random() * 25) + 75,
    improvementTrend: trends[Math.floor(Math.random() * trends.length)],
    weeklyProgress
  };
}

// Generate learning objectives
export function generateLearningObjectives(classSubject: string): LearningObjective[] {
  const objectiveTemplates = [
    `Master fundamental concepts in ${classSubject}`,
    `Apply ${classSubject} principles to real-world problems`,
    `Develop critical thinking skills in ${classSubject}`,
    `Demonstrate proficiency in ${classSubject} assessments`,
    `Collaborate effectively on ${classSubject} projects`
  ];
  
  return objectiveTemplates.slice(0, 3).map((template, index) => ({
    id: `objective_${index + 1}`,
    title: template,
    description: `Comprehensive understanding and application of ${template.toLowerCase()}`,
    targetWeek: (index + 1) * 4,
    status: (['not-started', 'in-progress', 'completed', 'behind'] as const)[Math.floor(Math.random() * 4)],
    progress: Math.floor(Math.random() * 100),
    studentsAchieved: Math.floor(Math.random() * 20),
    priority: (['high', 'medium', 'low'] as const)[Math.floor(Math.random() * 3)],
    prerequisites: index > 0 ? [`objective_${index}`] : [],
    resources: [
      {
        id: `resource_${index}_1`,
        title: `${classSubject} Study Guide`,
        type: 'document',
        url: '/resources/study-guide.pdf',
        description: 'Comprehensive study materials'
      }
    ]
  }));
}

// Generate smart alerts
export function generateSmartAlerts(classData: Class): SmartAlert[] {
  const alertTemplates = [
    {
      type: 'urgent' as const,
      category: 'preparation' as const,
      title: 'Lesson Preparation Required',
      message: 'Tomorrow\'s lesson materials need review and setup',
      actionRequired: true
    },
    {
      type: 'important' as const,
      category: 'student' as const,
      title: 'Students Need Attention',
      message: '3 students haven\'t submitted recent assignments',
      actionRequired: true
    },
    {
      type: 'info' as const,
      category: 'performance' as const,
      title: 'Engagement Trend',
      message: 'Class engagement has improved by 15% this week',
      actionRequired: false
    },
    {
      type: 'success' as const,
      category: 'engagement' as const,
      title: 'High Participation',
      message: 'Excellent participation in yesterday\'s discussion',
      actionRequired: false
    }
  ];
  
  const numAlerts = Math.floor(Math.random() * 3) + 1;
  const selectedAlerts = alertTemplates
    .sort(() => Math.random() - 0.5)
    .slice(0, numAlerts);
  
  return selectedAlerts.map((template, index) => ({
    id: `alert_${classData.id}_${index}`,
    ...template,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    relatedStudents: template.category === 'student' ? ['student_1', 'student_2', 'student_3'] : undefined,
    suggestedActions: template.actionRequired ? [
      {
        id: `action_${index}_1`,
        label: 'View Details',
        action: () => console.log('Action clicked'),
        primary: true
      },
      {
        id: `action_${index}_2`,
        label: 'Dismiss',
        action: () => console.log('Dismissed')
      }
    ] : undefined
  }));
}

// Main enhancement function
export function enhanceClassData(classData: Class): EnhancedClass {
  const totalStudents = classData.enrollment?.current || Math.floor(Math.random() * 25) + 5;
  
  return {
    ...classData,
    nextLesson: generateNextLesson(classData),
    momentum: generateClassMomentum(),
    preparationStatus: generateNextLesson(classData).preparationStatus,
    studentInsights: generateStudentInsights(totalStudents),
    performanceMetrics: generatePerformanceMetrics(),
    objectives: generateLearningObjectives(classData.subject),
    alerts: generateSmartAlerts(classData)
  };
}

// Batch enhance multiple classes
export function enhanceClassesData(classes: Class[]): EnhancedClass[] {
  return classes.map(enhanceClassData);
}

// Generate teaching analytics for dashboard
export function generateTeachingAnalytics(classes: EnhancedClass[]): TeachingAnalytics {
  const totalStudents = classes.reduce((sum, cls) => sum + (cls.enrollment?.current || 0), 0);
  const avgPerformance = classes.reduce((sum, cls) => sum + cls.performanceMetrics.teachingEffectiveness, 0) / classes.length;
  
  // Generate trend data for last 7 days
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 20) + 70
    };
  });
  
  return {
    overview: {
      totalClasses: classes.length,
      totalStudents,
      averagePerformance: Math.round(avgPerformance),
      totalLessonsDelivered: Math.floor(Math.random() * 50) + 20,
      upcomingDeadlines: Math.floor(Math.random() * 8) + 2
    },
    trends: {
      engagementTrend: trendData.map(d => ({ ...d, label: 'Engagement' })),
      performanceTrend: trendData.map(d => ({ ...d, value: d.value + Math.floor(Math.random() * 10) - 5, label: 'Performance' })),
      attendanceTrend: trendData.map(d => ({ ...d, value: d.value + Math.floor(Math.random() * 15) - 7, label: 'Attendance' }))
    },
    insights: generateTeachingInsights(classes),
    recommendations: generateTeachingRecommendations()
  };
}

function generateTeachingInsights(classes: EnhancedClass[]): TeachingInsight[] {
  return [
    {
      id: 'insight_1',
      type: 'engagement',
      title: 'Peak Engagement Time Identified',
      description: 'Students show 23% higher engagement during morning sessions',
      impact: 'high',
      confidence: 87,
      recommendedActions: [
        'Schedule complex topics in morning slots',
        'Use interactive activities during peak times'
      ],
      dataPoints: [
        { label: 'Morning Engagement', value: 85, trend: 'up', context: 'Consistently high' },
        { label: 'Afternoon Engagement', value: 62, trend: 'stable', context: 'Moderate level' }
      ]
    }
  ];
}

function generateTeachingRecommendations() {
  return [
    {
      id: 'rec_1',
      title: 'Optimize Lesson Preparation',
      description: 'Batch similar lesson preparations to save 2+ hours weekly',
      priority: 'high' as const,
      category: 'efficiency' as const,
      estimatedImpact: '2-3 hours saved weekly',
      implementationTime: '30 minutes setup',
      actions: [
        'Group similar subjects together',
        'Create reusable templates',
        'Schedule prep time blocks'
      ]
    }
  ];
}

// Generate cross-class synergies
export function generateCrossClassSynergies(classes: EnhancedClass[]): CrossClassSynergy[] {
  if (classes.length < 2) return [];
  
  return [
    {
      id: 'synergy_1',
      type: 'content-reuse',
      title: 'Math & Science Content Overlap',
      description: 'Statistics concepts can be shared between Math and Science classes',
      involvedClasses: classes.slice(0, 2).map(c => c.id),
      potentialTimeSaved: 45,
      difficulty: 'easy',
      suggestedActions: [
        'Create shared statistics module',
        'Coordinate lesson schedules',
        'Develop cross-subject projects'
      ]
    },
    {
      id: 'synergy_2',
      type: 'batch-prep',
      title: 'Weekly Assessment Preparation',
      description: 'Prepare all weekly assessments in one focused session',
      involvedClasses: classes.map(c => c.id),
      potentialTimeSaved: 90,
      difficulty: 'medium',
      suggestedActions: [
        'Block 2-hour prep sessions',
        'Use assessment templates',
        'Standardize grading rubrics'
      ]
    }
  ];
}

// Local storage utilities for persistence
export function saveEnhancedData(classId: string, data: Partial<EnhancedClass>) {
  const key = `enhanced_class_${classId}`;
  const existing = localStorage.getItem(key);
  const enhancedData = existing ? JSON.parse(existing) : {};
  
  localStorage.setItem(key, JSON.stringify({ ...enhancedData, ...data }));
}

export function loadEnhancedData(classId: string): Partial<EnhancedClass> | null {
  const key = `enhanced_class_${classId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function clearEnhancedData(classId?: string) {
  if (classId) {
    localStorage.removeItem(`enhanced_class_${classId}`);
  } else {
    // Clear all enhanced data
    Object.keys(localStorage)
      .filter(key => key.startsWith('enhanced_class_'))
      .forEach(key => localStorage.removeItem(key));
  }
}