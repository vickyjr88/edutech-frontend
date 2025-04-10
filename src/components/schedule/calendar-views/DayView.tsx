
import { format } from "date-fns";
import { mockEvents } from "../mockScheduleData";
import { cn } from "@/lib/utils";
import { EventActions } from "../EventActions";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EventFormDialog } from "../EventFormDialog";

interface DayViewProps {
  date: Date;
}

export function DayView({ date }: DayViewProps) {
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  
  const dateStr = format(date, "yyyy-MM-dd");
  const events = mockEvents.filter(event => 
    format(new Date(event.date), "yyyy-MM-dd") === dateStr
  );
  
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

  const handleAddEvent = (hour: number) => {
    setSelectedHour(hour);
    
    // Set the selected date with the right hour
    const newDate = new Date(date);
    newDate.setHours(hour, 0, 0, 0);
    
    setShowAddEventDialog(true);
  };
  
  return (
    <>
      <div className="bg-white rounded-md shadow-sm border">
        <div className="grid grid-cols-1">
          {/* Time grid */}
          {hours.map((hour, idx) => {
            // Filter events for this specific hour
            const hourEvents = events.filter(event => 
              new Date(event.date).getHours() === hour
            );
            
            return (
              <div key={idx} className="min-h-20 border-b last:border-b-0 grid grid-cols-10">
                <div className="col-span-1 text-xs text-gray-500 text-right pr-2 pt-1 border-r">
                  {hour % 12 === 0 ? "12" : hour % 12}:00 {hour >= 12 ? "PM" : "AM"}
                </div>
                
                <div className="col-span-9 relative p-1">
                  {hourEvents.length === 0 && (
                    <div className="h-full min-h-[4rem] flex items-center justify-center text-sm text-gray-400 group relative">
                      {hour >= 9 && hour <= 15 ? (
                        <>
                          <span>Available for scheduling</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 p-0 absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleAddEvent(hour)}
                          >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Add event</span>
                          </Button>
                        </>
                      ) : ""}
                    </div>
                  )}
                  
                  {hourEvents.map((event, eventIdx) => (
                    <div 
                      key={eventIdx}
                      className={cn(
                        "mb-1 p-2 rounded-lg relative group",
                        getEventClass(event.type)
                      )}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm">{event.time}</div>
                      <div className="text-sm mt-1">{event.location}</div>
                      {event.description && (
                        <div className="text-sm mt-1 text-gray-600">{event.description}</div>
                      )}
                      <EventActions 
                        event={event} 
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Form Dialog for quick add via time slot */}
      {selectedHour !== null && (
        <EventFormDialog
          open={showAddEventDialog}
          onOpenChange={(open) => {
            setShowAddEventDialog(open);
            if (!open) setSelectedHour(null);
          }}
          eventToEdit={{
            id: "",
            title: "",
            date: format(new Date(date).setHours(selectedHour, 0, 0, 0), "yyyy-MM-dd'T'HH:mm"),
            time: `${selectedHour % 12 === 0 ? '12' : selectedHour % 12}:00 ${selectedHour >= 12 ? 'PM' : 'AM'}`,
            location: "",
            description: "",
            type: "class",
            duration: 1
          }}
        />
      )}
    </>
  );
}

function getEventClass(type: string) {
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
}
