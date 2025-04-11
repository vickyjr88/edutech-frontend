
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Import our new components
import GroupHeader from "./GroupHeader";
import OverviewTab from "./tabs/OverviewTab";
import MembersTab from "./tabs/MembersTab";
import TasksTab from "./tabs/TasksTab";
import ResourcesTab from "./tabs/ResourcesTab";

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
  dueDate?: string;
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
  
  const deleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setLocalTasks(updatedTasks);
    
    toast({
      title: "Task deleted",
      description: "The task has been removed from the group",
    });
  };
  
  const addTask = (title: string, assignedTo?: number, dueDate?: Date) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
      assignedTo,
      dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : undefined
    };
    
    const updatedTasks = [...tasks, newTask];
    setLocalTasks(updatedTasks);
    
    toast({
      title: "Task added",
      description: "New task has been added to the group",
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
          <GroupHeader 
            name={group.name}
            subject={group.subject}
            deadline={group.deadline}
          />
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="mt-2" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab 
              description={group.description}
              meetingTime={group.meetingTime}
              memberCount={group.members.length}
              taskProgress={taskProgress}
            />
          </TabsContent>
          
          <TabsContent value="members">
            <MembersTab members={group.members} />
          </TabsContent>
          
          <TabsContent value="tasks">
            <TasksTab 
              tasks={tasks}
              members={group.members}
              onToggleTaskCompletion={toggleTaskCompletion}
              onDeleteTask={deleteTask}
              onAddTask={addTask}
            />
          </TabsContent>
          
          <TabsContent value="resources">
            <ResourcesTab />
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
