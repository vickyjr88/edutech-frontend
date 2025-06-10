import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  Calendar,
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
      case 'needs-prep': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
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

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
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

  const urgentAlerts = classData.alerts.filter(alert => alert.type === 'urgent').length;
  const hasUpcomingLesson = classData.nextLesson && 
    new Date(classData.nextLesson.scheduledDate).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewClass(classData)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{classData.title}</h3>
            <div className="flex items-center gap-1">
              {urgentAlerts > 0 && (
                <Badge variant="destructive" className="text-xs px-1">
                  {urgentAlerts}
                </Badge>
              )}
              {getMomentumIcon(classData.momentum.engagementTrend)}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {classData.enrollment?.current || 0}
            </span>
            <span className={cn("px-2 py-1 rounded text-xs", getPreparationStatusColor(classData.preparationStatus))}>
              {classData.preparationStatus.replace('-', ' ')}
            </span>
          </div>
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
            {hasUpcomingLesson && (
              <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                <Clock className="h-3 w-3 mr-1" />
                Soon
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
        {/* Next Lesson Preview */}
        {classData.nextLesson && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Next: {classData.nextLesson.topic}
              </h4>
              <span className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                getPreparationStatusColor(classData.nextLesson.preparationStatus)
              )}>
                {classData.nextLesson.preparationStatus.replace('-', ' ')}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              {formatDate(classData.nextLesson.scheduledDate)} • {classData.nextLesson.duration}min
            </p>
            {classData.nextLesson.studentsNeedingHelp > 0 && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {classData.nextLesson.studentsNeedingHelp} students need extra help
              </p>
            )}
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
              <span className={cn("font-medium text-sm", getEngagementColor(classData.studentInsights.engagementLevel))}>
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
              <span className="font-medium">{classData.momentum.streakDays}d</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Target className="h-4 w-4" />
                Performance
              </span>
              <span className="font-medium">{classData.momentum.overallScore}%</span>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        {variant === 'detailed' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Attendance Rate</span>
              <span className="font-medium">{classData.momentum.attendanceRate}%</span>
            </div>
            <Progress value={classData.momentum.attendanceRate} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-medium">{classData.momentum.completionRate}%</span>
            </div>
            <Progress value={classData.momentum.completionRate} className="h-2" />
          </div>
        )}

        {/* Momentum Indicator */}
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            {getMomentumIcon(classData.momentum.engagementTrend)}
            <span className="text-sm font-medium">Class Momentum</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{classData.momentum.overallScore}</div>
            <div className="text-xs text-gray-600">Overall Score</div>
          </div>
        </div>

        {/* Student Insights */}
        {classData.studentInsights.strugglingStudents > 0 && (
          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">
              {classData.studentInsights.strugglingStudents} students need attention
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