
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProgressOverview from "@/components/progress/ProgressOverview";
import ProgressLessons from "@/components/progress/ProgressLessons";
import ProgressQuizzes from "@/components/progress/ProgressQuizzes";
import ProgressAssignments from "@/components/progress/ProgressAssignments";

const CourseProgress = () => {
  const { courseId } = useParams();
  const [userName] = useState("John Doe");
  
  // Handle the case where courseId might be the string "undefined"
  const validCourseId = courseId && courseId !== 'undefined' ? courseId : undefined;

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <StudentDashboardHeader userName={userName} />

        {/* Content */}
        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <Link to="/courses">
                <Button variant="ghost" className="mb-2 -ml-3 text-gray-600">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back to Courses
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Course Progress</h1>
              <p className="text-gray-600">Track your learning journey</p>
            </div>

            <Tabs defaultValue="lessons" className="mb-8">
              <TabsList className="mb-6 bg-blue-50/50 p-1 border border-blue-100">
                <TabsTrigger 
                  value="lessons" 
                  className="data-[state=active]:bg-white data-[state=active]:text-kidato-purple data-[state=active]:shadow-sm rounded-md"
                >
                  Lessons
                </TabsTrigger>
                <TabsTrigger 
                  value="assignments" 
                  className="data-[state=active]:bg-white data-[state=active]:text-kidato-purple data-[state=active]:shadow-sm rounded-md"
                >
                  Assignments
                </TabsTrigger>
                <TabsTrigger 
                  value="quizzes" 
                  className="data-[state=active]:bg-white data-[state=active]:text-kidato-purple data-[state=active]:shadow-sm rounded-md"
                >
                  Quizzes
                </TabsTrigger>
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-white data-[state=active]:text-kidato-purple data-[state=active]:shadow-sm rounded-md"
                >
                  Overview
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="lessons">
                <ProgressLessons courseId={validCourseId} />
              </TabsContent>
              
              <TabsContent value="assignments">
                <ProgressAssignments courseId={validCourseId} />
              </TabsContent>
              
              <TabsContent value="quizzes">
                <ProgressQuizzes courseId={validCourseId} />
              </TabsContent>
              
              <TabsContent value="overview">
                <ProgressOverview courseId={validCourseId} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Kidato AI Mascot */}
      <KidatoMascot />
    </div>
  );
};

export default CourseProgress;
