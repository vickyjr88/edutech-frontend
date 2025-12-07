import { useState, useEffect } from "react";
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { Calendar, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { studentService, UpcomingSession } from "@/integrations/api/services/student.service";
import { format } from "date-fns";

const ParentsSchedule = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<UpcomingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        // Using upcoming sessions as the schedule source
        const response = await studentService.getUpcomingSessions(user.id);
        if (response.data) {
          setSchedule(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch schedule", err);
        setError("Failed to load schedule");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, MMM d");
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string, durationMinutes: number) => {
    try {
      const start = new Date(dateString);
      const end = new Date(start.getTime() + durationMinutes * 60000);
      return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
    } catch {
      return "";
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />

      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName={user?.fullName || "Parent"} />

        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-6 w-6 text-kidato-purple" />
              <h1 className="text-2xl font-bold">Learning Schedule</h1>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{error}</p>
              </div>
            ) : schedule.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No upcoming classes scheduled</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {schedule.map((session, index) => (
                  <Card key={`${session.classId}-${index}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{session.title}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <span className="font-medium">Student:</span> {user?.fullName || "You"}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Teacher:</span> {session.teacherName}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700 border-blue-200">
                            {session.sessionType || "Upcoming"}
                          </Badge>
                          <p className="text-sm font-bold text-gray-800">
                            {formatTime(session.startTime, session.duration)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(session.startTime)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParentsSchedule;
