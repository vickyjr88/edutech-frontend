
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Book, User, Settings, LogOut, MessageSquare, Star, Sparkles, PieChart, Users, Target, Calendar, Award, Trophy, Medal, Clock, CheckCircle2, Crown } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Achievements = () => {
  const [userName] = useState("John Doe");
  
  // Mock achievements data
  const recentAchievements = [
    {
      id: 1,
      name: "Math Wizard",
      description: "Complete 10 math assignments with a score of 90% or higher",
      icon: <Star className="h-8 w-8 text-yellow-400" />,
      date: "2 days ago",
      xp: 200,
      color: "yellow"
    },
    {
      id: 2,
      name: "Reading Champion",
      description: "Read 5 books and submit book reports",
      icon: <Book className="h-8 w-8 text-purple-500" />,
      date: "Last week",
      xp: 150,
      color: "purple"
    },
    {
      id: 3,
      name: "Science Explorer",
      description: "Complete all science experiments with detailed observations",
      icon: <PieChart className="h-8 w-8 text-blue-500" />,
      date: "2 weeks ago",
      xp: 175,
      color: "blue"
    }
  ];
  
  const upcomingAchievements = [
    {
      id: 4,
      name: "Coding Master",
      description: "Create a complete project using JavaScript",
      icon: <Sparkles className="h-8 w-8 text-cyan-500" />,
      progress: 65,
      xp: 250,
      color: "cyan"
    },
    {
      id: 5,
      name: "Team Player",
      description: "Collaborate in 5 group projects",
      icon: <Users className="h-8 w-8 text-green-500" />,
      progress: 40,
      xp: 150,
      color: "green"
    },
    {
      id: 6,
      name: "Perfect Attendance",
      description: "Attend all scheduled classes for a month",
      icon: <Calendar className="h-8 w-8 text-indigo-500" />,
      progress: 85,
      xp: 100,
      color: "indigo"
    }
  ];
  
  // Function to get the appropriate color class for badges
  const getBadgeColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      green: "bg-green-100 text-green-600",
      indigo: "bg-indigo-100 text-indigo-600",
      cyan: "bg-cyan-100 text-cyan-600",
      yellow: "bg-amber-100 text-amber-600",
    };
    return colorMap[color] || "bg-gray-100 text-gray-600";
  };
  
  // Function to get progress indicator color
  const getProgressColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      green: "bg-green-500",
      indigo: "bg-indigo-500",
      cyan: "bg-cyan-500",
      yellow: "bg-amber-500",
    };
    
    return colorMap[color] || "bg-blue-500";
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
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm transition-all hover:shadow-md"
          >
            <Award className="mr-3 h-5 w-5 text-yellow-600" />
            Achievements
            <Star className="ml-auto h-4 w-4 text-yellow-400" />
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
              <h1 className="text-2xl font-bold text-gray-800">Achievements</h1>
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Total XP: <span className="font-bold text-yellow-500">2,450</span></span>
              </div>
            </div>
            
            {/* Achievement Summary */}
            <Card className="mb-6 border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Medal className="mr-2 h-5 w-5 text-yellow-500" />
                  Achievement Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white border border-blue-50 rounded-xl shadow-sm p-4 flex flex-col items-center">
                    <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                      <Trophy className="h-6 w-6 text-blue-500" />
                    </div>
                    <p className="text-lg font-bold text-blue-700">12</p>
                    <p className="text-sm text-gray-500">Badges Earned</p>
                  </div>
                  
                  <div className="bg-white border border-purple-50 rounded-xl shadow-sm p-4 flex flex-col items-center">
                    <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                      <Star className="h-6 w-6 text-purple-500" />
                    </div>
                    <p className="text-lg font-bold text-purple-700">2,450</p>
                    <p className="text-sm text-gray-500">Total XP</p>
                  </div>
                  
                  <div className="bg-white border border-green-50 rounded-xl shadow-sm p-4 flex flex-col items-center">
                    <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                      <Target className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="text-lg font-bold text-green-700">8</p>
                    <p className="text-sm text-gray-500">Goals Completed</p>
                  </div>
                  
                  <div className="bg-white border border-amber-50 rounded-xl shadow-sm p-4 flex flex-col items-center">
                    <div className="bg-amber-50 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                      <Crown className="h-6 w-6 text-amber-500" />
                    </div>
                    <p className="text-lg font-bold text-amber-700">#12</p>
                    <p className="text-sm text-gray-500">Class Ranking</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Achievements */}
            <Card className="mb-6">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentAchievements.map(achievement => (
                    <div key={achievement.id} className="flex gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                      <div className={`bg-${achievement.color}-50 p-3 rounded-lg h-fit`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-800">{achievement.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                          </div>
                          <Badge className={getBadgeColorClass(achievement.color)}>
                            +{achievement.xp} XP
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> Earned {achievement.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Upcoming Achievements */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Target className="mr-2 h-5 w-5 text-amber-500" />
                  Achievements In Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {upcomingAchievements.map(achievement => (
                    <div key={achievement.id} className="flex gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                      <div className={`bg-${achievement.color}-50 p-3 rounded-lg h-fit`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-gray-800">{achievement.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                          </div>
                          <Badge className={getBadgeColorClass(achievement.color)}>
                            +{achievement.xp} XP
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-grow mr-3">
                            <Progress 
                              value={achievement.progress} 
                              className="h-2 rounded-full" 
                              indicatorClassName={getProgressColor(achievement.color)}
                            />
                          </div>
                          <span className="text-sm font-medium">{achievement.progress}%</span>
                        </div>
                      </div>
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

export default Achievements;
