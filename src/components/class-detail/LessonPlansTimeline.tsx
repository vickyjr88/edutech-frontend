import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Lightbulb
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

interface LessonPlan {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  sequenceNumber: number;
  objectives?: string[];
  activities?: string[];
  resourceFiles?: Array<{ name: string; url: string; type: string }>;
  resourceLinks?: Array<{ title: string; url: string }>;
  isCompleted?: boolean;
  completedAt?: Date;
  scheduledDate?: Date;
  teachingNotes?: string;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  estimatedPreparationTime?: number; // in minutes
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

  // Calculate smart readiness analysis for a lesson
  const calculateReadinessAnalysis = (lesson: LessonPlan): ReadinessAnalysis => {
    if (lesson.readinessAnalysis) {
      return lesson.readinessAnalysis;
    }

    // Handle both string arrays and object arrays for objectives/activities
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

    // Calculate content completeness score
    const completenessFactors = [
      factors.hasObjectives ? 25 : 0,
      factors.hasActivities ? 25 : 0,
      factors.hasResources ? 25 : 0,
      factors.hasDescription ? 25 : 0
    ];
    factors.contentCompleteness = completenessFactors.reduce((sum, score) => sum + score, 0);

    // Calculate overall readiness score
    const baseScore = factors.contentCompleteness;
    const qualityBonus = factors.descriptionQuality > 80 ? 10 : factors.descriptionQuality > 50 ? 5 : 0;
    const preparationBonus = lesson.estimatedPreparationTime ? 5 : 0;
    const notesBonus = lesson.teachingNotes ? 5 : 0;
    
    const score = Math.min(100, baseScore + qualityBonus + preparationBonus + notesBonus);

    // Determine readiness level
    let level: ReadinessAnalysis['level'];
    if (score >= 90) level = 'excellent';
    else if (score >= 70) level = 'good';
    else if (score >= 50) level = 'needs-improvement';
    else level = 'not-ready';

    // Generate smart suggestions
    const suggestions: string[] = [];
    if (!factors.hasObjectives) suggestions.push('Add clear learning objectives');
    if (!factors.hasActivities) suggestions.push('Define engaging classroom activities');
    if (!factors.hasResources) suggestions.push('Include supporting resources or materials');
    if (!factors.hasDescription) suggestions.push('Write a detailed lesson description');
    if (factors.descriptionQuality < 50) suggestions.push('Expand the lesson description for clarity');
    if (!lesson.estimatedPreparationTime) suggestions.push('Estimate preparation time needed');
    if (!lesson.teachingNotes) suggestions.push('Add personal teaching notes or tips');

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
  const getObjectiveText = (objective: string | { objective: string; isCompleted?: boolean; _id?: string } | any): string => {
    if (typeof objective === 'string') {
      return objective;
    }
    if (objective && typeof objective === 'object' && objective.objective) {
      return objective.objective;
    }
    return 'Objective not specified';
  };

  // Utility function to safely extract activity text from objects or strings
  const getActivityText = (activity: string | { activity?: string; name?: string; description?: string; _id?: string } | any): string => {
    if (typeof activity === 'string') {
      return activity;
    }
    if (activity && typeof activity === 'object') {
      return activity.activity || activity.name || activity.description || 'Activity not specified';
    }
    return 'Activity not specified';
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
                        <span>{lesson.sequenceNumber}</span>
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
                              {lesson.duration} min
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

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-kidato-gray-100">
                    {/* Readiness Analysis Section */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-kidato-spindle/10 to-kidato-indigo/10 rounded-lg">
                      <h4 className="font-medium text-kidato-gray-900 mb-3 flex items-center">
                        <Brain className="h-4 w-4 mr-2 text-kidato-indigo" />
                        Smart Readiness Analysis
                        <Badge 
                          variant="outline" 
                          className={cn(readinessConfig.color, readinessConfig.bg, "ml-3")}
                        >
                          <readinessConfig.icon className="h-3 w-3 mr-1" />
                          {readinessAnalysis.score}% {readinessConfig.label}
                        </Badge>
                      </h4>
                      
                      {/* Readiness Factors */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className={cn("text-center p-2 rounded", 
                          readinessAnalysis.factors.hasObjectives ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>
                          <Target className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-xs font-medium">Objectives</div>
                          <div className="text-xs">{readinessAnalysis.factors.hasObjectives ? '✓' : '○'}</div>
                        </div>
                        <div className={cn("text-center p-2 rounded", 
                          readinessAnalysis.factors.hasActivities ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>
                          <Users className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-xs font-medium">Activities</div>
                          <div className="text-xs">{readinessAnalysis.factors.hasActivities ? '✓' : '○'}</div>
                        </div>
                        <div className={cn("text-center p-2 rounded", 
                          readinessAnalysis.factors.hasResources ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>
                          <FileText className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-xs font-medium">Resources</div>
                          <div className="text-xs">{readinessAnalysis.factors.hasResources ? '✓' : '○'}</div>
                        </div>
                        <div className={cn("text-center p-2 rounded", 
                          readinessAnalysis.factors.hasDescription ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>
                          <BookOpen className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-xs font-medium">Description</div>
                          <div className="text-xs">{readinessAnalysis.factors.hasDescription ? '✓' : '○'}</div>
                        </div>
                      </div>
                      
                      {/* Smart Suggestions */}
                      {readinessAnalysis.suggestions.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-kidato-gray-800 mb-2 flex items-center">
                            <Lightbulb className="h-3 w-3 mr-1 text-kidato-orange" />
                            Smart Suggestions
                          </h5>
                          <ul className="space-y-1">
                            {readinessAnalysis.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="text-sm text-kidato-gray-700 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-kidato-orange flex-shrink-0 mt-2"></div>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* Objectives */}
                        {lesson.objectives && lesson.objectives.length > 0 && (
                          <div>
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
                                  <span className="text-kidato-gray-700">{getObjectiveText(objective)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Activities */}
                        {lesson.activities && lesson.activities.length > 0 && (
                          <div>
                            <h4 className="font-medium text-kidato-gray-900 mb-3 flex items-center">
                              <Users className="h-4 w-4 mr-2 text-kidato-orange" />
                              Activities
                            </h4>
                            <ul className="space-y-2">
                              {lesson.activities.map((activity, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <div className="w-5 h-5 rounded-full bg-kidato-orange/10 flex items-center justify-center text-kidato-orange text-xs font-medium flex-shrink-0 mt-0.5">
                                    {idx + 1}
                                  </div>
                                  <span className="text-kidato-gray-700">{getActivityText(activity)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {/* Resources */}
                        {((lesson.resourceFiles && lesson.resourceFiles.length > 0) || 
                          (lesson.resourceLinks && lesson.resourceLinks.length > 0)) && (
                          <div>
                            <h4 className="font-medium text-kidato-gray-900 mb-3 flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-kidato-spindle" />
                              Resources
                            </h4>
                            <div className="space-y-3">
                              {/* Files */}
                              {lesson.resourceFiles && lesson.resourceFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-2 bg-kidato-gray-50 rounded-lg">
                                  <FileText className="h-4 w-4 text-kidato-spindle" />
                                  <span className="text-sm text-kidato-gray-700 flex-1">{file.name}</span>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                              
                              {/* Links */}
                              {lesson.resourceLinks && lesson.resourceLinks.map((link, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-2 bg-kidato-gray-50 rounded-lg">
                                  <ExternalLink className="h-4 w-4 text-kidato-spindle" />
                                  <a 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-kidato-indigo hover:underline flex-1"
                                  >
                                    {link.title}
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Preparation Time */}
                        {lesson.estimatedPreparationTime && (
                          <div className="bg-kidato-orange/10 rounded-lg p-3">
                            <h4 className="font-medium text-kidato-gray-900 mb-2 flex items-center">
                              <TimerIcon className="h-4 w-4 mr-2 text-kidato-orange" />
                              Preparation Time
                            </h4>
                            <p className="text-sm text-kidato-gray-700">
                              Estimated {lesson.estimatedPreparationTime} minutes needed to prepare this lesson
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {lesson.description && (
                      <div className="mt-6 pt-4 border-t border-kidato-gray-100">
                        <h4 className="font-medium text-kidato-gray-900 mb-3">Lesson Description</h4>
                        <div className="prose prose-sm max-w-full text-kidato-gray-700">
                          <p>{lesson.description}</p>
                        </div>
                      </div>
                    )}

                    {/* Teaching Notes */}
                    {lesson.teachingNotes && (
                      <div className="mt-4 p-3 bg-kidato-indigo/5 rounded-lg">
                        <h4 className="font-medium text-kidato-indigo mb-2 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Teaching Notes
                        </h4>
                        <p className="text-sm text-kidato-gray-700">{lesson.teachingNotes}</p>
                      </div>
                    )}

                    {/* Completion Info */}
                    {lesson.isCompleted && lesson.completedAt && (
                      <div className="mt-4 p-3 bg-kidato-indigo/10 rounded-lg flex items-center gap-3">
                        <Award className="h-5 w-5 text-kidato-indigo" />
                        <div>
                          <p className="font-medium text-kidato-indigo">Lesson Completed!</p>
                          <p className="text-sm text-kidato-gray-700">
                            Finished on {format(lesson.completedAt, 'MMM d, yyyy \'at\' h:mm a')}
                          </p>
                        </div>
                      </div>
                    )}
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