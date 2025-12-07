import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Clock,
  Target,
  Lightbulb,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Zap,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Minus,
  Bell,
  Eye,
  MessageSquare,
  BookOpen,
  Calendar,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { EnhancedClass, TeachingAnalytics, SmartAlert } from '@/types/enhanced-classes';
import { cn } from '@/lib/utils';

interface TeachingIntelligenceDashboardProps {
  classes: EnhancedClass[];
  analytics: TeachingAnalytics;
}

const TeachingIntelligenceDashboard: React.FC<TeachingIntelligenceDashboardProps> = ({
  classes,
  analytics
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('week');

  // Aggregate all alerts from classes
  const allAlerts = classes.reduce((alerts: SmartAlert[], cls) => {
    return [...alerts, ...cls.alerts];
  }, []).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const urgentAlerts = allAlerts.filter(alert => alert.type === 'urgent');
  const importantAlerts = allAlerts.filter(alert => alert.type === 'important');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'important': return <Bell className="h-4 w-4 text-yellow-600" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default: return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'border-red-200 bg-red-50';
      case 'important': return 'border-yellow-200 bg-yellow-50';
      case 'success': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };


  // Calculate performance insights from real data
  const getPerformanceInsights = () => {
    const insights = [];

    // Analyze engagement trends across all classes
    const avgEngagement = classes.reduce((sum, cls) => sum + (cls.momentum?.engagementTrend === 'up' ? 1 : 0), 0) / classes.length;
    if (avgEngagement > 0.5) {
      insights.push({
        title: 'Positive Engagement Trend',
        description: `${Math.round(avgEngagement * 100)}% of your classes show improving engagement`,
        impact: 'high' as const,
        confidence: Math.round(avgEngagement * 100),
        trend: 'up' as const
      });
    }

    // Analyze attendance patterns
    const avgAttendance = classes.reduce((sum, cls) => sum + (cls.momentum?.attendanceRate || 0), 0) / classes.length;
    if (avgAttendance < 80) {
      insights.push({
        title: 'Attendance Optimization',
        description: `Average attendance is ${Math.round(avgAttendance)}%. Consider flexible scheduling or engagement strategies`,
        impact: 'medium' as const,
        confidence: 85,
        trend: 'down' as const
      });
    } else {
      insights.push({
        title: 'Strong Attendance',
        description: `Excellent ${Math.round(avgAttendance)}% average attendance across classes`,
        impact: 'high' as const,
        confidence: 90,
        trend: 'up' as const
      });
    }

    // Analyze completion rates
    const avgCompletion = classes.reduce((sum, cls) => sum + (cls.momentum?.completionRate || 0), 0) / classes.length;
    if (avgCompletion < 70) {
      insights.push({
        title: 'Assignment Completion',
        description: `${Math.round(avgCompletion)}% completion rate. Consider adjusting workload or deadlines`,
        impact: 'medium' as const,
        confidence: 78,
        trend: 'down' as const
      });
    }

    // Analyze struggling students
    const totalStrugglingStudents = classes.reduce((sum, cls) => sum + (cls.studentInsights?.strugglingStudents || 0), 0);
    if (totalStrugglingStudents > 0) {
      insights.push({
        title: 'Students Needing Support',
        description: `${totalStrugglingStudents} students across classes may benefit from additional support`,
        impact: 'high' as const,
        confidence: 92,
        trend: 'stable' as const
      });
    }

    return insights.slice(0, 3); // Return top 3 insights
  };

  const getStudentReadinessPredictions = () => {
    return classes.map(cls => {
      // Calculate readiness based on multiple factors
      const attendanceScore = (cls.momentum?.attendanceRate || 70);
      const engagementScore = (cls.momentum?.participationRate || 70);
      const completionScore = (cls.momentum?.completionRate || 70);
      const readinessScore = Math.round((attendanceScore + engagementScore + completionScore) / 3);

      const recommendations = [];

      if (cls.studentInsights?.strugglingStudents > 0) {
        recommendations.push(`Schedule support sessions for ${cls.studentInsights.strugglingStudents} struggling students`);
      }
      if (cls.preparationStatus === 'needs-prep' || cls.preparationStatus === 'critical') {
        recommendations.push('Complete lesson preparation before next session');
      }
      if (readinessScore < 70) {
        recommendations.push('Consider review session before advancing to new material');
      }
      if (cls.momentum?.attendanceRate < 80) {
        recommendations.push('Reach out to students with low attendance');
      }

      // Ensure at least one recommendation
      if (recommendations.length === 0) {
        recommendations.push('Class is on track - maintain current approach');
      }

      return {
        classId: cls.id,
        className: cls.title,
        readinessScore,
        strugglingStudents: cls.studentInsights?.strugglingStudents || 0,
        nextChallenge: cls.nextLesson?.topic || 'Upcoming Session',
        recommendations: recommendations.slice(0, 3)
      };
    });
  };

  const getEngagementHeatmap = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const times = ['9AM', '11AM', '1PM', '3PM', '5PM'];

    // Calculate engagement based on class performance metrics
    const baseEngagement = classes.reduce((sum, cls) =>
      sum + (cls.performanceMetrics?.teachingEffectiveness || 75), 0
    ) / (classes.length || 1);

    return days.map(day => ({
      day,
      times: times.map(time => {
        // Add some variation based on time of day
        let timeMultiplier = 1.0;
        if (time === '9AM' || time === '11AM') timeMultiplier = 1.1; // Morning boost
        if (time === '5PM') timeMultiplier = 0.9; // Evening dip

        // Add day variation
        let dayMultiplier = 1.0;
        if (day === 'Mon') dayMultiplier = 0.95; // Monday dip
        if (day === 'Wed') dayMultiplier = 1.05; // Mid-week peak
        if (day === 'Fri') dayMultiplier = 0.92; // Friday dip

        const engagement = Math.min(100, Math.round(baseEngagement * timeMultiplier * dayMultiplier));

        return {
          time,
          engagement
        };
      })
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          Teaching Intelligence Dashboard
        </h2>

        <div className="flex items-center gap-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold">{analytics.overview.averagePerformance}%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5% this week
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{analytics.overview.totalStudents}</p>
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Across {analytics.overview.totalClasses} classes
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent Alerts</p>
                <p className="text-2xl font-bold text-red-600">{urgentAlerts.length}</p>
                <p className="text-xs text-gray-600">Need immediate attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lessons Delivered</p>
                <p className="text-2xl font-bold">{analytics.overview.totalLessonsDelivered}</p>
                <p className="text-xs text-gray-600">{analytics.overview.upcomingDeadlines} upcoming</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Alerts Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Priority Alerts ({urgentAlerts.length + importantAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {allAlerts.slice(0, 8).map(alert => (
              <div key={alert.id} className={cn(
                "p-3 rounded-lg border",
                getAlertColor(alert.type)
              )}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatTime(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  {alert.actionRequired && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm">Action</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {allAlerts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>All caught up! No urgent alerts.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getPerformanceInsights().map((insight, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{insight.title}</h4>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(insight.trend)}
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        insight.impact === 'high' ? 'border-red-200 text-red-700' :
                          insight.impact === 'medium' ? 'border-yellow-200 text-yellow-700' :
                            'border-green-200 text-green-700'
                      )}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Confidence: {insight.confidence}%</span>
                    <Button size="sm" variant="outline">Learn More</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Readiness Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Student Readiness Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getStudentReadinessPredictions().map(prediction => (
                <div key={prediction.classId} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{prediction.className}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{prediction.readinessScore}%</span>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        prediction.readinessScore >= 80 ? "bg-green-500" :
                          prediction.readinessScore >= 60 ? "bg-yellow-500" :
                            "bg-red-500"
                      )} />
                    </div>
                  </div>
                  <Progress value={prediction.readinessScore} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Next Challenge: {prediction.nextChallenge}
                  </p>
                  {prediction.strugglingStudents > 0 && (
                    <p className="text-xs text-red-600 mb-2">
                      ⚠️ {prediction.strugglingStudents} students may need extra support
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Prep
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Engagement Heatmap - Best Teaching Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-2 text-sm">
              <div className="font-medium">Time</div>
              {getEngagementHeatmap().map(day => (
                <div key={day.day} className="font-medium text-center">{day.day}</div>
              ))}

              {getEngagementHeatmap()[0].times.map(timeSlot => (
                <React.Fragment key={timeSlot.time}>
                  <div className="font-medium">{timeSlot.time}</div>
                  {getEngagementHeatmap().map(day => {
                    const timeData = day.times.find(t => t.time === timeSlot.time);
                    const engagement = timeData?.engagement || 0;
                    return (
                      <div
                        key={`${day.day}-${timeSlot.time}`}
                        className={cn(
                          "p-2 rounded text-center text-xs font-medium",
                          engagement >= 80 ? "bg-green-200 text-green-800" :
                            engagement >= 70 ? "bg-yellow-200 text-yellow-800" :
                              engagement >= 60 ? "bg-orange-200 text-orange-800" :
                                "bg-red-200 text-red-800"
                        )}
                      >
                        {engagement}%
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span>Engagement Level:</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-200 rounded" />
                <span>Low (60-69%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-200 rounded" />
                <span>Fair (70-79%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-200 rounded" />
                <span>Good (80-89%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-200 rounded" />
                <span>Excellent (90%+)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            AI-Powered Teaching Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recommendations.map(rec => (
              <div key={rec.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  </div>
                  <Badge className={cn(
                    "ml-2",
                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                  )}>
                    {rec.priority} priority
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Impact:</span>
                    <span className="ml-2 font-medium">{rec.estimatedImpact}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <span className="ml-2 font-medium">{rec.implementationTime}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <h5 className="font-medium text-sm mb-2">Action Steps:</h5>
                  <ul className="space-y-1">
                    {rec.actions.map((action, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">
                    Implement Now
                  </Button>
                  <Button size="sm" variant="outline">
                    Schedule for Later
                  </Button>
                  <Button size="sm" variant="ghost">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Helpful
                  </Button>
                  <Button size="sm" variant="ghost">
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    Not Useful
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeachingIntelligenceDashboard;