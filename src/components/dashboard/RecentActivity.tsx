
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Clock, CheckCircle, MessageSquare, BookOpen, Award, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useRecentActivities } from '@/hooks/use-student-service';
import { useAuth } from "@/contexts/AuthContext";

export default function RecentActivity() {
  const { user } = useAuth();
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);
  const [celebratedPoints, setCelebratedPoints] = useState<number[]>([]);

  const { data: recentActivitiesResponse, isLoading, error } = useRecentActivities(user.id);
  const activities = recentActivitiesResponse?.data || [];

  const totalPoints = 0; // Points are not available from the API response

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Loading recent activities...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            Error loading activities: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent activities found.
            </div>
          ) : (
            activities.map((activity, index) => (
              <div 
                key={index} // Using index as key, consider using a unique ID from activity if available
                className={`flex items-start p-3 rounded-md transition-all duration-200 cursor-pointer ${
                  expandedActivity === index ? 'bg-gray-50' : ''
                } hover:bg-gray-50`}
                onClick={() => handleActivityClick(index)}
              >
                <div 
                  className={`bg-blue-50 p-2 rounded-full mr-3`}
                >
                  <Clock className={`h-4 w-4 text-blue-500`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium">{activity.description}</p>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{new Date(activity.timestamp).toLocaleString()}</span>
                  </div>
                  {expandedActivity === index && activity.type && (
                    <p className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded border-l-2 border-blue-300 animate-fade-in">
                      Type: {activity.type}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
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
