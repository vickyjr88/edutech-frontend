import { Users, BookOpen, BarChart3, Star, TrendingUp, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeacherClassSummary, TeacherAnalytics } from "@/types/enhanced-classes";

interface ClassStatsProps {
  stats: {
    enrollmentCount: number;
    lessonCount: number;
    attendanceRate: number;
    rating: number;
  };
  currentClassSummary?: TeacherClassSummary;
  analytics?: TeacherAnalytics;
}

const ClassStats = ({ stats, currentClassSummary, analytics }: ClassStatsProps) => {
  // Use enhanced data when available, fallback to original stats
  const enrollmentCount = currentClassSummary?.enrolledStudents || stats.enrollmentCount;
  const rating = currentClassSummary?.rating || stats.rating;
  const engagement = currentClassSummary?.averageEngagement || 0;
  const progress = currentClassSummary?.progressPercentage || 0;
  const capacity = currentClassSummary?.maxCapacity || 0;
  const classState = currentClassSummary?.classState || 'prep';
  
  const statItems = [
    {
      icon: <Users className="h-4 w-4 text-blue-500" />,
      label: "Students",
      value: capacity > 0 ? `${enrollmentCount}/${capacity}` : enrollmentCount,
      color: "text-blue-600",
      detail: capacity > 0 ? `${Math.round((enrollmentCount / capacity) * 100)}% full` : null
    },
    {
      icon: <BookOpen className="h-4 w-4 text-green-500" />,
      label: "Lessons",
      value: stats.lessonCount,
      color: "text-green-600"
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-purple-500" />,
      label: "Progress",
      value: `${Math.round(progress)}%`,
      color: "text-purple-600"
    },
    {
      icon: <Target className="h-4 w-4 text-orange-500" />,
      label: "Engagement",
      value: `${Math.round(engagement)}%`,
      color: engagement >= 80 ? "text-green-600" : engagement >= 60 ? "text-yellow-600" : "text-red-600"
    },
    {
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      label: "Rating",
      value: rating > 0 ? rating.toFixed(1) : 'N/A',
      color: "text-yellow-600"
    }
  ];

  const getClassStateBadge = (state: string) => {
    switch (state) {
      case 'ready':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Ready</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Completed</Badge>;
      default:
        return <Badge variant="outline">Prep</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Class Statistics</CardTitle>
          {currentClassSummary && getClassStateBadge(classState)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statItems.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm text-gray-500">{item.label}</span>
                </div>
                <span className={`font-semibold ${item.color}`}>{item.value}</span>
              </div>
              {item.detail && (
                <div className="text-xs text-gray-400 ml-6">{item.detail}</div>
              )}
            </div>
          ))}
          
          {analytics && (
            <div className="pt-3 border-t">
              <div className="text-sm font-medium text-gray-700 mb-2">Teacher Analytics</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Health Score</span>
                  <span className={`font-medium ${
                    analytics.classHealthScore >= 80 ? 'text-green-600' : 
                    analytics.classHealthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>{Math.round(analytics.classHealthScore)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Total Students</span>
                  <span className="font-medium">{analytics.recentActivity.activeStudentsThisWeek}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassStats;