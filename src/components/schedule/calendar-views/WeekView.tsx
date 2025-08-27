
import { useState } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ScheduleEvent } from "../mockScheduleData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  date: Date;
  onDateSelect: (date: Date) => void;
  events?: ScheduleEvent[];
}

export function WeekView({ date, onDateSelect, events = [] }: WeekViewProps) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Start from Monday
  const today = new Date();
  
  // Generate the week days
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(weekStart, i);
    const dayStr = format(day, "yyyy-MM-dd");
    const dayEvents = events.filter(event => 
      format(new Date(event.date), "yyyy-MM-dd") === dayStr
    );
    
    const isToday = isSameDay(day, today);
    
    return {
      date: day,
      dayName: format(day, "EEE"),
      dayNumber: format(day, "d"),
      isToday,
      events: dayEvents
    };
  });

  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM
  
  return (
    <div className="bg-white rounded-md shadow-sm border overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Week header */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 text-center border-r"></div>
          {weekDays.map((day, idx) => (
            <div 
              key={idx} 
              className={cn(
                "p-2 text-center border-r last:border-r-0 cursor-pointer hover:bg-blue-50",
                day.isToday && "bg-blue-50"
              )}
              onClick={() => onDateSelect(day.date)}
            >
              <div className="font-medium">{day.dayName}</div>
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center mx-auto",
                day.isToday && "bg-blue-500 text-white"
              )}>
                {day.dayNumber}
              </div>
            </div>
          ))}
        </div>
        
        {/* Time grid */}
        <div className="grid grid-cols-8">
          {/* Time column */}
          <div className="border-r">
            {hours.map((hour, idx) => (
              <div 
                key={idx} 
                className="h-20 border-b last:border-b-0 text-xs text-gray-500 text-right pr-2 pt-1"
              >
                {hour % 12 === 0 ? "12" : hour % 12}:00 {hour >= 12 ? "PM" : "AM"}
              </div>
            ))}
          </div>
          
          {/* Days columns */}
          {weekDays.map((day, dayIdx) => (
            <div key={dayIdx} className="relative border-r last:border-r-0">
              {hours.map((hour, hourIdx) => (
                <div 
                  key={hourIdx} 
                  className="h-20 border-b last:border-b-0"
                ></div>
              ))}
              
              {/* Events */}
              {day.events.map((event, eventIdx) => {
                const eventHour = new Date(event.date).getHours();
                const normalizedHour = eventHour - 7; // Adjust to our grid (7 AM = 0)
                const duration = event.duration || 1;
                
                return (
                  <div 
                    key={eventIdx}
                    className={cn(
                      "absolute left-1 right-1 rounded p-1.5 text-xs",
                      getEventClass(event.type)
                    )}
                    style={{
                      top: `${normalizedHour * 80}px`, // Each hour is 80px high
                      height: `${duration * 80 - 4}px`, // Duration in hours
                      zIndex: 10
                    }}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="truncate">{event.time}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getEventClass(type: string) {
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
