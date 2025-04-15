
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Bell, Calendar, FileText, Video, HelpCircle } from "lucide-react";

const QuickActions = () => {
  return (
    <Card className="border-2 border-blue-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="flex items-center justify-start text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Assignments
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start text-green-600 border-green-200 hover:bg-green-50"
          >
            <Target className="h-4 w-4 mr-2" />
            Track Progress
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start text-amber-600 border-amber-200 hover:bg-amber-50"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Teachers
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start text-red-600 border-red-200 hover:bg-red-50"
          >
            <Bell className="h-4 w-4 mr-2" />
            Set Reminders
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start text-gray-600 border-gray-200 hover:bg-gray-50"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Get Support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
