
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface Member {
  id: number;
  name: string;
}

interface AddTaskFormProps {
  members: Member[];
  onAddTask: (title: string, assignedTo?: number, dueDate?: Date) => void;
}

const AddTaskForm = ({ members, onAddTask }: AddTaskFormProps) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedMember, setSelectedMember] = useState<number | undefined>(undefined);

  const handleSubmit = () => {
    if (!taskTitle.trim()) return;
    
    onAddTask(taskTitle, selectedMember, selectedDate);
    setTaskTitle("");
    setSelectedDate(undefined);
    setSelectedMember(undefined);
  };

  return (
    <div className="space-y-3 p-4 border border-gray-100 rounded-lg bg-gray-50">
      <h3 className="font-medium">Add New Task</h3>
      
      <Input 
        placeholder="Task title..." 
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="w-full"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : <span className="text-muted-foreground">Set due date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Select 
          value={selectedMember?.toString()} 
          onValueChange={(value) => setSelectedMember(value ? parseInt(value) : undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Assign to member" />
          </SelectTrigger>
          <SelectContent>
            {members.map(member => (
              <SelectItem key={member.id} value={member.id.toString()}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={handleSubmit} 
        className="w-full bg-kidato-purple hover:bg-kidato-dark-blue"
        disabled={!taskTitle.trim()}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </div>
  );
};

export default AddTaskForm;
