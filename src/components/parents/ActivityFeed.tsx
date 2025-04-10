
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Award, BookOpen, Check, Clock, Flag } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Mock activities data
const activities = [
  {
    id: 1,
    child: "Emma",
    childInitials: "EJ",
    action: "completed",
    target: "Math Quiz: Algebra Basics",
    time: "2 hours ago",
    result: "92%",
    type: "assignment"
  },
  {
    id: 2,
    child: "Noah",
    childInitials: "NJ",
    action: "received",
    target: "Science Gold Badge",
    time: "Yesterday",
    type: "achievement"
  },
  {
    id: 3,
    child: "Emma",
    childInitials: "EJ",
    action: "started",
    target: "History Course: Ancient Civilizations",
    time: "Yesterday",
    progress: "12%",
    type: "course"
  },
  {
    id: 4,
    child: "Noah",
    childInitials: "NJ",
    action: "submitted",
    target: "Art Project: Creative Expressions",
    time: "2 days ago",
    status: "Under review",
    type: "submission"
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "assignment":
      return <Check className="h-4 w-4 text-green-500" />;
    case "achievement":
      return <Award className="h-4 w-4 text-amber-500" />;
    case "course":
      return <BookOpen className="h-4 w-4 text-blue-500" />;
    case "submission":
      return <Flag className="h-4 w-4 text-purple-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const ActivityFeed = () => {
  return (
    <Card className="border border-blue-100">
      <CardHeader className="bg-blue-50/50 pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Activity className="mr-2 h-5 w-5 text-blue-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id}>
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-kidato-blue text-white text-xs">
                    {activity.childInitials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{activity.child}</span>
                    <span className="text-gray-600">{activity.action}</span>
                    <span className="font-medium">{activity.target}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm">
                    <span className="text-gray-500">{activity.time}</span>
                    
                    {activity.result && (
                      <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-200">
                        Score: {activity.result}
                      </Badge>
                    )}
                    
                    {activity.progress && (
                      <div className="flex items-center">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: activity.progress }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-600">{activity.progress}</span>
                      </div>
                    )}
                    
                    {activity.status && (
                      <Badge variant="secondary">
                        {activity.status}
                      </Badge>
                    )}
                    
                    <div className="ml-auto flex items-center">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                </div>
              </div>
              
              {index < activities.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
