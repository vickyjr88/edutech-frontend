import { BookOpen } from "lucide-react";
import ParentLayout from "@/components/parents/ParentLayout";

const ParentsCourses = () => {
  return (
    <ParentLayout>
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6 text-kidato-purple" />
        <h1 className="text-2xl font-bold">Courses</h1>
      </div>
      
      {/* Courses content will go here */}
      <div className="grid gap-6">
        {/* Add your courses components here */}
      </div>
    </ParentLayout>
  );
};

export default ParentsCourses;