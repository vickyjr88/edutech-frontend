
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Star, Calendar, Users, CheckCircle, BookMarked, FileText, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useClassById } from "@/hooks/use-class-service";
import { useGetStudentCurrentEnrollments } from "@/hooks/use-enrollment-service";
import { useAuth } from "@/contexts/AuthContext";

interface ProgressOverviewProps {
  courseId?: string;
}

const ProgressOverview = ({ courseId }: ProgressOverviewProps) => {
  const { user } = useAuth();
  
  // courseId in the URL is actually an enrollment ID
  // First, get current enrollments to find the specific enrollment
  const { data: enrollmentsData, isLoading: enrollmentsLoading, error: enrollmentsError } = useGetStudentCurrentEnrollments(user.studentId || "");
  
  // Find the specific enrollment by enrollmentId
  const currentEnrollment = enrollmentsData?.data?.find((enrollment: any) => enrollment.enrollmentId === courseId);
  
  // Extract classId from the enrollment
  const classId = currentEnrollment?.course?.id;
  
  // Fetch class details using the classId
  const { data: classData, isLoading: classLoading, error: classError } = useClassById(classId || "");

  if (!courseId) {
    return <div className="text-center py-8">No course selected</div>;
  }

  if (enrollmentsLoading || classLoading) {
    return <div className="text-center py-8">Loading course data...</div>;
  }

  if (enrollmentsError || classError || !currentEnrollment || !classData?.data) {
    return <div className="text-center py-8">Course data not found</div>;
  }

  const courseData = classData.data;

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
              <div className="font-medium">{courseData.teacher?.user?.fullName || courseData.teacher?.name || "Unknown"}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="font-medium">0%</span>
            </div>
            <Progress value={0} className="h-2.5" />
            <p className="text-xs text-gray-500 mt-1">Progress tracking not yet implemented</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Lessons</span>
              </div>
              <div className="text-sm text-gray-600">{courseData.numberOfLessons} total</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Status</span>
              </div>
              <div className="text-sm text-gray-600">{courseData.status || "Active"}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Grade Level</span>
              </div>
              <div className="text-sm text-gray-600">{courseData.gradeLevel}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-indigo-500" />
                <span className="font-medium">Students</span>
              </div>
              <div className="text-sm text-gray-600">{courseData.studentsList?.length || 0} enrolled</div>
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
                0/{courseData.numberOfLessons || 0}
              </div>
              <div className="text-sm text-gray-600">Lessons completed</div>
            </div>
            <Progress value={0} className="h-2" />
            <p className="text-xs text-gray-500 mt-1 text-center">Progress not tracked</p>
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
                -/-
              </div>
              <div className="text-sm text-gray-600">Quizzes completed</div>
            </div>
            <Progress value={0} className="h-2" />
            <p className="text-xs text-gray-500 mt-1 text-center">Feature not available</p>
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
                -/-
              </div>
              <div className="text-sm text-gray-600">Assignments completed</div>
            </div>
            <Progress value={0} className="h-2" />
            <p className="text-xs text-gray-500 mt-1 text-center">Feature not available</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Information Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Award className="mr-2 h-5 w-5 text-amber-500" />
            Course Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600">{courseData.description || "No description available"}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Curriculum</h4>
              <p className="text-sm text-gray-600">{courseData.curriculum || "Not specified"}</p>
            </div>
            
            {courseData.tags && courseData.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {courseData.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressOverview;
