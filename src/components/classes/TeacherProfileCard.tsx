
import { User, MessageSquare, Star, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface TeacherProfileCardProps {
  teacher: {
    name: string;
    imageSrc?: string;
    subject: string;
    experience?: string;
    rating?: number;
    bio?: string;
    videoProfileUrl?: string;
  };
}

const TeacherProfileCard = ({ teacher }: TeacherProfileCardProps) => {
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    // In a real app, this would send the message to the backend
    console.log("Message sent:", messageText);
    setMessageText("");
    setIsMessageDialogOpen(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Meet Your Teacher</h2>
        {teacher.rating && (
          <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{teacher.rating}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
          {teacher.imageSrc ? (
            <img 
              src={teacher.imageSrc} 
              alt={teacher.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-kidato-light-blue">
              <User className="h-10 w-10 text-kidato-blue" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="mb-2">
            <h3 className="text-lg font-medium text-gray-900">{teacher.name}</h3>
            <p className="text-gray-600">Expert in {teacher.subject}</p>
          </div>
          
          {teacher.experience && (
            <p className="text-sm text-gray-500 mb-2">{teacher.experience}</p>
          )}
          
          {teacher.bio && (
            <p className="text-gray-700 mb-4">{teacher.bio}</p>
          )}
          
          <div className="flex flex-wrap gap-3">
            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-kidato-blue hover:bg-kidato-dark-blue">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Send Message to {teacher.name}</DialogTitle>
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

            {teacher.videoProfileUrl && (
              <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-kidato-blue text-kidato-blue hover:bg-kidato-blue/10">
                    <Video className="mr-2 h-4 w-4" />
                    Watch Video Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
                  <DialogHeader className="p-6 pb-0">
                    <DialogTitle>{teacher.name}'s Video Profile</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video w-full">
                    <iframe
                      src={teacher.videoProfileUrl}
                      title={`${teacher.name}'s video profile`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileCard;
