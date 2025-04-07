
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
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppMessageDialogProps {
  teacherName: string;
}

export default function WhatsAppMessageDialog({ teacherName }: WhatsAppMessageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendMessage = () => {
    console.log("Message prepared for WhatsApp:", messageText);
    setMessageText("");
    setIsOpen(false);
    
    // Show toast notification
    toast({
      title: "Message ready to send",
      description: "Please sign up to continue your conversation with this teacher.",
    });
    
    // Redirect to signup page
    setTimeout(() => {
      navigate("/signup", { 
        state: { 
          redirectAfterAuth: window.location.pathname,
          messageData: {
            teacherName,
            message: messageText
          }
        } 
      });
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-kidato-blue hover:bg-kidato-dark-blue">
          <MessageSquare className="mr-2 h-4 w-4" />
          Message on WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send WhatsApp Message to {teacherName}</DialogTitle>
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
            <Button onClick={handleSendMessage} disabled={!messageText.trim()} className="bg-green-600 hover:bg-green-700">
              Continue to WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
