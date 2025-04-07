
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Calendar,
  Trophy
} from "lucide-react";

export default function StudentStatCards() {
  const stats = [
    {
      title: "Enrolled Classes",
      value: "3",
      icon: BookOpen,
      color: "blue"
    },
    {
      title: "Learning Hours",
      value: "42",
      icon: Clock,
      color: "purple"
    },
    {
      title: "Completion Rate",
      value: "87%",
      icon: GraduationCap,
      color: "green"
    },
    {
      title: "Upcoming Sessions",
      value: "5",
      icon: Calendar,
      color: "rose"
    },
    {
      title: "Achievements",
      value: "12",
      icon: Trophy,
      color: "yellow"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4 flex items-center">
            <div className={`bg-${stat.color}-50 p-2 rounded-full mr-3 flex-shrink-0`}>
              <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">{stat.title}</p>
              <p className="font-semibold text-xl truncate">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
