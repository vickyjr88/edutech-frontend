
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { goalService, Goal } from "@/integrations/api/services/goal.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Target, AlertCircle } from "lucide-react";

const EducationalGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch active goals for the student
        const response = await goalService.getStudentGoals(user.id, {
          status: 'active'
        });

        if (response.data?.goals) {
          setGoals(response.data.goals);
        }
      } catch (err) {
        console.error("Failed to fetch goals:", err);
        setError("Failed to load educational goals");
        toast({
          title: "Error",
          description: "Failed to load educational goals. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [user?.id, toast]);

  const formatDueDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due Today";
    if (diffDays === 1) return "Due Tomorrow";
    if (diffDays < 7) return `Due in ${diffDays} days`;

    return `Due ${date.toLocaleDateString()}`;
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-purple-200">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-4">Educational Goals</h2>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
            <span className="ml-2 text-gray-600">Loading goals...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-purple-200">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-4">Educational Goals</h2>
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (goals.length === 0) {
    return (
      <Card className="border-2 border-purple-200">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-4">Educational Goals</h2>
          <div className="text-center py-8 text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No active goals at the moment</p>
            <p className="text-sm mt-1">Set new goals to track your progress!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group goals by student (for parent view with multiple children)
  // For now, showing all goals for the current user
  const studentName = user?.fullName || "Student";

  return (
    <Card className="border-2 border-purple-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-4">Educational Goals</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-3">{studentName}'s Goals</h3>
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal._id} className="space-y-2 p-3 rounded-lg bg-purple-50 border border-purple-100">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <span className="text-sm font-medium block">{goal.name}</span>
                      {goal.subject && (
                        <span className="text-xs text-gray-500">{goal.subject}</span>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs whitespace-nowrap ${new Date(goal.dueDate) < new Date()
                          ? 'border-red-300 text-red-700 bg-red-50'
                          : 'border-purple-300 text-purple-700 bg-purple-50'
                        }`}
                    >
                      {formatDueDate(goal.dueDate)}
                    </Badge>
                  </div>
                  {goal.description && (
                    <p className="text-xs text-gray-600">{goal.description}</p>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Progress value={goal.progress} className="h-2 flex-1 mr-2" />
                      <span className="text-xs text-gray-600 font-medium">{goal.progress}%</span>
                    </div>
                    {goal.milestones && goal.milestones.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {goal.milestones.filter(m => m.completed).length} of {goal.milestones.length} milestones completed
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationalGoals;
