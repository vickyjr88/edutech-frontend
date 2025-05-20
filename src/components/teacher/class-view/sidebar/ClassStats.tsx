import { Users, BookOpen, BarChart3, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClassStatsProps {
  stats: {
    enrollmentCount: number;
    lessonCount: number;
    attendanceRate: number;
    rating: number;
  };
}

const ClassStats = ({ stats }: ClassStatsProps) => {
  const statItems = [
    {
      icon: <Users className="h-4 w-4 text-blue-500" />,
      label: "Students",
      value: stats.enrollmentCount,
      color: "text-blue-600"
    },
    {
      icon: <BookOpen className="h-4 w-4 text-green-500" />,
      label: "Lessons",
      value: stats.lessonCount,
      color: "text-green-600"
    },
    {
      icon: <BarChart3 className="h-4 w-4 text-purple-500" />,
      label: "Attendance",
      value: `${stats.attendanceRate}%`,
      color: "text-purple-600"
    },
    {
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      label: "Rating",
      value: stats.rating,
      color: "text-yellow-600"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Class Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm text-gray-500">{item.label}</span>
              </div>
              <span className={`font-semibold ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassStats;