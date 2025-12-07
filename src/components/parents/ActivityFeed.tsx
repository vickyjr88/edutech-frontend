
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Award, BookOpen, Check, Clock, Flag, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { studentService, RecentActivity } from "@/integrations/api/services/student.service";
import { useAuth } from "@/contexts/AuthContext";

interface ActivityItem {
  id: string;
  child: string;
  childInitials: string;
  action: string;
  target: string;
  time: string;
  result?: string;
  progress?: string;
  status?: string;
  type: string;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "assignment":
    case "completed":
      return <Check className="h-4 w-4 text-green-500" />;
    case "achievement":
      return <Award className="h-4 w-4 text-amber-500" />;
    case "course":
    case "enrolled":
      return <BookOpen className="h-4 w-4 text-blue-500" />;
    case "submission":
      return <Flag className="h-4 w-4 text-purple-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

const ActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await studentService.getRecentActivities(user.id);

        if (response.data) {
          const mappedActivities: ActivityItem[] = response.data.map((activity: RecentActivity, index: number) => {
            // Extract child name from userId or use default
            const childName = user.fullName || "Student";
            const initials = childName.split(' ').map(n => n[0]).join('').toUpperCase() || "ST";

            return {
              id: `${activity.userId}-${index}`,
              child: childName,
              childInitials: initials,
              action: activity.type || "performed",
              target: activity.description || "an activity",
              time: formatTimeAgo(activity.timestamp),
              type: activity.type || "activity"
            };
          });
          setActivities(mappedActivities);
        }
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        setError("Failed to load recent activities");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [user?.id, user?.fullName]);

  return (
    <Card className="border border-blue-100">
      <CardHeader className="bg-blue-50/50 pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Activity className="mr-2 h-5 w-5 text-blue-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading activities...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No recent activities</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-kidato-purple text-white text-xs">
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
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
