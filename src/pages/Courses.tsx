
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
import { 
  mockTeachers, 
  mockRecommendedCourses, 
  mockEnrolledCourses, 
  mockCompletedCourses 
} from "@/components/courses/CourseData";

const Courses = () => {
  const [userName] = useState("John Doe");
  const [selectedTab, setSelectedTab] = useState("enrolled");
  const [filterOpen, setFilterOpen] = useState(false);

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
                <Button className="bg-kidato-blue hover:bg-kidato-dark-blue">
                  Browse New Classes
                </Button>
              </div>
            </div>
            
            {/* Course Tabs */}
            <Tabs defaultValue="enrolled" className="mb-8" onValueChange={setSelectedTab}>
              <TabsList className="mb-6 bg-blue-50/50 p-1 border border-blue-100">
                <TabsTrigger value="enrolled" className="data-[state=active]:bg-white data-[state=active]:text-kidato-blue data-[state=active]:shadow-sm rounded-md">
                  Enrolled Classes
                </TabsTrigger>
                <TabsTrigger value="matching" className="data-[state=active]:bg-white data-[state=active]:text-kidato-blue data-[state=active]:shadow-sm rounded-md">
                  Matching Classes & Teachers
                </TabsTrigger>
              </TabsList>
              
              {/* Enrolled Courses Table */}
              <TabsContent value="enrolled">
                <div className="mb-8">
                  <EnrolledClassesTable enrolledCourses={mockEnrolledCourses} />
                  <CompletedClassesTable completedCourses={mockCompletedCourses} />
                </div>
              </TabsContent>
              
              {/* Matching Classes & Teachers Cards */}
              <TabsContent value="matching">
                <MatchingClassesSection 
                  recommendedCourses={mockRecommendedCourses} 
                  matchingTeachers={mockTeachers} 
                />
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
