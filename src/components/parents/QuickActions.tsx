import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Bell, 
  Calendar, 
  FileText, 
  Video, 
  HelpCircle, 
  Target as TargetIcon,
  CreditCard,
  BookOpen,
  User
} from "lucide-react";

const QuickActions = () => {
  return (
    <Card className="border border-blue-100 shadow-sm h-full">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-4 text-kidato-purple">Parent Quick Actions</h2>
        
        <div className="space-y-4">
          {/* Priority Actions Group */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button 
                className="flex items-center justify-start text-white bg-red-500 hover:bg-red-600 w-full"
              >
                <Video className="h-4 w-4 mr-2" />
                Join Live Class
              </Button>
              <Button 
                className="flex items-center justify-start text-white bg-amber-500 hover:bg-amber-600 w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Review Pending Homework
              </Button>
            </div>
          </div>
          
          {/* Support Actions Group */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Support Learning</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="flex items-center justify-start text-blue-600 border-blue-200 hover:bg-blue-50 w-full"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View Course Material
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-start text-purple-600 border-purple-200 hover:bg-purple-50 w-full"
              >
                <TargetIcon className="h-4 w-4 mr-2" />
                Set Learning Goals
              </Button>
            </div>
          </div>
          
          {/* Communication Actions Group */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Communication</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="flex items-center justify-start text-green-600 border-green-200 hover:bg-green-50 w-full"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Teachers
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-start text-amber-600 border-amber-200 hover:bg-amber-50 w-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
          
          {/* Additional Actions Group */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Additional</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="flex items-center justify-start text-blue-600 border-blue-200 hover:bg-blue-50 w-full"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-start text-gray-600 border-gray-200 hover:bg-gray-50 w-full"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Get Support
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;