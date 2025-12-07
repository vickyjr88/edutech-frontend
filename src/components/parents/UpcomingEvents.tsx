
import { Calendar, Clock, MapPin, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { studentService, UpcomingSession } from "@/integrations/api/services/student.service";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const UpcomingEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<UpcomingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Using upcoming sessions as events
        const response = await studentService.getUpcomingSessions(user.id);
        if (response.data) {
          setEvents(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch upcoming events", err);
        setError("Failed to load upcoming events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user?.id]);

  const getEventTypeStyle = (type: string) => {
    // Determine style based on session type or default
    return "bg-blue-100 text-blue-700 hover:bg-blue-200";
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (dateString: string, durationMinutes: number) => {
    try {
      const start = new Date(dateString);
      const end = new Date(start.getTime() + durationMinutes * 60000);
      return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
    } catch (e) {
      return "";
    }
  };

  return (
    <Card className="border border-blue-100">
      <CardHeader className="bg-blue-50/50 pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-500" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading events...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No upcoming events scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.slice(0, 5).map((event, index) => (
              <div key={`${event.classId}-${index}`} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{event.title}</h3>
                  <Badge variant="secondary" className={getEventTypeStyle(event.sessionType)}>
                    {event.sessionType || 'Class'}
                  </Badge>
                </div>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400" />
                    <span>{formatDate(event.startTime)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-2 text-gray-400" />
                    <span>{formatTime(event.startTime, event.duration)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-2 text-gray-400" />
                    <span>Online Class</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" className="w-full">
            View All Events
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
