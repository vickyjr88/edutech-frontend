
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
      className={`mb-4 ${isReminder ? 'bg-white border border-amber-200' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-amber-200'} ${!isReminder && 'animate-pulse'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-amber-500 mr-2 animate-pulse"></div>
            <BellRing className="h-5 w-5 text-amber-500 mr-2" />
          </div>
          <AlertDescription className="text-amber-800 font-medium">
            You have a live class happening now: {currentClass.title}
          </AlertDescription>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="border-amber-300 text-amber-600 hover:bg-amber-100"
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
    className: "bg-white border-amber-200 shadow-lg",
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
