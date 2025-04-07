
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, Clock, GraduationCap, BookOpen } from "lucide-react";

interface ClassStatsProps {
  rating: number;
  studentsEnrolled: number;
  completionRate: number;
  classHours: number;
  sessionsCount: number;
}

export default function ClassStats({
  rating,
  studentsEnrolled,
  completionRate,
  classHours,
  sessionsCount
}: ClassStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      <Card className="overflow-hidden">
        <CardContent className="p-4 flex items-center">
          <div className="bg-yellow-50 p-2 rounded-full mr-3 flex-shrink-0">
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Rating</p>
            <p className="font-semibold text-xl truncate">{rating.toFixed(1)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-4 flex items-center">
          <div className="bg-blue-50 p-2 rounded-full mr-3 flex-shrink-0">
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Students</p>
            <p className="font-semibold text-xl truncate">{studentsEnrolled}+</p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-4 flex items-center">
          <div className="bg-green-50 p-2 rounded-full mr-3 flex-shrink-0">
            <GraduationCap className="h-5 w-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Completion</p>
            <p className="font-semibold text-xl truncate">{completionRate}%</p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-4 flex items-center">
          <div className="bg-purple-50 p-2 rounded-full mr-3 flex-shrink-0">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Hours</p>
            <p className="font-semibold text-xl truncate">{classHours}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-4 flex items-center">
          <div className="bg-rose-50 p-2 rounded-full mr-3 flex-shrink-0">
            <BookOpen className="h-5 w-5 text-rose-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Sessions</p>
            <p className="font-semibold text-xl truncate">{sessionsCount}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
