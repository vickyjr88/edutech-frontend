
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import MatchingClassesSection from "@/components/courses/MatchingClassesSection";
import EnrolledClassesTable from "@/components/courses/EnrolledClassesTable";
import CompletedClassesTable from "@/components/courses/CompletedClassesTable";
import CourseFilters from "@/components/courses/CourseFilters";

import { useAuth } from "@/contexts/AuthContext";
import { useGetCompletedClassesForStudent, useGetCurrentClassesForStudent, useGetRecommendedClasses } from "@/hooks/use-class-service";
import { useGetStudentPendingEnrollments } from "@/hooks/use-enrollment-service";
import PendingEnrollmentTable from "@/components/courses/PendingEnrollmentTable";

const Courses = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const { user } = useAuth();
  const { data: response, isLoading } = useGetRecommendedClasses(user.studentId || '');
  const { data: enrolledClassesResponse, isLoading: enrolledClassesLoading } = useGetCurrentClassesForStudent(user.studentId || '');
  const { data: completedClassesResponse, isLoading: completedClassesLoading } = useGetCompletedClassesForStudent(user.studentId || '');
  // get pending enrollments
  const { data: pendingEnrollmentsResponse, isLoading: pendingEnrollmentsLoading } = useGetStudentPendingEnrollments(user.studentId || '');
  const recommendedClasses = response?.data ?? [];
  const enrolledClasses = enrolledClassesResponse?.data ?? [];
  const completedClasses = completedClassesResponse?.data ?? [];
  const pendingEnrollments = pendingEnrollmentsResponse?.data ?? [];

  if (isLoading || enrolledClassesLoading || completedClassesLoading || pendingEnrollmentsLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kidato-purple"></div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-4 sm:p-6 transition-all duration-300">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">My Courses</h1>
                <p className="text-gray-600">Manage all your learning experiences</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button className="bg-kidato-purple hover:bg-kidato-dark-blue">
                  Browse New Classes
                </Button>
              </div>
            </div>

            {/* Course Tabs */}
            <Tabs defaultValue="enrolled" className="mb-8">
              <TabsList className="mb-6 bg-blue-50/50 p-1 border border-blue-100">
                <TabsTrigger value="enrolled" className="data-[state=active]:bg-white data-[state=active]:text-kidato-purple data-[state=active]:shadow-sm rounded-md">
                  Enrolled Classes
                </TabsTrigger>
                <TabsTrigger value="matching" className="data-[state=active]:bg-white data-[state=active]:text-kidato-purple data-[state=active]:shadow-sm rounded-md">
                  Matching Classes & Teachers
                </TabsTrigger>
              </TabsList>

              {/* Enrolled Courses Table */}
              <TabsContent value="enrolled">
                <div className="mb-8">
                  <PendingEnrollmentTable enrollments={pendingEnrollments} />
                  <EnrolledClassesTable enrolledCourses={enrolledClasses} />
                  <CompletedClassesTable completedCourses={completedClasses} />
                </div>
              </TabsContent>

              {/* Matching Classes & Teachers Cards */}
              <TabsContent value="matching">
                <div className="space-y-6 mb-8">
                  {recommendedClasses?.map((recommendedClass) => (
                    <MatchingClassesSection
                      key={recommendedClass._id}
                      course={recommendedClass}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Advanced Course Filters */}
            {filterOpen && <CourseFilters onClose={() => setFilterOpen(false)} />}
          </div>
        </main>
      </div>

      {/* Kidato AI Mascot */}
      <KidatoMascot />
    </div>
  );
}

export default Courses;
