
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Rocket } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import StudentStatCards from "@/components/dashboard/StudentStatCards";
import CurrentClasses from "@/components/dashboard/CurrentClasses";
import UpcomingAssignments from "@/components/dashboard/UpcomingAssignments";
import LearningProgress from "@/components/dashboard/LearningProgress";
import RecentActivity from "@/components/dashboard/RecentActivity";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import GoalTrackingDialog from "@/components/dashboard/GoalTrackingDialog";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [userName] = useState("John Doe");
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const { toast } = useToast();
  
  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setIsTrackingOpen(true);
  };
  
  const handleUpdateGoal = (goalId: string, progress: number, notes: string, timeSpent?: string) => {
    console.log("Quest updated:", { goalId, progress, notes, timeSpent });
    
    const isGroupQuest = selectedGoal?.questMode === "group";
    const progressMessage = isGroupQuest 
      ? `Your group quest progress has been updated to ${progress}%. ${timeSpent ? `Time spent: ${timeSpent}` : ''}`
      : `Your quest progress has been updated to ${progress}%. ${timeSpent ? `Time spent: ${timeSpent}` : ''}`;
    
    toast({
      title: "Progress Updated",
      description: progressMessage,
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <StudentSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <StudentDashboardHeader userName={userName} />

        <main className="p-4 sm:p-6 flex-1">
          <div className="max-w-7xl mx-auto">
            <StudentStatCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <CurrentClasses />
              </div>
              <div className="space-y-6">
                <RecentActivity />
                <UpcomingAssignments />
              </div>
            </div>
            
            <div className="mt-6">
              <LearningProgress onEditGoal={handleEditGoal} />
            </div>
            
            <div className="flex justify-center mt-8 mb-4">
              <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-600 text-sm">
                <Rocket className="h-4 w-4" />
                <span>Ready for more learning adventures!</span>
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
          </div>
        </main>
      </div>

      <KidatoMascot />
      
      <GoalTrackingDialog 
        isOpen={isTrackingOpen}
        setIsOpen={setIsTrackingOpen}
        goal={selectedGoal}
        onUpdateGoal={handleUpdateGoal}
      />
    </div>
  );
}

export default Dashboard;
