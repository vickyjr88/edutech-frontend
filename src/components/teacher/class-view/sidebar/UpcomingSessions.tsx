import { CalendarDays, Clock, Users, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cohort } from "../TeacherClassView";
import { TeacherSummaryResponse, TeacherClassSummary } from "@/types/enhanced-classes";

interface UpcomingSessionsProps {
  cohorts: Cohort[];
  teacherSummaryData?: TeacherSummaryResponse | null;
  currentClassId?: string;
}

const UpcomingSessions = ({ cohorts, teacherSummaryData, currentClassId }: UpcomingSessionsProps) => {
  // Use real teacher summary data when available, fallback to mock data
  const upcomingSessions = teacherSummaryData?.classes
    ? teacherSummaryData.classes
        .filter((cls: TeacherClassSummary) => cls.nextSession)
        .sort((a: TeacherClassSummary, b: TeacherClassSummary) => {
          const timeA = new Date(a.nextSession!.startTime).getTime();
          const timeB = new Date(b.nextSession!.startTime).getTime();
          return timeA - timeB;
        })
        .slice(0, 5) // Show next 5 sessions
        .map((cls: TeacherClassSummary) => ({
          id: cls.nextSession!.classId,
          classTitle: cls.title,
          lessonTitle: cls.nextSession!.title,
          lessonNumber: cls.nextSession!.lessonNumber,
          cohortName: cls.nextSession!.cohortName,
          date: new Date(cls.nextSession!.startTime).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          }),
          time: new Date(cls.nextSession!.startTime).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          duration: cls.nextSession!.duration,
          students: cls.nextSession!.enrolledStudents,
          readiness: cls.nextSession!.readiness?.overallReadiness || 0,
          isCurrentClass: cls.classId === currentClassId,
          timeLeft: cls.nextSession!.timeLeft
        }))
    : // Fallback to mock data from cohorts
      cohorts.map((cohort) => {
        const nextDate = getNextSessionDate(cohort.schedule);
        return {
          id: `session-${cohort.id}`,
          classTitle: "Class Session",
          lessonTitle: "Upcoming Lesson",
          lessonNumber: 1,
          cohortName: cohort.name,
          cohortColor: cohort.color,
          date: nextDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
          time: nextDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          duration: 60,
          students: cohort.currentStudents || 0,
          readiness: 75,
          isCurrentClass: false,
          timeLeft: 0
        };
      });

  // Helper function to calculate the next session date based on a schedule string (fallback for mock data)
  function getNextSessionDate(scheduleString?: string): Date {
    if (!scheduleString) {
      // Return next Monday as default
      const today = new Date();
      const daysUntilMonday = (1 + 7 - today.getDay()) % 7 || 7;
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + daysUntilMonday);
      nextMonday.setHours(10, 0, 0, 0); // Default to 10 AM
      return nextMonday;
    }
    
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
    } else {
      // Default to 10 AM if no time found
      nextDate.setHours(10, 0, 0, 0);
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
            upcomingSessions.map((session) => {
              const isUrgent = session.timeLeft && session.timeLeft < 60; // Less than 1 hour
              const isToday = new Date(session.date).toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={session.id} 
                  className={`p-3 rounded-lg border transition-colors ${
                    session.isCurrentClass ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                  } ${isUrgent ? 'border-orange-300 bg-orange-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">
                        {session.lessonTitle}
                        <Badge variant="outline" className="ml-2 text-xs">
                          L{session.lessonNumber}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        {session.classTitle} • {session.cohortName}
                      </div>
                    </div>
                    {session.isCurrentClass && (
                      <Badge variant="secondary" className="text-xs">
                        This Class
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    <span className={isToday ? 'font-medium text-blue-600' : ''}>
                      {session.date}
                    </span>
                    <Clock className="h-3 w-3 ml-3 mr-1" />
                    <span>{session.time}</span>
                    <span className="ml-1">({session.duration}m)</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1 text-blue-500" />
                        <span>{session.students}</span>
                      </div>
                      <div className="flex items-center">
                        <Target className={`h-3 w-3 mr-1 ${
                          session.readiness >= 80 ? 'text-green-500' : 
                          session.readiness >= 60 ? 'text-yellow-500' : 'text-red-500'
                        }`} />
                        <span className={session.readiness >= 80 ? 'text-green-600' : 
                          session.readiness >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                          {Math.round(session.readiness)}% ready
                        </span>
                      </div>
                    </div>
                    {isUrgent && (
                      <Badge variant="destructive" className="text-xs">
                        Starting soon
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })
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