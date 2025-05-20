import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, UserPlus, Mail, Award, Filter, ChevronDown, Star, 
  MessageCircle, BarChart, Check, Clock, X, Users, User, 
  BookText, Send, RefreshCw, Bell, PhoneCall, Eye
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import EnrollStudentsPage from "@/components/teacher/enrollment/EnrollStudentsPage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RequestReviewModal from "./RequestReviewModal";
import FeedbackHub from "./FeedbackHub";

// Types for student data
interface Student {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
  classes: string[];
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'waitlisted';
  lastActivity?: string;
  performance?: {
    assignments: number;
    assignmentsCompleted: number;
    attendance: number;
    averageGrade?: number;
  };
  parent?: {
    name: string;
    email: string;
    phone?: string;
  };
}

// Mock student data
const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Emma Johnson",
    avatar: "/lovable-uploads/student-emma.png",
    email: "emma.j@example.com",
    phone: "+254 712 345 678",
    classes: ["Mathematics Grade A", "Physics"],
    enrollmentDate: "2024-12-01",
    status: "active",
    lastActivity: "2 hours ago",
    performance: {
      assignments: 15,
      assignmentsCompleted: 14,
      attendance: 95,
      averageGrade: 88
    },
    parent: {
      name: "David Johnson",
      email: "david.j@example.com",
      phone: "+254 723 456 789"
    }
  },
  {
    id: "s2",
    name: "Alex Mboya",
    avatar: "/lovable-uploads/student-alex.png",
    email: "alex.m@example.com",
    classes: ["Chemistry", "Biology"],
    enrollmentDate: "2024-12-05",
    status: "active",
    lastActivity: "1 day ago",
    performance: {
      assignments: 12,
      assignmentsCompleted: 10,
      attendance: 90,
      averageGrade: 82
    },
    parent: {
      name: "Lidia Mboya",
      email: "lidia.m@example.com"
    }
  },
  {
    id: "s3",
    name: "Sophia Chen",
    email: "sophia.c@example.com",
    phone: "+254 734 567 890",
    classes: ["English Literature", "History"],
    enrollmentDate: "2024-11-15",
    status: "inactive",
    lastActivity: "2 weeks ago",
    performance: {
      assignments: 14,
      assignmentsCompleted: 8,
      attendance: 70
    }
  },
  {
    id: "s4",
    name: "Daniel Kamau",
    avatar: "/lovable-uploads/student-daniel.png",
    email: "daniel.k@example.com",
    classes: ["Mathematics Grade A"],
    enrollmentDate: "2024-11-28",
    status: "waitlisted",
    parent: {
      name: "James Kamau",
      email: "james.k@example.com",
      phone: "+254 745 678 901"
    }
  },
  {
    id: "s5",
    name: "Grace Odhiambo",
    email: "grace.o@example.com",
    classes: ["Physics", "Chemistry"],
    enrollmentDate: "2024-11-20",
    status: "active",
    lastActivity: "3 days ago",
    performance: {
      assignments: 16,
      assignmentsCompleted: 16,
      attendance: 98,
      averageGrade: 94
    }
  }
];

interface StudentViewProps {
  onViewProfile?: (studentId: string) => void;
  onEnrollStudents: () => void;
}

const StudentView: React.FC<StudentViewProps> = ({ 
  onViewProfile, 
  onEnrollStudents 
}) => {
  const [activeTab, setActiveTab] = useState("enrolled");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [classFilter, setClassFilter] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewTarget, setSelectedReviewTarget] = useState<'student' | 'parent' | 'teacher' | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Filter students based on search query and filters
  const filteredStudents = mockStudents.filter(student => {
    // Search query filter
    const matchesSearch = !searchQuery || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = !statusFilter || student.status === statusFilter;
    
    // Class filter
    const matchesClass = !classFilter || student.classes.includes(classFilter);
    
    return matchesSearch && matchesStatus && matchesClass;
  });

  // Extract all unique classes for the filter dropdown
  const allClasses = Array.from(
    new Set(mockStudents.flatMap(student => student.classes))
  );

  // Handle requesting a review
  const handleRequestReview = (studentId: string, targetType: 'student' | 'parent' | 'teacher') => {
    setSelectedStudentId(studentId);
    setSelectedReviewTarget(targetType);
    setShowReviewModal(true);
  };

  const selectedStudent = selectedStudentId 
    ? mockStudents.find(s => s.id === selectedStudentId) 
    : null;

  return (
    <div className="space-y-6">
      {/* Tabs navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="enrolled">
            <Users className="mr-2 h-4 w-4" />
            Enrolled Students
          </TabsTrigger>
          <TabsTrigger value="feedbackHub">
            <MessageCircle className="mr-2 h-4 w-4" />
            Feedback Hub
          </TabsTrigger>
          <TabsTrigger value="invite">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite & Enroll
          </TabsTrigger>
        </TabsList>
        
        {/* Enrolled Students Tab */}
        <TabsContent value="enrolled" className="space-y-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Students Overview</CardTitle>
                  <CardDescription>
                    Manage your enrolled students and their progress
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center"
                    onClick={onEnrollStudents}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Enroll Students
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center"
                    onClick={() => handleRequestReview('bulk', 'student')}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Request Reviews
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              {/* Search and filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students by name or email"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="min-w-32">
                        <Filter className="mr-2 h-4 w-4" />
                        Status
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                        All Students
                        {!statusFilter && <Check className="ml-2 h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                        Active
                        {statusFilter === "active" && <Check className="ml-2 h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                        Inactive
                        {statusFilter === "inactive" && <Check className="ml-2 h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("waitlisted")}>
                        Waitlisted
                        {statusFilter === "waitlisted" && <Check className="ml-2 h-4 w-4" />}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="min-w-32">
                        <BookText className="mr-2 h-4 w-4" />
                        Class
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Filter by Class</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setClassFilter(null)}>
                        All Classes
                        {!classFilter && <Check className="ml-2 h-4 w-4" />}
                      </DropdownMenuItem>
                      {allClasses.map(className => (
                        <DropdownMenuItem key={className} onClick={() => setClassFilter(className)}>
                          {className}
                          {classFilter === className && <Check className="ml-2 h-4 w-4" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Students list */}
              {filteredStudents.length > 0 ? (
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <Card key={student.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        {/* Student info */}
                        <div className="flex-1 p-4 flex flex-col md:flex-row gap-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12 border">
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback className="bg-gray-100 text-gray-600">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-lg">{student.name}</h3>
                              <p className="text-sm text-gray-500">{student.email}</p>
                              {student.status === 'active' && (
                                <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                              )}
                              {student.status === 'inactive' && (
                                <Badge className="mt-1 bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>
                              )}
                              {student.status === 'waitlisted' && (
                                <Badge className="mt-1 bg-amber-100 text-amber-700 hover:bg-amber-100">Waitlisted</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="md:border-l md:pl-4 flex-1 space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                              <div className="md:w-1/3">
                                <span className="text-xs text-gray-500">Classes:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {student.classes.map(className => (
                                    <Badge key={className} variant="outline" className="text-xs">
                                      {className}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              {student.performance && (
                                <>
                                  <div className="md:w-1/3">
                                    <span className="text-xs text-gray-500">Attendance:</span>
                                    <div className="mt-1 flex items-center gap-2">
                                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-blue-500 rounded-full" 
                                          style={{ width: `${student.performance.attendance}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-xs font-medium">{student.performance.attendance}%</span>
                                    </div>
                                  </div>
                                  
                                  <div className="md:w-1/3">
                                    <span className="text-xs text-gray-500">Assignments:</span>
                                    <div className="mt-1 flex items-center gap-2">
                                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-green-500 rounded-full" 
                                          style={{ width: `${(student.performance.assignmentsCompleted / student.performance.assignments) * 100}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-xs font-medium">
                                        {student.performance.assignmentsCompleted}/{student.performance.assignments}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 text-sm">
                              {student.lastActivity && (
                                <span className="text-gray-500 flex items-center">
                                  <Clock className="mr-1 h-3 w-3" /> Last active: {student.lastActivity}
                                </span>
                              )}
                              <span className="text-gray-500 flex items-center">
                                <Calendar className="mr-1 h-3 w-3" /> Enrolled: {student.enrollmentDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="bg-gray-50 p-4 flex flex-row md:flex-col justify-end md:justify-center items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-blue-700 flex items-center"
                            onClick={() => onViewProfile && onViewProfile(student.id)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            <span className="hidden md:inline">View</span>
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-purple-700 flex items-center"
                            onClick={() => handleRequestReview(student.id, 'student')}
                          >
                            <Star className="mr-1 h-4 w-4" />
                            <span className="hidden md:inline">Review</span>
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-green-700 flex items-center"
                          >
                            <MessageCircle className="mr-1 h-4 w-4" />
                            <span className="hidden md:inline">Message</span>
                          </Button>
                          
                          {student.parent && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-amber-700 flex items-center"
                              onClick={() => handleRequestReview(student.id, 'parent')}
                            >
                              <Users className="mr-1 h-4 w-4" />
                              <span className="hidden md:inline">Parent</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-dashed p-12 text-center">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Students Found</h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                    {searchQuery || statusFilter || classFilter 
                      ? "No students match your current filters. Try adjusting your search or filters."
                      : "You haven't enrolled any students yet. Start enrolling students to your classes."}
                  </p>
                  <Button onClick={onEnrollStudents} className="flex items-center gap-2 mx-auto">
                    <UserPlus className="h-4 w-4" />
                    Enroll Your First Student
                  </Button>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="border-t bg-gray-50 px-6 py-4">
              <div className="flex flex-col md:flex-row items-center justify-between w-full">
                <div className="text-sm text-gray-500 mb-4 md:mb-0">
                  {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
                </div>
                <div className="flex gap-2">
                  <Select value="20">
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="20" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Feedback Hub Tab */}
        <TabsContent value="feedbackHub">
          <FeedbackHub onRequestReview={handleRequestReview} />
        </TabsContent>
        
        {/* Invite & Enroll Tab */}
        <TabsContent value="invite">
          <EnrollStudentsPage />
        </TabsContent>
      </Tabs>
      
      {/* Review Request Modal */}
      {showReviewModal && selectedReviewTarget && (
        <RequestReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          targetType={selectedReviewTarget}
          student={selectedStudentId === 'bulk' ? undefined : selectedStudent}
          isBulkRequest={selectedStudentId === 'bulk'}
        />
      )}
    </div>
  );
};

// Helper component for the calendar icon
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

export default StudentView;