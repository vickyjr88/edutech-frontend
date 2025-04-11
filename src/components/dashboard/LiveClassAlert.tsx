
import { BellRing } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface LiveClassAlertProps {
  currentClass: any;
  onJoinClass: (classItem: any) => void;
}

const LiveClassAlert = ({ currentClass, onJoinClass }: LiveClassAlertProps) => {
  if (!currentClass) return null;
  
  return (
    <Alert 
      className="mb-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-l-red-500 animate-pulse"
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

export default LiveClassAlert;
