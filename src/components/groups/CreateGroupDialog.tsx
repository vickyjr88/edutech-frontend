
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreate?: (groupData: any) => void;
}

const subjects = [
  "Mathematics", 
  "Science", 
  "English", 
  "History", 
  "Art",
  "Music",
  "Computer Science",
  "Physical Education",
  "Geography",
  "Foreign Language"
];

const CreateGroupDialog = ({ open, onOpenChange, onGroupCreate }: CreateGroupDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
    meetingTime: "",
    deadline: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically handle the API call to create a group
    if (onGroupCreate) {
      onGroupCreate({
        ...formData,
        id: Math.floor(Math.random() * 1000), // Temporary ID generation
        progress: 0,
        members: [{ id: 1, name: "John D", image: "" }] // Current user
      });
    }
    
    // Close the dialog
    onOpenChange(false);
    
    // Reset form
    setFormData({
      name: "",
      subject: "",
      description: "",
      meetingTime: "",
      deadline: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a new collaborative group for your project or study session.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter group name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={formData.subject} 
                onValueChange={handleSubjectChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the purpose of your group"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meetingTime">Meeting Time</Label>
              <Input 
                id="meetingTime"
                name="meetingTime"
                value={formData.meetingTime}
                onChange={handleChange}
                placeholder="e.g., Tuesday, 4:00 PM"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Project Deadline</Label>
              <Input 
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                placeholder="e.g., June 15, 2025"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-kidato-blue hover:bg-kidato-dark-blue"
            >
              Create Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
