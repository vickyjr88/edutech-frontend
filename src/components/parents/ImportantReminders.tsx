
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, CalendarClock, BookOpen, Loader2, Bell } from "lucide-react";
import { assignmentService } from "@/integrations/api/services/assignment.service";
import { eventService } from "@/integrations/api/services/event.service";
import { goalService } from "@/integrations/api/services/goal.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  type: "homework" | "event" | "goal" | "form";
  child?: string;
}

const ImportantReminders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReminders = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Fetch assignments, events, and goals in parallel
        const [assignmentsResponse, eventsResponse, goalsResponse] = await Promise.all([
          assignmentService.getStudentAssignments(user.id).catch(() => ({ data: [] })),
          eventService.getUserEvents(user.id).catch(() => ({ data: [] })),
          goalService.getStudentGoals(user.id, { status: 'active' }).catch(() => ({ data: { goals: [] } }))
        ]);

        const aggregatedReminders: Reminder[] = [];

        // Process assignments
        if (assignmentsResponse.data) {
          const assignments = Array.isArray(assignmentsResponse.data)
            ? assignmentsResponse.data
            : [];

          assignments
            .filter((a: any) => a.status === 'pending' && a.dueDate)
            .forEach((assignment: any) => {
              const dueDate = new Date(assignment.dueDate);
              if (dueDate <= sevenDaysFromNow) {
                const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                aggregatedReminders.push({
                  id: assignment._id || assignment.id,
                  title: assignment.title || "Assignment due",
                  dueDate: formatDueDate(dueDate),
                  priority: daysDiff <= 1 ? "high" : daysDiff <= 3 ? "medium" : "low",
                  type: "homework"
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
              if (eventDate >= now && eventDate <= sevenDaysFromNow) {
                const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                aggregatedReminders.push({
                  id: event._id || event.id,
                  title: event.title || "Event",
                  dueDate: formatDueDate(eventDate),
                  priority: daysDiff <= 1 ? "high" : daysDiff <= 3 ? "medium" : "low",
                  type: "event"
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
              if (dueDate <= sevenDaysFromNow) {
                const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                aggregatedReminders.push({
                  id: goal._id,
                  title: `Goal: ${goal.name}`,
                  dueDate: formatDueDate(dueDate),
                  priority: daysDiff <= 1 ? "high" : daysDiff <= 3 ? "medium" : "low",
                  type: "goal"
                });
              }
            });
        }

        // Sort by priority and due date
        aggregatedReminders.sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        setReminders(aggregatedReminders.slice(0, 5)); // Show top 5 reminders
      } catch (err) {
        console.error("Failed to fetch reminders:", err);
        setError("Failed to load reminders");
        toast({
          title: "Error",
          description: "Failed to load reminders. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
  }, [user?.id, toast]);

  const formatDueDate = (date: Date): string => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "homework":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "event":
        return <CalendarClock className="h-4 w-4 text-purple-500" />;
      case "goal":
        return <AlertCircle className="h-4 w-4 text-green-500" />;
      case "form":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="col-span-2 border-2 border-amber-200">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-3">Important Reminders</h2>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
            <span className="ml-2 text-gray-600">Loading reminders...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-2 border-2 border-amber-200">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-3">Important Reminders</h2>
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reminders.length === 0) {
    return (
      <Card className="col-span-2 border-2 border-amber-200">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-3">Important Reminders</h2>
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No upcoming reminders</p>
            <p className="text-sm mt-1">You're all caught up!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 border-2 border-amber-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Important Reminders</h2>
          <Badge className="bg-amber-500">
            {reminders.length}
          </Badge>
        </div>
        <div className="space-y-2">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-start p-2 rounded-md bg-amber-50 border border-amber-200"
            >
              <div className="p-2 bg-white rounded-md mr-3">
                {getTypeIcon(reminder.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{reminder.title}</span>
                  {getPriorityBadge(reminder.priority)}
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  {reminder.child && (
                    <span className="mr-2">
                      {reminder.child}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Due {reminder.dueDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportantReminders;
