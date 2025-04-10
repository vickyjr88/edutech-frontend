
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock upcoming events data
const events = [
  {
    id: 1,
    title: "Parent-Teacher Conference",
    date: "Apr 15, 2025",
    time: "3:30 PM - 4:00 PM",
    location: "Virtual Meeting",
    type: "meeting"
  },
  {
    id: 2,
    title: "Math Competition",
    date: "Apr 22, 2025",
    time: "9:00 AM - 12:00 PM",
    location: "School Gymnasium",
    type: "event"
  },
  {
    id: 3,
    title: "Science Project Due",
    date: "Apr 28, 2025",
    time: "Before 4:00 PM",
    location: "Room 203",
    type: "deadline"
  }
];

const eventTypeStyles = {
  meeting: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  event: "bg-green-100 text-green-700 hover:bg-green-200",
  deadline: "bg-amber-100 text-amber-700 hover:bg-amber-200"
};

const UpcomingEvents = () => {
  return (
    <Card className="border border-blue-100">
      <CardHeader className="bg-blue-50/50 pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-500" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{event.title}</h3>
                <Badge variant="secondary" className={eventTypeStyles[event.type as keyof typeof eventTypeStyles]}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </Badge>
              </div>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-2 text-gray-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-2 text-gray-400" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
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
