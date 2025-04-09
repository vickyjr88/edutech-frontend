
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Brain, Sparkles, Star, PieChart, Award, BarChart, TrendingUp, Target, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function LearningProgress({ onEditGoal }: { onEditGoal: (goal: any) => void }) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // Mock data for demonstration
  const goals = [
    { 
      id: "1",
      name: "Mathematics Quest", 
      progress: 75, 
      icon: PieChart, 
      color: "blue",
      subject: "Mathematics",
      type: "academic", 
      description: "Master algebra concepts and equations",
      dueDate: "June 15, 2025",
      goalTarget: "Complete all practice problems",
      setBy: "self"
    },
    { 
      id: "2",
      name: "Science Challenge", 
      progress: 60, 
      icon: Brain, 
      color: "purple", 
      subject: "Science",
      type: "academic",
      description: "Complete the ecosystem model",
      dueDate: "April 30, 2025",
      goalTarget: "Build 3D model with working components",
      setBy: "teacher"
    },
    { 
      id: "3",
      name: "Coding Adventure", 
      progress: 40, 
      icon: BookOpen, 
      color: "green", 
      subject: "Computer Science",
      type: "academic",
      description: "Learn JavaScript fundamentals",
      dueDate: "May 20, 2025",
      goalTarget: "Build a simple web application",
      setBy: "self"
    },
    { 
      id: "4",
      name: "Reading Quest", 
      progress: 90, 
      icon: BookOpen, 
      color: "orange", 
      subject: "English",
      type: "academic",
      description: "Read 10 books this semester",
      dueDate: "June 1, 2025",
      goalTarget: "Complete reading and write summaries",
      setBy: "parent"
    },
    { 
      id: "5",
      name: "Piano Challenge", 
      progress: 65, 
      icon: TrendingUp, 
      color: "yellow", 
      subject: "Music",
      type: "non-academic",
      description: "Master Beethoven's Moonlight Sonata",
      dueDate: "July 10, 2025",
      goalTarget: "Perform at the school recital",
      setBy: "self"
    },
    { 
      id: "6",
      name: "Soccer Skills Quest", 
      progress: 80, 
      icon: Target, 
      color: "blue", 
      subject: "Physical Education",
      type: "non-academic",
      description: "Improve dribbling and passing accuracy",
      dueDate: "May 15, 2025",
      goalTarget: "Qualify for the school team",
      setBy: "coach"
    }
  ];
  
  // Filter goals based on selection
  const filteredGoals = selectedFilter === "all" 
    ? goals 
    : goals.filter(goal => goal.type === selectedFilter);
  
  // Map color names to actual Tailwind classes
  const getProgressColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      green: "bg-green-500",
      orange: "bg-orange-500",
      yellow: "bg-yellow-500"
    };
    
    return colorMap[color] || "bg-blue-500";
  };

  // Get icon background color
  const getIconBgColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-700",
      purple: "bg-purple-100 text-purple-700",
      green: "bg-green-100 text-green-700",
      orange: "bg-orange-100 text-orange-700",
      yellow: "bg-yellow-100 text-yellow-700"
    };
    
    return colorMap[color] || "bg-blue-100 text-blue-700";
  };

  // Decorative elements for progress bars
  const ProgressDecorator = ({ progress }: { progress: number }) => {
    if (progress >= 90) {
      return <Star className="h-4 w-4 text-yellow-400 ml-2 animate-pulse" />;
    } else if (progress >= 70) {
      return <Sparkles className="h-4 w-4 text-blue-400 ml-2" />;
    }
    return null;
  };
  
  // Badge for who set the goal
  const GoalCreator = ({ setBy }: { setBy: string }) => {
    const badges: Record<string, { color: string, icon: any, text: string }> = {
      self: { color: "bg-green-100 text-green-700", icon: Award, text: "Self" },
      teacher: { color: "bg-blue-100 text-blue-700", icon: BookOpen, text: "Teacher" },
      parent: { color: "bg-purple-100 text-purple-700", icon: Star, text: "Parent" },
      coach: { color: "bg-orange-100 text-orange-700", icon: Target, text: "Coach" }
    };
    
    const { color, icon: Icon, text } = badges[setBy] || badges.self;
    
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center ${color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {text}
      </span>
    );
  };

  return (
    <Card className="border-2 border-blue-100 rounded-xl overflow-hidden shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="text-lg font-bold flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Your Adventure Progress
        </CardTitle>
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-[160px] border-blue-100 bg-white rounded-xl">
            <SelectValue placeholder="Filter quests" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-blue-100">
            <SelectItem value="all">All Quests</SelectItem>
            <SelectItem value="academic">Academic Quests</SelectItem>
            <SelectItem value="non-academic">Non-Academic Quests</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-5">
          {filteredGoals.map((goal, index) => (
            <div key={index} className="space-y-1.5 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className={`p-1.5 rounded-md ${getIconBgColor(goal.color)} mr-2`}>
                    <goal.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{goal.name}</span>
                      <GoalCreator setBy={goal.setBy} />
                    </div>
                    <p className="text-xs text-gray-600">{goal.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-bold">{goal.progress}%</span>
                  <ProgressDecorator progress={goal.progress} />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 p-1 h-auto" 
                    onClick={() => onEditGoal(goal)}
                  >
                    <BarChart className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden relative p-0.5">
                <Progress 
                  value={goal.progress} 
                  className="h-2 rounded-full overflow-hidden" 
                  indicatorClassName={getProgressColor(goal.color)}
                />
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
                <span>Target: {goal.goalTarget}</span>
                <span>Due: {goal.dueDate}</span>
              </div>
            </div>
          ))}
          
          <div className="pt-5 border-t mt-4 border-blue-100">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="font-bold text-blue-600 flex items-center">
                <Star className="h-4 w-4 mr-1.5 text-yellow-400" />
                Overall Adventure Progress
              </span>
              <span className="font-bold text-blue-600">66%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative p-0.5">
              <Progress 
                value={66} 
                className="h-3 rounded-full overflow-hidden"
                indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500" 
              />
            </div>
            
            <div className="mt-4 text-center">
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full inline-flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Keep going on your learning adventure!
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
