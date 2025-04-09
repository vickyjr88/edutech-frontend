
import { useState } from "react";
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
import { CheckCircle, Target, TrendingUp, History, Award, Clock, Trophy } from "lucide-react";
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
  const [progressPercent, setProgressPercent] = useState(goal ? goal.progress : 0);
  
  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      timeSpent: "1",
      progressPercent: goal ? goal.progress : 0,
      notes: "",
    },
  });
  
  const handleUpdate = (values: UpdateFormValues) => {
    if (goal) {
      onUpdateGoal(goal.id, values.progressPercent, values.notes, values.timeSpent);
      setIsOpen(false);
      form.reset();
    }
  };
  
  if (!goal) return null;
  
  const getProgressColor = (value: number) => {
    if (value < 30) return "bg-red-500";
    if (value < 70) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  // Mock history data for demonstration
  const progressHistory = [
    { date: "April 5, 2025", progress: 20, note: "Started working on the quest", timeSpent: "2 hours" },
    { date: "April 10, 2025", progress: 35, note: "Completed the first milestone", timeSpent: "3 hours" },
    { date: "April 17, 2025", progress: goal.progress, note: "Made significant progress", timeSpent: "4 hours" }
  ];
  
  // Mock milestone data
  const milestones = [
    { title: "Begin the adventure", completed: true, date: "April 4, 2025" },
    { title: "Complete research phase", completed: true, date: "April 10, 2025" },
    { title: "First major milestone", completed: goal.progress >= 50, date: "April 20, 2025" },
    { title: "Review and revisions", completed: goal.progress >= 75, date: "May 10, 2025" },
    { title: "Quest completion", completed: goal.progress >= 100, date: goal.dueDate }
  ];
  
  // Calculate time commitment metrics
  const totalTimeCommitment = goal.timeCommitment ? `${goal.timeCommitment} ${goal.timeFrequency}` : "Not specified";
  const timeSpentSoFar = progressHistory.reduce((acc, entry) => acc + parseInt(entry.timeSpent), 0);
  const timeRemaining = goal.timeCommitment ? goal.timeCommitment - timeSpentSoFar : "Unknown";
  
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
                              {goal.timeFrequency === "hours" ? "hours" : 
                               goal.timeFrequency === "days" ? "days" : 
                               goal.timeFrequency === "weeks" ? "weeks" : "months"}
                            </span>
                          </div>
                          <FormDescription>
                            Time remaining: {typeof timeRemaining === "number" && timeRemaining > 0 ? timeRemaining : "Completed"} {goal.timeFrequency}
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
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${milestone.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`p-1 rounded-full ${milestone.completed ? 'bg-green-200' : 'bg-gray-200'} mr-2`}>
                        <CheckCircle className={`h-4 w-4 ${milestone.completed ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <span className="font-medium">{milestone.title}</span>
                    </div>
                    <span className="text-sm text-gray-600">Due: {milestone.date}</span>
                  </div>
                </div>
              ))}
              
              <div className="mt-2">
                <Input placeholder="Add a new milestone..." className="mb-2" />
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">Add Milestone</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-3">
              {progressHistory.map((entry, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{entry.date}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {entry.progress}%
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {entry.timeSpent}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{entry.note}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
