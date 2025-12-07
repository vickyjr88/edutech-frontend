
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Brain, Sparkles, Star, PieChart, Award, BarChart, TrendingUp, Target, Trophy, Loader2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { goalService, Goal } from "@/integrations/api/services/goal.service";
import { useToast } from "@/hooks/use-toast";

interface LearningProgressProps {
  onEditGoal: (goal: Goal) => void;
  studentId?: string;
}

export default function LearningProgress({ onEditGoal, studentId }: LearningProgressProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'academic' | 'non-academic'>("all");
  
  // Determine the student ID to use
  const activeStudentId = studentId || user?.studentId || '';

  // Fetch goals from API
  const { data: goalsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['student-goals', activeStudentId, selectedFilter],
    queryFn: () => goalService.getStudentGoals(activeStudentId, {
      type: selectedFilter,
      status: 'active'
    }),
    enabled: !!activeStudentId,
    refetchOnWindowFocus: false,
  });

  // Fetch goal statistics
  const { data: statsResponse } = useQuery({
    queryKey: ['goal-stats', activeStudentId],
    queryFn: () => goalService.getGoalStats(activeStudentId),
    enabled: !!activeStudentId,
    refetchOnWindowFocus: false,
  });

  const goals = goalsResponse?.data?.goals || [];
  const stats = statsResponse?.data;
  
  // Map goal subject to icon
  const getGoalIcon = (subject: string) => {
    const iconMap: Record<string, any> = {
      'Mathematics': PieChart,
      'Math': PieChart,
      'Science': Brain,
      'Computer Science': BookOpen,
      'Programming': BookOpen,
      'English': BookOpen,
      'Reading': BookOpen,
      'Music': TrendingUp,
      'Physical Education': Target,
      'Sports': Target,
    };
    return iconMap[subject] || BookOpen;
  };

  // Map goal to color based on progress
  const getGoalColor = (progress: number): string => {
    if (progress >= 80) return 'green';
    if (progress >= 60) return 'blue';
    if (progress >= 40) return 'purple';
    if (progress >= 20) return 'orange';
    return 'yellow';
  };
  
  // Empty state
  if (!activeStudentId) {
    return (
      <Card className="border-2 border-blue-100 rounded-xl overflow-hidden shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-600">Please log in to view your learning progress.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="border-2 border-blue-100 rounded-xl overflow-hidden shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading your goals...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-2 border-blue-100 rounded-xl overflow-hidden shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mb-3" />
            <p className="text-gray-600 mb-3">Failed to load your goals</p>
            <Button onClick={() => refetch()} size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform API goals to include icon and color
  const enrichedGoals = goals.map((goal: Goal) => ({
    ...goal,
    icon: getGoalIcon(goal.subject),
    color: getGoalColor(goal.progress),
  }));

  // Calculate overall progress
  const overallProgress = stats?.averageProgress || 
    (enrichedGoals.length > 0 
      ? Math.round(enrichedGoals.reduce((sum, g) => sum + g.progress, 0) / enrichedGoals.length)
      : 0);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
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
        <Select 
          value={selectedFilter} 
          onValueChange={(value) => setSelectedFilter(value as 'all' | 'academic' | 'non-academic')}
        >
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
        {enrichedGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Trophy className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Active Goals Yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Start your learning adventure by creating your first goal!
            </p>
            <Button 
              onClick={() => onEditGoal({} as Goal)} 
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Star className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {enrichedGoals.map((goal) => (
              <div key={goal._id} className="space-y-1.5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className={`p-1.5 rounded-md ${getIconBgColor(goal.color)} mr-2`}>
                      <goal.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
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
                  <span>Due: {formatDate(goal.dueDate)}</span>
                </div>
              </div>
            ))}
            
            <div className="pt-5 border-t mt-4 border-blue-100">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="font-bold text-blue-600 flex items-center">
                  <Star className="h-4 w-4 mr-1.5 text-yellow-400" />
                  Overall Adventure Progress
                </span>
                <span className="font-bold text-blue-600">{overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative p-0.5">
                <Progress 
                  value={overallProgress} 
                  className="h-3 rounded-full overflow-hidden"
                  indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500" 
                />
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {stats && (
                  <>
                    <div className="bg-blue-50 p-2 rounded-lg text-center">
                      <div className="font-bold text-blue-600">{stats.active}</div>
                      <div className="text-gray-600">Active Goals</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg text-center">
                      <div className="font-bold text-green-600">{stats.completed}</div>
                      <div className="text-gray-600">Completed</div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full inline-flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Keep going on your learning adventure!
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
