
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Book, User, Settings, LogOut, MessageSquare, Star, Sparkles, PieChart, Users, Target, Calendar, Award, Trophy, CheckCircle2, Clock } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import { Badge } from "@/components/ui/badge";

const Challenges = () => {
  const [userName] = useState("John Doe");
  
  // Mock challenges data
  const activeChallenges = [
    {
      id: 1,
      title: "Math Master",
      description: "Complete 10 math exercises with at least 90% accuracy",
      progress: 70,
      reward: "50 XP",
      deadline: "2 days left",
      type: "Mathematics",
      color: "blue"
    },
    {
      id: 2,
      title: "Science Explorer",
      description: "Conduct 3 virtual science experiments and document results",
      progress: 33,
      reward: "100 XP + Science Badge",
      deadline: "5 days left",
      type: "Science",
      color: "purple"
    },
    {
      id: 3,
      title: "Reading Champion",
      description: "Read 3 books and write a short review for each",
      progress: 66,
      reward: "75 XP + Book Voucher",
      deadline: "1 week left",
      type: "Language Arts",
      color: "green"
    }
  ];
  
  const completedChallenges = [
    {
      id: 4,
      title: "Coding Starter",
      description: "Complete the introduction to programming course",
      reward: "120 XP + Coder Badge",
      completedDate: "Yesterday",
      type: "Computer Science",
      color: "indigo"
    },
    {
      id: 5,
      title: "Vocabulary Builder",
      description: "Learn and use 20 new words in sentences",
      reward: "40 XP",
      completedDate: "Last week",
      type: "Language Arts",
      color: "pink"
    }
  ];

  // Function to get the appropriate color class for badges
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
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm transition-all hover:shadow-md"
          >
            <Target className="mr-3 h-5 w-5 text-amber-500" />
            Quests & Challenges
            <Star className="ml-auto h-4 w-4 text-yellow-400" />
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
              <h1 className="text-2xl font-bold text-gray-800">Quests & Challenges</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Total XP: </span>
                <span className="font-bold text-amber-500">325</span>
              </div>
            </div>
            
            {/* Active Challenges */}
            <Card className="mb-6 border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-amber-500" />
                  Active Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {activeChallenges.map(challenge => (
                    <div key={challenge.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-800">{challenge.title}</h3>
                            <Badge className={getBadgeColorClass(challenge.color)}>{challenge.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-500">{challenge.deadline}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                        <div className="flex items-center mb-2">
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-${challenge.color}-500`} 
                              style={{ width: `${challenge.progress}%` }}
                            ></div>
                          </div>
                          <span className="ml-3 text-sm font-medium">{challenge.progress}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-400" />
                            <span className="text-sm font-medium">Reward: {challenge.reward}</span>
                          </div>
                          <Button variant="outline" size="sm" className="text-xs h-8 px-3 py-1">
                            Continue
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Completed Challenges */}
            <Card className="mb-6">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                  Completed Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {completedChallenges.map(challenge => (
                    <div key={challenge.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm opacity-80">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-700">{challenge.title}</h3>
                            <Badge className={getBadgeColorClass(challenge.color)}>{challenge.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-gray-500">{challenge.completedDate}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-amber-400" />
                            <span className="text-sm font-medium">Earned: {challenge.reward}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Discover New Challenges */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
                  Discover New Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="h-auto p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 flex-col items-start rounded-xl shadow-sm">
                    <h3 className="font-bold text-left w-full mb-1">Weekly Math Sprint</h3>
                    <p className="text-sm text-left text-blue-600 font-normal mb-2">Complete 15 math problems in under 10 minutes</p>
                    <span className="inline-flex items-center text-xs">
                      <Star className="h-3 w-3 mr-1 text-amber-400" /> 75 XP reward
                    </span>
                  </Button>
                  
                  <Button className="h-auto p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 flex-col items-start rounded-xl shadow-sm">
                    <h3 className="font-bold text-left w-full mb-1">Science Knowledge Quiz</h3>
                    <p className="text-sm text-left text-purple-600 font-normal mb-2">Test your science knowledge with this special quiz</p>
                    <span className="inline-flex items-center text-xs">
                      <Star className="h-3 w-3 mr-1 text-amber-400" /> 100 XP reward
                    </span>
                  </Button>
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

export default Challenges;
