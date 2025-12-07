
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BookOpen, Calendar, Check, Clock, FileText, X, Loader2, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { assignmentService } from "@/integrations/api/services/assignment.service";
import { eventService } from "@/integrations/api/services/event.service";
import { goalService } from "@/integrations/api/services/goal.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "action" | "document" | "event" | "alert";
  priority: "high" | "medium" | "low";
  timestamp: Date;
}

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const now = new Date();

        // Fetch data from multiple sources
        const [assignmentsResponse, eventsResponse, goalsResponse] = await Promise.all([
          assignmentService.getStudentAssignments(user.id).catch(() => ({ data: [] })),
          eventService.getUserEvents(user.id).catch(() => ({ data: [] })),
          goalService.getStudentGoals(user.id, { status: 'active' }).catch(() => ({ data: { goals: [] } }))
        ]);

        const aggregatedNotifications: Notification[] = [];

        // Process assignments
        if (assignmentsResponse.data) {
          const assignments = Array.isArray(assignmentsResponse.data)
            ? assignmentsResponse.data
            : [];

          // Overdue assignments
          assignments
            .filter((a: any) => a.status === 'pending' && a.dueDate)
            .forEach((assignment: any) => {
              const dueDate = new Date(assignment.dueDate);
              const isOverdue = dueDate < now;
              const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

              if (isOverdue) {
                aggregatedNotifications.push({
                  id: `assignment-overdue-${assignment._id || assignment.id}`,
                  title: "Assignment overdue",
                  description: `${assignment.title} is overdue`,
                  time: formatDistanceToNow(dueDate, { addSuffix: true }),
                  type: "alert",
                  priority: "high",
                  timestamp: dueDate
                });
              } else if (daysDiff <= 2) {
                aggregatedNotifications.push({
                  id: `assignment-due-${assignment._id || assignment.id}`,
                  title: "Assignment due soon",
                  description: `${assignment.title} is due ${daysDiff === 0 ? 'today' : daysDiff === 1 ? 'tomorrow' : `in ${daysDiff} days`}`,
                  time: formatDistanceToNow(now, { addSuffix: true }),
                  type: "action",
                  priority: daysDiff === 0 ? "high" : "medium",
                  timestamp: now
                });
              }
            });

          // Graded assignments
          assignments
            .filter((a: any) => a.status === 'graded' && a.updatedAt)
            .slice(0, 2)
            .forEach((assignment: any) => {
              const updatedDate = new Date(assignment.updatedAt);
              const hoursSinceUpdate = (now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60);

              if (hoursSinceUpdate < 48) {
                aggregatedNotifications.push({
                  id: `assignment-graded-${assignment._id || assignment.id}`,
                  title: "Assignment graded",
                  description: `${assignment.title} has been graded`,
                  time: formatDistanceToNow(updatedDate, { addSuffix: true }),
                  type: "document",
                  priority: "medium",
                  timestamp: updatedDate
                });
              }
            });
        }

        // Process events
        if (eventsResponse.data) {
          const events = Array.isArray(eventsResponse.data)
            ? eventsResponse.data
            : [];

          events
            .filter((e: any) => e.startDate)
            .forEach((event: any) => {
              const eventDate = new Date(event.startDate);
              const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

              if (daysDiff >= 0 && daysDiff <= 3) {
                aggregatedNotifications.push({
                  id: `event-${event._id || event.id}`,
                  title: daysDiff === 0 ? "Event today" : "Upcoming event",
                  description: `${event.title} ${daysDiff === 0 ? 'is today' : daysDiff === 1 ? 'is tomorrow' : `is in ${daysDiff} days`}`,
                  time: formatDistanceToNow(now, { addSuffix: true }),
                  type: "event",
                  priority: daysDiff === 0 ? "high" : "medium",
                  timestamp: now
                });
              }
            });
        }

        // Process goals
        if (goalsResponse.data?.goals) {
          goalsResponse.data.goals
            .filter((g: any) => g.dueDate)
            .forEach((goal: any) => {
              const dueDate = new Date(goal.dueDate);
              const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

              if (daysDiff >= 0 && daysDiff <= 7 && goal.progress < 50) {
                aggregatedNotifications.push({
                  id: `goal-${goal._id}`,
                  title: "Goal progress reminder",
                  description: `${goal.name} is ${goal.progress}% complete and due ${daysDiff === 0 ? 'today' : `in ${daysDiff} days`}`,
                  time: formatDistanceToNow(now, { addSuffix: true }),
                  type: "action",
                  priority: daysDiff <= 2 ? "high" : "medium",
                  timestamp: now
                });
              }
            });
        }

        // Sort by priority and timestamp
        aggregatedNotifications.sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }
          return b.timestamp.getTime() - a.timestamp.getTime();
        });

        setNotifications(aggregatedNotifications.slice(0, 10)); // Show top 10
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Failed to load notifications");
        toast({
          title: "Error",
          description: "Failed to load notifications. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id, toast]);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleDismiss = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  if (isLoading) {
    return (
      <Card className="border border-blue-100">
        <CardHeader className="bg-blue-50/50 pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blue-500" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading notifications...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-blue-100">
        <CardHeader className="bg-blue-50/50 pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blue-500" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-8 text-gray-500">
            <BellOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-blue-100">
      <CardHeader className="bg-blue-50/50 pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blue-500" />
            Notifications
          </div>
          {notifications.length > 0 && (
            <Badge className="bg-red-500">{notifications.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BellOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No new notifications</p>
            <p className="text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          <>
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
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="h-3.5 w-3.5 text-green-600" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => handleDismiss(notification.id)}
                            >
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;
