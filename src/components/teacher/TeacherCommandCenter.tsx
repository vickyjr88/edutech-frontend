import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import api from '@/lib/axios';
import FinancialOverviewCard from '@/components/teachers/FinancialOverviewCard';
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
import { useTeacherSummary } from '@/hooks/useTeacherSummary';
import { Activity, ActivityType, ActivityPriority } from '@/types/activity';
import { teacherResourcesService, SuccessStory } from "@/integrations/api/services/teacher-resources.service";


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

// Helper function to check if early start is allowed (within 15 minutes of scheduled time)
const canStartEarly = (timeLeftInMinutes: number): boolean => {
  return timeLeftInMinutes <= 15 && timeLeftInMinutes > 0;
};

// Helper function to check minimum readiness requirements
const hasMinimumReadiness = (readiness: any): boolean => {
  if (!readiness) return false;
  return readiness.overallReadiness >= 70 &&
    readiness.lessonPlanReady &&
    readiness.materialsReady;
};

// Helper function to get readiness status message
const getReadinessMessage = (readiness: any): string => {
  if (!readiness) return 'Readiness data not available';

  const missing = [];
  if (!readiness.lessonPlanReady) missing.push('lesson plan');
  if (!readiness.materialsReady) missing.push('materials');
  if (!readiness.zoomSetup) missing.push('Zoom setup');

  if (missing.length === 0) {
    return 'All requirements met';
  }

  return `Missing: ${missing.join(', ')}`;
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
  const [isStartingEarly, setIsStartingEarly] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  // Fetch teacher summary data
  const { summaryData, loading: summaryLoading } = useTeacherSummary({
    teacherId: user?.teacherId || '',
  });

  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  useEffect(() => {
    const fetchStories = async () => {
      if (user?.teacherId) {
        try {
          const { data } = await teacherResourcesService.getSuccessStories(user.teacherId);
          if (data) setSuccessStories(data);
        } catch (error) {
          console.error("Failed to fetch success stories", error);
        }
      }
    };
    fetchStories();
  }, [user?.teacherId]);

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

  // API call to start class early
  const handleStartEarly = useCallback(async () => {
    if (!statsData?.nextUpcomingClassSession) return;

    const session = statsData.nextUpcomingClassSession;
    setIsStartingEarly(true);

    try {
      const response = await api.post(`/api/classes/${session.classId}/${session.sessionId}/start-early`, {
        teacherId: user?.teacherId,
        sessionId: session.sessionId,
        classId: session.classId
      });

      const result = response.data;

      // Update local state with real session data
      setIsLive(true);
      setLiveStudents(session.enrolledStudents || 0);
      setClassProgress(0); // Start fresh
      setShowConfirmModal(false);

      // TODO: Show success notification
      console.log('Class started early successfully:', result);

    } catch (error) {
      console.error('Error starting class early:', error);
      // TODO: Show error notification
    } finally {
      setIsStartingEarly(false);
    }
  }, [statsData?.nextUpcomingClassSession, user]);

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
              <AvatarImage src={user?.profileImage || '/placeholder.svg'} />
              <AvatarFallback>{user?.fullName?.split(' ').map(n => n[0]).join('') || 'T'}</AvatarFallback>
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
      const currentSession = statsData?.nextUpcomingClassSession;
      return (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-red-900">
                  Teaching {currentSession?.title || 'Live Class'}
                </h2>
                <p className="text-red-700">
                  {liveStudents} students • {currentSession?.duration || 60} min session
                </p>
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
                (() => {
                  const session = statsData.nextUpcomingClassSession;
                  const canStart = canStartEarly(session.timeLeft);
                  const hasReadiness = hasMinimumReadiness(session.readiness);
                  const isReady = canStart && hasReadiness;

                  return (
                    <div className="flex flex-col space-y-1">
                      <Button
                        size="sm"
                        onClick={() => setShowConfirmModal(true)}
                        disabled={!isReady || isStartingEarly}
                        title={!canStart ? `Can only start early within 15 minutes (${session.timeLeft}m left)` :
                          !hasReadiness ? getReadinessMessage(session.readiness) :
                            'Start class early and notify students'}
                      >
                        {isStartingEarly ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                            Starting...
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4 mr-1" />
                            Start Early
                          </>
                        )}
                      </Button>
                      {!isReady && (
                        <div className="text-xs text-gray-600">
                          {!canStart && `Available in ${session.timeLeft - 15}m`}
                          {canStart && !hasReadiness && `${session.readiness?.overallReadiness || 0}% ready`}
                        </div>
                      )}
                    </div>
                  );
                })()
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
                    <div className={`w-3 h-3 rounded-full ${session.readiness.overallReadiness >= 80 ? 'bg-green-500' :
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
      <FinancialOverviewCard summaryData={summaryData} />

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
            {summaryData?.insights ? (
              <>
                {summaryData.insights.bestClass && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900">Best Performing Class</div>
                    <div className="text-sm text-blue-700">{summaryData.insights.bestClass}</div>
                  </div>
                )}

                {summaryData.insights.improvement && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-900">Student Progress</div>
                    <div className="text-sm text-green-700">{summaryData.insights.improvement}</div>
                  </div>
                )}

                {summaryData.insights.opportunity && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-900">Market Opportunity</div>
                    <div className="text-sm text-purple-700">{summaryData.insights.opportunity}</div>
                  </div>
                )}

                {summaryData.insights.tip && (
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-medium text-orange-900">Teaching Tip</div>
                    <div className="text-sm text-orange-700">{summaryData.insights.tip}</div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Zap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Smart insights will appear here as you teach more classes</p>
              </div>
            )}
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
            {successStories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-2 text-gray-200" />
                <p>No success stories recorded yet</p>
                <p className="text-xs mt-1">Share your teaching wins here!</p>
              </div>
            ) : (
              successStories.map((story, idx) => {
                let borderColor = "border-green-500";
                let bgColor = "bg-green-50";
                if (story.category === "Parent Feedback") {
                  borderColor = "border-blue-500";
                  bgColor = "bg-blue-50";
                } else if (story.category === "Long-term Impact") {
                  borderColor = "border-purple-500";
                  bgColor = "bg-purple-50";
                } else if (story.category === "Other") {
                  borderColor = "border-gray-500";
                  bgColor = "bg-gray-50";
                }

                return (
                  <div key={idx} className={`p-3 border-l-4 ${borderColor} ${bgColor}`}>
                    <div className="font-medium">{story.category}</div>
                    <div className="text-sm text-gray-600">{story.content}</div>
                  </div>
                );
              })
            )}

            <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/teacher-dashboard/content?subtab=stories')}>
              <Share2 className="w-4 h-4 mr-2" />
              Manage Success Stories
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

  // Confirmation Modal Component
  const ConfirmStartEarlyModal = () => {
    if (!showConfirmModal || !statsData?.nextUpcomingClassSession) return null;

    const session = statsData.nextUpcomingClassSession;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Start Class Early?</h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Class:</span>
              <span className="text-sm font-medium">{session.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Enrolled Students:</span>
              <span className="text-sm font-medium">{session.enrolledStudents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Scheduled Time:</span>
              <span className="text-sm font-medium">in {formatTimeLeft(session.timeLeft)}</span>
            </div>
          </div>

          {/* Readiness Checklist */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Readiness Checklist:</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {session.readiness?.lessonPlanReady ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs">Lesson Plan Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                {session.readiness?.materialsReady ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs">Materials Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                {session.readiness?.zoomSetup ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs">Zoom Setup Complete</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              💬 Starting early will automatically notify all enrolled students via push notification.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowConfirmModal(false)}
              disabled={isStartingEarly}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleStartEarly}
              disabled={isStartingEarly}
            >
              {isStartingEarly ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Starting...
                </>
              ) : (
                <>Start Early</>
              )}
            </Button>
          </div>
        </div>
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
      <ConfirmStartEarlyModal />
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
    <div className={`text-sm p-2 rounded-md border-l-4 ${activity.priority === 'high' ? 'border-red-500 bg-red-50' :
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