
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface MessageTeacherDialogProps {
  teacherName: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void; // Add onClose for compatibility with TeacherPublicProfile
}

export default function MessageTeacherDialog({ 
  teacherName, 
  isOpen: externalIsOpen, 
  onOpenChange: externalOnOpenChange,
  onClose
}: MessageTeacherDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  // Use external state if provided, otherwise use internal state
  const isControlled = externalIsOpen !== undefined && (externalOnOpenChange !== undefined || onClose !== undefined);
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;
  
  // Handle both onOpenChange and onClose patterns
  const setIsOpen = (value: boolean) => {
    if (isControlled) {
      if (externalOnOpenChange) {
        externalOnOpenChange(value);
      } else if (!value && onClose) {
        onClose();
      }
    } else {
      setInternalIsOpen(value);
    }
  };

  const handleSendMessage = () => {
    console.log("Message sent:", messageText);
    setMessageText("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-kidato-blue hover:bg-kidato-dark-blue">
          <MessageSquare className="mr-2 h-4 w-4" />
          Message Teacher
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Message to {teacherName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subject
            </label>
            <Input 
              id="subject" 
              placeholder="Enter message subject"
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <Textarea
              id="message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message here..."
              className="w-full min-h-[150px]"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
