
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Star, Calendar, Users, CheckCircle, BookMarked, FileText, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProgressOverviewProps {
  courseId?: string;
}

// Mock data to simulate a real API response
const getMockCourseData = (courseId: string) => {
  return {
    id: courseId,
    title: "Mathematics Fundamentals",
    subject: "Mathematics",
    description: "Master essential math concepts for academic success and problem-solving skills.",
    overallProgress: 68,
    nextClass: "Tuesday, 2:00 PM",
    timeSpent: "12h 45m",
    enrollmentDate: "January 15, 2025",
    lessonsDone: 8,
    lessonsTotal: 12,
    quizzesDone: 4,
    quizzesTotal: 6,
    assignmentsDone: 5,
    assignmentsTotal: 8,
    grades: {
      average: "B+",
      highest: "A",
      latest: "B"
    },
    teacherName: "Sarah Johnson",
    rating: 4.7
  };
};

const ProgressOverview = ({ courseId = "default" }: ProgressOverviewProps) => {
  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      const data = getMockCourseData(courseId);
      setCourseData(data);
      setLoading(false);
    };

    fetchData();
  }, [courseId]);

  if (loading) {
    return <div className="text-center py-8">Loading course data...</div>;
  }

  if (!courseData) {
    return <div className="text-center py-8">Course data not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Course Header Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{courseData.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {courseData.subject}
                </Badge>
                <div className="flex items-center text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" />
                  <span className="font-medium">{courseData.rating}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Teacher</div>
              <div className="font-medium">{courseData.teacherName}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="font-medium">{courseData.overallProgress}%</span>
            </div>
            <Progress value={courseData.overallProgress} className="h-2.5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Next Class</span>
              </div>
              <div className="text-sm text-gray-600">{courseData.nextClass}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Avg. Grade</span>
              </div>
              <div className="text-sm text-gray-600">{courseData.grades.average}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Time Spent</span>
              </div>
              <div className="text-sm text-gray-600">{courseData.timeSpent}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <span className="font-medium">Enrolled On</span>
              </div>
              <div className="text-sm text-gray-600">{courseData.enrollmentDate}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lessons Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
              Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-3xl font-bold mb-1">
                {courseData.lessonsDone}/{courseData.lessonsTotal}
              </div>
              <div className="text-sm text-gray-600">Lessons completed</div>
            </div>
            <Progress 
              value={(courseData.lessonsDone / courseData.lessonsTotal) * 100} 
              className="h-2" 
            />
          </CardContent>
        </Card>

        {/* Quizzes Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BookMarked className="mr-2 h-5 w-5 text-purple-500" />
              Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-3xl font-bold mb-1">
                {courseData.quizzesDone}/{courseData.quizzesTotal}
              </div>
              <div className="text-sm text-gray-600">Quizzes completed</div>
            </div>
            <Progress 
              value={(courseData.quizzesDone / courseData.quizzesTotal) * 100} 
              className="h-2" 
            />
          </CardContent>
        </Card>

        {/* Assignments Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <FileText className="mr-2 h-5 w-5 text-amber-500" />
              Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-3xl font-bold mb-1">
                {courseData.assignmentsDone}/{courseData.assignmentsTotal}
              </div>
              <div className="text-sm text-gray-600">Assignments completed</div>
            </div>
            <Progress 
              value={(courseData.assignmentsDone / courseData.assignmentsTotal) * 100} 
              className="h-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Grades Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Award className="mr-2 h-5 w-5 text-amber-500" />
            Grades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">
              <div className="text-sm text-gray-600 mb-1">Average Grade</div>
              <div className="text-3xl font-bold text-blue-600">{courseData.grades.average}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">
              <div className="text-sm text-gray-600 mb-1">Highest Grade</div>
              <div className="text-3xl font-bold text-green-600">{courseData.grades.highest}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">
              <div className="text-sm text-gray-600 mb-1">Latest Grade</div>
              <div className="text-3xl font-bold text-purple-600">{courseData.grades.latest}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressOverview;
