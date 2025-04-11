
import TaskItem from "../tasks/TaskItem";
import AddTaskForm from "../tasks/AddTaskForm";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
  assignedTo?: number;
  dueDate?: string;
}

interface TasksTabProps {
  tasks: Task[];
  members: Member[];
  onToggleTaskCompletion: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onAddTask: (title: string, assignedTo?: number, dueDate?: Date) => void;
}

const TasksTab = ({ 
  tasks, 
  members, 
  onToggleTaskCompletion, 
  onDeleteTask, 
  onAddTask 
}: TasksTabProps) => {
  const { toast } = useToast();
  
  // Get member name by id
  const getMemberName = (memberId?: number) => {
    if (!memberId) return "Unassigned";
    const member = members.find(m => m.id === memberId);
    return member ? member.name : "Unknown";
  };
  
  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <p className="text-center text-yellow-700">No tasks have been created for this group yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              completed={task.completed}
              assignedTo={task.assignedTo ? getMemberName(task.assignedTo) : undefined}
              dueDate={task.dueDate}
              onToggleComplete={onToggleTaskCompletion}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}
      
      <AddTaskForm 
        members={members}
        onAddTask={onAddTask}
      />
    </div>
  );
};

export default TasksTab;
