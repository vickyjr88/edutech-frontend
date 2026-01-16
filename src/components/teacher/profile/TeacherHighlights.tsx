
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, GraduationCap, Users } from "lucide-react";

interface TeacherHighlightsProps {
  title?: string;
  methodologies?: any[];
  strategies?: any[];
  certifications?: any[];
  teacher?: any;
}

export default function TeacherHighlights({
  title,
  methodologies = [],
  strategies = [],
  certifications = [],
  teacher
}: TeacherHighlightsProps) {
  // Extract relevant information from teacher data or use props directly
  // Use the subjects array from teacher data if available
  const subjectCount = teacher?.subjects?.length || ((methodologies || []).length + (strategies || []).length);

  // Calculate experience years correctly from teacher experience data
  const calculateExperienceYears = (): number => {
    if (!teacher?.experience || !Array.isArray(teacher.experience) || teacher.experience.length === 0) {
      return 3; // Default value if no experience data
    }

    let totalYears = 0;
    const currentYear = new Date().getFullYear();

    // Calculate years for each experience entry
    teacher.experience.forEach((exp: any) => {
      if (!exp.startDate) return; // Skip entries without start date

      const startYear = new Date(exp.startDate).getFullYear();
      let endYear;

      if (exp.isCurrentlyWorking) {
        endYear = currentYear;
      } else if (exp.endDate) {
        endYear = new Date(exp.endDate).getFullYear();
      } else {
        // If no end date and not currently working, assume 1 year
        endYear = startYear + 1;
      }

      totalYears += (endYear - startYear);
    });

    return totalYears > 0 ? totalYears : 3; // Ensure at least some experience
  };

  const experienceYears = calculateExperienceYears();
  const studentCount = teacher?.stats?.studentsHelped || Math.floor(Math.random() * 500) + 50; // Use stats or placeholder

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-blue-50 p-3 rounded-full mr-4">
            <BookOpen className="h-6 w-6 text-kidato-purple" />
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
