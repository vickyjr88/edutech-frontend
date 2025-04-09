import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Book, User, Settings, LogOut, MessageSquare, Star, Sparkles, PieChart, Users, Target, Calendar, Award, Clock, CheckCircle, Filter } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import KidatoMascot from "@/components/dashboard/KidatoMascot";

const Courses = () => {
  const [userName] = useState("John Doe");
  const [selectedTab, setSelectedTab] = useState("enrolled");
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Mock student courses data
  const enrolledCourses = [
    {
      id: "math101",
      title: "Mathematics Fundamentals",
      teacher: "Dr. Sarah Johnson",
      progress: 68,
      nextClass: "Tuesday, 2:00 PM",
      image: "/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png"
    },
    {
      id: "eng205",
      title: "Creative Writing Workshop",
      teacher: "Prof. Michael Thompson",
      progress: 42,
      nextClass: "Wednesday, 10:30 AM",
      image: "/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png"
    },
    {
      id: "sci110",
      title: "Introduction to Biology",
      teacher: "Dr. Emma Rodriguez",
      progress: 75,
      nextClass: "Thursday, 1:15 PM",
      image: "/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png"
    },
    {
      id: "art150",
      title: "Digital Art & Design",
      teacher: "Ms. Olivia Chen",
      progress: 89,
      nextClass: "Monday, 3:45 PM",
      image: "/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png"
    }
  ];

  const recommendedCourses = [
    {
      id: "math202",
      title: "Advanced Mathematics",
      teacher: "Dr. Robert Miller",
      rating: 4.8,
      students: 324,
      image: "/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png"
    },
    {
      id: "phys101",
      title: "Physics Fundamentals",
      teacher: "Prof. Lisa Wang",
      rating: 4.7,
      students: 256,
      image: "/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png"
    },
    {
      id: "code101",
      title: "Introduction to Coding",
      teacher: "Mr. Alex Jackson",
      rating: 4.9,
      students: 412,
      image: "/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png"
    }
  ];
  
  const completedCourses = [
    {
      id: "hist101",
      title: "World History",
      teacher: "Dr. James Peterson",
      grade: "A",
      completedDate: "March 15, 2025",
      image: "/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png"
    },
    {
      id: "chem101",
      title: "Chemistry Basics",
      teacher: "Dr. Helen Garcia",
      grade: "B+",
      completedDate: "January 22, 2025",
      image: "/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Sidebar - Same as Dashboard */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-blue-100 shadow-md rounded-tr-xl rounded-br-xl mr-2 overflow-hidden">
        <div className="p-6">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png" 
              alt="Kidato Logo" 
              className="h-10"
            />
            <Sparkles className="h-4 w-4 ml-1 text-yellow-400" />
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          <h3 className="px-4 text-xs font-semibold uppercase text-gray-500 mb-2">Main</h3>
          <Link 
            to="/student-dashboard" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          
          <h3 className="px-4 mt-5 text-xs font-semibold uppercase text-gray-500 mb-2">Learning</h3>
          <Link 
            to="/courses" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm transition-all hover:shadow-md"
          >
            <Book className="mr-3 h-5 w-5" />
            My Courses
            <Star className="ml-auto h-4 w-4 text-yellow-400" />
          </Link>
          
          <h3 className="px-4 mt-5 text-xs font-semibold uppercase text-gray-500 mb-2">Communication</h3>
          <Link 
            to="/messaging" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <MessageSquare className="mr-3 h-5 w-5" />
            Messages
          </Link>
          <Link 
            to="/schedule" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <Calendar className="mr-3 h-5 w-5" />
            Schedule
          </Link>
          
          <h3 className="px-4 mt-5 text-xs font-semibold uppercase text-gray-500 mb-2">Account</h3>
          <Link 
            to="/profile" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <User className="mr-3 h-5 w-5" />
            Profile
          </Link>
          <Link 
            to="/achievements" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <Award className="mr-3 h-5 w-5" />
            Achievements
          </Link>
          <Link 
            to="/settings" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-blue-100">
          <Link to="/">
            <Button variant="ghost" className="w-full flex items-center justify-center rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>

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
            
            {/* Course Tabs */}
            <Tabs defaultValue="enrolled" className="mb-8" onValueChange={setSelectedTab}>
              <TabsList className="mb-6 bg-blue-50/50 p-1 border border-blue-100">
                <TabsTrigger value="enrolled" className="data-[state=active]:bg-white data-[state=active]:text-kidato-blue data-[state=active]:shadow-sm rounded-md">
                  Enrolled Classes
                </TabsTrigger>
                <TabsTrigger value="recommended" className="data-[state=active]:bg-white data-[state=active]:text-kidato-blue data-[state=active]:shadow-sm rounded-md">
                  Recommended for You
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-kidato-blue data-[state=active]:shadow-sm rounded-md">
                  Completed Classes
                </TabsTrigger>
              </TabsList>
              
              {/* Enrolled Courses */}
              <TabsContent value="enrolled">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {enrolledCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="h-36 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                        <img src={course.image} alt={course.title} className="h-16 mx-auto" />
                      </div>
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-lg font-medium">{course.title}</CardTitle>
                        <p className="text-sm text-gray-600">{course.teacher}</p>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div 
                              className="h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                          <p>Next Class: {course.nextClass}</p>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Resources
                          </Button>
                          <Button size="sm" className="flex-1 bg-kidato-blue hover:bg-kidato-dark-blue">
                            Continue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Recommended Courses */}
              <TabsContent value="recommended">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {recommendedCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="h-36 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
                        <img src={course.image} alt={course.title} className="h-16 mx-auto" />
                      </div>
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-lg font-medium">{course.title}</CardTitle>
                        <p className="text-sm text-gray-600">{course.teacher}</p>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 stroke-yellow-400" />
                            {course.rating}
                          </div>
                          <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {course.students} students
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button className="w-full bg-kidato-blue hover:bg-kidato-dark-blue">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Completed Courses */}
              <TabsContent value="completed">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {completedCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="h-36 bg-gradient-to-r from-green-50 to-blue-50 flex items-center justify-center relative">
                        <img src={course.image} alt={course.title} className="h-16 mx-auto" />
                        <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      </div>
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-lg font-medium">{course.title}</CardTitle>
                        <p className="text-sm text-gray-600">{course.teacher}</p>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-4">
                          <span className="text-sm text-gray-600">Completed: {course.completedDate}</span>
                          <span className="font-medium text-green-600">Grade: {course.grade}</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            View Certificate
                          </Button>
                          <Button size="sm" className="flex-1 bg-kidato-blue hover:bg-kidato-dark-blue">
                            Review Course
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Advanced Course Filters - Only shows when filter button is clicked */}
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
