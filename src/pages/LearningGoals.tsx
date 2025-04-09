
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Book, User, Settings, LogOut, MessageSquare, Star, Sparkles, PieChart, Users, Target, Calendar, Award, Plus } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import LearningProgress from "@/components/dashboard/LearningProgress";
import GoalFormDialog from "@/components/dashboard/GoalFormDialog";
import GoalTrackingDialog from "@/components/dashboard/GoalTrackingDialog";
import { useToast } from "@/components/ui/use-toast";
import KidatoMascot from "@/components/dashboard/KidatoMascot";

const LearningGoals = () => {
  const [userName] = useState("John Doe");
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const { toast } = useToast();
  
  const shortTermGoals = [
    {
      title: "Complete Mathematics Module 3",
      dueIn: "5 days",
      progress: 75,
      color: "blue"
    },
    {
      title: "Finish Science Project",
      dueIn: "2 days",
      progress: 50,
      color: "purple"
    },
    {
      title: "Submit Coding Challenge",
      dueIn: "tomorrow",
      progress: 90,
      color: "green"
    }
  ];
  
  const longTermGoals = [
    {
      title: "Master Algebra Concepts",
      dueIn: "End of semester",
      progress: 40,
      color: "blue"
    },
    {
      title: "Complete Science Curriculum",
      dueIn: "End of year",
      progress: 35,
      color: "purple"
    },
    {
      title: "Build Final Coding Project",
      dueIn: "Next month",
      progress: 15,
      color: "orange"
    }
  ];
  
  const handleCreateGoal = (values: any) => {
    console.log("New goal created:", values);
    toast({
      title: "Goal Created",
      description: `Your new goal "${values.title}" has been created successfully.`,
    });
  };
  
  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setIsTrackingOpen(true);
  };
  
  const handleUpdateGoal = (goalId: string, progress: number, notes: string, timeSpent?: string) => {
    console.log("Goal updated:", { goalId, progress, notes, timeSpent });
    toast({
      title: "Progress Updated",
      description: `Your goal progress has been updated to ${progress}%. ${timeSpent ? `Time spent: ${timeSpent}` : ''}`,
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 transition-all"
          >
            <Book className="mr-3 h-5 w-5" />
            My Courses
          </Link>
          <Link 
            to="/learning-progress" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm transition-all hover:shadow-md"
          >
            <PieChart className="mr-3 h-5 w-5" />
            Learning Goals
            <Star className="ml-auto h-4 w-4 text-yellow-400" />
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

      <div className="flex-1 flex flex-col">
        <StudentDashboardHeader userName={userName} />
        
        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Learning Goals</h1>
              <Button 
                onClick={() => setIsGoalFormOpen(true)} 
                className="bg-kidato-blue hover:bg-kidato-dark-blue rounded-xl flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New Goal
              </Button>
            </div>
            
            <LearningProgress onEditGoal={handleEditGoal} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                  <CardTitle className="text-lg font-bold flex items-center">
                    <Target className="mr-2 h-5 w-5 text-blue-500" />
                    Short-term Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {shortTermGoals.map((goal, index) => (
                      <li key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium">{goal.title}</p>
                          <p className="text-sm text-gray-600">Due in {goal.dueIn}</p>
                        </div>
                        <div className="w-20 text-center">
                          <p className={`font-bold text-${goal.color}-600`}>{goal.progress}%</p>
                        </div>
                      </li>
                    ))}
                    <li className="mt-4">
                      <Button 
                        variant="outline"
                        onClick={() => setIsGoalFormOpen(true)}
                        className="w-full border-dashed border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-500 hover:text-blue-500 flex items-center justify-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Short-term Goal
                      </Button>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                  <CardTitle className="text-lg font-bold flex items-center">
                    <Target className="mr-2 h-5 w-5 text-blue-500" />
                    Long-term Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {longTermGoals.map((goal, index) => (
                      <li key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium">{goal.title}</p>
                          <p className="text-sm text-gray-600">{goal.dueIn}</p>
                        </div>
                        <div className="w-20 text-center">
                          <p className={`font-bold text-${goal.color}-600`}>{goal.progress}%</p>
                        </div>
                      </li>
                    ))}
                    <li className="mt-4">
                      <Button 
                        variant="outline"
                        onClick={() => setIsGoalFormOpen(true)}
                        className="w-full border-dashed border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-500 hover:text-blue-500 flex items-center justify-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Long-term Goal
                      </Button>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <KidatoMascot />
      
      <GoalFormDialog 
        isOpen={isGoalFormOpen} 
        setIsOpen={setIsGoalFormOpen} 
        onSubmit={handleCreateGoal}
      />
      
      <GoalTrackingDialog 
        isOpen={isTrackingOpen}
        setIsOpen={setIsTrackingOpen}
        goal={selectedGoal}
        onUpdateGoal={handleUpdateGoal}
      />
    </div>
  );
}

export default LearningGoals;
