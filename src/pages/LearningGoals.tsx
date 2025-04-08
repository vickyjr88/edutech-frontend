
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Book, User, Settings, LogOut, MessageSquare, Star, Sparkles, PieChart, Users, Target, Calendar, Award, Plus } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import LearningProgress from "@/components/dashboard/LearningProgress";
import KidatoMascot from "@/components/dashboard/KidatoMascot";

const LearningGoals = () => {
  const [userName] = useState("John Doe");

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
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm transition-all hover:shadow-md"
          >
            <PieChart className="mr-3 h-5 w-5 text-cyan-600" />
            Learning Goals
            <Star className="ml-auto h-4 w-4 text-yellow-400" />
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
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <Calendar className="mr-3 h-5 w-5 text-indigo-600" />
            Schedule
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
              <h1 className="text-2xl font-bold text-gray-800">Learning Goals</h1>
              <Button className="bg-kidato-blue hover:bg-kidato-dark-blue rounded-xl flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Goal
              </Button>
            </div>
            
            {/* Current Progress */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold">Current Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <LearningProgress />
              </CardContent>
            </Card>
            
            {/* Goal Setting Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                  <CardTitle className="text-lg font-bold flex items-center">
                    <Target className="mr-2 h-5 w-5 text-amber-500" />
                    Short-term Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Complete Mathematics Module 3</p>
                        <p className="text-sm text-gray-600">Due in 5 days</p>
                      </div>
                      <div className="w-20 text-center">
                        <p className="font-bold text-blue-600">75%</p>
                      </div>
                    </li>
                    <li className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium">Finish Science Project</p>
                        <p className="text-sm text-gray-600">Due in 2 days</p>
                      </div>
                      <div className="w-20 text-center">
                        <p className="font-bold text-purple-600">50%</p>
                      </div>
                    </li>
                    <li className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Submit Coding Challenge</p>
                        <p className="text-sm text-gray-600">Due tomorrow</p>
                      </div>
                      <div className="w-20 text-center">
                        <p className="font-bold text-green-600">90%</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                  <CardTitle className="text-lg font-bold flex items-center">
                    <Target className="mr-2 h-5 w-5 text-amber-500" />
                    Long-term Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Master Algebra Concepts</p>
                        <p className="text-sm text-gray-600">End of semester</p>
                      </div>
                      <div className="w-20 text-center">
                        <p className="font-bold text-blue-600">40%</p>
                      </div>
                    </li>
                    <li className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium">Complete Science Curriculum</p>
                        <p className="text-sm text-gray-600">End of year</p>
                      </div>
                      <div className="w-20 text-center">
                        <p className="font-bold text-purple-600">35%</p>
                      </div>
                    </li>
                    <li className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium">Build Final Coding Project</p>
                        <p className="text-sm text-gray-600">Next month</p>
                      </div>
                      <div className="w-20 text-center">
                        <p className="font-bold text-orange-600">15%</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Kidato AI Mascot */}
      <KidatoMascot />
    </div>
  );
}

export default LearningGoals;
