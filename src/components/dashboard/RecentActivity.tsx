
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Clock, CheckCircle, MessageSquare, BookOpen, Award, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function RecentActivity() {
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);
  const [celebratedPoints, setCelebratedPoints] = useState<number[]>([]);

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
      hasEffect: true,
      details: "You answered 9 out of 10 questions correctly! Great job understanding photosynthesis."
    },
    {
      id: 2,
      type: "message",
      description: "Message from Dr. Chen",
      time: "1 hour ago",
      icon: MessageSquare,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
      hasEffect: false,
      details: "Your last assignment showed great progress. Let's discuss your approach in our next session."
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
      hasEffect: true,
      details: "You've been learning for 7 days in a row! Keep going to increase your streak bonus."
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
      hasEffect: false,
      details: "You spent 45 minutes learning about quadratic equations and completed all practice problems."
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
      hasEffect: true,
      details: "Awarded for completing 5 lessons in a single day. This badge will appear on your profile!"
    }
  ];

  const totalPoints = activities.reduce((sum, activity) => 
    activity.points ? sum + activity.points : sum, 0
  );

  const handleActivityClick = (index: number) => {
    setExpandedActivity(expandedActivity === index ? null : index);
  };

  const celebratePoints = (id: number, points: number) => {
    if (celebratedPoints.includes(id)) return;
    
    toast({
      title: "XP Earned!",
      description: `+${points} XP added to your account`,
      variant: "default",
    });
    
    setCelebratedPoints([...celebratedPoints, id]);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`flex items-start p-3 rounded-md transition-all duration-200 cursor-pointer ${
                expandedActivity === index ? 'bg-gray-50' : ''
              } hover:bg-gray-50`}
              onClick={() => handleActivityClick(index)}
            >
              <div 
                className={`${activity.iconBg} p-2 rounded-full mr-3 ${
                  activity.hasEffect ? 'animate-pulse' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (activity.points) {
                    celebratePoints(activity.id, activity.points);
                  }
                }}
              >
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <p className="text-sm font-medium">{activity.description}</p>
                  {activity.points && (
                    <Badge 
                      variant="outline" 
                      className={`ml-2 text-xs ${
                        celebratedPoints.includes(activity.id) ? 'bg-green-50 text-green-600' : ''
                      }`}
                    >
                      +{activity.points} XP
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{activity.time}</span>
                </div>
                {expandedActivity === index && activity.details && (
                  <p className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded border-l-2 border-blue-300 animate-fade-in">
                    {activity.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-3">
        <div className="text-center w-full">
          <Badge variant="outline" className="bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
            <span className="font-medium">{totalPoints} XP</span> earned today
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
