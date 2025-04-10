import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  CheckCircle, 
  Filter, 
  MessageSquare, 
  Users, 
  Calendar, 
  ExternalLink, 
  Download,
  BookOpen,
  ArrowRight,
  UserRound
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Courses = () => {
  const [userName] = useState("John Doe");
  const [selectedTab, setSelectedTab] = useState("matching");
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Mock student courses data
  const enrolledCourses = [
    {
      id: "math101",
      title: "Mathematics Fundamentals",
      subject: "Mathematics",
      description: "Master essential math concepts for academic success and problem-solving skills.",
      progress: 68,
      nextClass: "Tuesday, 2:00 PM",
      dueDate: "April 20, 2025",
      members: 3
    },
    {
      id: "eng205",
      title: "Creative Writing Workshop",
      subject: "English",
      description: "Develop your creative writing skills through guided exercises and peer feedback.",
      progress: 42,
      nextClass: "Wednesday, 10:30 AM",
      dueDate: "May 15, 2025",
      members: 5
    },
    {
      id: "sci110",
      title: "Introduction to Biology",
      subject: "Science",
      description: "Explore the fundamentals of biology, from cells to ecosystems and everything in between.",
      progress: 75,
      nextClass: "Thursday, 1:15 PM",
      dueDate: "April 30, 2025",
      members: 4
    },
    {
      id: "art150",
      title: "Digital Art & Design",
      subject: "Art",
      description: "Learn digital art techniques using industry-standard software and design principles.",
      progress: 89,
      nextClass: "Monday, 3:45 PM",
      dueDate: "June 5, 2025",
      members: 6
    }
  ];

  // Mock teacher data
  const matchingTeachers = [
    {
      id: "teacher1",
      name: "Sarah Johnson",
      avatar: "SJ",
      subject: "Mathematics",
      rating: 4.8,
      description: "Experienced math teacher with 10+ years specializing in algebra and calculus. Uses interactive methods to make complex concepts easy to understand.",
      availability: "Weekdays afternoons"
    },
    {
      id: "teacher2",
      name: "Michael Rodriguez",
      avatar: "MR",
      subject: "Science",
      rating: 4.9,
      description: "Physics and chemistry expert with a talent for engaging experiments. Makes science come alive with real-world applications.",
      availability: "Evenings and weekends"
    },
    {
      id: "teacher3",
      name: "Emma Wilson",
      avatar: "EW",
      subject: "English",
      rating: 4.7,
      description: "Creative writing coach and literature enthusiast. Helps students develop their unique voice while mastering grammar and structure.",
      availability: "Monday, Wednesday, Friday"
    }
  ];

  // Updated recommended courses with social proof - added students array
  const recommendedCourses = [
    {
      id: "math202",
      title: "Advanced Mathematics",
      subject: "Mathematics",
      description: "Take your math skills to the next level with advanced concepts and problem-solving.",
      nextClass: "Monday, 1:00 PM",
      dueDate: "May 25, 2025",
      members: 3,
      matchingTeacher: "teacher1",
      students: [
        { name: "Tina Smith", avatar: "TS", shared: 2 },
        { name: "Alex Miller", avatar: "AM", shared: 1 },
        { name: "Emma Wong", avatar: "EW", shared: 3 }
      ]
    },
    {
      id: "phys101",
      title: "Physics Fundamentals",
      subject: "Science",
      description: "Discover the basic principles that govern the physical world around us.",
      nextClass: "Thursday, 11:30 AM",
      dueDate: "June 10, 2025",
      members: 4,
      matchingTeacher: "teacher2",
      students: [
        { name: "Kevin Parker", avatar: "KP", shared: 2 },
        { name: "Rachel Johnson", avatar: "RJ", shared: 1 },
        { name: "Emma Wong", avatar: "EW", shared: 1 }
      ]
    },
    {
      id: "code101",
      title: "Introduction to Coding",
      subject: "Technology",
      description: "Begin your coding journey with the basics of programming logic and syntax.",
      nextClass: "Friday, 2:15 PM",
      dueDate: "May 30, 2025",
      members: 5,
      matchingTeacher: "teacher3",
      students: [
        { name: "Tina Smith", avatar: "TS", shared: 1 },
        { name: "Kevin Parker", avatar: "KP", shared: 2 },
        { name: "Rachel Johnson", avatar: "RJ", shared: 1 }
      ]
    }
  ];
  
  const completedCourses = [
    {
      id: "hist101",
      title: "World History",
      subject: "History",
      description: "A comprehensive overview of major world events and their impact on society.",
      completedDate: "March 15, 2025",
      grade: "A"
    },
    {
      id: "chem101",
      title: "Chemistry Basics",
      subject: "Science",
      description: "An introduction to the fundamental principles of chemistry and laboratory practice.",
      completedDate: "January 22, 2025",
      grade: "B+"
    }
  ];
  
  // Generate avatar initials for demo
  const generateInitials = (index: number) => {
    const initials = ["JD", "TS", "EW", "AM", "KP", "RJ"];
    return initials[index % initials.length];
  };

  const getMatchingTeacher = (teacherId: string) => {
    return matchingTeachers.find(teacher => teacher.id === teacherId);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <StudentDashboardHeader userName={userName} />

        {/* Content */}
        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">My Courses</h1>
                <p className="text-gray-600">Manage all your learning experiences</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button className="bg-kidato-blue hover:bg-kidato-dark-blue">
                  Browse New Classes
                </Button>
              </div>
            </div>
            
            {/* Course Tabs - Updated Order and Tab Names */}
            <Tabs defaultValue="matching" className="mb-8" onValueChange={setSelectedTab}>
              <TabsList className="mb-6 bg-blue-50/50 p-1 border border-blue-100">
                <TabsTrigger value="matching" className="data-[state=active]:bg-white data-[state=active]:text-kidato-blue data-[state=active]:shadow-sm rounded-md">
                  Matching Classes & Teachers
                </TabsTrigger>
                <TabsTrigger value="enrolled" className="data-[state=active]:bg-white data-[state=active]:text-kidato-blue data-[state=active]:shadow-sm rounded-md">
                  Enrolled Classes
                </TabsTrigger>
              </TabsList>
              
              {/* Matching Classes & Teachers Cards - Enhanced with social proof */}
              <TabsContent value="matching">
                <div className="space-y-6 mb-8">
                  {recommendedCourses.map((course) => {
                    const matchingTeacher = getMatchingTeacher(course.matchingTeacher);
                    
                    return (
                      <div key={course.id} className="flex flex-col lg:flex-row gap-6">
                        {/* Class Card */}
                        <Card className="flex-1 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{course.title}</h3>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                  {course.subject}
                                </Badge>
                              </div>
                              <Button variant="ghost" className="rounded-full p-2 h-auto" size="icon">
                                <MessageSquare className="h-5 w-5 text-gray-500" />
                              </Button>
                            </div>

                            <p className="text-gray-600 mb-6">{course.description}</p>

                            <div className="flex flex-col space-y-3 mb-6">
                              <div className="flex items-center text-gray-600">
                                <Users className="h-4 w-4 mr-2 text-blue-500" />
                                <span>{course.members} Members</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                <span>{course.nextClass}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                <span>Due: {course.dueDate}</span>
                              </div>
                            </div>
                            
                            {/* Social Proof - Students you know taking this course */}
                            <div className="bg-blue-50 p-3 rounded-lg mb-6">
                              <div className="flex items-center mb-2">
                                <UserRound className="h-4 w-4 mr-2 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">Classmates taking this course</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {course.students.map((student, i) => (
                                  <div key={i} className="flex items-center bg-white rounded-full py-1 px-3 border border-blue-100">
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarFallback className="bg-blue-100 text-xs text-blue-700">{student.avatar}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs">{student.name}</span>
                                    <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 h-4 bg-blue-50">
                                      {student.shared} shared {student.shared > 1 ? "classes" : "class"}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <Button className="bg-kidato-blue hover:bg-kidato-dark-blue">
                                Enroll Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Arrow Connecting to Teacher */}
                        <div className="hidden lg:flex items-center justify-center">
                          <ArrowRight className="h-10 w-10 text-blue-400" />
                        </div>
                        
                        {/* Teacher Card */}
                        {matchingTeacher && (
                          <Card className="flex-1 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-white">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <Avatar className="h-14 w-14 border-2 border-blue-200 bg-blue-100">
                                  <AvatarFallback className="text-blue-700 font-medium">
                                    {matchingTeacher.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-xl font-bold text-gray-800">{matchingTeacher.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                      {matchingTeacher.subject}
                                    </Badge>
                                    <span className="text-amber-500 font-medium">★ {matchingTeacher.rating}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 my-4">{matchingTeacher.description}</p>
                              
                              <div className="flex items-center text-gray-600 mb-4">
                                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                <span>Available: {matchingTeacher.availability}</span>
                              </div>

                              <div className="flex justify-end space-x-2">
                                <Button variant="outline">View Profile</Button>
                                <Button className="bg-kidato-blue hover:bg-kidato-dark-blue">
                                  Message Teacher
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              
              {/* Enrolled Courses Table */}
              <TabsContent value="enrolled">
                <div className="mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                        Current Classes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[250px]">Course</TableHead>
                              <TableHead>Progress</TableHead>
                              <TableHead>Next Class</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead>Members</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {enrolledCourses.map((course) => (
                              <TableRow key={course.id}>
                                <TableCell className="font-medium">
                                  <div>
                                    <div className="font-semibold">{course.title}</div>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 mt-1">
                                      {course.subject}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="w-[100px]">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs text-gray-600"></span>
                                      <span className="text-xs font-medium">{course.progress}%</span>
                                    </div>
                                    <Progress value={course.progress} className="h-2" />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                                    <span className="text-sm">{course.nextClass}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
                                    <span className="text-sm">{course.dueDate}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex -space-x-2">
                                    {[...Array(3)].map((_, i) => (
                                      <Avatar key={i} className="border-2 border-white w-7 h-7 bg-blue-200">
                                        <AvatarFallback className="text-xs text-blue-700">
                                          {generateInitials(i)}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" className="h-8">Materials</Button>
                                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-8">
                                      Update Progress
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Completed Courses Table */}
                  <Card className="mt-8">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        Completed Classes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[250px]">Course</TableHead>
                              <TableHead>Completed Date</TableHead>
                              <TableHead>Grade</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {completedCourses.map((course) => (
                              <TableRow key={course.id}>
                                <TableCell className="font-medium">
                                  <div>
                                    <div className="font-semibold">{course.title}</div>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 mt-1">
                                      {course.subject}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />
                                    <span className="text-sm">{course.completedDate}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-200">
                                    {course.grade}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" className="h-8">
                                      <Download className="h-3.5 w-3.5 mr-1" />
                                      Certificate
                                    </Button>
                                    <Button size="sm" className="bg-kidato-blue hover:bg-kidato-dark-blue h-8">
                                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                      Review
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Advanced Course Filters */}
            {filterOpen && (
              <Card className="mb-8 border border-blue-100">
                <CardHeader className="bg-blue-50/50 pb-2">
                  <CardTitle className="text-lg font-medium">Filter Courses</CardTitle>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option value="">All Subjects</option>
                      <option value="math">Mathematics</option>
                      <option value="science">Science</option>
                      <option value="english">English</option>
                      <option value="art">Art</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Grade Level</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option value="">All Grades</option>
                      <option value="6">Grade 6</option>
                      <option value="7">Grade 7</option>
                      <option value="8">Grade 8</option>
                      <option value="9">Grade 9</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Course Type</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option value="">All Types</option>
                      <option value="academic">Academic</option>
                      <option value="extracurricular">Extracurricular</option>
                      <option value="enrichment">Enrichment</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Kidato AI Mascot */}
      <KidatoMascot />
    </div>
  );
}

export default Courses;
