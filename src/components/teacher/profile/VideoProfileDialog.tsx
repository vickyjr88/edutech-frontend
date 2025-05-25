
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VideoProfileDialogProps {
  teacherName: string;
  videoUrl: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export default function VideoProfileDialog({ 
  teacherName, 
  videoUrl,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
  onClose
}: VideoProfileDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-kidato-purple text-kidato-purple hover:bg-kidato-purple/10">
          <Video className="mr-2 h-4 w-4" />
          Watch Video Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{teacherName}'s Video Profile</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full">
          <iframe
            src={videoUrl}
            title={`${teacherName}'s video profile`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}
