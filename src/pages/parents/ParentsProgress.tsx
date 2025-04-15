
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { GraduationCap } from "lucide-react";

const ParentsProgress = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />
      
      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName="Kate Johnson" />
        
        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-6 w-6 text-kidato-blue" />
              <h1 className="text-2xl font-bold">Progress</h1>
            </div>
            
            {/* Progress content will go here */}
            <div className="grid gap-6">
              {/* Add your progress components here */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParentsProgress;
