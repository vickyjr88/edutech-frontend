// Class Detail Enhancement Utilities
import {
  ClassDetailContext,
  TeachingMode,
  SmartClassHeader,
  StudentInsight,
  SidebarWidget,
  TeachingEffectiveness,
  PrepChecklist,
  ZoomOptimization,
  QuickAction,
  NextSession,
  TeachingMomentum,
  ClassObjective
} from '@/types/class-detail';

// Determine teaching mode based on time to class
export function getCurrentTeachingMode(timeToClass: number, isLive: boolean): TeachingMode {
  if (isLive) return 'teaching';
  if (timeToClass <= 0) return 'reflect';
  if (timeToClass <= 120) return 'ready'; // 2 hours or less
  return 'prep';
}

// Calculate preparation score
export function calculatePreparationScore(
  classData: any,
  checklists: PrepChecklist[]
): number {
  const totalItems = checklists.reduce((sum, checklist) => sum + checklist.items.length, 0);
  const completedItems = checklists.reduce((sum, checklist) =>
    sum + checklist.items.filter(item => item.completed).length, 0
  );

  if (totalItems === 0) return 85; // Default good score

  const baseScore = (completedItems / totalItems) * 100;

  // Adjust based on time to class
  const timeToClass = getTimeToNextClass(classData);
  if (timeToClass > 24 * 60) return Math.max(baseScore - 10, 0); // More than a day
  if (timeToClass < 30) return Math.min(baseScore + 10, 100); // Less than 30 minutes

  return baseScore;
}

// Transform API student data to StudentInsight format
export function transformStudentsToInsights(students: any[], classData?: any): StudentInsight[] {
  if (!students || students.length === 0) {
    return [];
  }

  return students.map((student, index) => {
    // Map API status to StudentInsight status
    const getStudentStatus = (apiStatus: string, attendance: any, assignments: any): any => {
      const attendancePercentage = attendance?.percentage || 0;
      const assignmentCompletion = assignments?.completionRate || 0;

      if (apiStatus === 'Inactive' || attendancePercentage < 30) return 'struggling';
      if (attendancePercentage >= 80 && assignmentCompletion >= 80) return 'thriving';
      if (attendancePercentage >= 60 && assignmentCompletion >= 60) return 'steady';
      return 'breakthrough';
    };

    // Generate intelligent defaults for Zoom behavior based on attendance and activity
    const generateZoomBehaviorFromData = (student: any) => {
      const attendanceRate = student.attendance?.percentage || 0;
      const assignmentRate = student.assignments?.completionRate || 0;
      const isActive = student.status !== 'Inactive';

      // High performers tend to be more active in Zoom
      const participationLevel = (attendanceRate + assignmentRate) / 2;

      return {
        typicalParticipation: participationLevel >= 70 ? 'active-speaker' :
          participationLevel >= 40 ? 'chat-focused' : 'observer',
        techReliability: attendanceRate >= 70 ? 'excellent' :
          attendanceRate >= 40 ? 'good' : 'needs-support',
        preferredInteraction: participationLevel >= 60 ? 'verbal' : 'chat',
        averageConnectionTime: Math.max(2, Math.floor(participationLevel / 10) + 3),
        cameraUsage: Math.max(30, Math.floor(participationLevel * 0.8 + 20)),
        micUsage: Math.max(15, Math.floor(participationLevel * 0.5 + 15)),
        chatActivity: Math.floor(participationLevel / 15) + 2,
        breakoutPreference: participationLevel >= 60 ? 'enjoys' :
          participationLevel >= 30 ? 'neutral' : 'struggles'
      } as any;
    };

    // Generate learning pattern based on AI insights and performance
    const generateLearningPattern = (student: any) => {
      const insights = student.aiInsights?.insights || [];
      const hasProgressingWell = insights.some((insight: string) =>
        insight.toLowerCase().includes('progress') || insight.toLowerCase().includes('well')
      );

      return {
        bestTimeOfDay: ['morning', 'afternoon', 'evening'][index % 3],
        preferredStyle: ['visual', 'auditory', 'kinesthetic'][index % 3],
        attentionSpan: student.attendance?.percentage >= 70 ?
          Math.floor(Math.random() * 15) + 25 : Math.floor(Math.random() * 10) + 15,
        zoomEngagement: student.attendance?.percentage >= 70 ? 'high' :
          student.attendance?.percentage >= 40 ? 'medium' : 'variable',
        conceptRetention: Math.max(40, student.assignments?.completionRate || 0 + Math.random() * 20),
        participationTrend: hasProgressingWell ? 'increasing' :
          student.status === 'Inactive' ? 'decreasing' : 'stable'
      } as any;
    };

    const status = getStudentStatus(student.status, student.attendance, student.assignments);
    const needsAttention = status === 'struggling' || student.status === 'Inactive' ||
      student.attendance?.percentage < 50;

    return {
      id: student.studentId,
      name: student.name,
      currentStatus: status,
      needsAttention,
      zoomBehavior: generateZoomBehaviorFromData(student),
      learningPattern: generateLearningPattern(student),
      recentProgress: {
        conceptsMastered: student.aiInsights?.strengths || [],
        strugglingWith: student.aiInsights?.improvements || [],
        nextChallenge: student.enrolledClasses?.[0]?.title || 'Continue learning',
        lastAssignmentScore: Math.max(0, (student.assignments?.completionRate || 0) + Math.random() * 20),
        improvementAreas: student.aiInsights?.improvements || [],
        achievements: student.aiInsights?.strengths || []
      },
      suggestions: student.aiInsights?.insights || ['Monitor student progress closely'],
      lastActive: new Date(student.lastActivityTimestamp || Date.now() - 86400000), // 1 day ago default
      techSupport: {
        needsHelp: student.attendance?.percentage < 30,
        issues: student.attendance?.percentage < 30 ? ['Connection issues', 'Technical difficulties'] : [],
        lastHelpDate: student.attendance?.percentage < 30 ? new Date(Date.now() - 604800000) : undefined // 1 week ago
      }
    };
  });
}

// Generate default student insights (empty)
export function generateStudentInsights(classData: any): StudentInsight[] {
  // If we don't have real student data, return empty array instead of fake students
  return [];
}

// Generate contextual quick actions
export function getContextualActions(mode: TeachingMode, classData: any): QuickAction[] {
  const baseActions: QuickAction[] = [];

  switch (mode) {
    case 'prep':
      baseActions.push(
        {
          id: 'prep_materials',
          label: 'Prep Materials',
          icon: 'FileText',
          category: 'prep',
          priority: 'important',
          timeContext: ['prep'],
          action: () => console.log('Prep materials')
        },
        {
          id: 'test_zoom',
          label: 'Test Zoom Room',
          icon: 'Video',
          category: 'zoom',
          priority: 'important',
          timeContext: ['prep'],
          action: () => console.log('Test Zoom')
        }
      );
      break;

    case 'ready':
      baseActions.push(
        {
          id: 'final_tech_check',
          label: 'Final Tech Check',
          icon: 'Settings',
          category: 'zoom',
          priority: 'urgent',
          timeContext: ['ready'],
          action: () => console.log('Tech check')
        },
        {
          id: 'start_zoom',
          label: 'Start Zoom Room',
          icon: 'Video',
          category: 'zoom',
          priority: 'urgent',
          timeContext: ['ready'],
          action: () => console.log('Start Zoom')
        }
      );
      break;

    case 'teaching':
      baseActions.push(
        {
          id: 'quick_poll',
          label: 'Quick Poll',
          icon: 'BarChart3',
          category: 'teaching',
          priority: 'helpful',
          timeContext: ['teaching'],
          action: () => console.log('Create poll')
        },
        {
          id: 'quick_note',
          label: 'Quick Note',
          icon: 'FileText',
          category: 'reflection',
          priority: 'helpful',
          timeContext: ['teaching'],
          action: () => console.log('Take note')
        }
      );
      break;

    case 'reflect':
      baseActions.push(
        {
          id: 'update_progress',
          label: 'Update Progress',
          icon: 'Target',
          category: 'student',
          priority: 'important',
          timeContext: ['reflect'],
          action: () => console.log('Update progress')
        }
      );
      break;
  }

  return baseActions;
}

// Generate sidebar widgets based on context
export function generateSidebarWidgets(mode: TeachingMode, classData: any): SidebarWidget[] {
  const widgets: SidebarWidget[] = [];
  // Removed mock widgets
  return widgets;
}

// Generate preparation checklists
export function generatePrepChecklists(classData: any): PrepChecklist[] {
  return [
    {
      id: 'lesson_prep',
      category: 'lesson-prep',
      items: [
        {
          id: 'objectives',
          task: 'Learning objectives defined',
          completed: false,
          required: true,
          timeEstimate: 10,
          description: 'Clear, measurable learning outcomes'
        },
        {
          id: 'materials',
          task: 'Teaching materials prepared',
          completed: false,
          required: true,
          timeEstimate: 20
        }
      ],
      completionScore: 0,
      urgentItems: 0
    }
  ];
}

// Generate teaching effectiveness data (Empty/Default)
export function generateTeachingEffectiveness(): TeachingEffectiveness {
  return {
    overallScore: 0,
    trends: {
      cameraUsage: {
        current: 0,
        trend: 'stable'
      },
      chatEngagement: {
        current: 0,
        trend: 'stable'
      },
      breakoutSuccess: {
        current: 0,
        trend: 'stable'
      },
      audioQuality: {
        current: 100,
        trend: 'stable'
      }
    },
    optimizations: []
  };
}

// Generate zoom optimization settings
export function generateZoomOptimization(): ZoomOptimization {
  return {
    currentSettings: {
      waitingRoom: true,
      muteOnEntry: true,
      videoOnEntry: false,
      screenShareMode: 'host-only'
    },
    recommendations: {
      focusMode: false,
      annotationTools: true,
      breakoutStrategy: 'Manual',
      interactionFrequency: 15
    },
    techChecklist: {
      cameraTest: false,
      audioTest: false,
      lightingCheck: false,
      materialsPrepared: false,
      backupPlan: false
    }
  };
}

// Extract and format class objectives from API data
export function extractClassObjectives(classData: any): ClassObjective[] {
  if (!classData.objectives) return [];

  // Handle string format (comma-separated objectives)
  if (typeof classData.objectives === 'string') {
    return classData.objectives
      .split('•')
      .map((obj: string) => obj.trim()) // explicit string type
      .filter((obj: string) => obj.length > 0)
      .map((text: string, index: number) => ({
        id: `objective_${index + 1}`,
        text: text.replace(/^[-•\d+\.\s]+/, '').trim(),
        completed: false,
        priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low' as any,
        category: inferObjectiveCategory(text)
      }));
  }

  // Handle array format
  if (Array.isArray(classData.objectives)) {
    return classData.objectives.map((objective: any, index: number) => ({
      id: objective.id || `objective_${index + 1}`,
      text: objective.objective || objective.text || objective,
      completed: objective.isCompleted || objective.completed || false,
      priority: objective.priority || (index === 0 ? 'high' : index === 1 ? 'medium' : 'low') as any,
      category: objective.category || inferObjectiveCategory(objective.objective || objective.text || objective)
    }));
  }

  return [];
}

// Infer objective category based on content
function inferObjectiveCategory(text: string): 'knowledge' | 'skills' | 'understanding' | 'application' {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('apply') || lowerText.includes('use') || lowerText.includes('solve') || lowerText.includes('create')) {
    return 'application';
  }
  if (lowerText.includes('analyze') || lowerText.includes('understand') || lowerText.includes('explain') || lowerText.includes('interpret')) {
    return 'understanding';
  }
  if (lowerText.includes('demonstrate') || lowerText.includes('perform') || lowerText.includes('execute') || lowerText.includes('show')) {
    return 'skills';
  }
  return 'knowledge'; // Default category
}

// Helper functions
export function getTimeToNextClass(classData: any): number {
  // If class has explicit next session info use it
  if (classData.nextSession?.startTime) {
    const start = new Date(classData.nextSession.startTime);
    return Math.max(0, (start.getTime() - Date.now()) / (1000 * 60));
  }
  return 24 * 60; // Default to 24 hours if unknown
}

function generateRandomConcepts(count: number, subject?: string): string[] {
  return [];
}

function generateZoomTeachingTips(status: string, studentName: string): string[] {
  return [];
}

// Main enhancement function
export function enhanceClassDetailData(classData: any, enhancementData?: {
  teacherSummary?: any;
  currentClassSummary?: any;
  studentsData?: any;
}): ClassDetailContext {
  const timeToClass = getTimeToNextClass(classData);
  const isLive = false; // This would come from actual Zoom integration
  const currentMode = getCurrentTeachingMode(timeToClass, isLive);

  const prepChecklists = generatePrepChecklists(classData);
  const preparationScore = calculatePreparationScore(classData, prepChecklists);

  // Use real teacher summary data for next session if available
  const currentClassSummary = enhancementData?.currentClassSummary;
  const nextSession: NextSession = {
    timeUntil: currentClassSummary?.nextSession?.timeLeft || timeToClass,
    lessonTopic: currentClassSummary?.nextSession?.title || 'Upcoming Lesson',
    studentsExpected: currentClassSummary?.nextSession?.enrolledStudents || classData.enrollment?.current || 8,
    zoomRoomId: '123-456-789', // This would come from Zoom integration
    materialsPrepared: (currentClassSummary?.nextSession?.readiness?.overallReadiness || preparationScore) > 80,
    startTime: currentClassSummary?.nextSession ? new Date(currentClassSummary.nextSession.startTime) : new Date(Date.now() + timeToClass * 60 * 1000),
    duration: currentClassSummary?.nextSession?.duration || 60
  };

  // Use real teacher summary analytics for teaching momentum
  const teacherAnalytics = enhancementData?.teacherSummary?.analytics;
  const teachingMomentum: TeachingMomentum = {
    streak: 0, // Not tracked yet
    lastRating: currentClassSummary?.rating || 0,
    trend: teacherAnalytics?.trends?.engagementTrend || 'stable',
    weeklyProgress: {
      lessonsDelivered: teacherAnalytics?.recentActivity?.upcomingSessions || 0,
      avgRating: teacherAnalytics?.overallPerformance?.averageProgress ? (teacherAnalytics.overallPerformance.averageProgress / 20) : 0,
      studentsEngaged: teacherAnalytics?.recentActivity?.activeStudentsThisWeek || 0
    }
  };

  const header: SmartClassHeader = {
    classTitle: classData.title || 'Advanced Mathematics',
    subject: classData.subject || 'Mathematics',
    objectives: extractClassObjectives(classData),
    nextSession,
    teachingMomentum,
    preparationScore,
    urgentActions: getContextualActions(currentMode, classData).slice(0, 3),
    currentMode
  };

  // Use real student data when available
  const studentInsights = enhancementData?.studentsData?.students
    ? transformStudentsToInsights(enhancementData.studentsData.students, classData)
    : generateStudentInsights(classData);

  return {
    currentMode,
    timeToClass,
    isLive,
    classData,
    header,
    studentInsights,
    sidebarWidgets: generateSidebarWidgets(currentMode, classData),
    teachingEffectiveness: generateTeachingEffectiveness(),
    prepChecklist: prepChecklists,
    zoomOptimization: generateZoomOptimization(),
    recommendations: []
  };
}