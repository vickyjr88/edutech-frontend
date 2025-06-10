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
  TeachingMomentum
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

// Generate mock student insights with Zoom behavior
export function generateStudentInsights(classData: any): StudentInsight[] {
  const studentNames = [
    'Sarah Chen', 'Marcus Johnson', 'Maya Patel', 'James Wilson', 
    'Emma Rodriguez', 'Alex Kim', 'Zoe Taylor', 'Lucas Brown'
  ];
  
  const participationTypes = ['active-speaker', 'chat-focused', 'observer', 'camera-shy'] as const;
  const techReliabilities = ['excellent', 'good', 'needs-support'] as const;
  const interactionStyles = ['verbal', 'chat', 'breakout-rooms', 'polls'] as const;
  const learningStyles = ['visual', 'auditory', 'kinesthetic'] as const;
  const statuses = ['thriving', 'steady', 'struggling', 'breakthrough'] as const;
  
  return studentNames.slice(0, classData.enrollment?.current || 6).map((name, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const needsAttention = status === 'struggling' || Math.random() < 0.2;
    
    return {
      id: `student_${index + 1}`,
      name,
      currentStatus: status,
      needsAttention,
      zoomBehavior: {
        typicalParticipation: participationTypes[Math.floor(Math.random() * participationTypes.length)],
        techReliability: techReliabilities[Math.floor(Math.random() * techReliabilities.length)],
        preferredInteraction: interactionStyles[Math.floor(Math.random() * interactionStyles.length)],
        averageConnectionTime: Math.floor(Math.random() * 10) + 2, // 2-12 minutes
        cameraUsage: Math.floor(Math.random() * 40) + 60, // 60-100%
        micUsage: Math.floor(Math.random() * 30) + 20, // 20-50%
        chatActivity: Math.floor(Math.random() * 8) + 2, // 2-10 messages
        breakoutPreference: ['enjoys', 'neutral', 'struggles'][Math.floor(Math.random() * 3)] as any
      },
      learningPattern: {
        bestTimeOfDay: ['morning', 'afternoon', 'evening'][Math.floor(Math.random() * 3)] as any,
        preferredStyle: learningStyles[Math.floor(Math.random() * learningStyles.length)],
        attentionSpan: Math.floor(Math.random() * 20) + 15, // 15-35 minutes
        zoomEngagement: ['high', 'medium', 'variable'][Math.floor(Math.random() * 3)] as any,
        conceptRetention: Math.floor(Math.random() * 30) + 70, // 70-100%
        participationTrend: ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)] as any
      },
      recentProgress: {
        conceptsMastered: generateRandomConcepts(2, classData.subject),
        strugglingWith: needsAttention ? generateRandomConcepts(1, classData.subject) : [],
        nextChallenge: `Advanced ${classData.subject} applications`,
        lastAssignmentScore: Math.floor(Math.random() * 30) + 70,
        improvementAreas: needsAttention ? ['Focus during lectures', 'Ask more questions'] : [],
        achievements: status === 'thriving' ? ['Perfect attendance', 'Helped peers'] : []
      },
      suggestions: generateZoomTeachingTips(status, name),
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      techSupport: {
        needsHelp: Math.random() < 0.15,
        issues: Math.random() < 0.15 ? ['Unstable internet', 'Audio issues'] : [],
        lastHelpDate: Math.random() < 0.1 ? new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) : undefined
      }
    };
  });
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
          id: 'review_students',
          label: 'Review Students',
          icon: 'Users',
          category: 'student',
          priority: 'helpful',
          timeContext: ['prep'],
          action: () => console.log('Review students')
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
          id: 'send_reminders',
          label: 'Send Reminders',
          icon: 'MessageSquare',
          category: 'student',
          priority: 'important',
          timeContext: ['ready'],
          action: () => console.log('Send reminders')
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
          id: 'breakout_rooms',
          label: 'Breakout Rooms',
          icon: 'Users',
          category: 'teaching',
          priority: 'helpful',
          timeContext: ['teaching'],
          action: () => console.log('Create breakout rooms')
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
          id: 'voice_reflection',
          label: 'Voice Reflection',
          icon: 'Mic',
          category: 'reflection',
          priority: 'important',
          timeContext: ['reflect'],
          action: () => console.log('Record reflection')
        },
        {
          id: 'update_progress',
          label: 'Update Progress',
          icon: 'Target',
          category: 'student',
          priority: 'important',
          timeContext: ['reflect'],
          action: () => console.log('Update progress')
        },
        {
          id: 'prep_next',
          label: 'Prep Next Session',
          icon: 'Calendar',
          category: 'prep',
          priority: 'helpful',
          timeContext: ['reflect'],
          action: () => console.log('Prep next')
        }
      );
      break;
  }
  
  return baseActions;
}

// Generate sidebar widgets based on context
export function generateSidebarWidgets(mode: TeachingMode, classData: any): SidebarWidget[] {
  const widgets: SidebarWidget[] = [];
  const now = new Date();
  
  // Mode-specific widgets
  if (mode === 'prep') {
    widgets.push({
      id: 'prep_reminder_1',
      type: 'prep-reminder',
      priority: 'important',
      title: 'Material Upload',
      content: 'Don\'t forget to upload today\'s presentation slides',
      timeContext: ['prep'],
      isVisible: true,
      timestamp: new Date(now.getTime() - 30 * 60 * 1000) // 30 minutes ago
    });
  }
  
  if (mode === 'teaching') {
    widgets.push({
      id: 'engagement_alert',
      type: 'student-alert',
      priority: 'urgent',
      title: 'Engagement Drop',
      content: '3 students seem distracted - consider an interactive activity',
      action: {
        label: 'Create Poll',
        handler: () => console.log('Create poll')
      },
      timeContext: ['teaching'],
      isVisible: true,
      timestamp: now
    });
  }
  
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
          completed: true,
          required: true,
          timeEstimate: 10,
          description: 'Clear, measurable learning outcomes'
        },
        {
          id: 'materials',
          task: 'Teaching materials prepared',
          completed: true,
          required: true,
          timeEstimate: 20
        },
        {
          id: 'activities',
          task: 'Interactive activities planned',
          completed: false,
          required: true,
          timeEstimate: 15
        }
      ],
      completionScore: 67,
      urgentItems: 1
    },
    {
      id: 'zoom_tech',
      category: 'zoom-tech',
      items: [
        {
          id: 'screen_share',
          task: 'Screen sharing materials tested',
          completed: true,
          required: true,
          timeEstimate: 5
        },
        {
          id: 'connection_test',
          task: 'Student connection test sent',
          completed: false,
          required: false,
          timeEstimate: 2
        },
        {
          id: 'breakout_config',
          task: 'Breakout room activities planned',
          completed: false,
          required: false,
          timeEstimate: 10
        }
      ],
      completionScore: 33,
      urgentItems: 0
    }
  ];
}

// Generate teaching effectiveness data
export function generateTeachingEffectiveness(): TeachingEffectiveness {
  return {
    overallScore: Math.floor(Math.random() * 20) + 80, // 80-100
    trends: {
      cameraUsage: {
        current: Math.floor(Math.random() * 30) + 70,
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any
      },
      chatEngagement: {
        current: Math.floor(Math.random() * 25) + 75,
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any
      },
      breakoutSuccess: {
        current: Math.floor(Math.random() * 30) + 70,
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any
      },
      audioQuality: {
        current: Math.floor(Math.random() * 15) + 85,
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any
      }
    },
    optimizations: [
      {
        type: 'focus-mode',
        description: 'Enable Focus Mode to reduce distractions during complex explanations',
        impact: 'Increases attention by 25%',
        implementation: 'Available in Zoom settings during screen share'
      },
      {
        type: 'interactive-polls',
        description: 'Use polls every 15 minutes to maintain engagement',
        impact: 'Boosts participation by 40%',
        implementation: 'Quick polls through Zoom or external tools'
      },
      {
        type: 'breakout-pairing',
        description: 'Strategic student pairing in breakout rooms',
        impact: 'Improves collaboration outcomes',
        implementation: 'Pre-assign groups based on learning styles'
      }
    ]
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
      focusMode: true,
      annotationTools: true,
      breakoutStrategy: 'Groups of 3 for optimal discussion',
      interactionFrequency: 15 // Every 15 minutes
    },
    techChecklist: {
      cameraTest: true,
      audioTest: true,
      lightingCheck: false,
      materialsPrepared: true,
      backupPlan: false
    }
  };
}

// Helper functions
function getTimeToNextClass(classData: any): number {
  // Mock implementation - returns random time
  return Math.floor(Math.random() * 48 * 60); // 0-48 hours in minutes
}

function generateRandomConcepts(count: number, subject: string): string[] {
  const concepts: Record<string, string[]> = {
    mathematics: ['Quadratic Equations', 'Linear Functions', 'Probability', 'Statistics', 'Geometry'],
    science: ['Photosynthesis', 'Chemical Reactions', 'Newton\'s Laws', 'Cell Division', 'Atomic Structure'],
    english: ['Essay Structure', 'Poetry Analysis', 'Grammar Rules', 'Creative Writing', 'Reading Comprehension'],
    history: ['World War II', 'Industrial Revolution', 'Ancient Rome', 'Renaissance', 'Cold War'],
    default: ['Key Concepts', 'Core Principles', 'Advanced Topics', 'Practical Applications']
  };
  
  const subjectConcepts = concepts[subject.toLowerCase()] || concepts.default;
  return subjectConcepts.slice(0, count);
}

function generateZoomTeachingTips(status: string, studentName: string): string[] {
  const tips: Record<string, string[]> = {
    struggling: [
      `Use breakout rooms to give ${studentName} more speaking opportunities`,
      `Check in privately via chat to ensure understanding`,
      `Provide visual aids and screen annotations for better comprehension`
    ],
    thriving: [
      `Leverage ${studentName} as a peer mentor in breakout rooms`,
      `Challenge with advanced questions and leadership roles`,
      `Use their enthusiasm to boost overall class energy`
    ],
    steady: [
      `Encourage ${studentName} with direct questions and positive feedback`,
      `Use polls and interactive features to increase participation`,
      `Pair with more confident students in group activities`
    ],
    breakthrough: [
      `Celebrate ${studentName}'s recent progress publicly`,
      `Build on their momentum with slightly challenging tasks`,
      `Document their improvement for parent communication`
    ]
  };
  
  return tips[status] || tips.steady;
}

// Main enhancement function
export function enhanceClassDetailData(classData: any): ClassDetailContext {
  const timeToClass = getTimeToNextClass(classData);
  const isLive = false; // This would come from actual Zoom integration
  const currentMode = getCurrentTeachingMode(timeToClass, isLive);
  
  const prepChecklists = generatePrepChecklists(classData);
  const preparationScore = calculatePreparationScore(classData, prepChecklists);
  
  const nextSession: NextSession = {
    timeUntil: timeToClass,
    lessonTopic: 'Quadratic Equations and Real-World Applications',
    studentsExpected: classData.enrollment?.current || 8,
    zoomRoomId: '123-456-789',
    materialsPrepared: preparationScore > 80,
    startTime: new Date(Date.now() + timeToClass * 60 * 1000),
    duration: 60
  };
  
  const teachingMomentum: TeachingMomentum = {
    streak: Math.floor(Math.random() * 15) + 5,
    lastRating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
    trend: ['improving', 'stable', 'needs-attention'][Math.floor(Math.random() * 3)] as any,
    weeklyProgress: {
      lessonsDelivered: Math.floor(Math.random() * 8) + 3,
      avgRating: 4.2 + Math.random() * 0.6,
      studentsEngaged: Math.floor(Math.random() * 20) + 30
    }
  };
  
  const header: SmartClassHeader = {
    classTitle: classData.title || 'Advanced Mathematics',
    subject: classData.subject || 'Mathematics',
    nextSession,
    teachingMomentum,
    preparationScore,
    urgentActions: getContextualActions(currentMode, classData).slice(0, 3),
    currentMode
  };
  
  return {
    currentMode,
    timeToClass,
    isLive,
    classData,
    header,
    studentInsights: generateStudentInsights(classData),
    sidebarWidgets: generateSidebarWidgets(currentMode, classData),
    teachingEffectiveness: generateTeachingEffectiveness(),
    prepChecklist: prepChecklists,
    zoomOptimization: generateZoomOptimization(),
    recommendations: []
  };
}