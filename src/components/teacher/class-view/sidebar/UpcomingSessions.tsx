import { CalendarDays, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cohort } from "../TeacherClassView";

interface UpcomingSessionsProps {
  cohorts: Cohort[];
}

const UpcomingSessions = ({ cohorts }: UpcomingSessionsProps) => {
  // Mock upcoming sessions based on cohorts
  const upcomingSessions = cohorts.map((cohort) => {
    // Generate a date for the next session based on the cohort schedule
    const nextDate = getNextSessionDate(cohort.schedule);
    return {
      id: `session-${cohort.id}`,
      cohortName: cohort.name,
      cohortColor: cohort.color,
      date: nextDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
      time: nextDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      teacherName: cohort.teacherName
    };
  });

  // Helper function to calculate the next session date based on a schedule string
  function getNextSessionDate(scheduleString: string): Date {
    const today = new Date();
    let daysToAdd = 0;

    if (scheduleString.includes("Monday")) {
      daysToAdd = (1 - today.getDay() + 7) % 7;
    } else if (scheduleString.includes("Tuesday")) {
      daysToAdd = (2 - today.getDay() + 7) % 7;
    } else if (scheduleString.includes("Wednesday")) {
      daysToAdd = (3 - today.getDay() + 7) % 7;
    } else if (scheduleString.includes("Thursday")) {
      daysToAdd = (4 - today.getDay() + 7) % 7;
    } else if (scheduleString.includes("Friday")) {
      daysToAdd = (5 - today.getDay() + 7) % 7;
    } else if (scheduleString.includes("Saturday")) {
      daysToAdd = (6 - today.getDay() + 7) % 7;
    } else if (scheduleString.includes("Sunday")) {
      daysToAdd = (0 - today.getDay() + 7) % 7;
    }

    if (daysToAdd === 0) daysToAdd = 7; // If today is the day, set to next week

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);

    // Extract time from schedule string and set it
    const timeMatch = scheduleString.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = parseInt(timeMatch[2]);
      const period = timeMatch[3].toUpperCase();

      if (period === "PM" && hour < 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      nextDate.setHours(hour, minute);
    }

    return nextDate;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
              <div 
                key={session.id} 
                className="p-3 rounded-lg border"
                style={{ borderLeftColor: session.cohortColor, borderLeftWidth: '4px' }}
              >
                <div className="font-medium mb-1">{session.cohortName}</div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                  {session.date}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  {session.time}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No upcoming sessions scheduled
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingSessions;