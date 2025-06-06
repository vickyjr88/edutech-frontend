
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import MatchingClassesSection from "@/components/courses/MatchingClassesSection";
import EnrolledClassesTable from "@/components/courses/EnrolledClassesTable";
import CompletedClassesTable from "@/components/courses/CompletedClassesTable";
import CourseFilters from "@/components/courses/CourseFilters";

import { useAuth } from "@/contexts/AuthContext";
import { useGetCompletedClassesForStudent, useGetCurrentClassesForStudent, useGetRecommendedClasses } from "@/hooks/use-class-service";

const Courses = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const { user } = useAuth();
  const { data: response, isLoading } = useGetRecommendedClasses(user.id);
  const { data: enrolledClassesResponse, isLoading: enrolledClassesLoading } = useGetCurrentClassesForStudent(user.id);
  const { data: completedClassesResponse, isLoading: completedClassesLoading } = useGetCompletedClassesForStudent(user.id);
  const recommendedClasses = response?.data ?? [];
  const enrolledClasses = enrolledClassesResponse?.data ?? [];
  const completedClasses = completedClassesResponse?.data ?? [];

  console.log({ enrolledClasses, recommendedClasses, user });
  if (isLoading || enrolledClassesLoading || completedClassesLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kidato-purple"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <StudentDashboardHeader userName={user.fullName} />

        {/* Content */}
        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
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
