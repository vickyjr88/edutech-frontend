
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Loader2 } from "lucide-react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScheduleEvent } from "@/types/calendar";
import { Separator } from "@/components/ui/separator";
import { EventActions } from "./EventActions";
import { useCurrentUpcomingSessions } from "@/hooks/use-student-service";
import type { UpcomingSession } from "@/integrations/api/services/student.service";

export function UpcomingEvents() {
  const { data: upcomingSessionsResponse, isLoading } = useCurrentUpcomingSessions();

  // Transform UpcomingSession data to ScheduleEvent format
  const transformSessionToEvent = (session: UpcomingSession): ScheduleEvent => {
    const startTime = new Date(session.startTime);
    const endTime = new Date(startTime.getTime() + session.duration * 60 * 60 * 1000);

    return {
      id: parseInt(session.classId.substring(session.classId.length - 8), 16),
      title: session.title,
      date: session.startTime,
      time: `${format(startTime, "h:mm a")} - ${format(endTime, "h:mm a")}`,
      location: session.cohortName,
      description: `${session.subject} with ${session.teacherName}`,
      type: "class",
      duration: session.duration,
    };
  };

  // Process and sort events
  const events = useMemo(() => {
    if (!upcomingSessionsResponse?.data) return [];

    const transformedEvents = upcomingSessionsResponse.data.map(transformSessionToEvent);

    // Sort events by date
    const sortedEvents = transformedEvents.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // Get only upcoming events (today and future)
    const upcomingEvents = sortedEvents.filter((event) => {
      const eventDate = new Date(event.date);
      const now = new Date();
      return eventDate >= new Date(now.setHours(0, 0, 0, 0));
    });

    return upcomingEvents.slice(0, 8); // Show first 8 upcoming events
  }, [upcomingSessionsResponse]);

  const formatEventDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return format(date, "EEE, MMM d");
    }
  };

  const getEventBadgeClass = (type: string) => {
    switch (type) {
      case "class":
        return "bg-blue-100 text-blue-700";
      case "hangout":
        return "bg-green-100 text-green-700";
      case "birthday":
        return "bg-amber-100 text-amber-700";
      case "achievement":
        return "bg-purple-100 text-purple-700";
      case "assignment":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="border-2 border-blue-100 h-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
        <CardTitle className="text-lg font-bold flex items-center">
          <CalendarClock className="mr-2 h-5 w-5 text-blue-500" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No upcoming sessions scheduled
              </div>
            ) : (
              events.map((event, index) => (
                <div key={event.id}>
                  {(index === 0 || formatEventDate(event.date) !== formatEventDate(events[index - 1].date)) && (
                    <div className="sticky top-0 bg-white pt-2 pb-1 font-medium text-sm text-gray-500 z-10">
                      {formatEventDate(event.date)}
                    </div>
                  )}
                  <div className="group relative p-3 rounded-md hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between">
                      <Badge className={getEventBadgeClass(event.type)}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                      <EventActions
                        event={event}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <h3 className="font-medium mt-1">{event.title}</h3>
                    <div className="text-xs text-gray-500 mt-1">{event.time}</div>
                    {event.location && (
                      <div className="text-xs text-gray-500">{event.location}</div>
                    )}
                  </div>
                  {index < events.length - 1 && <Separator className="my-1" />}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
