// Enhanced Class Detail Types for Teaching Command Center
export type TeachingMode = 'prep' | 'ready' | 'teaching' | 'reflect';
export type PreparationStatus = 'excellent' | 'good' | 'needs-work' | 'critical';
export type StudentStatus = 'thriving' | 'steady' | 'struggling' | 'breakthrough';
export type ParticipationType = 'active-speaker' | 'chat-focused' | 'observer' | 'camera-shy';
export type TechReliability = 'excellent' | 'good' | 'needs-support';
export type InteractionStyle = 'verbal' | 'chat' | 'breakout-rooms' | 'polls';
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic';
export type EngagementLevel = 'high' | 'medium' | 'variable';
export type ActionPriority = 'urgent' | 'important' | 'helpful';
export type WidgetType = 'student-alert' | 'prep-reminder' | 'success-celebration' | 'optimization-tip' | 'zoom-insight';

export interface NextSession {
  timeUntil: number; // minutes
  lessonTopic: string;
  studentsExpected: number;
  zoomRoomId?: string;
  materialsPrepared: boolean;
  startTime: Date;
  duration: number; // minutes
}

export interface TeachingMomentum {
  streak: number; // consecutive successful lessons
  lastRating: number; // 1-5 stars
  trend: 'improving' | 'stable' | 'needs-attention';
  weeklyProgress: {
    lessonsDelivered: number;
    avgRating: number;
    studentsEngaged: number;
  };
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  category: 'prep' | 'zoom' | 'teaching' | 'student' | 'reflection';
  priority: ActionPriority;
  timeContext: TeachingMode[];
  action: () => void;
  description?: string;
  enabled?: boolean;
}

export interface ClassObjective {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'knowledge' | 'skills' | 'understanding' | 'application';
}

export interface SmartClassHeader {
  classTitle: string;
  subject: string;
  objectives: ClassObjective[];
  nextSession: NextSession;
  teachingMomentum: TeachingMomentum;
  preparationScore: number; // 0-100
  urgentActions: QuickAction[]; // Max 3
  currentMode: TeachingMode;
}

export interface ZoomBehavior {
  typicalParticipation: ParticipationType;
  techReliability: TechReliability;
  preferredInteraction: InteractionStyle;
  averageConnectionTime: number; // minutes before class starts
  cameraUsage: number; // percentage of time
  micUsage: number; // percentage of time
  chatActivity: number; // messages per session
  breakoutPreference: 'enjoys' | 'neutral' | 'struggles';
}

export interface LearningPattern {
  bestTimeOfDay: 'morning' | 'afternoon' | 'evening';
  preferredStyle: LearningStyle;
  attentionSpan: number; // minutes
  zoomEngagement: EngagementLevel;
  conceptRetention: number; // percentage
  participationTrend: 'increasing' | 'stable' | 'decreasing';
}

export interface RecentProgress {
  conceptsMastered: string[];
  strugglingWith: string[];
  nextChallenge: string;
  lastAssignmentScore: number;
  improvementAreas: string[];
  achievements: string[];
}

export interface StudentInsight {
  id: string;
  name: string;
  avatar?: string;
  currentStatus: StudentStatus;
  zoomBehavior: ZoomBehavior;
  learningPattern: LearningPattern;
  recentProgress: RecentProgress;
  suggestions: string[]; // Zoom-specific teaching tips
  lastActive: Date;
  needsAttention: boolean;
  techSupport: {
    needsHelp: boolean;
    issues: string[];
    lastHelpDate?: Date;
  };
}

export interface LiveClassMetrics {
  engagementScore: number; // 0-100
  activeSpeakers: number;
  totalStudents: number;
  chatActivity: number;
  screenSharingQuality: 'excellent' | 'good' | 'poor';
  averageAttention: number; // estimated percentage
  breakoutRoomsActive: number;
  pollResponses: number;
}

export interface ZoomOptimization {
  currentSettings: {
    waitingRoom: boolean;
    muteOnEntry: boolean;
    videoOnEntry: boolean;
    screenShareMode: 'host-only' | 'participants' | 'disabled';
  };
  recommendations: {
    focusMode: boolean;
    annotationTools: boolean;
    breakoutStrategy: string;
    interactionFrequency: number; // minutes between interactions
  };
  techChecklist: {
    cameraTest: boolean;
    audioTest: boolean;
    lightingCheck: boolean;
    materialsPrepared: boolean;
    backupPlan: boolean;
  };
}

export interface SidebarWidget {
  id: string;
  type: WidgetType;
  priority: ActionPriority;
  title: string;
  content: string;
  action?: {
    label: string;
    handler: () => void;
  };
  timeContext: TeachingMode[];
  isVisible: boolean;
  timestamp?: Date;
}

export interface TeachingEffectiveness {
  overallScore: number; // 0-100
  trends: {
    cameraUsage: { current: number; trend: 'up' | 'down' | 'stable' };
    chatEngagement: { current: number; trend: 'up' | 'down' | 'stable' };
    breakoutSuccess: { current: number; trend: 'up' | 'down' | 'stable' };
    audioQuality: { current: number; trend: 'up' | 'down' | 'stable' };
  };
  optimizations: {
    type: 'focus-mode' | 'interactive-polls' | 'breakout-pairing' | 'annotation-tools';
    description: string;
    impact: string;
    implementation: string;
  }[];
}

export interface PrepChecklist {
  id: string;
  category: 'lesson-prep' | 'zoom-tech' | 'student-support' | 'materials';
  items: {
    id: string;
    task: string;
    completed: boolean;
    required: boolean;
    timeEstimate: number; // minutes
    description?: string;
  }[];
  completionScore: number; // 0-100
  urgentItems: number;
}

export interface ClassDetailContext {
  currentMode: TeachingMode;
  timeToClass: number; // minutes
  isLive: boolean;
  classData: any; // existing class data from API
  header: SmartClassHeader;
  studentInsights: StudentInsight[];
  sidebarWidgets: SidebarWidget[];
  teachingEffectiveness: TeachingEffectiveness;
  prepChecklist: PrepChecklist[];
  liveMetrics?: LiveClassMetrics;
  zoomOptimization: ZoomOptimization;
  recommendations: {
    id: string;
    type: 'preparation' | 'engagement' | 'optimization' | 'student-support';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    timeToImplement: number; // minutes
    actions: string[];
  }[];
}

export interface DashboardSettings {
  autoModeSwitch: boolean;
  notificationsEnabled: boolean;
  zoomIntegration: boolean;
  advancedAnalytics: boolean;
  mobileOptimized: boolean;
  voiceNotes: boolean;
}

export interface SessionReflection {
  id: string;
  sessionDate: Date;
  overallRating: number; // 1-5
  whatWorkedWell: string[];
  challengesFaced: string[];
  studentFeedback: string[];
  improvementAreas: string[];
  nextSessionChanges: string[];
  voiceNotes?: string[]; // URLs to audio recordings
  keyMoments: {
    timestamp: number; // minutes into session
    description: string;
    type: 'breakthrough' | 'challenge' | 'engagement' | 'tech-issue';
  }[];
}

// Utility types for API enhancement
export interface EnhancementConfig {
  enablePredictiveAnalytics: boolean;
  zoomIntegrationLevel: 'basic' | 'advanced' | 'full';
  studentDataPrivacy: 'minimal' | 'standard' | 'detailed';
  realTimeUpdates: boolean;
}

export interface ClassDetailAPI {
  getCurrentMode: (timeToClass: number, isLive: boolean) => TeachingMode;
  calculatePreparationScore: (classData: any, checklist: PrepChecklist[]) => number;
  generateStudentInsights: (students: any[], classHistory: any[]) => StudentInsight[];
  getContextualActions: (mode: TeachingMode, classData: any) => QuickAction[];
  updateLiveMetrics: (zoomData: any) => LiveClassMetrics;
  generateRecommendations: (context: ClassDetailContext) => any[];
}