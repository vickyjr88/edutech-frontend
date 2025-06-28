import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  UserPlus,
  Target,
  Eye,
  Brain,
  Sparkles,
  ClipboardList,
  Activity,
  BarChart3
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
  const [showObjectives, setShowObjectives] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'knowledge': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'skills': return 'bg-green-100 text-green-800 border-green-200';
      case 'understanding': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'application': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };
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
          label: 'Class Preparation',
          color: 'bg-blue-500',
          description: 'Lesson planning & material organization',
          icon: ClipboardList,
          emoji: '📋'
        };
      case 'ready':
        return {
          label: 'Final Checks',
          color: 'bg-green-500',
          description: 'Pre-class readiness verification',
          icon: CheckCircle2,
          emoji: '✅'
        };
      case 'teaching':
        return {
          label: 'Live Session',
          color: 'bg-red-500',
          description: 'Active teaching with real-time insights',
          icon: Activity,
          emoji: '🎯'
        };
      case 'reflect':
        return {
          label: 'Session Review',
          color: 'bg-purple-500',
          description: 'Performance analysis & next steps',
          icon: BarChart3,
          emoji: '📊'
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
              {/* Class Objectives Button with Floating Card */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                  onMouseEnter={() => setShowObjectives(true)}
                  onMouseLeave={() => setShowObjectives(false)}
                  onClick={() => onActionClick?.('viewObjectives')}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Class Objectives
                  <Eye className="h-3 w-3 ml-1 opacity-60" />
                </Button>

                {/* Floating Objectives Card */}
                {showObjectives && data.objectives && data.objectives.length > 0 && (
                  <Card 
                    className="absolute top-full left-0 mt-2 w-80 z-50 shadow-xl border-2 border-blue-200 bg-white"
                    onMouseEnter={() => setShowObjectives(true)}
                    onMouseLeave={() => setShowObjectives(false)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                        <Target className="h-5 w-5" />
                        Learning Objectives
                        <Badge variant="secondary" className="ml-auto">
                          {data.objectives.filter(obj => obj.completed).length}/{data.objectives.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                      {data.objectives.map((objective, index) => (
                        <div
                          key={objective.id}
                          className={cn(
                            "p-3 rounded-lg border-l-4 transition-all duration-200",
                            getPriorityColor(objective.priority),
                            objective.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm font-medium mb-1",
                                objective.completed ? 'text-green-800 line-through' : 'text-gray-900'
                              )}>
                                {objective.text}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-xs", getCategoryColor(objective.category))}
                                >
                                  {objective.category}
                                </Badge>
                                {objective.priority === 'high' && (
                                  <Badge variant="destructive" className="text-xs">
                                    High Priority
                                  </Badge>
                                )}
                                {objective.completed && (
                                  <Badge variant="default" className="text-xs bg-green-600">
                                    ✓ Completed
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Summary */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="text-center">
                            <p className="text-gray-500">Completed</p>
                            <p className="font-bold text-green-600">
                              {data.objectives.filter(obj => obj.completed).length}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-500">Remaining</p>
                            <p className="font-bold text-blue-600">
                              {data.objectives.filter(obj => !obj.completed).length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Other Quick Actions */}
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

        {/* Teaching Assistant Mode Controls */}
        {onModeChange && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Teaching Assistant</span>
                <Sparkles className="h-3 w-3 text-yellow-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {(['prep', 'ready', 'teaching', 'reflect'] as TeachingMode[]).map((mode) => {
                  const config = getModeConfig(mode);
                  const isActive = data.currentMode === mode;
                  const IconComponent = config.icon;
                  
                  return (
                    <Button
                      key={mode}
                      variant={isActive ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onModeChange(mode)}
                      className={cn(
                        "flex items-center gap-2 text-xs h-auto py-2 px-3 justify-start",
                        isActive && "bg-blue-600 hover:bg-blue-700"
                      )}
                    >
                      <span className="text-sm">{config.emoji}</span>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{config.label}</span>
                        <span className={cn(
                          "text-xs opacity-75",
                          isActive ? "text-blue-100" : "text-gray-500"
                        )}>
                          {config.description}
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </div>
              
              <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded">
                💡 <strong>Smart Mode:</strong> Automatically adapts based on session timing and context
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartClassHeader;