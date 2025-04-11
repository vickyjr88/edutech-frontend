
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

// Mock attendance data
const attendanceData = {
  totalDays: 90,
  present: 86,
  absent: 2,
  late: 2,
  currentStreak: 14
};

// Calculate percentages
const presentPercentage = Math.round((attendanceData.present / attendanceData.totalDays) * 100);

const AttendanceWidget = () => {
  return (
    <Card className="border-2 border-blue-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-3">Attendance Overview</h2>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-3xl font-bold text-blue-600">{presentPercentage}%</span>
            <p className="text-sm text-gray-500">Attendance Rate</p>
          </div>
          <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{attendanceData.currentStreak} day streak</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Present</span>
            </div>
            <span className="text-sm">{attendanceData.present} days</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Absent</span>
            </div>
            <span className="text-sm">{attendanceData.absent} days</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span>Late</span>
            </div>
            <span className="text-sm">{attendanceData.late} days</span>
          </div>
        </div>
        
        <div className="mt-4 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Last 7 days</p>
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  i === 3 ? "bg-amber-100 text-amber-700" : 
                  i === 6 ? "bg-gray-100" : 
                  "bg-blue-100 text-blue-700"
                }`}
              >
                {i === 3 ? (
                  <AlertCircle className="h-3 w-3" />
                ) : i === 6 ? (
                  "—"
                ) : (
                  <CheckCircle className="h-3 w-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceWidget;
