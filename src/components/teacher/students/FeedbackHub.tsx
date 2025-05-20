import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, Mail, BarChart, Search, Star, Filter, ChevronDown, 
  RefreshCw, Users, UserPlus, MessageCircle, Phone,
  School, Send, User, Clock, X, Info, CheckCircle2
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Feedback {
  id: string;
  recipientName: string;
  recipientType: 'student' | 'parent' | 'teacher';
  recipientEmail: string;
  status: 'pending' | 'completed' | 'expired';
  requestDate: string;
  completedDate?: string;
  rating?: number;
  comment?: string;
  avatar?: string;
  associated?: {
    studentName?: string;
    schoolName?: string;
  };
}

// Sample feedback data for each category
const studentFeedback: Feedback[] = [
  {
    id: "sf1",
    recipientName: "Emma Johnson",
    recipientType: "student",
    recipientEmail: "emma.j@example.com",
    status: "completed",
    requestDate: "2024-12-01",
    completedDate: "2024-12-03",
    rating: 5,
    comment: "Ms. García is an amazing teacher! She makes math easy to understand and always helps when I'm stuck.",
    avatar: "/lovable-uploads/student-emma.png"
  },
  {
    id: "sf2",
    recipientName: "Alex Mboya",
    recipientType: "student",
    recipientEmail: "alex.m@example.com",
    status: "pending",
    requestDate: "2024-12-05",
    avatar: "/lovable-uploads/student-alex.png"
  },
  {
    id: "sf3",
    recipientName: "Grace Odhiambo",
    recipientType: "student",
    recipientEmail: "grace.o@example.com",
    status: "completed",
    requestDate: "2024-11-20",
    completedDate: "2024-11-22",
    rating: 4,
    comment: "I really enjoy your chemistry classes. The experiments make the concepts clear!"
  },
  {
    id: "sf4",
    recipientName: "Daniel Kamau",
    recipientType: "student",
    recipientEmail: "daniel.k@example.com",
    status: "expired",
    requestDate: "2024-11-10",
    avatar: "/lovable-uploads/student-daniel.png"
  },
  {
    id: "sf5",
    recipientName: "Sophia Chen",
    recipientType: "student",
    recipientEmail: "sophia.c@example.com",
    status: "pending",
    requestDate: "2024-12-08"
  }
];

const parentFeedback: Feedback[] = [
  {
    id: "pf1",
    recipientName: "David Johnson",
    recipientType: "parent",
    recipientEmail: "david.j@example.com",
    status: "completed",
    requestDate: "2024-12-02",
    completedDate: "2024-12-04",
    rating: 5,
    comment: "We've seen amazing improvement in Emma's math skills. Your teaching methods are excellent!",
    associated: {
      studentName: "Emma Johnson"
    }
  },
  {
    id: "pf2",
    recipientName: "Lidia Mboya",
    recipientType: "parent",
    recipientEmail: "lidia.m@example.com",
    status: "pending",
    requestDate: "2024-12-05",
    associated: {
      studentName: "Alex Mboya"
    }
  },
  {
    id: "pf3",
    recipientName: "James Kamau",
    recipientType: "parent",
    recipientEmail: "james.k@example.com",
    status: "expired",
    requestDate: "2024-11-10",
    associated: {
      studentName: "Daniel Kamau"
    }
  }
];

const teacherFeedback: Feedback[] = [
  {
    id: "tf1",
    recipientName: "Dr. Ahmed Khalid",
    recipientType: "teacher",
    recipientEmail: "ahmed.k@littleacademy.edu",
    status: "completed",
    requestDate: "2024-11-25",
    completedDate: "2024-11-27",
    rating: 5,
    comment: "Your teaching skills are exceptional. The students speak highly of your methods, and I've observed significant improvement in their grades.",
    associated: {
      schoolName: "Little Academy"
    }
  },
  {
    id: "tf2",
    recipientName: "Mary Wanjiku",
    recipientType: "teacher",
    recipientEmail: "mary.w@centralschool.edu",
    status: "pending",
    requestDate: "2024-12-03",
    associated: {
      schoolName: "Central School"
    }
  },
  {
    id: "tf3",
    recipientName: "Joseph Mwangi",
    recipientType: "teacher",
    recipientEmail: "joseph.m@brookside.edu",
    status: "pending",
    requestDate: "2024-12-01",
    associated: {
      schoolName: "Brookside Academy"
    }
  },
  {
    id: "tf4",
    recipientName: "Patricia Wambui",
    recipientType: "teacher",
    recipientEmail: "patricia.w@eastside.edu",
    status: "expired",
    requestDate: "2024-11-12",
    associated: {
      schoolName: "Eastside High"
    }
  },
  {
    id: "tf5",
    recipientName: "Stephen Ngugi",
    recipientType: "teacher",
    recipientEmail: "stephen.n@sunriseschool.edu",
    status: "completed",
    requestDate: "2024-11-15",
    completedDate: "2024-11-20",
    rating: 4,
    comment: "You have a genuine talent for making complex subjects accessible to students. Your use of real-world examples is particularly effective.",
    associated: {
      schoolName: "Sunrise School"
    }
  }
];

interface FeedbackHubProps {
  onRequestReview: (id: string, type: 'student' | 'parent' | 'teacher') => void;
}

const FeedbackHub: React.FC<FeedbackHubProps> = ({ onRequestReview }) => {
  const [activeTab, setActiveTab] = useState("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Filter feedback based on search query and status filter
  const getFilteredFeedback = (feedbackList: Feedback[]) => {
    return feedbackList.filter(feedback => {
      // Search filter
      const matchesSearch = !searchQuery || 
        feedback.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (feedback.associated?.studentName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (feedback.associated?.schoolName?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Status filter
      const matchesStatus = !statusFilter || feedback.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  // Get filtered feedback for current tab
  const filteredFeedback = {
    students: getFilteredFeedback(studentFeedback),
    parents: getFilteredFeedback(parentFeedback),
    teachers: getFilteredFeedback(teacherFeedback)
  };

  // Calculate statistics
  const calculateStats = (feedbackList: Feedback[]) => {
    const total = feedbackList.length;
    const completed = feedbackList.filter(f => f.status === 'completed').length;
    const pending = feedbackList.filter(f => f.status === 'pending').length;
    const expired = feedbackList.filter(f => f.status === 'expired').length;
    
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    
    const averageRating = feedbackList
      .filter(f => f.rating !== undefined)
      .reduce((sum, f) => sum + (f.rating || 0), 0) / 
      (feedbackList.filter(f => f.rating !== undefined).length || 1);
    
    return {
      total,
      completed,
      pending,
      expired,
      completionRate,
      averageRating: averageRating || 0
    };
  };

  const stats = {
    students: calculateStats(studentFeedback),
    parents: calculateStats(parentFeedback),
    teachers: calculateStats(teacherFeedback),
    overall: calculateStats([...studentFeedback, ...parentFeedback, ...teacherFeedback])
  };

  // Function to get appropriate icon for each feedback type
  const getTypeIcon = (type: 'student' | 'parent' | 'teacher') => {
    switch (type) {
      case 'student':
        return <User className="h-4 w-4" />;
      case 'parent':
        return <Users className="h-4 w-4" />;
      case 'teacher':
        return <School className="h-4 w-4" />;
    }
  };

  // Function to handle resending feedback request
  const handleResendRequest = (id: string) => {
    console.log(`Resending request for ${id}`);
    // Implementation would go here
  };

  // Helper function to render feedback items
  const renderFeedbackList = (feedbackList: Feedback[]) => {
    if (feedbackList.length === 0) {
      return (
        <div className="text-center py-8">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1">No Feedback Requests Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {searchQuery || statusFilter 
              ? "No feedback requests match your current filters. Try adjusting your search or filters."
              : "You haven't requested any feedback yet."}
          </p>
          <Button 
            onClick={() => onRequestReview('bulk', activeTab === 'students' ? 'student' : activeTab === 'parents' ? 'parent' : 'teacher')}
            className="flex items-center gap-2 mx-auto"
          >
            <Star className="h-4 w-4" />
            Request New Feedback
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {feedbackList.map((feedback) => (
          <Card key={feedback.id} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Recipient info */}
              <div className="flex-1 p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={feedback.avatar} />
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                      {feedback.recipientName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{feedback.recipientName}</h3>
                      <div>
                        <Badge 
                          variant="outline" 
                          className="text-xs flex items-center gap-1"
                        >
                          {getTypeIcon(feedback.recipientType)}
                          {feedback.recipientType.charAt(0).toUpperCase() + feedback.recipientType.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-1">{feedback.recipientEmail}</p>
                    
                    {feedback.associated && (
                      <div className="text-xs text-gray-500 mt-1">
                        {feedback.associated.studentName && (
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            Student: {feedback.associated.studentName}
                          </div>
                        )}
                        {feedback.associated.schoolName && (
                          <div className="flex items-center">
                            <School className="h-3 w-3 mr-1" />
                            School: {feedback.associated.schoolName}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Request status and dates */}
                    <div className="flex flex-wrap gap-4 mt-2 text-xs">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                        <span className="text-gray-500">Requested: {feedback.requestDate}</span>
                      </div>
                      
                      {feedback.completedDate && (
                        <div className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                          <span className="text-gray-500">Completed: {feedback.completedDate}</span>
                        </div>
                      )}
                      
                      {/* Status badge */}
                      <div>
                        {feedback.status === 'completed' && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Completed
                          </Badge>
                        )}
                        {feedback.status === 'pending' && (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            Pending
                          </Badge>
                        )}
                        {feedback.status === 'expired' && (
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                            Expired
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Feedback comment and rating */}
                    {feedback.status === 'completed' && feedback.comment && (
                      <div className="mt-3 bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center mb-1">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3.5 w-3.5 ${i < (feedback.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs ml-2 text-gray-500">
                            {feedback.rating}/5
                          </span>
                        </div>
                        <p className="text-sm italic">"{feedback.comment}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="bg-gray-50 p-4 flex justify-between sm:flex-col sm:justify-center sm:w-24">
                {feedback.status === 'pending' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-blue-600 w-full"
                          onClick={() => handleResendRequest(feedback.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span className="sr-only sm:not-sr-only sm:ml-2">Remind</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Send a reminder</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {feedback.status === 'expired' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-amber-600 w-full"
                          onClick={() => handleResendRequest(feedback.id)}
                        >
                          <Send className="h-4 w-4" />
                          <span className="sr-only sm:not-sr-only sm:ml-2">Resend</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Resend request</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-purple-600 w-full"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:ml-2">Message</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Send a message</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {feedback.recipientType === 'parent' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-green-600 w-full"
                        >
                          <Phone className="h-4 w-4" />
                          <span className="sr-only sm:not-sr-only sm:ml-2">Call</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Call parent</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Dashboard stats */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
          <CardTitle className="text-xl">Feedback Dashboard</CardTitle>
          <CardDescription>
            Track and manage review requests from students, parents, and teachers
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Overall stats */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-gray-500" />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span className="font-medium">{Math.round(stats.overall.completionRate)}%</span>
                    </div>
                    <Progress value={stats.overall.completionRate} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 rounded-md p-2">
                      <div className="text-xl font-semibold">{stats.overall.total}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="bg-green-50 rounded-md p-2">
                      <div className="text-xl font-semibold text-green-600">{stats.overall.completed}</div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                    <div className="bg-blue-50 rounded-md p-2">
                      <div className="text-xl font-semibold text-blue-600">{stats.overall.pending}</div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="flex items-center mt-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${i < Math.round(stats.overall.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm ml-2">
                        {stats.overall.averageRating.toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Students stats */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-500" />
                  Student Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span className="font-medium">{Math.round(stats.students.completionRate)}%</span>
                    </div>
                    <Progress value={stats.students.completionRate} className="h-2 bg-blue-100" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 rounded-md p-2">
                      <div className="text-xl font-semibold">{stats.students.total}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="bg-green-50 rounded-md p-2">
                      <div className="text-xl font-semibold text-green-600">{stats.students.completed}</div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                    <div className="bg-amber-50 rounded-md p-2">
                      <div className="text-xl font-semibold text-amber-600">{stats.students.pending}</div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => {
                      setActiveTab("students");
                      onRequestReview('bulk', 'student');
                    }}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Request Student Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Parents stats */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5 text-green-500" />
                  Parent Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span className="font-medium">{Math.round(stats.parents.completionRate)}%</span>
                    </div>
                    <Progress value={stats.parents.completionRate} className="h-2 bg-green-100" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-green-50 rounded-md p-2">
                      <div className="text-xl font-semibold">{stats.parents.total}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="bg-green-50 rounded-md p-2">
                      <div className="text-xl font-semibold text-green-600">{stats.parents.completed}</div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                    <div className="bg-amber-50 rounded-md p-2">
                      <div className="text-xl font-semibold text-amber-600">{stats.parents.pending}</div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => {
                      setActiveTab("parents");
                      onRequestReview('bulk', 'parent');
                    }}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Request Parent Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Teachers stats */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <School className="mr-2 h-5 w-5 text-purple-500" />
                  Teacher Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span className="font-medium">{Math.round(stats.teachers.completionRate)}%</span>
                    </div>
                    <Progress value={stats.teachers.completionRate} className="h-2 bg-purple-100" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-purple-50 rounded-md p-2">
                      <div className="text-xl font-semibold">{stats.teachers.total}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="bg-green-50 rounded-md p-2">
                      <div className="text-xl font-semibold text-green-600">{stats.teachers.completed}</div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                    <div className="bg-amber-50 rounded-md p-2">
                      <div className="text-xl font-semibold text-amber-600">{stats.teachers.pending}</div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => {
                      setActiveTab("teachers");
                      onRequestReview('bulk', 'teacher');
                    }}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Request Teacher Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* Feedback tabs */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Review Requests</CardTitle>
              <CardDescription>
                Manage and track feedback requests from different sources
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="default" 
                className="flex items-center"
                onClick={() => onRequestReview('bulk', activeTab === 'students' ? 'student' : activeTab === 'parents' ? 'parent' : 'teacher')}
              >
                <Star className="mr-2 h-4 w-4" />
                Request New Reviews
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="students" className="flex items-center justify-center gap-2">
                <User className="h-4 w-4" />
                <span>Students</span>
                <Badge variant="secondary" className="ml-1">
                  {studentFeedback.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="parents" className="flex items-center justify-center gap-2">
                <Users className="h-4 w-4" />
                <span>Parents</span>
                <Badge variant="secondary" className="ml-1">
                  {parentFeedback.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="teachers" className="flex items-center justify-center gap-2">
                <School className="h-4 w-4" />
                <span>Teachers</span>
                <Badge variant="secondary" className="ml-1">
                  {teacherFeedback.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="pt-6">
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or school"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select 
                  value={statusFilter || "all"} 
                  onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Tabs content */}
            <TabsContent value="students" className="mt-0">
              {renderFeedbackList(filteredFeedback.students)}
            </TabsContent>
            
            <TabsContent value="parents" className="mt-0">
              {renderFeedbackList(filteredFeedback.parents)}
            </TabsContent>
            
            <TabsContent value="teachers" className="mt-0">
              {renderFeedbackList(filteredFeedback.teachers)}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
      
      {/* Tip Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-100 p-2">
              <Info className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">How Reviews Help Your Profile</h3>
              <p className="text-blue-700 text-sm mt-1">
                Getting reviews from students, parents, and fellow teachers significantly improves your visibility on Kidato. 
                Teachers with 5+ reviews are <span className="font-medium">4x more likely</span> to get new student enrollments.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <p className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-700">Higher Search Rankings</p>
                <p className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-700">More Student Enrollments</p>
                <p className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-700">Showcased on Homepage</p>
                <p className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-700">Increased Credibility</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Calendar icon component
const Calendar = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export default FeedbackHub;