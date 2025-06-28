import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Activity as ActivityIcon,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  MessageCircle,
  Plus,
  Star,
  TrendingUp,
  Users,
  Video,
  Zap,
  Award,
  BookOpen,
  Target,
  BarChart3,
  Bell,
  HelpCircle,
  Settings,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  Share2,
  Upload,
  CheckCircle,
  AlertCircle,
  XCircle,
  Timer,
  Mic,
  MicOff,
  ScreenShare,
  UserCheck,
  TrendingDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTeacherRecentActivity } from '@/hooks/useTeacherRecentActivity';
import { useTeacherStudents } from '@/hooks/useTeacherStudents';
import { useTeacherStats } from '@/hooks/useTeacherStats';
import { useTeacherUpcomingSessions } from '@/hooks/useTeacherUpcomingSessions';
import { Activity, ActivityType, ActivityPriority } from '@/types/activity';

// Mock data for demonstration
const mockTeacherData = {
  name: 'Sarah Johnson',
  avatar: '/placeholder.svg',
  totalStudents: 45,
  weekEarnings: 1247,
  earningsGrowth: 23,
  rating: 4.9,
  teachingStreak: 47,
  nextClass: {
    subject: 'Physics Year 10',
    time: '2h 15m',
    students: 25,
    isReady: true
  },
  currentClass: null, // Will be populated when teaching live
  todayClasses: [
    {
      id: '1',
      subject: 'Advanced Physics',
      time: '09:00',
      duration: '60 min',
      students: 18,
      status: 'completed',
      satisfaction: 4.8
    },
    {
      id: '2',
      subject: 'Physics Year 10',
      time: '14:30',
      duration: '45 min',
      students: 25,
      status: 'upcoming',
      materialsReady: true
    },
    {
      id: '3',
      subject: 'Mathematics A-Level',
      time: '16:00',
      duration: '90 min',
      students: 12,
      status: 'upcoming',
      materialsReady: false
    }
  ],
  studentActivity: {
    checkedIn: 18,
    total: 25,
    recentAchievements: [
      { student: 'Maria Santos', achievement: 'Completed Advanced Algebra' },
      { student: 'James Wilson', achievement: 'First Calculus Problem Solved' }
    ],
    needsAttention: [
      { student: 'Tommy Lee', issue: 'Missing homework submission' },
      { student: 'Emma Brown', issue: 'Low quiz scores' }
    ]
  },
  performance: {
    weekRevenue: 1247,
    revenueGrowth: 23,
    engagement: 87,
    satisfaction: 4.9,
    completionRate: 96
  },
  insights: {
    bestClass: 'Advanced Physics',
    improvement: 'Tommy\'s math scores improved 40%',
    opportunity: 'Physics tutoring demand up 25%',
    tip: 'Try interactive polls for better engagement'
  }
};

// Helper function to format time left
const formatTimeLeft = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  } else if (minutes < 1440) { // less than 24 hours
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  } else {
    const days = Math.floor(minutes / 1440);
    const remainingHours = Math.floor((minutes % 1440) / 60);
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }
};

// Helper function to format start time
const formatStartTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const TeacherCommandCenter: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveStudents, setLiveStudents] = useState(0);
  const [classProgress, setClassProgress] = useState(0);
  
  // Fetch real dashboard data
  const { activities, dashboardData, loading, error, refetch } = useTeacherRecentActivity({
    teacherId: user?.teacherId || '',
    limit: 10,
    days: 7
  });

  // Fetch real students data
  const { studentsData, loading: studentsLoading, error: studentsError, refetch: refetchStudents } = useTeacherStudents({
    teacherId: user?.teacherId || '',
  });

  // Fetch real stats data
  const { statsData, loading: statsLoading, error: statsError, refetch: refetchStats } = useTeacherStats({
    teacherId: user?.teacherId || '',
  });

  // Fetch upcoming sessions
  const { upcomingSessions, loading: sessionsLoading, error: sessionsError, refetch: refetchSessions } = useTeacherUpcomingSessions({
    teacherId: user?.teacherId || '',
  });

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Simulate live class updates
    if (isLive) {
      const liveTimer = setInterval(() => {
        setLiveStudents(prev => Math.min(23, prev + Math.floor(Math.random() * 2)));
        setClassProgress(prev => Math.min(100, prev + 2));
      }, 5000);
      return () => {
        clearInterval(timer);
        clearInterval(liveTimer);
      };
    }

    return () => clearInterval(timer);
  }, [isLive]);

  const HeaderCommandBar = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">Your Kidato Status</h1>
          {isLive && (
            <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              Live Teaching
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{studentsData?.totalStudents || 0} students</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>{statsData?.totalClasses || 0} classes</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{statsData?.totalHoursCompleted || 0}h completed</span>
            </div>
            {statsData?.nextUpcomingClassSession && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Next: {formatTimeLeft(statsData.nextUpcomingClassSession.timeLeft)}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src={mockTeacherData.avatar} />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">{studentsData?.teacherName || user?.fullName || 'Teacher'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LiveTeachingStatus = () => {
    if (isLive) {
      return (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-red-900">Teaching Physics Year 10</h2>
                <p className="text-red-700">{liveStudents} students • {100 - classProgress} min remaining</p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <MicOff className="w-4 h-4 mr-1" />
                  Mute All
                </Button>
                <Button size="sm" variant="outline">
                  <ScreenShare className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setIsLive(false)}>
                  End Class
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-900">{liveStudents}</div>
                <div className="text-sm text-red-700">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">87%</div>
                <div className="text-sm text-red-700">Engagement</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-red-700">Connection</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-900">{classProgress}%</div>
                <div className="text-sm text-red-700">Progress</div>
              </div>
            </div>
            
            <Progress value={classProgress} className="h-2" />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-900">
                {statsData?.nextUpcomingClassSession?.title || 'No upcoming class'} 
                {statsData?.nextUpcomingClassSession && ` starts in ${formatTimeLeft(statsData.nextUpcomingClassSession.timeLeft)}`}
              </h2>
              <p className="text-blue-700">
                {statsData?.nextUpcomingClassSession 
                  ? `${statsData.nextUpcomingClassSession.enrolledStudents} students enrolled`
                  : 'Schedule your next class to see upcoming sessions'
                }
              </p>
            </div>
            <div className="flex space-x-2">
              {statsData?.nextUpcomingClassSession ? (
                <Button 
                  size="sm" 
                  onClick={() => {
                    setIsLive(true);
                    setLiveStudents(15);
                    setClassProgress(5);
                  }}
                >
                  <PlayCircle className="w-4 h-4 mr-1" />
                  Start Early
                </Button>
              ) : (
                <Button size="sm" variant="outline" disabled>
                  <Calendar className="w-4 h-4 mr-1" />
                  No Class Scheduled
                </Button>
              )}
            </div>
          </div>
          
          {statsData?.nextUpcomingClassSession && (
            <div className="mt-4 space-y-3">
              {/* Overall Readiness Progress */}
              <div className="bg-white/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-900">Class Readiness</span>
                  <span className="text-sm font-bold text-blue-900">
                    {statsData.nextUpcomingClassSession.readiness?.overallReadiness || 0}%
                  </span>
                </div>
                <Progress 
                  value={statsData.nextUpcomingClassSession.readiness?.overallReadiness || 0} 
                  className="h-2"
                />
              </div>
              
              {/* Readiness Status Items */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  {statsData.nextUpcomingClassSession.readiness?.lessonPlanReady ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs ${statsData.nextUpcomingClassSession.readiness?.lessonPlanReady ? 'text-green-700' : 'text-red-700'}`}>
                    Lesson Plan
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {statsData.nextUpcomingClassSession.readiness?.materialsReady ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs ${statsData.nextUpcomingClassSession.readiness?.materialsReady ? 'text-green-700' : 'text-red-700'}`}>
                    Materials
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {statsData.nextUpcomingClassSession.readiness?.zoomSetup ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs ${statsData.nextUpcomingClassSession.readiness?.zoomSetup ? 'text-green-700' : 'text-red-700'}`}>
                    Zoom Setup
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {statsData.nextUpcomingClassSession.readiness?.studentsNotified ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs ${statsData.nextUpcomingClassSession.readiness?.studentsNotified ? 'text-green-700' : 'text-red-700'}`}>
                    Students Notified
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const UpcomingSessionsOverview = () => (
    <div className="space-y-6">
      {/* Upcoming Sessions Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Upcoming Schedule</span>
            </div>
            {sessionsLoading && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessionsError ? (
            <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
              Error loading sessions: {sessionsError}
              <Button variant="outline" size="sm" onClick={refetchSessions} className="ml-2">
                Retry
              </Button>
            </div>
          ) : upcomingSessions.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No upcoming sessions scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.classId} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      session.readiness.overallReadiness >= 80 ? 'bg-green-500' :
                      session.readiness.overallReadiness >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <div className="font-medium">{session.title}</div>
                      <div className="text-sm text-gray-600">
                        {formatStartTime(session.startTime)} • {session.duration}min • {session.enrolledStudents} students
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.cohortName} • starts in {formatTimeLeft(session.timeLeft)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={session.readiness.overallReadiness >= 80 ? "default" : session.readiness.overallReadiness >= 50 ? "secondary" : "destructive"}>
                      {session.readiness.overallReadiness}% ready
                    </Badge>
                    {session.readiness.overallReadiness < 80 && (
                      <Badge variant="outline" className="text-orange-600">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Needs prep
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5" />
            <span>Student Activity</span>
            {(loading || studentsLoading || statsLoading) && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin ml-2" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
              Error loading activity: {error}
              <Button variant="outline" size="sm" onClick={refetch} className="ml-2">
                Retry
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Performance Summary */}
              {studentsData?.performanceSummary && (
                <div>
                  <h4 className="font-medium text-sm mb-3">Student Performance Summary</h4>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-700">{studentsData.performanceSummary.highPerformers}</div>
                      <div className="text-xs text-green-600">High Performers</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-lg font-bold text-blue-700">{studentsData.performanceSummary.active}</div>
                      <div className="text-xs text-blue-600">Active</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <div className="text-lg font-bold text-orange-700">{studentsData.performanceSummary.needsAttention}</div>
                      <div className="text-xs text-orange-600">Needs Attention</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-gray-700">{studentsData.performanceSummary.inactive}</div>
                      <div className="text-xs text-gray-600">Inactive</div>
                    </div>
                  </div>
                </div>
              )}

              {studentsError && (
                <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                  Error loading students: {studentsError}
                  <Button variant="outline" size="sm" onClick={refetchStudents} className="ml-2">
                    Retry
                  </Button>
                </div>
              )}

              {statsError && (
                <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                  Error loading stats: {statsError}
                  <Button variant="outline" size="sm" onClick={refetchStats} className="ml-2">
                    Retry
                  </Button>
                </div>
              )}

              {statsData?.nextUpcomingClassSession && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Next Class</span>
                    <span className="text-xs text-blue-600">
                      {formatTimeLeft(statsData.nextUpcomingClassSession.timeLeft)} left
                    </span>
                  </div>
                  <div className="text-sm text-blue-700">{statsData.nextUpcomingClassSession.title}</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {statsData.nextUpcomingClassSession.cohortName} • {statsData.nextUpcomingClassSession.enrolledStudents} students
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-sm mb-2">Recent Activity</h4>
                {activities.length === 0 ? (
                  <p className="text-sm text-gray-500">No recent activity</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {activities.map((activity, index) => (
                      <ActivityItem key={index} activity={activity} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Materials & Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Materials & Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">All resources uploaded</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Material
            </Button>
            <div className="text-sm text-gray-600">
              💡 Students love your quantum physics animations
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PerformanceInsights = () => (
    <div className="space-y-6">
      {/* Teaching Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Teaching Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{statsData?.activeCohorts || 0}</div>
              <div className="text-sm text-gray-600">Active Cohorts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{statsData?.averageRating || 0}</div>
              <div className="text-sm text-gray-600">Average Rating ⭐</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Completion Rate</span>
              <span className="text-sm font-medium">{statsData?.completionRate || 0}%</span>
            </div>
            <Progress value={statsData?.completionRate || 0} className="h-2" />
          </div>
          
          <div className="space-y-2 mt-3">
            <div className="flex justify-between">
              <span className="text-sm">Hours Progress</span>
              <span className="text-sm font-medium">{statsData?.totalHoursCompleted || 0}/{statsData?.totalHoursScheduled || 0}h</span>
            </div>
            <Progress value={statsData ? (statsData.totalHoursCompleted / Math.max(statsData.totalHoursScheduled, 1)) * 100 : 0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Financial Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Financial Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-3xl font-bold">${mockTeacherData.performance.weekRevenue}</div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600">+{mockTeacherData.performance.revenueGrowth}% this week</span>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>5 trials scheduled</span>
              <span className="text-green-600">$400 potential</span>
            </div>
            <div className="flex justify-between">
              <span>12 inquiries pending</span>
              <span className="text-blue-600">$960 potential</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Smart Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-900">Best Performing Class</div>
              <div className="text-sm text-blue-700">{mockTeacherData.insights.bestClass}</div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium text-green-900">Student Progress</div>
              <div className="text-sm text-green-700">{mockTeacherData.insights.improvement}</div>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="font-medium text-purple-900">Market Opportunity</div>
              <div className="text-sm text-purple-700">{mockTeacherData.insights.opportunity}</div>
            </div>
            
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="font-medium text-orange-900">Teaching Tip</div>
              <div className="text-sm text-orange-700">{mockTeacherData.insights.tip}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Stories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Success Stories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-green-500 bg-green-50">
              <div className="font-medium">Recent Win</div>
              <div className="text-sm text-gray-600">James solved his first calculus problem!</div>
            </div>
            
            <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
              <div className="font-medium">Parent Feedback</div>
              <div className="text-sm text-gray-600">"Sarah's teaching style really connects with our daughter."</div>
            </div>
            
            <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
              <div className="font-medium">Long-term Impact</div>
              <div className="text-sm text-gray-600">Emma improved from C to A this semester</div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share Success Story
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Navigation handlers for floating action buttons
  const handleCreateNewClass = () => {
    navigate('/teacher-class-setup');
  };

  const handleMessageStudents = () => {
    navigate('/teacher-dashboard/students');
  };

  const handleViewAnalytics = () => {
    // Navigate to a dedicated analytics page or expand current view
    // For now, we'll navigate to the students page which has analytics
    navigate('/teacher-dashboard/students');
  };

  const QuickActionsHub = () => {
    const needsAttentionCount = studentsData?.performanceSummary?.needsAttention || 0;
    
    return (
      <div className="fixed bottom-6 right-6 flex space-x-3 z-50">
        <Button 
          className="rounded-full w-12 h-12 shadow-lg hover:scale-110 transition-all duration-200 bg-gradient-to-r from-[#5e6ad2] to-[#abb4dd] hover:from-[#5e6ad2]/90 hover:to-[#abb4dd]/90" 
          title="Create New Class - Start building your next course"
          onClick={handleCreateNewClass}
          aria-label="Create new class"
        >
          <Plus className="w-5 h-5 text-white" />
        </Button>
        
        <Button 
          variant="outline" 
          className="rounded-full w-12 h-12 shadow-lg hover:scale-110 transition-all duration-200 relative bg-white/90 backdrop-blur-sm border-[#5e6ad2]/20 hover:border-[#5e6ad2] hover:bg-[#5e6ad2]/5" 
          title={`Message Students - ${studentsData?.totalStudents || 0} students${needsAttentionCount > 0 ? `, ${needsAttentionCount} need attention` : ''}`}
          onClick={handleMessageStudents}
          aria-label={`Message students${needsAttentionCount > 0 ? ` (${needsAttentionCount} need attention)` : ''}`}
        >
          <MessageCircle className="w-5 h-5 text-[#5e6ad2]" />
          {needsAttentionCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#f99325] text-white text-xs rounded-full flex items-center justify-center font-bold">
              {needsAttentionCount > 9 ? '9+' : needsAttentionCount}
            </div>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          className="rounded-full w-12 h-12 shadow-lg hover:scale-110 transition-all duration-200 bg-white/90 backdrop-blur-sm border-[#5e6ad2]/20 hover:border-[#5e6ad2] hover:bg-[#5e6ad2]/5" 
          title={`View Analytics - Track your teaching performance (${statsData?.averageRating || 0}⭐ rating)`}
          onClick={handleViewAnalytics}
          aria-label="View detailed analytics and performance metrics"
        >
          <BarChart3 className="w-5 h-5 text-[#5e6ad2]" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderCommandBar />
      
      <div className="p-6 space-y-6">
        <LiveTeachingStatus />
        
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-2">
            <UpcomingSessionsOverview />
          </div>
          <div className="col-span-3">
            <PerformanceInsights />
          </div>
        </div>
      </div>
      
      <QuickActionsHub />
    </div>
  );
};

// Activity Item Component
interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'new_enrollment':
        return '👋';
      case 'progress_update':
        return '📈';
      case 'completion':
        return '🎉';
      case 'needs_attention':
        return '⚠️';
      case 'upcoming_session':
        return '📅';
      default:
        return '📝';
    }
  };

  const getPriorityColor = (priority: ActivityPriority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <div className={`text-sm p-2 rounded-md border-l-4 ${
      activity.priority === 'high' ? 'border-red-500 bg-red-50' :
      activity.priority === 'medium' ? 'border-orange-500 bg-orange-50' :
      'border-blue-500 bg-blue-50'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span>{getActivityIcon(activity.type)}</span>
            <span className={`font-medium ${getPriorityColor(activity.priority)}`}>
              {activity.description}
            </span>
          </div>
          {activity.studentName && (
            <div className="text-xs text-gray-500 mt-1">
              Student: {activity.studentName}
              {activity.classTitle && ` • ${activity.classTitle}`}
            </div>
          )}
          {activity.actionRequired && (
            <div className="text-xs text-gray-700 mt-1 font-medium">
              Action: {activity.actionRequired}
            </div>
          )}
          {activity.details && (
            <div className="text-xs text-gray-500 mt-1">
              {activity.details.attendanceRatio !== undefined && (
                <span>Attendance: {activity.details.attendanceRatio}% • </span>
              )}
              {activity.details.progressRatio !== undefined && (
                <span>Progress: {activity.details.progressRatio}%</span>
              )}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-400 ml-2">
          {formatTimestamp(activity.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default TeacherCommandCenter;