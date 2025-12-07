
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DayView } from "./calendar-views/DayView";
import { WeekView } from "./calendar-views/WeekView";
import { MonthView } from "./calendar-views/MonthView";
import { addDays, format, startOfMonth, subDays, subMonths, addMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ScheduleEvent } from "@/types/calendar";

interface ScheduleCalendarProps {
  view: "month" | "week" | "day";
  events: ScheduleEvent[];
  onEventsChange?: () => void;
  onEventClick?: (event: ScheduleEvent) => void;
  onAddEvent?: (date?: Date) => void;
  onDeleteEvent?: (event: ScheduleEvent) => void;
}

export function ScheduleCalendar({ view, events, onEventClick, onAddEvent, onDeleteEvent }: ScheduleCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  const today = new Date();

  const handlePrevious = () => {
    if (view === "day") {
      setDate(subDays(date, 1));
    } else if (view === "week") {
      setDate(subDays(date, 7));
    } else {
      setMonth(subMonths(month, 1));
    }
  };

  const handleNext = () => {
    if (view === "day") {
      setDate(addDays(date, 1));
    } else if (view === "week") {
      setDate(addDays(date, 7));
    } else {
      setMonth(addMonths(month, 1));
    }
  };

  const handleToday = () => {
    setDate(today);
    setMonth(today);
  };

  const getHeaderTitle = () => {
    if (view === "day") {
      return format(date, "EEEE, MMMM d, yyyy");
    } else if (view === "week") {
      const weekStart = startOfMonth(date);
      const weekEnd = addDays(weekStart, 6);
      return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    } else {
      return format(month, "MMMM yyyy");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="h-8"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold">{getHeaderTitle()}</h2>
        <div className="w-28"></div>
      </div>


      {view === "month" && <MonthView month={month} events={events} onDateSelect={setDate} onEventClick={onEventClick} />}
      {view === "week" && <WeekView date={date} events={events} onDateSelect={setDate} onEventClick={onEventClick} />}
      {view === "day" && <DayView date={date} events={events} onAddEvent={onAddEvent} onEventClick={onEventClick} onDeleteEvent={onDeleteEvent} />}
    </div>
  );
}
