
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BookOpen, Calendar, Check, Clock, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: "Permission slip needed",
    description: "Please sign the permission slip for the Science Museum trip",
    time: "1 hour ago",
    type: "action",
    priority: "high"
  },
  {
    id: 2,
    title: "New report card available",
    description: "Emma's quarterly report card is now available to view",
    time: "Yesterday",
    type: "document",
    priority: "medium"
  },
  {
    id: 3,
    title: "Upcoming parent-teacher meeting",
    description: "Reminder: Meeting scheduled for April 15th",
    time: "2 days ago",
    type: "event",
    priority: "medium"
  },
  {
    id: 4,
    title: "Assignment overdue",
    description: "Noah has an overdue Math assignment",
    time: "3 days ago",
    type: "alert",
    priority: "high"
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "action":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "document":
      return <BookOpen className="h-4 w-4 text-green-500" />;
    case "event":
      return <Calendar className="h-4 w-4 text-amber-500" />;
    case "alert":
      return <Clock className="h-4 w-4 text-red-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700 hover:bg-red-200";
    case "medium":
      return "bg-amber-100 text-amber-700 hover:bg-amber-200";
    case "low":
      return "bg-green-100 text-green-700 hover:bg-green-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-200";
  }
};

const NotificationsPanel = () => {
  return (
    <Card className="border border-blue-100">
      <CardHeader className="bg-blue-50/50 pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blue-500" />
            Notifications
          </div>
          <Badge className="bg-red-500">{notifications.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-0">
          {notifications.map((notification, index) => (
            <div key={notification.id}>
              <div className="py-3">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-1.5 rounded-md mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{notification.title}</h4>
                      <Badge variant="secondary" className={getPriorityStyles(notification.priority)}>
                        {notification.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{notification.time}</span>
                      
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <X className="h-3.5 w-3.5 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {index < notifications.length - 1 && <Separator />}
            </div>
          ))}
        </div>
        
        <Button variant="outline" size="sm" className="w-full mt-2">
          View All Notifications
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;
