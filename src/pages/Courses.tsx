
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Book, User, Settings, LogOut, MessageSquare, Star, Sparkles, PieChart, Users, Target, Calendar, Award } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import KidatoMascot from "@/components/dashboard/KidatoMascot";

const Courses = () => {
  const [userName] = useState("John Doe");
  
  // Mock student courses data
  const studentCourses = [
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
          <Link 
            to="/learning-progress" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <PieChart className="mr-3 h-5 w-5" />
            Learning Goals
          </Link>
          <Link 
            to="/challenges" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <Target className="mr-3 h-5 w-5" />
            Quests & Challenges
          </Link>
          <Link 
            to="/group-work" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <Users className="mr-3 h-5 w-5" />
            Group Work
            <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">New</span>
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
              <Button className="bg-kidato-blue hover:bg-kidato-dark-blue">
                Browse More Classes
              </Button>
            </div>
            
            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {studentCourses.map((course) => (
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
                    <div className="text-sm text-gray-600">
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

            {/* Suggested Courses Section */}
            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Suggested for You</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border border-blue-100">
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg">Advanced Mathematics</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 mb-4">Take your math skills to the next level with this advanced course.</p>
                      <Button className="w-full bg-kidato-blue hover:bg-kidato-dark-blue">Learn More</Button>
                    </CardContent>
                  </Card>
                  <Card className="border border-blue-100">
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg">Physics Fundamentals</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 mb-4">Discover the basic principles of physics in this interactive course.</p>
                      <Button className="w-full bg-kidato-blue hover:bg-kidato-dark-blue">Learn More</Button>
                    </CardContent>
                  </Card>
                  <Card className="border border-blue-100">
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg">Introduction to Coding</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 mb-4">Begin your journey into programming with this beginner-friendly course.</p>
                      <Button className="w-full bg-kidato-blue hover:bg-kidato-dark-blue">Learn More</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Kidato AI Mascot */}
      <KidatoMascot />
    </div>
  );
}

export default Courses;
