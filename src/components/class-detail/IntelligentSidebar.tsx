import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Lightbulb,
  Users,
  MessageSquare,
  Target,
  Zap,
  Star,
  Bell,
  FileText,
  Video,
  Activity,
  Award,
  ArrowRight,
  X
} from 'lucide-react';
import { SidebarWidget, TeachingMode, ActionPriority } from '@/types/class-detail';
import { cn } from '@/lib/utils';

interface IntelligentSidebarProps {
  widgets: SidebarWidget[];
  mode: TeachingMode;
  onWidgetAction?: (widgetId: string, action?: string) => void;
  onDismissWidget?: (widgetId: string) => void;
}

const IntelligentSidebar: React.FC<IntelligentSidebarProps> = ({
  widgets,
  mode,
  onWidgetAction,
  onDismissWidget
}) => {
  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'student-alert': return <Users className="h-4 w-4" />;
      case 'prep-reminder': return <Clock className="h-4 w-4" />;
      case 'success-celebration': return <Award className="h-4 w-4" />;
      case 'optimization-tip': return <Lightbulb className="h-4 w-4" />;
      case 'zoom-insight': return <Video className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getWidgetColor = (priority: ActionPriority, type: string) => {
    if (priority === 'urgent') return 'border-red-200 bg-red-50';
    if (priority === 'important') return 'border-yellow-200 bg-yellow-50';
    if (type === 'success-celebration') return 'border-green-200 bg-green-50';
    if (type === 'optimization-tip') return 'border-blue-200 bg-blue-50';
    return 'border-gray-200 bg-gray-50';
  };

  const getWidgetTitleColor = (priority: ActionPriority, type: string) => {
    if (priority === 'urgent') return 'text-red-800';
    if (priority === 'important') return 'text-yellow-800';
    if (type === 'success-celebration') return 'text-green-800';
    if (type === 'optimization-tip') return 'text-blue-800';
    return 'text-gray-800';
  };

  const getWidgetContentColor = (priority: ActionPriority, type: string) => {
    if (priority === 'urgent') return 'text-red-700';
    if (priority === 'important') return 'text-yellow-700';
    if (type === 'success-celebration') return 'text-green-700';
    if (type === 'optimization-tip') return 'text-blue-700';
    return 'text-gray-700';
  };

  // Filter widgets based on current mode and visibility
  const visibleWidgets = widgets
    .filter(widget => widget.isVisible && widget.timeContext.includes(mode))
    .sort((a, b) => {
      // Sort by priority: urgent > important > helpful
      const priorityOrder = { urgent: 3, important: 2, helpful: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  const formatTimestamp = (timestamp?: Date) => {
    if (!timestamp) return '';
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const renderModeSpecificWidgets = () => {
    const modeSpecificContent = {
      prep: {
        title: 'Preparation Insights',
        widgets: [
          {
            type: 'prep-reminder',
            title: 'Material Check',
            content: 'Review uploaded presentation slides for clarity',
            priority: 'important' as ActionPriority
          },
          {
            type: 'optimization-tip',
            title: 'Cross-Class Opportunity',
            content: 'Statistics concepts from yesterday can be reused in today\'s physics lesson',
            priority: 'helpful' as ActionPriority
          }
        ]
      },
      ready: {
        title: 'Final Readiness',
        widgets: [
          {
            type: 'zoom-insight',
            title: 'Connection Quality',
            content: 'All students have good connection status. Ready to start!',
            priority: 'helpful' as ActionPriority
          },
          {
            type: 'prep-reminder',
            title: 'Last Check',
            content: 'Don\'t forget to enable waiting room for better control',
            priority: 'important' as ActionPriority
          }
        ]
      },
      teaching: {
        title: 'Live Teaching Support',
        widgets: [
          {
            type: 'student-alert',
            title: 'Engagement Alert',
            content: 'Maya seems distracted - consider calling on her gently',
            priority: 'important' as ActionPriority
          },
          {
            type: 'optimization-tip',
            title: 'Timing Suggestion',
            content: 'Perfect time for a 2-minute stretch break',
            priority: 'helpful' as ActionPriority
          }
        ]
      },
      reflect: {
        title: 'Session Insights',
        widgets: [
          {
            type: 'success-celebration',
            title: 'Great Session!',
            content: 'Students showed 23% higher engagement than last week',
            priority: 'helpful' as ActionPriority
          },
          {
            type: 'optimization-tip',
            title: 'Next Time',
            content: 'Consider more breakout rooms - students loved the group work',
            priority: 'helpful' as ActionPriority
          }
        ]
      }
    };

    return modeSpecificContent[mode]?.widgets || [];
  };

  const allWidgets = [...visibleWidgets, ...renderModeSpecificWidgets()];

  return (
    <div className="space-y-4">
      {/* Mode-specific Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            {mode === 'prep' && 'Preparation Assistant'}
            {mode === 'ready' && 'Ready Check'}
            {mode === 'teaching' && 'Live Support'}
            {mode === 'reflect' && 'Session Review'}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Dynamic Widgets */}
      <div className="space-y-3">
        {allWidgets.slice(0, 8).map((widget, index) => (
          <Card 
            key={widget.id || `mode-${index}`} 
            className={cn(
              "transition-all duration-200 hover:shadow-md border",
              getWidgetColor(widget.priority, widget.type)
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1 rounded",
                    widget.priority === 'urgent' ? 'text-red-600' :
                    widget.priority === 'important' ? 'text-yellow-600' :
                    widget.type === 'success-celebration' ? 'text-green-600' :
                    widget.type === 'optimization-tip' ? 'text-blue-600' :
                    'text-gray-600'
                  )}>
                    {getWidgetIcon(widget.type)}
                  </div>
                  <h4 className={cn(
                    "font-medium text-sm",
                    getWidgetTitleColor(widget.priority, widget.type)
                  )}>
                    {widget.title}
                  </h4>
                </div>
                
                <div className="flex items-center gap-1">
                  {widget.priority === 'urgent' && (
                    <Badge variant="destructive" className="text-xs px-1">
                      Urgent
                    </Badge>
                  )}
                  {onDismissWidget && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-200"
                      onClick={() => onDismissWidget(widget.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              <p className={cn(
                "text-sm mb-3",
                getWidgetContentColor(widget.priority, widget.type)
              )}>
                {widget.content}
              </p>
              
              <div className="flex items-center justify-between">
                {widget.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onWidgetAction?.(widget.id, widget.action?.label)}
                    className="text-xs"
                  >
                    {widget.action.label}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
                
                {widget.timestamp && (
                  <span className="text-xs text-gray-500 ml-auto">
                    {formatTimestamp(widget.timestamp)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats for Current Mode */}
      {mode === 'teaching' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Live Session Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Session Time</span>
              <span className="font-medium">23 minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Participation</span>
              <span className="font-medium text-green-600">87%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Questions Asked</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Chat Messages</span>
              <span className="font-medium">8</span>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === 'prep' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Preparation Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-gray-600">Ready to teach</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Materials</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zoom Setup</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Student Prep</span>
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Celebrations */}
      {mode === 'reflect' && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-green-800">
              <Star className="h-4 w-4" />
              Session Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-green-700">
              🎯 Perfect lesson pacing - students stayed engaged throughout
            </div>
            <div className="text-sm text-green-700">
              💡 Great use of breakout rooms - 94% participation
            </div>
            <div className="text-sm text-green-700">
              🌟 Maya had a breakthrough moment with quadratic equations!
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {allWidgets.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">All Set!</h3>
            <p className="text-sm text-gray-600">
              No urgent items need your attention right now.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntelligentSidebar;