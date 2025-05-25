
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, AlertCircle, Clock, ExternalLink } from "lucide-react";

// Mock attendance data
const attendanceData = {
  totalDays: 90,
  children: [
    {
      id: 1,
      name: "Emma Johnson",
      present: 86,
      absent: 2,
      late: 2,
      currentStreak: 14
    },
    {
      id: 2,
      name: "Noah Johnson",
      present: 82,
      absent: 5,
      late: 3,
      currentStreak: 3
    },
    {
      id: 3,
      name: "Olivia Johnson",
      present: 89,
      absent: 1,
      late: 0,
      currentStreak: 20
    }
  ]
};

const AttendanceWidget = () => {
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
                    to={`/child-dashboard/${child.id}`}
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
