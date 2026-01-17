
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Book, User, Settings, LogOut, MessageSquare, Star, Sparkles, PieChart, Users, Target, Calendar, Award, Plus, BarChart2 } from "lucide-react";
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
      id: "st1",
      title: "Complete Mathematics Module 3",
      dueIn: "5 days",
      progress: 75,
      color: "blue",
      description: "Finish all exercises in Module 3",
      subject: "Mathematics",
      dueDate: "April 15, 2025",
      setBy: "teacher",
      goalTarget: "Complete all exercises"
    },
    {
      id: "st2",
      title: "Finish Science Project",
      dueIn: "2 days",
      progress: 50,
      color: "purple",
      description: "Complete the ecosystem model for biology class",
      subject: "Science",
      dueDate: "April 12, 2025",
      setBy: "teacher",
      goalTarget: "Submit final project"
    },
    {
      id: "st3",
      title: "Submit Coding Challenge",
      dueIn: "tomorrow",
      progress: 90,
      color: "green",
      description: "Finish the weekly coding challenge",
      subject: "Computer Science",
      dueDate: "April 10, 2025",
      setBy: "self",
      goalTarget: "Submit working solution"
    }
  ];

  const longTermGoals = [
    {
      id: "lt1",
      title: "Master Algebra Concepts",
      dueIn: "End of semester",
      progress: 40,
      color: "blue",
      description: "Master all key algebra concepts for the final exam",
      subject: "Mathematics",
      dueDate: "June 20, 2025",
      setBy: "self",
      goalTarget: "Pass final exam with A grade"
    },
    {
      id: "lt2",
      title: "Complete Science Curriculum",
      dueIn: "End of year",
      progress: 35,
      color: "purple",
      description: "Complete all required science modules for the year",
      subject: "Science",
      dueDate: "Dec 15, 2025",
      setBy: "teacher",
      goalTarget: "Complete all modules with passing grade"
    },
    {
      id: "lt3",
      title: "Build Final Coding Project",
      dueIn: "Next month",
      progress: 15,
      color: "orange",
      description: "Build a full-stack web application as final project",
      subject: "Computer Science",
      dueDate: "May 30, 2025",
      setBy: "teacher",
      goalTarget: "Deploy working application"
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

  // Function to render the progress color class
  const getProgressColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "text-blue-600",
      purple: "text-purple-600",
      green: "text-green-600",
      orange: "text-orange-600",
      yellow: "text-yellow-600"
    };

    return colorMap[color] || "text-blue-600";
  };

  // Function to render a goal item with update button
  const renderGoalItem = (goal: any) => (
    <li key={goal.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
      <div className="flex-grow">
        <p className="font-medium">{goal.title}</p>
        <p className="text-sm text-gray-600">Due in {goal.dueIn}</p>
      </div>
      <div className="flex items-center gap-3">
        <p className={`font-bold ${getProgressColorClass(goal.color)}`}>{goal.progress}%</p>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-blue-300 hover:bg-blue-100"
          onClick={() => handleEditGoal(goal)}
        >
          <BarChart2 className="h-3 w-3" />
          Update Progress
        </Button>
      </div>
    </li>
  );

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-4 sm:p-6 transition-all duration-300">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Learning Goals</h1>
              <Button
                onClick={() => setIsGoalFormOpen(true)}
                className="bg-kidato-purple hover:bg-kidato-dark-blue rounded-xl flex items-center gap-2"
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
                    {shortTermGoals.map(renderGoalItem)}
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
                    {longTermGoals.map(renderGoalItem)}
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
