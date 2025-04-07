
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, GraduationCap, Users } from "lucide-react";

interface TeacherHighlightsProps {
  teacher: any;
}

export default function TeacherHighlights({ teacher }: TeacherHighlightsProps) {
  // Extract relevant information from teacher data
  const subjectCount = teacher.classes?.length || 0;
  const experienceYears = teacher.experience?.length > 0 
    ? new Date().getFullYear() - new Date(teacher.experience[0].dates.split(" - ")[0]).getFullYear()
    : 0;
  const studentCount = Math.floor(Math.random() * 500) + 50; // Placeholder for now

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-blue-50 p-3 rounded-full mr-4">
            <BookOpen className="h-6 w-6 text-kidato-blue" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Subjects</p>
            <p className="font-semibold text-2xl">{subjectCount}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-green-50 p-3 rounded-full mr-4">
            <GraduationCap className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Experience</p>
            <p className="font-semibold text-2xl">{experienceYears}+ years</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-purple-50 p-3 rounded-full mr-4">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Students</p>
            <p className="font-semibold text-2xl">{studentCount}+</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
