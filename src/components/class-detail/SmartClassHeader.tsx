import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock,
  Users,
  Video,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Calendar,
  Award,
  Settings,
  Play,
  Pause,
  Phone,
  Edit,
  MoreVertical,
  BookOpen,
  UserPlus
} from 'lucide-react';
import { SmartClassHeader as SmartClassHeaderType, TeachingMode, PreparationStatus } from '@/types/class-detail';
import { cn } from '@/lib/utils';

interface SmartClassHeaderProps {
  data: SmartClassHeaderType;
  onModeChange?: (mode: TeachingMode) => void;
  onActionClick?: (actionId: string) => void;
}

const SmartClassHeader: React.FC<SmartClassHeaderProps> = ({
  data,
  onModeChange,
  onActionClick
}) => {
  const getPreparationStatusConfig = (score: number): { 
    status: PreparationStatus; 
    color: string; 
    icon: JSX.Element;
    message: string;
  } => {
    if (score >= 90) return {
      status: 'excellent',
      color: 'text-green-600 bg-green-50 border-green-200',
      icon: <CheckCircle2 className="h-4 w-4" />,
      message: 'Fully prepared and ready!'
    };
    if (score >= 75) return {
      status: 'good',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      icon: <CheckCircle2 className="h-4 w-4" />,
      message: 'Well prepared'
    };
    if (score >= 60) return {
      status: 'needs-work',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      icon: <AlertTriangle className="h-4 w-4" />,
      message: 'Some preparation needed'
    };
    return {
      status: 'critical',
      color: 'text-red-600 bg-red-50 border-red-200',
      icon: <AlertTriangle className="h-4 w-4" />,
      message: 'Urgent preparation required'
    };
  };

  const getMomentumIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'needs-attention': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTimeUntil = (minutes: number): { display: string; urgency: 'relaxed' | 'active' | 'urgent' } => {
    if (minutes <= 0) return { display: 'Class in session', urgency: 'urgent' };
    if (minutes <= 15) return { display: `${minutes}m`, urgency: 'urgent' };
    if (minutes <= 60) return { display: `${minutes}m`, urgency: 'active' };
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours < 24) {
      return { 
        display: remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`,
        urgency: hours <= 2 ? 'active' : 'relaxed'
      };
    }
    
    const days = Math.floor(hours / 24);
    return { display: `${days}d`, urgency: 'relaxed' };
  };

  const getModeConfig = (mode: TeachingMode) => {
    switch (mode) {
      case 'prep':
        return {
          label: 'Preparation Mode',
          color: 'bg-blue-500',
          description: 'Planning and preparing for class'
        };
      case 'ready':
        return {
          label: 'Ready Mode',
          color: 'bg-green-500',
          description: 'Final checks before class'
        };
      case 'teaching':
        return {
          label: 'Live Teaching',
          color: 'bg-red-500',
          description: 'Class is in session'
        };
      case 'reflect':
        return {
          label: 'Reflection Mode',
          color: 'bg-purple-500',
          description: 'Post-class review and planning'
        };
    }
  };

  const prepStatus = getPreparationStatusConfig(data.preparationScore);
  const timeInfo = formatTimeUntil(data.nextSession.timeUntil);
  const modeConfig = getModeConfig(data.currentMode);

  return (
    <Card className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Info & Countdown */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{data.classTitle}</h1>
                <p className="text-lg text-gray-600 mt-1">{data.subject}</p>
              </div>
              
              {/* Mode Indicator & Quick Actions */}
              <div className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", modeConfig.color)} />
                <Badge variant="outline" className="text-sm">
                  {modeConfig.label}
                </Badge>
              </div>
            </div>

            {/* Time Until Next Class */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-700">Next Session</span>
                </div>
                <Badge className={cn(
                  "px-3 py-1",
                  timeInfo.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                  timeInfo.urgency === 'active' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                )}>
                  {timeInfo.display}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="group relative">
                  <p className="text-gray-600">Topic</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium flex-1">{data.nextSession.lessonTopic}</p>
                    {data.currentMode !== 'teaching' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                        onClick={() => onActionClick?.('addLesson')}
                      >
                        <BookOpen className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="group relative">
                  <p className="text-gray-600">Expected Students</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium flex items-center gap-1 flex-1">
                      <Users className="h-4 w-4" />
                      {data.nextSession.studentsExpected}
                    </p>
                    {data.currentMode !== 'teaching' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                        onClick={() => onActionClick?.('addStudent')}
                      >
                        <UserPlus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {data.urgentActions.map((action) => (
                <Button
                  key={action.id}
                  onClick={() => onActionClick?.(action.id)}
                  variant={action.priority === 'urgent' ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    action.priority === 'urgent' && 'bg-red-600 hover:bg-red-700',
                    action.priority === 'important' && 'border-yellow-300 text-yellow-700'
                  )}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Preparation Status & Momentum */}
          <div className="space-y-4">
            {/* Preparation Score */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Preparation Status</h3>
                <div className={cn("flex items-center gap-1 px-2 py-1 rounded border", prepStatus.color)}>
                  {prepStatus.icon}
                  <span className="text-sm font-medium">{data.preparationScore}%</span>
                </div>
              </div>
              
              <Progress value={data.preparationScore} className="h-3 mb-2" />
              <p className="text-sm text-gray-600">{prepStatus.message}</p>
            </div>

            {/* Teaching Momentum */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Teaching Momentum</h3>
                {getMomentumIcon(data.teachingMomentum.trend)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Streak</span>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold text-yellow-600">{data.teachingMomentum.streak}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Rating</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Award
                        key={i}
                        className={cn(
                          "h-3 w-3",
                          i < data.teachingMomentum.lastRating ? "text-yellow-500 fill-current" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">This Week</p>
                      <p className="font-medium">{data.teachingMomentum.weeklyProgress.lessonsDelivered} lessons</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Avg Rating</p>
                      <p className="font-medium">{data.teachingMomentum.weeklyProgress.avgRating.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Zoom Quick Access */}
            {data.nextSession.zoomRoomId && (
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={() => window.open(`https://zoom.us/j/${data.nextSession.zoomRoomId}`, '_blank')}
              >
                <Video className="h-4 w-4 mr-2" />
                Join Zoom Room
              </Button>
            )}
          </div>
        </div>

        {/* Mode Switch Controls (for demo/testing) */}
        {onModeChange && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Demo Mode:</span>
              <div className="flex gap-1">
                {(['prep', 'ready', 'teaching', 'reflect'] as TeachingMode[]).map((mode) => (
                  <Button
                    key={mode}
                    variant={data.currentMode === mode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onModeChange(mode)}
                    className="text-xs"
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartClassHeader;