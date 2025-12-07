import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { ScheduleEvent } from "@/types/calendar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MonthViewProps {
  month: Date;
  events: ScheduleEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: ScheduleEvent) => void;
}

export function MonthView({ month, events, onDateSelect, onEventClick }: MonthViewProps) {

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
          day_today: "bg-blue-50 font-bold",
          cell: "min-h-[7rem] h-auto p-0 relative border border-gray-100/50 align-top", // Use min-height and borders
          day: "h-full w-full p-0 flex flex-col items-start justify-start", // Flex col for content
          table: "w-full border-collapse",
          head_row: "grid grid-cols-7 w-full mb-2",
          head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] py-2 text-center",
          row: "grid grid-cols-7 w-full",
          months: "w-full flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          caption: "hidden", // Hide the built-in header as we have an external one
          month: "w-full"
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
                            className={`text-xs truncate py-1 px-2 cursor-pointer ${getEventBadgeClass(event.type)}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onEventClick) onEventClick(event);
                            }}
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
