
import { Calendar, Clock, MapPin, Sparkles, Book, Users, Gift, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { mockEvents } from "./mockScheduleData";

export function UpcomingEvents() {
  const today = new Date();
  const events = [...mockEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return (
    <Card className="border-2 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
        <CardTitle className="text-lg font-bold flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-500" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {events.slice(0, 5).map((event, idx) => {
            const eventDate = new Date(event.date);
            const isToday = isSameDay(eventDate, today);
            const eventIcon = getEventIcon(event.type);
            
            return (
              <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{event.title}</h3>
                  <Badge className={getEventBadgeClass(event.type)}>
                    {formatEventType(event.type)}
                  </Badge>
                </div>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400" />
                    <span>{isToday ? "Today" : format(eventDate, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-2 text-gray-400" />
                    <span>{event.time}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-2 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.description && (
                    <div className="flex items-start mt-2">
                      <span className="mr-2">{eventIcon}</span>
                      <span className="text-gray-500">{event.description}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" className="w-full">
            View All Events
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getEventBadgeClass(type: string) {
  switch (type) {
    case "class":
      return "bg-blue-100 text-blue-700 hover:bg-blue-200";
    case "hangout":
      return "bg-green-100 text-green-700 hover:bg-green-200";
    case "birthday":
      return "bg-amber-100 text-amber-700 hover:bg-amber-200";
    case "achievement":
      return "bg-purple-100 text-purple-700 hover:bg-purple-200";
    case "assignment":
      return "bg-rose-100 text-rose-700 hover:bg-rose-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-200";
  }
}

function formatEventType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function getEventIcon(type: string) {
  switch (type) {
    case "class":
      return <Book className="h-4 w-4 text-blue-500" />;
    case "hangout":
      return <Users className="h-4 w-4 text-green-500" />;
    case "birthday":
      return <Gift className="h-4 w-4 text-amber-500" />;
    case "achievement":
      return <Award className="h-4 w-4 text-purple-500" />;
    case "assignment":
      return <Sparkles className="h-4 w-4 text-rose-500" />;
    default:
      return <Calendar className="h-4 w-4 text-gray-500" />;
  }
}
