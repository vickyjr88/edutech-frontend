
import { BellRing } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LiveClassAlertProps {
  currentClass: any;
  onJoinClass: (classItem: any) => void;
  isReminder?: boolean;
}

const LiveClassAlert = ({ currentClass, onJoinClass, isReminder = false }: LiveClassAlertProps) => {
  if (!currentClass) return null;
  
  return (
    <Alert 
      className={`mb-4 ${isReminder ? 'bg-white border border-red-200' : 'bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-l-red-500'} ${!isReminder && 'animate-pulse'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BellRing className="h-5 w-5 text-red-500 mr-2" />
          <AlertDescription className="text-red-800 font-medium">
            You have a live class happening now: {currentClass.title}
          </AlertDescription>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="border-red-300 text-red-600 hover:bg-red-100"
          onClick={() => onJoinClass(currentClass)}
        >
          Join Now
        </Button>
      </div>
    </Alert>
  );
};

// This function creates a class reminder that can be used with the toast system
export const showClassReminder = (toast: any, currentClass: any, onJoinClass: (classItem: any) => void) => {
  if (!currentClass) return;

  toast({
    duration: 10000, // Stay visible for 10 seconds
    className: "bg-white border-red-200 shadow-lg",
    position: "top-right",
    description: (
      <div className="w-full">
        <LiveClassAlert 
          currentClass={currentClass} 
          onJoinClass={onJoinClass} 
          isReminder={true} 
        />
      </div>
    ),
  });
};

export default LiveClassAlert;
