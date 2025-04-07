
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
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-yellow-50 p-3 rounded-full mr-4">
            <Star className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Rating</p>
            <p className="font-semibold text-2xl">{rating.toFixed(1)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-blue-50 p-3 rounded-full mr-4">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Students</p>
            <p className="font-semibold text-2xl">{studentsEnrolled}+</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-green-50 p-3 rounded-full mr-4">
            <GraduationCap className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completion</p>
            <p className="font-semibold text-2xl">{completionRate}%</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-purple-50 p-3 rounded-full mr-4">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Hours</p>
            <p className="font-semibold text-2xl">{classHours}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-rose-50 p-3 rounded-full mr-4">
            <BookOpen className="h-6 w-6 text-rose-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Sessions</p>
            <p className="font-semibold text-2xl">{sessionsCount}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
