import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  Clock, 
  Calendar,
  Play,
  BookOpen,
  Target,
  Users,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Star,
  Award,
  Zap,
  AlertCircle,
  TimerIcon,
  User,
  Edit,
  Plus,
  Brain,
  TrendingUp,
  Shield,
  Lightbulb,
  GraduationCap,
  ListChecks,
  Layers,
  Package,
  ClipboardList,
  StickyNote,
  MapPin,
  Banknote,
  ShoppingCart,
  Workflow,
  Presentation,
  MessageSquare,
  Compass,
  Settings,
  CheckSquare,
  Calculator,
  Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, isAfter, isBefore, isToday } from 'date-fns';

interface ReadinessAnalysis {
  score: number; // 0-100
  level: 'excellent' | 'good' | 'needs-improvement' | 'not-ready';
  factors: {
    hasObjectives: boolean;
    hasActivities: boolean;
    hasResources: boolean;
    hasDescription: boolean;
    descriptionQuality: number; // 0-100
    contentCompleteness: number; // 0-100
  };
  suggestions: string[];
}

// Comprehensive lesson plan types matching the JSON structure
interface LessonObjective {
  objective: string;
  isCompleted: boolean;
  _id: string;
}

interface LessonRequirement {
  type: 'materials' | 'read_article' | 'worksheet' | 'video' | 'document_upload' | 'survey';
  title: string;
  description: string;
  instructions: string;
  isRequired: boolean;
  materialsDescription?: string;
  materialsList?: string[];
  whereToGet?: string;
  estimatedCost?: string;
  acceptedFileTypes?: string[];
  status: 'pending' | 'completed' | 'in_progress';
  _id: string;
  attachments?: any[];
  resourceLinks?: any[];
}

interface LessonStarter {
  title: string;
  description: string;
  duration: number;
  instructions: string;
  materialsNeeded: string[];
  _id: string;
}

interface LessonFlowStep {
  title: string;
  description: string;
  duration: number;
  order: number;
  teachingMethod: 'lecture' | 'demonstration' | 'practical' | 'discussion';
  studentActivity: string;
  teacherInstructions: string;
  materialsNeeded: string[];
  _id: string;
  resourceFiles?: any[];
  resourceLinks?: any[];
}

interface LessonActivity {
  title: string;
  description: string;
  duration: number;
  instructions: string;
  activityType: 'individual' | 'group_work' | 'practical' | 'discussion' | 'presentation';
  learningOutcome: string;
  successCriteria: string[];
  differentiation: string;
  resourceFiles?: any[];
  resourceLinks?: any[];
  _id: string;
}

interface AssessmentMethod {
  method: string;
  description: string;
  timeAllocation: number;
  criteria: string[];
  format: 'written' | 'verbal' | 'practical' | 'online';
  type: 'formative' | 'summative' | 'peer';
  instructions: string;
  _id: string;
  id: string;
}

interface LessonPlenary {
  summaryActivity: string;
  duration: number;
  keyTakeaways: string;
  closingInstructions: string;
  reflectionPrompts: string;
  assessmentMethods: AssessmentMethod[];
  _id: string;
}

interface ResourceFile {
  filename: string;
  url: string;
  fileSize: number;
  mimeType: string;
  description: string;
  _id: string;
}

interface ResourceLink {
  title: string;
  url: string;
  description: string;
  _id: string;
}

interface LessonPlan {
  id: string;
  _id: string;
  class: string;
  title: string;
  description: string;
  type: 'lecture' | 'practical' | 'workshop' | 'assessment' | 'discussion' | 'field_trip' | 'presentation' | 'review';
  lessonNumber: number;
  duration: number;
  requirements: LessonRequirement[];
  prerequisites: string;
  tags: string[];
  objectives: LessonObjective[];
  successCriteria: string[];
  starter: LessonStarter;
  lessonFlow: LessonFlowStep[];
  activities: LessonActivity[];
  plenary: LessonPlenary;
  homework: string;
  resourceFiles: ResourceFile[];
  resourceLinks: ResourceLink[];
  status: 'draft' | 'published' | 'archived';
  isCompleted: boolean;
  completedAt?: Date;
  scheduledDate?: Date;
  createdBy: string;
  assessmentMethods: AssessmentMethod[];
  __v: number;
  createdAt: string;
  updatedAt: string;
  sessionEndTime?: Date;
  totalRequiredMaterials: string[];
  totalPreparationTime: number;
  // Legacy fields for backward compatibility
  sequenceNumber?: number;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  teachingNotes?: string;
  estimatedPreparationTime?: number;
  readinessAnalysis?: ReadinessAnalysis;
}

interface LessonPlansTimelineProps {
  lessonPlans: LessonPlan[];
  currentLessonIndex?: number;
  classStartDate?: Date;
  onLessonClick?: (lesson: LessonPlan) => void;
  onEditLesson?: (lesson: LessonPlan) => void;
  onMarkComplete?: (lesson: LessonPlan) => void;
  onAddLesson?: () => void;
}

const LessonPlansTimeline: React.FC<LessonPlansTimelineProps> = ({
  lessonPlans = [],
  currentLessonIndex = 0,
  classStartDate = new Date(),
  onLessonClick,
  onEditLesson,
  onMarkComplete,
  onAddLesson
}) => {
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  // Calculate smart readiness analysis for a comprehensive lesson
  const calculateReadinessAnalysis = (lesson: LessonPlan): ReadinessAnalysis => {
    if (lesson.readinessAnalysis) {
      return lesson.readinessAnalysis;
    }

    // Enhanced analysis for comprehensive lesson structure
    const validObjectives = lesson.objectives?.filter(obj => {
      const text = getObjectiveText(obj);
      return text && text !== 'Objective not specified' && text.trim().length > 0;
    }) || [];
    
    const validActivities = lesson.activities?.filter(activity => {
      const text = getActivityText(activity);
      return text && text !== 'Activity not specified' && text.trim().length > 0;
    }) || [];

    const factors = {
      hasObjectives: validObjectives.length > 0,
      hasActivities: validActivities.length > 0,
      hasResources: !!(lesson.resourceFiles?.length > 0 || lesson.resourceLinks?.length > 0),
      hasDescription: !!(lesson.description && lesson.description.length > 20),
      descriptionQuality: lesson.description ? Math.min(100, lesson.description.length * 2) : 0,
      contentCompleteness: 0
    };

    // Enhanced completeness calculation
    const completenessFactors = [
      factors.hasObjectives ? 15 : 0,
      factors.hasActivities ? 15 : 0,
      factors.hasResources ? 15 : 0,
      factors.hasDescription ? 15 : 0,
      lesson.starter?.title ? 10 : 0,
      lesson.lessonFlow?.length > 0 ? 10 : 0,
      lesson.plenary?.summaryActivity ? 10 : 0,
      lesson.requirements?.length > 0 ? 10 : 0
    ];
    factors.contentCompleteness = completenessFactors.reduce((sum, score) => sum + score, 0);

    // Calculate overall readiness score
    const baseScore = factors.contentCompleteness;
    const qualityBonus = factors.descriptionQuality > 80 ? 5 : factors.descriptionQuality > 50 ? 3 : 0;
    const preparationBonus = (lesson.estimatedPreparationTime || lesson.totalPreparationTime) ? 3 : 0;
    const notesBonus = lesson.teachingNotes ? 2 : 0;
    
    const score = Math.min(100, baseScore + qualityBonus + preparationBonus + notesBonus);

    // Determine readiness level
    let level: ReadinessAnalysis['level'];
    if (score >= 90) level = 'excellent';
    else if (score >= 70) level = 'good';
    else if (score >= 50) level = 'needs-improvement';
    else level = 'not-ready';

    // Generate smart suggestions for comprehensive lesson
    const suggestions: string[] = [];
    if (!factors.hasObjectives) suggestions.push('Add clear learning objectives');
    if (!factors.hasActivities) suggestions.push('Define engaging classroom activities');
    if (!factors.hasResources) suggestions.push('Include supporting resources or materials');
    if (!factors.hasDescription) suggestions.push('Write a detailed lesson description');
    if (!lesson.starter?.title) suggestions.push('Add a lesson starter activity');
    if (!lesson.lessonFlow?.length) suggestions.push('Define lesson flow steps');
    if (!lesson.plenary?.summaryActivity) suggestions.push('Add a lesson plenary/summary');
    if (!lesson.requirements?.length) suggestions.push('Specify lesson requirements and materials');
    if (factors.descriptionQuality < 50) suggestions.push('Expand the lesson description for clarity');
    if (!(lesson.estimatedPreparationTime || lesson.totalPreparationTime)) suggestions.push('Estimate preparation time needed');

    return {
      score,
      level,
      factors,
      suggestions
    };
  };

  // Calculate lesson status based on sequence and completion
  const getLessonStatus = (lesson: LessonPlan, index: number): 'completed' | 'current' | 'upcoming' => {
    if (lesson.isCompleted) return 'completed';
    if (index === currentLessonIndex) return 'current';
    if (index < currentLessonIndex) return 'completed'; // Should be completed if we're past it
    return 'upcoming';
  };

  // Calculate total lesson duration including all components
  const calculateTotalDuration = (lesson: LessonPlan): number => {
    let total = lesson.duration || 0;
    
    // Add starter duration
    if (lesson.starter?.duration) {
      total += lesson.starter.duration;
    }
    
    // Add lesson flow durations
    if (lesson.lessonFlow?.length) {
      total += lesson.lessonFlow.reduce((sum, step) => sum + (step.duration || 0), 0);
    }
    
    // Add activity durations
    if (lesson.activities?.length) {
      total += lesson.activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
    }
    
    // Add plenary duration
    if (lesson.plenary?.duration) {
      total += lesson.plenary.duration;
    }
    
    return total;
  };

  // Calculate total material costs
  const calculateTotalCost = (lesson: LessonPlan): { min: number; max: number; currency: string } => {
    let minCost = 0;
    let maxCost = 0;
    
    lesson.requirements?.forEach(req => {
      if (req.estimatedCost) {
        const costStr = req.estimatedCost.replace(/[^0-9-]/g, '');
        const costs = costStr.split('-').map(c => parseInt(c) || 0);
        if (costs.length === 2) {
          minCost += costs[0];
          maxCost += costs[1];
        } else if (costs.length === 1) {
          minCost += costs[0];
          maxCost += costs[0];
        }
      }
    });
    
    return { min: minCost, max: maxCost, currency: 'Ksh' };
  };

  // Get styling for lesson status
  const getStatusConfig = (status: 'completed' | 'current' | 'upcoming') => {
    switch (status) {
      case 'completed':
        return {
          cardClass: 'border-kidato-indigo/20 bg-kidato-indigo/5 hover:bg-kidato-indigo/10',
          numberClass: 'bg-kidato-indigo text-white',
          icon: <CheckCircle2 className="h-4 w-4" />,
          badgeClass: 'bg-kidato-indigo text-white',
          badgeText: 'Completed',
          progressColor: 'kidato-indigo'
        };
      case 'current':
        return {
          cardClass: 'border-kidato-orange bg-kidato-orange/5 hover:bg-kidato-orange/10 ring-2 ring-kidato-orange/20',
          numberClass: 'bg-kidato-orange text-white animate-pulse',
          icon: <Play className="h-4 w-4" />,
          badgeClass: 'bg-kidato-orange text-white',
          badgeText: 'Current',
          progressColor: 'kidato-orange'
        };
      case 'upcoming':
        return {
          cardClass: 'border-kidato-gray-200 bg-white hover:bg-kidato-spindle/5',
          numberClass: 'bg-kidato-spindle text-kidato-gray-700',
          icon: <Clock className="h-4 w-4" />,
          badgeClass: 'bg-kidato-spindle text-kidato-gray-700',
          badgeText: 'Upcoming',
          progressColor: 'kidato-spindle'
        };
    }
  };

  // Calculate estimated lesson date
  const getEstimatedDate = (index: number): Date => {
    // Assuming weekly lessons, you could make this more sophisticated
    return addDays(classStartDate, index * 7);
  };

  // Calculate total progress
  const completedLessons = lessonPlans.filter(lesson => lesson.isCompleted).length;
  const progressPercentage = lessonPlans.length > 0 ? (completedLessons / lessonPlans.length) * 100 : 0;

  // Get difficulty level styling
  const getDifficultyConfig = (level?: string) => {
    switch (level) {
      case 'beginner':
        return { color: 'text-green-600', bg: 'bg-green-100', label: 'Beginner' };
      case 'intermediate':
        return { color: 'text-kidato-orange', bg: 'bg-kidato-orange/10', label: 'Intermediate' };
      case 'advanced':
        return { color: 'text-red-600', bg: 'bg-red-100', label: 'Advanced' };
      default:
        return { color: 'text-kidato-gray-600', bg: 'bg-kidato-gray-100', label: 'Standard' };
    }
  };

  // Get readiness level styling
  const getReadinessConfig = (level: ReadinessAnalysis['level']) => {
    switch (level) {
      case 'excellent':
        return { 
          color: 'text-green-600', 
          bg: 'bg-green-100', 
          label: 'Excellent', 
          icon: Shield,
          scoreColor: 'text-green-700'
        };
      case 'good':
        return { 
          color: 'text-blue-600', 
          bg: 'bg-blue-100', 
          label: 'Good', 
          icon: TrendingUp,
          scoreColor: 'text-blue-700'
        };
      case 'needs-improvement':
        return { 
          color: 'text-kidato-orange', 
          bg: 'bg-kidato-orange/10', 
          label: 'Needs Work', 
          icon: Brain,
          scoreColor: 'text-kidato-orange'
        };
      case 'not-ready':
        return { 
          color: 'text-red-600', 
          bg: 'bg-red-100', 
          label: 'Not Ready', 
          icon: AlertCircle,
          scoreColor: 'text-red-700'
        };
    }
  };

  const toggleExpanded = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  // Utility function to safely extract objective text from objects or strings
  const getObjectiveText = (objective: string | LessonObjective | any): string => {
    if (typeof objective === 'string') {
      return objective;
    }
    if (objective && typeof objective === 'object' && objective.objective) {
      return objective.objective;
    }
    return 'Objective not specified';
  };

  // Utility function to safely extract activity text from objects or strings
  const getActivityText = (activity: string | LessonActivity | any): string => {
    if (typeof activity === 'string') {
      return activity;
    }
    if (activity && typeof activity === 'object') {
      return activity.title || activity.activity || activity.name || activity.description || 'Activity not specified';
    }
    return 'Activity not specified';
  };

  // Get lesson type styling
  const getLessonTypeConfig = (type: string) => {
    switch (type) {
      case 'lecture':
        return { color: 'text-blue-600', bg: 'bg-blue-100', icon: Presentation, label: 'Lecture' };
      case 'practical':
        return { color: 'text-green-600', bg: 'bg-green-100', icon: Settings, label: 'Practical' };
      case 'workshop':
        return { color: 'text-purple-600', bg: 'bg-purple-100', icon: Users, label: 'Workshop' };
      case 'assessment':
        return { color: 'text-red-600', bg: 'bg-red-100', icon: ClipboardList, label: 'Assessment' };
      case 'discussion':
        return { color: 'text-orange-600', bg: 'bg-orange-100', icon: MessageSquare, label: 'Discussion' };
      case 'field_trip':
        return { color: 'text-emerald-600', bg: 'bg-emerald-100', icon: MapPin, label: 'Field Trip' };
      case 'presentation':
        return { color: 'text-indigo-600', bg: 'bg-indigo-100', icon: Presentation, label: 'Presentation' };
      case 'review':
        return { color: 'text-gray-600', bg: 'bg-gray-100', icon: BookOpen, label: 'Review' };
      default:
        return { color: 'text-kidato-gray-600', bg: 'bg-kidato-gray-100', icon: BookOpen, label: 'Standard' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="bg-gradient-to-r from-kidato-indigo/10 to-kidato-spindle/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-kidato-gray-900">Lesson Timeline</h2>
            <p className="text-kidato-gray-600 mt-1">
              Track your class journey from start to finish
            </p>
          </div>
          <Button onClick={onAddLesson} className="bg-kidato-indigo hover:bg-kidato-indigo/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Lesson
          </Button>
        </div>

        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-kidato-gray-700">Course Progress</span>
            <span className="text-sm font-bold text-kidato-indigo">
              {completedLessons} of {lessonPlans.length} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex items-center justify-between text-xs text-kidato-gray-600">
            <span>Just getting started</span>
            <span>Course complete! 🎉</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-kidato-indigo">{completedLessons}</div>
            <div className="text-xs text-kidato-gray-600">Completed</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-kidato-orange">
              {currentLessonIndex < lessonPlans.length ? 1 : 0}
            </div>
            <div className="text-xs text-kidato-gray-600">In Progress</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-kidato-spindle">
              {lessonPlans.length - completedLessons - (currentLessonIndex < lessonPlans.length ? 1 : 0)}
            </div>
            <div className="text-xs text-kidato-gray-600">Upcoming</div>
          </div>
        </div>
      </div>

      {/* Lesson Timeline */}
      <div className="space-y-4">
        {lessonPlans.map((lesson, index) => {
          const status = getLessonStatus(lesson, index);
          const statusConfig = getStatusConfig(status);
          const difficultyConfig = getDifficultyConfig(lesson.difficultyLevel);
          const estimatedDate = getEstimatedDate(index);
          const isExpanded = expandedLesson === lesson.id;
          const readinessAnalysis = calculateReadinessAnalysis(lesson);
          const readinessConfig = getReadinessConfig(readinessAnalysis.level);

          return (
            <Card key={lesson.id} className={cn("transition-all duration-200", statusConfig.cardClass)}>
              <CardContent className="p-0">
                {/* Main Lesson Row */}
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleExpanded(lesson.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Lesson Number with Status */}
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0",
                      statusConfig.numberClass
                    )}>
                      {status === 'completed' ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <span>{lesson.sequenceNumber || lesson.lessonNumber}</span>
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-kidato-gray-900 text-lg">
                            {lesson.title}
                          </h3>
                          
                          {/* Lesson Description */}
                          {lesson.description && (
                            <p className="text-kidato-gray-600 text-sm mt-1 line-clamp-2">
                              {lesson.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-3 mt-2">
                            <Badge className={statusConfig.badgeClass}>
                              {statusConfig.icon}
                              <span className="ml-1">{statusConfig.badgeText}</span>
                            </Badge>
                            
                            {/* Lesson Type Badge */}
                            {lesson.type && (() => {
                              const typeConfig = getLessonTypeConfig(lesson.type);
                              return (
                                <Badge variant="outline" className={cn(typeConfig.color, typeConfig.bg, "gap-1")}>
                                  <typeConfig.icon className="h-3 w-3" />
                                  <span>{typeConfig.label}</span>
                                </Badge>
                              );
                            })()}
                            
                            {/* Readiness Badge */}
                            <Badge 
                              variant="outline" 
                              className={cn(readinessConfig.color, readinessConfig.bg, "gap-1")}
                            >
                              <readinessConfig.icon className="h-3 w-3" />
                              <span>{readinessConfig.label}</span>
                              <span className={cn("font-mono text-xs", readinessConfig.scoreColor)}>
                                {readinessAnalysis.score}%
                              </span>
                            </Badge>
                            
                            <div className="flex items-center text-kidato-gray-600 text-sm">
                              <Clock className="h-4 w-4 mr-1" />
                              {calculateTotalDuration(lesson)} min
                            </div>
                            <div className="flex items-center text-kidato-gray-600 text-sm">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(estimatedDate, 'MMM d')}
                            </div>
                            {lesson.difficultyLevel && (
                              <Badge variant="outline" className={cn(difficultyConfig.color, difficultyConfig.bg)}>
                                {difficultyConfig.label}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {status === 'current' && !lesson.isCompleted && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkComplete?.(lesson);
                              }}
                              className="bg-kidato-orange hover:bg-kidato-orange/90"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditLesson?.(lesson);
                            }}
                            className="text-kidato-gray-600 hover:text-kidato-indigo"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-kidato-gray-400" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-kidato-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content - Comprehensive Tabbed Interface */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-kidato-gray-100">
                    {/* Quick Stats Bar */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gradient-to-r from-kidato-indigo/10 to-kidato-indigo/20 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-kidato-indigo">{calculateTotalDuration(lesson)}</div>
                        <div className="text-xs text-kidato-gray-600">Total Minutes</div>
                      </div>
                      <div className="bg-gradient-to-r from-kidato-orange/10 to-kidato-orange/20 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-kidato-orange">{lesson.objectives?.length || 0}</div>
                        <div className="text-xs text-kidato-gray-600">Objectives</div>
                      </div>
                      <div className="bg-gradient-to-r from-kidato-spindle/10 to-kidato-spindle/20 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-kidato-spindle">{lesson.activities?.length || 0}</div>
                        <div className="text-xs text-kidato-gray-600">Activities</div>
                      </div>
                      <div className="bg-gradient-to-r from-green-100/50 to-green-200/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-600">{lesson.totalRequiredMaterials?.length || 0}</div>
                        <div className="text-xs text-kidato-gray-600">Materials</div>
                      </div>
                    </div>

                    {/* Readiness Analysis - Compact Version */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-kidato-spindle/10 to-kidato-indigo/10 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-kidato-gray-900 flex items-center">
                          <Brain className="h-4 w-4 mr-2 text-kidato-indigo" />
                          Readiness Analysis
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={cn(readinessConfig.color, readinessConfig.bg)}
                        >
                          <readinessConfig.icon className="h-3 w-3 mr-1" />
                          {readinessAnalysis.score}% {readinessConfig.label}
                        </Badge>
                      </div>
                      {readinessAnalysis.suggestions.length > 0 && (
                        <div className="text-sm text-kidato-gray-700">
                          <Lightbulb className="h-3 w-3 inline mr-1 text-kidato-orange" />
                          {readinessAnalysis.suggestions[0]}
                          {readinessAnalysis.suggestions.length > 1 && (
                            <span className="text-kidato-gray-500 ml-1">+{readinessAnalysis.suggestions.length - 1} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Comprehensive Tabbed Interface */}
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview" className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          <span className="hidden sm:inline">Overview</span>
                        </TabsTrigger>
                        <TabsTrigger value="structure" className="flex items-center gap-1">
                          <Workflow className="h-3 w-3" />
                          <span className="hidden sm:inline">Structure</span>
                        </TabsTrigger>
                        <TabsTrigger value="resources" className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          <span className="hidden sm:inline">Resources</span>
                        </TabsTrigger>
                        <TabsTrigger value="assessment" className="flex items-center gap-1">
                          <ClipboardList className="h-3 w-3" />
                          <span className="hidden sm:inline">Assessment</span>
                        </TabsTrigger>
                        <TabsTrigger value="notes" className="flex items-center gap-1">
                          <StickyNote className="h-3 w-3" />
                          <span className="hidden sm:inline">Notes</span>
                        </TabsTrigger>
                      </TabsList>

                      {/* Overview Tab */}
                      <TabsContent value="overview" className="space-y-4 mt-4">
                        {/* Description */}
                        {lesson.description && (
                          <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                            <h4 className="font-medium text-kidato-gray-900 mb-2 flex items-center">
                              <BookOpen className="h-4 w-4 mr-2 text-kidato-indigo" />
                              Lesson Description
                            </h4>
                            <p className="text-kidato-gray-700">{lesson.description}</p>
                          </div>
                        )}

                        {/* Learning Objectives */}
                        {lesson.objectives && lesson.objectives.length > 0 && (
                          <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                            <h4 className="font-medium text-kidato-gray-900 mb-3 flex items-center">
                              <Target className="h-4 w-4 mr-2 text-kidato-indigo" />
                              Learning Objectives
                            </h4>
                            <ul className="space-y-2">
                              {lesson.objectives.map((objective, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <div className="w-5 h-5 rounded-full bg-kidato-indigo/10 flex items-center justify-center text-kidato-indigo text-xs font-medium flex-shrink-0 mt-0.5">
                                    {idx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-kidato-gray-700">{getObjectiveText(objective)}</span>
                                    {typeof objective === 'object' && objective.isCompleted && (
                                      <CheckCircle2 className="h-4 w-4 text-green-500 inline ml-2" />
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Success Criteria */}
                        {lesson.successCriteria && lesson.successCriteria.length > 0 && (
                          <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                            <h4 className="font-medium text-kidato-gray-900 mb-3 flex items-center">
                              <CheckSquare className="h-4 w-4 mr-2 text-green-600" />
                              Success Criteria
                            </h4>
                            <ul className="space-y-1">
                              {lesson.successCriteria.map((criteria, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-2"></div>
                                  <span className="text-kidato-gray-700">{criteria}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Prerequisites and Tags */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {lesson.prerequisites && (
                            <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                              <h4 className="font-medium text-kidato-gray-900 mb-2 flex items-center">
                                <Bookmark className="h-4 w-4 mr-2 text-kidato-orange" />
                                Prerequisites
                              </h4>
                              <p className="text-kidato-gray-700">{lesson.prerequisites}</p>
                            </div>
                          )}
                          {lesson.tags && lesson.tags.length > 0 && (
                            <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                              <h4 className="font-medium text-kidato-gray-900 mb-2">Tags</h4>
                              <div className="flex flex-wrap gap-2">
                                {lesson.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      {/* Structure Tab */}
                      <TabsContent value="structure" className="space-y-4 mt-4">
                        {/* Starter Activity */}
                        {lesson.starter && (
                          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 p-4">
                            <h4 className="font-medium text-kidato-gray-900 mb-2 flex items-center">
                              <Zap className="h-4 w-4 mr-2 text-green-600" />
                              Starter Activity
                              <Badge variant="outline" className="ml-2 text-xs">
                                {lesson.starter.duration} min
                              </Badge>
                            </h4>
                            <h5 className="font-medium text-green-800 mb-1">{lesson.starter.title}</h5>
                            <p className="text-kidato-gray-700 mb-2">{lesson.starter.description}</p>
                            <p className="text-sm text-kidato-gray-600 mb-2">{lesson.starter.instructions}</p>
                            {lesson.starter.materialsNeeded && lesson.starter.materialsNeeded.length > 0 && (
                              <div className="mt-2">
                                <span className="text-sm font-medium text-kidato-gray-700">Materials needed: </span>
                                <span className="text-sm text-kidato-gray-600">{lesson.starter.materialsNeeded.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Lesson Flow */}
                        {lesson.lessonFlow && lesson.lessonFlow.length > 0 && (
                          <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                            <h4 className="font-medium text-kidato-gray-900 mb-3 flex items-center">
                              <Workflow className="h-4 w-4 mr-2 text-kidato-indigo" />
                              Lesson Flow
                            </h4>
                            <div className="space-y-3">
                              {lesson.lessonFlow.map((step, idx) => (
                                <div key={idx} className="flex gap-3 p-3 bg-kidato-gray-50 rounded-lg">
                                  <div className="w-8 h-8 rounded-full bg-kidato-indigo/10 flex items-center justify-center text-kidato-indigo font-medium text-sm flex-shrink-0">
                                    {step.order}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="font-medium text-kidato-gray-900">{step.title}</h5>
                                      <Badge variant="outline" className="text-xs">
                                        {step.duration} min
                                      </Badge>
                                      <Badge variant="outline" className="text-xs capitalize">
                                        {step.teachingMethod}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-kidato-gray-700 mb-2">{step.description}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                      <div>
                                        <span className="font-medium text-kidato-gray-700">Student Activity: </span>
                                        <span className="text-kidato-gray-600">{step.studentActivity}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium text-kidato-gray-700">Teacher Instructions: </span>
                                        <span className="text-kidato-gray-600">{step.teacherInstructions}</span>
                                      </div>
                                    </div>
                                    {step.materialsNeeded && step.materialsNeeded.length > 0 && (
                                      <div className="mt-2 text-xs">
                                        <span className="font-medium text-kidato-gray-700">Materials: </span>
                                        <span className="text-kidato-gray-600">{step.materialsNeeded.join(', ')}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Activities */}
                        {lesson.activities && lesson.activities.length > 0 && (
                          <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                            <h4 className="font-medium text-kidato-gray-900 mb-3 flex items-center">
                              <Users className="h-4 w-4 mr-2 text-kidato-orange" />
                              Activities
                            </h4>
                            <div className="space-y-3">
                              {lesson.activities.map((activity, idx) => (
                                <div key={idx} className="border border-kidato-gray-200 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h5 className="font-medium text-kidato-gray-900">{activity.title}</h5>
                                    <Badge variant="outline" className="text-xs">
                                      {activity.duration} min
                                    </Badge>
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {activity.activityType.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-kidato-gray-700 mb-2">{activity.description}</p>
                                  <p className="text-sm text-kidato-gray-600 mb-2">{activity.instructions}</p>
                                  <div className="text-xs text-kidato-gray-600">
                                    <div className="mb-1">
                                      <span className="font-medium">Learning Outcome: </span>
                                      {activity.learningOutcome}
                                    </div>
                                    {activity.differentiation && (
                                      <div className="mb-1">
                                        <span className="font-medium">Differentiation: </span>
                                        {activity.differentiation}
                                      </div>
                                    )}
                                    {activity.successCriteria && activity.successCriteria.length > 0 && (
                                      <div>
                                        <span className="font-medium">Success Criteria: </span>
                                        {activity.successCriteria.join(', ')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Plenary */}
                        {lesson.plenary && (
                          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-4">
                            <h4 className="font-medium text-kidato-gray-900 mb-2 flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2 text-purple-600" />
                              Plenary
                              <Badge variant="outline" className="ml-2 text-xs">
                                {lesson.plenary.duration} min
                              </Badge>
                            </h4>
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium text-purple-800">Summary Activity: </span>
                                <span className="text-kidato-gray-700">{lesson.plenary.summaryActivity}</span>
                              </div>
                              <div>
                                <span className="font-medium text-purple-800">Key Takeaways: </span>
                                <span className="text-kidato-gray-700">{lesson.plenary.keyTakeaways}</span>
                              </div>
                              <div>
                                <span className="font-medium text-purple-800">Closing Instructions: </span>
                                <span className="text-kidato-gray-700">{lesson.plenary.closingInstructions}</span>
                              </div>
                              {lesson.plenary.reflectionPrompts && (
                                <div>
                                  <span className="font-medium text-purple-800">Reflection Prompts: </span>
                                  <span className="text-kidato-gray-700">{lesson.plenary.reflectionPrompts}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      {/* Resources Tab */}
                      <TabsContent value="resources" className="space-y-4 mt-4">
                        {/* Requirements with Cost Calculator */}
                        {lesson.requirements && lesson.requirements.length > 0 && (
                          <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-kidato-gray-900 flex items-center">
                                <Package className="h-4 w-4 mr-2 text-kidato-indigo" />
                                Requirements & Materials
                              </h4>
                              {(() => {
                                const costs = calculateTotalCost(lesson);
                                return costs.max > 0 && (
                                  <div className="flex items-center gap-2">
                                    <Calculator className="h-4 w-4 text-kidato-orange" />
                                    <span className="text-sm font-medium text-kidato-orange">
                                      {costs.currency} {costs.min}{costs.min !== costs.max ? ` - ${costs.max}` : ''}
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>
                            <div className="space-y-3">
                              {lesson.requirements.map((req, idx) => (
                                <div key={idx} className="border border-kidato-gray-200 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h5 className="font-medium text-kidato-gray-900">{req.title}</h5>
                                    <Badge variant={req.isRequired ? "default" : "secondary"} className="text-xs">
                                      {req.isRequired ? 'Required' : 'Optional'}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {req.type.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-kidato-gray-700 mb-2">{req.description}</p>
                                  <p className="text-sm text-kidato-gray-600 mb-2">{req.instructions}</p>
                                  {req.materialsDescription && (
                                    <div className="text-xs text-kidato-gray-600 mb-2">
                                      <span className="font-medium">Materials: </span>
                                      {req.materialsDescription}
                                    </div>
                                  )}
                                  {req.materialsList && req.materialsList.length > 0 && (
                                    <div className="text-xs text-kidato-gray-600 mb-2">
                                      <span className="font-medium">Items: </span>
                                      {req.materialsList.join(', ')}
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between text-xs text-kidato-gray-600">
                                    {req.whereToGet && (
                                      <div>
                                        <span className="font-medium">Where to get: </span>
                                        {req.whereToGet}
                                      </div>
                                    )}
                                    {req.estimatedCost && (
                                      <div className="flex items-center gap-1">
                                        <Banknote className="h-3 w-3" />
                                        <span className="font-medium">{req.estimatedCost}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Resource Files and Links */}
                        {((lesson.resourceFiles && lesson.resourceFiles.length > 0) || 
                          (lesson.resourceLinks && lesson.resourceLinks.length > 0)) && (
                          <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                            <h4 className="font-medium text-kidato-gray-900 mb-3 flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-kidato-spindle" />
                              Digital Resources
                            </h4>
                            <div className="space-y-3">
                              {/* Files */}
                              {lesson.resourceFiles && lesson.resourceFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-kidato-gray-50 rounded-lg">
                                  <FileText className="h-5 w-5 text-kidato-spindle" />
                                  <div className="flex-1">
                                    <div className="font-medium text-kidato-gray-900">{file.filename}</div>
                                    <div className="text-sm text-kidato-gray-600">{file.description}</div>
                                    <div className="text-xs text-kidato-gray-500">
                                      {file.mimeType} • {(file.fileSize / 1024).toFixed(1)} KB
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                      <Download className="h-4 w-4" />
                                    </a>
                                  </Button>
                                </div>
                              ))}
                              
                              {/* Links */}
                              {lesson.resourceLinks && lesson.resourceLinks.map((link, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-kidato-gray-50 rounded-lg">
                                  <ExternalLink className="h-5 w-5 text-kidato-spindle" />
                                  <div className="flex-1">
                                    <div className="font-medium text-kidato-gray-900">{link.title}</div>
                                    <div className="text-sm text-kidato-gray-600">{link.description}</div>
                                    <div className="text-xs text-kidato-gray-500">{link.url}</div>
                                  </div>
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Total Materials List */}
                        {lesson.totalRequiredMaterials && lesson.totalRequiredMaterials.length > 0 && (
                          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 p-4">
                            <h4 className="font-medium text-kidato-gray-900 mb-3 flex items-center">
                              <ShoppingCart className="h-4 w-4 mr-2 text-green-600" />
                              Complete Shopping List
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {lesson.totalRequiredMaterials.map((material, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-kidato-gray-700">{material}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      {/* Assessment Tab */}
                      <TabsContent value="assessment" className="space-y-4 mt-4">
                        {/* Assessment Methods */}
                        {((lesson.assessmentMethods && lesson.assessmentMethods.length > 0) || 
                          (lesson.plenary?.assessmentMethods && lesson.plenary.assessmentMethods.length > 0)) && (
                          <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                            <h4 className="font-medium text-kidato-gray-900 mb-3 flex items-center">
                              <ClipboardList className="h-4 w-4 mr-2 text-kidato-indigo" />
                              Assessment Methods
                            </h4>
                            <div className="space-y-3">
                              {/* Main assessment methods */}
                              {lesson.assessmentMethods && lesson.assessmentMethods.map((assessment, idx) => (
                                <div key={idx} className="border border-kidato-gray-200 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h5 className="font-medium text-kidato-gray-900">{assessment.method}</h5>
                                    <Badge variant="outline" className="text-xs">
                                      {assessment.timeAllocation} min
                                    </Badge>
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {assessment.type}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {assessment.format}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-kidato-gray-700 mb-2">{assessment.description}</p>
                                  <p className="text-sm text-kidato-gray-600 mb-2">{assessment.instructions}</p>
                                  {assessment.criteria && assessment.criteria.length > 0 && (
                                    <div className="text-xs text-kidato-gray-600">
                                      <span className="font-medium">Criteria: </span>
                                      {assessment.criteria.join(', ')}
                                    </div>
                                  )}
                                </div>
                              ))}
                              
                              {/* Plenary assessment methods */}
                              {lesson.plenary?.assessmentMethods && lesson.plenary.assessmentMethods.map((assessment, idx) => (
                                <div key={`plenary-${idx}`} className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h5 className="font-medium text-kidato-gray-900">{assessment.method}</h5>
                                    <Badge variant="outline" className="text-xs">
                                      {assessment.timeAllocation} min
                                    </Badge>
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {assessment.type}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      Plenary
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-kidato-gray-700 mb-2">{assessment.description}</p>
                                  <p className="text-sm text-kidato-gray-600 mb-2">{assessment.instructions}</p>
                                  {assessment.criteria && assessment.criteria.length > 0 && (
                                    <div className="text-xs text-kidato-gray-600">
                                      <span className="font-medium">Criteria: </span>
                                      {assessment.criteria.join(', ')}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Homework */}
                        {lesson.homework && (
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
                            <h4 className="font-medium text-kidato-gray-900 mb-2 flex items-center">
                              <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                              Homework Assignment
                            </h4>
                            <p className="text-kidato-gray-700">{lesson.homework}</p>
                          </div>
                        )}
                      </TabsContent>

                      {/* Teaching Notes Tab */}
                      <TabsContent value="notes" className="space-y-4 mt-4">
                        {/* Preparation Time */}
                        {(lesson.estimatedPreparationTime || lesson.totalPreparationTime) && (
                          <div className="bg-gradient-to-r from-kidato-orange/10 to-kidato-orange/20 rounded-lg border border-kidato-orange/30 p-4">
                            <h4 className="font-medium text-kidato-gray-900 mb-2 flex items-center">
                              <TimerIcon className="h-4 w-4 mr-2 text-kidato-orange" />
                              Preparation Time
                            </h4>
                            <p className="text-kidato-gray-700">
                              Estimated {lesson.estimatedPreparationTime || lesson.totalPreparationTime} minutes needed to prepare this lesson
                            </p>
                          </div>
                        )}

                        {/* Teaching Notes */}
                        {lesson.teachingNotes && (
                          <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                            <h4 className="font-medium text-kidato-gray-900 mb-2 flex items-center">
                              <StickyNote className="h-4 w-4 mr-2 text-kidato-indigo" />
                              Teaching Notes
                            </h4>
                            <p className="text-kidato-gray-700">{lesson.teachingNotes}</p>
                          </div>
                        )}

                        {/* Completion Status */}
                        {lesson.isCompleted && lesson.completedAt && (
                          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 p-4">
                            <div className="flex items-center gap-3">
                              <Award className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="font-medium text-green-800">Lesson Completed!</p>
                                <p className="text-sm text-kidato-gray-700">
                                  Finished on {format(new Date(lesson.completedAt), 'MMM d, yyyy \'at\' h:mm a')}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {lessonPlans.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-kidato-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-kidato-gray-900 mb-2">No lessons yet</h3>
          <p className="text-kidato-gray-600 mb-6">Start building your course by adding your first lesson.</p>
          <Button onClick={onAddLesson} className="bg-kidato-indigo hover:bg-kidato-indigo/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Lesson
          </Button>
        </div>
      )}
    </div>
  );
};

export default LessonPlansTimeline;