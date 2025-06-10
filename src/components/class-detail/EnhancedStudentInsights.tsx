import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Wifi,
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Monitor,
  Headphones,
  Eye,
  Brain,
  Star,
  Lightbulb,
  Activity,
  BarChart3
} from 'lucide-react';
import { StudentInsight, TeachingMode, ParticipationType, TechReliability } from '@/types/class-detail';
import { cn } from '@/lib/utils';

interface EnhancedStudentInsightsProps {
  students: StudentInsight[];
  mode: TeachingMode;
  onStudentAction?: (studentId: string, action: string) => void;
}

const EnhancedStudentInsights: React.FC<EnhancedStudentInsightsProps> = ({
  students,
  mode,
  onStudentAction
}) => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'status' | 'engagement' | 'name'>('status');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'thriving': return 'text-green-600 bg-green-50 border-green-200';
      case 'steady': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'struggling': return 'text-red-600 bg-red-50 border-red-200';
      case 'breakthrough': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getParticipationIcon = (type: ParticipationType) => {
    switch (type) {
      case 'active-speaker': return <Mic className="h-4 w-4 text-green-600" />;
      case 'chat-focused': return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'observer': return <Eye className="h-4 w-4 text-gray-600" />;
      case 'camera-shy': return <CameraOff className="h-4 w-4 text-yellow-600" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getTechReliabilityColor = (reliability: TechReliability) => {
    switch (reliability) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'needs-support': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getEngagementScore = (student: StudentInsight): number => {
    const participation = student.zoomBehavior.typicalParticipation === 'active-speaker' ? 30 :
                         student.zoomBehavior.typicalParticipation === 'chat-focused' ? 25 :
                         student.zoomBehavior.typicalParticipation === 'observer' ? 15 : 10;
    
    const camera = student.zoomBehavior.cameraUsage;
    const chat = Math.min(student.zoomBehavior.chatActivity * 2, 20);
    const retention = student.learningPattern.conceptRetention * 0.3;
    
    return Math.round(participation + (camera * 0.2) + chat + retention);
  };

  const sortedStudents = [...students].sort((a, b) => {
    switch (sortBy) {
      case 'status':
        const statusOrder = { struggling: 4, breakthrough: 3, steady: 2, thriving: 1 };
        return statusOrder[a.currentStatus] - statusOrder[b.currentStatus];
      case 'engagement':
        return getEngagementScore(b) - getEngagementScore(a);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const renderStudentCard = (student: StudentInsight) => {
    const engagementScore = getEngagementScore(student);
    const isExpanded = selectedStudent === student.id;

    return (
      <Card 
        key={student.id} 
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md",
          student.needsAttention && "ring-2 ring-red-200",
          isExpanded && "ring-2 ring-blue-200"
        )}
        onClick={() => setSelectedStudent(isExpanded ? null : student.id)}
      >
        <CardContent className="p-4">
          {/* Student Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                {student.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{student.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs border", getStatusColor(student.currentStatus))}>
                    {student.currentStatus}
                  </Badge>
                  {student.needsAttention && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium">{engagementScore}%</div>
              <div className="text-xs text-gray-500">Engagement</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 bg-gray-50 rounded">
              {getParticipationIcon(student.zoomBehavior.typicalParticipation)}
              <div className="text-xs text-gray-600 mt-1">
                {student.zoomBehavior.typicalParticipation.replace('-', ' ')}
              </div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <Camera className={cn(
                "h-4 w-4 mx-auto",
                student.zoomBehavior.cameraUsage > 70 ? "text-green-600" :
                student.zoomBehavior.cameraUsage > 40 ? "text-yellow-600" : "text-red-600"
              )} />
              <div className="text-xs text-gray-600 mt-1">
                {student.zoomBehavior.cameraUsage}% cam
              </div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <Wifi className={cn(
                "h-4 w-4 mx-auto",
                getTechReliabilityColor(student.zoomBehavior.techReliability)
              )} />
              <div className="text-xs text-gray-600 mt-1">
                {student.zoomBehavior.techReliability}
              </div>
            </div>
          </div>

          {/* Engagement Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Zoom Engagement</span>
              <span>{engagementScore}%</span>
            </div>
            <Progress value={engagementScore} className="h-2" />
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="border-t pt-3 space-y-4">
              {/* Zoom Behavior Details */}
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Zoom Behavior Pattern
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Typical Connection:</span>
                    <p className="font-medium">{student.zoomBehavior.averageConnectionTime}min early</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Mic Usage:</span>
                    <p className="font-medium">{student.zoomBehavior.micUsage}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Chat Activity:</span>
                    <p className="font-medium">{student.zoomBehavior.chatActivity} msgs/session</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Breakout Rooms:</span>
                    <p className={cn(
                      "font-medium",
                      student.zoomBehavior.breakoutPreference === 'enjoys' ? 'text-green-600' :
                      student.zoomBehavior.breakoutPreference === 'struggles' ? 'text-red-600' :
                      'text-gray-600'
                    )}>
                      {student.zoomBehavior.breakoutPreference}
                    </p>
                  </div>
                </div>
              </div>

              {/* Learning Pattern */}
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Learning Pattern
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Best Time:</span>
                    <p className="font-medium capitalize">{student.learningPattern.bestTimeOfDay}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Learning Style:</span>
                    <p className="font-medium capitalize">{student.learningPattern.preferredStyle}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Attention Span:</span>
                    <p className="font-medium">{student.learningPattern.attentionSpan}min</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Retention:</span>
                    <p className="font-medium">{student.learningPattern.conceptRetention}%</p>
                  </div>
                </div>
              </div>

              {/* Recent Progress */}
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Recent Progress
                </h4>
                
                {student.recentProgress.conceptsMastered.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-green-600 font-medium">Mastered:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {student.recentProgress.conceptsMastered.slice(0, 3).map((concept, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-green-100 text-green-700">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {student.recentProgress.strugglingWith.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-red-600 font-medium">Struggling with:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {student.recentProgress.strugglingWith.slice(0, 2).map((concept, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-red-100 text-red-700">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs text-blue-600 font-medium">Next Challenge:</span>
                  <p className="text-sm mt-1">{student.recentProgress.nextChallenge}</p>
                </div>
              </div>

              {/* Teaching Suggestions */}
              {student.suggestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Zoom Teaching Tips
                  </h4>
                  <ul className="space-y-1">
                    {student.suggestions.slice(0, 3).map((suggestion, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Support */}
              {student.techSupport.needsHelp && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <h4 className="font-medium text-sm text-red-800 mb-1">Tech Support Needed</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {student.techSupport.issues.map((issue, i) => (
                      <li key={i}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStudentAction?.(student.id, 'message');
                  }}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Message
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStudentAction?.(student.id, 'support');
                  }}
                >
                  <Target className="h-3 w-3 mr-1" />
                  Support
                </Button>
                {mode === 'teaching' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStudentAction?.(student.id, 'spotlight');
                    }}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Spotlight
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Student Insights
          <Badge variant="outline">{students.length} students</Badge>
        </h2>
        
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border rounded px-3 py-1 text-sm bg-white"
        >
          <option value="status">Sort by Status</option>
          <option value="engagement">Sort by Engagement</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Class Overview Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Class Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">
                {students.filter(s => s.currentStatus === 'thriving').length}
              </div>
              <div className="text-sm text-green-600">Thriving</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {students.filter(s => s.currentStatus === 'steady').length}
              </div>
              <div className="text-sm text-blue-600">Steady</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded">
              <div className="text-2xl font-bold text-red-600">
                {students.filter(s => s.currentStatus === 'struggling').length}
              </div>
              <div className="text-sm text-red-600">Struggling</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">
                {students.filter(s => s.currentStatus === 'breakthrough').length}
              </div>
              <div className="text-sm text-purple-600">Breakthrough</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Needing Attention */}
      {students.some(s => s.needsAttention) && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Students Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {students.filter(s => s.needsAttention).map(student => (
                <div key={student.id} className="flex items-center justify-between p-2 bg-white rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center text-red-800 text-sm font-medium">
                      {student.name.charAt(0)}
                    </div>
                    <span className="font-medium">{student.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {student.currentStatus}
                    </Badge>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onStudentAction?.(student.id, 'prioritize')}
                  >
                    Address
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedStudents.map(renderStudentCard)}
      </div>

      {/* Empty State */}
      {students.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">No Students Yet</h3>
            <p className="text-gray-600">Students will appear here once they enroll in your class.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedStudentInsights;