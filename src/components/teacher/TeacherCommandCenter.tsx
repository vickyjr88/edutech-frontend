import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Activity,
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
  Timer,
  Mic,
  MicOff,
  ScreenShare,
  UserCheck,
  TrendingDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

const TeacherCommandCenter: React.FC = () => {
  const { user } = useAuth();
  const [isLive, setIsLive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveStudents, setLiveStudents] = useState(0);
  const [classProgress, setClassProgress] = useState(0);

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
              <span>{mockTeacherData.totalStudents} students</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>${mockTeacherData.weekEarnings}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Next: {mockTeacherData.nextClass.time}</span>
            </div>
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
              <div className="font-medium">{mockTeacherData.name}</div>
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
                {mockTeacherData.nextClass.subject} starts in {mockTeacherData.nextClass.time}
              </h2>
              <p className="text-blue-700">{mockTeacherData.nextClass.students} students enrolled</p>
            </div>
            <div className="flex space-x-2">
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
            </div>
          </div>
          
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-blue-700">Materials Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-blue-700">Room Setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-blue-700">Reminder Sent</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TodaysOverview = () => (
    <div className="space-y-6">
      {/* Class Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Today's Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTeacherData.todayClasses.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    classItem.status === 'completed' ? 'bg-green-500' :
                    classItem.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <div className="font-medium">{classItem.subject}</div>
                    <div className="text-sm text-gray-600">
                      {classItem.time} • {classItem.duration} • {classItem.students} students
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {classItem.status === 'completed' && (
                    <Badge variant="secondary">
                      <Star className="w-3 h-3 mr-1" />
                      {classItem.satisfaction}
                    </Badge>
                  )}
                  {classItem.status === 'upcoming' && !classItem.materialsReady && (
                    <Badge variant="destructive">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Materials
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5" />
            <span>Student Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Next class check-ins</span>
              <span className="font-medium">
                {mockTeacherData.studentActivity.checkedIn}/{mockTeacherData.studentActivity.total}
              </span>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Recent Achievements</h4>
              {mockTeacherData.studentActivity.recentAchievements.map((achievement, index) => (
                <div key={index} className="text-sm text-green-700 mb-1">
                  🎉 {achievement.student}: {achievement.achievement}
                </div>
              ))}
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Needs Attention</h4>
              {mockTeacherData.studentActivity.needsAttention.map((item, index) => (
                <div key={index} className="text-sm text-orange-700 mb-1">
                  ⚠️ {item.student}: {item.issue}
                </div>
              ))}
            </div>
          </div>
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
              <div className="text-3xl font-bold text-orange-500">{mockTeacherData.teachingStreak}</div>
              <div className="text-sm text-gray-600">Day Streak 🔥</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{mockTeacherData.rating}</div>
              <div className="text-sm text-gray-600">Satisfaction ⭐</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Engagement Rate</span>
              <span className="text-sm font-medium">{mockTeacherData.performance.engagement}%</span>
            </div>
            <Progress value={mockTeacherData.performance.engagement} className="h-2" />
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

  const QuickActionsHub = () => (
    <div className="fixed bottom-6 right-6 flex space-x-3">
      <Button className="rounded-full w-12 h-12 shadow-lg" title="Create New Class">
        <Plus className="w-5 h-5" />
      </Button>
      <Button variant="outline" className="rounded-full w-12 h-12 shadow-lg" title="Message Students">
        <MessageCircle className="w-5 h-5" />
      </Button>
      <Button variant="outline" className="rounded-full w-12 h-12 shadow-lg" title="View Analytics">
        <BarChart3 className="w-5 h-5" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderCommandBar />
      
      <div className="p-6 space-y-6">
        <LiveTeachingStatus />
        
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-2">
            <TodaysOverview />
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

export default TeacherCommandCenter;