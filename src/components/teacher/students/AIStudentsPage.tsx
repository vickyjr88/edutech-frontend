import React, { useState, useMemo } from "react";
import { 
  Search, Filter, Users, TrendingUp, Star, Brain, 
  MessageCircle, UserPlus, Share2, Award, Clock,
  ChevronDown, Check, AlertTriangle, Activity,
  BarChart3, Zap, Target, Sparkles, Mail, Phone,
  BookOpen, CheckCircle, XCircle, Pause, Eye
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useTeacherStudents } from '@/hooks/useTeacherStudents';
import { useTeacherStats } from '@/hooks/useTeacherStats';
import { useTeacherSummary } from '@/hooks/useTeacherSummary';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { SmartMessageComposer } from "../messaging/SmartMessageComposer";
import { MessageAnalyticsDashboard } from "../messaging/MessageAnalyticsDashboard";
import InviteStudentModal from "./InviteStudentModal";

// Types
interface Student {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  subjects: string[];
  attendance: number;
  assignments: string;
  status: 'high-performer' | 'normal' | 'needs-attention' | 'inactive';
  lastActive: string;
  aiInsights?: string[];
  engagementScore?: number;
  performanceGrade?: number;
}

interface AIStudentsPageProps {
  onViewProfile?: (studentId: string) => void;
  onEnrollStudents?: () => void;
}

const AIStudentsPage: React.FC<AIStudentsPageProps> = ({ 
  onViewProfile, 
  onEnrollStudents
}) => {
  const { user } = useAuth();
  const { studentsData, loading, error } = useTeacherStudents({
    teacherId: user?.teacherId || '',
  });

  const { statsData, loading: statsLoading, error: statsError } = useTeacherStats({
    teacherId: user?.teacherId || '',
  });

  const { summaryData, loading: summaryLoading, error: summaryError } = useTeacherSummary({
    teacherId: user?.teacherId || '',
  });

  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showMessageComposer, setShowMessageComposer] = useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Generate enhanced class data from teacher summary
  const { classData, enrichedClasses } = useMemo(() => {
    const totalStudents = studentsData?.students?.length || 0;
    const allClassesItem = { name: "All Classes", count: totalStudents, active: true };
    
    if (!summaryData?.classes || summaryData.classes.length === 0) {
      // Use enhanced fallback data when no classes available
      const totalClasses = statsData?.totalClasses || 4;
      const avgStudentsPerClass = Math.floor(totalStudents / Math.max(totalClasses, 1));
      return {
        classData: [
          allClassesItem,
          { name: "Math A", count: avgStudentsPerClass, active: true },
          { name: "Physics", count: avgStudentsPerClass, active: true },
          { name: "Chemistry", count: avgStudentsPerClass, active: true },
          { name: "Biology", count: avgStudentsPerClass, active: true }
        ],
        enrichedClasses: []
      };
    }
    
    // Generate enhanced class data from teacher summary
    const classItems = summaryData.classes.map(classItem => ({
      name: classItem.title,
      count: classItem.enrolledStudents,
      active: classItem.isPublished,
      classId: classItem.classId,
      subject: classItem.subject,
      type: classItem.type,
      activeCohorts: classItem.activeCohorts,
      progressPercentage: classItem.progressPercentage,
      averageEngagement: classItem.averageEngagement,
      rating: classItem.rating,
      nextSession: classItem.nextSession,
      classState: classItem.classState
    }));
    
    return {
      classData: [allClassesItem, ...classItems],
      enrichedClasses: summaryData.classes
    };
  }, [summaryData, studentsData, statsData]);

  // Filter students based on selections
  const filteredStudents = useMemo(() => {
    if (!studentsData?.students) return [];
    
    return studentsData.students.filter(student => {
      const matchesSearch = !searchQuery || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedFilter === "All" || 
        (selectedFilter === "Need Attention" && (student.status === "Needs Attention" || student.status === "Inactive")) ||
        (selectedFilter === "High Performers" && student.status === "Active") ||
        (selectedFilter === "Inactive" && student.status === "Inactive") ||
        (selectedFilter === "Recent Activity" && student.lastActivity.includes("hour"));
      
      return matchesSearch && matchesFilter;
    });
  }, [studentsData, searchQuery, selectedFilter]);

  // Calculate metrics using real API data from both sources
  const metrics = useMemo(() => {
    if (!studentsData?.performanceSummary) {
      return {
        priorityStudents: 0,
        highPerformers: 0,
        inactiveStudents: 0,
        avgPerformance: 0
      };
    }

    const priorityStudents = studentsData.performanceSummary.needsAttention;
    const highPerformers = studentsData.performanceSummary.highPerformers;
    const inactiveStudents = studentsData.performanceSummary.inactive;
    const avgPerformance = studentsData.students ? 
      Math.round(studentsData.students.reduce((sum, s) => sum + (s.attendance.percentage || 0), 0) / studentsData.students.length) : 0;
    const avgEngagement = studentsData.students ? 
      Math.round(studentsData.students.reduce((sum, s) => sum + (s.assignments.completionRate || 0), 0) / studentsData.students.length) : 0;
    
    return {
      priorityStudents,
      highPerformers,
      inactiveStudents,
      avgPerformance,
      avgEngagement,
      totalClasses: statsData?.totalClasses || studentsData.totalClasses || 0,
      attendanceRate: avgPerformance,
      completionRate: statsData?.completionRate || 0,
      totalHours: statsData?.totalHoursCompleted || 0,
      averageRating: statsData?.averageRating || 0
    };
  }, [studentsData, statsData]);

  const handleStudentSelect = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'border-l-4 border-l-[#5e6ad2]';
      case 'Needs Attention': return 'border-l-4 border-l-[#f99325]';
      case 'Inactive': return 'border-l-4 border-l-red-500';
      default: return 'border-l-4 border-l-gray-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': 
        return <Badge className="bg-[#5e6ad2] hover:bg-[#5e6ad2]/90 text-white">Active</Badge>;
      case 'Needs Attention': 
        return <Badge className="bg-[#f99325] hover:bg-[#f99325]/90 text-white">Needs Attention</Badge>;
      case 'Inactive': 
        return <Badge className="bg-red-500 hover:bg-red-500/90 text-white">Inactive</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Convert student data for messaging component
  const messagingStudents = useMemo(() => {
    if (!studentsData?.students) return [];
    
    return studentsData.students.map(student => ({
      id: student.studentId,
      name: student.name,
      email: student.email || `${student.name.toLowerCase().replace(' ', '.')}@example.com`,
      subjects: student.subjects.map(s => s.name),
      attendance: student.attendance.percentage,
      assignments: `${student.assignments.completed}/${student.assignments.total}`,
      status: student.status.toLowerCase().replace(' ', '-'),
      lastActive: student.lastActivity,
      preferredPlatform: 'whatsapp' as const,
      responseRate: Math.floor(Math.random() * 40) + 60
    }));
  }, [studentsData]);

  const handleSendMessage = (messageData: any) => {
    console.log('Sending message:', messageData);
    // Here you would integrate with your messaging API
  };

  const handleMessageStudent = (studentId: string) => {
    const student = studentsData?.students?.find(s => s.studentId === studentId);
    if (student) {
      setSelectedStudents([studentId]);
      setShowMessageComposer(true);
    }
  };

  const handleBulkMessage = () => {
    if (selectedStudents.length > 0) {
      setShowMessageComposer(true);
    }
  };

  const handleInviteSuccess = (response: any) => {
    // Handle successful invitation
    console.log('Student invited successfully:', response);
    // You could refresh the students data here or show a success message
    // For now, we'll just close the modal
    setShowInviteModal(false);
  };

  if (loading || statsLoading || summaryLoading) {
    return (
      <div className="min-h-screen bg-[#ededf4] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading students data...</p>
        </div>
      </div>
    );
  }

  if (error || statsError || summaryError) {
    return (
      <div className="min-h-screen bg-[#ededf4] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading data: {error || statsError || summaryError}</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ededf4] p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#5e6ad2] to-[#abb4dd] rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Students Command Center
            </h1>
            <p className="text-gray-600 mt-2">
              Managing {studentsData?.totalStudents || 0} students across {metrics.totalClasses} classes with AI precision
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-[#5e6ad2] to-[#abb4dd] text-white px-4 py-2 text-sm">
            <Brain className="w-4 h-4 mr-2" />
            {metrics.priorityStudents} priority actions • {metrics.highPerformers} high performers
          </Badge>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Priority Students</p>
                <p className="text-2xl font-bold text-[#f99325]">{metrics.priorityStudents}</p>
                <p className="text-xs text-gray-500 mt-1">Need immediate attention</p>
              </div>
              <div className="w-12 h-12 bg-[#f99325]/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#f99325]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Class Overview</p>
                <p className="text-2xl font-bold text-[#5e6ad2]">{metrics.totalClasses}</p>
                <p className="text-xs text-gray-500 mt-1">{metrics.completionRate}% completion rate</p>
              </div>
              <div className="w-12 h-12 bg-[#5e6ad2]/10 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#5e6ad2]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Teaching Hours</p>
                <p className="text-2xl font-bold text-green-600">{metrics.totalHours}h</p>
                <p className="text-xs text-gray-500 mt-1">{metrics.averageRating}⭐ rating</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Score</p>
                <p className="text-2xl font-bold text-[#5e6ad2]">{metrics.avgEngagement}%</p>
                <p className="text-xs text-gray-500 mt-1">Weekly engagement</p>
              </div>
              <div className="w-12 h-12 bg-[#5e6ad2]/10 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#5e6ad2]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Navigation Tabs */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {classData.map((classItem) => (
              <Button
                key={classItem.name}
                variant={selectedClass === classItem.name ? "default" : "outline"}
                className={`${
                  selectedClass === classItem.name 
                    ? "bg-[#5e6ad2] hover:bg-[#5e6ad2]/90 text-white" 
                    : "hover:bg-[#5e6ad2]/10"
                } transition-all duration-200`}
                onClick={() => setSelectedClass(classItem.name)}
              >
                {classItem.name} ({classItem.count})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Controls Bar */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search students by name, email, or performance..."
                className="pl-10 bg-white/50 border-gray-200 focus:border-[#5e6ad2] focus:ring-[#5e6ad2]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["All", "Need Attention", "High Performers", "Inactive", "Recent Activity"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  className={`${
                    selectedFilter === filter 
                      ? "bg-[#5e6ad2] hover:bg-[#5e6ad2]/90 text-white" 
                      : "hover:bg-[#5e6ad2]/10"
                  } transition-all duration-200`}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                  {filter === "Need Attention" && ` (${metrics.priorityStudents})`}
                  {filter === "High Performers" && ` (${metrics.highPerformers})`}
                  {filter === "Inactive" && ` (${metrics.inactiveStudents})`}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Panel */}
      {selectedStudents.length > 0 && (
        <Card className="bg-gradient-to-r from-[#5e6ad2] to-[#abb4dd] text-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">{selectedStudents.length} students selected</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                  onClick={handleBulkMessage}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                  onClick={() => setShowAnalyticsDashboard(true)}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                  <Users className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={() => setSelectedStudents([])}
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStudents.map((student) => (
          <Card 
            key={student.studentId} 
            className={`bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ${getStatusColor(student.status)} overflow-hidden group`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedStudents.includes(student.studentId)}
                    onCheckedChange={(checked) => handleStudentSelect(student.studentId, checked as boolean)}
                    className="border-gray-300"
                  />
                  <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-[#5e6ad2] to-[#abb4dd] text-white font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    student.status === 'Active' ? 'bg-[#5e6ad2]' :
                    student.status === 'Needs Attention' ? 'bg-[#f99325]' :
                    student.status === 'Inactive' ? 'bg-red-500' : 'bg-green-500'
                  }`} />
                  <Sparkles className="w-4 h-4 text-[#5e6ad2]" />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.name.toLowerCase().replace(' ', '.')}@example.com</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {student.subjects.map((subject, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-white/50">
                      {subject.name}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Attendance</span>
                    <span className="font-medium">{student.attendance.percentage}%</span>
                  </div>
                  <Progress value={student.attendance.percentage} className="h-1.5 bg-gray-100">
                    <div 
                      className="h-full bg-gradient-to-r from-[#5e6ad2] to-[#abb4dd] transition-all duration-300"
                      style={{ width: `${student.attendance.percentage}%` }}
                    />
                  </Progress>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Assignments</span>
                  <span className="font-medium">{student.assignments.completed}/{student.assignments.total}</span>
                </div>

                <div className="flex justify-between items-center">
                  {getStatusBadge(student.status)}
                  <span className="text-xs text-gray-500">{student.lastActivity}</span>
                </div>

                {student.aiInsights && (
                  <div className="bg-gradient-to-r from-[#5e6ad2]/10 to-[#abb4dd]/10 rounded-lg p-3 mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-[#5e6ad2]" />
                      <span className="text-xs font-medium text-[#5e6ad2]">AI Insights</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {(() => {
                        // Handle both old format (array) and new format (object with insights array)
                        let insights = [];
                        if (Array.isArray(student.aiInsights)) {
                          insights = student.aiInsights;
                        } else if (student.aiInsights?.insights) {
                          insights = student.aiInsights.insights;
                        }
                        return insights.slice(0, 2).map((insight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-[#5e6ad2] rounded-full mt-2 flex-shrink-0" />
                            {insight}
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="flex-1 text-[#5e6ad2] hover:bg-[#5e6ad2]/10"
                    onClick={() => onViewProfile && onViewProfile(student.studentId)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="flex-1 text-[#f99325] hover:bg-[#f99325]/10"
                    onClick={() => handleMessageStudent(student.studentId)}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student Enrollment & Feedback Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grow Your Classes */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#5e6ad2] to-[#abb4dd] rounded-full flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-white" />
              </div>
              Grow Your Classes
            </CardTitle>
            <CardDescription>
              23 New inquiries • 89% Conversion rate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button 
                className="bg-[#5e6ad2] hover:bg-[#5e6ad2]/90 text-white"
                onClick={() => setShowInviteModal(true)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Invitations
              </Button>
              <Button variant="outline" className="hover:bg-[#5e6ad2]/10">
                <Share2 className="w-4 h-4 mr-2" />
                Share Class Link
              </Button>
              <Button variant="outline" className="hover:bg-[#5e6ad2]/10">
                <Users className="w-4 h-4 mr-2" />
                Student Referrals
              </Button>
            </div>
            <div className="bg-gradient-to-r from-[#5e6ad2]/10 to-[#abb4dd]/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-[#5e6ad2]" />
                <span className="text-sm font-medium text-[#5e6ad2]">AI Timing Insights</span>
              </div>
              <p className="text-sm text-gray-600">
                Best enrollment times: Tuesday 2-4 PM, Thursday 10 AM-12 PM
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Collect Social Proof */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#f99325] to-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              Collect Social Proof
            </CardTitle>
            <CardDescription>
              4.9 Average rating • 156 Total reviews
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button className="bg-[#f99325] hover:bg-[#f99325]/90 text-white">
                <Star className="w-4 h-4 mr-2" />
                Request Reviews
              </Button>
              <Button variant="outline" className="hover:bg-[#f99325]/10">
                <Award className="w-4 h-4 mr-2" />
                Import Reviews
              </Button>
              <Button variant="outline" className="hover:bg-[#f99325]/10">
                <Target className="w-4 h-4 mr-2" />
                Showcase Reviews
              </Button>
            </div>
            <div className="space-y-3">
              <div className="bg-white/50 rounded-lg p-3 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#f99325] text-[#f99325]" />
                    ))}
                  </div>
                  <Button size="sm" variant="ghost" className="text-[#f99325] h-6 px-2 text-xs">
                    Use for Marketing
                  </Button>
                </div>
                <p className="text-xs text-gray-600">
                  "Excellent teaching methods and very patient with students."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`transition-all duration-300 ${showAIAssistant ? 'mb-4' : ''}`}>
          {showAIAssistant && (
            <Card className="w-80 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#5e6ad2]" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <p className="font-medium text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Priority Alerts
                  </p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• David Kim has been inactive for 1 month</li>
                    <li>• Sophia Chen's engagement dropped 25%</li>
                    <li>• 3 students missed assignments this week</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-[#5e6ad2] flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Smart Recommendations
                  </p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• Send personalized check-in to 3 students</li>
                    <li>• Schedule parent calls for 2 priority cases</li>
                    <li>• Consider group study session for Chemistry</li>
                  </ul>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 bg-[#5e6ad2] hover:bg-[#5e6ad2]/90 text-white">
                    Take Action
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <Button
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#5e6ad2] to-[#abb4dd] hover:scale-110 transition-all duration-200 shadow-lg"
          onClick={() => setShowAIAssistant(!showAIAssistant)}
        >
          <Brain className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Message Composer Modal */}
      <SmartMessageComposer
        isOpen={showMessageComposer}
        onClose={() => {
          setShowMessageComposer(false);
          setSelectedStudents([]);
        }}
        selectedStudents={selectedStudents.map(id => messagingStudents.find(s => s.id === id)!).filter(Boolean)}
        allStudents={messagingStudents}
        onSendMessage={handleSendMessage}
      />

      {/* Analytics Dashboard Modal */}
      <MessageAnalyticsDashboard
        isOpen={showAnalyticsDashboard}
        onClose={() => setShowAnalyticsDashboard(false)}
      />

      {/* Invite Student Modal */}
      <InviteStudentModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        classes={enrichedClasses}
        onInviteSuccess={handleInviteSuccess}
      />
    </div>
  );
};

export default AIStudentsPage;