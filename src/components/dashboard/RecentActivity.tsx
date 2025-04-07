
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Clock, CheckCircle, MessageSquare, BookOpen, Award, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "completion",
      description: "Completed Science Quiz",
      time: "15 minutes ago",
      icon: CheckCircle,
      iconColor: "text-green-500",
      iconBg: "bg-green-50",
      points: 50,
      hasEffect: true
    },
    {
      id: 2,
      type: "message",
      description: "Message from Dr. Chen",
      time: "1 hour ago",
      icon: MessageSquare,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
      hasEffect: false
    },
    {
      id: 3,
      type: "streak",
      description: "7-Day Learning Streak",
      time: "Today",
      icon: Flame,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50",
      points: 100,
      hasEffect: true
    },
    {
      id: 4,
      type: "session",
      description: "Attended Math Class",
      time: "Yesterday, 4:30 PM",
      icon: BookOpen,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50",
      points: 25,
      hasEffect: false
    },
    {
      id: 5,
      type: "achievement",
      description: "Earned 'Quick Learner' badge",
      time: "Yesterday, 2:15 PM",
      icon: Award,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-50",
      points: 200,
      hasEffect: true
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className={`${activity.iconBg} p-2 rounded-full mr-3 ${
                activity.hasEffect ? 'animate-pulse' : ''
              }`}>
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <p className="text-sm font-medium">{activity.description}</p>
                  {activity.points && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      +{activity.points} XP
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-3">
        <div className="text-center w-full">
          <Badge variant="outline" className="bg-green-50">
            <span className="font-medium">+375 XP</span> earned today
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
