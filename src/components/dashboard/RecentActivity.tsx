
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, MessageSquare, BookOpen, Award } from "lucide-react";

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "completion",
      description: "Completed Science Quiz",
      time: "15 minutes ago",
      icon: CheckCircle,
      iconColor: "text-green-500",
      iconBg: "bg-green-50"
    },
    {
      id: 2,
      type: "message",
      description: "Message from Dr. Chen",
      time: "1 hour ago",
      icon: MessageSquare,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50"
    },
    {
      id: 3,
      type: "session",
      description: "Attended Math Class",
      time: "Yesterday, 4:30 PM",
      icon: BookOpen,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50"
    },
    {
      id: 4,
      type: "achievement",
      description: "Earned 'Quick Learner' badge",
      time: "Yesterday, 2:15 PM",
      icon: Award,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-50"
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
              <div className={`${activity.iconBg} p-2 rounded-full mr-3`}>
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
