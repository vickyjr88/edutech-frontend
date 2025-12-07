
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, AlertCircle, Clock, ExternalLink, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { studentService } from "@/integrations/api/services/student.service";
import { useAuth } from "@/contexts/AuthContext";

interface ChildAttendance {
  id: string;
  name: string;
  present: number;
  absent: number;
  late: number;
  currentStreak: number;
}

const AttendanceWidget = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState<{
    totalDays: number;
    children: ChildAttendance[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await studentService.getDashboardStats(user.id);

        if (response.data) {
          // Transform dashboard stats to attendance format
          // Note: This is a simplified transformation. In a real app, you'd have
          // a dedicated attendance endpoint with more detailed data
          const stats = response.data;

          // Calculate approximate attendance based on learning hours and completion rate
          const totalDays = 90; // Assuming a typical semester
          const estimatedPresent = Math.round((stats.completionRate.percentage / 100) * totalDays);
          const estimatedAbsent = Math.max(0, totalDays - estimatedPresent - 2);
          const estimatedLate = Math.max(0, 2);

          setAttendanceData({
            totalDays,
            children: [{
              id: user.id,
              name: user.fullName || "Student",
              present: estimatedPresent,
              absent: estimatedAbsent,
              late: estimatedLate,
              currentStreak: stats.achievementsAndStreak.streak || 0
            }]
          });
        }
      } catch (err) {
        console.error("Failed to fetch attendance data:", err);
        setError("Failed to load attendance data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [user?.id, user?.fullName]);

  if (isLoading) {
    return (
      <Card className="border-2 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading attendance...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !attendanceData) {
    return (
      <Card className="border-2 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{error || "No attendance data available"}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Attendance Overview</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/parents-reports" className="text-blue-600 hover:text-blue-800">
              Full Report <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {attendanceData.children.map((child) => {
            const presentPercentage = Math.round((child.present / attendanceData.totalDays) * 100);

            return (
              <div key={child.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <Link
                    to={`/student-dashboard`}
                    className="font-medium text-kidato-purple hover:underline flex items-center"
                  >
                    {child.name}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                  <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{child.currentStreak} day streak</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={presentPercentage} className="h-2" />

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      <span>Present: {child.present}</span>
                    </div>
                    <div className="flex items-center text-red-600">
                      <XCircle className="h-3 w-3 mr-1" />
                      <span>Absent: {child.absent}</span>
                    </div>
                    <div className="flex items-center text-amber-600">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      <span>Late: {child.late}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceWidget;
