
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { ScheduleEvent } from "../mockScheduleData";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MonthViewProps {
  month: Date;
  onDateSelect: (date: Date) => void;
  events?: ScheduleEvent[];
}

export function MonthView({ month, onDateSelect, events = [] }: MonthViewProps) {
  const eventsByDate = events.reduce((acc, event) => {
    const dateStr = format(new Date(event.date), "yyyy-MM-dd");
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(event);
    return acc;
  }, {} as Record<string, ScheduleEvent[]>);
  
  return (
    <div className="bg-white rounded-md shadow-sm border w-full">
      <Calendar
        mode="single"
        month={month}
        onDayClick={onDateSelect}
        className="w-full"
        classNames={{
          day_selected: "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 focus:bg-blue-100 focus:text-blue-700",
          day_today: "border border-blue-500 text-blue-900 bg-blue-50",
          cell: "h-28 p-0 relative", // Increased height for better spacing
          day: "h-full w-full p-0",
          table: "w-full border-collapse space-y-1",
          head_row: "flex w-full",
          head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] py-2",
          row: "flex w-full mt-2",
          months: "w-full flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0"
        }}
        components={{
          DayContent: (props) => {
            const dateStr = format(props.date, "yyyy-MM-dd");
            const events = eventsByDate[dateStr] || [];
            
            return (
              <div className="flex flex-col h-full w-full">
                {/* Date number in top-right corner with clearer styling */}
                <div className="text-right text-sm font-medium p-1.5 border-b border-gray-100">
                  {props.date.getDate()}
                </div>
                
                {/* Event badges - neatly stacked with consistent spacing */}
                <div className="flex flex-col gap-1.5 p-1 overflow-hidden">
                  {events.slice(0, 2).map((event, i) => (
                    <TooltipProvider key={i}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge 
                            className={`text-xs truncate py-1 px-2 cursor-default ${getEventBadgeClass(event.type)}`}
                          >
                            <span className="truncate block max-w-full">{event.title}</span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="text-sm font-medium">{event.title}</div>
                          <div className="text-xs">{event.time}</div>
                          {event.location && <div className="text-xs">{event.location}</div>}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  
                  {/* More indicator - position at bottom with improved styling */}
                  {events.length > 2 && (
                    <div className="text-xs bg-gray-100 rounded-sm px-2 py-0.5 text-gray-600 mt-auto text-center mx-1 mb-1">
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
