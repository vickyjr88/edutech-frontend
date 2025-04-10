
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Clock, Users, MessageSquare, FileText, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: number;
  name: string;
  image: string;
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
  assignedTo?: number;
}

interface GroupDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: {
    id: number;
    name: string;
    subject: string;
    description: string;
    progress: number;
    members: Member[];
    meetingTime: string;
    deadline: string;
    tasks?: Task[];
  } | null;
}

const GroupDetails = ({ open, onOpenChange, group }: GroupDetailsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  
  // Initialize local tasks when group changes
  useEffect(() => {
    if (group && group.tasks) {
      setLocalTasks(group.tasks);
    } else {
      setLocalTasks([]);
    }
  }, [group]);

  if (!group) return null;
  
  const tasks = group.tasks || localTasks;
  
  const toggleTaskCompletion = (taskId: number) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    setLocalTasks(updatedTasks);
    
    // Calculate new progress based on completed tasks
    const completedTasksCount = updatedTasks.filter(task => task.completed).length;
    const newProgress = updatedTasks.length > 0 
      ? Math.round((completedTasksCount / updatedTasks.length) * 100) 
      : 0;
    
    toast({
      title: "Task status updated",
      description: `Progress updated to ${newProgress}%`,
    });
  };
  
  const addNewTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false
    };
    
    const updatedTasks = [...tasks, newTask];
    setLocalTasks(updatedTasks);
    setNewTaskTitle("");
    
    toast({
      title: "Task added",
      description: "New task has been added to the group",
    });
  };
  
  const deleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setLocalTasks(updatedTasks);
    
    toast({
      title: "Task deleted",
      description: "The task has been removed from the group",
    });
  };
  
  // Calculate progress based on completed tasks
  const calculateTaskProgress = () => {
    if (tasks.length === 0) return group.progress || 0;
    const completedTasksCount = tasks.filter(task => task.completed).length;
    return Math.round((completedTasksCount / tasks.length) * 100);
  };
  
  const taskProgress = calculateTaskProgress();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{group.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {group.subject}
                </Badge>
                <span className="text-sm text-gray-500">
                  <CalendarDays className="inline-block mr-1 h-3.5 w-3.5 text-gray-400" />
                  Due: {group.deadline}
                </span>
              </div>
            </div>
            <Button variant="ghost" className="rounded-full p-2 h-auto" size="icon">
              <MessageSquare className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="mt-2" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{taskProgress}%</span>
              </div>
              <Progress value={taskProgress} className="h-2" />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-600">{group.description}</p>
            </div>
            
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-medium mb-2">Meeting Schedule</h3>
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-2 h-4 w-4 text-blue-500" />
                  <span>{group.meetingTime}</span>
                </div>
              </div>
              
              <div className="flex-1 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-medium mb-2">Team Size</h3>
                <div className="flex items-center text-gray-600">
                  <Users className="mr-2 h-4 w-4 text-blue-500" />
                  <span>{group.members.length} Members</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="members" className="space-y-4">
            <div className="grid gap-4">
              {group.members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      {member.image ? (
                        <img src={member.image} alt={member.name} />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-gray-500">Student</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Message</Button>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Invite More Members
            </Button>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-4">
            {tasks.length === 0 ? (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <p className="text-center text-yellow-700">No tasks have been created for this group yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={`rounded-full p-0 h-6 w-6 ${task.completed ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100'}`}
                        onClick={() => toggleTaskCompletion(task.id)}
                      >
                        {task.completed && <CheckCircle2 className="h-4 w-4" />}
                      </Button>
                      <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Input 
                placeholder="Add a new task..." 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNewTask()}
                className="flex-1"
              />
              <Button onClick={addNewTask}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <p className="text-center text-yellow-700">No resources have been added to this group yet.</p>
            </div>
            
            <Button className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Add Resources
            </Button>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button 
            className="bg-kidato-blue hover:bg-kidato-dark-blue"
            onClick={() => onOpenChange(false)}
          >
            Update Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDetails;
