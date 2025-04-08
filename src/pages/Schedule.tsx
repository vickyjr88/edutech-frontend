
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Book, User, Settings, LogOut, MessageSquare, Star, Sparkles, PieChart, Users, Target, Calendar, Award, Clock, Video, ArrowRight } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import { Badge } from "@/components/ui/badge";

const Schedule = () => {
  const [userName] = useState("John Doe");
  const [activeDay, setActiveDay] = useState("today");
  
  // Mock schedule data
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const todayClasses = [
    {
      id: 1,
      subject: "Mathematics",
      topic: "Algebra: Equations",
      time: "09:00 - 10:30",
      teacher: "Mrs. Johnson",
      location: "Virtual Classroom",
      type: "live",
      color: "blue"
    },
    {
      id: 2,
      subject: "Science",
      topic: "Physics: Forces and Motion",
      time: "11:00 - 12:30",
      teacher: "Mr. Richards",
      location: "Virtual Classroom",
      type: "live",
      color: "purple"
    },
    {
      id: 3,
      subject: "Coding",
      topic: "Introduction to JavaScript",
      time: "14:00 - 15:30",
      teacher: "Ms. Lee",
      location: "Self-paced",
      type: "recorded",
      color: "green"
    }
  ];
  
  const tomorrowClasses = [
    {
      id: 4,
      subject: "Language Arts",
      topic: "Essay Writing Workshop",
      time: "10:00 - 11:30",
      teacher: "Mr. Peterson",
      location: "Virtual Classroom",
      type: "live",
      color: "pink"
    },
    {
      id: 5, 
      subject: "Science",
      topic: "Chemistry: Elements and Compounds",
      time: "13:00 - 14:30",
      teacher: "Mrs. Chen",
      location: "Virtual Classroom",
      type: "live",
      color: "purple"
    }
  ];
  
  // Function to get badge color class
  const getBadgeColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      green: "bg-green-100 text-green-600",
      indigo: "bg-indigo-100 text-indigo-600",
      pink: "bg-pink-100 text-pink-600",
      amber: "bg-amber-100 text-amber-600",
    };
    return colorMap[color] || "bg-gray-100 text-gray-600";
  };

  // Function to render class schedule for a specific day
  const renderSchedule = (day: string) => {
    const classes = day === "today" ? todayClasses : tomorrowClasses;
    
    return (
      <div className="space-y-4">
        {classes.map(classItem => (
          <div key={classItem.id} className="flex items-center bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className={`w-2 self-stretch bg-${classItem.color}-500`}></div>
            <div className="p-4 flex-grow">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-800">{classItem.subject}</h3>
                  <Badge className={getBadgeColorClass(classItem.color)}>
                    {classItem.type === "live" ? "Live" : "Recorded"}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {classItem.time}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700">{classItem.topic}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  {classItem.teacher} • {classItem.location}
                </p>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 hover:text-blue-800 p-0">
                  {classItem.type === "live" ? "Join Class" : "Watch Recording"}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

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
            <Home className="mr-3 h-5 w-5 text-blue-600" />
            Dashboard
          </Link>
          
          <h3 className="px-4 mt-5 text-xs font-semibold uppercase text-gray-500 mb-2">Learning</h3>
          <Link 
            to="/courses" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <Book className="mr-3 h-5 w-5 text-purple-600" />
            My Courses
          </Link>
          <Link 
            to="/learning-progress" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <PieChart className="mr-3 h-5 w-5 text-cyan-600" />
            Learning Goals
          </Link>
          <Link 
            to="/challenges" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <Target className="mr-3 h-5 w-5 text-amber-500" />
            Quests & Challenges
          </Link>
          <Link 
            to="/group-work" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <Users className="mr-3 h-5 w-5 text-green-600" />
            Group Work
            <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">New</span>
          </Link>
          
          <h3 className="px-4 mt-5 text-xs font-semibold uppercase text-gray-500 mb-2">Communication</h3>
          <Link 
            to="/messaging" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <MessageSquare className="mr-3 h-5 w-5 text-rose-500" />
            Messages
          </Link>
          <Link 
            to="/schedule" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm transition-all hover:shadow-md"
          >
            <Calendar className="mr-3 h-5 w-5 text-indigo-600" />
            Schedule
            <Star className="ml-auto h-4 w-4 text-yellow-400" />
          </Link>
          
          <h3 className="px-4 mt-5 text-xs font-semibold uppercase text-gray-500 mb-2">Account</h3>
          <Link 
            to="/profile" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <User className="mr-3 h-5 w-5 text-sky-600" />
            Profile
          </Link>
          <Link 
            to="/achievements" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <Award className="mr-3 h-5 w-5 text-yellow-600" />
            Achievements
          </Link>
          <Link 
            to="/settings" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <Settings className="mr-3 h-5 w-5 text-slate-600" />
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
              <h1 className="text-2xl font-bold text-gray-800">Class Schedule</h1>
              <Button variant="outline" className="rounded-xl border-blue-200 text-blue-600">
                <Video className="h-4 w-4 mr-2" />
                View Recordings
              </Button>
            </div>
            
            {/* Day Selector */}
            <div className="flex mb-6 space-x-2 overflow-x-auto pb-2">
              <Button 
                onClick={() => setActiveDay("today")}
                variant={activeDay === "today" ? "default" : "outline"}
                className={`rounded-xl ${activeDay === "today" ? "bg-kidato-blue" : "border-blue-200 text-blue-600"}`}
              >
                Today
              </Button>
              <Button 
                onClick={() => setActiveDay("tomorrow")}
                variant={activeDay === "tomorrow" ? "default" : "outline"}
                className={`rounded-xl ${activeDay === "tomorrow" ? "bg-kidato-blue" : "border-blue-200 text-blue-600"}`}
              >
                Tomorrow
              </Button>
              {weekDays.map((day) => (
                <Button 
                  key={day}
                  variant="outline"
                  className="rounded-xl border-blue-200 text-blue-600 whitespace-nowrap"
                >
                  {day}
                </Button>
              ))}
            </div>
            
            {/* Schedule Content */}
            <Card className="mb-6">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-indigo-600" />
                  {activeDay === "today" ? "Today's Schedule" : "Tomorrow's Schedule"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {renderSchedule(activeDay)}
              </CardContent>
            </Card>
            
            {/* Weekly Overview */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <PieChart className="mr-2 h-5 w-5 text-cyan-600" />
                  Weekly Learning Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => (
                    <div key={day} className="flex flex-col items-center">
                      <p className="text-sm font-medium mb-1">{day.substring(0, 3)}</p>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        index === 0 ? "bg-blue-100 text-blue-600" : 
                        index === 1 ? "bg-purple-100 text-purple-600" :
                        index === 2 ? "bg-green-100 text-green-600" :
                        index === 3 ? "bg-indigo-100 text-indigo-600" :
                        index === 4 ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-400"
                      }`}>
                        <span className="font-bold">
                          {index < 5 ? (3 - index > 0 ? 3 - index : index) : 0}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {index < 5 ? "class" + (index === 0 || index === 2 || index === 3 ? "es" : "") : "rest"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Kidato AI Mascot */}
      <KidatoMascot />
    </div>
  );
}

export default Schedule;
