
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { mockEvents } from "../mockScheduleData";
import { Badge } from "@/components/ui/badge";

interface MonthViewProps {
  month: Date;
  onDateSelect: (date: Date) => void;
}

export function MonthView({ month, onDateSelect }: MonthViewProps) {
  const eventsByDate = mockEvents.reduce((acc, event) => {
    const dateStr = format(new Date(event.date), "yyyy-MM-dd");
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(event);
    return acc;
  }, {} as Record<string, typeof mockEvents>);
  
  return (
    <div className="bg-white rounded-md shadow-sm border">
      <Calendar
        mode="single"
        month={month}
        onDayClick={onDateSelect}
        className="w-full"
        classNames={{
          day_selected: "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 focus:bg-blue-100 focus:text-blue-700",
          day_today: "border border-blue-500 text-blue-900 bg-blue-50",
          cell: "h-24 p-0 relative", // Increased height for more room
          day: "h-full w-full p-0"
        }}
        components={{
          DayContent: (props) => {
            const dateStr = format(props.date, "yyyy-MM-dd");
            const events = eventsByDate[dateStr] || [];
            
            return (
              <div className="flex flex-col h-full w-full p-1">
                {/* Date number in top corner */}
                <div className="text-right text-sm font-medium p-1">
                  {props.date.getDate()}
                </div>
                
                {/* Event badges - stacked vertically */}
                <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                  {events.slice(0, 2).map((event, i) => (
                    <Badge 
                      key={i} 
                      className={`text-xs truncate py-0.5 px-1.5 ${getEventBadgeClass(event.type)}`}
                      title={event.title} // Show full title on hover
                    >
                      <span className="truncate block max-w-full">{event.title}</span>
                    </Badge>
                  ))}
                  
                  {/* More indicator - positioned at bottom */}
                  {events.length > 2 && (
                    <div className="text-xs text-gray-500 mt-auto text-center">
                      +{events.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          }
        }}
      />
    </div>
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
