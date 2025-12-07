
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle, Target, TrendingUp, History, Award, Clock, Trophy, Loader2 } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { goalService, Goal } from "@/integrations/api/services/goal.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const updateFormSchema = z.object({
  timeSpent: z.string().min(1, { message: "Please enter time spent" }),
  progressPercent: z.number().min(0).max(100),
  notes: z.string().optional(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

type GoalTrackingDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  goal: any;
  onUpdateGoal: (goalId: string, progress: number, notes: string, timeSpent?: string) => void;
};

export default function GoalTrackingDialog({
  isOpen,
  setIsOpen,
  goal,
  onUpdateGoal
}: GoalTrackingDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progressPercent, setProgressPercent] = useState(goal ? goal.progress : 0);
  const [fullGoalData, setFullGoalData] = useState<Goal | null>(null);
  const [isLoadingGoal, setIsLoadingGoal] = useState(false);
  const [newMilestone, setNewMilestone] = useState("");

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      timeSpent: "1",
      progressPercent: goal ? goal.progress : 0,
      notes: "",
    },
  });

  // Fetch full goal details when dialog opens
  useEffect(() => {
    const fetchGoalDetails = async () => {
      if (!isOpen || !goal || !user?.studentId) return;

      setIsLoadingGoal(true);
      try {
        const goalId = goal._id || goal.id;
        const { data, error } = await goalService.getGoalById(user.studentId, goalId);

        if (error) {
          console.error("Error fetching goal details:", error);
          toast({
            title: "Error",
            description: "Failed to load goal details",
            variant: "destructive"
          });
        } else if (data) {
          setFullGoalData(data);
        }
      } catch (error) {
        console.error("Error fetching goal:", error);
      } finally {
        setIsLoadingGoal(false);
      }
    };

    fetchGoalDetails();
  }, [isOpen, goal, user?.studentId]);

  const handleUpdate = async (values: UpdateFormValues) => {
    if (!goal || !user?.studentId) return;

    try {
      const goalId = goal._id || goal.id;

      // Update progress via API
      const { error } = await goalService.updateProgress(
        user.studentId,
        goalId,
        values.progressPercent
      );

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update goal progress",
          variant: "destructive"
        });
        return;
      }

      // Call parent callback
      onUpdateGoal(goalId, values.progressPercent, values.notes || "", values.timeSpent);

      toast({
        title: "Success",
        description: "Goal progress updated successfully"
      });

      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error updating goal:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleMilestoneToggle = async (index: number, completed: boolean) => {
    if (!user?.studentId || !fullGoalData) return;

    try {
      const { data, error } = await goalService.updateMilestone(
        user.studentId,
        fullGoalData._id,
        index,
        completed
      );

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update milestone",
          variant: "destructive"
        });
      } else if (data) {
        setFullGoalData(data);
        toast({
          title: "Success",
          description: `Milestone ${completed ? 'completed' : 'uncompleted'}`
        });
      }
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.trim() || !user?.studentId || !fullGoalData) return;

    try {
      const updatedMilestones = [
        ...(fullGoalData.milestones || []),
        { name: newMilestone, completed: false }
      ];

      const { data, error } = await goalService.updateGoal(
        user.studentId,
        fullGoalData._id,
        { milestones: updatedMilestones }
      );

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add milestone",
          variant: "destructive"
        });
      } else if (data) {
        setFullGoalData(data);
        setNewMilestone("");
        toast({
          title: "Success",
          description: "Milestone added successfully"
        });
      }
    } catch (error) {
      console.error("Error adding milestone:", error);
    }
  };

  if (!goal) return null;

  const getProgressColor = (value: number) => {
    if (value < 30) return "bg-red-500";
    if (value < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Use real milestones from API or fallback to empty array
  const milestones = fullGoalData?.milestones || [];

  // Calculate time commitment metrics (gracefully handle missing fields)
  const totalTimeCommitment = goal.timeCommitment ? `${goal.timeCommitment} ${goal.timeFrequency || 'hours'}` : "Not specified";
  const timeRemaining = "Track your time as you work";

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="sm:max-w-[600px] p-6">
        <SheetHeader>
          <SheetTitle className="text-xl flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            {goal.name || goal.title}
          </SheetTitle>
          <SheetDescription>
            {goal.description}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Current Progress</span>
              <span className="font-bold text-blue-600">{goal.progress}%</span>
            </div>
            <Progress
              value={goal.progress}
              className="h-3 rounded-full"
              indicatorClassName={getProgressColor(goal.progress)}
            />
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">Subject:</span>
                <span className="font-medium">{goal.subject}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Quest Creator:</span>
                <span className="font-medium capitalize">{goal.setBy}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Due Date:</span>
                <span className="font-medium">{goal.dueDate}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Time Commitment:</span>
                <span className="font-medium">{totalTimeCommitment}</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="update" className="mt-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="update" className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Update
              </TabsTrigger>
              <TabsTrigger value="milestones" className="flex items-center">
                <Trophy className="h-4 w-4 mr-2" />
                Milestones
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="update" className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                    <h3 className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Record Time Spent
                    </h3>

                    <FormField
                      control={form.control}
                      name="timeSpent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How much time did you spend on this quest?</FormLabel>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Input type="number" min="0.5" step="0.5" {...field} className="w-24" />
                            </FormControl>
                            <span className="text-sm text-gray-500">
                              {goal.timeFrequency || "hours"}
                            </span>
                          </div>
                          <FormDescription>
                            {timeRemaining}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="progressPercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Update Progress: {field.value}%</FormLabel>
                          <FormControl>
                            <Slider
                              min={0}
                              max={100}
                              step={1}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              className="py-4"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adventure Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What have you accomplished? What challenges did you face in your quest?"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-blue-50 p-3 rounded-lg text-sm">
                    <h4 className="font-medium text-blue-700 mb-1">Quest Tip</h4>
                    <p className="text-blue-600">
                      Breaking down your quest into smaller milestones can help make your adventure more manageable.
                      Set specific targets to track your progress more effectively.
                    </p>
                  </div>

                  <SheetFooter className="mt-4 pt-4 border-t">
                    <SheetClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </SheetClose>
                    <Button type="submit">Save Progress</Button>
                  </SheetFooter>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-3">
              {isLoadingGoal ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              ) : milestones.length > 0 ? (
                milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${milestone.completed
                      ? 'bg-green-50 border-green-200 hover:bg-green-100'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    onClick={() => handleMilestoneToggle(index, !milestone.completed)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`p-1 rounded-full ${milestone.completed ? 'bg-green-200' : 'bg-gray-200'} mr-2`}>
                          <CheckCircle className={`h-4 w-4 ${milestone.completed ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <span className="font-medium">{milestone.name}</span>
                      </div>
                      {milestone.completedAt && (
                        <span className="text-sm text-gray-600">
                          {new Date(milestone.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No milestones yet. Add your first milestone below!</p>
                </div>
              )}

              <div className="mt-4">
                <Input
                  placeholder="Add a new milestone..."
                  className="mb-2"
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddMilestone();
                    }
                  }}
                />
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddMilestone}
                    disabled={!newMilestone.trim()}
                  >
                    Add Milestone
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-3">
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Progress history tracking coming soon!</p>
                <p className="text-sm mt-2">Your updates will be recorded here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
