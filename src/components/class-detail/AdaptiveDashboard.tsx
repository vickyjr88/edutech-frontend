import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2,
  Clock,
  AlertTriangle,
  Video,
  Users,
  MessageSquare,
  BarChart3,
  Mic,
  Camera,
  Monitor,
  Wifi,
  FileText,
  Lightbulb,
  Target,
  Activity,
  Zap,
  Award,
  TrendingUp,
  Settings,
  Play,
  Pause,
  PhoneCall,
  Share
} from 'lucide-react';
import { 
  TeachingMode, 
  PrepChecklist, 
  LiveClassMetrics, 
  ZoomOptimization,
  TeachingEffectiveness 
} from '@/types/class-detail';
import { cn } from '@/lib/utils';

interface AdaptiveDashboardProps {
  mode: TeachingMode;
  timeToClass: number; // minutes
  prepChecklists: PrepChecklist[];
  liveMetrics?: LiveClassMetrics;
  zoomOptimization: ZoomOptimization;
  teachingEffectiveness: TeachingEffectiveness;
  onActionClick?: (action: string, data?: any) => void;
}

const AdaptiveDashboard: React.FC<AdaptiveDashboardProps> = ({
  mode,
  timeToClass,
  prepChecklists,
  liveMetrics,
  zoomOptimization,
  teachingEffectiveness,
  onActionClick
}) => {
  const renderPrepMode = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Zoom Lesson Prep Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Zoom Lesson Prep Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prepChecklists.map((checklist) => (
              <div key={checklist.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium capitalize">{checklist.category.replace('-', ' ')}</h4>
                  <Badge variant="outline">
                    {checklist.items.filter(item => item.completed).length}/{checklist.items.length}
                  </Badge>
                </div>
                <Progress value={checklist.completionScore} className="h-2" />
                
                <div className="space-y-2">
                  {checklist.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                      <div className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center",
                        item.completed ? "bg-green-600 border-green-600" : "border-gray-300"
                      )}>
                        {item.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "text-sm",
                          item.completed ? "line-through text-gray-500" : "text-gray-900"
                        )}>
                          {item.task}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{item.timeEstimate}m</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zoom Teaching Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            Zoom Teaching Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Tech Checklist */}
            <div className="space-y-3">
              <h4 className="font-medium">Tech Checklist</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(zoomOptimization.techChecklist).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      value ? "bg-green-500" : "bg-red-500"
                    )} />
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h4 className="font-medium">AI Recommendations</h4>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    <Lightbulb className="h-4 w-4 inline mr-2" />
                    Enable 'Focus Mode' for this Physics lesson - reduces distractions during complex problem solving
                  </p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                  <p className="text-sm text-purple-800">
                    <Target className="h-4 w-4 inline mr-2" />
                    Prep annotation tools for whiteboard - students engage 40% more with visual explanations
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => onActionClick?.('zoomTest')}>
                <Video className="h-4 w-4 mr-2" />
                Test Zoom Room
              </Button>
              <Button variant="outline" size="sm" onClick={() => onActionClick?.('materialCheck')}>
                <FileText className="h-4 w-4 mr-2" />
                Check Materials
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReadyMode = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Final Tech Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-600" />
            Final Zoom Room Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                <Camera className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Camera</p>
                  <p className="text-sm text-green-600">Good lighting</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                <Mic className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Audio</p>
                  <p className="text-sm text-green-600">Clear quality</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded">
                <Monitor className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Screen Share</p>
                  <p className="text-sm text-yellow-600">Test needed</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                <Wifi className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Connection</p>
                  <p className="text-sm text-green-600">Stable</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Video className="h-4 w-4 mr-2" />
                Start Zoom Room
              </Button>
              <Button variant="outline" className="w-full">
                <Share className="h-4 w-4 mr-2" />
                Test Screen Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Student Readiness & Tech Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-800">S</span>
                </div>
                <div>
                  <p className="font-medium">Sarah</p>
                  <p className="text-sm text-green-600">Good connection, cam ready</p>
                </div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-yellow-800">J</span>
                </div>
                <div>
                  <p className="font-medium">James</p>
                  <p className="text-sm text-yellow-600">Needs mic test, quiet space</p>
                </div>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-red-800">M</span>
                </div>
                <div>
                  <p className="font-medium">Maya</p>
                  <p className="text-sm text-red-600">Unstable internet yesterday</p>
                </div>
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full" />
            </div>

            <Button variant="outline" className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Connection Reminders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeachingMode = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Real-Time Zoom Class Pulse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-600" />
            Real-Time Zoom Class Pulse
          </CardTitle>
        </CardHeader>
        <CardContent>
          {liveMetrics && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded">
                  <BarChart3 className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-green-800">{liveMetrics.engagementScore}%</p>
                  <p className="text-sm text-green-600">Engagement</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-blue-800">
                    {liveMetrics.activeSpeakers}/{liveMetrics.totalStudents}
                  </p>
                  <p className="text-sm text-blue-600">Active Speakers</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Chat Activity</span>
                  <span className="font-medium">{liveMetrics.chatActivity} messages</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Screen Sharing</span>
                  <Badge variant={liveMetrics.screenSharingQuality === 'excellent' ? 'default' : 'secondary'}>
                    {liveMetrics.screenSharingQuality}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Breakout Rooms</span>
                  <span className="font-medium">{liveMetrics.breakoutRoomsActive} active</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Zoom Teaching Assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Zoom Teaching Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                3 students seem distracted - try interactive poll or breakout rooms
              </p>
              <Button size="sm" className="mt-2 w-full">
                Create Quick Poll
              </Button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <Target className="h-4 w-4 inline mr-2" />
                Perfect time for screen annotation - complex diagram explanation
              </p>
              <Button size="sm" variant="outline" className="mt-2 w-full">
                Enable Annotation
              </Button>
            </div>

            {/* Quick Teaching Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline">
                <Users className="h-4 w-4 mr-1" />
                Breakout Rooms
              </Button>
              <Button size="sm" variant="outline">
                <MessageSquare className="h-4 w-4 mr-1" />
                Quick Poll
              </Button>
              <Button size="sm" variant="outline">
                <Pause className="h-4 w-4 mr-1" />
                Take Break
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-1" />
                Quick Note
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReflectMode = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Session Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-gold-600" />
            Session Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-800">Excellent Session!</p>
              <p className="text-sm text-green-600">High engagement and participation</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 border rounded">
                <p className="text-xl font-bold">89%</p>
                <p className="text-sm text-gray-600">Avg Engagement</p>
              </div>
              <div className="p-3 border rounded">
                <p className="text-xl font-bold">12/14</p>
                <p className="text-sm text-gray-600">Students Participated</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full">
                <Mic className="h-4 w-4 mr-2" />
                Record Voice Reflection
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Quick Written Notes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Session Prep */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Prep Next Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium text-blue-800 mb-2">AI Suggestions for Next Class</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Review quadratic equations - 3 students struggled</li>
                <li>• Use more visual examples for complex problems</li>
                <li>• Consider breakout rooms for practice problems</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Student Follow-ups</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm">James - Extra help needed</span>
                  <Button size="sm" variant="outline">Message</Button>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Maya - Great progress!</span>
                  <Button size="sm" variant="outline">Celebrate</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboardContent = () => {
    switch (mode) {
      case 'prep':
        return renderPrepMode();
      case 'ready':
        return renderReadyMode();
      case 'teaching':
        return renderTeachingMode();
      case 'reflect':
        return renderReflectMode();
      default:
        return renderPrepMode();
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Description */}
      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {mode === 'prep' && 'Preparation Mode'}
          {mode === 'ready' && 'Ready Mode - Final Checks'}
          {mode === 'teaching' && 'Live Teaching Mode'}
          {mode === 'reflect' && 'Reflection Mode'}
        </h2>
        <p className="text-gray-600">
          {mode === 'prep' && 'Planning and preparing for your upcoming class'}
          {mode === 'ready' && 'Final technology checks and student readiness'}
          {mode === 'teaching' && 'Real-time teaching assistance and metrics'}
          {mode === 'reflect' && 'Session review and next class preparation'}
        </p>
      </div>

      {renderDashboardContent()}
    </div>
  );
};

export default AdaptiveDashboard;