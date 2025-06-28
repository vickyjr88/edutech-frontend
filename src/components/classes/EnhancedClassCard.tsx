import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Eye,
  MessageSquare,
  Settings,
  Play,
  Target,
  Zap,
  Activity
} from 'lucide-react';
import { EnhancedClass } from '@/types/enhanced-classes';
import { cn } from '@/lib/utils';

interface EnhancedClassCardProps {
  classData: EnhancedClass;
  onViewClass: (classData: EnhancedClass) => void;
  onEditClass?: (classData: EnhancedClass) => void;
  onMessageStudents?: (classData: EnhancedClass) => void;
  onPrepareLesson?: (classData: EnhancedClass) => void;
  variant?: 'compact' | 'normal' | 'detailed';
}

const EnhancedClassCard: React.FC<EnhancedClassCardProps> = ({
  classData,
  onViewClass,
  onEditClass,
  onMessageStudents,
  onPrepareLesson,
  variant = 'normal'
}) => {
  const getPreparationStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-50';
      case 'prep': return 'text-yellow-600 bg-yellow-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMomentumIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEngagementColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getEngagementLevel = (percentage: number): string => {
    if (percentage >= 80) return 'high';
    if (percentage >= 60) return 'medium';
    return 'low';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const getSmartTimeDisplay = (startTime: string, timeLeft?: number) => {
    // Use API timeLeft if available (more accurate), otherwise calculate from startTime
    if (timeLeft !== undefined) {
      if (timeLeft <= 0) return 'Session passed';
      if (timeLeft < 60) return 'Starting soon';
      if (timeLeft < 120) return 'In 1 hour';
      if (timeLeft < 1440) return `In ${Math.round(timeLeft / 60)} hours`;
      
      const days = Math.round(timeLeft / 1440);
      if (days === 1) return 'Tomorrow';
      if (days < 7) return `In ${days} days`;
    }
    
    // Fallback to calculating from startTime
    const sessionDate = new Date(startTime);
    const now = new Date();
    const diffMs = sessionDate.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) return 'Session passed';
    if (diffHours < 1) return 'Starting soon';
    if (diffHours < 2) return 'In 1 hour';
    if (diffHours < 24) return `In ${diffHours} hours`;
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return formatDate(sessionDate);
  };

  const getSessionUrgency = (startTime: string) => {
    const sessionDate = new Date(startTime);
    const now = new Date();
    const diffHours = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 0) return 'passed';
    if (diffHours < 2) return 'critical';
    if (diffHours < 24) return 'soon';
    return 'upcoming';
  };

  const getReadinessItems = (readiness: any) => {
    const items = [
      { key: 'lessonPlanReady', label: 'Lesson Plan', ready: readiness?.lessonPlanReady },
      { key: 'materialsReady', label: 'Materials', ready: readiness?.materialsReady },
      { key: 'zoomSetup', label: 'Zoom Setup', ready: readiness?.zoomSetup },
      { key: 'studentsNotified', label: 'Students Notified', ready: readiness?.studentsNotified }
    ];
    
    const ready = items.filter(item => item.ready);
    const pending = items.filter(item => !item.ready);
    
    return { ready, pending, total: items.length };
  };

  const urgentAlerts = 0; // No alerts in new structure

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewClass(classData)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{classData.title}</h3>
            <div className="flex items-center gap-1">
              {classData.nextLesson && getSessionUrgency(classData.nextLesson.scheduledDate.toISOString()) === 'critical' && (
                <Badge variant="destructive" className="text-xs px-1">
                  URGENT
                </Badge>
              )}
              {classData.nextLesson && getSessionUrgency(classData.nextLesson.scheduledDate.toISOString()) === 'soon' && (
                <Badge variant="outline" className="text-xs px-1 border-yellow-400 text-yellow-700">
                  SOON
                </Badge>
              )}
              {getMomentumIcon('stable')}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {classData.enrollment?.current || 0}
            </span>
            <span className={cn("px-2 py-1 rounded text-xs", getPreparationStatusColor(classData.preparationStatus))}>
              {classData.preparationStatus.replace('-', ' ')}
            </span>
          </div>
          {classData.nextLesson && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-700 truncate">
                Lesson {classData.nextLesson.lessonNumber}: {classData.nextLesson.topic}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{getSmartTimeDisplay(classData.nextLesson.scheduledDate.toISOString())}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{classData.title}</h3>
              {urgentAlerts > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {urgentAlerts} Alert{urgentAlerts > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{classData.subject}</p>
          </div>
          <div className="flex items-center gap-2">
            {classData.nextLesson && (
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  getSessionUrgency(classData.nextLesson.scheduledDate.toISOString()) === 'critical' && "border-red-200 text-red-700",
                  getSessionUrgency(classData.nextLesson.scheduledDate.toISOString()) === 'soon' && "border-yellow-200 text-yellow-700",
                  getSessionUrgency(classData.nextLesson.scheduledDate.toISOString()) === 'upcoming' && "border-blue-200 text-blue-700"
                )}
              >
                <Clock className="h-3 w-3 mr-1" />
                {getSmartTimeDisplay(classData.nextLesson.scheduledDate.toISOString())}
              </Badge>
            )}
            <Badge 
              variant={classData.status === 'published' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {classData.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Smart Next Lesson Preview */}
        {classData.nextLesson && (
          <div className={cn(
            "rounded-lg p-3 border-l-4",
            getSessionUrgency(classData.nextLesson.scheduledDate.toISOString()) === 'critical' && "bg-red-50 border-red-400",
            getSessionUrgency(classData.nextLesson.scheduledDate.toISOString()) === 'soon' && "bg-yellow-50 border-yellow-400",
            getSessionUrgency(classData.nextLesson.scheduledDate.toISOString()) === 'upcoming' && "bg-blue-50 border-blue-400",
            getSessionUrgency(classData.nextLesson.scheduledDate.toISOString()) === 'passed' && "bg-gray-50 border-gray-400"
          )}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium text-sm">
                  {getSmartTimeDisplay(classData.nextLesson.scheduledDate.toISOString())}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getSessionUrgency(classData.nextLesson.scheduledDate.toISOString()) === 'critical' && (
                  <Badge variant="destructive" className="text-xs">URGENT</Badge>
                )}
                {getSessionUrgency(classData.nextLesson.scheduledDate.toISOString()) === 'soon' && (
                  <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-700">SOON</Badge>
                )}
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  classData.nextLesson.preparationStatus === 'ready' ? 'text-green-600 bg-green-50' :
                  classData.nextLesson.preparationStatus === 'needs-prep' ? 'text-yellow-600 bg-yellow-50' :
                  'text-red-600 bg-red-50'
                )}>
                  {classData.nextLesson.preparationStatus === 'ready' ? '100' : 
                   classData.nextLesson.preparationStatus === 'needs-prep' ? '50' : '25'}% Ready
                </span>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-base font-semibold text-gray-900">{classData.nextLesson.topic}</p>
                <Badge variant="outline" className="text-xs">
                  Lesson {classData.nextLesson.lessonNumber}
                </Badge>
              </div>
              {classData.nextLesson.description && (
                <p className="text-sm text-gray-600 mb-1">{classData.nextLesson.description}</p>
              )}
              <p className="text-xs text-gray-500">
                {formatDate(classData.nextLesson.scheduledDate)} • {classData.nextLesson.duration}min • {classData.enrollment?.current || 0} students
              </p>
            </div>

            {/* Lesson Readiness */}
            <div className="space-y-1">
              <div className="flex flex-wrap gap-1">
                {classData.nextLesson.materialsReady && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                    <CheckCircle2 className="h-3 w-3" />
                    Materials Ready
                  </span>
                )}
                {classData.nextLesson.preparationStatus === 'ready' && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                    <CheckCircle2 className="h-3 w-3" />
                    Lesson Prepared
                  </span>
                )}
                {classData.nextLesson.preparationStatus !== 'ready' && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
                    <AlertTriangle className="h-3 w-3" />
                    {classData.nextLesson.preparationStatus === 'critical' ? 'Urgent Prep Needed' : 'Needs Preparation'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Class Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Users className="h-4 w-4" />
                Students
              </span>
              <span className="font-medium">{classData.enrollment?.current || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Engagement
              </span>
              <span className={cn("font-medium text-sm", getEngagementColor(classData.studentInsights.averagePerformance || 0))}>
                {classData.studentInsights.engagementLevel}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Streak
              </span>
              <span className="font-medium">-</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Target className="h-4 w-4" />
                Performance
              </span>
              <span className="font-medium">{Math.round(classData.momentum.completionRate || 0)}%</span>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        {variant === 'detailed' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Engagement Rate</span>
              <span className="font-medium">{Math.round(classData.studentInsights.averagePerformance || 0)}%</span>
            </div>
            <Progress value={classData.studentInsights.averagePerformance || 0} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-medium">{Math.round(classData.momentum.completionRate || 0)}%</span>
            </div>
            <Progress value={classData.momentum.completionRate || 0} className="h-2" />
          </div>
        )}

        {/* Class Health Indicator */}
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            {getMomentumIcon('stable')}
            <span className="text-sm font-medium">Class Health</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{Math.round(classData.studentInsights.averagePerformance || 0)}</div>
            <div className="text-xs text-gray-600">Engagement %</div>
          </div>
        </div>

        {/* Class Information */}
        {(classData.enrollment?.current || 0) < (classData.enrollment?.capacity || 0) && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded text-blue-800">
            <Users className="h-4 w-4" />
            <span className="text-sm">
              {(classData.enrollment?.capacity || 0) - (classData.enrollment?.current || 0)} spots available
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewClass(classData);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          
          {onMessageStudents && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMessageStudents(classData);
              }}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Button>
          )}
          
          {onPrepareLesson && classData.nextLesson && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPrepareLesson(classData);
              }}
              className={cn(
                classData.nextLesson.preparationStatus === 'critical' && "border-red-200 text-red-700 hover:bg-red-50"
              )}
            >
              <Play className="h-4 w-4 mr-1" />
              Prep
            </Button>
          )}
          
          {onEditClass && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEditClass(classData);
              }}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedClassCard;