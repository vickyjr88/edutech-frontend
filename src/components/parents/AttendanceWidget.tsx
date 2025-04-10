
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react";

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
const absentPercentage = Math.round((attendanceData.absent / attendanceData.totalDays) * 100);
const latePercentage = Math.round((attendanceData.late / attendanceData.totalDays) * 100);

const AttendanceWidget = () => {
  return (
    <Card className="border border-blue-100">
      <CardHeader className="bg-blue-50/50 pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <User className="mr-2 h-5 w-5 text-blue-500" />
          Attendance Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-3xl font-bold text-green-600">{presentPercentage}%</span>
            <p className="text-sm text-gray-600">Attendance Rate</p>
          </div>
          <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{attendanceData.currentStreak} day streak</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Present</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{attendanceData.present} days</span>
              <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">{presentPercentage}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <XCircle className="h-4 w-4 text-red-500 mr-2" />
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{attendanceData.absent} days</span>
              <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded">{absentPercentage}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
              <span>Late</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{attendanceData.late} days</span>
              <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">{latePercentage}%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="font-medium mb-2">Recent Attendance</h4>
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                  i === 3 ? "bg-amber-100 text-amber-700" : 
                  i === 6 ? "bg-gray-100 text-gray-400" : 
                  "bg-green-100 text-green-700"
                }`}
              >
                {i === 3 ? (
                  <AlertCircle className="h-3.5 w-3.5" />
                ) : i === 6 ? (
                  "—"
                ) : (
                  <CheckCircle className="h-3.5 w-3.5" />
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
