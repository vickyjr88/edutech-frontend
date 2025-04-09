
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
import { CheckCircle, Target, TrendingUp, History, Award } from "lucide-react";

type GoalTrackingDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  goal: any;
  onUpdateGoal: (goalId: string, progress: number, notes: string) => void;
};

export default function GoalTrackingDialog({ 
  isOpen, 
  setIsOpen, 
  goal, 
  onUpdateGoal 
}: GoalTrackingDialogProps) {
  const [progress, setProgress] = useState(goal ? goal.progress : 0);
  const [notes, setNotes] = useState("");
  
  const handleUpdate = () => {
    if (goal) {
      onUpdateGoal(goal.id, progress, notes);
      setIsOpen(false);
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
    { date: "April 5, 2025", progress: 20, note: "Started working on the goal" },
    { date: "April 10, 2025", progress: 35, note: "Completed the first milestone" },
    { date: "April 17, 2025", progress: goal.progress, note: "Made significant progress" }
  ];
  
  // Mock milestone data
  const milestones = [
    { title: "Start project", completed: true, date: "April 4, 2025" },
    { title: "Complete research", completed: true, date: "April 10, 2025" },
    { title: "First draft", completed: goal.progress >= 50, date: "April 20, 2025" },
    { title: "Review and revisions", completed: goal.progress >= 75, date: "May 10, 2025" },
    { title: "Final submission", completed: goal.progress >= 100, date: goal.dueDate }
  ];
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="sm:max-w-[550px] max-h-[100vh] overflow-y-auto p-6">
        <SheetHeader>
          <SheetTitle className="text-xl flex items-center">
            <Target className="mr-2 h-5 w-5 text-blue-500" />
            {goal.name}
          </SheetTitle>
          <SheetDescription>
            {goal.description}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
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
                <span className="text-gray-500 block">Set By:</span>
                <span className="font-medium capitalize">{goal.setBy}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Due Date:</span>
                <span className="font-medium">{goal.dueDate}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Target:</span>
                <span className="font-medium">{goal.goalTarget}</span>
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
                <Award className="h-4 w-4 mr-2" />
                Milestones
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="update" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Update Progress: {progress}%</label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[progress]}
                    onValueChange={(vals) => setProgress(vals[0])}
                    className="py-4"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Notes on Progress</label>
                  <Textarea 
                    placeholder="What have you accomplished? What challenges did you face?"
                    className="resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <h4 className="font-medium text-blue-700 mb-1">Tip for Success</h4>
                  <p className="text-blue-600">
                    Breaking down your goal into smaller tasks can help make it more manageable. 
                    Try to set specific milestones to track your progress more effectively.
                  </p>
                </div>
              </div>
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
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {entry.progress}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{entry.note}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
        
        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </SheetClose>
          <Button type="button" onClick={handleUpdate}>Save Progress</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
