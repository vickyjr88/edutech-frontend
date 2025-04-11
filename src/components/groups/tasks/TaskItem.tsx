
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Trash2 } from "lucide-react";

interface TaskItemProps {
  id: number;
  title: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: string;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskItem = ({ 
  id, 
  title, 
  completed, 
  assignedTo,
  dueDate, 
  onToggleComplete, 
  onDelete 
}: TaskItemProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-1 sm:mb-0">
        <Button 
          variant="outline" 
          size="icon" 
          className={`rounded-full p-0 h-6 w-6 ${completed ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100'}`}
          onClick={() => onToggleComplete(id)}
        >
          {completed && <CheckCircle2 className="h-4 w-4" />}
        </Button>
        <span className={completed ? 'line-through text-gray-500' : ''}>{title}</span>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 ml-9 sm:ml-0">
        {assignedTo && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {assignedTo}
          </Badge>
        )}
        
        {dueDate && (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Calendar className="mr-1 h-3 w-3" /> {dueDate}
          </Badge>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
