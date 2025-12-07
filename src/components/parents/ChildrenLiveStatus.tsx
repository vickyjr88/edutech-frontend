
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { classService } from "@/integrations/api/services/class.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ChildStatus {
  id: string;
  name: string;
  initials: string;
  status: "live" | "upcoming" | "completed";
  className: string;
  timeRemaining?: number;
  startTime?: string;
  completedAt?: string;
  teacher?: string;
  attendance?: "present" | "absent";
  classId?: string;
}

const ChildrenLiveStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [viewDetails, setViewDetails] = useState<string | null>(null);
  const [childrenStatuses, setChildrenStatuses] = useState<ChildStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildrenStatuses = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch current classes for the student
        const response = await classService.getCurrentClassesForStudent(user.id);

        if (response.data) {
          const now = new Date();
          const statuses: ChildStatus[] = response.data.map((classData: any) => {
            // Determine status based on schedule
            let status: "live" | "upcoming" | "completed" = "upcoming";
            let timeRemaining: number | undefined;
            let startTime: string | undefined;
            let completedAt: string | undefined;

            if (classData.schedule) {
              const scheduleStart = new Date(classData.schedule.startTime);
              const scheduleEnd = new Date(classData.schedule.endTime);

              if (now >= scheduleStart && now <= scheduleEnd) {
                // Class is currently live
                status = "live";
                const remainingMs = scheduleEnd.getTime() - now.getTime();
                timeRemaining = Math.floor(remainingMs / (1000 * 60));
              } else if (now < scheduleStart) {
                // Class is upcoming
                status = "upcoming";
                const startMs = scheduleStart.getTime() - now.getTime();
                const startMins = Math.floor(startMs / (1000 * 60));
                if (startMins < 60) {
                  startTime = `${startMins} mins`;
                } else {
                  const startHours = Math.floor(startMins / 60);
                  startTime = `${startHours} ${startHours === 1 ? 'hour' : 'hours'}`;
                }
              } else {
                // Class is completed
                status = "completed";
                const completedMs = now.getTime() - scheduleEnd.getTime();
                const completedMins = Math.floor(completedMs / (1000 * 60));
                if (completedMins < 60) {
                  completedAt = `${completedMins} mins ago`;
                } else if (completedMins < 1440) {
                  const completedHours = Math.floor(completedMins / 60);
                  completedAt = `${completedHours} ${completedHours === 1 ? 'hour' : 'hours'} ago`;
                } else {
                  const completedDays = Math.floor(completedMins / 1440);
                  completedAt = `${completedDays} ${completedDays === 1 ? 'day' : 'days'} ago`;
                }
              }
            }

            // Extract initials from name
            const fullName = user.fullName || "Student";
            const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase() || "ST";

            return {
              id: classData._id || classData.id,
              name: fullName,
              initials,
              status,
              className: classData.title || "Untitled Class",
              timeRemaining,
              startTime,
              completedAt,
              teacher: classData.teacher?.fullName || "Teacher",
              attendance: status === "completed" ? "present" : undefined,
              classId: classData._id || classData.id
            };
          });

          setChildrenStatuses(statuses);
        }
      } catch (err) {
        console.error("Failed to fetch children statuses:", err);
        setError("Failed to load class statuses");
        toast({
          title: "Error",
          description: "Failed to load live class statuses. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildrenStatuses();

    // Refresh every minute to update live status
    const interval = setInterval(fetchChildrenStatuses, 60000);

    return () => clearInterval(interval);
  }, [user?.id, user?.fullName, toast]);

  const getStatusBadge = (status: string, attendance?: string) => {
    switch (status) {
      case "live":
        return (
          <Badge className="bg-red-500 animate-pulse text-white">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-white"></span>
              Live Now
            </span>
          </Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Upcoming
          </Badge>
        );
      case "completed":
        if (attendance === "present") {
          return (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Attended
            </Badge>
          );
        } else if (attendance === "absent") {
          return (
            <Badge className="bg-red-100 text-red-800">
              <XCircle className="h-3 w-3 mr-1" />
              Missed
            </Badge>
          );
        } else {
          return (
            <Badge className="bg-amber-100 text-amber-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Unknown
            </Badge>
          );
        }
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-blue-200">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-4">Children's Live Classes Status</h2>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading class statuses...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-blue-200">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-4">Children's Live Classes Status</h2>
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-4">Children's Live Classes Status</h2>
        {childrenStatuses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No active classes at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {childrenStatuses.map((child) => (
              <div
                key={child.id}
                className={`p-3 rounded-lg ${child.status === "live"
                    ? "bg-red-50 border border-red-200"
                    : "bg-white border border-gray-100"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className={`
                        ${child.status === "live" ? "bg-red-500" :
                          child.status === "upcoming" ? "bg-blue-500" :
                            "bg-gray-500"} 
                        text-white
                      `}>
                        {child.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-bold mr-2">{child.name}</h3>
                        {getStatusBadge(child.status, child.attendance)}
                      </div>
                      <p className="text-sm text-gray-600">{child.className}</p>
                    </div>
                  </div>

                  {child.status === "live" && (
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => {
                        // Navigate to class or open video
                        window.location.href = `/class/${child.classId}`;
                      }}
                    >
                      <Video className="h-4 w-4 mr-1" /> Join
                    </Button>
                  )}
                </div>

                {viewDetails === child.id || child.status === "live" ? (
                  <div className="mt-2 pl-12">
                    <div className="text-xs text-gray-500 space-y-1">
                      {child.status === "live" && child.timeRemaining !== undefined && (
                        <div className="flex items-center text-red-600">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{child.timeRemaining} minutes remaining</span>
                        </div>
                      )}
                      {child.status === "upcoming" && child.startTime && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Starts in {child.startTime}</span>
                        </div>
                      )}
                      {child.status === "completed" && child.completedAt && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Completed {child.completedAt}</span>
                        </div>
                      )}
                      {child.teacher && (
                        <div className="flex items-center">
                          <span className="mr-1">Teacher:</span>
                          <span className="font-medium">{child.teacher}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 pl-12">
                    <button
                      onClick={() => setViewDetails(child.id)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Show details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChildrenLiveStatus;
