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
  const upcomingSessions = teacherSummaryData?.classes
    ?.filter((cls: TeacherClassSummary) => cls.nextSession)
    .sort((a: TeacherClassSummary, b: TeacherClassSummary) => {
      const timeA = new Date(a.nextSession!.startTime).getTime();
      const timeB = new Date(b.nextSession!.startTime).getTime();
      return timeA - timeB;
    })
    .slice(0, 5)
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
    })) || [];

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